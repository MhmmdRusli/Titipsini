<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Support\Trash\TrashRegistry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TrashController extends Controller
{
    public function index(Request $request): Response
    {
        $activeType = $request->string('type')->toString() ?: null;
        $types = TrashRegistry::types();

        $items = collect();

        foreach ($types as $key => $config) {
            if ($activeType && $activeType !== $key) {
                continue;
            }

            $records = $config['model']::onlyTrashed()
                ->when(! empty($config['with']), fn ($q) => $q->with($config['with']))
                ->latest('deleted_at')
                ->get();

            foreach ($records as $record) {
                $items->push([
                    'id' => $record->id,
                    'type' => $key,
                    'type_label' => $config['label'],
                    'title' => data_get($record, $config['title_field']) ?? '(tanpa nama)',
                    'subtitle' => $config['subtitle_field'] ? data_get($record, $config['subtitle_field']) : null,
                    'deleted_at' => $record->deleted_at?->format('d M Y H:i'),
                    'deleted_at_raw' => $record->deleted_at?->toIso8601String(),
                    'deleted_by' => optional($record->deletedBy)->name,
                    'sisa_hari' => $record->sisa_hari,
                    'sisa_label' => $record->sisa_waktu_label,
                ]);
            }
        }

        $items = $items->sortByDesc('deleted_at_raw')->values();

        return Inertia::render('SuperAdmin/Sampah/Index', [
            'items' => $items,
            'types' => collect($types)
                ->map(fn ($config, $key) => ['key' => $key, 'label' => $config['label']])
                ->values(),
            'filters' => [
                'type' => $activeType,
            ],
        ]);
    }

    public function restore(string $type, int $id): RedirectResponse
    {
        $config = TrashRegistry::find($type);

        $record = $config['model']::onlyTrashed()->findOrFail($id);
        $record->restore();
        $record->forceFill(['deleted_by' => null])->saveQuietly();

        return back()->with('success', "{$config['label']} berhasil dipulihkan.");
    }

    public function forceDelete(string $type, int $id): RedirectResponse
    {
        $config = TrashRegistry::find($type);

        $record = $config['model']::onlyTrashed()->findOrFail($id);
        $record->forceDelete();

        return back()->with('success', "{$config['label']} berhasil dihapus permanen.");
    }
}