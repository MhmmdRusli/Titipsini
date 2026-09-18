<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Simulate the store() logic
$request = new \Illuminate\Http\Request();
$request->replace([
    'kategori' => 'barang',
    'nama_usaha' => 'Test Gudang',
    'provinsi' => 'DI YOGYAKARTA',
    'kabupaten_kota' => 'KABUPATEN BANTUL',
    'kecamatan' => 'BANGUNTAPAN',
    'alamat_lengkap' => 'Jl Test',
    'catatan_alamat' => '',
    'foto_lahan' => [],
    'panjang' => 10,
    'lebar' => 10,
    'jumlah_tampung' => 5,
]);

// Run validation manually
$validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
    'kategori' => ['required', 'in:barang,bangunan,kendaraan,pindahan'],
    'nama_usaha' => ['required', 'string', 'max:150'],
    'provinsi' => ['required', 'string', 'max:100'],
    'kabupaten_kota' => ['required', 'string', 'max:100'],
    'kecamatan' => ['required', 'string', 'max:100'],
    'alamat_lengkap' => ['required', 'string', 'max:500'],
    'catatan_alamat' => ['nullable', 'string', 'max:500'],
    'foto_lahan' => ['nullable', 'array', 'max:8'],
    'foto_lahan.*' => ['image', 'max:5120'],
    'panjang' => ['required', 'integer', 'min:1'],
    'lebar' => ['required', 'integer', 'min:1'],
    'jumlah_tampung' => ['required', 'integer', 'min:1'],
]);

if ($validator->fails()) {
    echo "Validation failed:\n";
    print_r($validator->errors()->toArray());
    exit;
}

$validated = $validator->validated();
echo "Validated data keys:\n";
print_r(array_keys($validated));
echo "\n\nkabupaten_kota: " . ($validated['kabupaten_kota'] ?? '(not set)') . "\n";

// Now simulate store() logic
if (isset($validated['nama_usaha'])) {
    $validated['nama'] = $validated['nama_usaha'];
    
    if ($validated['kategori'] === 'barang') {
        $validated['kota'] = $validated['kabupaten_kota'];
        echo "Copied kabupaten_kota to kota: " . $validated['kota'] . "\n";
    }
}

echo "\nFinal kota: " . ($validated['kota'] ?? '(empty)') . "\n";