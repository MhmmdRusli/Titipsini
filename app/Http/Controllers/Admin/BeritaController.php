<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BeritaController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $berita = Berita::query()
            ->when($search, fn ($q) => $q->where('judul', 'like', "%{$search}%"))
            ->orderByDesc('created_at')
            ->paginate(10)
            ->through(function ($item) {
                $item->foto = $item->foto ? '/' . ltrim($item->foto, '/') : null;
                return $item;
            })
            ->withQueryString();

        return Inertia::render('Admin/Berita/Index', [
            'berita' => $berita,
            'filters' => ['search' => $search],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);
        $validated['foto'] = $this->handleFoto($request);
        $validated['published_at'] = $request->boolean('is_published') ? now() : null;

        Berita::create($validated);

        return redirect()->back()->with('success', 'Berita berhasil ditambahkan.');
    }

    public function update(Request $request, Berita $berita): RedirectResponse
    {
        $validated = $this->validated($request);

        // Jangan sentuh kolom foto sama sekali kalau tidak ada file baru diupload,
        // supaya foto lama tidak ke-null-kan tanpa sengaja.
        unset($validated['foto']);

        if ($request->hasFile('foto')) {
            $this->deleteFotoLama($berita->foto);
            $validated['foto'] = $this->handleFoto($request);
        }

        $validated['published_at'] = $request->boolean('is_published')
            ? ($berita->published_at ?? now())
            : null;

        $berita->update($validated);

        return redirect()->back()->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy(Berita $berita): RedirectResponse
    {
        $this->deleteFotoLama($berita->foto);

        $berita->delete();

        return redirect()->back()->with('success', 'Berita berhasil dihapus.');
    }

    protected function validated(Request $request): array
    {
        return $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'konten' => ['nullable', 'string'],
            'foto' => ['nullable', 'image', 'max:2048'],
        ]);
    }

    // Pakai disk 'direct_public' (langsung simpan di public/, bukan lewat
    // symlink storage) - konsisten dengan solusi upload foto profil admin
    // sebelumnya, biar php artisan serve di Windows gak kena 403.
    protected function handleFoto(Request $request): ?string
    {
        if (! $request->hasFile('foto')) {
            return null;
        }

        return $request->file('foto')->store('berita', 'direct_public');
    }

    // Dibungkus try-catch: kalau disk/file bermasalah, jangan sampai bikin
    // seluruh request 500 (yang berujung Inertia fallback jadi full reload).
    // Edit/hapus data tetap jalan, cuma file lama mungkin nyangkut di storage.
    protected function deleteFotoLama(?string $path): void
    {
        if (! $path) {
            return;
        }
        

        try {
            Storage::disk('direct_public')->delete($path);
        } catch (\Throwable $e) {
            Log::warning('Gagal menghapus foto berita lama: ' . $e->getMessage(), ['path' => $path]);
        }
    }
}