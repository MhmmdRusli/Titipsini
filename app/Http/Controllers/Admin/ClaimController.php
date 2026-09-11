<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use App\Models\Notifikasi;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ClaimController extends Controller
{
    /**
     * List claims waiting for admin validation.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'menunggu_pemeriksaan_admin');
        $search = trim((string) $request->query('search', ''));

        $query = Claim::query()
            ->whereIn('status', ['klaim_diajukan', 'menunggu_pemeriksaan_admin', 'menunggu_klarifikasi_mitra', 'sengketa'])
            ->with([
                'order:id,order_code,customer_id,partner_id,total_price,status,service_type,item_name',
                'order.customer:id,name,email',
                'order.partner:id,name,email',
                'customer:id,name',
                'mitra:id,name',
                'adminValidator:id,name',
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
            'klaim_diajukan' => Claim::where('status', 'klaim_diajukan')->count(),
            'menunggu_pemeriksaan_admin' => Claim::where('status', 'menunggu_pemeriksaan_admin')->count(),
            'menunggu_klarifikasi_mitra' => Claim::where('status', 'menunggu_klarifikasi_mitra')->count(),
            'sengketa' => Claim::where('status', 'sengketa')->count(),
            'total' => Claim::whereIn('status', ['klaim_diajukan', 'menunggu_pemeriksaan_admin', 'menunggu_klarifikasi_mitra', 'sengketa'])->count(),
        ];

        return Inertia::render('Admin/Claims/Index', [
            'claims' => $claims,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'summary' => $summary,
        ]);
    }

    /**
     * Show claim detail for admin validation.
     */
    public function show(Claim $claim): Response
    {
        $claim->load([
            'order.customer', 
            'order.partner', 
            'order.kondisiAwal',
            'customer', 
            'mitra', 
            'adminValidator'
        ]);

        return Inertia::render('Admin/Claims/Show', [
            'claim' => $this->serialize($claim, withOrder: true),
        ]);
    }

    /**
     * Admin starts validation - moves to menunggu_pemeriksaan_admin.
     */
    public function mulaiPemeriksaan(Request $request, Claim $claim): RedirectResponse
    {
        abort_if($claim->status !== 'klaim_diajukan', 400, 'Klaim ini sudah dalam proses pemeriksaan.');

        $claim->update([
            'status' => 'menunggu_pemeriksaan_admin',
            'admin_validator_id' => Auth::id(),
            'admin_validated_at' => now(),
        ]);

        // Notifikasi ke Mitra untuk klarifikasi
        if ($claim->mitra_id) {
            Notifikasi::create([
                'user_id' => $claim->mitra_id,
                'order_id' => $claim->order_id,
                'type' => 'claim_klarifikasi_diminta',
                'judul' => 'Diminta Klarifikasi Klaim',
                'pesan' => "Admin meminta klarifikasi untuk klaim pada Order #{$claim->order?->order_code}. Silakan berikan penjelasan/bukti Anda.",
            ]);
        }

        // Notifikasi ke Customer
        if ($claim->customer_id) {
            Notifikasi::create([
                'user_id' => $claim->customer_id,
                'order_id' => $claim->order_id,
                'type' => 'claim_diperiksa_admin',
                'judul' => 'Klaim Sedang Diperiksa Admin',
                'pesan' => "Klaim Anda untuk Order #{$claim->order?->order_code} sedang diperiksa oleh admin.",
            ]);
        }

        return back()->with('success', 'Pemeriksaan dimulai. Mitra diminta memberikan klarifikasi.');
    }

    /**
     * Admin approves claim after review - moves to disetujui.
     */
    public function setujui(Request $request, Claim $claim): RedirectResponse
    {
        abort_unless(in_array($claim->status, ['menunggu_pemeriksaan_admin', 'menunggu_klarifikasi_mitra', 'sengketa']), 400,
            'Klaim tidak bisa disetujui pada status ini.');

        $validated = $request->validate([
            'persentase_refund' => ['required', 'integer', 'min:1', 'max:100'],
            'admin_catatan' => ['nullable', 'string', 'max:1000'],
        ]);

        $order = $claim->order;
        abort_unless($order, 404);
        abort_if($order->sudahDirefund(), 400, 'Order ini sudah pernah di-refund sebelumnya.');

        $total = (float) $order->total_price;
        $percentage = (int) $validated['persentase_refund'];
        $amount = round($total * $percentage / 100, 2);

        $claim->update([
            'status' => 'disetujui',
            'persentase_refund' => $percentage,
            'jumlah_refund' => $amount,
            'admin_catatan' => $validated['admin_catatan'],
            'admin_validator_id' => Auth::id(),
            'admin_validated_at' => now(),
        ]);

        // Update order with refund info (but not processed yet)
        $order->update([
            'refund_percentage' => $percentage,
            'refund_amount' => $amount,
            'refund_reason' => $claim->alasan,
        ]);

        // Notifikasi ke Customer
        if ($claim->customer_id) {
            Notifikasi::create([
                'user_id' => $claim->customer_id,
                'order_id' => $claim->order_id,
                'type' => 'claim_disetujui',
                'judul' => 'Klaim Disetujui',
                'pesan' => "Klaim Anda untuk Order #{$order->order_code} disetujui dengan refund {$percentage}% (Rp" . number_format($amount, 0, ',', '.') . "). Menunggu proses finance.",
            ]);
        }

        // Notifikasi ke Mitra
        if ($claim->mitra_id) {
            Notifikasi::create([
                'user_id' => $claim->mitra_id,
                'order_id' => $claim->order_id,
                'type' => 'claim_disetujui',
                'judul' => 'Klaim Disetujui Admin',
                'pesan' => "Klaim untuk Order #{$order->order_code} disetujui admin. Refund {$percentage}% akan diproses finance.",
            ]);
        }

        // Notifikasi ke Finance
        $financeIds = \App\Models\User::where('role', 'finance')->pluck('id');
        foreach ($financeIds as $fid) {
            Notifikasi::create([
                'user_id' => $fid,
                'order_id' => $claim->order_id,
                'type' => 'claim_siap_finance',
                'judul' => 'Klaim Siap Diproses Finance',
                'pesan' => "Order #{$order->order_code} disetujui admin, siap proses refund {$percentage}%.",
            ]);
        }

        return back()->with('success', "Klaim disetujui dengan refund {$percentage}% (Rp" . number_format($amount, 0, ',', '.') . "). Diteruskan ke Finance.");
    }

    /**
     * Admin rejects claim.
     */
    public function tolak(Request $request, Claim $claim): RedirectResponse
    {
        abort_unless(in_array($claim->status, ['menunggu_pemeriksaan_admin', 'menunggu_klarifikasi_mitra', 'sengketa']), 400,
            'Klaim tidak bisa ditolak pada status ini.');

        $validated = $request->validate([
            'admin_catatan' => ['required', 'string', 'max:1000'],
        ]);

        $claim->update([
            'status' => 'ditolak',
            'admin_catatan' => $validated['admin_catatan'],
            'admin_validator_id' => Auth::id(),
            'admin_validated_at' => now(),
        ]);

        // Notifikasi ke Customer
        if ($claim->customer_id) {
            Notifikasi::create([
                'user_id' => $claim->customer_id,
                'order_id' => $claim->order_id,
                'type' => 'claim_ditolak',
                'judul' => 'Klaim Ditolak',
                'pesan' => "Klaim Anda untuk Order #{$claim->order?->order_code} ditolak. Alasan: {$validated['admin_catatan']}",
            ]);
        }

        // Notifikasi ke Mitra
        if ($claim->mitra_id) {
            Notifikasi::create([
                'user_id' => $claim->mitra_id,
                'order_id' => $claim->order_id,
                'type' => 'claim_ditolak',
                'judul' => 'Klaim Ditolak Admin',
                'pesan' => "Klaim untuk Order #{$claim->order?->order_code} ditolak admin. Alasan: {$validated['admin_catatan']}",
            ]);
        }

        return back()->with('success', 'Klaim ditolak.');
    }

    /**
     * Admin escalates to dispute (sengketa) - Super Admin will decide.
     */
    public function escalateSengketa(Request $request, Claim $claim): RedirectResponse
    {
        abort_if($claim->status !== 'menunggu_klarifikasi_mitra', 400,
            'Hanya klaim yang menunggu klarifikasi mitra yang bisa dinaikkan ke sengketa.');

        $validated = $request->validate([
            'admin_catatan' => ['required', 'string', 'max:1000'],
        ]);

        $claim->update([
            'status' => 'sengketa',
            'admin_catatan' => $validated['admin_catatan'],
            'admin_validator_id' => Auth::id(),
            'admin_validated_at' => now(),
        ]);

        // Notifikasi ke Super Admin
        $superAdminIds = \App\Models\User::where('role', 'super_admin')->pluck('id');
        foreach ($superAdminIds as $sid) {
            Notifikasi::create([
                'user_id' => $sid,
                'order_id' => $claim->order_id,
                'type' => 'claim_sengketa',
                'judul' => 'Sengketa Klaim - Perlu Keputusan Super Admin',
                'pesan' => "Klaim Order #{$claim->order?->order_code} masuk sengketa. Mitra menolak klaim. Diperlukan keputusan Super Admin.",
            ]);
        }

        // Notifikasi ke Customer
        if ($claim->customer_id) {
            Notifikasi::create([
                'user_id' => $claim->customer_id,
                'order_id' => $claim->order_id,
                'type' => 'claim_sengketa',
                'judul' => 'Klaim Masuk Tahap Sengketa',
                'pesan' => "Klaim Anda untuk Order #{$claim->order?->order_code} masuk tahap sengketa. Super Admin akan membuat keputusan akhir.",
            ]);
        }

        return back()->with('success', 'Klaim dinaikkan ke sengketa. Super Admin akan memutuskan.');
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