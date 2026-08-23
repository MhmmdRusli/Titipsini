<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function search(Request $request)
    {
        $search = $request->input('search', '');

        return Service::query()
            ->where('kategori', 'kendaraan')
            ->where('is_active', true)
            ->select('kota')
            ->when($search, fn ($q) => $q->where('kota', 'like', "%{$search}%"))
            ->distinct()
            ->orderBy('kota')
            ->limit(20)
            ->get()
            ->map(fn ($row) => [
                'nama' => $row->kota,
                'provinsi' => null,
            ]);
    }
}