<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PendapatanController extends Controller
{
    /**
     * GET /mitra/pendapatan/riwayat
     * Riwayat pendapatan dari pesanan yang sudah selesai.
     */
    public function riwayat(Request $request): Response
    {
        $partner = Auth::user();

        $riwayat = Order::where('partner_id', $partner->id)
            ->whereIn('status', ['selesai', 'completed', 'success'])
            ->latest('updated_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Order $order) => [
                'id' => $order->id,
                'order_code' => $order->order_code,
                'service_type' => $order->service_type,
                'item_name' => $order->item_name,
                'total_price' => (float) $order->total_price,
                'tanggal' => optional($order->updated_at)->translatedFormat('d M Y, H:i'),
            ]);

        $totalPendapatan = Order::where('partner_id', $partner->id)
            ->whereIn('status', ['selesai', 'completed', 'success'])
            ->sum('total_price');

        return Inertia::render('Mitra/Pendapatan/Riwayat', [
            'riwayat' => $riwayat,
            'totalPendapatan' => (float) $totalPendapatan,
        ]);
    }
}