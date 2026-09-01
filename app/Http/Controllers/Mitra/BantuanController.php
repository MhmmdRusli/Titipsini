<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Inertia\Inertia;

class BantuanController extends Controller
{
    public function index()
    {
        $faqs = Faq::query()
            ->where('is_active', true)
            ->orderBy('urutan')
            ->get(['id', 'pertanyaan', 'jawaban']);

        return Inertia::render('Mitra/Bantuan', [
            'faqs' => $faqs,
        ]);
    }
}