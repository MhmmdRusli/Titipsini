<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\Order;
use App\Models\PaymentSetting;
use App\Services\OrderFaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class OrderController extends Controller
{
    protected function statusesForTab(string $status): array
    {
        $status = strtolower(trim($status));

        return match ($status) {
            'baru', 'pending', 'unpaid', 'belum_bayar', 'belum-bayar' => ['baru', 'pending', 'unpaid'],
            'diproses', 'dititipkan', 'active' => ['diproses', 'dititipkan', 'active'],
            'selesai' => ['selesai'],
            'dibatalkan' => ['dibatalkan'],
            default => [],
        };
    }

    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();

        $query = $request->user()
            ->ordersAsCustomer()
            ->with('partner:id,name,address,city');

        $statuses = $this->statusesForTab($status);
        if (!empty($statuses)) {
            $query->whereIn('status', $statuses);
        }

        $orders = $query->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Order $order) => [
                ...$order->toArray(),
                'vendor_name' => $order->partner?->name ?? 'Experi',
                'vendor_address' => $order->partner ? trim(implode(', ', array_filter([$order->partner->address, $order->partner->city])), ', ') : 'Jl. Janti, Bantul, Yogyakarta',
            ]);

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

        $order->load([
            'partner:id,name,phone',
            'customer:id,name,phone',
            'customer.addresses:id,user_id,address,is_primary',
        ]);

        $alamatUtama = $order->customer->addresses->firstWhere('is_primary', true)
            ?? $order->customer->addresses->first();
        $order->alamat_lengkap = $order->pickup_address ?: $alamatUtama?->address;

        $setting = PaymentSetting::current();
        $qrisUrl = ($setting && $setting->qris_image) ? Storage::url($setting->qris_image) : null;

        $order->payment_receipt_url = $order->payment_receipt
            ? Storage::disk('public')->url(ltrim(str_replace('/storage/', '', $order->payment_receipt), '/'))
            : null;

        return Inertia::render('Customer/Orders/Show', [
            'order' => $order,
            'qris_url' => $qrisUrl,
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

    public function complete(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        if ($order->status !== 'diproses') {
            return back()->withErrors(['finish' => 'Pesanan ini belum sedang diproses.']);
        }

        if ($order->fase !== 'akhir') {
            return back()->withErrors(['finish' => 'Mitra belum menandai barang sudah diambil.']);
        }

        if ($order->payment_verified_at === null) {
            return back()->withErrors(['finish' => 'Pembayaran pesanan belum diverifikasi.']);
        }

        $order->update(['tanggal_selesai_aktual' => now()]);
        OrderFaseService::completeOrder($order);

        return back()->with('success', 'Pesanan berhasil diselesaikan.');
    }

    public function review(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        $data = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'required|string|max:1000',
        ]);

        abort_unless($order->status === 'selesai', 400, 'Ulasan hanya bisa diberikan untuk pesanan selesai.');

        $order->update($data);

        return back()->with('success', 'Ulasan berhasil dikirim.');
    }

    public function requestPickup(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->customer_id === $request->user()->id, 403);
        abort_unless($order->status === 'diproses', 400, 'Pesanan ini tidak sedang diproses.');
        abort_unless($order->fase === 'berjalan', 400, 'Pesanan belum berada pada tahap penitipan.');
        abort_unless($order->payment_verified_at !== null, 400, 'Pembayaran pesanan belum diverifikasi.');
        abort_if($order->pickup_requested_at, 400, 'Pengajuan pengambilan sudah dikirim.');

        $order->update(['pickup_requested_at' => now()]);

        if ($order->partner_id) {
            Notifikasi::create([
                'user_id' => $order->partner_id,
                'order_id' => $order->id,
                'type' => 'transaksi_masuk',
                'judul' => 'Customer Mengajukan Pengambilan',
                'pesan' => 'Customer mengajukan pengambilan barang untuk pesanan '.$order->order_code.'. Silakan serahkan barang dan konfirmasi pengambilan.',
            ]);
        }

        return back()->with('success', 'Pengajuan pengambilan berhasil dikirim ke mitra.');
    }

    public function success(Request $request, Order $order): Response
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        return Inertia::render('Customer/Orders/Success', [
            'orderId' => $order->id,
            'sudahLunas' => $order->payment_verified_at !== null,
            'paymentMethod' => $order->payment_method,
            'total' => (float) $order->total_price,
            'saldo' => (float) $request->user()->saldo,
        ]);
    }

    public function bayarSaldo(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        if ($order->payment_verified_at !== null) {
            return redirect()->route('customer.orders.show', $order->id);
        }

        $customer = $request->user();
        $total = (float) $order->total_price;

        if ((float) $customer->saldo < $total) {
            return back()->withErrors([
                'saldo' => 'Saldo kamu tidak mencukupi untuk membayar pesanan ini. Silakan top up terlebih dahulu atau bayar via transfer.',
            ]);
        }

        $customer->decrement('saldo', $total);

        $order->update([
            'payment_method' => 'saldo',
            'payment_verified_at' => now(),
            'status' => 'diproses',
        ]);

        if ($order->partner_id) {
            Notifikasi::create([
                'user_id' => $order->partner_id,
                'order_id' => $order->id,
                'type' => 'transaksi_masuk',
                'judul' => 'Pesanan Baru Masuk',
                'pesan' => 'Ada pesanan baru dengan kode '.$order->order_code.' menunggu diproses.',
            ]);
        }

        return redirect()->route('customer.orders.show', $order->id)
            ->with('success', 'Pembayaran dengan saldo berhasil! Pesananmu sedang diproses.');
    }

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
            'saldo' => (float) $request->user()->saldo,
            'sudahLunas' => $order->payment_verified_at !== null,
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
            'saldo' => (float) $request->user()->saldo,
            'sudahLunas' => $order->payment_verified_at !== null,
        ]);
    }

    public function uploadBukti(Request $request, Order $order)
    {
        $request->validate([
            'payment_receipt' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('payment_receipt')) {
            if ($order->payment_receipt) {
                Storage::disk('public')->delete($order->payment_receipt);
            }

            $path = $request->file('payment_receipt')->store('payment_proofs', 'public');

            $order->update([
                'payment_receipt' => $path,
                'status'          => 'diproses',
                'payment_method'  => $order->payment_method === 'pending' ? 'transfer' : $order->payment_method,
            ]);

            if ($order->partner_id) {
                Notifikasi::create([
                    'user_id' => $order->partner_id,
                    'order_id' => $order->id,
                    'type' => 'pembayaran_diterima',
                    'judul' => 'Bukti Pembayaran Diunggah',
                    'pesan' => 'Customer telah mengunggah bukti pembayaran untuk pesanan '.$order->order_code.'. Mohon segera diverifikasi.',
                ]);
            }

            Notifikasi::create([
                'user_id' => $order->customer_id,
                'order_id' => $order->id,
                'type' => 'pembayaran_diterima',
                'judul' => 'Bukti Pembayaran Diterima',
                'pesan' => 'Bukti pembayaran untuk pesanan '.$order->order_code.' berhasil diterima dan sedang menunggu verifikasi mitra.',
            ]);
        }

        return redirect()->route('customer.orders.show', $order->id)
            ->with('success', 'Bukti pembayaran berhasil diunggah! Menunggu verifikasi.');
    }

    public function bayarDenda(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->customer_id === $request->user()->id, 403);
     
        if ($order->denda_paid_at !== null) {
            return back()->with('success', 'Denda untuk pesanan ini sudah dibayar sebelumnya.');
        }
     
        $dendaAmount = $order->hitungDenda();
     
        if ($dendaAmount <= 0) {
            return back()->with('success', 'Pesanan ini tidak memiliki denda keterlambatan.');
        }
     
        $customer = $request->user();
     
        if ((float) $customer->saldo < $dendaAmount) {
            return back()->withErrors([
                'saldo_denda' => 'Saldo kamu tidak mencukupi untuk membayar denda ini. Silakan top up terlebih dahulu.',
            ]);
        }
     
        $customer->decrement('saldo', $dendaAmount);
     
        $order->update([
            'denda_paid_at' => now(),
            'status_denda'  => 'terverifikasi',
        ]);
     
        return back()->with('success', 'Denda keterlambatan berhasil dibayar.');
    }

    public function uploadBuktiDenda(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        $request->validate([
            'denda_receipt' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($order->bukti_denda) {
            Storage::disk('public')->delete($order->bukti_denda);
        }

        $path = $request->file('denda_receipt')->store('bukti-denda', 'public');

        $order->update([
            'bukti_denda'  => $path,
            'status_denda' => 'menunggu_verifikasi',
        ]);

        if ($order->partner_id) {
            Notifikasi::create([
                'user_id' => $order->partner_id,
                'order_id' => $order->id,
                'type' => 'pembayaran_diterima',
                'judul' => 'Bukti Pembayaran Denda Diunggah',
                'pesan' => 'Customer telah mengunggah bukti pembayaran denda untuk pesanan '.$order->order_code.'.',
            ]);
        }

        return redirect()->route('customer.orders.show', $order->id)
            ->with('success', 'Bukti pembayaran denda berhasil diunggah! Menunggu verifikasi.');
    }

    /* =====================================================================
     |  PERPANJANG PENITIPAN
     |  Alur: form (pilih tanggal keluar baru) -> hitung & simpan draft ->
     |  invoice perpanjangan -> bayar (saldo langsung lunas, atau upload
     |  bukti transfer menunggu verifikasi mitra).
     |  end_date ASLI baru ikut berubah setelah status_perpanjangan jadi
     |  'terverifikasi' (lihat extendBayarSaldo & Mitra\OrderController::verifikasiPerpanjangan).
     * =====================================================================
     */

    /**
     * GET /app/orders/{order}/extend
     */
    public function extendForm(Request $request, Order $order): Response
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        abort_unless(
            $order->status === 'diproses',
            400,
            'Hanya pesanan yang sedang dititipkan yang bisa diperpanjang.'
        );

        $jumlahHariAsli = max(1, \Carbon\Carbon::parse($order->start_date)->diffInDays($order->end_date));
        $hargaPerHari = round(((float) $order->subtotal) / $jumlahHariAsli);

        return Inertia::render('Customer/Orders/Extend', [
            'order' => $order->only([
                'id', 'order_code', 'item_name', 'service_type',
                'start_date', 'end_date', 'city',
            ]),
            'hargaPerHari' => $hargaPerHari,
        ]);
    }

    /**
     * POST /app/orders/{order}/extend
     */
    public function extendStore(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        abort_unless(
            $order->status === 'diproses',
            400,
            'Hanya pesanan yang sedang dititipkan yang bisa diperpanjang.'
        );

        $validated = $request->validate([
            'extend_end_date' => ['required', 'date', 'after:'.$order->end_date],
        ], [
            'extend_end_date.after' => 'Tanggal keluar baru harus setelah tanggal keluar saat ini.',
        ]);

        $harga = $order->hargaPerpanjangan($validated['extend_end_date']);

        $order->update([
            'extend_end_date' => $validated['extend_end_date'],
            'extend_price' => $harga,
            'extend_requested_at' => now(),
            'extend_paid_at' => null,
            'extend_payment_method' => null,
            'extend_payment_receipt' => null,
            'status_perpanjangan' => 'menunggu_pembayaran',
        ]);

        return redirect()->route('customer.orders.extend.invoice', $order->id);
    }

    /**
     * GET /app/orders/{order}/extend/invoice
     */
    public function extendInvoice(Request $request, Order $order): Response
    {
        abort_unless($order->customer_id === $request->user()->id, 403);
        abort_unless($order->extend_end_date !== null, 404);

        $setting = PaymentSetting::current();
        $qrisUrl = ($setting && $setting->qris_image) ? Storage::url($setting->qris_image) : null;

        return Inertia::render('Customer/Orders/ExtendInvoice', [
            'order' => $order->only([
                'id', 'order_code', 'item_name', 'service_type',
                'start_date', 'end_date', 'extend_end_date', 'extend_price',
                'extend_paid_at', 'extend_payment_receipt', 'status_perpanjangan',
                'created_at',
            ]),
            'qris_url' => $qrisUrl,
            'saldo' => (float) $request->user()->saldo,
        ]);
    }

    /**
     * POST /app/orders/{order}/extend/bayar-saldo
     */
    public function extendBayarSaldo(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        abort_unless($order->status_perpanjangan === 'menunggu_pembayaran', 400, 'Tidak ada perpanjangan yang menunggu pembayaran.');

        $customer = $request->user();
        $harga = (float) $order->extend_price;

        if ((float) $customer->saldo < $harga) {
            return back()->withErrors([
                'saldo_perpanjangan' => 'Saldo kamu tidak mencukupi untuk membayar perpanjangan ini. Silakan top up terlebih dahulu atau bayar via QRIS.',
            ]);
        }

        $customer->decrement('saldo', $harga);

        $order->update([
            'end_date' => $order->extend_end_date,
            'total_price' => $order->total_price + $harga,
            'extend_paid_at' => now(),
            'extend_payment_method' => 'saldo',
            'status_perpanjangan' => 'terverifikasi',
        ]);

        if ($order->partner_id) {
            Notifikasi::create([
                'user_id' => $order->partner_id,
                'order_id' => $order->id,
                'type' => 'transaksi_masuk',
                'judul' => 'Penitipan Diperpanjang',
                'pesan' => 'Pesanan '.$order->order_code.' diperpanjang sampai '.\Carbon\Carbon::parse($order->end_date)->translatedFormat('d F Y').'.',
            ]);
        }

        return redirect()->route('customer.orders.show', $order->id)
            ->with('success', 'Perpanjangan penitipan berhasil dibayar dengan saldo.');
    }

    /**
     * POST /app/orders/{order}/extend/upload-bukti
     */
    public function extendUploadBukti(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        abort_unless($order->status_perpanjangan === 'menunggu_pembayaran', 400, 'Tidak ada perpanjangan yang menunggu pembayaran.');

        $request->validate([
            'extend_receipt' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($order->extend_payment_receipt) {
            Storage::disk('public')->delete($order->extend_payment_receipt);
        }

        $path = $request->file('extend_receipt')->store('extend_proofs', 'public');

        $order->update([
            'extend_payment_receipt' => $path,
            'extend_payment_method' => 'transfer',
            'status_perpanjangan' => 'menunggu_verifikasi',
        ]);

        if ($order->partner_id) {
            Notifikasi::create([
                'user_id' => $order->partner_id,
                'order_id' => $order->id,
                'type' => 'pembayaran_diterima',
                'judul' => 'Bukti Perpanjangan Diunggah',
                'pesan' => 'Customer mengunggah bukti pembayaran perpanjangan untuk pesanan '.$order->order_code.'. Mohon segera diverifikasi.',
            ]);
        }

        return redirect()->route('customer.orders.show', $order->id)
            ->with('success', 'Bukti pembayaran perpanjangan berhasil diunggah! Menunggu verifikasi mitra.');
    }
}