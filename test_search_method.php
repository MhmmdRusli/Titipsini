<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test search method (simulating what the controller does)
$request = new \Illuminate\Http\Request();
$request->query->add(['kota' => 'KABUPATEN BANTUL']);

$controller = new \App\Http\Controllers\Customer\ServiceController();

// Use reflection to call protected method
$reflection = new ReflectionClass($controller);
$method = $reflection->getMethod('search');
$method->setAccessible(true);

$response = $method->invoke($controller, $request, 'barang');

// Check if it works
if ($response) {
    $data = $response->getData();
    if (isset($data['mitras'])) {
        echo "Search method works!\n";
        foreach ($data['mitras']->items() as $i => $m) {
            $status = match($m['sort_priority'] ?? 99) {
                1 => 'BUKA',
                2 => 'SEDANG TUTUP',
                3 => 'SEGERA TERSEDIA',
                default => 'UNKNOWN',
            };
            echo "{$i}. ID:{$m['id']} | {$m['nama']} | {$status}\n";
        }
    }
}