<?php
namespace App\Http\Controllers\Customer;
use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
class DashboardController extends Controller
{
    public function index()
    {
        $customer = Auth::user();
        $vendors = User::where('role', 'partner')
            ->where('verification_status', 'verified')
            ->whereNull('suspended_at')
            ->when($customer->city, fn ($q) => $q->where('city', $customer->city))
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn (User $v) => [
                'id' => $v->id,
                'nama' => $v->name,
                'foto' => $v->foto ? Storage::url($v->foto) : null,
                'wilayah' => $v->wilayah,
            ]);
        $berita = Berita::whereNotNull('published_at')
            ->orderByDesc('published_at')
            ->limit(5)
            ->get()
            ->map(fn (Berita $b) => [
                'id' => $b->id,
                'judul' => $b->judul,
                // Foto berita disimpan lewat disk 'direct_public' (langsung
                // di public/berita/, bukan lewat symlink storage), jadi
                // pakai path absolut biasa, BUKAN Storage::url().
                'foto' => $b->foto ? '/' . ltrim($b->foto, '/') : null,
                'waktu' => $b->published_at->diffForHumans(),
            ]);

        // Aktivitas terakhir: 1 order TERBARU milik customer ini (apapun
        // statusnya), dipakai untuk menggantikan kartu "Aktivitas Terakhir"
        // yang sebelumnya hardcoded di Dashboard.jsx. Kalau customer belum
        // pernah order sama sekali, kirim null - frontend menampilkan
        // state kosong.
        $orderTerakhir = Order::where('customer_id', $customer->id)
            ->latest()
            ->first();

        $aktivitasTerakhir = $orderTerakhir ? [
            'id' => $orderTerakhir->id,
            'order_code' => $orderTerakhir->order_code,
            'service_type' => $orderTerakhir->service_type,
            'item_name' => $orderTerakhir->item_name,
            'status' => $orderTerakhir->status,
            'total_price' => (float) $orderTerakhir->total_price,
            'duration' => $orderTerakhir->duration,
            'waktu' => $orderTerakhir->created_at->diffForHumans(),
        ] : null;

        return Inertia::render('Customer/Dashboard', [
            'user' => [
                'name' => $customer->name,
                'foto' => $customer->foto ? Storage::url($customer->foto) : null,
                'wilayah' => $customer->wilayah,
            ],
            'saldo' => $customer->saldo ?? 0,
            'vendors' => $vendors,
            'berita' => $berita,
            'aktivitasTerakhir' => $aktivitasTerakhir,
        ]);
    }
}