<?php

namespace Tests\Feature\Mitra;

use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DeleteServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'sqlite',
            'database.connections.sqlite.database' => ':memory:',
        ]);
        DB::purge('sqlite');

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('role')->default('customer');
            $table->string('password');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('remember_token')->nullable();
            $table->string('verification_status')->nullable();
            $table->json('jadwal_operasional')->nullable();
            $table->timestamp('suspended_at')->nullable();
            $table->timestamps();
        });

        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->string('kategori');
            $table->string('nama');
            $table->string('foto')->nullable();
            $table->string('foto_kendaraan')->nullable();
            $table->string('kota');
            $table->string('kecamatan');
            $table->boolean('is_active')->default(true);
            $table->string('verification_status')->nullable();
            $table->json('foto_lahan')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->foreignId('deleted_by')->nullable();
            $table->timestamps();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code')->unique();
            $table->foreignId('customer_id');
            $table->foreignId('partner_id')->nullable();
            $table->foreignId('service_id')->nullable();
            $table->string('service_type');
            $table->string('city');
            $table->string('status')->default('baru');
            $table->decimal('total_price', 12, 2)->default(0);
            $table->integer('rating')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();
        });

        Schema::create('kota', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('provinsi')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();
        });
    }

    public function test_partner_can_soft_delete_own_service_without_changing_orders_and_customer_cannot_list_it(): void
    {
        $partner = User::factory()->create(['role' => 'partner']);
        $customer = User::factory()->create(['role' => 'customer']);
        $service = $this->createService($partner);
        Storage::fake('public');
        Storage::disk('public')->put('services/preserved-service-image.jpg', 'image-content');
        $service->update(['foto' => 'services/preserved-service-image.jpg']);

        $orderId = $this->createOrder($service, $partner, $customer, 'selesai');

        $response = $this->actingAs($partner)
            ->delete(route('mitra.layanan.destroy', $service));

        $response->assertRedirect();
        $this->assertSoftDeleted('services', [
            'id' => $service->id,
            'deleted_by' => $partner->id,
        ]);
        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'service_id' => $service->id,
        ]);
        $this->assertNull(Service::query()->find($service->id));
        Storage::disk('public')->assertExists('services/preserved-service-image.jpg');

        $partnerResponse = $this->actingAs($partner)
            ->get(route('mitra.layanan.index'));

        $partnerResponse->assertOk();
        $partnerResponse->assertInertia(fn (Assert $page) => $page
            ->component('Mitra/Layanan/Index')
            ->where('layanan', [])
        );

        $customerResponse = $this->actingAs($customer)
            ->get(route('customer.services.index', ['kategori' => 'barang', 'browse' => true]));

        $customerResponse->assertInertia(fn (Assert $page) => $page
            ->component('Customer/Services/Index')
            ->where('services.data', [])
        );

        Service::withTrashed()->findOrFail($service->id)->forceDelete();
        Storage::disk('public')->assertMissing('services/preserved-service-image.jpg');
    }

    public function test_partner_cannot_delete_another_partners_service(): void
    {
        $owner = User::factory()->create(['role' => 'partner']);
        $otherPartner = User::factory()->create(['role' => 'partner']);
        $service = $this->createService($owner);

        $this->actingAs($otherPartner)
            ->delete(route('mitra.layanan.destroy', $service))
            ->assertForbidden();

        $this->assertDatabaseHas('services', [
            'id' => $service->id,
            'deleted_at' => null,
        ]);
    }

    public function test_partner_cannot_delete_service_with_active_orders(): void
    {
        $partner = User::factory()->create(['role' => 'partner']);
        $customer = User::factory()->create(['role' => 'customer']);
        $service = $this->createService($partner);
        $orderId = $this->createOrder($service, $partner, $customer, 'diproses_mitra');

        $this->actingAs($partner)
            ->delete(route('mitra.layanan.destroy', $service))
            ->assertRedirect()
            ->assertSessionHas('error', 'Layanan tidak dapat dihapus selama masih memiliki pesanan aktif.');

        $this->assertDatabaseHas('services', [
            'id' => $service->id,
            'deleted_at' => null,
        ]);
        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'service_id' => $service->id,
        ]);
    }

    public function test_customer_cannot_delete_a_service(): void
    {
        $partner = User::factory()->create(['role' => 'partner']);
        $customer = User::factory()->create(['role' => 'customer']);
        $service = $this->createService($partner);

        $this->actingAs($customer)
            ->delete(route('mitra.layanan.destroy', $service))
            ->assertForbidden();

        $this->assertDatabaseHas('services', [
            'id' => $service->id,
            'deleted_at' => null,
        ]);
    }

    private function createService(User $partner): Service
    {
        return Service::query()->create([
            'user_id' => $partner->id,
            'kategori' => 'barang',
            'nama' => 'Gudang Pengujian',
            'kota' => 'Yogyakarta',
            'kecamatan' => 'Gondokusuman',
            'is_active' => true,
        ]);
    }

    private function createOrder(Service $service, User $partner, User $customer, string $status): int
    {
        return DB::table('orders')->insertGetId([
            'order_code' => 'TS-DELETE-TEST-'.uniqid(),
            'customer_id' => $customer->id,
            'partner_id' => $partner->id,
            'service_id' => $service->id,
            'service_type' => $service->kategori,
            'city' => $service->kota,
            'status' => $status,
            'total_price' => 10000,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
