<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use App\Models\Notifikasi;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ClaimController extends Controller
{
    /**
     * List claims assigned to this mitra waiting for clarification.
     */
    public function index(Request $request): Response
    {
        $partner = Auth::user();
        $status = $request->query('status', 'menunggu_klarifikasi_mitra');
        $search = trim((string) $request->query('search', ''));

        $query = Claim::query()
            ->where('mitra_id', $partner->id)
            ->whereIn('status', ['menunggu_klarifikasi_mitra', 'disetujui', 'ditolak', 'sengketa'])
            ->with([
                'order:id,order_code,customer_id,partner_id,total_price,status,service_type,item_name',
                'order.customer:id,name,email',
                'adminValidator:id,name',
            ])
            ->when($status !== 'semua', fn ($q) => $q->where('status', $status))
            ->when($search !== '', function ($q) use ($search) {
                $q->whereHas('order', function ($oq) use ($search) {
                    $oq->where('order_code', 'like', "%{$search}%")
                        ->orWhereHas('customer', fn ($cq) => $cq->where('name', 'like', "%{$search}%"));
                });
            })
            ->latest();

        $claims = $query->paginate(10)->withQueryString()->through(fn (Claim $c) => $this->serialize($c));

        return Inertia::render('Mitra/Claims/Index', [
            'claims' => $claims,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show claim detail for mitra clarification.
     */
    public function show(Claim $claim): Response
    {
        abort_unless($claim->mitra_id === Auth::id(), 403);

        $claim->load([
            'order.customer', 
            'order.partner', 
            'order.kondisiAwal',
            'customer', 
            'adminValidator'
        ]);

        return Inertia::render('Mitra/Claims/Show', [
            'claim' => $this->serialize($claim, withOrder: true),
        ]);
    }

    /**
     * Mitra submits clarification/evidence.
     */
    public function submitKlarifikasi(Request $request, Claim $claim): RedirectResponse
    {
        abort_unless($claim->mitra_id === Auth::id(), 403);
        abort_if($claim->status !== 'menunggu_klarifikasi_mitra', 400,
            'Klaim ini tidak lagi menunggu klarifikasi dari Anda.');

        $validated = $request->validate([
            'klarifikasi' => ['required', 'string', 'max:1000'],
            'foto' => ['nullable', 'array', 'max:5'],
            'foto.*' => ['image', 'mimes:jpeg,png,jpg', 'max:4096'],
        ]);

        $fotoUrls = [];
        if ($request->hasFile('foto')) {
            foreach ($request->file('foto') as $file) {
                $path = $file->store('claim-mitra-evidence', 'public');
                $fotoUrls[] = Storage::url($path);
            }
        }

        $claim->update([
            'status' => 'menunggu_pemeriksaan_admin',
            'mitra_klarifikasi' => $validated['klarifikasi'],
            'mitra_foto_urls' => $fotoUrls,
            'mitra_responded_at' => now(),
        ]);

        // Notifikasi ke Admin bahwa mitra sudah memberi klarifikasi
        $adminIds = \App\Models\User::whereIn('role', ['admin', 'super_admin'])->pluck('id');
        foreach ($adminIds as $adminId) {
            Notifikasi::create([
                'user_id' => $adminId,
                'order_id' => $claim->order_id,
                'type' => 'claim_mitra_merklarifikasi',
                'judul' => 'Mitra Memberi Klarifikasi Klaim',
                'pesan' => "Mitra telah memberikan klarifikasi untuk klaim Order #{$claim->order?->order_code}. Silakan lanjutkan pemeriksaan.",
            ]);
        }

        // Notifikasi ke Customer
        if ($claim->customer_id) {
            Notifikasi::create([
                'user_id' => $claim->customer_id,
                'order_id' => $claim->order_id,
                'type' => 'claim_mitra_merklarifikasi',
                'judul' => 'Mitra Memberi Klarifikasi',
                'pesan' => "Mitra telah memberikan klarifikasi untuk klaim Anda pada Order #{$claim->order?->order_code}. Admin akan meninjau kembali.",
            ]);
        }

        return back()->with('success', 'Klarifikasi berhasil dikirim. Admin akan meninjau kembali.');
    }

    protected function serialize(Claim $claim, bool $withOrder = false): array
    {
        $order = $claim->order;

        $base = [
            'id' => $claim->id,
            'status' => $claim->status,
            'status_label' => $claim->status_label,
            'alasan' => $claim->alasan,
            'foto_urls' => $claim->foto_urls,
            'jumlah_klaim' => $claim->jumlah_klaim ? (float) $claim->jumlah_klaim : null,
            'persentase_refund' => $claim->persentase_refund,
            'jumlah_refund' => $claim->jumlah_refund ? (float) $claim->jumlah_refund : null,
            'admin_catatan' => $claim->admin_catatan,
            'admin_validated_at' => $claim->admin_validated_at?->format('d M Y H:i'),
            'admin_validator_name' => $claim->adminValidator?->name,
            'mitra_klarifikasi' => $claim->mitra_klarifikasi,
            'mitra_foto_urls' => $claim->mitra_foto_urls,
            'mitra_responded_at' => $claim->mitra_responded_at?->format('d M Y H:i'),
            'created_at' => $claim->created_at?->format('d M Y H:i'),
            'customer_name' => $claim->customer?->name,
            'order_id' => $order?->id,
            'order_code' => $order?->order_code,
            'item_name' => $order?->item_name,
            'service_type' => $order?->service_type,
            'total_price' => $order?->total_price !== null ? (float) $order->total_price : null,
        ];

        if ($withOrder && $order) {
            $base['kondisi_awal'] = $order->kondisiAwal ? [
                'foto_urls' => $order->kondisiAwal->foto_urls,
                'catatan' => $order->kondisiAwal->catatan,
                'dokumentasi_at' => $order->kondisiAwal->dokumentasi_at?->format('d M Y H:i'),
            ] : null;
            
            $base['order'] = [
                'id' => $order->id,
                'order_code' => $order->order_code,
                'item_name' => $order->item_name,
                'service_type' => $order->service_type,
                'total_price' => (float) $order->total_price,
                'status' => $order->status,
                'customer' => [
                    'name' => $order->customer?->name,
                    'email' => $order->customer?->email,
                    'phone' => $order->customer?->phone,
                ],
                'partner' => [
                    'name' => $order->partner?->name,
                    'email' => $order->partner?->email,
                    'phone' => $order->partner?->phone,
                ],
            ];
        }

        return $base;
    }
}