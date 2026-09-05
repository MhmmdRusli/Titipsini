<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\Order;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function create(Request $request, Order $order): Response
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        return Inertia::render('Customer/Orders/Lapor', [
            'order' => [
                'id' => $order->id,
                'order_code' => $order->order_code,
                'vendor_nama' => $order->partner?->name,
                'jenis_layanan' => $order->service_type,
                'item_name' => $order->item_name,
            ],
        ]);
    }

    public function store(Request $request, Order $order)
    {
        abort_unless($order->customer_id === $request->user()->id, 403);
        abort_unless(in_array($order->status, ['diproses', 'selesai']), 422,
            'Laporan hanya dapat diajukan untuk pesanan yang sedang berjalan atau selesai.');

        $validated = $request->validate([
            'category'        => ['required', Rule::in(['complain', 'kerugian'])],
            'description'     => ['required', 'string', 'max:1000'],
            'evidence'        => ['required', 'image', 'mimes:jpeg,png,jpg', 'max:4096'],
            'item_condition'  => ['nullable', 'string', 'max:255'],
            'estimated_loss'  => ['nullable', 'numeric', 'min:0'],
        ]);

        if ($validated['category'] === 'kerugian') {
            $request->validate([
                'item_condition' => ['required', 'string', 'max:255'],
                'estimated_loss' => ['required', 'numeric', 'min:0'],
            ]);
        }

        $path = $request->file('evidence')->store('report-evidence', 'public');

        $report = Report::create([
            'order_id'       => $order->id,
            'category'       => $validated['category'],
            'description'    => $validated['description'],
            'item_condition' => $validated['item_condition'] ?? null,
            'estimated_loss' => $validated['estimated_loss'] ?? null,
            'evidence_url'   => Storage::url($path),
            'status'         => 'menunggu',
        ]);

        $this->notifyAdmins($report);

        return back()
            ->with('success', 'Laporan berhasil dikirim. Tim admin akan segera meninjaunya.');
    }

    protected function notifyAdmins(Report $report): void
    {
        $order = $report->order;
        $labelKategori = $report->category === 'kerugian'
            ? 'Kerugian / Kerusakan Barang'
            : 'Komplain Pelayanan';

        $adminIds = User::query()
            ->whereIn('role', ['admin', 'super_admin'])
            ->pluck('id');

        foreach ($adminIds as $adminId) {
            Notifikasi::create([
                'user_id' => $adminId,
                'order_id' => $order?->id,
                'type'    => 'report_diajukan',
                'judul'   => 'Laporan baru dari customer',
                'pesan'   => "Order #{$order?->order_code} - {$labelKategori}",
            ]);
        }
    }
}
