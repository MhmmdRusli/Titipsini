<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use App\Models\Order;
use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ClaimController extends Controller
{
    /**
     * Show claim submission form for an order.
     */
    public function create(Request $request, Order $order): Response
    {
        abort_unless($order->customer_id === $request->user()->id, 403);
        abort_unless(in_array($order->status, ['dititip', 'pengambilan_diajukan', 'selesai']), 422,
            'Klaim hanya dapat diajukan untuk pesanan yang sudah dititip atau selesai.');

        // Check if there's already an active claim
        $existingClaim = $order->claims()->whereNotIn('status', ['ditolak', 'refund_berhasil'])->first();
        abort_unless(!$existingClaim, 422, 'Sudah ada klaim aktif untuk pesanan ini.');

        // Get kondisi_awal for reference
        $kondisiAwal = $order->kondisiAwal;

        return Inertia::render('Customer/Orders/ClaimCreate', [
            'order' => [
                'id' => $order->id,
                'order_code' => $order->order_code,
                'item_name' => $order->item_name,
                'service_type' => $order->service_type,
                'total_price' => (float) $order->total_price,
                'partner_name' => $order->partner?->name,
            ],
            'kondisiAwal' => $kondisiAwal ? [
                'foto_urls' => $kondisiAwal->foto_urls,
                'catatan' => $kondisiAwal->catatan,
                'dokumentasi_at' => $kondisiAwal->dokumentasi_at?->format('d M Y H:i'),
            ] : null,
        ]);
    }

    /**
     * Store new claim.
     */
    public function store(Request $request, Order $order)
    {
        abort_unless($order->customer_id === $request->user()->id, 403);
        abort_unless(in_array($order->status, ['dititip', 'pengambilan_diajukan', 'selesai']), 422,
            'Klaim hanya dapat diajukan untuk pesanan yang sudah dititip atau selesai.');

        $existingClaim = $order->claims()->whereNotIn('status', ['ditolak', 'refund_berhasil'])->first();
        abort_unless(!$existingClaim, 422, 'Sudah ada klaim aktif untuk pesanan ini.');

        $validated = $request->validate([
            'alasan' => ['required', 'string', 'max:1000'],
            'foto' => ['required', 'array', 'min:1', 'max:5'],
            'foto.*' => ['image', 'mimes:jpeg,png,jpg', 'max:4096'],
            'jumlah_klaim' => ['nullable', 'numeric', 'min:0', 'max:' . $order->total_price],
        ]);

        $fotoUrls = [];
        foreach ($request->file('foto') as $file) {
            $path = $file->store('claim-evidence', 'public');
            $fotoUrls[] = Storage::url($path);
        }

        $claim = Claim::create([
            'order_id' => $order->id,
            'customer_id' => $request->user()->id,
            'mitra_id' => $order->partner_id,
            'status' => 'klaim_diajukan',
            'alasan' => $validated['alasan'],
            'foto_urls' => $fotoUrls,
            'jumlah_klaim' => $validated['jumlah_klaim'] ?? null,
        ]);

        // Notify Mitra
        if ($order->partner_id) {
            Notifikasi::create([
                'user_id' => $order->partner_id,
                'order_id' => $order->id,
                'type' => 'claim_diajukan',
                'judul' => 'Klaim Baru dari Customer',
                'pesan' => "Customer mengajukan klaim untuk pesanan {$order->order_code}. Alasan: {$validated['alasan']}",
            ]);
        }

        // Notify Admins
        $adminIds = \App\Models\User::whereIn('role', ['admin', 'super_admin'])->pluck('id');
        foreach ($adminIds as $adminId) {
            Notifikasi::create([
                'user_id' => $adminId,
                'order_id' => $order->id,
                'type' => 'claim_diajukan',
                'judul' => 'Klaim Baru Memerlukan Pemeriksaan',
                'pesan' => "Order #{$order->order_code} - Klaim diajukan customer. Perlu pemeriksaan admin.",
            ]);
        }

        return redirect()->route('customer.orders.show', $order->id)
            ->with('success', 'Klaim berhasil diajukan. Admin akan memeriksa dan menghubungi mitra untuk klarifikasi.');
    }

    /**
     * Show claim detail for customer.
     */
    public function show(Request $request, Claim $claim): Response
    {
        abort_unless($claim->customer_id === $request->user()->id, 403);

        $claim->load(['order.customer', 'order.partner', 'adminValidator', 'financeProcessor', 'superAdmin']);

        return Inertia::render('Customer/Orders/ClaimShow', [
            'claim' => $this->serializeClaim($claim),
        ]);
    }

    protected function serializeClaim(Claim $claim): array
    {
        $order = $claim->order;

        return [
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
            'finance_processed_at' => $claim->finance_processed_at?->format('d M Y H:i'),
            'finance_catatan' => $claim->finance_catatan,
            'super_admin_keputusan' => $claim->super_admin_keputusan,
            'super_admin_decided_at' => $claim->super_admin_decided_at?->format('d M Y H:i'),
            'created_at' => $claim->created_at?->format('d M Y H:i'),
            'order' => $order ? [
                'id' => $order->id,
                'order_code' => $order->order_code,
                'item_name' => $order->item_name,
                'total_price' => (float) $order->total_price,
                'partner_name' => $order->partner?->name,
            ] : null,
        ];
    }
}