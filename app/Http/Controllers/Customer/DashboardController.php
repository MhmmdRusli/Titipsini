<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Berita;
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
                'foto' => $b->foto ? Storage::url($b->foto) : null,
                'waktu' => $b->published_at->diffForHumans(),
            ]);

        return Inertia::render('Customer/Dashboard', [
            'user' => [
                'name' => $customer->name,
                'foto' => $customer->foto ? Storage::url($customer->foto) : null,
                'wilayah' => $customer->wilayah,
            ],
            'saldo' => $customer->saldo ?? 0,
            'vendors' => $vendors,
            'berita' => $berita,
        ]);
    }
}