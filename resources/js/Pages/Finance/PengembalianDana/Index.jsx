import FinanceLayout from '@/Layouts/FinanceLayout';
import PengembalianDanaView from '@/Components/PengembalianDana/PengembalianDanaView';

export default function Index({ refunds, filters, summary = {}, persenRefund = 60 }) {
    return (
        <FinanceLayout title="Pengembalian Dana">
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
