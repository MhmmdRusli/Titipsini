<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\Order;
use App\Models\PaymentSetting;
use App\Models\PendapatanPlatform;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $serviceType = $request->string('service_type')->toString();
        $status = $request->string('status')->toString();
        $city = $request->string('city')->toString();

        $orders = Order::with(['customer:id,name,phone', 'partner:id,name,phone'])
            ->when($search, function ($query, $search) {
                $query->where('order_code', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            })
            ->when($serviceType, fn ($query, $value) => $query->where('service_type', $value))
            ->when($status, fn ($query, $value) => $query->where('status', $value))
            ->when($city, fn ($query, $value) => $query->where('city', $value))
            ->latest()
            ->paginate(10)
            ->through(function ($order) {
                return [
                    'id'              => $order->id,
                    'order_code'      => $order->order_code,
                    'service_type'    => $order->service_type,
                    'is_pickup'       => $order->is_pickup,
                    'city'            => $order->city,
                    'status'          => $order->status,
                    'cancel_reason'   => $order->cancel_reason,
                    'total_price'     => $order->total_price,
                    'payment_method'  => $order->payment_method,
                    'payment_receipt' => $order->payment_receipt ? Storage::disk('public')->url($order->payment_receipt) : null,
                    // Dipakai frontend untuk menampilkan badge "Uang Belum Diterima"
                    // + tombol konfirmasi, khusus order dengan payment_method 'cod'.
                    'payment_verified_at' => $order->payment_verified_at?->format('d M Y H:i'),
                    'created_at'      => $order->created_at ? $order->created_at->format('d M Y H:i') : null,
                    'customer'        => $order->customer,
                    'partner'         => $order->partner,
                ];
            })
            ->withQueryString();

        return Inertia::render('Admin/Pesanan/Index', [
            'orders'  => $orders,
            'filters' => [
                'search'       => $search,
                'service_type' => $serviceType,
                'status'       => $status,
                'city'         => $city,
            ],
            'cities'  => Order::query()->whereNotNull('city')->distinct()->orderBy('city')->pluck('city'),
        ]);
    }

    /**
     * Konfigurasi notifikasi per status — dipakai untuk memberi tahu customer
     * setiap kali admin mengubah status pesanan.
     */
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

    /**
     * Catat pendapatan platform (buat halaman rekap Admin/Pendapatan) saat
     * pesanan pertama kali berstatus 'selesai'.
     *
     * PENTING: method ini TIDAK menyentuh kolom `users.saldo` maupun tabel
     * `saldo_mutasi` sama sekali. Saldo mitra sekarang dihitung dinamis lewat
     * User::saldoMitra() (langsung dari tabel `orders` + `penarikan`), jadi
     * tidak perlu — dan tidak boleh — "dikreditkan" secara manual di sini.
     * Kalau nanti butuh baca saldo mitra di mana pun, selalu panggil
     * $order->partner->saldoMitra(), jangan pernah balik ke $user->saldo.
     */
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

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status'        => ['required', Rule::in(['baru', 'diproses', 'selesai', 'dibatalkan'])],
            'cancel_reason' => ['required_if:status,dibatalkan', 'nullable', 'string', 'max:255'],
        ]);

        $statusSebelumnya = $order->status;

        $order->update([
            'status'        => $validated['status'],
            'cancel_reason' => $validated['status'] === 'dibatalkan' ? $validated['cancel_reason'] : null,
        ]);

        // Catat pendapatan platform hanya saat status PERTAMA KALI jadi 'selesai'
        // (selaras dengan User::saldoMitra() yang cuma hitung order 'selesai').
        if ($validated['status'] === 'selesai' && $statusSebelumnya !== 'selesai') {
            $order->load('partner');
            $this->catatPendapatanPlatform($order);
        }

        $this->notifikasiUntukStatus($order, $validated['status'], $validated['cancel_reason'] ?? null);

        return back()->with('success', 'Status pesanan berhasil diperbarui.');
    }

    /**
     * POST /admin/pesanan/{order}/konfirmasi-cash
     *
     * Khusus untuk order dengan payment_method 'cod' (Tunai/Bayar di tempat).
     * Berbeda dari updateStatus() di atas: ini TIDAK mengubah alur status
     * baru->diproses->selesai secara umum, tapi khusus mencatat KAPAN uang
     * cash-nya benar-benar diterima/dikonfirmasi oleh admin - memakai kolom
     * `payment_verified_at` yang sama seperti yang dipakai untuk pembayaran
     * saldo (supaya konsisten, satu kolom = "kapan pembayaran terverifikasi"
     * untuk semua metode pembayaran).
     *
     * Order cash yang baru dibuat statusnya 'baru' dan payment_verified_at
     * masih null (lihat ServiceController::konfirmasiPesanan()). Begitu admin
     * konfirmasi di sini, payment_verified_at diisi DAN status ikut naik ke
     * 'diproses' - supaya konsisten dengan order saldo yang sudah otomatis
     * 'diproses' sejak awal.
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

    public function destroy(Order $order)
    {
        // Hapus file bukti pembayaran fisik jika ada
        if ($order->payment_receipt) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $order->payment_receipt));
        }

        $order->delete();

        return back()->with('success', 'Pesanan berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array', 'min:1'],
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