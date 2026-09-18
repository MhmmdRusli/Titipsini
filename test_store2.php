<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Simulate the actual request from FormIdentitasGudang
$request = new \Illuminate\Http\Request();
$request->replace([
    'kategori' => 'barang',
    'nama_usaha' => 'Test Gudang Baru',
    'provinsi' => 'DI YOGYAKARTA',
    'kabupaten_kota' => 'KABUPATEN BANTUL',
    'kecamatan' => 'BANGUNTAPAN',
    'alamat_lengkap' => 'Jl Test No 1',
    'catatan_alamat' => 'Catatan test',
    'foto_lahan' => [],
    'panjang' => '20',
    'lebar' => '15',
    'jumlah_tampung' => '10',
]);

// Use the actual validated() method from ServiceController
$controller = new \App\Http\Controllers\Mitra\ServiceController();

try {
    $validated = $controller->validated($request);
    echo "Validated successfully!\n";
    echo "kabupaten_kota: " . ($validated['kabupaten_kota'] ?? '(missing)') . "\n";
    echo "kota (before copy): " . ($validated['kota'] ?? '(empty)') . "\n";
    
    // Simulate store() logic
    if (isset($validated['nama_usaha'])) {
        $validated['nama'] = $validated['nama_usaha'];
        
        if ($validated['kategori'] === 'barang') {
            $validated['kota'] = $validated['kabupaten_kota'];
            echo "Copied kabupaten_kota to kota: " . $validated['kota'] . "\n";
        }
    }
    
    echo "Final kota: " . ($validated['kota'] ?? '(empty)') . "\n";
    
} catch (\Illuminate\Validation\ValidationException $e) {
    echo "Validation failed:\n";
    print_r($e->errors());
}