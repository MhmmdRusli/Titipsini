<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Topup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TopUpController extends Controller
{
    protected const BIAYA_ADMIN = 5000;

    protected const CHANNEL_BANK = ['BRI', 'BCA', 'Mandiri', 'BNI'];
    protected const CHANNEL_EWALLET = ['OVO', 'GoPay', 'DANA', 'ShopeePay'];

    /**
     * GET /app/saldo/topup - Step 1: pilih metode pembayaran + nominal
     */
    public function create(): Response
    {
        return Inertia::render('Customer/Topup/PilihMetode', [
            'biaya_admin' => self::BIAYA_ADMIN,
        ]);
    }

    /**
     * POST /app/saldo/topup - simpan transaksi, redirect ke halaman instruksi
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nominal' => ['required', 'integer', 'min:10000'],
            'metode_pembayaran' => ['required', 'in:transfer_bank,e_wallet'],
            'channel' => ['required', 'string'],
        ], [
            'nominal.min' => 'Minimal top up Rp 10.000.',
        ]);

        $biayaAdmin = self::BIAYA_ADMIN;

        $topup = $request->user()->topups()->create([
            'kode_transaksi' => 'TU' . strtoupper(Str::random(10)),
            'nominal' => $validated['nominal'],
            'biaya_admin' => $biayaAdmin,
            'total' => $validated['nominal'] + $biayaAdmin,
            'metode_pembayaran' => $validated['metode_pembayaran'],
            'channel' => $validated['channel'],
            // Simulasi nomor VA - kalau nanti disambungkan ke payment
            // gateway asli, ini diganti dengan VA number dari respons API-nya.
            'va_number' => $validated['metode_pembayaran'] === 'transfer_bank'
                ? (string) random_int(1000000000000, 9999999999999)
                : null,
            'status' => 'pending',
        ]);

        return redirect()->route('customer.topup.instruksi', $topup);
    }

    /**
     * GET /app/saldo/topup/{topup}/instruksi - Step 2/3: instruksi pembayaran
     */
    public function instruksi(Request $request, Topup $topup): Response
    {
        $this->authorizeOwnership($request, $topup);

        return Inertia::render('Customer/Topup/Instruksi', [
            'topup' => $topup,
        ]);
    }

    /**
     * POST /app/saldo/topup/{topup}/konfirmasi - simulasi "Selesai" ditekan
     *
     * Catatan: ini SIMULASI. Kalau nanti pakai payment gateway asli (Midtrans/
     * Xendit dll), method ini diganti jadi webhook callback yang dipanggil
     * otomatis oleh gateway, bukan ditekan manual oleh user.
     */
    public function konfirmasi(Request $request, Topup $topup): RedirectResponse
    {
        $this->authorizeOwnership($request, $topup);

        if ($topup->status === 'pending') {
            $topup->update([
                'status' => 'berhasil',
                'paid_at' => now(),
            ]);

            $topup->user->increment('saldo', $topup->nominal);
        }

        return redirect()->route('customer.topup.sukses', $topup);
    }

    /**
     * GET /app/saldo/topup/{topup}/sukses - Step 4: halaman sukses
     */
    public function sukses(Request $request, Topup $topup): Response
    {
        $this->authorizeOwnership($request, $topup);

        return Inertia::render('Customer/Topup/Sukses', [
            'topup' => $topup,
            'saldo' => $request->user()->fresh()->saldo,
        ]);
    }

    protected function authorizeOwnership(Request $request, Topup $topup): void
    {
        abort_unless($topup->user_id === $request->user()->id, 403);
    }
}