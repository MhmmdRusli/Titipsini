<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\PendapatanPlatform;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class TotalTransaksiController extends Controller
{
    public function index(Request $request): Response
    {
        $month = (int) $request->query('month', now()->month);
        $year = (int) $request->query('year', now()->year);
        $search = trim((string) $request->query('search', ''));

        $query = PendapatanPlatform::query()
            ->with(['partner:id,name,email', 'order:id,order_code,service_type,status,created_at']);

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->whereHas('partner', fn ($partnerQuery) => $partnerQuery->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('order', fn ($orderQuery) => $orderQuery->where('order_code', 'like', "%{$search}%"));
            });
        }

        // Filter by month and year
        $query->whereYear('created_at', $year)
              ->whereMonth('created_at', $month);

        $transactions = $query->latest()->paginate(20)->through(function (PendapatanPlatform $item) {
            return [
                'id' => $item->id,
                'order_id' => $item->order_id,
                'order_code' => $item->order?->order_code ?? '-',
                'partner_id' => $item->partner_id,
                'partner_name' => $item->partner?->name ?? '-',
                'partner_email' => $item->partner?->email ?? '-',
                'service_type' => $item->order?->service_type ?? '-',
                'order_status' => $item->order?->status ?? '-',
                'total_transaksi' => (float) $item->total_transaksi,
                'komisi_persen' => (float) $item->komisi_persen,
                'jumlah_komisi' => (float) $item->jumlah_komisi,
                'tanggal' => $item->created_at?->format('d M Y H:i'),
            ];
        })->withQueryString();

        // Summary untuk periode yang dipilih
        $summaryQuery = PendapatanPlatform::query()
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month);

        $summary = [
            'total_transaksi' => (int) $summaryQuery->sum('total_transaksi'),
            'total_komisi' => (int) $summaryQuery->sum('jumlah_komisi'),
            'jumlah_order' => $summaryQuery->count(),
            'rata_komisi_persen' => $summaryQuery->count() > 0
                ? round($summaryQuery->avg('komisi_persen'), 2)
                : 0,
        ];

        // Data untuk chart bulanan
        $monthlyData = PendapatanPlatform::query()
            ->whereYear('created_at', $year)
            ->selectRaw('MONTH(created_at) as bulan, SUM(total_transaksi) as total, SUM(jumlah_komisi) as komisi, COUNT(*) as jumlah')
            ->groupByRaw('MONTH(created_at)')
            ->get()
            ->map(function ($item) {
                return [
                    'bulan' => $this->getBulanIndo($item->bulan),
                    'total' => (int) $item->total,
                    'komisi' => (int) $item->komisi,
                    'jumlah' => (int) $item->jumlah,
                ];
            })
            ->toArray();

        return Inertia::render('SuperAdmin/TotalTransaksi/Index', [
            'transactions' => $transactions,
            'filters' => [
                'month' => $month,
                'year' => $year,
                'search' => $search,
            ],
            'summary' => $summary,
            'monthlyData' => $monthlyData,
        ]);
    }

    private function getBulanIndo(int $month): string
    {
        $bulanIndo = [
            1  => 'Jan',
            2  => 'Feb',
            3  => 'Mar',
            4  => 'Apr',
            5  => 'Mei',
            6  => 'Jun',
            7  => 'Jul',
            8  => 'Agu',
            9  => 'Sep',
            10 => 'Okt',
            11 => 'Nov',
            12 => 'Des',
        ];

        return $bulanIndo[$month] ?? '-';
    }
}
