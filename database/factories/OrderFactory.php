<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $serviceType = fake()->randomElement(['barang', 'kendaraan', 'bangunan', 'pindahan']);
        $status = fake()->randomElement(['baru', 'diproses', 'selesai', 'selesai', 'dibatalkan']);

        return [
            'order_code' => 'TS-'.fake()->unique()->numerify('######'),
            'customer_id' => User::where('role', 'customer')->inRandomOrder()->value('id'),
            'partner_id' => User::where('role', 'partner')->inRandomOrder()->value('id'),
            'service_type' => $serviceType,
            'is_pickup' => fake()->boolean(40),
            'city' => fake()->randomElement(['Bandung', 'Jakarta', 'Surabaya', 'Semarang', 'Yogyakarta']),
            'status' => $status,
            'cancel_reason' => $status === 'dibatalkan' ? fake()->sentence(6) : null,
            'total_price' => fake()->numberBetween(20, 500) * 1000,
            'created_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }
}