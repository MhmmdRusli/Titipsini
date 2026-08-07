<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\Order;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Biaya tambahan flat kalau customer pilih opsi pickup (barang dijemput,
     * bukan diantar sendiri). Berlaku sekali per pesanan, bukan per hari
     * atau per item. Ubah nilai ini kalau ternyata beda kebijakannya.
     */
    protected const BIAYA_PICKUP = 20000;

    /**
     * Hitung jumlah hari penitipan dari tanggal masuk ke tanggal keluar.
     * Minimal 1 hari supaya checkin == checkout tetap dihargai (bukan 0).
     * Dipakai di SEMUA titik penghitungan harga (barang & layanan) supaya
     * konsisten - jangan hitung durasi manual di tempat lain.
     */
    protected function hitungJumlahHari(string $tanggalMasuk, string $tanggalKeluar): int
    {
        $masuk = Carbon::parse($tanggalMasuk)->startOfDay();
        $keluar = Carbon::parse($tanggalKeluar)->startOfDay();

        return max(1, $masuk->diffInDays($keluar));
    }

    /**
     * Kirim notifikasi ke mitra bahwa ada pesanan baru masuk.
     * Dipanggil setelah Order::create() di titik-titik pemesanan.
     */
    protected function notifikasiPesananBaru(Order $order): void
    {
        if (! $order->partner_id) {
            return;
        }

        Notifikasi::create([
            'user_id' => $order->partner_id,
            'order_id' => $order->id,
            'type' => 'transaksi_masuk',
            'judul' => 'Pesanan Baru Masuk',
            'pesan' => 'Ada pesanan baru dengan kode '.$order->order_code.' menunggu diproses.',
        ]);
    }

    /**
     * Potong saldo customer untuk pembayaran via "Saldo Titipsini".
     * Melempar ValidationException kalau saldo tidak mencukupi, supaya
     * ditangkap otomatis oleh Inertia sebagai error form (payment_method).
     */
    protected function potongSaldo($customer, float $total): void
    {
        if ((float) $customer->saldo < $total) {
            throw ValidationException::withMessages([
                'payment_method' => 'Saldo kamu tidak mencukupi untuk transaksi ini. Silakan top up terlebih dahulu atau pilih metode lain.',
            ]);
        }

        $customer->decrement('saldo', $total);
    }

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
            ->withQueryString()
            ->through(function ($service) {
                $service->foto = $service->foto ? \Illuminate\Support\Facades\Storage::url($service->foto) : null;
                return $service;
            });

        return Inertia::render('Customer/Services/Index', [
            'services' => $services,
            'filters' => [
                'kategori' => $kategori,
                'jenis' => $jenis,
                'search' => $search,
            ],
        ]);
    }

    public function pilihPaket(Request $request)
    {
        return Inertia::render('Customer/Services/PilihPaket', [
            'hargaMulai' => 100000,
            'serviceId' => $request->query('service_id'),
        ]);
    }

    public function formBarang(Request $request)
    {
        return Inertia::render('Customer/Services/Barang/Form', [
            'hargaMulai' => 100000,
            'serviceId' => $request->query('service_id'),
        ]);
    }

    public function simpanBarang(Request $request)
    {
        $data = $request->validate([
            'namaBarang' => 'required|string',
            'pickup' => 'boolean',
            'tanggalMasuk' => 'required|date',
            'tanggalKeluar' => 'required|date|after_or_equal:tanggalMasuk',
            'service_id' => 'nullable|integer|exists:services,id',
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

        // Harga per item diambil dari vendor (Service->harga) yang dipilih customer,
        // bukan angka tetap di kode. Fallback 100000 hanya kalau service_id kosong
        // (customer belum sempat memilih vendor tertentu).
        $service = !empty($data['service_id']) ? Service::find($data['service_id']) : null;
        $hargaPerItem = $service ? (float) $service->harga : 100000;
        $jumlahHari = $this->hitungJumlahHari($data['tanggalMasuk'], $data['tanggalKeluar']);

        $items = collect(explode(',', $data['namaBarang']))
            ->map(fn ($nama) => trim($nama))
            ->filter()
            ->map(fn ($nama) => ['nama' => $nama, 'harga' => $hargaPerItem, 'qty' => 1])
            ->values();

        $customer = auth()->user();
        $isPickup = (bool) $data['pickup'];
        $pickupFee = $isPickup ? self::BIAYA_PICKUP : 0;

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
                'pickup' => $isPickup,
                'jumlahHari' => $jumlahHari,
                'pickupFee' => $pickupFee,
            ],
        ]);
    }

    /**
     * POST /app/services/barang/simpan-item
     * Dipanggil dari tombol "Buat Pesanan" di halaman Pemesanan.
     * LANGSUNG membuat Order (tanpa halaman pilih metode bayar terpisah).
     * payment_method diisi 'pending' dulu - metode bayar aktual (termasuk
     * saldo) baru ditentukan di halaman Success/Pembayaran setelah ini.
     */
    public function simpanItemsBarang(Request $request)
    {
        $data = session('pesanan_barang');

        if (!$data) {
            return redirect()->route('customer.services.barang.pilihPaket');
        }

        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.nama' => ['required', 'string'],
            'items.*.qty' => ['required', 'integer', 'min:1'],
        ]);

        $customer = auth()->user();
        $service = !empty($data['service_id']) ? Service::find($data['service_id']) : null;
        $hargaPerItem = $service ? (float) $service->harga : 100000;
        $jumlahHari = $this->hitungJumlahHari($data['tanggalMasuk'], $data['tanggalKeluar']);

        $items = collect($validated['items']);
        $totalQty = $items->sum('qty');
        $isPickup = (bool) ($data['pickup'] ?? false);
        $pickupFee = $isPickup ? self::BIAYA_PICKUP : 0;

        // Harga = (qty x harga per item x jumlah hari penitipan) + biaya pickup (kalau ada).
        $subtotal = $totalQty * $hargaPerItem * $jumlahHari;
        $total = $subtotal + $pickupFee;
        $itemNames = $items->map(fn ($item) => $item['nama'].' x'.$item['qty'])->implode(', ');

        $order = Order::create([
            'order_code' => 'TS-'.strtoupper(uniqid()),
            'customer_id' => $customer->id,
            'partner_id' => $service?->user_id,
            'service_type' => 'barang',
            'item_name' => $itemNames,
            'start_date' => $data['tanggalMasuk'],
            'end_date' => $data['tanggalKeluar'],
            'is_pickup' => $isPickup,
            'city' => $service->kota ?? $customer->city ?? '-',
            'status' => 'baru',
            'subtotal' => $subtotal,
            'discount' => 0,
            'pickup_fee' => $pickupFee,
            'total_price' => $total,
            'payment_method' => 'pending',
            'payment_verified_at' => null,
        ]);

        $this->notifikasiPesananBaru($order);

        session()->forget(['pesanan_barang', 'pesanan_barang_items']);

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
     * 🟢 PROSES PEMESANAN LAYANAN/TITIPAN LANGSUNG TANPA PILIH METODE (kalau
     * ada flow yang masih memanggil endpoint ini tanpa lewat halaman metode
     * pembayaran). Dibiarkan pakai payment_method default seperti semula.
     * POST /app/services/{service}/pesan
     */
    public function storePesanan(Request $request, Service $service)
    {
        $data = $request->validate([
            'tanggalMasuk' => 'required|date',
            'tanggalKeluar' => 'required|date|after_or_equal:tanggalMasuk',
        ]);

        $customer = auth()->user();
        $jumlahHari = $this->hitungJumlahHari($data['tanggalMasuk'], $data['tanggalKeluar']);
        $total = (float) $service->harga * $jumlahHari;

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
            'subtotal' => $total,
            'discount' => 0,
            'pickup_fee' => 0,
            'total_price' => $total,
            'payment_method' => 'default', // Menggunakan nilai bawaan/default
        ]);

        $this->notifikasiPesananBaru($order);

        return redirect()->route('customer.orders.success', $order->id);
    }

    /**
     * GET /app/services/{service}/metode-pembayaran
     * Menampilkan halaman pilih metode pembayaran untuk layanan titipan.
     * Butuh tanggalMasuk & tanggalKeluar sebagai query string (dikirim dari
     * halaman Show) supaya total yang ditampilkan sudah termasuk durasi.
     */
    public function metodePembayaranLayanan(Request $request, Service $service)
    {
        $tanggalMasuk = $request->query('tanggalMasuk');
        $tanggalKeluar = $request->query('tanggalKeluar');
        $jumlahHari = ($tanggalMasuk && $tanggalKeluar)
            ? $this->hitungJumlahHari($tanggalMasuk, $tanggalKeluar)
            : 1;

        return Inertia::render('Customer/Services/MetodePembayaranLayanan', [
            'serviceId' => $service->id,
            'total' => (float) $service->harga * $jumlahHari,
            'saldo' => (float) auth()->user()->saldo,
            'tanggalMasuk' => $tanggalMasuk,
            'tanggalKeluar' => $tanggalKeluar,
            'jumlahHari' => $jumlahHari,
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
        $isSaldo = $data['payment_method'] === 'saldo';
        $jumlahHari = $this->hitungJumlahHari($data['tanggalMasuk'], $data['tanggalKeluar']);
        $total = (float) $service->harga * $jumlahHari;

        if ($isSaldo) {
            $this->potongSaldo($customer, $total);
        }

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
            'status' => $isSaldo ? 'diproses' : 'baru',
            'subtotal' => $total,
            'discount' => 0,
            'pickup_fee' => 0,
            'total_price' => $total,
            'payment_method' => $data['payment_method'],
            'payment_verified_at' => $isSaldo ? now() : null,
        ]);

        $this->notifikasiPesananBaru($order);

        return redirect()->route('customer.orders.success', $order->id);
    }
}