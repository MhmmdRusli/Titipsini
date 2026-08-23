import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { AlertTriangle, Building2, Check, CheckCircle2, Clock3, UserRound, Wallet, X } from 'lucide-react';
import FinanceLayout from '@/Layouts/FinanceLayout';

const tabs = [
    { value: 'pending', label: 'Pending' },
    { value: 'selesai', label: 'Disetujui' },
    { value: 'ditolak', label: 'Ditolak' },
    { value: 'semua', label: 'Semua' },
];

const statusStyle = {
    pending: 'bg-amber-50 text-amber-700 ring-amber-600/10',
    selesai: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
    ditolak: 'bg-rose-50 text-rose-700 ring-rose-600/10',
};

const statusLabel = { pending: 'Pending', selesai: 'Disetujui', ditolak: 'Ditolak' };
const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
const formatDate = (value) => value ? new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

function ConfirmModal({ target, action, note, setNote, processing, onClose, onConfirm }) {
    if (!target) return null;
    const isApprove = action === 'approve';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-5 backdrop-blur-sm" role="dialog" aria-modal="true">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-full ${isApprove ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {isApprove ? <CheckCircle2 size={21} /> : <AlertTriangle size={21} />}
                    </div>
                    <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Tutup modal"><X size={18} /></button>
                </div>
                <h2 className="mt-5 text-lg font-bold text-slate-950">{isApprove ? 'Setujui payout?' : 'Tolak payout?'}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Payout <strong className="text-slate-800">{target.user?.name || '-'}</strong> sebesar <strong className={isApprove ? 'text-emerald-700' : 'text-rose-700'}>{formatRupiah(target.jumlah)}</strong> akan {isApprove ? 'disetujui dan dicatat sebagai mutasi saldo.' : 'ditolak dan saldo mutasi tidak akan dibuat.'}
                </p>
                {!isApprove && <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} maxLength={255} placeholder="Catatan penolakan (opsional)" className="mt-5 w-full rounded-xl border-slate-200 bg-slate-50 text-sm focus:border-rose-500 focus:ring-rose-500" />}
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Batal</button>
                    <button type="button" disabled={processing} onClick={onConfirm} className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${isApprove ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-rose-600 hover:bg-rose-700'}`}>{processing ? 'Memproses...' : isApprove ? 'Ya, Setujui' : 'Ya, Tolak'}</button>
                </div>
            </div>
        </div>
    );
}

export default function Index({ payouts, filter = {} }) {
    const { flash } = usePage().props;
    const [activeStatus, setActiveStatus] = useState(filter.status || 'pending');
    const [modal, setModal] = useState(null);
    const [note, setNote] = useState('');
    const [processing, setProcessing] = useState(false);

    const changeStatus = (value) => {
        setActiveStatus(value);
        router.get('/finance/payouts', { status: value }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const closeModal = () => { setModal(null); setNote(''); };
    const submitAction = () => {
        if (!modal) return;
        setProcessing(true);
        const url = `/finance/payouts/${modal.id}/${modal.action}`;
        router.post(url, modal.action === 'reject' ? { catatan: note } : {}, { preserveScroll: true, onFinish: () => { setProcessing(false); closeModal(); } });
    };

    return (
        <FinanceLayout>
            <Head title="Penarikan Dana" />
            <div className="mb-8"><p className="text-sm font-semibold text-emerald-700">Manajemen payout</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Penarikan Dana</h1><p className="mt-2 text-sm text-slate-500">Verifikasi pencairan dana dari mitra sebelum diproses.</p></div>
            {flash?.success && <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700"><Check size={18} />{flash.success}</div>}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap gap-2 border-b border-slate-200 px-5 py-5 lg:px-6">{tabs.map((tab) => <button key={tab.value} type="button" onClick={() => changeStatus(tab.value)} className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${activeStatus === tab.value ? 'bg-[#123c2b] text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{tab.label}</button>)}</div>
                <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-[0.12em] text-slate-500"><tr><th className="px-6 py-3 font-semibold">Mitra / User</th><th className="px-6 py-3 font-semibold">Nominal</th><th className="px-6 py-3 font-semibold">Rekening tujuan</th><th className="px-6 py-3 font-semibold">Diajukan</th><th className="px-6 py-3 font-semibold">Status</th><th className="px-6 py-3 text-right font-semibold">Aksi</th></tr></thead><tbody className="divide-y divide-slate-100">{!payouts?.data?.length ? <tr><td colSpan="6" className="px-6 py-16 text-center text-slate-500"><Wallet className="mx-auto mb-3 text-slate-300" size={30} />Belum ada pengajuan payout.</td></tr> : payouts.data.map((item) => <tr key={item.id} className="hover:bg-slate-50/70"><td className="px-6 py-4"><p className="font-semibold text-slate-900">{item.user?.name || '-'}</p><p className="mt-1 text-xs text-slate-500">{item.user?.email || '-'}</p></td><td className="px-6 py-4 font-bold text-emerald-700">{formatRupiah(item.jumlah)}</td><td className="px-6 py-4"><p className="flex items-center gap-2 font-medium text-slate-800"><Building2 size={15} className="text-emerald-700" />{item.nama_bank}</p><p className="mt-1 flex items-center gap-2 text-xs text-slate-500"><UserRound size={13} />{item.nomor_rekening} · a.n. {item.nama_pemilik}</p></td><td className="px-6 py-4 text-slate-500"><span className="flex items-center gap-2"><Clock3 size={14} />{formatDate(item.created_at)}</span></td><td className="px-6 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyle[item.status] || 'bg-slate-100 text-slate-600'}`}>{statusLabel[item.status] || item.status}</span>{item.status === 'ditolak' && item.catatan && <p className="mt-2 max-w-[180px] text-xs italic text-rose-600">{item.catatan}</p>}</td><td className="px-6 py-4 text-right">{item.status === 'pending' ? <div className="flex justify-end gap-2"><button type="button" onClick={() => setModal({ ...item, action: 'approve' })} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800"><Check size={14} />Setujui</button><button type="button" onClick={() => setModal({ ...item, action: 'reject' })} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50">Tolak</button></div> : <span className="text-xs text-slate-400">Sudah diproses</span>}</td></tr>)}</tbody></table></div>
                {payouts?.data?.length > 0 && <div className="flex flex-wrap gap-2 border-t border-slate-200 px-6 py-4">{payouts.links.map((link, index) => <button key={index} type="button" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })} className={`rounded-lg px-3 py-1.5 text-xs ${link.active ? 'bg-emerald-700 text-white' : 'border border-slate-200 text-slate-600'} ${!link.url ? 'opacity-40' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />)}</div>}
            </section>
            <ConfirmModal target={modal} action={modal?.action} note={note} setNote={setNote} processing={processing} onClose={closeModal} onConfirm={submitAction} />
        </FinanceLayout>
    );
}
