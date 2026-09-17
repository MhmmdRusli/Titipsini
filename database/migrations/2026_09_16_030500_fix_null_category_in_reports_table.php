<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('reports', 'category')) {
            return;
        }

        $kerugianKeywords = [
            'rusak', 'rusaknya', 'kerusakan', 'hilang', 'hilangnya',
            'tidak nyala', 'tidak bisa nyala', 'retak', 'hancur',
            'cacat', 'defect', 'missing', 'rusaknya', 'kerusakan barang',
            'barang hilang', 'barang rusak', 'tidak berfungsi',
            'pecah', 'sobek', 'robek', 'luntur', 'aus',
        ];

        $nullReports = DB::table('reports')->whereNull('category')->get();

        foreach ($nullReports as $report) {
            $desc = strtolower((string) $report->description);
            $isKerugian = false;
            foreach ($kerugianKeywords as $keyword) {
                if (str_contains($desc, $keyword)) {
                    $isKerugian = true;
                    break;
                }
            }

            DB::table('reports')
                ->where('id', $report->id)
                ->update(['category' => $isKerugian ? 'kerugian' : 'complain']);
        }
    }

    public function down(): void
    {
        //
    }
};
