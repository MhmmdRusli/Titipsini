<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Concerns\HasTrashMeta;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable implements MustVerifyEmail
{
   
       use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasTrashMeta;

    /**
     * role: admin | finance | super_admin | customer | partner
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'pin',
        'avatar',
        'cover_photo',
        'foto',
        'foto_ktp',
        'gender',
        'birth_date',
        'tanggal_lahir',
        'address',
        'role',
        'phone',
        'city',
        'provinsi',
        'kecamatan',
        'wilayah',
        'postal_code',
        'toko_buka',
        'jam_buka',
        'jam_tutup',
        'layanan_kategori',
        'jadwal_operasional',
        'fitur_penuh_kategori',
        'verification_status',
        'rejection_reason',
        'suspended_at',
        'suspension_reason',
        'restoration_requested_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'pin',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'verified_at' => 'datetime',
            'birth_date' => 'date',
            'password' => 'hashed',
            'pin' => 'hashed',
            'toko_buka' => 'boolean',
            'layanan_kategori' => 'array',
            'jadwal_operasional' => 'array',
            'fitur_penuh_kategori' => 'array',
            'deleted_at' => 'datetime',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    public function isPartner(): bool
    {
        return $this->role === 'partner';
    }

    public function isVerifiedPartner(): bool
    {
        return $this->role === 'partner' && $this->verification_status === 'terverifikasi';
    }

    /**
     * True kalau mitra sudah memasang jam operasional dengan BENAR:
     * ada minimal satu hari yang `aktif = true` dan punya minimal satu slot
     * dengan jam buka & jam tutup terisi. Tanpa ini, scopeOrderable() salah
     * menganggap mitra yang data jadwal_operasional-nya ada tapi tidak ada
     * hari aktif/slot aktif sebagai "sudah lengkap" - padahal customer
     * tetap tidak punya jam operasional yang valid.
     */
    public function jadwalOperasionalValid(): bool
    {
        $jadwal = $this->jadwal_operasional;

        if (! is_array($jadwal) || empty($jadwal)) {
            return false;
        }

        foreach ($jadwal as $hari) {
            if (empty($hari['aktif'])) {
                continue;
            }

            foreach ($hari['slots'] ?? [] as $slot) {
                if (! empty($slot['aktif']) && ! empty($slot['jam_buka']) && ! empty($slot['jam_tutup'])) {
                    return true;
                }
            }
        }

        return false;
    }

    public function getVendorIdAttribute(): string
    {
        return 'VDR-'.str_pad((string) $this->id, 5, '0', STR_PAD_LEFT);
    }

        public function getCustomerCodeAttribute(): string
    {
        return 'CU'.str_pad((string) $this->id, 4, '0', STR_PAD_LEFT);
    }

    public function ordersAsCustomer(): HasMany
    {
        return $this->hasMany(Order::class, 'customer_id');
    }

    public function notifikasi(): HasMany
    {
        return $this->hasMany(\App\Models\Notifikasi::class);
    }

    public function ordersAsPartner(): HasMany
    {
        return $this->hasMany(Order::class, 'partner_id');
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    // 👇 DITAMBAHKAN: relasi ke alamat pengiriman/penitipan milik customer.
    // Dipakai oleh Customer\AddressController (index, store, dst).
    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    public function topups(): HasMany
    {
        return $this->hasMany(Topup::class);
    }

    /**
     * Menghitung sisa saldo bersih mitra yang siap ditarik/cair.
     *
     * Terdiri dari 2 komponen:
     * 1. Hasil transaksi normal (total_price) SETELAH dipotong komisi platform.
     * 2. Denda keterlambatan (Order::hitungDenda()) - masuk 100% ke mitra,
     *    TIDAK dipotong komisi sama sekali, karena mitra yang dirugikan
     *    langsung oleh keterlambatan (gudang/kendaraan tertahan lebih lama).
     *
     * Keduanya hanya dihitung dari order yang statusnya SUDAH 'selesai' -
     * konsisten dengan titik finalisasi keuangan yang sama dipakai
     * Admin\OrderController::catatPendapatanPlatform().
     */
        public function saldoMitra(): int
    {
        $ordersSelesai = \App\Models\Order::where('partner_id', $this->id)
            ->whereIn('status', ['selesai', 'completed', 'success'])
            ->get();

        return (int) max(0, $this->hitungSaldoKotorMitra($ordersSelesai) - $this->totalPenarikanMitra());
    }

    /**
     * Utang mitra akibat refund - kejadian kalau mitra SUDAH menarik dana
     * lebih besar dari hak yang tersisa SETELAH sebagian order-nya
     * di-refund ke customer. Dihitung dinamis (bukan kolom tersimpan),
     * konsisten dengan cara saldoMitra() dihitung.
     */
    public function utangRefund(): int
    {
        $ordersSelesai = \App\Models\Order::where('partner_id', $this->id)
            ->whereIn('status', ['selesai', 'completed', 'success'])
            ->get();

        $selisih = $this->totalPenarikanMitra() - $this->hitungSaldoKotorMitra($ordersSelesai);

        return (int) max(0, $selisih);
    }

    public function adaRefund(): bool
    {
        return \App\Models\Order::where('partner_id', $this->id)
            ->whereIn('status', ['selesai', 'completed', 'success'])
            ->whereNotNull('refund_amount')
            ->exists();
    }

    protected function hitungSaldoKotorMitra($ordersSelesai): float
    {
        // Kotor dikurangi bagian yang sudah dikembalikan ke customer -
        // itu bukan lagi hak mitra begitu refund disetujui admin.
        $totalKotor = $ordersSelesai->sum(
            fn ($order) => (float) $order->total_price - (float) ($order->refund_amount ?? 0)
        );

        $paymentSetting = \App\Models\PaymentSetting::first();
        $komisiPersen = $paymentSetting->komisi_persen
            ?? $paymentSetting->persen_komisi
            ?? $paymentSetting->platform_fee
            ?? 0;

        $persentaseMitra = max(0, (100 - $komisiPersen) / 100);
        $saldoBersihTransaksi = $totalKotor * $persentaseMitra;

        // Denda 100% masuk mitra, tidak ikut dikurangi persentase komisi -
        // dan TIDAK disentuh refund (refund cuma memotong total_price,
        // bukan denda yang memang komponen terpisah).
        $totalDenda = $ordersSelesai->sum(
            fn ($order) => $order->denda_paid_at ? $order->hitungDenda() : 0
        );

        return $saldoBersihTransaksi + $totalDenda;
    }

    protected function totalPenarikanMitra(): float
    {
        return (float) \App\Models\Penarikan::where('user_id', $this->id)
            ->whereNotIn('status', ['ditolak', 'rejected', 'failed', 'gagal'])
            ->sum('jumlah');
    }

}