<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test nearby search
$latitude = -7.7971;  // Yogyakarta
$longitude = 110.3705;

$services = \App\Models\Service::query()
    ->where('is_active', true)
    ->whereNotNull('latitude')
    ->whereNotNull('longitude')
    ->where('kategori', 'barang')
    ->select('services.*')
    ->selectRaw("(6371 * acos(cos(radians({$latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians({$longitude})) + sin(radians({$latitude})) * sin(radians(latitude)))) as distance_km")
    ->having('distance_km', '<=', 10)
    ->with('vendor:id,name,verification_status,jadwal_operasional')
    ->orderBy('distance_km')
    ->get();

echo "Nearby services (10km from Yogyakarta):\n";
foreach ($services as $s) {
    $orderable = $s->isOrderable();
    echo "  ID:{$s->id} | {$s->nama} | {$s->kota} | lat:{$s->latitude} lng:{$s->longitude} | dist:{$s->distance_km}km | orderable: " . ($orderable ? 'true' : 'false') . "\n";
}