<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
                'pelapor_nama' => $r->order->customer->name,
                'vendor_nama' => $r->order->partner->name,
                'jenis_layanan' => $r->order->service_type,
                'tanggal_laporan' => $r->created_at->format('d M Y'),
                'ulasan' => $r->description,
            ]);

        return Inertia::render('Admin/Reports/Index', [
            'reports' => $reports,
        ]);
    }

    /**
     * Unduh daftar laporan (mis. sebagai Excel/CSV).
     */
    public function export(Request $request)
    {
        // return Excel::download(new ReportsExport, 'laporan.xlsx');
        abort(501, 'Export belum diimplementasikan.');
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
                'id_pesanan' => $order->order_code,
                'jenis_layanan' => $order->service_type,
                'tanggal_laporan' => $report->created_at->format('d M Y'),
                'alasan' => $report->description,
                'foto_bukti_url' => $report->evidence_url,
                'pelapor' => [
                    'nama' => $order->customer->name,
                    'id_customer' => $order->customer->id,
                    'role' => 'Customer',
                ],
                'vendor' => [
                    'id_vendor' => $partner->id,
                    'nama_vendor' => $partner->name,
                    'nama_usaha' => $partner->name, // sesuaikan jika ada kolom nama usaha terpisah
                    'jenis_layanan' => $order->service_type,
                    'wilayah' => $partner->wilayah,
                    'alamat_lengkap' => $partner->address,
                    'status' => $partner->suspended_at ? 'ditangguhkan' : 'aktif',
                ],
            ],
        ]);
    }

    /**
     * Tangguhkan akun vendor (partner) terkait laporan ini.
     */
    public function suspend(Request $request, Report $report)
    {
        $request->validate([
            'alasan_penangguhan' => ['nullable', 'string', 'max:1000'],
        ]);

        $report->load('order.partner');

        $report->order->partner->update([
            'suspended_at' => now(),
            'suspension_reason' => $request->alasan_penangguhan,
        ]);

        return back()->with('success', 'Vendor berhasil ditangguhkan.');
    }

    /**
     * Pulihkan kembali akses akun vendor (partner).
     */
    public function restore(Report $report)
    {
        $report->load('order.partner');

        $report->order->partner->update([
            'suspended_at' => null,
            'suspension_reason' => null,
        ]);

        return back()->with('success', 'Akun vendor berhasil dipulihkan.');
    }

    /**
     * Halaman detail riwayat penangguhan vendor.
     */
    public function penangguhan(Report $report)
    {
        $report->load('order.partner');
        $partner = $report->order->partner;

        return Inertia::render('Admin/Reports/Penangguhan', [
            'report_id' => $report->id,
            'vendor' => [
                'nama_vendor' => $partner->name,
                'ditangguhkan_at' => optional($partner->suspended_at)->format('d M Y, H:i'),
                'alasan_penangguhan' => $partner->suspension_reason,
            ],
        ]);
    }
}