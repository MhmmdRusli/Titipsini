<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
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

        session(['pesanan_barang' => $data]);

        return redirect()->route('customer.services.barang.pemesanan');
    }

    public function pemesanan()
    {
        $data = session('pesanan_barang');

        if (!$data) {
            return redirect()->route('customer.services.barang.pilihPaket');
        }

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

    /**
     * 🟢 PROSES PEMESANAN BARANG (Langsung Buat Order & Ke Halaman Sukses)
     */
    public function konfirmasiPesanan(Request $request)
    {
        $data = session('pesanan_barang');

        if (!$data) {
            return redirect()->route('customer.services.barang.pilihPaket');
        }

        $items = collect(explode(',', $data['namaBarang']))
            ->map(fn ($nama) => trim($nama))
            ->filter();

        $total = $items->count() * 15000;
        $customer = auth()->user();

        $order = Order::create([
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
            'payment_method' => 'default', // Menggunakan nilai bawaan/default
        ]);

        session()->forget('pesanan_barang');

        return redirect()->route('customer.orders.success', $order->id);
    }

    protected function jenisLabel(Service $service): string
    {
        $vehicleLabels = [
            'motor' => 'Motor', 'mobil' => 'Mobil', 'truk' => 'Truk', 'becak' => 'Becak',
            'sepeda' => 'Sepeda', 'bus' => 'Bus', 'mobil_pick_up' => 'Mobil pick up',
        ];
        $buildingLabels = [
            'rumah' => 'Rumah', 'apartemen' => 'Apartemen', 'kosan' => 'Kosan',
            'gudang' => 'Gudang', 'kamar' => 'Kamar',
        ];

        return match ($service->kategori) {
            'kendaraan' => $vehicleLabels[$service->jenis_kendaraan] ?? '-',
            'bangunan' => $buildingLabels[$service->jenis_bangunan] ?? '-',
            default => ucfirst($service->kategori),
        };
    }

    /**
     * GET /app/services/{service}
     */
    public function show(Service $service)
    {
        return Inertia::render('Customer/Services/Show', [
            'service' => [
                'id' => $service->id,
                'nama' => $service->nama,
                'kota' => $service->kota,
                'kecamatan' => $service->kecamatan,
                'kategori' => $service->kategori,
                'jenisLabel' => $this->jenisLabel($service),
                'harga' => (float) $service->harga,
            ],
        ]);
    }

    /**
     * 🟢 PROSES PEMESANAN LAYANAN/TITIPAN (Langsung Buat Order & Ke Halaman Sukses)
     * POST /app/services/{service}/pesan
     */
    public function storePesanan(Request $request, Service $service)
    {
        $data = $request->validate([
            'tanggalMasuk' => 'required|date',
            'tanggalKeluar' => 'required|date|after_or_equal:tanggalMasuk',
        ]);

        $customer = auth()->user();

        $order = Order::create([
            'order_code' => 'TS-'.strtoupper(uniqid()),
            'customer_id' => $customer->id,
            'partner_id' => $service->user_id,
            'service_type' => $service->kategori,
            'item_name' => $service->nama.' ('.$this->jenisLabel($service).')',
            'start_date' => $data['tanggalMasuk'],
            'end_date' => $data['tanggalKeluar'],
            'is_pickup' => false,
            'city' => $service->kota,
            'status' => 'baru',
            'total_price' => $service->harga,
            'payment_method' => 'default', // Menggunakan nilai bawaan/default
        ]);

        return redirect()->route('customer.orders.success', $order->id);
    }

    /**
     * GET /app/services/barang/metode-pembayaran
     * Menampilkan halaman pilih metode pembayaran untuk pesanan barang
     */
    public function metodePembayaran()
    {
        $data = session('pesanan_barang');

        if (!$data) {
            return redirect()->route('customer.services.barang.pilihPaket');
        }

        $items = collect(explode(',', $data['namaBarang']))
            ->map(fn ($nama) => trim($nama))
            ->filter();

        $total = $items->count() * 15000;

        return Inertia::render('Customer/Services/Barang/MetodePembayaran', [
            'total' => $total,
        ]);
    }

    /**
     * GET /app/services/{service}/metode-pembayaran
     * Menampilkan halaman pilih metode pembayaran untuk layanan titipan
     */
    public function metodePembayaranLayanan(Service $service)
    {
        return Inertia::render('Customer/Services/MetodePembayaranLayanan', [
            'serviceId' => $service->id,
            'total' => (float) $service->harga,
        ]);
    }

    /**
     * POST /app/services/{service}/konfirmasi
     * Proses konfirmasi pesanan layanan/titipan dengan metode pembayaran
     */
    public function konfirmasiLayanan(Request $request, Service $service)
    {
        $data = $request->validate([
            'payment_method' => 'required|string',
            'tanggalMasuk' => 'required|date',
            'tanggalKeluar' => 'required|date|after_or_equal:tanggalMasuk',
        ]);

        $customer = auth()->user();

        $order = Order::create([
            'order_code' => 'TS-'.strtoupper(uniqid()),
            'customer_id' => $customer->id,
            'partner_id' => $service->user_id,
            'service_type' => $service->kategori,
            'item_name' => $service->nama.' ('.$this->jenisLabel($service).')',
            'start_date' => $data['tanggalMasuk'],
            'end_date' => $data['tanggalKeluar'],
            'is_pickup' => false,
            'city' => $service->kota,
            'status' => 'baru',
            'total_price' => $service->harga,
            'payment_method' => $data['payment_method'],
        ]);

        return redirect()->route('customer.orders.success', $order->id);
    }
}
