<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class WilayahController extends Controller
{
    protected string $base = 'https://emsifa.github.io/api-wilayah-indonesia/api';

    /**
     * GET /api/wilayah/provinces
     */
    public function provinces(): JsonResponse
    {
        return response()->json(
            $this->fetch('provinces.json')
        );
    }

    /**
     * GET /api/wilayah/regencies/{provinceId}
     */
    public function regencies(string $provinceId): JsonResponse
    {
        return response()->json(
            $this->fetch("regencies/{$provinceId}.json")
        );
    }

    /**
     * GET /api/wilayah/districts/{regencyId}
     */
    public function districts(string $regencyId): JsonResponse
    {
        return response()->json(
            $this->fetch("districts/{$regencyId}.json")
        );
    }

    /**
     * Ambil data dari API wilayah eksternal, dengan cache ringan
     * supaya tidak membebani API pihak ketiga di setiap request,
     * dan normalisasi field agar konsisten { id, name }.
     */
    private function fetch(string $path): array
    {
        return Cache::remember("wilayah:{$path}", now()->addDay(), function () use ($path) {
            $response = Http::withOptions(['verify' => false])
                ->timeout(10)
                ->get("{$this->base}/{$path}");

            if ($response->failed()) {
                return [];
            }

            $data = $response->json();

            if (! is_array($data)) {
                return [];
            }

            return collect($data)
                ->map(fn (array $item) => [
                    'id' => $item['id'] ?? null,
                    'name' => $item['name'] ?? null,
                ])
                ->filter(fn (array $item) => $item['id'] !== null && $item['name'] !== null)
                ->values()
                ->all();
        });
    }
}