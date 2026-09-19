<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test CityController search
$search = 'Yogyakarta';
$kategori = 'barang';

$kotaTableResults = \App\Models\Kota::where('is_active', true)
    ->when($search, fn ($q) => $q->where('nama', 'like', "%{$search}%"))
    ->orderBy('nama')
    ->limit(20)
    ->get()
    ->map(fn ($row) => [
        'nama' => $row->nama,
        'provinsi' => $row->provinsi,
    ]);

$serviceResults = \App\Models\Service::query()
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

$merged = $kotaTableResults->merge($serviceResults)
    ->unique('nama')
    ->values()
    ->take(20);

echo "City search results for '{$search}' (kategori: {$kategori}):\n";
foreach ($merged as $city) {
    echo "  {$city['nama']} | provinsi: " . ($city['provinsi'] ?? 'N/A') . "\n";
}