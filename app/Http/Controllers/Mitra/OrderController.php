<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\Order;
use Illuminate\Http\Request;
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

        $statusMap = [
            'baru' => 'diproses',
            'selesai' => 'selesai',
            'dibatalkan' => 'dibatalkan',
        ];

        $query = Order::with('customer')
            ->where('partner_id', $partner->id)
            ->where('status', $statusMap[$tab] ?? $statusMap['baru']);

        if ($kategori) {
            $query->where('service_type', $kategori);
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        $orders->getCollection()->transform(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_code,
                'customer_name' => $order->customer->name ?? '-',
                'address' => $order->pickup_address ?? $order->city,
                'service_type' => $order->service_type,
                'duration' => $this->hitungDurasi($order),
                'status' => $order->status,
                'fase' => $order->fase,
                'fase_label' => self::FASE_LABELS[$order->service_type][$order->fase] ?? null,
            ];
        });

        $counts = [
            'baru' => Order::where('partner_id', $partner->id)->where('status', 'diproses')->count(),
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

        $order->load('customer');

        
        $subtotal = $order->subtotal > 0 ? $order->subtotal : $order->total_price;
        $discount = $order->discount ?? 0;
        $pickupFee = $order->pickup_fee ?? 0;

        $nextFaseAction = self::FASE_ACTION_LABELS[$order->service_type][$order->fase] ?? null;

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
                ],
                'pickup_address' => $order->pickup_address,
                'dropoff_address' => $order->dropoff_address,
                'item_description' => $order->item_name,
                'duration' => $this->hitungDurasi($order),
                // Dikirim sebagai label string, bukan boolean mentah — supaya tidak
                // "hilang" saat dirender di React (JSX tidak menampilkan boolean false).
                'pickup_status' => $order->is_pickup ? 'Dijemput oleh mitra' : 'Diantar sendiri oleh customer',
                'subtotal' => (float) $subtotal,
                'discount' => (float) $discount,
                'pickup_fee' => (float) $pickupFee,
                'total' => (float) $order->total_price,
                'created_at' => optional($order->created_at)->format('d M Y, H:i'),
                // Dikirim supaya frontend bisa membedakan alur cash vs QRIS/transfer
                // di blok "Bukti Pembayaran & Verifikasi".
                'payment_method' => $order->payment_method,
                'payment_receipt' => $order->payment_receipt ? Storage::disk('public')->url($order->payment_receipt) : null,
                'payment_verified_at' => optional($order->payment_verified_at)->format('d M Y, H:i'),
                // Status operasional (fase) - lihat blok baru "Status Operasional" di Show.jsx
                'fase' => $order->fase,
                'fase_label' => self::FASE_LABELS[$order->service_type][$order->fase] ?? null,
                'next_fase_action_label' => $nextFaseAction,
                // Tombol maju fase HANYA boleh dipakai kalau order sudah 'diproses'
                // (payment sudah terverifikasi) dan masih ada fase berikutnya.
                'can_advance_fase' => $order->status === 'diproses' && $nextFaseAction !== null,
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

        $next = self::NEXT_FASE[$order->fase] ?? null;

        abort_unless($next, 400, 'Pesanan ini sudah berada di fase akhir.');

        $order->update(['fase' => $next]);

        $label = self::FASE_LABELS[$order->service_type][$next] ?? $next;

        Notifikasi::create([
            'user_id' => $order->customer_id,
            'order_id' => $order->id,
            'type' => 'transaksi_masuk',
            'judul' => 'Status Pesanan Diperbarui',
            'pesan' => 'Pesanan '.$order->order_code.' sekarang: '.$label.'.',
        ]);

        return back()->with('success', 'Status pesanan berhasil diperbarui menjadi "'.$label.'".');
    }

   
    private function hitungDurasi(Order $order): ?string
    {
        if (! $order->start_date || ! $order->end_date) {
            return null;
        }

        $mulai = \Illuminate\Support\Carbon::parse($order->start_date);
        $selesai = \Illuminate\Support\Carbon::parse($order->end_date);
        $hari = $mulai->diffInDays($selesai) + 1;

        return $hari.' hari';
    }
}
