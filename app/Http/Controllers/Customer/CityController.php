<?php

namespace App\Http\Controllers;

use App\Models\Mitra;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function search(Request $request)
    {
        $search = $request->input('search', '');

        return Mitra::query()
            ->select('kota', 'provinsi')
            ->when($search, fn ($q) => $q->where('kota', 'like', "%{$search}%"))
            ->distinct()
            ->orderBy('kota')
            ->limit(20)
            ->get()
            ->map(fn ($row) => [
                'nama' => $row->kota,
                'provinsi' => $row->provinsi,
            ]);
    }
}