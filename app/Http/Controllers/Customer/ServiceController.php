<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\Order;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Biaya tambahan flat kalau customer pilih opsi pickup (barang dijemput,
     * bukan diantar sendiri). Berlaku sekali per pesanan, bukan per hari
     * atau per item.
     *
     * ⚠️ PLACEHOLDER - disesuaikan dari Rp20.000 ke Rp10.000 mengikuti
     * contoh di invoice mockup ("Biaya Pick Up: Rp10.000"). Konfirmasi ke
     * tim/desainer apakah ini angka final.
     */
    protected const BIAYA_PICKUP = 10000;

    /**
     * Persentase biaya layanan yang dikenakan dari Total Harga (subtotal),
     * sesuai invoice mockup ("Biaya Layanan 10%").
     */
    protected const PERSEN_BIAYA_LAYANAN = 10;

    /**
     * Tarif per hari & batas jumlah item untuk tiap kategori ukuran barang,
     * sesuai popup "Information" di mockup Form Penitipan Barang.
     *
     * ⚠️ PLACEHOLDER - cuma tarif 'kecil' yang cocok dengan contoh di
     * mockup (Rp15.000/hari). Tarif 'besar', 'kamar_kecil', dan
     * 'kamar_besar' masih karangan sementara - WAJIB diganti ke nominal
     * bisnis yang sebenarnya sebelum dipakai di production.
     */
    protected const UKURAN_BARANG = [
        'kecil' => [
            'label' => 'Barang Ukuran Kecil',
            'harga_per_hari' => 15000,
            'maks_item' => 2,
            'deskripsi' => 'Khusus penitipan barang berdimensi kecil dengan jumlah maksimal 2 item seperti laptop, tas kecil, koper kecil, box kecil.',
        ],
        'besar' => [
            'label' => 'Barang Ukuran Besar',
            'harga_per_hari' => 25000, // ⚠️ placeholder
            'maks_item' => 1,
            'deskripsi' => 'Khusus penitipan barang berdimensi besar dengan jumlah maksimal 1 item seperti barang elektronik, mebel, koper besar, box besar.',
        ],
        'kamar_kecil' => [
            'label' => 'Barang 1 Kamar Kost Kecil (3x2 m²)',
            'harga_per_hari' => 50000, // ⚠️ placeholder
            'maks_item' => 1,
            'deskripsi' => 'Khusus penitipan barang 1 kamar kos dengan luas kamar 3x2 m².',
        ],
        'kamar_besar' => [
            'label' => 'Barang 1 Kamar Kost Besar (6x4 m²)',
            'harga_per_hari' => 75000, // ⚠️ placeholder
            'maks_item' => 1,
            'deskripsi' => 'Khusus penitipan barang 1 kamar kos dengan luas kamar 6x4 m².',
        ],
    ];

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

    /**
     * GET /app/services/barang
     * Render form Penitipan Barang. Kirim juga daftar alamat customer
     * (untuk alamat pickup) dan daftar kategori ukuran barang beserta
     * tarif & deskripsinya, supaya frontend tidak perlu hardcode nilai ini
     * sendiri-sendiri.
     */
    public function formBarang(Request $request)
    {
        $addresses = $request->user()
            ->addresses()
            ->latest('is_primary')
            ->latest()
            ->get(['id', 'name', 'phone', 'address', 'is_primary']);

        $ukuranBarang = collect(self::UKURAN_BARANG)
            ->map(fn ($tier, $key) => [
                'value' => $key,
                'label' => $tier['label'],
                'hargaPerHari' => $tier['harga_per_hari'],
                'maksItem' => $tier['maks_item'],
                'deskripsi' => $tier['deskripsi'],
            ])
            ->values();

        return Inertia::render('Customer/Services/Barang/Form', [
            'serviceId' => $request->query('service_id'),
            'addresses' => $addresses,
            'ukuranBarangOptions' => $ukuranBarang,
            'biayaPickup' => self::BIAYA_PICKUP,
            'persenBiayaLayanan' => self::PERSEN_BIAYA_LAYANAN,
        ]);
    }

    /**
     * POST /app/services/barang
     * DIREDESAIN: sebelumnya cuma nyimpen data ke session lalu lempar ke
     * halaman "Pemesanan" (review qty) yang baru bikin Order di step
     * terpisah (simpanItemsBarang). Sekarang satu langkah - submit form
     * langsung bikin Order & lempar ke halaman Invoice, sesuai alur baru
     * di mockup ("Form Penitipan Barang" -> langsung "Invoice Belum di
     * bayar", tanpa halaman atur-ulang item di antaranya).
     */
    public function simpanBarang(Request $request)
    {
        $data = $request->validate([
            'namaBarang' => 'required|string|max:255',
            'jumlahBarang' => 'required|integer|min:1',
            'keterangan' => 'nullable|string|max:500',
            'tanggalMasuk' => 'required|date',
            'tanggalKeluar' => 'required|date|after_or_equal:tanggalMasuk',
            'pickup' => 'boolean',
            'jamPickup' => ['nullable', 'date_format:H:i'],
            'ukuranBarang' => ['required', Rule::in(array_keys(self::UKURAN_BARANG))],
            'fotoBarangUrl' => 'nullable|url|max:500',
            'service_id' => 'nullable|integer|exists:services,id',
            'address_id' => [
                'nullable',
                'integer',
                Rule::exists('addresses', 'id')->where('user_id', $request->user()->id),
            ],
            'setuju' => ['accepted'],
        ], [
            'ukuranBarang.required' => 'Pilih ukuran barang.',
            'ukuranBarang.in' => 'Ukuran barang tidak valid.',
            'address_id.exists' => 'Alamat yang dipilih tidak valid.',
            'setuju.accepted' => 'Kamu harus menyetujui Syarat dan Ketentuan.',
        ]);

        $isPickup = (bool) ($data['pickup'] ?? false);

        if ($isPickup && empty($data['jamPickup'])) {
            throw ValidationException::withMessages([
                'jamPickup' => 'Jam pick up harus diisi kalau Layanan Pick Up aktif.',
            ]);
        }

        if ($isPickup && empty($data['address_id'])) {
            throw ValidationException::withMessages([
                'address_id' => 'Pilih alamat penjemputan.',
            ]);
        }

        $tier = self::UKURAN_BARANG[$data['ukuranBarang']];

        if ($data['jumlahBarang'] > $tier['maks_item']) {
            throw ValidationException::withMessages([
                'jumlahBarang' => "Maksimal {$tier['maks_item']} item untuk {$tier['label']}.",
            ]);
        }

        $customer = $request->user();
        $service = !empty($data['service_id']) ? Service::find($data['service_id']) : null;
        $jumlahHari = $this->hitungJumlahHari($data['tanggalMasuk'], $data['tanggalKeluar']);

        $hargaPerHari = (float) $tier['harga_per_hari'];
        $subtotal = $hargaPerHari * $data['jumlahBarang'] * $jumlahHari;
        $pickupFee = $isPickup ? self::BIAYA_PICKUP : 0;
        $biayaLayanan = round($subtotal * self::PERSEN_BIAYA_LAYANAN / 100);
        $total = $subtotal + $pickupFee + $biayaLayanan;

        $address = !empty($data['address_id'])
            ? $customer->addresses()->find($data['address_id'])
            : null;

        $order = Order::create([
            'order_code' => 'TS-'.strtoupper(uniqid()),
            'customer_id' => $customer->id,
            'address_id' => $address?->id,
            'partner_id' => $service?->user_id,
            'service_type' => 'barang',
            'item_name' => $data['namaBarang'],
            'item_description' => $data['keterangan'] ?? null,
            'jumlah_barang' => $data['jumlahBarang'],
            'ukuran_barang' => $data['ukuranBarang'],
            'harga_per_hari' => $hargaPerHari,
            'foto_barang_url' => $data['fotoBarangUrl'] ?? null,
            'start_date' => $data['tanggalMasuk'],
            'end_date' => $data['tanggalKeluar'],
            'duration' => $jumlahHari,
            'is_pickup' => $isPickup,
            'jam_pickup' => $isPickup ? $data['jamPickup'] : null,
            'pickup_address' => $isPickup ? $address?->address : null,
            'city' => $service->kota ?? $customer->city ?? '-',
            'status' => 'baru',
            'subtotal' => $subtotal,
            'discount' => 0,
            'pickup_fee' => $pickupFee,
            'biaya_layanan' => $biayaLayanan,
            'total_price' => $total,
            'payment_method' => 'pending',
            'payment_verified_at' => null,
        ]);

        $this->notifikasiPesananBaru($order);

        return redirect()->route('customer.services.barang.invoice', $order->id);
    }

    /**
     * GET /app/services/barang/{order}/invoice
     * BARU: halaman "Invoice Belum di bayar" sesuai mockup - breakdown
     * harga + tombol "Bayar Langsung" (lempar ke flow pembayaran order
     * yang sudah ada, customer.orders.pembayaran) dan "Kembali Ke Beranda".
     */
    public function invoiceBarang(Order $order)
    {
        abort_unless($order->customer_id === auth()->id(), 403);

        $tier = self::UKURAN_BARANG[$order->ukuran_barang] ?? null;

        return Inertia::render('Customer/Services/Barang/Invoice', [
            'order' => [
                'id' => $order->id,
                'orderCode' => $order->order_code,
                'tanggalDiterbitkan' => $order->created_at->translatedFormat('l, j F Y'),
                'mitraNama' => $order->partner?->name ?? '-',
                'customerNama' => $order->customer->name,
                'customerTelepon' => $order->customer->phone ?? '-',
                'alamatLengkap' => $order->pickup_address ?: '-',
                'namaBarang' => $order->item_name,
                'jumlahBarang' => $order->jumlah_barang,
                'keterangan' => $order->item_description ?: '-',
                'tanggalMasuk' => $order->start_date?->translatedFormat('j F Y'),
                'tanggalKeluar' => $order->end_date?->translatedFormat('j F Y'),
                'durasiHari' => $order->duration,
                'isPickup' => $order->is_pickup,
                'jamPickup' => $order->jam_pickup,
                'ukuranBarangLabel' => $tier['label'] ?? $order->ukuran_barang,
                'nilaiHarga' => (float) $order->harga_per_hari,
                'totalHarga' => (float) $order->subtotal,
                'biayaPickup' => (float) $order->pickup_fee,
                'biayaLayanan' => (float) $order->biaya_layanan,
                'totalPembayaran' => (float) $order->total_price,
                'sudahDibayar' => (bool) $order->payment_verified_at,
            ],
        ]);
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
    public function search(Request $request, string $kategori)
{
    return Inertia::render('Customer/Services/Search', [
        'kategori' => $kategori,
        'detectedKota' => $this->detectKotaFromIp($request), // atau null dulu
        'filters' => $request->only(['kota', 'search']),
        'mitras' => $request->filled('kota')
            ? Mitra::query()
                ->where('kota', $request->kota)
                ->when($request->search, fn($q) => $q->where('nama', 'like', "%{$request->search}%"))
                ->paginate(10)
            : null,
    ]);
}
}