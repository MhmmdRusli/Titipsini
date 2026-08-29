<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_code',
        'order_number',
        'customer_id',
        'partner_id',
        'service_id',
        'service_type',
        'item_name',
        'item_description',
        'jumlah_barang',
        'ukuran_barang',
        'harga_per_hari',
        'ukuran_panjang',
        'ukuran_lebar',
        'start_date',
        'end_date',
        'duration',
        'is_pickup',
        'address_id',
        'pickup_status',
        'jam_pickup',
        'foto_barang_url',
        'pickup_address',
        'dropoff_address',
        'city',
        'status',
        'fase',
        'pickup_requested_at',
        'tanggal_selesai_aktual',
        'denda_paid_at',
        'denda_amount',
        'denda_payment_receipt',
        'bukti_denda',
        'status_denda',
        'cancel_reason',
        'rating',
        'review',
        'subtotal',
        'discount',
        'pickup_fee',
        'biaya_layanan',
        'total_price',
        'total',
        'payment_method',
        'payment_receipt',
        'payment_verified_at',
        'extend_end_date',
        'extend_price',
        'extend_requested_at',
        'extend_paid_at',
        'extend_payment_method',
        'extend_payment_receipt',
        'status_perpanjangan',
        'jam_pickup',
        'jumlah_barang',
        'ukuran_barang',
        'harga_per_hari',
        'foto_barang_url',
        'biaya_layanan',
    ];

    protected $appends = ['denda'];

    protected function casts(): array
    {
        return [
            'is_pickup' => 'boolean',
            'jumlah_barang' => 'integer',
            'rating' => 'integer',
            'harga_per_hari' => 'decimal:2',
            'biaya_layanan' => 'decimal:2',
            'total_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'discount' => 'decimal:2',
            'pickup_fee' => 'decimal:2',
            'total' => 'decimal:2',
            'payment_verified_at' => 'datetime',
            'tanggal_selesai_aktual' => 'datetime',
            'pickup_requested_at' => 'datetime',
            'denda_paid_at' => 'datetime',
            'denda_amount' => 'decimal:2',
            'start_date' => 'date',
            'end_date' => 'date',
            'ukuran_panjang' => 'integer',
            'ukuran_lebar' => 'integer',
            'extend_end_date' => 'date',
            'extend_requested_at' => 'datetime',
            'extend_paid_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function partner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'partner_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class, 'address_id');
    }

    /**
     * Hitung denda keterlambatan.
     *
     * Kalau denda SUDAH dibayar (denda_paid_at terisi), kembalikan nominal
     * yang disimpan di `denda_amount` - nilainya harus BEKU supaya tidak
     * "mengembang" tiap hari setelah lunas, dan supaya saldo mitra cocok
     * dengan yang benar-benar ditagih ke customer.
     *
     * Kalau belum dibayar, hitung live lewat hitungDendaFormula().
     *
     * Return 0 kalau:
     * - Tidak ada end_date sama sekali
     * - Belum melewati deadline (tidak terlambat)
     * - Order berstatus 'dibatalkan'
     */
    public function hitungDenda(): float
    {
        if (! $this->end_date || $this->status === 'dibatalkan') {
            return 0.0;
        }

        if ($this->denda_paid_at !== null) {
            return (float) ($this->denda_amount ?? $this->hitungDendaFormula());
        }

        return $this->hitungDendaFormula();
    }

    /**
     * Hitungan denda live (belum dibayar) berdasarkan deadline efektif vs
     * kapan order benar-benar selesai / sekarang.
     *
     * Rumus: total_price * persen_per_hari * jumlah_hari_terlambat / 100,
     * dibatasi maksimal (max_persen / 100) * total_price.
     */
    protected function hitungDendaFormula(): float
    {
        $hariTerlambat = $this->hariTerlambatDenda();

        if ($hariTerlambat <= 0) {
            return 0.0;
        }

        $setting = DendaSetting::current($this->service_type);

        $persenTotal = min(
            (float) $setting->persen_per_hari * $hariTerlambat,
            (float) $setting->max_persen
        );

        return round((float) $this->total_price * $persenTotal / 100);
    }

    /**
     * Jumlah hari keterlambatan (<= 0 berarti tidak terlambat).
     *
     * Deadline efektif = end_date, KECUALI saat perpanjangan via transfer
     * sedang `menunggu_verifikasi` (customer sudah upload bukti = sudah
     * bayar, tinggal mitra konfirmasi). Di situ kita bekukan deadline ke
     * extend_end_date agar jam denda berhenti - customer sudah komitmen
     * perpanjang, jadi tidak denda ganda selagi nunggu mitra. (Jalur saldo
     * & verifikasi mitra sudah menggeser end_date langsung, tidak perlu
     * pengecualian di sini.)
     */
    protected function hariTerlambatDenda(): int
    {
        $batasWaktu = $this->tanggal_selesai_aktual?->copy()->startOfDay()
            ?? $this->denda_paid_at?->copy()->startOfDay()
            ?? ($this->status === 'selesai'
                ? $this->updated_at->copy()->startOfDay()
                : now()->startOfDay());

        $batasSeharusnya = $this->end_date->copy()->startOfDay();

        if (
            $this->status_perpanjangan === 'menunggu_verifikasi'
            && $this->extend_end_date
            && $this->extend_end_date->copy()->startOfDay()->gt($batasSeharusnya)
        ) {
            $batasSeharusnya = $this->extend_end_date->copy()->startOfDay();
        }

        return (int) $batasSeharusnya->diffInDays($batasWaktu, false);
    }

    /**
     * True kalau order ini sedang/pernah terlambat (denda > 0), dipakai
     * frontend untuk menampilkan badge peringatan tanpa perlu hitung ulang
     * di sisi JS.
     */
    public function getTerlambatAttribute(): bool
    {
        return $this->hitungDenda() > 0;
    }

    /**
     * True kalau tidak ada denda sama sekali, ATAU denda sudah dibayar
     * customer (denda_paid_at terisi). Dipakai sebagai syarat sebelum Admin
     * bisa menyelesaikan pesanan - lihat Admin\OrderController::updateStatus().
     */
    public function dendaLunas(): bool
    {
        return $this->hitungDenda() <= 0 || $this->denda_paid_at !== null;
    }

    /**
     * Accessor 'denda' - membuat hitungDenda() otomatis ikut ter-serialize
     * setiap kali Order dikirim ke frontend (lihat $appends di atas), tanpa
     * perlu ditulis manual satu-satu di tiap controller (index, show, dll).
     * Kalau ada controller yang sudah set `$order->denda = ...` manual,
     * itu tidak masalah - accessor ini yang akan dipakai saat serialize,
     * hasilnya tetap sama karena sama-sama panggil hitungDenda().
     */
    public function getDendaAttribute(): float
    {
        return $this->hitungDenda();
    }

    public function hargaHarianPerpanjangan(): float
    {
        if ((float) $this->harga_per_hari > 0) {
            return (float) $this->harga_per_hari;
        }

        $mulai = Carbon::parse($this->start_date)->startOfDay();
        $selesai = Carbon::parse($this->end_date)->startOfDay();
        $jumlahHari = max(1, $mulai->diffInDays($selesai));

        return round(((float) $this->subtotal) / $jumlahHari);
    }

    public function jumlahHariPerpanjangan(string $tanggalKeluarBaru): int
    {
        $selesaiLama = Carbon::parse($this->end_date)->startOfDay();
        $selesaiBaru = Carbon::parse($tanggalKeluarBaru)->startOfDay();

        return max(1, $selesaiLama->diffInDays($selesaiBaru));
    }

    public function hargaPerpanjangan(string $tanggalKeluarBaru): float
    {
        return round($this->hargaHarianPerpanjangan() * $this->jumlahHariPerpanjangan($tanggalKeluarBaru));
    }
}
