<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    /**
     * GET /super-admin/laporan-layanan
     *
     * Halaman KHUSUS untuk laporan Komplain Pelayanan (category='complain').
     * Tidak ada tab, tidak ada refund - hanya update status + catatan admin.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'semua');
        $search = trim((string) $request->query('search', ''));

        $query = Report::query()
            ->where('category', 'complain')
            ->with([
                'order:id,order_code,customer_id,partner_id,service_type,item_name',
                'order.customer:id,name',
                'order.partner:id,name',
                'reviewer:id,name',
            ])
            ->when($status !== 'semua', fn ($q) => $q->where('status', $status))
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
            'total'           => Report::where('category', 'complain')->count(),
            'menunggu'        => Report::where('category', 'complain')->where('status', 'menunggu')->count(),
            'diproses'        => Report::where('category', 'complain')->where('status', 'diproses')->count(),
            'selesai'         => Report::where('category', 'complain')->where('status', 'selesai')->count(),
            'ditolak'         => Report::where('category', 'complain')->where('status', 'ditolak')->count(),
        ];

        return Inertia::render('SuperAdmin/Laporan/Index', [
            'reports' => $reports,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'summary' => $summary,
        ]);
    }

    /**
     * GET /super-admin/laporan-layanan/{report}
     */
    public function show(Report $report): Response
    {
        abort_unless($report->category === 'complain', 404,
            'Halaman ini khusus untuk laporan Komplain Pelayanan. Gunakan halaman Pengembalian Dana untuk kerugian.');

        $report->load(['order.customer', 'order.partner', 'reviewer']);

        return Inertia::render('SuperAdmin/Laporan/Show', [
            'report' => $this->serialize($report),
        ]);
    }

    /**
     * PATCH /super-admin/laporan-layanan/{report}/status
     */
    public function updateStatus(Request $request, Report $report): RedirectResponse
    {
        abort_unless($report->category === 'complain', 404);

        $data = $request->validate([
            'status'     => ['required', Rule::in(['diproses', 'selesai', 'ditolak'])],
            'admin_note' => ['required_if:status,ditolak', 'nullable', 'string', 'max:1000'],
        ]);

        $report->update([
            'status'      => $data['status'],
            'admin_note'  => $data['admin_note'] ?? null,
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        if ($report->order?->customer_id) {
            Notifikasi::create([
                'user_id' => $report->order->customer_id,
                'order_id' => $report->order_id,
                'type'    => 'report_updated',
                'judul'   => 'Update Laporan Pelayanan',
                'pesan'   => "Status laporan kamu: {$data['status']}.",
            ]);
        }

        return back()->with('success', 'Status laporan pelayanan berhasil diperbarui.');
    }

    protected function serialize(Report $r): array
    {
        $order = $r->order;

        return [
            'id'             => $r->id,
            'category'       => $r->category,
            'description'    => $r->description,
            'evidence_url'   => $r->evidence_url,
            'status'         => $r->status,
            'admin_note'     => $r->admin_note,
            'created_at'     => $r->created_at?->format('d M Y H:i'),
            'reviewer_name'  => $r->reviewer?->name,
            'reviewed_at'    => $r->reviewed_at?->format('d M Y H:i'),
            'order_id'       => $order?->id,
            'order_code'     => $order?->order_code,
            'item_name'      => $order?->item_name,
            'service_type'   => $order?->service_type,
            'customer_name'  => $order?->customer?->name,
            'partner_name'   => $order?->partner?->name,
        ];
    }
}
