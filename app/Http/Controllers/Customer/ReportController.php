<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            ],
        ]);
    }

    public function store(Request $request, Order $order)
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        $validated = $request->validate([
            'description' => ['required', 'string', 'max:1000'],
            'evidence' => ['nullable', 'image', 'max:4096'],
        ]);

        $evidenceUrl = null;
        if ($request->hasFile('evidence')) {
            $path = $request->file('evidence')->store('report-evidence', 'public');
            $evidenceUrl = Storage::url($path);
        }

        Report::create([
            'order_id' => $order->id,
            'description' => $validated['description'],
            'evidence_url' => $evidenceUrl,
        ]);

        return redirect()
            ->route('customer.orders.show', $order->id)
            ->with('success', 'Laporan kamu berhasil dikirim. Tim kami akan segera meninjaunya.');
    }
}