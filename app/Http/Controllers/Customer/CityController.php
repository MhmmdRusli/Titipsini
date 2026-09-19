<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Kota;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function search(Request $request)
    {
        $search = $request->input('search', '');
        $kategori = $request->input('kategori', 'kendaraan');

        // Get cities from both kota table and services
        $kotaTableResults = Kota::where('is_active', true)
            ->when($search, fn ($q) => $q->where('nama', 'like', "%{$search}%"))
            ->orderBy('nama')
            ->limit(20)
            ->get()
            ->map(fn ($row) => [
                'nama' => $row->nama,
                'provinsi' => $row->provinsi,
            ]);

        // Also get from services of the relevant category
        $serviceResults = Service::query()
            ->where('kategori', $kategori)
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

        // Merge and deduplicate by nama
        $merged = $kotaTableResults->merge($serviceResults)
            ->unique('nama')
            ->values()
            ->take(20);

        return $merged;
    }
}