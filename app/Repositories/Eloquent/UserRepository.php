<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    public function countByRole(string $role, ?string $city = null): int
    {
        return User::query()
            ->where('role', $role)
            ->when($city, fn ($q) => $q->where('city', $city))
            ->count();
    }

    public function countVerifiedPartners(?string $city = null): int
    {
        return User::query()
            ->where('role', 'partner')
            ->where('verification_status', 'terverifikasi')
            ->when($city, fn ($q) => $q->where('city', $city))
            ->count();
    }
}