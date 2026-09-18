<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$services = \App\Models\Service::where('kategori', 'barang')->get();
foreach ($services as $service) {
    echo '---' . PHP_EOL;
    echo 'ID: ' . $service->id . PHP_EOL;
    echo 'Nama: ' . $service->nama . PHP_EOL;
    echo 'Kota: ' . ($service->kota ?? '(empty)') . PHP_EOL;
    echo 'Kecamatan: ' . ($service->kecamatan ?? '(empty)') . PHP_EOL;
    echo 'is_active: ' . ($service->is_active ? 'true' : 'false') . PHP_EOL;
    echo 'verification_status: ' . $service->verification_status . PHP_EOL;
    echo 'kabupaten_kota: ' . ($service->kabupaten_kota ?? '(empty)') . PHP_EOL;
    echo 'provinsi: ' . ($service->provinsi ?? '(empty)') . PHP_EOL;
    echo 'alamat_lengkap: ' . ($service->alamat_lengkap ?? '(empty)') . PHP_EOL;
    echo 'Mitra: ' . ($service->vendor?->name ?? 'none') . PHP_EOL;
}