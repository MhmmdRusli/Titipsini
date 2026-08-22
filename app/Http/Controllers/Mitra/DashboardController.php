<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    private const HARI_LIST = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

    public function index(): Response
    {
        /** @var \App\Models\User $partner */
        $partner = Auth::user();

        // 1. Ambil pesanan aktif milik mitra ini
        $pesananAktifQuery = Order::where('partner_id', $partner->id)
            ->whereNotIn('status', ['selesai', 'completed', 'dibatalkan', 'cancelled']);

        $pesananBarang = (clone $pesananAktifQuery)
            ->where(function ($q) {
                $q->where('service_type', 'barang')
                  ->orWhere('service_type', 'titip_barang');
            })->count();

        $pesananKendaraan = (clone $pesananAktifQuery)
            ->where(function ($q) {
                $q->where('service_type', 'kendaraan')
                  ->orWhere('service_type', 'titip_kendaraan');
            })->count();

        // 2. Ambil saldo bersih dari method saldoMitra()
        $saldoTampil = $partner->saldoMitra();

        // 3. Ambil Kategori Layanan Aktif
        $layananKategori = $partner->services()
            ->where('is_active', true)
            ->distinct()
            ->pluck('kategori')
            ->map(fn ($item) => strtolower($item))
            ->values()
            ->all();

        // 4. Hitung status buka/tutup toko hari ini dari jadwal_operasional
        $statusToko = $this->hitungStatusToko($partner->jadwal_operasional ?? []);

        // 5. Cek status verifikasi KTP (Fleksibel mendukung string atau boolean)
        $isVerified = in_array(strtolower((string) $partner->verification_status), ['terverifikasi', 'verified', '1', 'true'], true) 
            || (bool) $partner->is_verified;

        // 6. Flag "baru saja login/daftar" — session()->pull() otomatis MENGHAPUS
        // nilainya setelah dibaca, jadi cuma true SEKALI di request berikutnya
        // setelah login, dan false lagi untuk navigasi-navigasi setelahnya.
        $justLoggedIn = session()->pull('mitra_just_authenticated', false);

        return Inertia::render('Mitra/Dashboard', [
            'partner' => [
                'name' => $partner->name,
                'avatar' => $partner->avatar ? Storage::disk('direct_public')->url($partner->avatar) : null,
                'is_verified' => $isVerified,
            ],
            'just_logged_in' => $justLoggedIn,
            'saldo' => $saldoTampil,
            'toko' => [
                'nama' => $partner->nama_usaha ?? $partner->name,
                'alamat' => $partner->address,
                'buka' => $statusToko['buka'],
                'jam_buka' => $statusToko['jam_buka'],
                'jam_tutup' => $statusToko['jam_tutup'],
            ],
            'layanan' => $layananKategori,
            'pesanan' => [
                'barang' => $pesananBarang,
                'kendaraan' => $pesananKendaraan,
            ],
        ]);
    }

    /**
     * Menentukan apakah toko sedang buka SAAT INI berdasarkan jadwal_operasional,
     * dan jam berapa yang relevan ditampilkan (slot yang sedang berjalan kalau
     * buka, atau slot pertama hari ini sebagai referensi kalau tutup).
     */
    private function hitungStatusToko(array $jadwalOperasional): array
    {
        // Kunci timezone Asia/Jakarta agar tidak bentrok dengan UTC server
        $sekarang = Carbon::now('Asia/Jakarta');
        
        // dayOfWeekIso: Senin=1 ... Minggu=7, pas dengan urutan HARI_LIST
        $hariIni = self::HARI_LIST[$sekarang->dayOfWeekIso - 1];
        
        // Gunakan format H:i:s agar konsisten dengan format waktu database
        $jamSekarang = $sekarang->format('H:i:s');

        $jadwalHariIni = $jadwalOperasional[$hariIni] ?? null;

        // Hari ini memang di-nonaktifkan mitra, atau belum pernah diatur sama sekali
        if (! $jadwalHariIni || empty($jadwalHariIni['aktif'])) {
            return ['buka' => false, 'jam_buka' => null, 'jam_tutup' => null];
        }

        $slots = collect($jadwalHariIni['slots'] ?? [])
            ->filter(fn ($slot) => ! empty($slot['aktif']) && ! empty($slot['jam_buka']) && ! empty($slot['jam_tutup']))
            ->values();

        if ($slots->isEmpty()) {
            return ['buka' => false, 'jam_buka' => null, 'jam_tutup' => null];
        }

        // Cek apakah sekarang ada di dalam salah satu slot yang aktif -> berarti toko BUKA
        $slotBerjalan = $slots->first(function ($slot) use ($jamSekarang) {
            $buka = Carbon::parse($slot['jam_buka'])->format('H:i:s');
            $tutup = Carbon::parse($slot['jam_tutup'])->format('H:i:s');

            return $jamSekarang >= $buka && $jamSekarang <= $tutup;
        });

        if ($slotBerjalan) {
            return [
                'buka' => true,
                'jam_buka' => Carbon::parse($slotBerjalan['jam_buka'])->format('H:i'),
                'jam_tutup' => Carbon::parse($slotBerjalan['jam_tutup'])->format('H:i'),
            ];
        }

        // Tidak sedang buka, tampilkan slot pertama hari ini sekadar referensi jam operasional
        $slotPertama = $slots->first();

        return [
            'buka' => false,
            'jam_buka' => Carbon::parse($slotPertama['jam_buka'])->format('H:i'),
            'jam_tutup' => Carbon::parse($slotPertama['jam_tutup'])->format('H:i'),
        ];
    }
}