import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import PengembalianDanaView from '@/Components/PengembalianDana/PengembalianDanaView';

export default function Index({ refunds, filters, summary = {}, persenRefund = 60 }) {
    return (
        <SuperAdminLayout title="Pengembalian Dana">
            <PengembalianDanaView
                refunds={refunds}
                filters={filters}
                summary={summary}
                persenRefund={persenRefund}
                urlIndex="/super-admin/pengembalian-dana"
                urlSetujui="/super-admin/pengembalian-dana/__ID__/setujui"
                urlTolak="/super-admin/pengembalian-dana/__ID__/tolak"
                description="Tinjau laporan kerugian barang dari customer dan proses refund dengan nominal atau persentase. Untuk keluhan Komplain Pelayanan, buka menu Laporan Pelayanan."
                infoText=""
            />
        </SuperAdminLayout>
    );
}
