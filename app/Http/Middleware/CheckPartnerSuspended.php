<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPartnerSuspended
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Jika user adalah partner dan memiliki tanggal penangguhan (suspended_at)
        if ($user && $user->role === 'partner' && $user->suspended_at) {
            // Izinkan mereka mengakses halaman peringatan dan rute pemulihan/logout agar tidak infinite redirect
            if (!$request->routeIs('mitra.suspended.notice', 'mitra.request.restoration', 'logout')) {
                return redirect()->route('mitra.suspended.notice');
            }
        }

        return $next($request);
    }
}