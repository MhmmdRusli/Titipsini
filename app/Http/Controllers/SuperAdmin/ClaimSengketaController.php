<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use App\Models\Notifikasi;
use App\Models\Order;
use App\Models\SaldoMutasi;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ClaimSengketaController extends Controller
{
    /**
     * List claims in dispute (sengketa).
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'sengketa');
        $search = trim((string) $request->query('search', ''));

        $query = Claim::query()
            ->whereIn('status', ['sengketa', 'disetujui', 'ditolak', 'refund_berhasil'])
            ->with([
                'order:id,order_code,customer_id,partner_id,total_price,status,service_type,item_name',
                'order.customer:id,name,email',
                'order.partner:id,name,email',
                'customer:id,name',
                'mitra:id,name',
                'adminValidator:id,name',
                'superAdmin:id,name',
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

        $summary = [
            'sengketa' => Claim::where('status', 'sengketa')->count(),
            'disetujui_superadmin' => Claim::where('status', 'disetujui')->whereNotNull('super_admin_id')->count(),
            'ditolak_superadmin' => Claim::where('status', 'ditolak')->whereNotNull('super_admin_id')->count(),
            'total' => Claim::whereIn('status', ['sengketa', 'disetujui', 'ditolak', 'refund_berhasil'])->whereNotNull('super_admin_id')->count(),
        ];

        return Inertia::render('SuperAdmin/Claims/SengketaIndex', [
            'claims' => $claims,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'summary' => $summary,
        ]);
    }

    /**
     * Show sengketa detail for SuperAdmin decision.
     */
    public function show(Claim $claim): Response
    {
        $claim->load([
            'order.customer', 
            'order.partner', 
            'order.kondisiAwal',
            'customer', 
            'mitra', 
            'adminValidator',
            'superAdmin'
        ]);

        return Inertia::render('SuperAdmin/Claims/SengketaShow', [
            'claim' => $this->serialize($claim, withOrder: true),
        ]);
    }

    /**
     * SuperAdmin makes final decision on dispute.
     */
    public function putuskan(Request $request, Claim $claim): RedirectResponse
    {
        abort_unless($claim->status === 'sengketa', 400, 'Hanya klaim status sengketa yang bisa diputuskan.');

        $validated = $request->validate([
            'keputusan' => ['required', Rule::in(['setujui', 'tolak'])],
            'persentase_refund' => ['required_if:keputusan,setujui', 'nullable', 'integer', 'min:1', 'max:100'],
            'super_admin_keputusan' => ['required', 'string', 'max:1000'],
        ]);

        $order = $claim->order;
        abort_unless($order, 404);
        abort_if($order->sudahDirefund(), 400, 'Order ini sudah pernah di-refund sebelumnya.');

        $superAdmin = Auth::user();

        DB::transaction(function () use ($claim, $order, $validated, $superAdmin) {
            if ($validated['keputusan'] === 'setujui') {
                $percentage = (int) $validated['persentase_refund'];
                $total = (float) $order->total_price;
                $amount = round($total * $percentage / 100, 2);

                $claim->update([
                    'status' => 'disetujui',
                    'persentase_refund' => $percentage,
                    'jumlah_refund' => $amount,
                    'super_admin_id' => $superAdmin->id,
                    'super_admin_decided_at' => now(),
                    'super_admin_keputusan' => $validated['super_admin_keputusan'],
                ]);

                $order->update([
                    'refund_percentage' => $percentage,
                    'refund_amount' => $amount,
                    'refund_reason' => $claim->alasan,
                ]);

                // Notifikasi ke Finance
                $financeIds = User::where('role', 'finance')->pluck('id');
                foreach ($financeIds as $fid) {
                    Notifikasi::create([
                        'user_id' => $fid,
                        'order_id' => $claim->order_id,
                        'type' => 'claim_siap_finance',
                        'judul' => 'Klaim Sengketa Disetujui Super Admin',
                        'pesan' => "Order #{$order->order_code} disetujui Super Admin, siap proses refund {$percentage}%.",
                    ]);
                }
            } else {
                $claim->update([
                    'status' => 'ditolak',
                    'super_admin_id' => $superAdmin->id,
                    'super_admin_decided_at' => now(),
                    'super_admin_keputusan' => $validated['super_admin_keputusan'],
                ]);
            }

            // Notifikasi ke Customer
            if ($claim->customer_id) {
                Notifikasi::create([
                    'user_id' => $claim->customer_id,
                    'order_id' => $claim->order_id,
                    'type' => $validated['keputusan'] === 'setujui' ? 'claim_disetujui' : 'claim_ditolak',
                    'judul' => $validated['keputusan'] === 'setujui' ? 'Klaim Disetujui (Keputusan Super Admin)' : 'Klaim Ditolak (Keputusan Super Admin)',
                    'pesan' => $validated['keputusan'] === 'setujui'
                        ? "Klaim Anda untuk Order #{$order->order_code} disetujui Super Admin dengan refund {$validated['persentase_refund']}%. Menunggu proses finance."
                        : "Klaim Anda untuk Order #{$order->order_code} ditolak Super Admin. Alasan: {$validated['super_admin_keputusan']}",
                ]);
            }

            // Notifikasi ke Mitra
            if ($claim->mitra_id) {
                Notifikasi::create([
                    'user_id' => $claim->mitra_id,
                    'order_id' => $claim->order_id,
                    'type' => $validated['keputusan'] === 'setujui' ? 'claim_disetujui' : 'claim_ditolak',
                    'judul' => $validated['keputusan'] === 'setujui' ? 'Klaim Disetujui Super Admin' : 'Klaim Ditolak Super Admin',
                    'pesan' => $validated['keputusan'] === 'setujui'
                        ? "Klaim untuk Order #{$order->order_code} disetujui Super Admin. Refund {$validated['persentase_refund']}% akan diproses finance."
                        : "Klaim untuk Order #{$order->order_code} ditolak Super Admin. Alasan: {$validated['super_admin_keputusan']}",
                ]);
            }

            // Notifikasi ke Admin yang handle awal
            if ($claim->admin_validator_id) {
                Notifikasi::create([
                    'user_id' => $claim->admin_validator_id,
                    'order_id' => $claim->order_id,
                    'type' => 'claim_sengketa_keputusan',
                    'judul' => 'Keputusan Super Admin pada Sengketa',
                    'pesan' => "Super Admin memutuskan {$validated['keputusan']} untuk klaim Order #{$order->order_code}.",
                ]);
            }
        });

        return back()->with('success', 'Keputusan Super Admin berhasil disimpan. ' . ($validated['keputusan'] === 'setujui' ? 'Diteruskan ke Finance.' : 'Klaim ditolak.'));
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
            'super_admin_keputusan' => $claim->super_admin_keputusan,
            'super_admin_decided_at' => $claim->super_admin_decided_at?->format('d M Y H:i'),
            'super_admin_name' => $claim->superAdmin?->name,
            'created_at' => $claim->created_at?->format('d M Y H:i'),
            'customer_name' => $claim->customer?->name,
            'mitra_name' => $claim->mitra?->name,
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