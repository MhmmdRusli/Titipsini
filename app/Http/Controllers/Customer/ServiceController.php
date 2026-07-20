<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * GET /app/services?kategori=kendaraan&jenis=mobil&search=Yogyakarta
     */
    public function index(Request $request): Response
    {
        $kategori = $request->string('kategori')->toString();
        $jenis = $request->string('jenis')->toString();
        $search = $request->string('search')->toString();

        $services = Service::query()
            ->where('is_active', true)
            ->when($kategori, fn ($query) => $query->where('kategori', $kategori))
            ->when($jenis, fn ($query) => $query->where('jenis_kendaraan', $jenis))
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kota', 'like', "%{$search}%")
                        ->orWhere('kecamatan', 'like', "%{$search}%");
                });
            })
            ->with('vendor:id,name')
            ->orderBy('kota')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Customer/Services/Index', [
            'services' => $services,
            'filters' => [
                'kategori' => $kategori,
                'jenis' => $jenis,
                'search' => $search,
            ],
        ]);
    }
}