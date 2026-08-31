<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\SaldoMutasi;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $tahun = (int) $request->query('tahun', now()->year);
        $bulan = (int) $request->query('bulan', now()->month);

        return Inertia::render('SuperAdmin/Dashboard', [
            'user' => $request->user()->only(['id', 'name', 'email', 'role']),

            // Kartu statistik utama
            'stats' => $this->getStats(),

            // Grafik jumlah pesanan per bulan, dipisah per jenis layanan
            'chartPesanan' => $this->getChartPesanan($tahun),

            // Pie chart total pesanan per jenis layanan
            'pesananBreakdown' => $this->getPesananBreakdown($tahun, $bulan),

            // Kartu "Layanan Vendor"
            'layananVendor' => $this->getLayananVendor(),

            // Catatan keuangan
            'keuangan' => $this->getKeuangan(),

            // Area chart pembayaran berdasarkan layanan
            'pembayaranLayanan' => $this->getPembayaranLayanan($tahun),

            'filter' => [
                'bulan' => $bulan,
                'tahun' => $tahun,
            ],
        ]);
    }

    private function getStats(): array
    {
        return [
            'total_pesanan'  => Order::count(),
            'total_customer' => User::where('role', 'customer')->count(),
            'total_vendor'   => User::where('role', 'partner')->count(),
            'total_layanan'  => Service::count(),
        ];
    }

    private function getChartPesanan(int $tahun): array
    {
        $rows = Order::selectRaw("
                MONTH(created_at) as bulan,
                SUM(CASE WHEN service_type = 'barang' THEN 1 ELSE 0 END) as barang,
                SUM(CASE WHEN is_pickup = 1 THEN 1 ELSE 0 END) as pickup,
                SUM(CASE WHEN service_type = 'kendaraan' THEN 1 ELSE 0 END) as kendaraan,
                SUM(CASE WHEN service_type = 'bangunan' THEN 1 ELSE 0 END) as bangunan
            ")
            ->whereYear('created_at', $tahun)
            ->groupByRaw('MONTH(created_at)')
            ->get()
            ->keyBy('bulan');

        $bulanIndo = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        $data = [];
        for ($i = 1; $i <= 12; $i++) {
            $data[] = [
                'bulan'     => $bulanIndo[$i - 1],
                'barang'    => (int) ($rows[$i]->barang ?? 0),
                'pickup'    => (int) ($rows[$i]->pickup ?? 0),
                'kendaraan' => (int) ($rows[$i]->kendaraan ?? 0),
                'bangunan'  => (int) ($rows[$i]->bangunan ?? 0),
            ];
        }

        return $data;
    }

    private function getPesananBreakdown(int $tahun, int $bulan): array
    {
        $query = Order::query()
            ->whereYear('created_at', $tahun)
            ->when($bulan > 0, fn ($q) => $q->whereMonth('created_at', $bulan));

        $count = fn (string $type) => (clone $query)->where('service_type', $type)->count();
        $pickupCount = (clone $query)->where('is_pickup', true)->count();

        return [
            ['label' => 'Barang',    'value' => $count('barang'),    'color' => '#16a34a'],
            ['label' => 'Pick Up',   'value' => $pickupCount,        'color' => '#0ea5e9'],
            ['label' => 'Kendaraan', 'value' => $count('kendaraan'), 'color' => '#f59e0b'],
            ['label' => 'Bangunan',  'value' => $count('bangunan'),  'color' => '#ef4444'],
        ];
    }

    private function getLayananVendor(): array
    {
        $countByKategori = Service::selectRaw('kategori, COUNT(*) as total')
            ->groupBy('kategori')
            ->pluck('total', 'kategori');

        return [
            ['key' => 'barang',    'label' => 'Total Layanan Barang',    'value' => (int) ($countByKategori['barang'] ?? 0),    'icon' => 'Package',   'color' => '#16a34a'],
            ['key' => 'bangunan',  'label' => 'Total Layanan Bangunan',  'value' => (int) ($countByKategori['bangunan'] ?? 0),  'icon' => 'Building2', 'color' => '#ef4444'],
            ['key' => 'pickup',    'label' => 'Total Layanan Pick Up',   'value' => Order::where('is_pickup', true)->count(),   'icon' => 'Truck',     'color' => '#0ea5e9'],
            ['key' => 'kendaraan', 'label' => 'Total Layanan Kendaraan', 'value' => (int) ($countByKategori['kendaraan'] ?? 0), 'icon' => 'Car',       'color' => '#f59e0b'],
        ];
    }

    private function getKeuangan(): array
    {
        $penghasilan = (int) SaldoMutasi::where('type', 'penghasilan')->sum('jumlah');
        $penarikan   = (int) SaldoMutasi::where('type', 'penarikan')->sum('jumlah');

        return [
            'total_saldo'      => $penghasilan - $penarikan,
            'transaksi_keluar' => $penarikan,
            'transaksi_masuk'  => $penghasilan,
        ];
    }

    private function getPembayaranLayanan(int $tahun): array
    {
        $rows = Order::selectRaw("
                MONTH(created_at) as bulan,
                SUM(CASE WHEN is_pickup = 1 THEN total_price ELSE 0 END) as pickup,
                SUM(CASE WHEN service_type = 'kendaraan' THEN total_price ELSE 0 END) as kendaraan,
                SUM(CASE WHEN service_type = 'bangunan' THEN total_price ELSE 0 END) as konstruksi
            ")
            ->whereYear('created_at', $tahun)
            ->whereIn('status', ['baru', 'diproses', 'selesai'])
            ->groupByRaw('MONTH(created_at)')
            ->get()
            ->keyBy('bulan');

        $bulanIndo = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        $data = [];
        for ($i = 1; $i <= 12; $i++) {
            $row = $rows->get($i);
            $data[] = [
                'bulan'      => $bulanIndo[$i - 1],
                'pickup'     => (int) ($row->pickup ?? 0),
                'kendaraan'  => (int) ($row->kendaraan ?? 0),
                'konstruksi' => (int) ($row->konstruksi ?? 0),
            ];
        }

        return $data;
    }
}
