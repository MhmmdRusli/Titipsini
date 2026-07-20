<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class TentangController extends Controller
{
    // Naikkan angka ini tiap kali ada rilis baru
    protected string $appVersion = '1.0.0';

    public function index(): Response
    {
        return Inertia::render('Customer/Profile/Tentang', [
            'version' => $this->appVersion,
        ]);
    }

    public function syaratKetentuan(): Response
    {
        return Inertia::render('Customer/Profile/SyaratKetentuan');
    }

    public function kebijakanPrivasi(): Response
    {
        return Inertia::render('Customer/Profile/KebijakanPrivasi');
    }
}