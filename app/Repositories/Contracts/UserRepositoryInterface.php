<?php

namespace App\Repositories\Contracts;

interface UserRepositoryInterface
{
    public function countByRole(string $role, ?string $city = null): int;

    public function countVerifiedPartners(?string $city = null): int;
}