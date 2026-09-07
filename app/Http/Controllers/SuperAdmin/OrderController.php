<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\Order;
use App\Models\PaymentSetting;
use App\Models\PendapatanPlatform;
use App\Services\OrderFaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Halaman "Pesanan" di panel Super Admin — sama persis alurnya dengan
 * Admin\OrderController (satu sumber data, tabel `orders`), supaya
 * data yang dilihat Super Admin dan Admin selalu konsisten.
 */
class OrderController extends Controller
{
    /**
     * GET /super-admin/pesanan
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $serviceType = $request->string('service_type')->toString();
        $status = $request->string('status')->toString();
        $city = $request->string('city')->toString();
        $isPickup = $request->boolean('is_pickup');

        $orders = Order::with(['customer:id,name,phone', 'partner:id,name,phone'])
            ->when($search, function ($query, $search) {
                $query->where('order_code', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            })
            ->when($serviceType, fn ($query, $value) => $query->where('service_type', $value))
            ->when($status, fn ($query, $value) => $query->where('status', $value))
            ->when($city, fn ($query, $value) => $query->where('city', $value))
            ->when($request->filled('is_pickup'), fn ($query) => $query->where('is_pickup', $isPickup))
            ->latest()
            ->paginate(10)
            ->through(function ($order) {
                return [
                    'id' => $order->id,
                    'order_code' => $order->order_code,
                    'service_type' => $order->service_type,
                    'is_pickup' => $order->is_pickup,
                    'city' => $order->city,
                    'status' => $order->status,
                    'fase' => $order->fase,
                    'fase_label' => OrderFaseService::label($order->service_type, $order->fase),
                    'denda' => $order->hitungDenda(),
                    'denda_payment_receipt' => ($order->bukti_denda ?? $order->denda_payment_receipt)
                        ? Storage::disk('public')->url($order->bukti_denda ?? $order->denda_payment_receipt)
                        : null,
                    'denda_paid_at' => $order->denda_paid_at?->format('d M Y H:i'),
                    'cancel_reason' => $order->cancel_reason,
                    'total_price' => $order->total_price,
                    'payment_method' => $order->payment_method,
                    'payment_receipt' => $order->payment_receipt ? Storage::disk('public')->url($order->payment_receipt) : null,
                    'payment_verified_at' => $order->payment_verified_at?->format('d M Y H:i'),
                    'created_at' => $order->created_at ? $order->created_at->format('d M Y H:i') : null,
                    'start_date' => $order->start_date ? Carbon::parse($order->start_date)->format('d M Y') : null,
                    'end_date' => $order->end_date ? Carbon::parse($order->end_date)->format('d M Y') : null,
                    'duration_label' => $this->hitungDurasi($order),
                    'customer' => $order->customer,
                    'partner' => $order->partner,
                ];
            })
            ->withQueryString();

        return Inertia::render('SuperAdmin/Pesanan/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'service_type' => $serviceType,
                'status' => $status,
                'city' => $city,
                'is_pickup' => $request->filled('is_pickup') ? $isPickup : null,
            ],
            'cities' => Order::query()->whereNotNull('city')->distinct()->orderBy('city')->pluck('city'),
        ]);
    }

    /**
     * Hitung durasi sewa/titip dalam hari — sama seperti Admin\OrderController,
     * supaya angka "X hari" konsisten di kedua panel.
     */
    private function hitungDurasi(Order $order): ?string
    {
        if (! $order->start_date || ! $order->end_date) {
            return null;
        }

        $mulai = Carbon::parse($order->start_date);
        $selesai = Carbon::parse($order->end_date);
        $hari = $mulai->diffInDays($selesai) + 1;

        return $hari.' hari';
    }

    protected function notifikasiUntukStatus(Order $order, string $status, ?string $cancelReason): void
    {
        $map = [
            'diproses' => [
                'type' => 'penitipan_berhasil',
                'judul' => 'Pesanan Sedang Diproses',
                'pesan' => 'Pesanan '.$order->order_code.' sedang diproses oleh mitra.',
            ],
            'selesai' => [
                'type' => 'penitipan_selesai',
                'judul' => 'Penitipan Selesai',
                'pesan' => 'Pesanan '.$order->order_code.' telah selesai. Terima kasih telah menggunakan Titipsini.',
            ],
            'dibatalkan' => [
                'type' => 'penitipan_dibatalkan',
                'judul' => 'Pesanan Dibatalkan',
                'pesan' => 'Pesanan '.$order->order_code.' dibatalkan.'.($cancelReason ? ' Alasan: '.$cancelReason.'.' : ''),
            ],
        ];

        if (! isset($map[$status]) || ! $order->customer_id) {
            return;
        }

        Notifikasi::create(array_merge($map[$status], [
            'user_id' => $order->customer_id,
            'order_id' => $order->id,
        ]));
    }

    protected function catatPendapatanPlatform(Order $order): void
    {
        if (! $order->partner_id) {
            return;
        }

        $sudahDicatat = PendapatanPlatform::where('order_id', $order->id)->exists();

        if ($sudahDicatat) {
            return;
        }

        $komisiPersen = (float) (PaymentSetting::current()->komisi_persen ?? 10);
        $totalPesanan = (float) $order->total_price;
        $komisi = round($totalPesanan * $komisiPersen / 100);

        PendapatanPlatform::create([
            'order_id' => $order->id,
            'partner_id' => $order->partner_id,
            'total_transaksi' => $totalPesanan,
            'komisi_persen' => $komisiPersen,
            'jumlah_komisi' => $komisi,
        ]);
    }

    /**
     * PATCH /super-admin/pesanan/{order}/status
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in([
                'baru',
                'diproses',
                'pembayaran_diterima',
                'diproses_mitra',
                'dikirim',
                'dititip',
                'pengambilan_diajukan',
                'selesai',
                'dibatalkan',
                'menunggu_verifikasi_finance',
            ])],
            'cancel_reason' => ['required_if:status,dibatalkan', 'nullable', 'string', 'max:255'],
        ]);

        if ($validated['status'] === 'selesai') {
            abort_unless($order->payment_verified_at, 422, 'Pesanan belum bisa diselesaikan — pembayaran belum diverifikasi.');
            abort_unless($order->fase === 'akhir', 422, 'Pesanan belum bisa diselesaikan — Mitra belum menandai fase akhir (barang diambil/sewa berakhir/dst).');
            abort_unless($order->dendaLunas(), 422, 'Pesanan belum bisa diselesaikan — denda keterlambatan belum dibayar customer.');
        }

        $statusSebelumnya = $order->status;

        $order->update([
            'status' => $validated['status'],
            'cancel_reason' => $validated['status'] === 'dibatalkan' ? $validated['cancel_reason'] : null,
        ]);

        if ($validated['status'] === 'selesai' && $statusSebelumnya !== 'selesai') {
            $order->load('partner');
            $this->catatPendapatanPlatform($order);
        }

        $this->notifikasiUntukStatus($order, $validated['status'], $validated['cancel_reason'] ?? null);

        return back()->with('success', 'Status pesanan berhasil diperbarui.');
    }

    public function cancelOrder(Request $request, Order $order)
    {
        $validated = $request->validate([
            'cancel_reason' => ['required', 'string', 'max:255'],
        ]);

        $order->update([
            'status' => 'dibatalkan',
            'cancel_reason' => $validated['cancel_reason'],
        ]);

        $this->notifikasiUntukStatus($order, 'dibatalkan', $validated['cancel_reason']);

        return back()->with('success', 'Pesanan '.$order->order_code.' berhasil dibatalkan oleh Super Admin.');
    }

    /**
     * POST /super-admin/pesanan/{order}/konfirmasi-cash
     */
    public function confirmCashPayment(Order $order)
    {
        abort_unless($order->payment_method === 'cod', 400, 'Order ini bukan pembayaran tunai.');
        abort_if($order->payment_verified_at, 400, 'Uang untuk pesanan ini sudah dikonfirmasi diterima sebelumnya.');

        $order->update([
            'payment_verified_at' => now(),
            'status' => $order->status === 'baru' ? 'diproses' : $order->status,
        ]);

        $this->notifikasiUntukStatus($order, 'diproses', null);

        return back()->with('success', 'Pembayaran tunai untuk pesanan '.$order->order_code.' berhasil dikonfirmasi.');
    }

    /**
     * PATCH /super-admin/pesanan/{order}/approve-denda
     */
    public function approveDenda(Order $order)
    {
        abort_unless($order->bukti_denda || $order->denda_payment_receipt, 422, 'Bukti pembayaran denda belum diunggah.');
        abort_unless($order->hitungDenda() > 0, 422, 'Pesanan ini tidak memiliki denda keterlambatan.');
        abort_if($order->denda_paid_at, 422, 'Denda untuk pesanan ini sudah diverifikasi sebelumnya.');

        $order->update([
            'denda_paid_at' => now(),
            'denda_amount' => $order->hitungDenda(),
            'status_denda' => 'terverifikasi',
        ]);

        if ($order->customer_id) {
            Notifikasi::create([
                'user_id' => $order->customer_id,
                'order_id' => $order->id,
                'type' => 'pembayaran_diterima',
                'judul' => 'Denda Terverifikasi',
                'pesan' => 'Pembayaran denda untuk pesanan '.$order->order_code.' telah diverifikasi.',
            ]);
        }

        return back()->with('success', 'Denda berhasil diverifikasi, saldo mitra otomatis bertambah.');
    }

    /**
     * DELETE /super-admin/pesanan/{order}
     */
    public function destroy(Order $order)
    {
        if ($order->payment_receipt) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $order->payment_receipt));
        }

        $order->delete();

        return back()->with('success', 'Pesanan berhasil dihapus.');
    }

    /**
     * DELETE /super-admin/pesanan/bulk-delete
     */
    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:orders,id'],
        ]);

        $orders = Order::whereIn('id', $validated['ids'])->get();

        foreach ($orders as $order) {
            if ($order->payment_receipt) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $order->payment_receipt));
            }
        }

        $count = Order::whereIn('id', $validated['ids'])->delete();

        return back()->with('success', "{$count} pesanan berhasil dihapus.");
    }
}