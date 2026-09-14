<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ValidasiLaporanController extends Controller
{
    /**
     * GET /admin/laporan-validasi
     *
     * Halaman khusus ADMIN untuk verifikasi laporan Kerugian Barang sebelum
     * diteruskan ke Finance untuk proses refund.
     *
     * Alur 2-tier:
     *   1. Customer submit laporan -> status 'menunggu', admin_approval='pending'
     *   2. Admin verifikasi data + foto -> admin_approval='approved' / 'rejected'
     *      Bila approved -> status='siap_refund' (siap diproses finance)
     *      Bila rejected -> status='ditolak' (final)
     *   3. Finance proses nominal/persen -> status='disetujui' (final)
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'semua');
        $search = trim((string) $request->query('search', ''));

        $query = Report::query()
            ->where('category', 'kerugian')
            ->with([
                'order:id,order_code,customer_id,partner_id,total_price,service_type,item_name',
                'order.customer:id,name,email',
                'order.partner:id,name',
                'adminApprover:id,name',
                'reviewer:id,name',
            ])
            ->when($status !== 'semua', fn ($q) => $q->where('admin_approval', $status))
            ->when($search !== '', function ($q) use ($search) {
                $q->whereHas('order', function ($oq) use ($search) {
                    $oq->where('order_code', 'like', "%{$search}%")
                        ->orWhereHas('customer', fn ($cq) => $cq->where('name', 'like', "%{$search}%"))
                        ->orWhere('item_name', 'like', "%{$search}%");
                });
            })
            ->latest();

        $reports = $query->paginate(10)->withQueryString()->through(fn (Report $r) => $this->serialize($r));

        $summary = [
            'pending'  => Report::where('category', 'kerugian')->where('admin_approval', 'pending')->count(),
            'approved' => Report::where('category', 'kerugian')->where('admin_approval', 'approved')->count(),
            'rejected' => Report::where('category', 'kerugian')->where('admin_approval', 'rejected')->count(),
            'total'    => Report::where('category', 'kerugian')->count(),
        ];

        return Inertia::render('Admin/LaporanValidasi/Index', [
            'reports' => $reports,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'summary' => $summary,
        ]);
    }

    /**
     * GET /admin/laporan-validasi/{report}
     */
    public function show(Report $report): Response
    {
        abort_unless($report->category === 'kerugian', 404,
            'Halaman validasi khusus laporan Kerugian / Refund.');

        $report->load(['order.customer', 'order.partner', 'order.service', 'order.kondisiAwal', 'adminApprover', 'reviewer']);

        return Inertia::render('Admin/LaporanValidasi/Show', [
            'report' => $this->serialize($report, withOrder: true),
        ]);
    }

    /**
     * PATCH /admin/laporan-validasi/{report}/approve
     *
     * Admin menyatakan data + bukti foto valid. Laporan akan diteruskan ke
     * Finance untuk proses refund.
     */
    public function approve(Request $request, Report $report): RedirectResponse
    {
        abort_unless($report->category === 'kerugian', 404);
        abort_if($report->admin_approval !== 'pending', 400,
            'Laporan ini sudah diverifikasi sebelumnya.');

        $data = $request->validate([
            'admin_approval_note' => ['nullable', 'string', 'max:1000'],
        ]);

        $admin = Auth::user();

        $report->update([
            'admin_approval'      => 'approved',
            'admin_approval_by'   => $admin->id,
            'admin_approval_at'   => now(),
            'admin_approval_note' => $data['admin_approval_note'] ?? null,
            'status'              => 'siap_refund',
        ]);

        // Notifikasi customer bahwa laporan sedang diteruskan ke finance.
        if ($report->order?->customer_id) {
            Notifikasi::create([
                'user_id' => $report->order->customer_id,
                'order_id' => $report->order_id,
                'type'    => 'report_admin_approved',
                'judul'   => 'Laporan Kerugian Diteruskan',
                'pesan'   => 'Laporan kerugian kamu telah diverifikasi oleh admin dan diteruskan ke finance untuk proses refund.',
            ]);
        }

        // Notifikasi semua finance agar mereka tahu ada laporan yang siap refund.
        $financeIds = \App\Models\User::where('role', 'finance')->pluck('id');
        foreach ($financeIds as $fid) {
            Notifikasi::create([
                'user_id' => $fid,
                'order_id' => $report->order_id,
                'type'    => 'refund_ready_for_finance',
                'judul'   => 'Laporan Siap Diproses',
                'pesan'   => "Order #{$report->order?->order_code} sudah diverifikasi admin, silakan proses refund.",
            ]);
        }

        return back()->with('success', 'Laporan diverifikasi. Diteruskan ke Finance untuk proses refund.');
    }

    /**
     * PATCH /admin/laporan-validasi/{report}/reject
     */
    public function reject(Request $request, Report $report): RedirectResponse
    {
        abort_unless($report->category === 'kerugian', 404);
        abort_if($report->admin_approval !== 'pending', 400,
            'Laporan ini sudah diverifikasi sebelumnya.');

        $data = $request->validate([
            'admin_approval_note' => ['required', 'string', 'max:1000'],
        ]);

        $admin = Auth::user();

        $report->update([
            'admin_approval'      => 'rejected',
            'admin_approval_by'   => $admin->id,
            'admin_approval_at'   => now(),
            'admin_approval_note' => $data['admin_approval_note'],
            'status'              => 'ditolak',
        ]);

        // Notifikasi customer.
        if ($report->order?->customer_id) {
            Notifikasi::create([
                'user_id' => $report->order->customer_id,
                'order_id' => $report->order_id,
                'type'    => 'report_rejected_by_admin',
                'judul'   => 'Laporan Tidak Lolos Verifikasi',
                'pesan'   => 'Laporan kerugian kamu tidak lolos verifikasi admin. Alasan: '.$data['admin_approval_note'],
            ]);
        }

        return back()->with('success', 'Laporan ditolak dan customer sudah dinotifikasi.');
    }

    protected function serialize(Report $r, bool $withOrder = false): array
    {
        $order = $r->order;

        $base = [
            'id'                   => $r->id,
            'category'             => $r->category,
            'description'          => $r->description,
            'evidence_url'         => $r->evidence_url,
            'status'               => $r->status,
            'admin_approval'       => $r->admin_approval,
            'admin_approval_by'    => $r->admin_approval_by,
            'admin_approval_at'    => $r->admin_approval_at?->format('d M Y H:i'),
            'admin_approval_note'  => $r->admin_approval_note,
            'admin_approver_name'  => $r->adminApprover?->name,
            'admin_note'           => $r->admin_note,
            'reviewer_name'        => $r->reviewer?->name,
            'reviewed_at'          => $r->reviewed_at?->format('d M Y H:i'),
            'created_at'           => $r->created_at?->format('d M Y H:i'),
            'order_id'             => $order?->id,
            'order_code'           => $order?->order_code,
            'item_name'            => $order?->item_name,
            'service_type'         => $order?->service_type,
            'customer_name'        => $order?->customer?->name,
            'partner_name'         => $order?->partner?->name,
            'total_price'          => $order?->total_price !== null ? (float) $order->total_price : null,
        ];

        if ($withOrder && $order) {
            $base['refund'] = [
                'percentage' => $order->refund_percentage,
                'amount'     => $order->refund_amount !== null ? (float) $order->refund_amount : null,
                'reason'     => $order->refund_reason,
                'refunded_at' => $order->refunded_at?->format('d M Y H:i'),
                'sudah'      => $order->sudahDirefund(),
            ];

            $kondisiAwal = $order->kondisiAwal;
            $base['kondisi_awal'] = $kondisiAwal ? [
                'foto_urls' => $kondisiAwal->foto_urls,
                'catatan'   => $kondisiAwal->catatan,
                'dokumentasi_at' => $kondisiAwal->dokumentasi_at?->format('d M Y H:i'),
            ] : null;
        }

        return $base;
    }
}
