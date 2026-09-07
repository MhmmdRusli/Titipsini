import FinanceLayout from '@/Layouts/FinanceLayout';
import PengembalianDanaView from '@/Components/PengembalianDana/PengembalianDanaView';

export default function Index({ refunds, filters, summary = {}, persenRefund = 60, hasAnyRefundDebt = false }) {
    return (
        <FinanceLayout title="Pengembalian Dana">
            {hasAnyRefundDebt && (
                <div className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                    <p className="font-bold">Perhatian: Ada mitra yang memiliki utang refund</p>
                    <p className="mt-0.5">
                        Saat ini ada pengajuan penarikan yang menunggu verifikasi dari mitra yang memiliki utang refund.
                        Pastikan utang refund dipotong dari jumlah penarikan sebelum disetujui.
                    </p>
                </div>
            )}
            <PengembalianDanaView
                refunds={refunds}
                filters={filters}
                summary={summary}
                persenRefund={persenRefund}
                urlIndex="/finance/pengembalian-dana"
                urlSetujui="/finance/pengembalian-dana/__ID__/setujui"
                urlTolak="/finance/pengembalian-dana/__ID__/tolak"
                description="Tinjau laporan kerugian barang dari customer dan proses refund dengan nominal atau persentase."
                infoText=""
            />
        </FinanceLayout>
    );
}
