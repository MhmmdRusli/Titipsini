<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\KondisiAwal;
use App\Models\Notifikasi;
use App\Models\Order;
use App\Services\OrderFaseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Label fase yang ditampilkan ke user, beda-beda per kategori layanan
     * meskipun kode fase di database sama (menunggu/berjalan/akhir).
     *
     * CATATAN: sistem 'fase' ini HANYA relevan untuk order-order lama
     * (peninggalan alur COD) yang statusnya masih 'diproses' dan kolom
     * fase-nya sudah terisi. Order baru TIDAK PERNAH mengisi fase - lihat
     * guard di updateFase() di bawah.
     */
    public const FASE_LABELS = [
        'barang' => [
            'menunggu' => 'Menunggu Pickup',
            'berjalan' => 'Dititipkan',
            'akhir' => 'Diambil Kembali',
        ],
        'bangunan' => [
            'menunggu' => 'Menunggu Konfirmasi',
            'berjalan' => 'Sedang Disewa',
            'akhir' => 'Sewa Berakhir',
        ],
        'kendaraan' => [
            'menunggu' => 'Menunggu Serah Terima',
            'berjalan' => 'Sedang Dipakai',
            'akhir' => 'Dikembalikan',
        ],
        'pindahan' => [
            'menunggu' => 'Dijadwalkan',
            'berjalan' => 'Proses Pindahan',
            'akhir' => 'Selesai Pindahan',
        ],
    ];

    public const FASE_ACTION_LABELS = [
        'barang' => [
            'menunggu' => 'Tandai Sudah Dititip',
            'berjalan' => 'Tandai Sudah Diambil',
        ],
        'bangunan' => [
            'menunggu' => 'Mulai Masa Sewa',
            'berjalan' => 'Tandai Sewa Berakhir',
        ],
        'kendaraan' => [
            'menunggu' => 'Tandai Sudah Diserahkan',
            'berjalan' => 'Tandai Sudah Dikembalikan',
        ],
        'pindahan' => [
            'menunggu' => 'Mulai Proses Pindahan',
            'berjalan' => 'Tandai Pindahan Selesai',
        ],
    ];

    private const NEXT_FASE = [
        'menunggu' => 'berjalan',
        'berjalan' => 'akhir',
    ];

    public function index(Request $request): Response
    {
        $partner = Auth::user();

        $tab = $request->query('tab', 'baru'); // baru | selesai | dibatalkan
        $kategori = $request->query('kategori'); // barang | kendaraan | bangunan | null

        $query = Order::with(['customer', 'address'])->where('partner_id', $partner->id);

        if ($tab === 'baru') {
            // Alur QRIS: Finance sudah verifikasi → status 'pembayaran_diterima',
            // lalu mitra ambil → 'diproses_mitra' / 'dikirim'.
            // Backward compatibility: tetap include 'baru' dan 'diproses'
            // untuk data lama yang belum melalui verifikasi Finance.
            $query->whereIn('status', [
                'pembayaran_diterima',
                'diproses_mitra',
                'dikirim',
                'baru',
                'diproses',
            ]);
        } else {
            $query->where('status', $tab === 'dibatalkan' ? 'dibatalkan' : 'selesai');
        }

        if ($kategori) {
            $query->where('service_type', $kategori);
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        $orders->getCollection()->transform(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_code,
                'customer_name' => $order->customer->name ?? '-',
                'address' => $order->address?->address ?? $order->pickup_address ?? $order->city ?? '-',
                'address_notes' => $order->address?->notes,
                'service_type' => $order->service_type,
                'service_label' => match ($order->service_type) {
                    'barang' => 'Penitipan Barang',
                    'kendaraan' => 'Penitipan Kendaraan',
                    'bangunan' => 'Penitipan Bangunan',
                    'pindahan' => 'Layanan Pindahan',
                    default => 'Penitipan',
                },
                'duration' => $this->hitungDurasi($order),
                'total_price' => (float) $order->total_price,
                'rating' => $order->rating,
                'review' => $order->review,
                'status' => $order->status,
                'fase' => $order->fase,
                'fase_label' => \App\Services\OrderFaseService::label($order->service_type, $order->fase, (bool) $order->has_pickup),
                'pickup_requested_at' => optional($order->pickup_requested_at)->format('d M Y, H:i'),
                'has_pickup' => (bool) $order->has_pickup,
            ];
        });

        $counts = [
            'baru' => Order::where('partner_id', $partner->id)
                ->whereIn('status', [
                    'pembayaran_diterima',
                    'diproses_mitra',
                    'dikirim',
                    'baru',
                    'diproses',
                ])
                ->count(),
            'selesai' => Order::where('partner_id', $partner->id)->where('status', 'selesai')->count(),
            'dibatalkan' => Order::where('partner_id', $partner->id)->where('status', 'dibatalkan')->count(),
        ];

        return Inertia::render('Mitra/Orders/Index', [
            'orders' => $orders,
            'counts' => $counts,
            'filters' => [
                'tab' => $tab,
                'kategori' => $kategori,
            ],
        ]);
    }

    public function show(Order $order): Response
    {
        abort_unless($order->partner_id === Auth::id(), 403);

        $order->load(['customer', 'address']);

        $subtotal = $order->subtotal > 0 ? $order->subtotal : $order->total_price;
        $discount = $order->discount ?? 0;
        $pickupFee = $order->pickup_fee ?? 0;

        $nextFaseAction = self::FASE_ACTION_LABELS[$order->service_type][$order->fase] ?? null;

        // Approve "dititipkan" (menunggu -> berjalan) baru boleh dilakukan
        // setelah pembayaran diverifikasi. Untuk saldo, payment_verified_at
        // sudah otomatis terisi saat bayar (mitra cukup 1x approve). Untuk
        // transfer/QRIS/COD, mitra wajib approve pembayaran dulu (approve 1)
        // sebelum bisa approve tahap ini (approve 2).
        $paymentBelumVerified = $order->fase === 'menunggu' && $order->payment_verified_at === null;

        return Inertia::render('Mitra/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_code,
                'status' => $order->status,
                'cancel_reason' => $order->cancel_reason,
                'service_type' => $order->service_type,
                'has_pickup' => (bool) $order->has_pickup,
                'customer' => [
                    'name' => $order->customer->name ?? '-',
                    'phone' => $order->customer->phone ?? '-',
                    'code' => $order->customer?->customer_code,
                ],
                'pickup_address' => $order->pickup_address,
                'dropoff_address' => $order->dropoff_address,
                'address_notes' => $order->address?->notes,
                'item_description' => $order->item_name,
                'duration' => $this->hitungDurasi($order),
                'pickup_status' => $order->is_pickup ? 'Dijemput oleh mitra' : 'Diantar sendiri oleh customer',
                'jam_pickup' => $order->jam_pickup ? Carbon::parse($order->jam_pickup)->format('H:i') : null,
                'subtotal' => (float) $subtotal,
                'discount' => (float) $discount,
                'pickup_fee' => (float) $pickupFee,
                'total' => (float) $order->total_price,
                'created_at' => optional($order->created_at)->format('d M Y, H:i'),
                'payment_method' => $order->payment_method,
                'payment_receipt' => $order->payment_receipt ? Storage::disk('public')->url($order->payment_receipt) : null,
                'payment_verified_at' => optional($order->payment_verified_at)->format('d M Y, H:i'),
                'pickup_requested_at' => optional($order->pickup_requested_at)->format('d M Y, H:i'),

                'denda' => (float) $order->denda,
                'bukti_denda' => $order->bukti_denda ? Storage::disk('public')->url($order->bukti_denda) : null,
                'status_denda' => $order->status_denda,

                'fase' => $order->fase,
                'fase_label' => \App\Services\OrderFaseService::label($order->service_type, $order->fase, (bool) $order->has_pickup),
                'next_fase_action_label' => $nextFaseAction,
                'can_advance_fase' => $order->status === 'diproses'
                    && $nextFaseAction !== null
                    && ! ($order->service_type === 'barang' && $order->fase === 'berjalan' && ! $order->pickup_requested_at)
                    && ! $paymentBelumVerified,
                'advance_fase_blocked_reason' => $paymentBelumVerified
                    ? 'Verifikasi pembayaran terlebih dahulu sebelum bisa menandai status ini.'
                    : null,
                'can_accept' => $order->status === 'baru',
            ],
        ]);
    }

    public function verifikasiPembayaran(Order $order)
    {
        abort_unless($order->partner_id === Auth::id(), 403);

        $isCash = $order->payment_method === 'cod';

        abort_unless(
            $isCash || $order->payment_receipt,
            422,
            'Belum ada bukti pembayaran yang diunggah untuk pesanan ini.'
        );

        if (! $order->payment_verified_at) {
            $order->update([
                'payment_verified_at' => now(),
                'status' => $order->status === 'baru' ? 'diproses' : $order->status,
            ]);

            Notifikasi::create([
                'user_id' => $order->customer_id,
                'order_id' => $order->id,
                'type' => 'pembayaran_diterima',
                'judul' => 'Pembayaran Terverifikasi',
                'pesan' => $isCash
                    ? 'Pembayaran tunai untuk pesanan '.$order->order_code.' telah dikonfirmasi. Pesanan kamu sedang diproses.'
                    : 'Mitra telah memverifikasi pembayaran untuk pesanan '.$order->order_code.'. Pesanan kamu sedang diproses.',
            ]);
        }

        return back()->with('success', $isCash ? 'Pembayaran tunai berhasil dikonfirmasi.' : 'Pembayaran berhasil diverifikasi.');
    }

    /**
     * 👇 DIUBAH: ditambahkan guard "$order->fase === null" di awal.
     *
     * Sistem 'fase' (menunggu/berjalan/akhir) HANYA dipakai oleh order-order
     * lama peninggalan alur COD (statusnya 'diproses', kolom fase sudah
     * terisi sejak awal dibuat). Order baru TIDAK PERNAH mengisi fase sama
     * sekali - mereka pakai alur status baru (dititip/pengambilan_diajukan/
     * selesai) yang tidak melibatkan method ini.
     *
     * Tanpa guard ini, kalau order baru entah bagaimana sampai di sini
     * (misal salah klik / URL dipanggil manual), dia akan lolos abort_unless
     * status di bawah (karena statusnya bisa 'diproses_mitra'/'dititip') dan
     * malah membuat kolom fase-nya keisi - padahal seharusnya tidak pernah.
     * Ini juga mencegah tombol aksi fase muncul dobel dengan tombol alur
     * baru (Ambil Pesanan / Sudah Dititipkan / dll) di halaman Mitra.
     */
    public function updateFase(Order $order)
    {
        abort_unless($order->partner_id === Auth::id(), 403);
        abort_unless($order->fase !== null, 400, 'Pesanan ini menggunakan alur status baru dan tidak menggunakan sistem fase.');
        abort_unless(in_array($order->status, ['diproses', 'diproses_mitra', 'dititip'], true), 400, 'Fase hanya bisa diubah selagi pesanan sedang diproses.');

        $fase = (string) $order->fase;
        $serviceType = (string) $order->service_type;
        $next = self::NEXT_FASE[$fase] ?? null;

        abort_unless($next, 400, 'Pesanan ini sudah berada di fase akhir.');

        // Approve "dititipkan" (menunggu -> berjalan) baru boleh jalan setelah
        // pembayaran diverifikasi. Untuk saldo, payment_verified_at sudah
        // otomatis terisi saat bayar (mitra cukup 1x approve di sini). Untuk
        // transfer/QRIS/COD, mitra wajib approve pembayaran dulu lewat
        // verifikasiPembayaran() sebelum bisa approve tahap ini (2x approve).
        if ($next === 'berjalan') {
            abort_unless(
                $order->payment_verified_at !== null,
                400,
                'Verifikasi pembayaran terlebih dahulu sebelum menandai status ini.'
            );
        }

        if ($order->has_pickup && $serviceType === 'barang' && $next === 'akhir') {
            abort_unless($order->pickup_requested_at, 400, 'Customer belum mengajukan pengambilan barang.');
        }

        $updates = ['fase' => $next];

        if ($next === 'akhir' && ! $order->tanggal_selesai_aktual) {
            $updates['tanggal_selesai_aktual'] = now();
        }

        $order->update($updates);

        $label = self::FASE_LABELS[$serviceType][$next] ?? $next;

        Notifikasi::create([
            'user_id' => $order->customer_id,
            'order_id' => $order->id,
            'type' => 'transaksi_masuk',
            'judul' => 'Status Pesanan Diperbarui',
            'pesan' => $next === 'akhir'
                ? 'Barang untuk pesanan '.$order->order_code.' sudah ditandai diambil. Silakan selesaikan pesanan setelah barang diterima.'
                : 'Pesanan '.$order->order_code.' sekarang: '.$label.'.',
        ]);

        return back()->with('success', $next === 'akhir'
            ? 'Barang ditandai sudah diambil. Menunggu konfirmasi customer.'
            : 'Status pesanan berhasil diperbarui menjadi "'.$label.'".');
    }

    /**
     * 👇 DIUBAH: bypass status 'baru' dihapus. Order baru WAJIB lewat
     * Finance dulu (status jadi 'pembayaran_diterima') sebelum Mitra bisa
     * mengambil - baik dibayar via transfer/QRIS (lewat Finance\OrderController)
     * maupun saldo (instant tapi tetap diset ke 'pembayaran_diterima', lihat
     * Customer\OrderController::bayarSaldo()).
     *
     * Ini AMAN untuk 10 order lama COD: mereka semua sudah berstatus
     * 'diproses' (bukan 'baru' lagi) sejak lama, jadi tidak akan pernah lagi
     * menyentuh method ini sama sekali - guard lama untuk status 'baru'
     * sudah tidak relevan buat mereka.
     */
    public function ambilPesanan(Order $order)
    {
        abort_unless($order->partner_id === Auth::id(), 403);
        abort_unless($order->status === 'pembayaran_diterima', 400, 'Pesanan ini sudah tidak bisa diambil.');

        $order->update(['status' => 'diproses_mitra']);

        Notifikasi::create([
            'user_id' => $order->customer_id,
            'order_id' => $order->id,
            'type' => 'transaksi_masuk',
            'judul' => 'Pesanan Diambil Mitra',
            'pesan' => 'Pesanan '.$order->order_code.' telah diambil oleh mitra dan sedang diproses.',
        ]);

        return redirect()->route('mitra.orders.show', $order->id)->with('success', 'Pesanan berhasil diambil.');
    }

    public function tolakPesanan(Request $request, Order $order)
    {
        abort_unless($order->partner_id === Auth::id(), 403);
        abort_unless($order->status === 'baru', 400, 'Pesanan ini sudah tidak bisa ditolak.');

        $validated = $request->validate([
            'cancel_reason' => ['nullable', 'string', 'max:255'],
        ]);

        $order->update([
            'status' => 'dibatalkan',
            'cancel_reason' => $validated['cancel_reason'] ?? 'Ditolak oleh mitra.',
        ]);

        Notifikasi::create([
            'user_id' => $order->customer_id,
            'order_id' => $order->id,
            'type' => 'transaksi_masuk',
            'judul' => 'Pesanan Ditolak Mitra',
            'pesan' => 'Mohon maaf, pesanan '.$order->order_code.' ditolak oleh mitra.',
        ]);

        return redirect()->route('mitra.orders.index')->with('success', 'Pesanan berhasil ditolak.');
    }

    /**
     * 👇 DIUBAH: disederhanakan total. Sekarang HANYA menerima status
     * 'pengambilan_diajukan' - tidak ada lagi jalur langsung dari 'dititip'
     * (baik untuk pickup maupun non-pickup, dan tidak ada lagi percabangan
     * has_pickup). Satu-satunya cara order jadi 'selesai' sekarang:
     * (1) customer ajukan pengembalian (requestPickup()) lalu Mitra
     *     konfirmasi lewat method ini, atau
     * (2) auto-complete oleh command orders:auto-complete saat batas waktu
     *     (extend_end_date ?? end_date) habis tanpa pengajuan pengembalian.
     */
    public function confirmPickup(Order $order)
    {
        abort_unless($order->partner_id === Auth::id(), 403);
        abort_unless($order->status === 'pengambilan_diajukan', 400, 'Pesanan ini belum bisa diselesaikan.');

        if (! $order->tanggal_selesai_aktual) {
            $order->update(['tanggal_selesai_aktual' => now()]);
        }

        OrderFaseService::completeOrder($order);

        return redirect()->route('mitra.orders.show', $order->id)->with('success', 'Pesanan berhasil diselesaikan.');
    }

    public function tandaiDititip(Request $request, Order $order)
    {
        abort_unless($order->partner_id === Auth::id(), 403);

        $allowedStatuses = ['pembayaran_diterima', 'diproses_mitra'];

        if (! in_array($order->status, $allowedStatuses, true)) {
            abort(400, 'Pesanan ini belum bisa ditandai sudah dititip.');
        }

        // Jika request berisi dokumentasi (dari modal), simpan dulu
        if ($request->has('foto_urls') || $request->hasFile('foto')) {
            $validated = $request->validate([
                'foto' => ['required', 'array', 'min:1'],
                'foto.*' => ['image', 'mimes:jpeg,png,jpg', 'max:4096'],
                'catatan' => ['nullable', 'string', 'max:1000'],
            ]);

            $fotoUrls = [];
            if ($request->hasFile('foto')) {
                foreach ($request->file('foto') as $file) {
                    $path = $file->store('kondisi-awal', 'public');
                    $fotoUrls[] = Storage::url($path);
                }
            } elseif ($request->input('foto_urls')) {
                $fotoUrls = $request->input('foto_urls');
            }

            if (empty($fotoUrls)) {
                return back()->withErrors(['foto' => 'Minimal 1 foto harus diunggah.']);
            }

            // Simpan dokumentasi kondisi awal
            KondisiAwal::create([
                'order_id' => $order->id,
                'mitra_id' => Auth::id(),
                'foto_urls' => $fotoUrls,
                'catatan' => $validated['catatan'] ?? null,
                'dokumentasi_at' => now(),
            ]);

            // Baru update status setelah dokumentasi berhasil
            $order->update(['status' => 'dititip']);

            Notifikasi::create([
                'user_id' => $order->customer_id,
                'order_id' => $order->id,
                'type' => 'transaksi_masuk',
                'judul' => 'Barang Sudah Dititip',
                'pesan' => 'Barang untuk pesanan '.$order->order_code.' sudah diterima dan dititipkan oleh mitra.',
            ]);

            return redirect()->route('mitra.orders.show', $order->id)->with('success', 'Dokumentasi kondisi awal tersimpan. Pesanan berhasil ditandai sudah dititip.');
        }

        // Jika tidak ada dokumentasi, return view dengan data untuk modal
        return Inertia::render('Mitra/Orders/Show', [
            'order' => $this->serializeOrderForShow($order),
            'showKondisiAwalModal' => true,
        ]);
    }

    private function serializeOrderForShow(Order $order): array
    {
        $order->load(['customer', 'address']);
        
        $subtotal = $order->subtotal > 0 ? $order->subtotal : $order->total_price;
        $discount = $order->discount ?? 0;
        $pickupFee = $order->pickup_fee ?? 0;

        $nextFaseAction = self::FASE_ACTION_LABELS[$order->service_type][$order->fase] ?? null;

        $paymentBelumVerified = $order->fase === 'menunggu' && $order->payment_verified_at === null;

        return [
            'id' => $order->id,
            'order_number' => $order->order_code,
            'status' => $order->status,
            'cancel_reason' => $order->cancel_reason,
            'service_type' => $order->service_type,
            'has_pickup' => (bool) $order->has_pickup,
            'customer' => [
                'name' => $order->customer->name ?? '-',
                'phone' => $order->customer->phone ?? '-',
                'code' => $order->customer?->customer_code,
            ],
            'pickup_address' => $order->pickup_address,
            'dropoff_address' => $order->dropoff_address,
            'address_notes' => $order->address?->notes,
            'item_description' => $order->item_name,
            'duration' => $this->hitungDurasi($order),
            'pickup_status' => $order->is_pickup ? 'Dijemput oleh mitra' : 'Diantar sendiri oleh customer',
            'jam_pickup' => $order->jam_pickup ? Carbon::parse($order->jam_pickup)->format('H:i') : null,
            'subtotal' => (float) $subtotal,
            'discount' => (float) $discount,
            'pickup_fee' => (float) $pickupFee,
            'total' => (float) $order->total_price,
            'created_at' => optional($order->created_at)->format('d M Y, H:i'),
            'payment_method' => $order->payment_method,
            'payment_receipt' => $order->payment_receipt ? Storage::disk('public')->url($order->payment_receipt) : null,
            'payment_verified_at' => optional($order->payment_verified_at)->format('d M Y, H:i'),
            'pickup_requested_at' => optional($order->pickup_requested_at)->format('d M Y, H:i'),
            'denda' => (float) $order->denda,
            'bukti_denda' => $order->bukti_denda ? Storage::disk('public')->url($order->bukti_denda) : null,
            'status_denda' => $order->status_denda,
            'fase' => $order->fase,
            'fase_label' => \App\Services\OrderFaseService::label($order->service_type, $order->fase, (bool) $order->has_pickup),
            'next_fase_action_label' => $nextFaseAction,
            'can_advance_fase' => $order->status === 'diproses'
                && $nextFaseAction !== null
                && ! ($order->service_type === 'barang' && $order->fase === 'berjalan' && ! $order->pickup_requested_at)
                && ! $paymentBelumVerified,
            'advance_fase_blocked_reason' => $paymentBelumVerified
                ? 'Verifikasi pembayaran terlebih dahulu sebelum bisa menandai status ini.'
                : null,
            'can_accept' => $order->status === 'baru',
        ];
    }

    private function hitungDurasi(Order $order): ?string
    {
        if (! $order->start_date || ! $order->end_date) {
            return null;
        }

        $mulai = Carbon::parse($order->start_date);
        $selesai = Carbon::parse($order->end_date);
        $hari = max(1, $mulai->diffInDays($selesai));

        return $hari.' hari';
    }

    public function verifikasiDenda(Request $request, Order $order)
    {
        // Pengaman: Pastikan order benar-benar milik mitra yang sedang login
        abort_unless($order->partner_id === Auth::id(), 403);

        abort_unless($order->bukti_denda, 422, 'Belum ada bukti pembayaran denda yang diunggah.');
        abort_unless($order->hitungDenda() > 0, 422, 'Pesanan ini tidak memiliki denda keterlambatan.');
        abort_if($order->denda_paid_at, 422, 'Denda untuk pesanan ini sudah diverifikasi sebelumnya.');

        $order->update([
            'status_denda' => 'terverifikasi',
            'denda_paid_at' => now(),
            'denda_amount' => $order->hitungDenda(),
        ]);

        // Kirim notifikasi ke Customer bahwa denda sudah diverifikasi
        Notifikasi::create([
            'user_id' => $order->customer_id,
            'order_id' => $order->id,
            'type' => 'pembayaran_diterima',
            'judul' => 'Denda Terverifikasi',
            'pesan' => 'Mitra telah memverifikasi pembayaran denda untuk pesanan '.$order->order_code.'.',
        ]);

        return redirect()->back()->with('success', 'Pembayaran denda keterlambatan berhasil diverifikasi!');
    }

    public function verifikasiPerpanjangan(Order $order): RedirectResponse
    {
        abort_unless($order->partner_id === auth()->id(), 403);

        if ($order->status_perpanjangan !== 'menunggu_verifikasi') {
            return back()->with('error', 'Tidak ada perpanjangan yang menunggu verifikasi untuk pesanan ini.');
        }

        if (! $order->extend_end_date || (float) $order->extend_price <= 0) {
            return back()->with('error', 'Data perpanjangan belum lengkap. Minta customer mengajukan ulang.');
        }

        $order->update([
            'end_date' => $order->extend_end_date,
            'total_price' => (float) $order->total_price + (float) $order->extend_price,
            'extend_paid_at' => now(),
            'status_perpanjangan' => 'terverifikasi',
        ]);

        Notifikasi::create([
            'user_id' => $order->customer_id,
            'order_id' => $order->id,
            'type' => 'pembayaran_diterima',
            'judul' => 'Perpanjangan Disetujui',
            'pesan' => 'Perpanjangan penitipan untuk pesanan '.$order->order_code.' sudah diverifikasi mitra.',
        ]);

        return back()->with('success', 'Perpanjangan penitipan berhasil diverifikasi.');
    }
}