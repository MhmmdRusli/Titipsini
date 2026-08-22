<?php
namespace App\Models;
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
        'service_type',
        'item_name',
        'item_description',
        'start_date',
        'end_date',
        'duration',
        'is_pickup',
        'pickup_status',
        'pickup_address',
        'dropoff_address',
        'city',
        'status',
        'fase',
        'tanggal_selesai_aktual',
        'denda_paid_at',
        'denda_payment_receipt',
        'bukti_denda',
        'status_denda',
        'cancel_reason',
        'subtotal',
        'discount',
        'pickup_fee',
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
    ];
    protected $appends = ['denda'];

    protected function casts(): array
    {
        return [
            'is_pickup' => 'boolean',
            'total_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'discount' => 'decimal:2',
            'pickup_fee' => 'decimal:2',
            'total' => 'decimal:2',
            'payment_verified_at' => 'datetime',
            'tanggal_selesai_aktual' => 'datetime',
            'denda_paid_at' => 'datetime',
            'end_date' => 'date',
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

    /**
     * Hitung denda keterlambatan secara otomatis berdasarkan `end_date` vs
     * tanggal order benar-benar selesai (tanggal_selesai_aktual kalau sudah
     * diisi/fase 'akhir', atau `now()` sebagai estimasi live kalau order
     * masih berjalan).
     *
     * Rumus: total_price * persen_per_hari * jumlah_hari_terlambat / 100,
     * dibatasi maksimal (max_persen / 100) * total_price supaya tidak
     * membengkak tanpa batas untuk keterlambatan yang sangat lama.
     *
     * Return 0 kalau:
     * - Tidak ada end_date sama sekali
     * - Belum melewati end_date (tidak terlambat)
     * - Order berstatus 'dibatalkan' (denda tidak relevan untuk order batal)
     */
    public function hitungDenda(): float
    {
        if (! $this->end_date || $this->status === 'dibatalkan') {
            return 0.0;
        }

        $batasWaktu = $this->tanggal_selesai_aktual
            ? $this->tanggal_selesai_aktual->copy()->startOfDay()
            : ($this->status === 'selesai'
                // Order selesai tapi tidak pernah lewat alur fase mitra (edge
                // case, mis. admin set status manual) - pakai updated_at
                // sebagai perkiraan terbaik, supaya tidak ikut now() yang
                // terus bertambah untuk order yang sudah final.
                ? $this->updated_at->copy()->startOfDay()
                : now()->startOfDay());

        $batasSeharusnya = $this->end_date->copy()->startOfDay();

        $hariTerlambat = $batasSeharusnya->diffInDays($batasWaktu, false);

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
    public function hargaPerpanjangan(string $tanggalKeluarBaru): float
{
    $mulai = \Carbon\Carbon::parse($this->start_date)->startOfDay();
    $selesaiLama = \Carbon\Carbon::parse($this->end_date)->startOfDay();
    $selesaiBaru = \Carbon\Carbon::parse($tanggalKeluarBaru)->startOfDay();
 
    $jumlahHariAsli = max(1, $mulai->diffInDays($selesaiLama));
    $hargaPerHari = ((float) $this->subtotal) / $jumlahHariAsli;
 
    $jumlahHariTambahan = max(1, $selesaiLama->diffInDays($selesaiBaru));
 
    return round($hargaPerHari * $jumlahHariTambahan);
}

}