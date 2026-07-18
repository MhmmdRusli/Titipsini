<?php

namespace App\Repositories\Contracts;

interface OrderRepositoryInterface
{
    /**
     * @param array{city?: string, period?: string} $filters
     */
    public function countByStatus(array $filters, array $statuses = []): int;

    /**
     * @param array{city?: string, period?: string} $filters
     * @return array<int, array{month: string, total: int}>
     */
    public function monthlyTrend(array $filters, int $months = 6): array;

    /**
     * @param array{city?: string, period?: string} $filters
     * @return array<int, array{service_type: string, total: int, percentage: float}>
     */
    public function serviceTypeDistribution(array $filters): array;

    /**
     * @param array{city?: string, period?: string} $filters
     * @return array<string, int>
     */
    public function vendorServiceCounts(array $filters): array;

    /**
     * @return array<int, string>
     */
    public function distinctCities(): array;
}