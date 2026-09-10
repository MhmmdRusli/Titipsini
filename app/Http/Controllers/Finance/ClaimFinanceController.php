<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use App\Models\Notifikasi;
use App\Models\Order;
use App\Models\SaldoMutasi;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ClaimFinanceController extends Controller
{
    /**
     * List claims ready for finance processing (disetujui).
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'disetujui');
        $search = trim((string) $request->query('search', ''));

        $query = Claim::query()
            ->whereIn('status', ['disetujui', 'diproses_finance', 'refund_berhasil'])
            ->with([
                'order:id,order_code,customer_id,partner_id,total_price,status,service_type,item_name',
                'order.customer:id,name,email,saldo',
                'order.partner:id,name,email',
                'adminValidator:id,name',
                'superAdmin:id,name',
                'financeProcessor:id,name',
            ])
            ->when($status !== 'semua', fn ($q) => $q->where('status', $status))
            ->when($search !== '', function ($q) use ($search) {
                $q->whereHas('order', function ($oq) use ($search) {
                    $oq->where('order_code', 'like', "%{$search}%")
                        ->orWhereHas('customer', fn ($cq) => $cq->where('name', 'like', "%{$search}%"));
                });
            })
            ->latest();

        $claims = $query->paginate(10)->withQueryString()->through(fn (Claim $c) => $this->serialize($c));

        $summary = [
            'siap_diproses' => Claim::where('status', 'disetujui')->count(),
            'diproses' => Claim::where('status', 'diproses_finance')->count(),
            'refund_berhasil' => Claim::where('status', 'refund_berhasil')->count(),
            'total_nilai_refund' => (float) Order::whereNotNull('refunded_at')->sum('refund_amount'),
        ];

        return Inertia::render('Finance/Claims/Index', [
            'claims' => $claims,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'summary' => $summary,
        ]);
    }

    /**
     * Show claim detail for finance processing.
     */
    public function show(Claim $claim): Response
    {
        $claim->load([
            'order.customer', 
            'order.partner', 
            'order.kondisiAwal',
            'customer', 
            'mitra', 
            'adminValidator',
            'superAdmin',
            'financeProcessor'
        ]);

        return Inertia::render('Finance/Claims/Show', [
            'claim' => $this->serialize($claim, withOrder: true),
        ]);
    }

    /**
     * Finance starts processing refund.
     */
    public function proses(Request $request, Claim $claim): RedirectResponse
    {
        abort_unless($claim->status === 'disetujui', 400, 'Hanya klaim status disetujui yang bisa diproses.');

        $claim->update([
            'status' => 'diproses_finance',
            'finance_processor_id' => Auth::id(),
            'finance_processed_at' => now(),
        ]);

        // Notifikasi ke Customer
        if ($claim->customer_id) {
            Notifikasi::create([
                'user_id' => $claim->customer_id,
                'order_id' => $claim->order_id,
                'type' => 'claim_diproses_finance',
                'judul' => 'Refund Sedang Diproses Finance',
                'pesan' => "Refund untuk Order #{$claim->order?->order_code} sedang diproses oleh finance. Dana akan segera masuk ke saldo Anda.",
            ]);
        }

        return back()->with('success', 'Refund sedang diproses. Klik "Selesaikan Refund" setelah dana dikirim.');
    }

    /**
     * Finance completes refund - transfer to customer saldo.
     */
    public function selesaikan(Request $request, Claim $claim): RedirectResponse
    {
        abort_unless($claim->status === 'diproses_finance', 400, 'Hanya klaim yang sedang diproses yang bisa diselesaikan.');

        $validated = $request->validate([
            'finance_catatan' => ['nullable', 'string', 'max:1000'],
        ]);

        $order = $claim->order;
        abort_unless($order, 404);
        abort_if($order->sudahDirefund(), 400, 'Order ini sudah pernah di-refund sebelumnya.');

        $percentage = $claim->persentase_refund;
        $amount = $claim->jumlah_refund;
        $finance = Auth::user();

        DB::transaction(function () use ($claim, $order, $amount, $percentage, $finance, $validated) {
            $order->update([
                'refund_percentage' => $percentage,
                'refund_amount' => $amount,
                'refund_reason' => $claim->alasan,
                'refunded_at' => now(),
                'refunded_by' => $finance->id,
            ]);

            // Credit customer saldo
            $order->customer()->increment('saldo', $amount);

            // Deduct from mitra saldo (refund_deduction)
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

            $claim->update([
                'status'      => 'refund_berhasil',
                'finance_catatan' => $validated['finance_catatan'],
            ]);

            // Notifikasi ke Customer
            if ($claim->customer_id) {
                Notifikasi::create([
                    'user_id' => $claim->customer_id,
                    'order_id' => $claim->order_id,
                    'type' => 'refund_berhasil',
                    'judul' => 'Refund Berhasil',
                    'pesan' => 'Refund sebesar Rp' . number_format($amount, 0, ',', '.') . ' untuk pesanan ' . $order->order_code . ' telah masuk ke saldo kamu.',
                ]);
            }

            // Notifikasi ke Mitra
            if ($claim->mitra_id) {
                $pesanMitra = "Order #{$order->order_code} di-refund {$percentage}% (Rp" . number_format($amount, 0, ',', '.') . ') ke customer. Saldo kamu telah disesuaikan.';

                $utang = 0;
                if ($order->partner) {
                    $utang = $order->partner->utangRefund();
                }
                if ($utang > 0) {
                    $pesanMitra .= ' Karena dana sudah pernah kamu tarik sebelumnya, tercatat utang Rp' . number_format($utang, 0, ',', '.') . ' yang akan dipotong otomatis dari penarikan berikutnya.';
                }

                Notifikasi::create([
                    'user_id' => $claim->mitra_id,
                    'order_id' => $claim->order_id,
                    'type' => 'refund_berhasil',
                    'judul' => 'Penyesuaian Saldo - Refund Selesai',
                    'pesan' => $pesanMitra,
                ]);
            }

            // Notifikasi ke SuperAdmin jika dari sengketa
            if ($claim->super_admin_id) {
                Notifikasi::create([
                    'user_id' => $claim->super_admin_id,
                    'order_id' => $claim->order_id,
                    'type' => 'claim_refund_selesai',
                    'judul' => 'Refund Sengketa Selesai Diproses',
                    'pesan' => "Refund untuk Order #{$order->order_code} (keputusan Super Admin) telah selesai diproses finance.",
                ]);
            }

            // Notifikasi ke Admin validator
            if ($claim->admin_validator_id && $claim->admin_validator_id !== $claim->super_admin_id) {
                Notifikasi::create([
                    'user_id' => $claim->admin_validator_id,
                    'order_id' => $claim->order_id,
                    'type' => 'claim_refund_selesai',
                    'judul' => 'Refund Klaim Selesai Diproses',
                    'pesan' => "Refund untuk Order #{$order->order_code} telah selesai diproses finance.",
                ]);
            }
        });

        return back()->with('success', 'Refund Rp' . number_format($amount, 0, ',', '.') . ' berhasil diproses dan dikreditkan ke saldo customer.');
    }

    protected function serialize(Claim $claim, bool $withOrder = false): array
    {
        $order = $claim->order;

        $base = [
            'id' => $claim->id,
            'status' => $claim->status,
            'status_label' => $claim->status_label,
            'alasan' => $claim->alasan,
            'foto_urls' => $claim->foto_urls,
            'jumlah_klaim' => $claim->jumlah_klaim ? (float) $claim->jumlah_klaim : null,
            'persentase_refund' => $claim->persentase_refund,
            'jumlah_refund' => $claim->jumlah_refund ? (float) $claim->jumlah_refund : null,
            'admin_catatan' => $claim->admin_catatan,
            'admin_validated_at' => $claim->admin_validated_at?->format('d M Y H:i'),
            'admin_validator_name' => $claim->adminValidator?->name,
            'mitra_klarifikasi' => $claim->mitra_klarifikasi,
            'mitra_foto_urls' => $claim->mitra_foto_urls,
            'mitra_responded_at' => $claim->mitra_responded_at?->format('d M Y H:i'),
            'super_admin_keputusan' => $claim->super_admin_keputusan,
            'super_admin_decided_at' => $claim->super_admin_decided_at?->format('d M Y H:i'),
            'super_admin_name' => $claim->superAdmin?->name,
            'finance_processor_name' => $claim->financeProcessor?->name,
            'finance_processed_at' => $claim->finance_processed_at?->format('d M Y H:i'),
            'finance_catatan' => $claim->finance_catatan,
            'created_at' => $claim->created_at?->format('d M Y H:i'),
            'customer_name' => $claim->customer?->name,
            'mitra_name' => $claim->mitra?->name,
            'order_id' => $order?->id,
            'order_code' => $order?->order_code,
            'item_name' => $order?->item_name,
            'service_type' => $order?->service_type,
            'total_price' => $order?->total_price !== null ? (float) $order->total_price : null,
        ];

        if ($withOrder && $order) {
            $base['kondisi_awal'] = $order->kondisiAwal ? [
                'foto_urls' => $order->kondisiAwal->foto_urls,
                'catatan' => $order->kondisiAwal->catatan,
                'dokumentasi_at' => $order->kondisiAwal->dokumentasi_at?->format('d M Y H:i'),
            ] : null;
            
            $base['order'] = [
                'id' => $order->id,
                'order_code' => $order->order_code,
                'item_name' => $order->item_name,
                'service_type' => $order->service_type,
                'total_price' => (float) $order->total_price,
                'status' => $order->status,
                'customer' => [
                    'name' => $order->customer?->name,
                    'email' => $order->customer?->email,
                    'phone' => $order->customer?->phone,
                    'saldo' => $order->customer?->saldo,
                ],
                'partner' => [
                    'name' => $order->partner?->name,
                    'email' => $order->partner?->email,
                    'phone' => $order->partner?->phone,
                ],
            ];
        }

        return $base;
    }
}