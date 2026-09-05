<?php

namespace App\Support\Trash;

use App\Models\Berita;
use App\Models\Faq;
use App\Models\Kota;
use App\Models\Order;
use App\Models\Service;
use App\Models\User;

class TrashRegistry
{
    public static function types(): array
    {
        return [
            'pesanan' => [
                'model' => Order::class,
                'label' => 'Pesanan',
                'title_field' => 'order_code',
                'subtitle_field' => 'customer.name',
                'with' => ['customer'],
            ],
            'layanan' => [
                'model' => Service::class,
                'label' => 'Layanan',
                'title_field' => 'nama',
                'subtitle_field' => 'vendor.name',
                'with' => ['vendor'],
            ],
            'user' => [
                'model' => User::class,
                'label' => 'User',
                'title_field' => 'name',
                'subtitle_field' => 'email',
                'with' => [],
            ],
            'berita' => [
                'model' => Berita::class,
                'label' => 'Berita',
                'title_field' => 'judul',
                'subtitle_field' => null,
                'with' => [],
            ],
            'faq' => [
                'model' => Faq::class,
                'label' => 'FAQ',
                'title_field' => 'pertanyaan',
                'subtitle_field' => null,
                'with' => [],
            ],
            'kota' => [
                'model' => Kota::class,
                'label' => 'Kota',
                'title_field' => 'nama',
                'subtitle_field' => 'provinsi',
                'with' => [],
            ],
        ];
    }

    public static function find(string $type): array
    {
        $types = self::types();

        abort_unless(isset($types[$type]), 404, 'Jenis data sampah tidak dikenal.');

        return $types[$type];
    }
}