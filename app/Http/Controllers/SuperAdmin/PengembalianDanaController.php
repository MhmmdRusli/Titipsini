<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\Order;
use App\Models\Report;
use App\Models\SaldoMutasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PengembalianDanaController extends Controller
{
    /**
     * Persentase default refund untuk estimasi UI. Nilai aktual yang dipakai
     * saat approve diambil dari input form (mode percent/nominal) - lihat
     * method setujui() di bawah.
     */
    protected const PERSEN_DEFAULT_ESTIMASI = 60;

    public function index(Request $request): Response
    {
        $status = $request->query('status', 'semua');
        $search = trim((string) $request->query('search', ''));

        $query = Report::query()
            ->where('category', 'kerugian')
            // Untuk finance/super-admin: tampilkan laporan yang SUDAH lewat
            // verifikasi admin (approved/rejected) atau sudah final. Laporan
            // yang masih admin_approval='pending' ditangani oleh Admin Validasi.
            ->whereIn('admin_approval', ['approved', 'rejected'])
            ->with([
                'order:id,order_code,customer_id,partner_id,total_price,status,service_type,item_name',
                'order.customer:id,name,email,saldo',
                'order.partner:id,name,email',
                'reviewer:id,name',
                'adminApprover:id,name',
            ])
            ->when($search !== '', function ($q) use ($search) {
                $q->whereHas('order', function ($orderQuery) use ($search) {
                    $orderQuery->where('order_code', 'like', "%{$search}%")
                        ->orWhereHas('customer', fn ($c) => $c->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($status !== 'semua', fn ($q) => $q->where('status', $status));

        $reports = $query->latest()->paginate(10)->withQueryString()->through(function (Report $report) {
            $order = $report->order;
            $refundEstimasi = $order ? round((float) $order->total_price * self::PERSEN_DEFAULT_ESTIMASI / 100) : 0;

            return [
                'id' => $report->id,
                'order_id' => $report->order_id,
                'order_code' => $order?->order_code,
                'customer' => $order?->customer,
                'partner' => $order?->partner,
                'description' => $report->description,
                'evidence_url' => $report->evidence_url,
                'status' => $report->status,
                'admin_approval' => $report->admin_approval,
                'admin_approver_name' => $report->adminApprover?->name,
                'admin_approval_at' => $report->admin_approval_at?->format('d M Y H:i'),
                'admin_approval_note' => $report->admin_approval_note,
                'refund_estimasi' => $refundEstimasi,
                'refund_amount' => $order?->refund_amount ? (float) $order->refund_amount : null,
                'refund_percentage' => $order?->refund_percentage,
                'refund_reason' => $order?->refund_reason,
                'total_price' => $order?->total_price !== null ? (float) $order->total_price : null,
                'admin_note' => $report->admin_note,
                'reviewer' => $report->reviewer?->name,
                'reviewed_at' => $report->reviewed_at?->format('d M Y H:i'),
                'created_at' => $report->created_at?->format('d M Y H:i'),
            ];
        });

        $view = $request->routeIs('finance.*')
            ? 'Finance/PengembalianDana/Index'
            : 'SuperAdmin/PengembalianDana/Index';

        return Inertia::render($view, [
            'refunds' => $reports,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'summary' => [
                'siap_refund' => Report::where('category', 'kerugian')->where('admin_approval', 'approved')->where('status', 'siap_refund')->count(),
                'disetujui' => Report::where('category', 'kerugian')->where('status', 'disetujui')->count(),
                'ditolak' => Report::where('category', 'kerugian')->where('status', 'ditolak')->count(),
                'totalNilai' => (float) Order::whereNotNull('refunded_at')->sum('refund_amount'),
            ],
            'persenRefund' => self::PERSEN_DEFAULT_ESTIMASI,
            'hasAnyRefundDebt' => (bool) Order::whereNotNull('refund_amount')->where('refund_amount', '>', 0)->exists(),
        ]);
    }

    /**
     * PATCH /super-admin/pengembalian-dana/{report}/setujui
     *
     * Refund otomatis 60% dari total order.
     */
    public function setujui(Request $request, Report $report): RedirectResponse
    {
        abort_unless($report->category === 'kerugian', 404,
            'Action ini hanya untuk laporan Kerugian / Refund.');

        if ($report->status !== 'siap_refund') {
            return back()->with('error', 'Laporan ini belum disetujui admin atau sudah diproses.');
        }

        if ($report->admin_approval !== 'approved') {
            return back()->with('error', 'Laporan belum diverifikasi admin. Finance tidak dapat memproses refund sampai admin approve.');
        }

        $order = $report->order;
        abort_unless($order, 404);

        if ($order->sudahDirefund()) {
            return back()->with('error', 'Order ini sudah pernah di-refund sebelumnya.');
        }

        $total = (float) $order->total_price;
        if ($total <= 0) {
            return back()->with('error', 'Order ini tidak memiliki total pembayaran.');
        }

        $percentage = 60;
        $amount = round($total * $percentage / 100, 2);

        $admin = Auth::user();

        DB::transaction(function () use ($report, $order, $amount, $percentage, $admin) {
            $order->update([
                'refund_percentage' => $percentage,
                'refund_amount'     => $amount,
                'refund_reason'     => $report->description,
                'refunded_at'       => now(),
                'refunded_by'       => $admin->id,
            ]);

            $order->customer()->increment('saldo', $amount);

            if ($order->partner_id) {
                SaldoMutasi::create([
                    'user_id'        => $order->partner_id,
                    'type'           => 'refund_deduction',
                    'jumlah'         => -$amount,
                    'deskripsi'      => "Refund order #{$order->order_code} ({$percentage}%) ke customer.",
                    'reference_type' => Order::class,
                    'reference_id'   => $order->id,
                ]);
            }

            $report->update([
                'status'      => 'disetujui',
                'reviewed_by' => $admin->id,
                'reviewed_at' => now(),
            ]);

            if ($order->customer_id) {
                Notifikasi::create([
                    'user_id' => $order->customer_id,
                    'order_id' => $order->id,
                    'type' => 'refund_disetujui',
                    'judul' => 'Refund Disetujui',
                    'pesan' => 'Refund sebesar Rp'.number_format($amount, 0, ',', '.').' untuk pesanan '.$order->order_code.' telah masuk ke saldo kamu.',
                ]);
            }

            if ($order->partner_id) {
                $pesanMitra = "Order #{$order->order_code} di-refund {$percentage}% (Rp".number_format($amount, 0, ',', '.').') ke customer. Saldo kamu telah disesuaikan.';

                $utang = 0;
                if ($order->partner) {
                    $utang = $order->partner->utangRefund();
                }
                if ($utang > 0) {
                    $pesanMitra .= ' Karena dana sudah pernah kamu tarik sebelumnya, tercatat utang Rp'.number_format($utang, 0, ',', '.').' yang akan dipotong otomatis dari penarikan berikutnya.';
                }

                Notifikasi::create([
                    'user_id' => $order->partner_id,
                    'order_id' => $order->id,
                    'type' => 'refund_diproses',
                    'judul' => 'Penyesuaian Saldo - Refund',
                    'pesan' => $pesanMitra,
                ]);
            }
        });

        return back()->with('success', 'Refund Rp'.number_format($amount, 0, ',', '.').' berhasil disetujui dan dikreditkan ke saldo customer.');
    }

    /**
     * PATCH /super-admin/pengembalian-dana/{report}/tolak
     */
    public function tolak(Request $request, Report $report): RedirectResponse
    {
        abort_unless($report->category === 'kerugian', 404,
            'Action ini hanya untuk laporan Kerugian / Refund.');

        if ($report->status !== 'siap_refund') {
            return back()->with('error', 'Laporan ini belum disetujui admin atau sudah diproses.');
        }

        if ($report->admin_approval !== 'approved') {
            return back()->with('error', 'Laporan belum diverifikasi admin. Finance tidak dapat menolak laporan yang belum di-approve admin.');
        }

        $validated = $request->validate([
            'admin_note' => ['required', 'string', 'max:500'],
        ]);

        $report->update([
            'status' => 'ditolak',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
            'admin_note' => $validated['admin_note'],
        ]);

        if ($report->order?->customer_id) {
            Notifikasi::create([
                'user_id' => $report->order->customer_id,
                'order_id' => $report->order_id,
                'type' => 'refund_ditolak',
                'judul' => 'Laporan Ditolak',
                'pesan' => 'Laporan kamu untuk pesanan '.$report->order->order_code.' ditolak. Alasan: '.$validated['admin_note'],
            ]);
        }

        return back()->with('success', 'Laporan ditolak.');
    }
}