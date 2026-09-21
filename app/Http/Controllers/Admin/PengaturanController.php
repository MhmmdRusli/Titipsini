<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Penarikan;
use App\Models\SaldoMutasi;
use App\Models\DendaSetting;
use App\Models\PaymentSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanController extends Controller
{
    /**
     * Menampilkan halaman Pengaturan Komisi Platform.
     */
    public function komisi(): Response
    {
        // Nilai persentase komisi default / dari DB/Setting
        $commissionRate = 10; 

        return Inertia::render('Admin/Pengaturan/Komisi', [
            'commission_rate' => $commissionRate,
        ]);
    }

    
    public function updateKomisi(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'commission_rate' => 'required|numeric|min:0|max:100',
        ]);

        return back()->with('success', 'Pengaturan komisi platform berhasil disimpan!');
    }

    /**
     * Menampilkan halaman Pengaturan QRIS / Pembayaran.
     */
    public function qris(): Response
{
    $setting = PaymentSetting::current();

    return Inertia::render('Admin/Pengaturan/Qris', [
        'qris_url' => $setting->qris_image ? Storage::url($setting->qris_image) : null,
    ]);
}

    public function updateQris(Request $request): RedirectResponse
{
    $request->validate([
        'qris_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
    ]);

    $setting = PaymentSetting::current();

    if ($setting->qris_image) {
        Storage::disk('public')->delete($setting->qris_image);
    }

    $path = $request->file('qris_image')->store('qris', 'public');
    $setting->update(['qris_image' => $path]);

    return back()->with('success', 'Pengaturan QRIS berhasil diperbarui.');
}

    /**
     * Menampilkan halaman keamanan pengaturan admin.
     */
    public function keamanan(): Response
    {
        return Inertia::render('Admin/Pengaturan/Keamanan');
    }

    /**
     * Mengubah password/keamanan admin.
     */
    public function updateKeamanan(Request $request): RedirectResponse
    {
        $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|confirmed|min:8',
        ]);

        $request->user()->update([
            'password' => bcrypt($request->password),
        ]);

        return back()->with('success', 'Password keamanan berhasil diperbarui.');
    }

    // =========================================================================
    // METHOD PENARIKAN (Disimpan jika digunakan oleh rute admin penarikan Anda)
    // =========================================================================

    public function index(Request $request): Response
    {
        $status = $request->query('status', 'pending');

        $penarikan = Penarikan::with('user:id,name,email')
            ->when($status !== 'semua', fn ($q) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Penarikan/Index', [
            'penarikan' => $penarikan,
            'filter' => ['status' => $status],
        ]);
    }

    public function approve(Penarikan $penarikan): RedirectResponse
    {
        abort_unless($penarikan->status === 'pending', 400, 'Penarikan ini sudah diproses sebelumnya.');

        DB::transaction(function () use ($penarikan) {
            $user = $penarikan->user;
            $user->refresh();

            $jumlahPenarikan = (int) preg_replace('/[^0-9]/', '', (string) $penarikan->jumlah);

            // Hitung utang refund mitra (aktual + potensi)
            $utangRefund = max($user->utangRefund(), $user->potensiUtangRefund());

            $jumlahDikirim = $jumlahPenarikan - $utangRefund;

            if ($jumlahDikirim <= 0) {
                throw ValidationException::withMessages([
                    'approve' => "Jumlah penarikan (Rp " . number_format($jumlahPenarikan, 0, ',', '.') . ") lebih kecil atau sama dengan utang refund (Rp " . number_format($utangRefund, 0, ',', '.') . "). Tidak ada dana yang dikirim.",
                ]);
            }

            $saldoTersediaUntukPenarikanIni = $user->saldoMitra();

            if ($saldoTersediaUntukPenarikanIni < $jumlahPenarikan) {
                throw ValidationException::withMessages([
                    'approve' => "Saldo mitra tidak mencukupi lagi. (Saldo: Rp " . number_format($saldoTersediaUntukPenarikanIni, 0, ',', '.') . ", Penarikan: Rp " . number_format($jumlahPenarikan, 0, ',', '.') . ")",
                ]);
            }

            SaldoMutasi::create([
                'user_id' => $user->id,
                'type' => 'penarikan',
                'jumlah' => $jumlahPenarikan,
                'deskripsi' => 'Penarikan ke '.$penarikan->nama_bank.' •••• '.substr($penarikan->nomor_rekening, -4)
                    .($utangRefund > 0 ? " (dipotong utang refund Rp " . number_format($utangRefund, 0, ',', '.') . ")" : ''),
                'reference_type' => Penarikan::class,
                'reference_id' => $penarikan->id,
            ]);

            if ($utangRefund > 0) {
                SaldoMutasi::create([
                    'user_id' => $user->id,
                    'type' => 'penarikan',
                    'jumlah' => -$utangRefund,
                    'deskripsi' => 'Potongan utang refund dari penarikan ke '.$penarikan->nama_bank,
                    'reference_type' => Penarikan::class,
                    'reference_id' => $penarikan->id,
                ]);
            }

            $penarikan->update([
                'status' => 'selesai',
                'processed_at' => now(),
                'utang_refund_dipotong' => $utangRefund,
                'jumlah_dikirim' => $jumlahDikirim,
                'catatan' => $utangRefund > 0
                    ? ($penarikan->catatan ? $penarikan->catatan . "\n" : '') . "Dipotong utang refund: Rp " . number_format($utangRefund, 0, ',', '.') . ". Dikirim ke rekening: Rp " . number_format($jumlahDikirim, 0, ',', '.')
                    : $penarikan->catatan,
            ]);
        });

        return back()->with('success', 'Penarikan berhasil disetujui, saldo mitra telah dipotong.');
    }

    public function reject(Request $request, Penarikan $penarikan): RedirectResponse
    {
        abort_unless($penarikan->status === 'pending', 400, 'Penarikan ini sudah diproses sebelumnya.');

        $validated = $request->validate([
            'catatan' => 'nullable|string|max:255',
        ]);

        $penarikan->update([
            'status' => 'ditolak',
            'catatan' => $validated['catatan'] ?? null,
            'processed_at' => now(),
        ]);

        return back()->with('success', 'Penarikan telah ditolak.');
    }
    public function denda()
{
    $kategori = ['barang', 'bangunan', 'kendaraan', 'pindahan'];
 
    $settings = collect($kategori)->map(function ($tipe) {
        $setting = DendaSetting::current($tipe);
 
        return [
            'service_type' => $tipe,
            'persen_per_hari' => (float) $setting->persen_per_hari,
            'max_persen' => (float) $setting->max_persen,
        ];
    });
 
    return Inertia::render('Admin/Pengaturan/Denda', [
        'settings' => $settings,
    ]);
}
 
/**
 * PUT /admin/pengaturan/denda
 */
public function updateDenda(Request $request)
{
    $validated = $request->validate([
        'settings' => ['required', 'array', 'size:4'],
        'settings.*.service_type' => ['required', 'string', 'in:barang,bangunan,kendaraan,pindahan'],
        'settings.*.persen_per_hari' => ['required', 'numeric', 'min:0', 'max:100'],
        'settings.*.max_persen' => ['required', 'numeric', 'min:0', 'max:100'],
    ]);
 
    foreach ($validated['settings'] as $item) {
        DendaSetting::current($item['service_type'])->update([
            'persen_per_hari' => $item['persen_per_hari'],
            'max_persen' => $item['max_persen'],
        ]);
    }
 
    return redirect()
        ->route('admin.pengaturan.denda')
        ->with('success', 'Pengaturan denda berhasil diperbarui.');
}
 
}
