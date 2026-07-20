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
            ->paginate(10);

        return Inertia::render('Customer/Berita/Index', [
            'berita' => $berita,
        ]);
    }
}