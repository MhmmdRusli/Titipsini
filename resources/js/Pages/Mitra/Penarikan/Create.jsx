import { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ChevronLeft, Delete, Plus, Pencil, X, CheckCircle2 } from 'lucide-react';

const PRESETS = [100000, 150000, 300000, 250000, 500000, 1000000];
const PIN_LENGTH = 6;

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID').format(value ?? 0);
}

export default function PenarikanCreate({ saldo = 0, initialRekeningList = [], rekening = null }) {
    const saldoNum = Number(saldo || 0);

    // Dapatkan daftar rekening awal dari Props
    const initialList = initialRekeningList.length > 0 
        ? initialRekeningList 
        : (rekening ? [rekening] : []);

    // State Rekening List & Pilihan
    const [rekeningList, setRekeningList] = useState(initialList);
    const [selectedRekeningId, setSelectedRekeningId] = useState(initialList[0]?.id || null);

    // Menggunakan Inertia Form untuk penarikan
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        jumlah: '',
        pin: '',
        rekening_bank_id: initialList[0]?.id || '',
    });

    // State Alur Penarikan
    const [step, setStep] = useState('jumlah'); // 'jumlah' | 'pin'

    // State Modal (Tambah / Edit)
    const [showModalRekening, setShowModalRekening] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [namaBank, setNamaBank] = useState('');
    const [noRekening, setNoRekening] = useState('');
    const [namaPemilik, setNamaPemilik] = useState('');
    const [isSavingRekening, setIsSavingRekening] = useState(false);

    const jumlahNumber = Number(data.jumlah) || 0;
    const isValidJumlah = jumlahNumber >= 100000 && jumlahNumber <= saldoNum && selectedRekeningId !== null;

    // Ambil data rekening yang sedang dipilih
    const selectedRekening = rekeningList.find((item) => item.id === selectedRekeningId);

    // Sync state rekeningList jika props initialRekeningList diperbarui dari server (setelah save/edit)
    useEffect(() => {
        const updatedList = initialRekeningList.length > 0 
            ? initialRekeningList 
            : (rekening ? [rekening] : []);
        
        setRekeningList(updatedList);
        
        // Jika belum ada yang dipilih atau ID lama tidak ada di daftar, pilih ID rekening pertama
        if (updatedList.length > 0 && (!selectedRekeningId || !updatedList.some(r => r.id === selectedRekeningId))) {
            const defaultId = updatedList[0].id;
            setSelectedRekeningId(defaultId);
            setData('rekening_bank_id', defaultId);
        }
    }, [initialRekeningList, rekening]);

    // Sync selectedRekeningId ke Inertia Form Data
    useEffect(() => {
        if (selectedRekeningId) {
            setData('rekening_bank_id', selectedRekeningId);
        }
    }, [selectedRekeningId]);

    // Handlers Input Jumlah
    function handleJumlahChange(e) {
        const digitsOnly = e.target.value.replace(/\D/g, '');
        setData('jumlah', digitsOnly);
    }

    // Handlers Keypad PIN
    function pressDigit(digit) {
        if (data.pin.length >= PIN_LENGTH) return;
        const nextPin = data.pin + digit;
        setData('pin', nextPin);
        if (nextPin.length === PIN_LENGTH) {
            submitForm(nextPin);
        }
    }

    function pressBackspace() {
        setData('pin', data.pin.slice(0, -1));
    }

    // Submit Penarikan
    function submitForm(finalPin) {
        clearErrors();
        post('/mitra/penarikan', {
            preserveState: false,
            replace: true,
            data: {
                jumlah: jumlahNumber,
                pin: finalPin,
                rekening_bank_id: selectedRekeningId,
            },
            onError: () => {
                setData('pin', '');
            },
        });
    }

    // Reset Form Modal
    function resetModalForm() {
        setShowModalRekening(false);
        setIsEditing(false);
        setEditId(null);
        setNamaBank('');
        setNoRekening('');
        setNamaPemilik('');
        setIsSavingRekening(false);
    }

    // Buka Modal Tambah
    function handleOpenTambahModal() {
        resetModalForm();
        setShowModalRekening(true);
    }

    // Buka Modal Edit
    function handleOpenEditModal(item, e) {
        e.stopPropagation();
        setIsEditing(true);
        setEditId(item.id);
        setNamaBank(item.nama_bank);
        setNoRekening(item.nomor_rekening);
        setNamaPemilik(item.nama_pemilik);
        setShowModalRekening(true);
    }

    // SIMPAN REKENING VIA INERTIA ROUTER
    function handleSimpanRekening(e) {
        e.preventDefault();
        if (!namaBank.trim() || !noRekening.trim() || !namaPemilik.trim()) return;

        setIsSavingRekening(true);

        const payload = {
            nama_bank: namaBank,
            nomor_rekening: noRekening,
            nama_pemilik: namaPemilik,
        };

        if (isEditing) {
            // Update Rekening ke Server
            router.put(`/mitra/rekening/${editId}`, payload, {
                preserveScroll: true,
                onSuccess: () => {
                    resetModalForm();
                },
                onFinish: () => setIsSavingRekening(false),
            });
        } else {
            // Tambah Rekening Baru ke Server
            router.post('/mitra/rekening', payload, {
                preserveScroll: true,
                onSuccess: (page) => {
                    resetModalForm();
                    // Opsional: jika server mereturn list rekening baru di props
                    const newList = page.props.initialRekeningList || [];
                    if (newList.length > 0) {
                        const lastAdded = newList[newList.length - 1];
                        if (lastAdded) {
                            setSelectedRekeningId(lastAdded.id);
                        }
                    }
                },
                onFinish: () => setIsSavingRekening(false),
            });
        }
    }

    // =========================================================================
    // STEP 2: VERIFIKASI PIN
    // =========================================================================
    if (step === 'pin') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <Head title="Verifikasi PIN" />
                <div className="relative flex h-[812px] w-[375px] flex-col justify-between overflow-hidden bg-white px-5 py-4 shadow-xl">
                    
                    {/* Header */}
                    <div>
                        <div className="relative flex items-center justify-center border-b border-gray-100 pb-3">
                            <button
                                type="button"
                                onClick={() => { setStep('jumlah'); setData('pin', ''); clearErrors(); }}
                                className="absolute left-0 text-gray-600"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <h1 className="text-xs font-bold text-gray-800">Verifikasi PIN</h1>
                        </div>

                        {/* Content */}
                        <div className="mt-12 text-center">
                            <h2 className="text-sm font-bold text-gray-900">Masukkan Pin Anda</h2>
                            <p className="mt-1 text-[11px] leading-tight text-gray-400">
                                Pin digunakan untuk mengkonfirmasi bahwa ini adalah Anda
                            </p>

                            {/* Masking PIN Dot */}
                            <div className="mt-10 flex justify-center items-center gap-2 text-lg font-bold tracking-[0.2em] text-gray-800">
                                {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                                    <span key={i} className="w-4 text-center">
                                        {i < data.pin.length ? (i === data.pin.length - 1 ? data.pin[i] : '•') : '•'}
                                    </span>
                                ))}
                            </div>

                            {(errors.pin || errors.jumlah) && (
                                <p className="mt-4 text-[11px] text-red-500 font-medium">{errors.pin || errors.jumlah}</p>
                            )}
                        </div>
                    </div>

                    {/* Keypad & Submit */}
                    <div className="mb-2">
                        <button
                            type="button"
                            disabled={data.pin.length < PIN_LENGTH || processing}
                            onClick={() => submitForm(data.pin)}
                            className="mb-8 w-full rounded-lg bg-[#2D7A44] py-3 text-xs font-semibold text-white transition active:bg-green-800 disabled:opacity-40 cursor-pointer"
                        >
                            {processing ? 'Memverifikasi...' : 'Verifikasi'}
                        </button>

                        <div className="grid grid-cols-3 gap-y-5 text-center">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    disabled={processing}
                                    onClick={() => pressDigit(String(n))}
                                    className="text-lg font-bold text-gray-800 hover:bg-gray-50 active:bg-gray-100 py-1 rounded-full disabled:opacity-50"
                                >
                                    {n}
                                </button>
                            ))}
                            <div />
                            <button
                                type="button"
                                disabled={processing}
                                onClick={() => pressDigit('0')}
                                className="text-lg font-bold text-gray-800 hover:bg-gray-50 active:bg-gray-100 py-1 rounded-full disabled:opacity-50"
                            >
                                0
                            </button>
                            <button
                                type="button"
                                disabled={processing}
                                onClick={pressBackspace}
                                className="flex items-center justify-center text-gray-700 hover:bg-gray-50 active:bg-gray-100 py-1 rounded-full disabled:opacity-50"
                            >
                                <Delete size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================================
    // STEP 1: FORM PENARIKAN
    // =========================================================================
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <Head title="Penarikan" />
            <div className="relative flex h-[812px] w-[375px] flex-col justify-between overflow-hidden bg-white px-5 py-4 shadow-xl">
                
                <div className="overflow-y-auto max-h-[700px] pr-1">
                    {/* Header Navigasi */}
                    <div className="relative flex items-center justify-center border-b border-gray-100 pb-3">
                        <Link 
                            href={typeof route !== 'undefined' ? route('mitra.dashboard') : '/mitra/dashboard'} 
                            className="absolute left-0 text-gray-600"
                        >
                            <ChevronLeft size={20} />
                        </Link>
                        <h1 className="text-xs font-bold text-gray-800">Penarikan</h1>
                    </div>

                    {/* Card Saldo Aktif */}
                    <div className="mt-4 rounded-xl border border-gray-100 bg-white p-3 shadow-xs">
                        <p className="text-[10px] text-gray-400">Total Saldo Aktif <span className="text-[8px]">▼</span></p>
                        <p className="mt-0.5 text-base font-extrabold text-gray-900">Rp{formatRupiah(saldoNum)}</p>
                    </div>

                    {/* Preset Nominal */}
                    <p className="mt-4 text-xs font-bold text-gray-900">Jumlah Penarikan (Rp)</p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                        {PRESETS.map((value) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setData('jumlah', String(value))}
                                className={`rounded-lg border py-2 text-[11px] font-semibold transition cursor-pointer ${
                                    jumlahNumber === value
                                        ? 'border-[#2D7A44] bg-[#2D7A44] text-white'
                                        : 'border-gray-200 bg-white text-gray-700'
                                }`}
                            >
                                Rp {formatRupiah(value)}
                            </button>
                        ))}
                    </div>

                    {/* Input Jumlah Manual */}
                    <p className="mt-4 text-xs font-bold text-gray-900">Masukkan Jumlah</p>
                    <div className="mt-1 flex items-center border-b border-gray-200 py-1">
                        <span className="text-sm font-bold text-gray-900 mr-1">Rp</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={data.jumlah ? formatRupiah(jumlahNumber) : '0'}
                            onChange={handleJumlahChange}
                            className="w-full border-none p-0 text-sm font-bold text-gray-900 focus:outline-none focus:ring-0"
                        />
                    </div>

                    {/* Validasi Jumlah */}
                    {jumlahNumber > 0 && jumlahNumber < 100000 && (
                        <p className="mt-1 text-[10px] text-red-500">Minimal penarikan Rp 100.000</p>
                    )}
                    {jumlahNumber > saldoNum && (
                        <p className="mt-1 text-[10px] text-red-500">Saldo kamu tidak mencukupi</p>
                    )}

                    {/* Rekening Tujuan */}
                    <p className="mt-5 text-xs font-bold text-gray-900">Rekening Tujuan</p>
                    <div className="mt-2 space-y-2">
                        {rekeningList.map((item) => {
                            const isSelected = selectedRekeningId === item.id;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedRekeningId(item.id)}
                                    className={`cursor-pointer rounded-xl border p-3 shadow-xs transition-all ${
                                        isSelected
                                            ? 'border-[#2D7A44] bg-emerald-50/20 ring-1 ring-[#2D7A44]'
                                            : 'border-gray-100 bg-white hover:border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <input
                                                type="radio"
                                                name="rekening_pilihan"
                                                checked={isSelected}
                                                onChange={() => setSelectedRekeningId(item.id)}
                                                className="h-3.5 w-3.5 text-[#2D7A44] focus:ring-[#2D7A44]"
                                            />
                                            <div>
                                                <p className="text-[11px] font-bold text-gray-800">{item.nama_bank}</p>
                                                <p className="text-[10px] text-gray-400">
                                                    {item.nomor_rekening} an {item.nama_pemilik}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Tombol Edit */}
                                        <button
                                            type="button"
                                            onClick={(e) => handleOpenEditModal(item, e)}
                                            className="text-gray-400 hover:text-[#2D7A44] p-1 cursor-pointer"
                                        >
                                            <Pencil size={13} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* PANEL DETAIL REKENING TERPILIH */}
                        {selectedRekening && (
                            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5">
                                <div className="flex items-center gap-1.5 border-b border-emerald-100 pb-2 mb-2">
                                    <CheckCircle2 size={13} className="text-[#2D7A44]" />
                                    <p className="text-[10px] font-bold text-[#2D7A44] uppercase tracking-wider">
                                        Detail Rekening Terpilih
                                    </p>
                                </div>
                                <div className="space-y-1.5 text-[10px]">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Bank Tujuan:</span>
                                        <span className="font-bold text-gray-800">{selectedRekening.nama_bank}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">No. Rekening:</span>
                                        <span className="font-bold text-gray-800">{selectedRekening.nomor_rekening}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Atas Nama:</span>
                                        <span className="font-bold text-gray-800">{selectedRekening.nama_pemilik}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tombol Tambah Rekening */}
                        <button
                            type="button"
                            onClick={handleOpenTambahModal}
                            className="flex items-center gap-1 text-[11px] font-bold text-[#2D7A44] mt-2 hover:opacity-80 transition cursor-pointer"
                        >
                            <Plus size={14} />
                            Tambah Rekening
                        </button>
                    </div>
                </div>

                {/* Tombol Tarik */}
                <button
                    type="button"
                    disabled={!isValidJumlah}
                    onClick={() => { clearErrors(); setStep('pin'); }}
                    className="mt-4 mb-2 w-full rounded-lg bg-[#2D7A44] py-3 text-xs font-semibold text-white transition active:bg-green-800 disabled:opacity-40 cursor-pointer"
                >
                    Tarik
                </button>

                {/* Modal Pop-up Tambah / Edit Rekening */}
                {showModalRekening && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                        <div className="w-full max-w-[320px] rounded-2xl bg-white p-4 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                                <h3 className="text-xs font-bold text-gray-900">
                                    {isEditing ? 'Edit Rekening' : 'Tambah Rekening Baru'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={resetModalForm}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleSimpanRekening} className="space-y-3">
                                <div>
                                    <label className="block text-[10px] font-medium text-gray-500 mb-1">Nama Bank</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: PT. BCA (Bank Central Asia)"
                                        value={namaBank}
                                        onChange={(e) => setNamaBank(e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-800 focus:border-[#2D7A44] focus:outline-none focus:ring-1 focus:ring-[#2D7A44]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-medium text-gray-500 mb-1">Nomor Rekening</label>
                                    <input
                                        type="text"
                                        required
                                        inputMode="numeric"
                                        placeholder="Contoh: 7310900342"
                                        value={noRekening}
                                        onChange={(e) => setNoRekening(e.target.value.replace(/\D/g, ''))}
                                        className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-800 focus:border-[#2D7A44] focus:outline-none focus:ring-1 focus:ring-[#2D7A44]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-medium text-gray-500 mb-1">Nama Pemilik Rekening</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Angelina Hana"
                                        value={namaPemilik}
                                        onChange={(e) => setNamaPemilik(e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-800 focus:border-[#2D7A44] focus:outline-none focus:ring-1 focus:ring-[#2D7A44]"
                                    />
                                </div>

                                <div className="mt-4 flex gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={resetModalForm}
                                        disabled={isSavingRekening}
                                        className="flex-1 rounded-lg border border-gray-200 py-2 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSavingRekening}
                                        className="flex-1 rounded-lg bg-[#2D7A44] py-2 text-[11px] font-semibold text-white hover:bg-green-800 cursor-pointer disabled:opacity-50"
                                    >
                                        {isSavingRekening ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}