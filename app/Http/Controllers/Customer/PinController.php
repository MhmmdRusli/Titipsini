<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PinController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/BuatPin');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pin' => ['required', 'digits:6'],
        ]);

        $request->user()->update([
            'pin' => Hash::make($validated['pin']),
        ]);

        return redirect()->route('customer.dashboard');
    }
}