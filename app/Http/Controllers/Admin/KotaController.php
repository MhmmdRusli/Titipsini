<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kota;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KotaController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();

        $kota = Kota::withCount('vendors as jumlah_vendor')
            ->when($search, function ($query, $search) {
                $query->where('nama', 'like', "%{$search}%")
                    ->orWhere('provinsi', 'like', "%{$search}%");
            })
            ->orderBy('nama')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Kota/Index', [
            'kota' => $kota,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100', 'unique:kota,nama'],
            'provinsi' => ['required', 'string', 'max:100'],
            'is_active' => ['boolean'],
        ]);

        Kota::create($validated);

        return redirect()->back()->with('success', 'Kota berhasil ditambahkan.');
    }

    public function update(Request $request, Kota $kotum)
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100', 'unique:kota,nama,' . $kotum->id],
            'provinsi' => ['required', 'string', 'max:100'],
            'is_active' => ['boolean'],
        ]);

        $kotum->update($validated);

        return redirect()->back()->with('success', 'Kota berhasil diperbarui.');
    }

    public function destroy(Kota $kotum)
    {
        $kotum->delete();

        return redirect()->back()->with('success', 'Kota berhasil dihapus.');
    }
}