<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test the query and sorting logic directly (bypassing Inertia)
$request = new \Illuminate\Http\Request();
$request->query->add(['kota' => 'KABUPATEN BANTUL']);

$kategori = 'barang';

$services = \App\Models\Service::query()
    ->where('kategori', $kategori)
    ->where('is_active', true)
    ->with('vendor:id,name,verification_status,jadwal_operasional')
    ->where('kota', $request->string('kota'))
    ->orderByRaw("
        CASE 
            WHEN services.verification_status = 'terverifikasi' 
                 AND EXISTS (
                     SELECT 1 FROM users 
                     WHERE users.id = services.user_id 
                     AND users.verification_status = 'terverifikasi'
                     AND users.jadwal_operasional IS NOT NULL
                     AND users.jadwal_operasional <> '[]'
                 ) THEN 1
            ELSE 2
        END
    ")
    ->latest()
    ->paginate(10);

// Use request query directly
$queryString = $request->query->all();

$now = now('Asia/Jakarta');
$dayNames = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
$hariIni = $dayNames[$now->dayOfWeek];

$sortedCollection = $services->getCollection()->transform(function ($service) use ($now, $hariIni) {
    $isOrderable = $service->isOrderable();
    $sedangTutup = false;
    
    if ($isOrderable && $service->vendor && $service->vendor->jadwal_operasional) {
        $jadwal = $service->vendor->jadwal_operasional;
        $h = $jadwal[$hariIni] ?? null;
        
        if (! $h || empty($h['aktif'])) {
            $sedangTutup = true;
        } else {
            $isOpen = false;
            $nowTime = $now->format('H:i');
            foreach (($h['slots'] ?? []) as $slot) {
                if (empty($slot['aktif']) || empty($slot['jam_buka']) || empty($slot['jam_tutup'])) continue;
                $buka = substr($slot['jam_buka'], 0, 5);
                $tutup = substr($slot['jam_tutup'], 0, 5);
                if ($nowTime >= $buka && $nowTime <= $tutup) { $isOpen = true; break; }
            }
            $sedangTutup = !$isOpen;
        }
    }
    
    $formatted = [
        'id' => $service->id,
        'nama' => $service->nama,
        'is_orderable' => $isOrderable,
        'sedang_tutup_hari_ini' => $sedangTutup,
        'sort_priority' => match (true) {
            $isOrderable && !$sedangTutup => 1,
            $isOrderable && $sedangTutup => 2,
            default => 3,
        },
    ];
    return $formatted;
})->sortBy('sort_priority')->values();

echo "Search method test - KABUPATEN BANTUL:\n";
foreach ($sortedCollection as $i => $m) {
    $status = match($m['sort_priority']) {
        1 => 'BUKA',
        2 => 'SEDANG TUTUP',
        3 => 'SEGERA TERSEDIA',
        default => 'UNKNOWN',
    };
    echo "{$i}. ID:{$m['id']} | {$m['nama']} | {$status}\n";
}