<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Fix old kota names to match new format
$mapping = [
    'Bogor' => 'KOTA BOGOR',
    'Yogyakarta' => 'KOTA YOGYAKARTA',
    'Jakarta' => 'KOTA JAKARTA',
    'Aceh' => 'KOTA ACEH',
    'Binjai' => 'KOTA BINJAI',
    'Dieng' => 'KABUPATEN WONOSOBO', // Dieng is in Wonosobo
    'Garut' => 'KABUPATEN GARUT',
    'Lampung' => 'KABUPATEN LAMPUNG',
    'Malang' => 'KOTA MALANG',
    'Medan' => 'KOTA MEDAN',
    'Nganjuk' => 'KABUPATEN NGANJUK',
    'Riau' => 'KABUPATEN KAMPAR', // Riau is province, need specific kabupaten
];

$fixed = 0;
foreach ($mapping as $old => $new) {
    $services = \App\Models\Service::where('kategori', 'barang')
        ->where('kota', $old)
        ->get();
    
    foreach ($services as $service) {
        $service->kota = $new;
        $service->save();
        echo "Fixed ID {$service->id}: '{$old}' -> '{$new}'\n";
        $fixed++;
    }
}

echo "\nTotal fixed: {$fixed}\n";