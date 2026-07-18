<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PengaturanController extends Controller
{
    public function keamanan()
    {
        return Inertia::render('Admin/Pengaturan/Keamanan');
    }

    public function updateKeamanan(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return back();
    }

    public function qris()
    {
        $user = Auth::user();

        return Inertia::render('Admin/Pengaturan/Qris', [
            'qris_url' => $user->qris_path ? Storage::url($user->qris_path) : null,
        ]);
    }

    public function updateQris(Request $request)
    {
        $request->validate([
            'qris_image' => ['required', 'image', 'max:2048'],
        ]);

        $path = $request->file('qris_image')->store('qris', 'public');

        $request->user()->update(['qris_path' => $path]);

        return back();
    }
}