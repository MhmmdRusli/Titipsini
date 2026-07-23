<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    /**
     * Daftar semua laporan/pengaduan.
     */
    public function index(Request $request)
    {
        $reports = Report::with(['order.customer', 'order.partner'])
            ->latest()
            ->get()
            ->map(fn (Report $r) => [
                'id' => $r->id,
                'pelapor_nama' => $r->order->customer->name ?? '-',
                'vendor_nama' => $r->order->partner->name ?? '-',
                'jenis_layanan' => $r->order->service_type ?? '-',
                'tanggal_laporan' => $r->created_at->format('d M Y'),
                'ulasan' => $r->description,
            ]);

        return Inertia::render('Admin/Reports/Index', [
            'reports' => $reports,
        ]);
    }

    /**
     * Unduh daftar laporan sebagai file CSV (bisa dibuka di Excel/Sheets).
     */
    public function export(Request $request): StreamedResponse
    {
        $reports = Report::with(['order.customer', 'order.partner'])
            ->latest()
            ->get();

        $filename = 'laporan-'.now()->format('Y-m-d_His').'.csv';

        $callback = function () use ($reports) {
            $handle = fopen('php://output', 'w');

            // BOM biar Excel baca karakter UTF-8 dengan benar
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'Nama Pelapor',
                'Nama Vendor',
                'Jenis Layanan',
                'Tanggal Laporan',
                'Ulasan',
            ]);

            foreach ($reports as $r) {
                fputcsv($handle, [
                    $r->order->customer->name ?? '-',
                    $r->order->partner->name ?? '-',
                    $r->order->service_type ?? '-',
                    $r->created_at->format('d M Y'),
                    $r->description,
                ]);
            }

            fclose($handle);
        };

        return response()->streamDownload($callback, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * Detail satu laporan beserta biodata vendor (partner) terkait.
     */
    public function show(Report $report)
    {
        $report->load(['order.customer', 'order.partner']);
        $order = $report->order;
        $partner = $order->partner;

        return Inertia::render('Admin/Reports/Show', [
            'report' => [
                'id' => $report->id,
                'id_pesanan' => $order->order_code ?? '-',
                'jenis_layanan' => $order->service_type ?? '-',
                'tanggal_laporan' => $report->created_at->format('d M Y'),
                'alasan' => $report->description,
                'foto_bukti_url' => $report->evidence_url,
                'pelapor' => [
                    'nama' => $order->customer->name ?? '-',
                    'id_customer' => $order->customer->id ?? '-',
                    'role' => 'Customer',
                ],
                'vendor' => [
                    'id_vendor' => $partner->id ?? '-',
                    'nama_vendor' => $partner->name ?? '-',
                    'nama_usaha' => $partner->name ?? '-',
                    'jenis_layanan' => $order->service_type ?? '-',
                    'wilayah' => $partner->wilayah ?? '-',
                    'alamat_lengkap' => $partner->address ?? '-',
                    'status' => ($partner && $partner->suspended_at) ? 'ditangguhkan' : 'aktif',
                ],
            ],
        ]);
    }

    public function suspend(Request $request, Report $report)
    {
        $report->load('order.partner');

        if ($report->order && $report->order->partner) {
            $report->order->partner->update([
                'suspended_at' => now(),
                'suspension_reason' => $request->input('alasan_penangguhan', 'Ditangguhkan oleh admin melalui detail laporan.'),
            ]);
        }

        return back()->with('success', 'Vendor berhasil ditangguhkan.');
    }

    public function restore(Report $report)
    {
        $report->load('order.partner');

        if ($report->order && $report->order->partner) {
            $report->order->partner->update([
                'suspended_at' => null,
                'suspension_reason' => null,
            ]);
        }

        return back()->with('success', 'Akun vendor berhasil dipulihkan.');
    }

    public function penangguhan(Report $report)
    {
        $report->load('order.partner');
        $partner = $report->order->partner;

        return Inertia::render('Admin/Reports/Penangguhan', [
            'report_id' => $report->id,
            'vendor' => [
                'nama_vendor' => $partner->name ?? '-',
                'ditangguhkan_at' => optional($partner->suspended_at)->format('d M Y, H:i'),
                'alasan_penangguhan' => $partner->suspension_reason ?? '-',
            ],
        ]);
    }
}