<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class LengkapiDataController extends Controller
{
    public function intro()
    {
        return Inertia::render('Auth/LengkapiDataIntro');
    }

    public function form()
    {
        return Inertia::render('Auth/LengkapiData');
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:50', Rule::unique('users', 'username')->ignore($user->id)],
            'phone' => ['required', 'string', 'max:20'],
            'tanggal_lahir' => ['required', 'date'],
            'gender' => ['required', Rule::in(['male', 'female'])],
            'address' => ['required', 'string', 'max:500'],
            'provinsi' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],
            'kecamatan' => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:10'],
        ]);

        $user->update([
            ...$validated,
            'verification_status' => 'verifikasi_akun',
        ]);

        return redirect()->route('customer.pin.create');
    }
}