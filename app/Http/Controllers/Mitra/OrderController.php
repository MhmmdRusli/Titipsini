<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\Order;
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
            // "Baru" mencakup order yang belum di-accept (baru) DAN yang
            // sudah di-accept & sedang berjalan (diproses) - keduanya
            // masih dianggap "aktif" dari sudut pandang mitra.
            $query->whereIn('status', ['baru', 'diproses']);
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
                // Prioritaskan alamat tersimpan yang dipilih customer karena
                // lebih rinci daripada nama kota pada pesanan.
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
                // Ulasan diberikan customer setelah pesanan selesai. Data ini
                // dikirim ke kartu daftar pesanan agar mitra dapat langsung
                // melihat penilaian tanpa harus membuka detail pesanan.
                'rating' => $order->rating,
                'review' => $order->review,
                'status' => $order->status,
                'fase' => $order->fase,
                'fase_label' => self::FASE_LABELS[$order->service_type][$order->fase] ?? null,
                'pickup_requested_at' => optional($order->pickup_requested_at)->format('d M Y, H:i'),
            ];
        });

        $counts = [
            'baru' => Order::where('partner_id', $partner->id)->whereIn('status', ['baru', 'diproses'])->count(),
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

                // 👇 Properti Denda yang ditambahkan agar muncul di halaman Mitra
                'denda' => (float) $order->denda,
                'bukti_denda' => $order->bukti_denda ? Storage::disk('public')->url($order->bukti_denda) : null,
                'status_denda' => $order->status_denda,

                'fase' => $order->fase,
                'fase_label' => self::FASE_LABELS[$order->service_type][$order->fase] ?? null,
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

    public function updateFase(Order $order)
    {
        abort_unless($order->partner_id === Auth::id(), 403);
        abort_unless($order->status === 'diproses', 400, 'Fase hanya bisa diubah selagi pesanan berstatus Diproses.');

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

        if ($serviceType === 'barang' && $next === 'akhir') {
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

    public function ambilPesanan(Order $order)
    {
        abort_unless($order->partner_id === Auth::id(), 403);
        abort_unless($order->status === 'baru', 400, 'Pesanan ini sudah tidak berstatus baru.');

        $order->update(['status' => 'diproses']);

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