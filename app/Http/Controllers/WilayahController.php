<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;

class WilayahController extends Controller
{
    protected string $base = 'https://emsifa.github.io/api-wilayah-indonesia/api';

    public function provinces()
    {
        return response()->json(
            Http::withOptions(['verify' => false])->get("{$this->base}/provinces.json")->json()
        );
    }

    public function regencies(string $provinceId)
    {
        return response()->json(
            Http::withOptions(['verify' => false])->get("{$this->base}/regencies/{$provinceId}.json")->json()
        );
    }

    public function districts(string $regencyId)
    {
        return response()->json(
            Http::withOptions(['verify' => false])->get("{$this->base}/districts/{$regencyId}.json")->json()
        );
    }
}