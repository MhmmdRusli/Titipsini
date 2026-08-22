<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    public function index(Request $request): Response
    {
        $addresses = $request->user()
            ->addresses()
            ->latest('is_primary')
            ->latest()
            ->get()
            ->map(fn (Address $address) => [
                'id' => $address->id,
                'name' => $address->name,
                'phone' => $address->phone,
                'province_id' => $address->province_id,
                'city_id' => $address->city_id,
                'district_id' => $address->district_id,
                'province_name' => $address->province?->name,
                'city_name' => $address->city?->name,
                'district_name' => $address->district?->name,
                'address' => $address->address,
                'notes' => $address->notes,
                'is_primary' => $address->is_primary,
            ]);

        return Inertia::render('Customer/Address/Index', [
            'addresses' => $addresses,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Customer/Address/Form');
    }

    public function edit(Address $alamat): Response
    {
        $this->authorizeOwnership($alamat);

        return Inertia::render('Customer/Address/Form', [
            'address' => [
                'id' => $alamat->id,
                'name' => $alamat->name,
                'phone' => $alamat->phone,
                'province_id' => $alamat->province_id,
                'city_id' => $alamat->city_id,
                'district_id' => $alamat->district_id,
                'address' => $alamat->address,
                'notes' => $alamat->notes,
                'is_primary' => $alamat->is_primary,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validated($request);

        $user = $request->user();

        if ($validated['is_primary'] ?? false) {
            $user->addresses()->update(['is_primary' => false]);
        }

        $user->addresses()->create($validated);

        return redirect()->route('customer.profile.alamat.index')->with('success', 'Alamat berhasil ditambahkan.');
    }

    public function update(Request $request, Address $alamat)
    {
        $this->authorizeOwnership($alamat);

        $validated = $this->validated($request);

        if ($validated['is_primary'] ?? false) {
            $request->user()->addresses()->where('id', '!=', $alamat->id)->update(['is_primary' => false]);
        }

        $alamat->update($validated);

        return redirect()->route('customer.profile.alamat.index')->with('success', 'Alamat berhasil diperbarui.');
    }

    public function destroy(Request $request, Address $alamat)
    {
        $this->authorizeOwnership($alamat);

        $alamat->delete();

        return redirect()->route('customer.profile.alamat.index')->with('success', 'Alamat berhasil dihapus.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'province_id' => ['required'],
            'city_id' => ['required'],
            'district_id' => ['required'],
            'address' => ['required', 'string', 'max:500'],
            'notes' => ['nullable', 'string', 'max:255'],
            'is_primary' => ['nullable', 'boolean'],
        ], [
            'name.required' => 'Bagian ini harus di isi',
            'phone.required' => 'Bagian ini harus di isi',
            'province_id.required' => 'Pilih Provinsi',
            'city_id.required' => 'Kabupaten/Kota',
            'district_id.required' => 'Kecamatan',
            'address.required' => 'Alamat lengkap harus diisi',
        ]);
    }

    private function authorizeOwnership(Address $alamat): void
    {
        abort_unless($alamat->user_id === auth()->id(), 403);
    }
}