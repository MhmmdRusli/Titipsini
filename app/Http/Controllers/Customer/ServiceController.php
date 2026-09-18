<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\Order;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
    /**
     * Tarif per hari untuk tiap jenis kendaraan, dipakai form & invoice
     * "Penitipan Kendaraan". Sama sekali terpisah dari UKURAN_BARANG (yang
     * dipakai flow "Penitipan Barang") - jangan disatukan walau labelnya
     * mirip.
     *
     * ⚠️ PLACEHOLDER - cuma 'mobil' yang saya samakan Rp15.000/hari supaya
     * cocok sama contoh angka di mockup invoice ("Kijang pickup" / Mobil ->
     * Nilai harga Rp15.000). Jenis lain (motor, truk, becak, sepeda, bus,
     * mobil_pick_up) masih karangan sementara - WAJIB diganti ke nominal
     * bisnis yang sebenarnya sebelum dipakai di production.
     */
    protected const JENIS_KENDARAAN = [
        'motor' => ['label' => 'Motor', 'harga_per_hari' => 10000, 'dimensi' => '120 x 80 x 100 cm', 'berat' => '150 kg'],
        'mobil' => ['label' => 'Mobil', 'harga_per_hari' => 15000, 'dimensi' => '200 x 150 x 150 cm', 'berat' => '800 kg'],
        'truk' => ['label' => 'Truk', 'harga_per_hari' => 30000, 'dimensi' => '300 x 200 x 200 cm', 'berat' => '2000 kg'],
        'becak' => ['label' => 'Becak', 'harga_per_hari' => 8000, 'dimensi' => '150 x 100 x 100 cm', 'berat' => '100 kg'],
        'sepeda' => ['label' => 'Sepeda', 'harga_per_hari' => 5000, 'dimensi' => '150 x 60 x 100 cm', 'berat' => '20 kg'],
        'bus' => ['label' => 'Bus', 'harga_per_hari' => 40000, 'dimensi' => '600 x 250 x 300 cm', 'berat' => '5000 kg'],
        'mobil_pick_up' => ['label' => 'Mobil pick up', 'harga_per_hari' => 20000, 'dimensi' => '250 x 180 x 180 cm', 'berat' => '1500 kg'],
    ];

    protected const UKURAN_BARANG = [
        'kecil' => [
            'label' => 'S',
            'harga_per_hari' => 15000,
            'maks_item' => 2,
            'deskripsi' => 'Khusus penitipan barang berdimensi kecil dengan jumlah maksimal 2 item seperti laptop, tas kecil, koper kecil, box kecil.',
            'dimensi' => '50 x 40 x 40 cm',
            'berat' => '10 kg',
        ],
        'besar' => [
            'label' => 'M',
            'harga_per_hari' => 25000, // ⚠️ placeholder
            'maks_item' => 1,
            'deskripsi' => 'Khusus penitipan barang berdimensi besar dengan jumlah maksimal 1 item seperti barang elektronik, mebel, koper besar, box besar.',
            'dimensi' => '80 x 60 x 60 cm',
            'berat' => '25 kg',
        ],
        'kamar_kecil' => [
            'label' => 'L',
            'harga_per_hari' => 50000, // ⚠️ placeholder
            'maks_item' => 1,
            'deskripsi' => 'Khusus penitipan barang 1 kamar kos dengan luas kamar 3x2 m².',
            'dimensi' => '120 x 100 x 100 cm',
            'berat' => '50 kg',
        ],
        'kamar_besar' => [
            'label' => 'XL',
            'harga_per_hari' => 75000, // ⚠️ placeholder
            'maks_item' => 1,
            'deskripsi' => 'Khusus penitipan barang 1 kamar kos dengan luas kamar 6x4 m².',
            'dimensi' => '180 x 150 x 150 cm',
            'berat' => '100 kg',
        ],
        'ekstra_besar' => [
            'label' => 'XXL',
            'harga_per_hari' => 100000, // ⚠️ placeholder
            'maks_item' => 1,
            'deskripsi' => 'Khusus penitipan barang dengan ukuran ekstra besar.',
            'dimensi' => '240 x 200 x 200 cm',
            'berat' => '200 kg',
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
     * Blokir pemesanan kalau layanan/mitra belum siap: layanan belum
     * divalidasi, KTP mitra belum terverifikasi, atau jam operasional mitra
     * belum dipasang.
     */
    protected function ensureOrderable(Service $service): void
    {
        abort_unless(
            $service->isOrderable(),
            403,
            'Layanan ini belum siap menerima pesanan (masih dalam proses verifikasi atau belum mengatur jam operasional).'
        );

        abort_unless(
            ! $this->sedangTutupHariIni($service),
            403,
            'Mitra sedang tutup saat ini. Silakan coba lagi di jam operasional.'
        );
    }

    /**
     * Potong saldo customer untuk pembayaran via "Saldo Titipsini".
     * Melempar ValidationException kalau saldo tidak mencukupi, supaya
     * ditangkap otomatis oleh Inertia sebagai error form (payment_method).
     */
    protected function potongSaldo(\App\Models\User $customer, float $total): void
    {
        if ((float) $customer->saldo < $total) {
            throw ValidationException::withMessages([
                'payment_method' => 'Saldo kamu tidak mencukupi untuk transaksi ini. Silakan top up terlebih dahulu atau pilih metode lain.',
            ]);
        }

        $customer->decrement('saldo', $total);
    }

    /**
     * Ambil user login dengan tipe data yang jelas (App\Models\User), supaya
     * Intelephense tidak menganggap method seperti addresses(), saldo, dsb.
     * "tidak ada" — karena $request->user()/auth()->user() secara tipe cuma
     * balikin interface Authenticatable yang tidak mendeklarasikan itu.
     */
    protected function authUser(Request $request): \App\Models\User
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        return $user;
    }

    /**
     * GET /app/services?kategori=kendaraan&jenis=mobil&search=Yogyakarta
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $kategori = $request->string('kategori')->toString();
        $jenis = $request->string('jenis')->toString();
        $search = $request->string('search')->toString();

        if ($kategori === 'kendaraan') {
            return redirect()->route('customer.services.kendaraan.form');
        }

        if ($kategori === 'bangunan' && ! $request->boolean('browse')) {
            return redirect()->route('customer.services.bangunan.form');
        }

        if ($kategori === 'pindahan' && ! $request->boolean('browse')) {
            return redirect()->route('customer.services.pindahan.form');
        }

        if ($kategori === 'barang' && ! $request->boolean('browse')) {
            return redirect()->route('customer.services.barang.landing');
        }

        $services = Service::query()
            ->where('is_active', true)
            ->select('services.*')
            ->selectSub(
                Order::query()->selectRaw('COALESCE(AVG(rating), 0)')
                    ->whereColumn('service_id', 'services.id')
                    ->where('status', 'selesai')
                    ->whereNotNull('rating'),
                'average_rating'
            )
            ->selectSub(
                Order::query()->selectRaw('COUNT(rating)')
                    ->whereColumn('service_id', 'services.id')
                    ->where('status', 'selesai')
                    ->whereNotNull('rating'),
                'review_count'
            )
            ->when($kategori, fn ($query) => $query->where('kategori', $kategori))
            ->when($jenis && $kategori === 'kendaraan', fn ($query) => $query->where('jenis_kendaraan', $jenis))
            ->when($jenis && $kategori === 'bangunan', fn ($query) => $query->where('jenis_bangunan', $jenis))
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kota', 'like', "%{$search}%")
                        ->orWhere('kecamatan', 'like', "%{$search}%");
                });
            })
            ->with('vendor:id,name,verification_status,jadwal_operasional')
            ->orderByRaw("
                CASE 
                    WHEN services.verification_status = 'terverifikasi' 
                         AND EXISTS (
                             SELECT 1 FROM users 
                             WHERE users.id = services.user_id 
                             AND users.verification_status = 'terverifikasi'
                             AND users.jadwal_operasional IS NOT NULL
                             AND users.jadwal_operasional <> '[]'
                         ) THEN 1
                    ELSE 2
                END
            ")
            ->paginate(10)
            ->withQueryString();

        // Get query string from request directly (more reliable)
        $queryString = $request->query->all();

        // Sort within page by status: BUKA > SEDANG TUTUP > SEGERA TERSEDIA
        $now = now('Asia/Jakarta');
        $dayNames = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
        $hariIni = $dayNames[$now->dayOfWeek];
        $nowTime = $now->format('H:i');

        $sortedCollection = $services->getCollection()->map(function ($service) use ($now, $hariIni, $nowTime) {
            $isOrderable = $service->isOrderable();
            $sedangTutup = false;
            
            if ($isOrderable && $service->vendor && $service->vendor->jadwal_operasional) {
                $jadwal = $service->vendor->jadwal_operasional;
                $h = $jadwal[$hariIni] ?? null;
                
                if (! $h || empty($h['aktif'])) {
                    $sedangTutup = true;
                } else {
                    $isOpen = false;
                    foreach (($h['slots'] ?? []) as $slot) {
                        if (empty($slot['aktif']) || empty($slot['jam_buka']) || empty($slot['jam_tutup'])) {
                            continue;
                        }
                        $buka = substr($slot['jam_buka'], 0, 5);
                        $tutup = substr($slot['jam_tutup'], 0, 5);
                        if ($nowTime >= $buka && $nowTime <= $tutup) {
                            $isOpen = true;
                            break;
                        }
                    }
                    $sedangTutup = !$isOpen;
                }
            }
            
            $service->is_orderable = $isOrderable;
            $service->sedang_tutup_hari_ini = $sedangTutup;
            $service->sort_priority = match (true) {
                $isOrderable && !$sedangTutup => 1,
                $isOrderable && $sedangTutup => 2,
                default => 3,
            };
            $service->foto = $service->foto ? \Illuminate\Support\Facades\Storage::url($service->foto) : null;
            $service->fotoKendaraan = $service->foto_kendaraan ? \Illuminate\Support\Facades\Storage::url($service->foto_kendaraan) : null;
            return $service;
        })->sortBy('sort_priority')->values();

        $services = new \Illuminate\Pagination\LengthAwarePaginator(
            $sortedCollection,
            $services->total(),
            $services->perPage(),
            $services->currentPage(),
            ['path' => $services->path(), 'query' => $queryString]
        );

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
        $addresses = $this->authUser($request)
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
                'dimensi' => $tier['dimensi'],
                'berat' => $tier['berat'],
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

    public function landingBarang()
    {
        return Inertia::render('Customer/Services/Barang/Landing', [
            'detectedKota' => 'Yogyakarta',
        ]);
    }

    public function detailBarang(Service $service)
    {
        abort_unless($service->kategori === 'barang' && $service->is_active, 404);

        return Inertia::render('Customer/Services/Barang/DetailMitra', [
            'service' => [
                'id' => $service->id,
                'nama' => $service->nama,
                'mitraNama' => $service->vendor?->name ?? 'Mitra Titipsini',
                'kota' => $service->kota,
                'alamatLengkap' => $service->alamat_lengkap ?: $service->kecamatan,
                'jamBuka' => $service->jam_buka ? Carbon::parse($service->jam_buka)->format('H.i') : '08.00',
                'jamTutup' => $service->jam_tutup ? Carbon::parse($service->jam_tutup)->format('H.i') : '21.00',
                'isBuka' => (bool) $service->is_active,
                'fotoKendaraan' => $service->foto_kendaraan ? \Illuminate\Support\Facades\Storage::url($service->foto_kendaraan) : null,
                ...$this->reviewSummary($service),
                'jadwalOperasional' => $this->jadwalUntukCustomer($service),
                'isOrderable' => $service->isOrderable(),
                'sedangTutupHariIni' => $this->sedangTutupHariIni($service),
            ],
        ]);
    }

    public function formBangunan()
    {
        return Inertia::render('Customer/Services/Bangunan/Landing', [
            'detectedKota' => 'Yogyakarta',
        ]);
    }

    public function formPindahan()
    {
        return Inertia::render('Customer/Services/Pindahan/Landing', [
            'detectedKota' => 'Yogyakarta',
        ]);
    }

    public function formPesanBangunan(Request $request)
    {
        $service = $request->filled('service_id')
            ? Service::where('kategori', 'bangunan')->whereKey($request->service_id)->firstOrFail()
            : null;

        return Inertia::render('Customer/Services/Bangunan/Form', [
            'service' => $service?->only(['id', 'nama', 'harga', 'jenis_bangunan']),
            'buildingOptions' => collect(['rumah', 'apartemen', 'kosan', 'gudang', 'kamar'])
                ->map(fn ($value) => ['value' => $value, 'label' => ucfirst($value)])->values(),
            'addresses' => $this->authUser($request)->addresses()->latest('is_primary')->latest()->get(['id', 'address', 'is_primary']),
        ]);
    }

    public function simpanBangunan(Request $request)
    {
        $data = $request->validate([
            'service_id' => 'required|integer|exists:services,id',
            'namaBangunan' => 'required|string|max:255',
            'jumlahBangunan' => 'required|integer|min:1',
            'keterangan' => 'nullable|string|max:500',
            'tanggalMasuk' => 'required|date',
            'tanggalKeluar' => 'required|date|after_or_equal:tanggalMasuk',
            'address_id' => ['required', 'integer', Rule::exists('addresses', 'id')->where('user_id', $this->authUser($request)->id)],
            'setuju' => ['accepted'],
        ]);

        $service = Service::where('kategori', 'bangunan')->findOrFail($data['service_id']);
        $this->ensureOrderable($service);
        $address = $this->authUser($request)->addresses()->findOrFail($data['address_id']);
        $duration = $this->hitungJumlahHari($data['tanggalMasuk'], $data['tanggalKeluar']);
        $subtotal = (float) $service->harga * $data['jumlahBangunan'] * $duration;
        $fee = round($subtotal * self::PERSEN_BIAYA_LAYANAN / 100);

        $order = Order::create([
            'order_code' => 'TS-'.strtoupper(uniqid()), 'customer_id' => $this->authUser($request)->id,
            'partner_id' => $service->user_id, 'service_id' => $service->id, 'service_type' => 'bangunan',
            'item_name' => $data['namaBangunan'], 'item_description' => $data['keterangan'] ?? null,
            'jumlah_barang' => $data['jumlahBangunan'], 'ukuran_barang' => $service->jenis_bangunan ?: 'bangunan',
            'ukuran_panjang' => $service->panjang, 'ukuran_lebar' => $service->lebar,
            'harga_per_hari' => $service->harga, 'start_date' => $data['tanggalMasuk'], 'end_date' => $data['tanggalKeluar'],
            'duration' => $duration, 'is_pickup' => false, 'pickup_address' => $address->address,
            'city' => $service->kota, 'status' => 'baru', 'subtotal' => $subtotal, 'discount' => 0,
            'pickup_fee' => 0, 'biaya_layanan' => $fee, 'total_price' => $subtotal + $fee,
            'payment_method' => 'pending', 'payment_verified_at' => null,
        ]);

        $this->notifikasiPesananBaru($order);
        return redirect()->route('customer.services.bangunan.invoice', $order->id);
    }

    public function detailBangunan(Service $service)
    {
        abort_unless($service->kategori === 'bangunan' && $service->is_active, 404);

        return Inertia::render('Customer/Services/Bangunan/Detail', [
            'mitra' => array_merge(
                $this->formatMitraKendaraan($service),
                $this->reviewSummary($service),
                [
                    'jadwalOperasional' => $this->jadwalUntukCustomer($service),
                    'isOrderable' => $service->isOrderable(),
                    'sedangTutupHariIni' => $this->sedangTutupHariIni($service),
                ]
            ),
        ]);
    }

    public function pesanBangunan(Service $service)
    {
        abort_unless($service->kategori === 'bangunan' && $service->is_active, 404);

        return redirect()->route('customer.services.bangunan.form.pesan', [
            'service_id' => $service->id,
        ]);
    }

    public function invoiceBangunan(Order $order)
    {
        abort_unless($order->customer_id === Auth::id() && $order->service_type === 'bangunan', 403);
        $customer = $order->customer;

        return Inertia::render('Customer/Services/Bangunan/Invoice', ['order' => [
            'id' => $order->id, 'orderCode' => $order->order_code,
            'tanggalDiterbitkan' => $order->created_at->translatedFormat('l, j F Y'),
            'mitraNama' => $order->partner?->name ?? '-', 'customerNama' => $customer->name,
            'customerTelepon' => $customer->phone ?? '-', 'alamatLengkap' => $order->pickup_address ?: '-',
            'namaBangunan' => $order->item_name, 'jenisBangunanLabel' => ucfirst(str_replace('_', ' ', $order->ukuran_barang)),
            'ukuranPanjang' => $order->ukuran_panjang, 'ukuranLebar' => $order->ukuran_lebar,
            'jumlahBangunan' => $order->jumlah_barang, 'keterangan' => $order->item_description ?: '-',
            'tanggalMasuk' => $order->start_date?->translatedFormat('j F Y'), 'tanggalKeluar' => $order->end_date?->translatedFormat('j F Y'),
            'durasiHari' => $order->duration, 'nilaiHarga' => (float) $order->harga_per_hari,
            'totalHarga' => (float) $order->subtotal, 'biayaLayanan' => (float) $order->biaya_layanan,
            'totalPembayaran' => (float) $order->total_price, 'sudahDibayar' => (bool) $order->payment_verified_at,
        ]]);
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
            'fotoBarang' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
            'service_id' => 'nullable|integer|exists:services,id',
            'address_id' => [
                'nullable',
                'integer',
                Rule::exists('addresses', 'id')->where('user_id', $this->authUser($request)->id),
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

        $customer = $this->authUser($request);
        $service = !empty($data['service_id']) ? Service::find($data['service_id']) : null;

        if ($service) {
            $this->ensureOrderable($service);
        }

        $jumlahHari = $this->hitungJumlahHari($data['tanggalMasuk'], $data['tanggalKeluar']);

        $hargaPerHari = (float) $tier['harga_per_hari'];
        $subtotal = $hargaPerHari * $data['jumlahBarang'] * $jumlahHari;
        $pickupFee = $isPickup ? self::BIAYA_PICKUP : 0;
        $biayaLayanan = round($subtotal * self::PERSEN_BIAYA_LAYANAN / 100);
        $total = $subtotal + $pickupFee + $biayaLayanan;

        $address = !empty($data['address_id'])
            ? $customer->addresses()->find($data['address_id'])
            : null;
        $fotoBarangPath = $request->file('fotoBarang')->store('barang', 'public');

        $order = Order::create([
            'order_code' => 'TS-'.strtoupper(uniqid()),
            'customer_id' => $customer->id,
            'address_id' => $address?->id,
            'partner_id' => $service?->user_id,
            'service_id' => $service?->id,
            'service_type' => 'barang',
            'item_name' => $data['namaBarang'],
            'item_description' => $data['keterangan'] ?? null,
            'jumlah_barang' => $data['jumlahBarang'],
            'ukuran_barang' => $data['ukuranBarang'],
            'harga_per_hari' => $hargaPerHari,
            'foto_barang_url' => $fotoBarangPath,
            'start_date' => $data['tanggalMasuk'],
            'end_date' => $data['tanggalKeluar'],
            'duration' => $jumlahHari,
            'is_pickup' => $isPickup,
            'jam_pickup' => $isPickup ? $data['jamPickup'] : null,
            'pickup_address' => $isPickup ? $address?->address : null,
            'city' => $service->kabupaten_kota ?? $service->kota ?? $customer->city ?? '-',
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
        abort_unless($order->customer_id === Auth::id(), 403);

        $tier = self::UKURAN_BARANG[$order->ukuran_barang] ?? null;

        return Inertia::render('Customer/Services/Barang/Invoice', [
            'order' => [
                'id' => $order->id,
                'orderCode' => $order->order_code,
                'tanggalDiterbitkan' => Carbon::parse($order->created_at)->translatedFormat('l, j F Y'),
                'mitraNama' => $order->partner?->name ?? '-',
                'customerNama' => $order->customer->name,
                'customerTelepon' => $order->customer->phone ?? '-',
                'alamatLengkap' => $order->pickup_address ?: '-',
                'namaBarang' => $order->item_name,
                'jumlahBarang' => $order->jumlah_barang,
                'keterangan' => $order->item_description ?: '-',
                'tanggalMasuk' => $order->start_date ? Carbon::parse($order->start_date)->translatedFormat('j F Y') : '-',
                'tanggalKeluar' => $order->end_date ? Carbon::parse($order->end_date)->translatedFormat('j F Y') : '-',
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

    /**
     * GET /app/services/kendaraan
     * Render form Penitipan Kendaraan. Beda dari Barang: tidak ada opsi
     * pickup (mockup tidak menampilkan toggle/alamat penjemputan untuk
     * kendaraan), jadi tidak perlu kirim daftar alamat.
     */
    public function formKendaraan(Request $request)
    {
        return Inertia::render('Customer/Services/Kendaraan/Landing', [
            'detectedKota' => 'Yogyakarta',
        ]);
    }

    public function detailKendaraan(Service $service)
    {
        abort_unless($service->kategori === 'kendaraan' && $service->is_active, 404);

        return Inertia::render('Customer/Services/Kendaraan/Detail', [
            'mitra' => array_merge(
                $this->formatMitraKendaraan($service),
                $this->reviewSummary($service),
                ['jadwalOperasional' => $this->jadwalUntukCustomer($service), 'sedangTutupHariIni' => $this->sedangTutupHariIni($service)]
            ),
        ]);
    }

    public function detailPindahan(Service $service)
    {
        abort_unless($service->kategori === 'pindahan' && $service->is_active, 404);

        return Inertia::render('Customer/Services/Pindahan/Detail', [
            'mitra' => array_merge(
                $this->formatMitraKendaraan($service),
                $this->reviewSummary($service),
                ['jadwalOperasional' => $this->jadwalUntukCustomer($service), 'sedangTutupHariIni' => $this->sedangTutupHariIni($service)]
            ),
        ]);
    }

    public function invoicePindahan(Order $order)
    {
        abort_unless($order->customer_id === Auth::id() && $order->service_type === 'pindahan', 403);

        return Inertia::render('Customer/Services/Pindahan/Invoice', [
            'order' => [
                'id' => $order->id,
                'orderCode' => $order->order_code,
                'tanggalDiterbitkan' => $order->created_at->translatedFormat('l, j F Y'),
                'mitraNama' => $order->partner?->name ?? '-',
                'customerNama' => $order->customer->name,
                'customerTelepon' => $order->customer->phone ?? '-',
                'alamatLengkap' => $order->pickup_address ?: '-',
                'namaPindahan' => $order->item_name,
                'jumlahBarang' => $order->jumlah_barang,
                'keterangan' => $order->item_description ?: '-',
                'tanggalMasuk' => $order->start_date?->translatedFormat('j F Y'),
                'tanggalKeluar' => $order->end_date?->translatedFormat('j F Y'),
                'durasiHari' => $order->duration,
                'nilaiHarga' => (float) $order->harga_per_hari,
                'totalHarga' => (float) $order->subtotal,
                'biayaLayanan' => (float) $order->biaya_layanan,
                'totalPembayaran' => (float) $order->total_price,
                'sudahDibayar' => (bool) $order->payment_verified_at,
            ],
        ]);
    }

    public function formPesanKendaraan(Request $request)
    {
        $jenisKendaraan = collect(self::JENIS_KENDARAAN)
            ->map(fn ($tier, $key) => [
                'value' => $key,
                'label' => $tier['label'],
                'hargaPerHari' => $tier['harga_per_hari'],
                'dimensi' => $tier['dimensi'],
                'berat' => $tier['berat'],
            ])->values();

        return Inertia::render('Customer/Services/Kendaraan/Form', [
            'serviceId' => $request->query('service_id'),
            'jenisKendaraanOptions' => $jenisKendaraan,
            'persenBiayaLayanan' => self::PERSEN_BIAYA_LAYANAN,
        ]);
    }

    public function pesanKendaraan(Service $service)
    {
        abort_unless($service->kategori === 'kendaraan' && $service->is_active, 404);

        return redirect()->route('customer.services.kendaraan.form.pesan', [
            'service_id' => $service->id,
        ]);
    }

    /**
     * POST /app/services/kendaraan
     * Satu langkah, sama seperti simpanBarang() - submit langsung bikin
     * Order & lempar ke halaman Invoice.
     *
     * CATATAN: kolom 'ukuran_barang' & 'harga_per_hari' dipakai ulang untuk
     * menyimpan jenis kendaraan & tarifnya (bukan bikin migration/kolom
     * baru khusus kendaraan) - kolom-kolom ini memang generik dipakai
     * bareng across service_type ('barang' vs 'kendaraan'), sama seperti
     * item_name/item_description yang sudah dipakai bersama sejak awal.
     */
    public function simpanKendaraan(Request $request)
    {
        $data = $request->validate([
            'merekKendaraan' => 'required|string|max:255',
            'jenisKendaraan' => ['required', Rule::in(array_keys(self::JENIS_KENDARAAN))],
            'jumlahKendaraan' => 'required|integer|min:1',
            'keterangan' => 'nullable|string|max:500',
            'tanggalMasuk' => 'required|date',
            'tanggalKeluar' => 'required|date|after_or_equal:tanggalMasuk',
            'service_id' => 'nullable|integer|exists:services,id',
            'setuju' => ['accepted'],
        ], [
            'jenisKendaraan.required' => 'Pilih jenis kendaraan.',
            'jenisKendaraan.in' => 'Jenis kendaraan tidak valid.',
            'setuju.accepted' => 'Kamu harus menyetujui Syarat dan Ketentuan.',
        ]);

        $tier = self::JENIS_KENDARAAN[$data['jenisKendaraan']];

        $customer = $this->authUser($request);
        $service = !empty($data['service_id']) ? Service::find($data['service_id']) : null;

        if ($service) {
            $this->ensureOrderable($service);
        }

        $jumlahHari = $this->hitungJumlahHari($data['tanggalMasuk'], $data['tanggalKeluar']);

        $hargaPerHari = (float) $tier['harga_per_hari'];
        $subtotal = $hargaPerHari * $data['jumlahKendaraan'] * $jumlahHari;
        $biayaLayanan = round($subtotal * self::PERSEN_BIAYA_LAYANAN / 100);
        $total = $subtotal + $biayaLayanan;

        $order = Order::create([
            'order_code' => 'TS-'.strtoupper(uniqid()),
            'customer_id' => $customer->id,
            'partner_id' => $service?->user_id,
            'service_id' => $service?->id,
            'service_type' => 'kendaraan',
            'item_name' => $data['merekKendaraan'],
            'item_description' => $data['keterangan'] ?? null,
            'jumlah_barang' => $data['jumlahKendaraan'],
            'ukuran_barang' => $data['jenisKendaraan'],
            'harga_per_hari' => $hargaPerHari,
            'start_date' => $data['tanggalMasuk'],
            'end_date' => $data['tanggalKeluar'],
            'duration' => $jumlahHari,
            'is_pickup' => false,
            'city' => $service->kota ?? $customer->city ?? '-',
            'status' => 'baru',
            'subtotal' => $subtotal,
            'discount' => 0,
            'pickup_fee' => 0,
            'biaya_layanan' => $biayaLayanan,
            'total_price' => $total,
            'payment_method' => 'pending',
            'payment_verified_at' => null,
        ]);

        $this->notifikasiPesananBaru($order);

        return redirect()->route('customer.services.kendaraan.invoice', $order->id);
    }

    /**
     * GET /app/services/kendaraan/{order}/invoice
     *
     * CATATAN: mockup invoice tetap menampilkan "Alamat Lengkap" walau form
     * kendaraan tidak punya field pilih alamat (tidak ada opsi pickup) -
     * asumsi saya, ini alamat utama dari address book customer (buat
     * catatan/identitas, bukan alamat penjemputan). Kalau ternyata bukan
     * itu maksudnya, kasih tau supaya saya sesuaikan sumbernya.
     */
    public function invoiceKendaraan(Order $order)
    {
        abort_unless($order->customer_id === Auth::id(), 403);

        $tier = self::JENIS_KENDARAAN[$order->ukuran_barang] ?? null;

        $alamatUtama = $order->customer->addresses()->where('is_primary', true)->first()
            ?? $order->customer->addresses()->first();

        return Inertia::render('Customer/Services/Kendaraan/Invoice', [
            'order' => [
                'id' => $order->id,
                'orderCode' => $order->order_code,
                'tanggalDiterbitkan' => Carbon::parse($order->created_at)->translatedFormat('l, j F Y'),
                'mitraNama' => $order->partner?->name ?? '-',
                'customerNama' => $order->customer->name,
                'customerTelepon' => $order->customer->phone ?? '-',
                'alamatLengkap' => $alamatUtama?->address ?? '-',
                'merekKendaraan' => $order->item_name,
                'jenisKendaraanLabel' => $tier['label'] ?? $order->ukuran_barang,
                'jumlahKendaraan' => $order->jumlah_barang,
                'keterangan' => $order->item_description ?: '-',
                'tanggalMasuk' => $order->start_date ? Carbon::parse($order->start_date)->translatedFormat('j F Y') : '-',
                'tanggalKeluar' => $order->end_date ? Carbon::parse($order->end_date)->translatedFormat('j F Y') : '-',
                'durasiHari' => $order->duration,
                'nilaiHarga' => (float) $order->harga_per_hari,
                'totalHarga' => (float) $order->subtotal,
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
    public function show(Request $request, Service $service)
    {
        abort_unless($service->isOrderable(), 404);

        if ($service->kategori === 'kendaraan') {
            return redirect()->route('customer.services.kendaraan.form', [
                'service_id' => $service->id,
            ]);
        }

        if ($service->kategori === 'bangunan') {
            return redirect()->route('customer.services.bangunan.form', ['service_id' => $service->id]);
        }

        return Inertia::render('Customer/Services/Pindahan/Form', [
            'service' => [
                'id' => $service->id,
                'nama' => $service->nama,
                'kota' => $service->kota,
                'kecamatan' => $service->kecamatan,
                'kategori' => $service->kategori,
                'jenisLabel' => $this->jenisLabel($service),
                'harga' => (float) $service->harga,
            ],
            'addresses' => $this->authUser($request)
                ->addresses()
                ->latest('is_primary')
                ->latest()
                ->get(['id', 'name', 'phone', 'address', 'is_primary']),
            'persenBiayaLayanan' => self::PERSEN_BIAYA_LAYANAN,
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
        $this->ensureOrderable($service);

        $data = $request->validate([
            'tanggalMasuk' => 'required|date',
            'tanggalKeluar' => 'required|date|after_or_equal:tanggalMasuk',
            'address_id' => ['required', 'integer', Rule::exists('addresses', 'id')->where('user_id', $this->authUser($request)->id)],
            'setuju' => ['accepted'],
        ]);

        $customer = $this->authUser($request);
        $address = $customer->addresses()->findOrFail($data['address_id']);
        $jumlahHari = $this->hitungJumlahHari($data['tanggalMasuk'], $data['tanggalKeluar']);
        $hargaPerHari = (float) $service->harga;
        $subtotal = $hargaPerHari * $jumlahHari;
        $biayaLayanan = round($subtotal * self::PERSEN_BIAYA_LAYANAN / 100);
        $total = $subtotal + $biayaLayanan;

        $order = Order::create([
            'order_code' => 'TS-'.strtoupper(uniqid()),
            'customer_id' => $customer->id,
            'partner_id' => $service->user_id,
            'service_id' => $service->id,
            'service_type' => $service->kategori,
            'item_name' => $service->nama.' ('.$this->jenisLabel($service).')',
            'harga_per_hari' => $hargaPerHari,
            'start_date' => $data['tanggalMasuk'],
            'end_date' => $data['tanggalKeluar'],
            'duration' => $jumlahHari,
            'is_pickup' => false,
            'address_id' => $address->id,
            'pickup_address' => $address->address,
            'city' => $service->kota,
            'status' => 'baru',
            'subtotal' => $subtotal,
            'discount' => 0,
            'pickup_fee' => 0,
            'biaya_layanan' => $biayaLayanan,
            'total_price' => $total,
            'payment_method' => 'default', // Menggunakan nilai bawaan/default
        ]);

        $this->notifikasiPesananBaru($order);

        if ($service->kategori === 'pindahan') {
            return redirect()->route('customer.services.pindahan.invoice', $order->id);
        }

        return redirect()->route('customer.orders.show', $order->id);
    }

    /**
     * GET /app/services/{service}/metode-pembayaran
     * Menampilkan halaman pilih metode pembayaran untuk layanan titipan.
     * Butuh tanggalMasuk & tanggalKeluar sebagai query string (dikirim dari
     * halaman Show) supaya total yang ditampilkan sudah termasuk durasi.
     */
    public function metodePembayaranLayanan(Request $request, Service $service)
    {
        $this->ensureOrderable($service);

        $tanggalMasuk = $request->query('tanggalMasuk');
        $tanggalKeluar = $request->query('tanggalKeluar');
        $jumlahHari = ($tanggalMasuk && $tanggalKeluar)
            ? $this->hitungJumlahHari($tanggalMasuk, $tanggalKeluar)
            : 1;

        return Inertia::render('Customer/Services/MetodePembayaranLayanan', [
            'serviceId' => $service->id,
            'total' => (float) $service->harga * $jumlahHari,
            'saldo' => (float) $this->authUser($request)->saldo,
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
        $this->ensureOrderable($service);

        $data = $request->validate([
            'payment_method' => 'required|string',
            'tanggalMasuk' => 'required|date',
            'tanggalKeluar' => 'required|date|after_or_equal:tanggalMasuk',
        ]);

        $customer = $this->authUser($request);
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
            'service_id' => $service->id,
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
    public function search(Request $request, string $kategori = 'kendaraan')
    {
        $services = Service::query()
            ->where('kategori', $kategori)
            ->where('is_active', true)
            ->with('vendor:id,name,verification_status,jadwal_operasional')
            ->when($request->filled('kota'), fn ($query) => $query->where('kota', $request->string('kota')))
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search');
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('kota', 'like', "%{$search}%")
                        ->orWhere('kecamatan', 'like', "%{$search}%");
                });
            })
            ->orderByRaw("
                CASE 
                    WHEN services.verification_status = 'terverifikasi' 
                         AND EXISTS (
                             SELECT 1 FROM users 
                             WHERE users.id = services.user_id 
                             AND users.verification_status = 'terverifikasi'
                             AND users.jadwal_operasional IS NOT NULL
                             AND users.jadwal_operasional <> '[]'
                         ) THEN 1
                    ELSE 2
                END
            ")
            ->latest()
            ->paginate(10);

        // Get query string from request directly (more reliable)
        $queryString = $request->query->all();

        // Sort within page: 
        // 1. Orderable & currently OPEN
        // 2. Orderable but currently CLOSED (sedang tutup)
        // 3. Not orderable (segera tersedia)
        $sortedCollection = $services->getCollection()->transform(function ($service) {
            $formatted = $this->formatMitraKendaraan($service);
            $formatted['sort_priority'] = match (true) {
                $formatted['is_orderable'] !== false && !$formatted['sedang_tutup_hari_ini'] => 1,
                $formatted['is_orderable'] !== false && $formatted['sedang_tutup_hari_ini'] => 2,
                default => 3,
            };
            return $formatted;
        })->sortBy('sort_priority')->values();

        // Create new paginator with sorted collection to preserve pagination metadata
        $services = new \Illuminate\Pagination\LengthAwarePaginator(
            $sortedCollection,
            $services->total(),
            $services->perPage(),
            $services->currentPage(),
            ['path' => $services->path(), 'query' => $queryString]
        );

        return Inertia::render('Customer/Services/Search', [
            'kategori' => $kategori,
            'detectedKota' => 'Yogyakarta',
            'openCityPicker' => $request->boolean('pilih_kota'),
            'filters' => $request->only(['kota', 'search']),
            'mitras' => $request->filled('kota') ? $services : null,
        ]);
    }

    public function searchBangunan(Request $request)
    {
        return $this->search($request, 'bangunan');
    }

    public function searchBarang(Request $request)
    {
        return $this->search($request, 'barang');
    }

    public function searchPindahan(Request $request)
    {
        return $this->search($request, 'pindahan');
    }

    protected function formatMitraKendaraan(Service $service): array
    {
        return [
            'id' => $service->id,
            'nama' => $service->nama,
            'mitraNama' => $service->vendor?->name ?? 'Mitra Titipsini',
            'alamat' => $service->alamat_lengkap ?: $service->kecamatan,
            'kota' => $service->kota,
            'kecamatan' => $service->kecamatan,
            'jam_buka' => $service->jam_buka ? Carbon::parse($service->jam_buka)->format('H.i') : '08.00',
            'jam_tutup' => $service->jam_tutup ? Carbon::parse($service->jam_tutup)->format('H.i') : '21.00',
            'isBuka' => (bool) $service->is_active,
            'fotoKendaraan' => $service->foto_kendaraan ? \Illuminate\Support\Facades\Storage::url($service->foto_kendaraan) : null,
            'fotoUrl' => $service->foto ? \Illuminate\Support\Facades\Storage::url($service->foto) : null,
            'is_orderable' => $service->isOrderable(),
            'sedang_tutup_hari_ini' => $this->sedangTutupHariIni($service),
        ];
    }

    /**
     * True kalau layanan orderable, hari ini ada di jadwal_operasional tapi
     * TIDAK ada slot yang sedang berjalan (toko tutup sekarang). Dipakai
     * supaya list menampilkan "Sedang Tutup" (bukan "Segera Tersedia" yang
     * membingungkan), dan tombol "Titip Disini" dinonaktifkan.
     */
    protected function sedangTutupHariIni(Service $service): bool
    {
        if (! $service->isOrderable()) {
            return false;
        }

        $jadwal = $service->vendor?->jadwal_operasional ?? [];
        if (! is_array($jadwal) || empty($jadwal)) {
            return false;
        }

        $hariIni = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'][now('Asia/Jakarta')->dayOfWeek];

        $h = $jadwal[$hariIni] ?? null;
        if (! $h || empty($h['aktif'])) {
            return true;
        }

        $jamSekarang = now('Asia/Jakarta')->format('H:i:s');

        foreach (($h['slots'] ?? []) as $slot) {
            if (empty($slot['aktif']) || empty($slot['jam_buka']) || empty($slot['jam_tutup'])) {
                continue;
            }

            $buka = substr($slot['jam_buka'], 0, 8);
            $tutup = substr($slot['jam_tutup'], 0, 8);

            if ($jamSekarang >= $buka && $jamSekarang <= $tutup) {
                return false;
            }
        }

        return true;
    }

    protected function reviewSummary(Service $service): array
    {
        $reviews = Order::query()
            ->where('service_id', $service->id)
            ->where('status', 'selesai')
            ->whereNotNull('rating')
            ->with('customer:id,name')
            ->latest()
            ->get(['id', 'customer_id', 'rating', 'review', 'created_at']);

        return [
            'averageRating' => round((float) $reviews->avg('rating'), 1),
            'reviewCount' => $reviews->count(),
            'reviews' => $reviews->map(fn ($review) => [
                'id' => $review->id,
                'customerName' => $review->customer?->name ?? 'Customer',
                'rating' => $review->rating,
                'review' => $review->review,
                'createdAt' => $review->created_at?->translatedFormat('j F Y'),
            ])->values()->all(),
        ];
    }

    /**
     * Susun jadwal operasional mitra jadi array berurutan Senin-Minggu
     * supaya bisa ditampilkan ke customer (hari buka + jam per hari).
     * Diambil dari users.jadwal_operasional (bukan dari jam_buka statis).
     */
    protected function jadwalUntukCustomer(Service $service): array
    {
        $jadwal = $service->vendor?->jadwal_operasional ?? [];
        $hariList = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
        $label = [
            'senin' => 'Senin', 'selasa' => 'Selasa', 'rabu' => 'Rabu',
            'kamis' => 'Kamis', 'jumat' => 'Jumat', 'sabtu' => 'Sabtu', 'minggu' => 'Minggu',
        ];

        return collect($hariList)->map(function ($key) use ($jadwal, $label) {
            $h = $jadwal[$key] ?? null;
            $aktif = ! empty($h['aktif']);
            $slots = collect($h['slots'] ?? [])
                ->filter(fn ($s) => ! empty($s['aktif']) && ! empty($s['jam_buka']) && ! empty($s['jam_tutup']))
                ->map(fn ($s) => ['jam_buka' => $s['jam_buka'], 'jam_tutup' => $s['jam_tutup']])
                ->values()
                ->all();

            return [
                'key' => $key,
                'hari' => $label[$key],
                'aktif' => $aktif && count($slots) > 0,
                'slots' => $slots,
            ];
        })->all();
    }
}