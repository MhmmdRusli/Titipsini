<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class BantuanController extends Controller
{
    public function index()
    {
        return Inertia::render('Mitra/Bantuan');
    }
}