<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Fix kota table provinsi to match service format
$updates = [
    'Yogyakarta' => 'DI YOGYAKARTA',
    'Bandung' => 'JAWA BARAT',
    'Jakarta' => 'DKI JAKARTA',
    'Bogor' => 'JAWA BARAT',
    'Semarang' => 'JAWA TENGAH',
    'Surabaya' => 'JAWA TIMUR',
    'Malang' => 'JAWA TIMUR',
    'Tangerang' => 'JAWA BARAT',
    'Dieng' => 'JAWA TENGAH',
    'Sleman' => 'JAWA TENGAH',
    'Medan' => 'SUMATERA UTARA',
    'Padang' => 'SUMATERA BARAT',
    'Palembang' => 'SUMATERA SELATAN',
    'Lampung' => 'LAMPUNG',
    'Nganjuk' => 'JAWA TIMUR',
    'Solo' => 'JAWA TENGAH',
    'Garut' => 'JAWA BARAT',
    'Binjai' => 'SUMATERA UTARA',
    'Riau' => 'RIAU',
    'Aceh' => 'ACEH',
];

foreach ($updates as $kota => $provinsi) {
    $affected = \App\Models\Kota::where('nama', $kota)->update(['provinsi' => $provinsi]);
    if ($affected) {
        echo "Updated {$kota}: provinsi = {$provinsi}\n";
    }
}

echo "\nDone!\n";