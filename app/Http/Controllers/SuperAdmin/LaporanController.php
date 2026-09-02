<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));

        $query = Report::query()
            ->with(['order.customer:id,name,email', 'order.partner:id,name,email,address,city']);

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhereHas('order', fn ($orderQuery) => $orderQuery->where('order_code', 'like', "%{$search}%"))
                  ->orWhereHas('order.customer', fn ($customerQuery) => $customerQuery->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('order.partner', fn ($partnerQuery) => $partnerQuery->where('name', 'like', "%{$search}%"));
            });
        }

        $reports = $query->latest()->paginate(15)->through(function (Report $report) {
            return [
                'id' => $report->id,
                'order_id' => $report->order_id,
                'order_code' => $report->order?->order_code ?? '-',
                'pelapor_nama' => $report->order?->customer?->name ?? '-',
                'pelapor_email' => $report->order?->customer?->email ?? '-',
                'vendor_nama' => $report->order?->partner?->name ?? '-',
                'vendor_email' => $report->order?->partner?->email ?? '-',
                'vendor_alamat' => $report->order?->partner?->address ?? '-',
                'jenis_layanan' => $report->order?->service_type ?? '-',
                'tanggal_laporan' => $report->created_at?->format('d M Y'),
                'tanggal_laporan_lengkap' => $report->created_at?->format('d M Y H:i'),
                'ulasan' => $report->description,
                'foto_bukti_url' => $report->evidence_url
                    ? Storage::disk('public')->url($report->evidence_url)
                    : null,
            ];
        })->withQueryString();

        $summary = [
            'total_laporan' => Report::count(),
            'bulan_ini' => Report::whereYear('created_at', now()->year)
                ->whereMonth('created_at', now()->month)
                ->count(),
        ];

        return Inertia::render('SuperAdmin/Laporan/Index', [
            'reports' => $reports,
            'filters' => [
                'search' => $search,
            ],
            'summary' => $summary,
        ]);
    }

    public function show(Report $report): Response
    {
        $report->load(['order.customer', 'order.partner']);
        $order = $report->order;
        $partner = $order?->partner;
        $customer = $order?->customer;

        return Inertia::render('SuperAdmin/Laporan/Show', [
            'report' => [
                'id' => $report->id,
                'order_code' => $order?->order_code ?? '-',
                'service_type' => $order?->service_type ?? '-',
                'tanggal_laporan' => $report->created_at?->format('d M Y H:i'),
                'deskripsi' => $report->description,
                'foto_bukti_url' => $report->evidence_url
                    ? Storage::disk('public')->url($report->evidence_url)
                    : null,
                'pelapor' => [
                    'nama' => $customer?->name ?? '-',
                    'email' => $customer?->email ?? '-',
                    'id' => $customer?->id ?? '-',
                ],
                'vendor' => [
                    'id' => $partner?->id ?? '-',
                    'nama' => $partner?->name ?? '-',
                    'email' => $partner?->email ?? '-',
                    'alamat' => $partner?->address ?? '-',
                    'kota' => $partner?->city ?? '-',
                    'status' => ($partner && $partner->suspended_at) ? 'ditangguhkan' : 'aktif',
                ],
            ],
        ]);
    }
}
