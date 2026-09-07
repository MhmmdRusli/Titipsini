<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$sm = \App\Models\SaldoMutasi::where('type', 'refund_deduction')->first();
if ($sm) {
    echo "SaldoMutasi ID: {$sm->id}\n";
    echo "Reference ID: {$sm->reference_id}\n";
    echo "Jumlah: {$sm->jumlah}\n";
    $o = \App\Models\Order::find($sm->reference_id);
    if ($o) {
        echo "Order total_price: {$o->total_price}\n";
        echo "Order refund_amount: {$o->refund_amount}\n";
        echo "Order refunded_at: {$o->refunded_at}\n";
        echo "Order refunded_by: {$o->refunded_by}\n";
        echo "Order refund_percentage: {$o->refund_percentage}\n";
    } else {
        echo "Order not found\n";
    }
} else {
    echo "No saldo_mutasi refund_deduction found\n";
}
