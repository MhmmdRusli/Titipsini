<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * GET /app/services?kategori=kendaraan&jenis=mobil&search=Yogyakarta
     */
    public function index(Request $request): Response
    {
        $kategori = $request->string('kategori')->toString();
        $jenis = $request->string('jenis')->toString();
        $search = $request->string('search')->toString();

        $services = Service::query()
    ->where('is_active', true)
    ->when($kategori, fn ($query) => $query->where('kategori', $kategori))
    ->when($jenis && $kategori === 'kendaraan', fn ($query) => $query->where('jenis_kendaraan', $jenis))
    ->when($jenis && $kategori === 'bangunan', fn ($query) => $query->where('jenis_bangunan', $jenis))
    ->when($search, function ($query) use ($search) {
        $query->where(function ($q) use ($search) {
            $q->where('kota', 'like', "%{$search}%")
                ->orWhere('kecamatan', 'like', "%{$search}%");
        });
    })
    ->with('vendor:id,name')
    ->orderBy('kota')
    ->paginate(10)
    ->withQueryString();

        return Inertia::render('Customer/Services/Index', [
            'services' => $services,
            'filters' => [
                'kategori' => $kategori,
                'jenis' => $jenis,
                'search' => $search,
            ],
        ]);
    }

    public function pilihPaket()
    {
        return Inertia::render('Customer/Services/PilihPaket', [
            'hargaMulai' => 100000,
        ]);
    }

    public function formBarang()
    {
        return Inertia::render('Customer/Services/Barang/Form', [
            'hargaMulai' => 100000,
        ]);
    }

    public function simpanBarang(Request $request)
{
    $data = $request->validate([
        'namaBarang' => 'required|string',
        'pickup' => 'boolean',
        'tanggalMasuk' => 'required|date',
        'tanggalKeluar' => 'required|date|after_or_equal:tanggalMasuk',
    ]);

    // Order beneran baru dibuat setelah customer konfirmasi + pilih pembayaran,
    // jadi untuk sekarang cuma disimpan sementara di session.
    session(['pesanan_barang' => $data]);

    return redirect()->route('customer.services.barang.pemesanan');
}

public function pemesanan()
{
    $data = session('pesanan_barang');

    if (!$data) {
        return redirect()->route('customer.services.barang.pilihPaket');
    }

    // TODO: harga per barang masih hardcode Rp 15.000 karena Form.jsx cuma
    // nampung nama barang (comma-separated), belum ada harga per item.
    // Kalau kamu punya tabel harga per jenis barang, ganti bagian ini.
    $items = collect(explode(',', $data['namaBarang']))
        ->map(fn ($nama) => trim($nama))
        ->filter()
        ->map(fn ($nama) => ['nama' => $nama, 'harga' => 15000, 'qty' => 1])
        ->values();

    $customer = auth()->user();

    return Inertia::render('Customer/Services/Barang/Pemesanan', [
        'customer' => [
            'nama' => $customer->name,
            'telepon' => $customer->phone ?? '-',
            'alamat' => $customer->alamat ?? '-',
        ],
        'items' => $items,
        'detail' => [
            'checkIn' => $data['tanggalMasuk'],
            'checkOut' => $data['tanggalKeluar'],
            'pickup' => (bool) $data['pickup'],
        ],
    ]);
}


public function metodePembayaran()
{
    $data = session('pesanan_barang');

    if (!$data) {
        return redirect()->route('customer.services.barang.pilihPaket');
    }

    $items = collect(explode(',', $data['namaBarang']))
        ->map(fn ($nama) => trim($nama))
        ->filter()
        ->values();

    $total = $items->count() * 15000;

    return Inertia::render('Customer/Services/Barang/MetodePembayaran', [
        'total' => $total,
    ]);
}

public function konfirmasiPesanan(Request $request)
{
    $validated = $request->validate([
        'payment_method' => ['required', 'string'],
    ]);

    $data = session('pesanan_barang');

    if (!$data) {
        return redirect()->route('customer.services.barang.pilihPaket');
    }

    $items = collect(explode(',', $data['namaBarang']))
        ->map(fn ($nama) => trim($nama))
        ->filter();

    $total = $items->count() * 15000;

    $customer = auth()->user();

    $order = \App\Models\Order::create([
        'order_code' => 'TS-'.strtoupper(uniqid()),
        'customer_id' => $customer->id,
        'service_type' => 'barang',
        'item_name' => $data['namaBarang'],
        'start_date' => $data['tanggalMasuk'],
        'end_date' => $data['tanggalKeluar'],
        'is_pickup' => (bool) $data['pickup'],
        'city' => $customer->city ?? '-',
        'status' => 'baru',
        'total_price' => $total,
        'payment_method' => $validated['payment_method'],
    ]);

    session()->forget('pesanan_barang');

    return redirect()->route('customer.orders.show', $order->id)
        ->with('success', 'Pesanan berhasil dibuat, menunggu konfirmasi mitra.');
}
}