<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PendapatanPlatform;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PendapatanController extends Controller
{
    /**
     * GET /admin/pendapatan
     * Rekap komisi platform yang terkumpul dari transaksi mitra.
     */
    public function index(Request $request): Response
    {
        $bulan = $request->string('bulan')->toString(); // format: YYYY-MM

        $query = PendapatanPlatform::with(['order:id,order_code', 'partner:id,name']);

        if ($bulan) {
            [$tahun, $bulanAngka] = explode('-', $bulan);
            $query->whereYear('created_at', $tahun)->whereMonth('created_at', $bulanAngka);
        }

        $totalKomisi = (clone $query)->sum('jumlah_komisi');
        $totalTransaksi = (clone $query)->sum('total_transaksi');
        $jumlahTransaksi = (clone $query)->count();

        $items = $query->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn ($item) => [
                'id' => $item->id,
                'order_code' => $item->order?->order_code,
                'partner_name' => $item->partner?->name ?? '-',
                'total_transaksi' => (float) $item->total_transaksi,
                'komisi_persen' => (float) $item->komisi_persen,
                'jumlah_komisi' => (float) $item->jumlah_komisi,
                'tanggal' => $item->created_at->translatedFormat('d M Y, H:i'),
            ]);

        return Inertia::render('Admin/Pendapatan/Index', [
            'items' => $items,
            'summary' => [
                'totalKomisi' => (float) $totalKomisi,
                'totalTransaksi' => (float) $totalTransaksi,
                'jumlahTransaksi' => $jumlahTransaksi,
            ],
            'filters' => [
                'bulan' => $bulan,
            ],
        ]);
    }
}