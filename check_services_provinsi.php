<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Check services with their provinsi
$services = \App\Models\Service::where('kategori', 'barang')
    ->where('is_active', true)
    ->get(['id', 'nama', 'kota', 'provinsi', 'kecamatan']);

echo "Services with provinsi:\n";
foreach ($services as $s) {
    echo "  ID:{$s->id} | {$s->nama} | kota:{$s->kota} | provinsi:{$s->provinsi} | kec:{$s->kecamatan}\n";
}