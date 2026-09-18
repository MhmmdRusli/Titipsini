<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test the actual controller method via route
$request = new \Illuminate\Http\Request();
$request->query->add([
    'kota' => 'KABUPATEN BANTUL',
]);

$controller = new \App\Http\Controllers\Customer\ServiceController();
$response = $controller->search($request, 'barang');

// Get the mitras data from the response
if (method_exists($response, 'getData')) {
    $data = $response->getData();
} else {
    // Inertia response
    $data = $response->props ?? [];
    if (empty($data)) {
        $reflection = new ReflectionClass($response);
        $prop = $reflection->getProperty('data');
        $prop->setAccessible(true);
        $data = $prop->getValue($response);
    }
}

if (isset($data['mitras'])) {
    $mitras = $data['mitras'];
    echo "Test results:\n";
    foreach ($mitras->items() as $i => $m) {
        $status = match($m['sort_priority'] ?? 99) {
            1 => 'BUKA',
            2 => 'SEDANG TUTUP',
            3 => 'SEGERA TERSEDIA',
            default => 'UNKNOWN',
        };
        echo "{$i}. ID:{$m['id']} | {$m['nama']} | priority: " . ($m['sort_priority'] ?? 'none') . " ({$status})\n";
    }
} else {
    echo "No mitras data found\n";
    print_r($data);
}