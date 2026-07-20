<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Customer/Profile/Index', [
            'user' => $user->only([
                'id', 'name', 'email', 'phone', 'gender', 'address', 'foto', 'created_at',
            ]),
        ]);
    }
}