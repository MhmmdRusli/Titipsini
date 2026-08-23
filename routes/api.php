<?php

use App\Http\Controllers\Api\InternalAuthController;
use App\Http\Controllers\Customer\CityController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('internal')->group(function () {
    Route::post('/login', [InternalAuthController::class, 'login'])
        ->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [InternalAuthController::class, 'logout']);

        Route::get('/me', function (Request $request) {
            return response()->json([
                'success' => true,
                'data' => $request->user(),
            ]);
        });

        Route::get('/finance/dashboard', function (Request $request) {
            return response()->json([
                'success' => true,
                'data' => ['user' => $request->user()->only(['id', 'name', 'email', 'role'])],
            ]);
        })->middleware('role:finance,super_admin');
    });
});

Route::get('/cities', [CityController::class, 'search']);
