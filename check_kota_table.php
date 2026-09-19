<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Check kota table data
$kotas = \App\Models\Kota::where('is_active', true)->get(['nama', 'provinsi']);
echo "All active kotas:\n";
foreach ($kotas as $k) {
    echo "  {$k->nama} | {$k->provinsi}\n";
}

// Search for yogyakarta
$searchQuery = 'Yogyakarta';
$matchedKotas = \App\Models\Kota::where('is_active', true)
    ->where(function ($q) use ($searchQuery) {
        $q->where('nama', 'like', "%{$searchQuery}%");
    })
    ->get(['nama', 'provinsi']);

echo "\nMatched kotas for '{$searchQuery}':\n";
foreach ($matchedKotas as $k) {
    echo "  {$k->nama} | {$k->provinsi}\n";
}