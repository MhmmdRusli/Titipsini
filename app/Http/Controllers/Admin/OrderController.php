<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\Order;
use App\Models\PaymentSetting;
use App\Models\PendapatanPlatform;
use App\Models\SaldoMutasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Persentase komisi fallback kalau entah kenapa PaymentSetting belum
     * ada baris sama sekali (seharusnya tidak pernah terjadi karena
     * PaymentSetting::current() pakai firstOrCreate dengan default di migration).
     */
    private const KOMISI_PLATFORM_FALLBACK_PERSEN = 10;

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
     * Kredit saldo mitra sebesar total pesanan dikurangi komisi platform.
     * Cuma dijalankan sekali per pesanan — dijaga dengan cek status sebelumnya,
     * supaya tidak dobel kredit kalau admin klik ulang status yang sama.
     */
    protected function kreditSaldoMitra(Order $order): void
    {
        if (! $order->partner_id) {
            return;
        }

        // Sudah pernah dikredit untuk pesanan ini? Cek dari riwayat mutasi biar tidak dobel.
        $sudahDikredit = SaldoMutasi::where('reference_type', Order::class)
            ->where('reference_id', $order->id)
            ->where('type', 'penghasilan')
            ->exists();

        if ($sudahDikredit) {
            return;
        }

        $komisiPersen = (float) (PaymentSetting::current()->komisi_persen ?? self::KOMISI_PLATFORM_FALLBACK_PERSEN);
        $totalPesanan = (float) $order->total_price;
        $komisi = round($totalPesanan * $komisiPersen / 100);
        $pendapatanMitra = $totalPesanan - $komisi;

        DB::transaction(function () use ($order, $pendapatanMitra, $komisi, $komisiPersen, $totalPesanan) {
            $order->partner->increment('saldo', $pendapatanMitra);

            SaldoMutasi::create([
                'user_id' => $order->partner_id,
                'type' => 'penghasilan',
                'jumlah' => $pendapatanMitra,
                'deskripsi' => 'Pendapatan dari pesanan '.$order->order_code.' (setelah komisi platform '.$komisiPersen.'%)',
                'reference_type' => Order::class,
                'reference_id' => $order->id,
            ]);

            PendapatanPlatform::create([
                'order_id' => $order->id,
                'partner_id' => $order->partner_id,
                'total_transaksi' => $totalPesanan,
                'komisi_persen' => $komisiPersen,
                'jumlah_komisi' => $komisi,
            ]);
        });
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status'        => ['required', Rule::in(['baru', 'diproses', 'selesai', 'dibatalkan'])],
            'cancel_reason' => ['required_if:status,dibatalkan', 'nullable', 'string', 'max:255'],
        ]);

        // Pesanan hanya boleh dikonfirmasi (diproses/selesai) kalau bukti
        // pembayaran sudah diupload customer. Pengecualian: pembatalan tetap
        // boleh dilakukan kapan saja meski belum ada bukti bayar.
        $butuhBuktiBayar = in_array($validated['status'], ['diproses', 'selesai']);

        if ($butuhBuktiBayar && ! $order->payment_receipt) {
            return back()->withErrors([
                'status' => 'Pesanan belum bisa dikonfirmasi karena bukti pembayaran belum diunggah customer.',
            ]);
        }

        $statusSebelumnya = $order->status;

        $order->update([
            'status'        => $validated['status'],
            'cancel_reason' => $validated['status'] === 'dibatalkan' ? $validated['cancel_reason'] : null,
        ]);

        // Kredit saldo mitra hanya saat status PERTAMA KALI berubah jadi 'diproses'
        // (artinya admin baru saja memverifikasi pembayaran).
        if ($validated['status'] === 'diproses' && $statusSebelumnya !== 'diproses') {
            $order->load('partner');
            $this->kreditSaldoMitra($order);
        }

        $this->notifikasiUntukStatus($order, $validated['status'], $validated['cancel_reason'] ?? null);

        return back()->with('success', 'Status pesanan berhasil diperbarui.');
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