<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Service;
use App\Models\User;

echo "=== SERVICE PINDHAN: verification_status vs is_active ===\n\n";

$services = Service::where('kategori', 'pindahan')
    ->select('id', 'user_id', 'kota', 'verification_status', 'is_active', 'harga')
    ->orderBy('id', 'desc')
    ->get();

foreach ($services as $s) {
    $vendor = $s->user_id ? User::find($s->user_id) : null;
    $vendorStatus = $vendor ? $vendor->verification_status : '-';
    echo "ID: {$s->id} | user:{$s->user_id}({$vendorStatus}) | kota:{$s->kota} | harga:{$s->harga} | svc_status:{$s->verification_status} | is_active:" . ($s->is_active ? 'TRUE' : 'FALSE') . "\n";
}

echo "\n=== KASUS KUNCI: terverifikasi TAPI is_active=FALSE ===\n";
$cases = Service::where('kategori', 'pindahan')
    ->where('verification_status', 'terverifikasi')
    ->where('is_active', false)
    ->select('id', 'user_id', 'kota', 'verification_status', 'is_active', 'harga')
    ->get();

if ($cases->isEmpty()) {
    echo "Tidak ada service pindahan 'terverifikasi' dengan is_active=FALSE.\n";
} else {
    echo "DITEMU: " . $cases->count() . " service!\n";
    foreach ($cases as $c) {
        echo "  -> ID {$c->id} | kota:{$c->kota} | harga:{$c->harga} | is_active:FALSE\n";
    }
}
