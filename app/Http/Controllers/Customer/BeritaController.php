<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Inertia\Inertia;
use Inertia\Response;

class BeritaController extends Controller
{
    public function index(): Response
    {
        $berita = Berita::query()
            ->whereNotNull('published_at')
            ->orderByDesc('published_at')
            ->paginate(10)
            ->through(function ($item) {
                $item->foto = $item->foto ? '/' . ltrim($item->foto, '/') : null;
                return $item;
            });

        return Inertia::render('Customer/Berita/Index', [
            'berita' => $berita,
        ]);
    }

    public function show(Berita $berita): Response
    {
        abort_unless($berita->published_at !== null, 404);

        $berita->foto = $berita->foto ? '/' . ltrim($berita->foto, '/') : null;

        // Berita lain untuk rekomendasi di bawah, exclude yang sedang dibuka
        $lainnya = Berita::query()
            ->whereNotNull('published_at')
            ->where('id', '!=', $berita->id)
            ->orderByDesc('published_at')
            ->limit(4)
            ->get()
            ->map(function ($item) {
                $item->foto = $item->foto ? '/' . ltrim($item->foto, '/') : null;
                return $item;
            });

        return Inertia::render('Customer/Berita/Show', [
            'berita' => $berita,
            'lainnya' => $lainnya,
        ]);
    }
}