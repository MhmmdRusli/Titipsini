<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Inertia\Inertia;
use Inertia\Response;

class BantuanController extends Controller
{
    public function index(): Response
    {
        $faq = Faq::where('is_active', true)
            ->orderBy('urutan')
            ->get(['id', 'pertanyaan', 'jawaban']);

        return Inertia::render('Customer/Profile/Bantuan', [
            'faq' => $faq,
            // TODO: pindahkan ke tabel pengaturan/config kalau nanti admin
            // perlu bisa mengubah kontak ini tanpa deploy ulang kode.
            'kontak' => [
                'whatsapp' => '628123456789',
                'email' => 'support@titipsini.com',
                'call_center' => '+62 21-2345678',
            ],
        ]);
    }
}