<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\Order;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class OrderController extends Controller
{
    protected function statusesForTab(string $status): array
    {
        return match ($status) {
            'baru' => ['baru'],
            'diproses' => ['diproses'],
            'selesai' => ['selesai'],
            'dibatalkan' => ['dibatalkan'],
            default => [], // Kosong atau 'semua' berarti ambil semua data
        };
    }

    public function index(Request $request): Response
    {
        // Tangkap parameter 'status' dari request
        $status = $request->string('status')->toString();

        $query = $request->user()
            ->ordersAsCustomer()
            ->with('partner:id,name');

        // Filter berdasarkan status jika dipilih
        $statuses = $this->statusesForTab($status);
        if (!empty($statuses)) {
            $query->whereIn('status', $statuses);
        }

        $orders = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Customer/Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'status' => $status,
            ],
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        $order->load('partner:id,name,phone');

        return Inertia::render('Customer/Orders/Show', [
            'order' => $order,
        ]);
    }

    public function cancel(Request $request, Order $order): RedirectResponse
{
    abort_unless($order->customer_id === $request->user()->id, 403);

    abort_unless(
        $order->status === 'baru',
        400,
        'Pesanan ini sudah diproses dan tidak bisa dibatalkan lagi.'
    );

    $validated = $request->validate([
        'cancel_reason' => 'required|string|max:255',
    ], [
        'cancel_reason.required' => 'Alasan pembatalan wajib diisi.',
    ]);

    $order->update([
        'status' => 'dibatalkan',
        'cancel_reason' => $validated['cancel_reason'],
    ]);

    return back()->with('success', 'Pesanan berhasil dibatalkan.');
}

    public function success(Request $request, Order $order): Response
{
    abort_unless($order->customer_id === $request->user()->id, 403);

    return Inertia::render('Customer/Orders/Success', [
        'orderId' => $order->id,
        'sudahLunas' => $order->payment_verified_at !== null,
        'paymentMethod' => $order->payment_method,
    ]);
}

    /**
     * Halaman instruksi / pemrosesan pembayaran oleh customer
     */
    public function pembayaran(Request $request, Order $order): Response
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        $setting = PaymentSetting::current();
        $qrisUrl = ($setting && $setting->qris_image) ? Storage::url($setting->qris_image) : null;

        return Inertia::render('Customer/Orders/Pembayaran', [
            'order' => $order->only([
                'id', 
                'order_code', 
                'item_name', 
                'service_type',
                'payment_method', 
                'total_price', 
                'status',
                'created_at',
            ]),
            'qris_url' => $qrisUrl,
        ]);
    }

    public function buktiPembayaran(Request $request, Order $order): Response
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        $setting = PaymentSetting::current();
        $qrisUrl = ($setting && $setting->qris_image) ? Storage::url($setting->qris_image) : null;

        return Inertia::render('Customer/Orders/BuktiPembayaran', [
            'order' => $order->only([
                'id', 
                'order_code', 
                'item_name', 
                'service_type',
                'payment_method', 
                'total_price', 
                'created_at',
            ]),
            'qris_url' => $qrisUrl,
        ]);
    }

    public function uploadBukti(Request $request, Order $order)
    {
        // 1. Validasi file gambar
        $request->validate([
            'payment_receipt' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // 2. Simpan file gambar ke storage public
        if ($request->hasFile('payment_receipt')) {
            // Hapus bukti lama jika ada
            if ($order->payment_receipt) {
                Storage::disk('public')->delete($order->payment_receipt);
            }

            $path = $request->file('payment_receipt')->store('payment_proofs', 'public');

            // 3. Update status pesanan & simpan path foto bukti ke database
            $order->update([
                'payment_receipt' => $path,
                'status'          => 'diproses',
            ]);

            // 4. Beri tahu mitra bahwa bukti pembayaran sudah diunggah & menunggu verifikasi
            if ($order->partner_id) {
                Notifikasi::create([
                    'user_id' => $order->partner_id,
                    'order_id' => $order->id,
                    'type' => 'pembayaran_diterima',
                    'judul' => 'Bukti Pembayaran Diunggah',
                    'pesan' => 'Customer telah mengunggah bukti pembayaran untuk pesanan '.$order->order_code.'. Mohon segera diverifikasi.',
                ]);
            }

            // 5. Beri tahu customer sendiri sebagai konfirmasi bahwa bukti pembayarannya sudah diterima sistem
            Notifikasi::create([
                'user_id' => $order->customer_id,
                'order_id' => $order->id,
                'type' => 'pembayaran_diterima',
                'judul' => 'Bukti Pembayaran Diterima',
                'pesan' => 'Bukti pembayaran untuk pesanan '.$order->order_code.' berhasil diterima dan sedang menunggu verifikasi mitra.',
            ]);
        }

        // 6. Kembali ke halaman detail pesanan dengan pesan sukses
        return redirect()->route('customer.orders.show', $order->id)
            ->with('success', 'Bukti pembayaran berhasil diunggah! Menunggu verifikasi.');
    }

    
}