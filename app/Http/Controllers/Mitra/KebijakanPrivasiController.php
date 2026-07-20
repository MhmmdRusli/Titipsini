<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\PrivacyPolicy;
use Inertia\Inertia;

class KebijakanPrivasiController extends Controller
{
    public function index()
    {
        $policy = PrivacyPolicy::current();

        return Inertia::render('Mitra/KebijakanPrivasi', [
            'content'    => $policy->content,
            'updated_at' => optional($policy->updated_at)->translatedFormat('d F Y'),
        ]);
    }
}