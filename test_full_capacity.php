<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== TEST KAPASITAS PENUH (IS_FULL) ===\n\n";

$service = \App\Models\Service::where('kategori', 'barang')
    ->where('jumlah_tampung', '>', 0)
    ->with('vendor')
    ->first();

if (! $service) {
    echo "❌ Tidak ada service dengan jumlah_tampung\n";
    exit;
}

echo "Service: {$service->nama} (kapasitas: {$service->jumlah_tampung})\n\n";

$customer = \App\Models\User::where('role', 'customer')->first();
if (! $customer) {
    echo "❌ No customer\n";
    exit;
}

// Buat order sampai penuh
$orders = [];
for ($i = 1; $i <= $service->jumlah_tampung; $i++) {
    $order = \App\Models\Order::create([
        'order_code' => 'FULLTEST-' . $i . '-' . uniqid(),
        'customer_id' => $customer->id,
        'partner_id' => $service->user_id,
        'service_id' => $service->id,
        'service_type' => 'barang',
        'item_name' => "Test {$i}",
        'harga_per_hari' => 10000,
        'start_date' => now()->toDateString(),
        'end_date' => now()->addDays(2)->toDateString(),
        'duration' => 2,
        'is_pickup' => false,
        'status' => 'baru',
        'subtotal' => 20000,
        'discount' => 0,
        'pickup_fee' => 0,
        'biaya_layanan' => 1000,
        'total_price' => 21000,
        'payment_method' => 'default',
    ]);
    $orders[] = $order;
    echo "Order {$i}: {$order->order_code}\n";
}

$service->refresh();
echo "\n--- Setelah {$service->jumlah_tampung} order ---\n";
echo "Active: " . $service->getActiveOrdersCount() . "\n";
echo "Remaining: " . $service->getRemainingCapacity() . "\n";
echo "Is Full: " . ($service->isFull() ? 'TRUE ✅' : 'false') . "\n";

$capData = $service->getCapacityData();
echo "Capacity data: " . json_encode($capData) . "\n";

// Test ensureOrderable should fail now
echo "\n--- Test ensureOrderable (should fail - full) ---\n";
try {
    $controller = new \App\Http\Controllers\Customer\ServiceController();
    $reflection = new ReflectionClass($controller);
    $method = $reflection->getMethod('ensureOrderable');
    $method->setAccessible(true);
    $method->invoke($controller, $service);
    echo "❌ ensureOrderable() passed (should fail!)\n";
} catch (Exception $e) {
    echo "✅ ensureOrderable() correctly failed: " . $e->getMessage() . "\n";
}

// Cleanup
foreach ($orders as $o) {
    $o->delete();
}
echo "\n🧹 Cleaned up\n";