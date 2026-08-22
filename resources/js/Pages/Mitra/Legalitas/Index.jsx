import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft, Info, X, XCircle,
    Delete, CheckCircle2, Clock, ChevronRight,
} from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

const PIN_LENGTH = 6;

export default function Legalitas({ partner }) {
    const sudahKirimKtp = !!partner.link_verifikasi_ktp;
    const sudahPunyaPin = !!partner.has_pin;

    // Tentukan step awal berdasarkan progres yang sudah ada
    const initialStep = partner.verification_status === 'terverifikasi'
        ? 'terverifikasi'
        : sudahKirimKtp && sudahPunyaPin
        ? 'sukses'
        : sudahKirimKtp
        ? 'buat-pin'
        : 'intro';

    const [step, setStep] = useState(initialStep);
    const [showPanduanDrive, setShowPanduanDrive] = useState(false);

    // ---- Form data KTP ----
    const [form, setForm] = useState({
        name: partner.name ?? '',
        gender: partner.gender ?? '',
        birth_date: partner.birth_date ?? '',
        nik: partner.nik ?? '',
        link_verifikasi_ktp: partner.link_verifikasi_ktp ?? '',
    });
    const [errors, setErrors] = useState({});
    const [submittingKtp, setSubmittingKtp] = useState(false);

    function submitKtp(e) {
        e.preventDefault();
        setSubmittingKtp(true);
        setErrors({});
        router.post('/mitra/legalitas', form, {
            preserveScroll: true,
            onSuccess: () => setStep('buat-pin'),
            onError: (err) => setErrors(err),
            onFinish: () => setSubmittingKtp(false),
        });
    }

    // ---- PIN ----
    const [pinStep, setPinStep] = useState('input'); // 'input' | 'confirm'
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [mismatch, setMismatch] = useState(false);
    const [submittingPin, setSubmittingPin] = useState(false);
    const [serverError, setServerError] = useState('');

    const activePin = pinStep === 'input' ? pin : confirmPin;
    const setActivePin = pinStep === 'input' ? setPin : setConfirmPin;

    function handleKeyPress(digit) {
        if (activePin.length >= PIN_LENGTH) return;
        setMismatch(false);
        const next = activePin + digit;
        setActivePin(next);

        if (next.length === PIN_LENGTH) {
            if (pinStep === 'input') {
                setTimeout(() => setPinStep('confirm'), 200);
            } else if (next === pin) {
                submitPin(next);
            } else {
                setMismatch(true);
                setTimeout(() => {
                    setConfirmPin('');
                    setMismatch(false);
                }, 800);
            }
        }
    }

    function handleBackspace() {
        setActivePin(activePin.slice(0, -1));
    }

        function submitPin(finalPin) {
        setSubmittingPin(true);
        router.post('/mitra/legalitas/pin', { pin: finalPin }, {
            preserveScroll: true,
            onSuccess: () => setStep('sukses'),
            onError: (err) => {
                setServerError(err.pin ?? 'Gagal menyimpan PIN, coba lagi.');
                setPinStep('input');
                setPin('');
                setConfirmPin('');
            },
            onFinish: () => setSubmittingPin(false),
        });
    }

    return (
        <MitraLayout>
            <Head title="Verifikasi Legalitas" />

            {step === 'intro' && (
                <IntroStep onNext={() => setStep('panduan')} />
            )}

            {step === 'panduan' && (
                <PanduanStep
                    onBack={() => setStep('intro')}
                    onNext={() => setStep('form')}
                />
            )}

            {step === 'form' && (
                <FormStep
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    submitting={submittingKtp}
                    onBack={() => setStep('panduan')}
                    onSubmit={submitKtp}
                    onOpenPanduanDrive={() => setShowPanduanDrive(true)}
                />
            )}

            {step === 'buat-pin' && (
                    <PinStep
                    pinStep={pinStep}
                    activePin={activePin}
                    mismatch={mismatch}
                    serverError={serverError}
                    submitting={submittingPin}
                    onBack={() => (pinStep === 'confirm' ? setPinStep('input') : setStep('form'))}
                    onKeyPress={handleKeyPress}
                    onBackspace={handleBackspace}
                />
            )}

            {step === 'sukses' && <SuksesStep />}

            {step === 'terverifikasi' && <SudahTerverifikasiStep />}

            {showPanduanDrive && (
                <PanduanDriveModal onClose={() => setShowPanduanDrive(false)} />
            )}
        </MitraLayout>
    );
}

/* ============================= STEP 1 ============================= */
function IntroStep({ onNext }) {
    return (
        <div className="flex h-full flex-col px-6 py-8 text-center">
            <div className="flex flex-1 flex-col items-center justify-center">
                <img
                    src="/images/cardkuning-mitra.png"
                    alt="Ilustrasi verifikasi KTP"
                    className="h-60 w-60 object-contain"
                />

                <h1 className="mt-6 text-lg font-bold text-gray-900">
                    Verifikasi Foto KTP Kamu Dulu Yuk! 🪪
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    Foto KTP akan Titipsini.com gunakan untuk memverifikasi identitasmu 🔒
                </p>
            </div>

            <div className="w-full space-y-3 pb-4">
                <button
                    type="button"
                    onClick={onNext}
                    className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700"
                >
                    Lanjutkan
                </button>
                <Link
                    href="/mitra/dashboard"
                    className="block w-full rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                    Kembali
                </Link>
            </div>
        </div>
    );
}

/* ============================= STEP 2 ============================= */
function PanduanStep({ onBack, onNext }) {
    return (
        <div className="flex h-full flex-col">
            <StepHeader title="Panduan Verifikasi" onBack={onBack} />

            <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="mt-4">
                    <p className="text-sm font-bold text-gray-900">Panduan Selfie KTP</p>
                    <p className="mt-1 text-xs text-gray-500">
                        Pastikan foto yang kamu ambil nanti sesuai dengan panduan dibawah ini ya.
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                        <ContohFoto src="/images/benar.png" status="benar" />
                        <ContohFoto src="/images/salah.png" status="salah" />
                    </div>

                    <PanduanPoin
                        poin={[
                            'Posisikan Hp secara tegak saat mengambil foto.',
                            'Pastikan foto tidak boleh buram atau terpotong.',
                            'KTP harus terlihat jelas.',
                            'Pastikan kamu berada di tempat bercahaya cukup dan tidak menggunakan aksesoris di bagian wajah seperti masker atau kacamata.',
                        ]}
                    />
                </div>

                <div className="mt-6">
                    <p className="text-sm font-bold text-gray-900">Panduan Foto KTP</p>
                    <p className="mt-1 text-xs text-gray-500">
                        Pastikan foto yang kamu ambil nanti sesuai dengan panduan dibawah ini ya.
                    </p>

                    <div className="mt-3 space-y-4">
                        <ContohFoto src="/images/benar-ktp.png" status="benar" full />
                        <ContohFoto src="/images/salah-ktp.png" status="salah" full />
                    </div>

                    <PanduanPoin
                        poin={[
                            'Pastikan anda upload foto KTP asli. Bukan hasil scan atau fotokopi.',
                            'Pastikan KTP masih berlaku.',
                            'Pastikan foto yang anda upload tidak pecah, blur dan pencahayaannya terang.',
                            'Pastikan No Induk Kependudukan (NIK), Nama, Tempat Tanggal Lahir dapat terbaca jelas di foto KTP.',
                        ]}
                    />
                </div>
            </div>

            <div className="border-t border-gray-100 bg-white px-4 py-3">
                <button
                    type="button"
                    onClick={onNext}
                    className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700"
                >
                    Lanjutkan
                </button>
            </div>
        </div>
    );
}

function PanduanPoin({ poin }) {
    return (
        <ul className="mt-4 space-y-1.5">
            {poin.map((p, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-600">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                    {p}
                </li>
            ))}
        </ul>
    );
}

function ContohFoto({ src, status, full = false }) {
    const isBenar = status === 'benar';

    return (
        <div>
            <img
                src={src}
                alt={isBenar ? 'Contoh benar' : 'Contoh salah'}
                className={`w-full rounded-xl border border-gray-200 object-cover ${full ? 'h-40' : 'h-48'}`}
            />
            <div className="mt-1.5 flex items-center justify-center gap-1">
                {isBenar ? (
                    <CheckCircle2 size={13} className="text-green-600" />
                ) : (
                    <XCircle size={13} className="text-red-500" />
                )}
                <span className={`text-xs font-semibold ${isBenar ? 'text-green-600' : 'text-red-500'}`}>
                    {isBenar ? 'Benar' : 'Salah'}
                </span>
            </div>
        </div>
    );
}

function PanduanBlok({ judul, deskripsi, poin }) {
    return (
        <div className="mt-4">
            <p className="text-sm font-bold text-gray-900">{judul}</p>
            <p className="mt-1 text-xs text-gray-500">{deskripsi}</p>
            <ul className="mt-3 space-y-1.5">
                {poin.map((p, i) => (
                    <li key={i} className="flex gap-2 text-xs text-gray-600">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                        {p}
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* ============================= STEP 3 ============================= */
function FormStep({ form, setForm, errors, submitting, onBack, onSubmit, onOpenPanduanDrive }) {
    function update(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    return (
        <div className="flex h-full flex-col">
            <StepHeader title="Verifikasi KTP" onBack={onBack} />

            <form onSubmit={onSubmit} className="flex-1 overflow-y-auto px-4 pb-4">
                <p className="text-sm font-bold text-gray-900">Data KTP</p>

                <Field label="NIK" error={errors.nik}>
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={16}
                        placeholder="Contoh: 7105074205820001"
                        value={form.nik}
                        onChange={(e) => update('nik', e.target.value.replace(/\D/g, ''))}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
                    />
                </Field>

                <Field label="Nama Lengkap" error={errors.name}>
                    <input
                        type="text"
                        placeholder="Contoh: Jelly Jeine Kordak"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
                    />
                </Field>

                <Field label="Jenis Kelamin" error={errors.gender}>
                    <select
                        value={form.gender}
                        onChange={(e) => update('gender', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
                    >
                        <option value="">Jenis Kelamin</option>
                        <option value="male">Laki-laki</option>
                        <option value="female">Perempuan</option>
                    </select>
                </Field>

                <Field label="Tanggal Lahir" error={errors.birth_date}>
                    <input
                        type="date"
                        value={form.birth_date}
                        onChange={(e) => update('birth_date', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
                    />
                </Field>

                <Field
                    label={
                        <span className="flex items-center gap-1">
                            Link Foto KTP dan Foto Selfie dengan KTP
                            <button type="button" onClick={onOpenPanduanDrive}>
                                <Info size={13} className="text-gray-400" />
                            </button>
                        </span>
                    }
                    error={errors.link_verifikasi_ktp}
                >
                    <input
                        type="url"
                        placeholder="https://drive.google.com/contoh"
                        value={form.link_verifikasi_ktp}
                        onChange={(e) => update('link_verifikasi_ktp', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
                    />
                    <p className="mt-1 text-[11px] text-gray-400">
                        Foto selfie ini diperlukan untuk memastikan KTP kamu benar milik kamu.
                    </p>
                </Field>

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-4 w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60"
                >
                    {submitting ? 'Mengirim...' : 'Lanjutkan'}
                </button>
            </form>
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div className="mt-3">
            <label className="mb-1 block text-xs font-semibold text-gray-700">{label}</label>
            {children}
            {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
        </div>
    );
}

function PanduanDriveModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="max-h-[80vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900">Panduan</p>
                    <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
                </div>

                <p className="text-xs font-bold text-gray-800">Upload Foto pada google drive</p>
                <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-xs text-gray-600">
                    <li>Di ponsel atau tablet Android, buka aplikasi Google Drive.</li>
                    <li>Ketuk Tambahkan.</li>
                    <li>Ketuk Upload.</li>
                    <li>Temukan dan ketuk file yang ingin Anda upload.</li>
                    <li>Temukan file yang telah diupload di Drive Saya hingga Anda memindahkannya.</li>
                </ol>

                <p className="mt-4 text-xs font-bold text-gray-800">Membagikan link google drive</p>
                <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-xs text-gray-600">
                    <li>Pilih file yang ingin Anda bagikan.</li>
                    <li>Klik Bagikan atau Bagikan.</li>
                    <li>Pada bagian "umum", klik Panah bawah.</li>
                    <li>Untuk menentukan peran orang lain, pilih Pelihat, Pengomentar, atau Editor.</li>
                    <li>Klik Salin link.</li>
                    <li>Klik Selesai.</li>
                    <li>Tempelkan link di email atau di mana saja Anda ingin membagikannya.</li>
                </ol>

                <button
                    onClick={onClose}
                    className="mt-5 w-full rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white hover:bg-green-700"
                >
                    Mengerti
                </button>
            </div>
        </div>
    );
}

/* ============================= STEP 4 ============================= */
function PinStep({ pinStep, activePin, mismatch, serverError, submitting, onBack, onKeyPress, onBackspace }) {
    return (
        <div className="mx-auto flex h-full max-w-md flex-col items-center px-8 py-10">
            <div className="mb-4 w-full">
                <button onClick={onBack} className="text-gray-500">
                    <ArrowLeft size={20} />
                </button>
            </div>

            <img
                src={
                    pinStep === 'input'
                        ? '/images/kunci.png'
                        : '/images/kunci.png'
                }
                alt=""
                className="h-24 w-24 object-contain"
            />

            <h1 className="mt-5 text-base font-bold text-gray-900">
                {pinStep === 'input' ? 'Buat PIN Kamu Sekarang! 🔒' : 'Konfirmasi PIN Anda'}
            </h1>
            <p className="mt-1 text-center text-xs text-gray-500">
                {pinStep === 'input'
                    ? 'PIN di gunakan untuk bertransaksi di akun Anda'
                    : 'Masukkan sekali lagi PIN yang sama'}
            </p>

            <div className="mt-8 flex gap-3">
                {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                    <span
                        key={i}
                        className={`h-3.5 w-3.5 rounded-full border-2 transition-colors ${
                            mismatch
                                ? 'border-red-400 bg-red-400'
                                : i < activePin.length
                                ? 'border-green-600 bg-green-600'
                                : 'border-gray-300 bg-transparent'
                        }`}
                    />
                ))}
            </div>

            {mismatch && <p className="mt-3 text-xs text-red-500">PIN tidak cocok, coba lagi</p>}
            {!mismatch && serverError && <p className="mt-3 text-xs text-red-500">{serverError}</p>}

            <div className="mt-10 grid w-full max-w-xs grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                        key={n}
                        type="button"
                        disabled={submitting}
                        onClick={() => onKeyPress(String(n))}
                        className="flex h-16 items-center justify-center rounded-full text-xl font-medium text-gray-800 hover:bg-gray-100 active:bg-gray-200"
                    >
                        {n}
                    </button>
                ))}
                <div />
                <button
                    type="button"
                    disabled={submitting}
                    onClick={() => onKeyPress('0')}
                    className="flex h-16 items-center justify-center rounded-full text-xl font-medium text-gray-800 hover:bg-gray-100 active:bg-gray-200"
                >
                    0
                </button>
                <button
                    type="button"
                    disabled={submitting}
                    onClick={onBackspace}
                    className="flex h-16 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200"
                >
                    <Delete size={20} />
                </button>
            </div>
        </div>
    );
}

/* ============================= STEP 5 ============================= */
function SuksesStep() {
    return (
        <div className="flex h-full flex-col items-center px-6 py-8 text-center">
            <div className="flex items-center gap-1.5 self-center">
                <img src="/images/logo-titipsini.png" alt="Titipsini.com" className="h-6 w-auto object-contain" />
                <span className="text-base font-bold tracking-tight text-[#15803d]">
                    Titipsini<span className="mx-0.5 text-[#fbbf24]">•</span>Com
                </span>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center">
                <img
                    src="/images/illustration-lengkapi-data.png"
                    alt="Verifikasi berhasil"
                    className="h-40 w-40 object-contain"
                />
                <h1 className="mt-2 text-lg font-bold text-gray-900">Verifikasi Berhasil!</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Selamat kamu sudah bisa bertransaksi
                </p>
                <div className="mt-3 flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                    <Clock size={13} />
                    Tunggu verifikasi dalam waktu 3 hari kerja
                </div>
            </div>

            <Link
                href="/mitra/dashboard"
                className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700"
            >
                Selesai
            </Link>
        </div>
    );
}

function SudahTerverifikasiStep() {
    return (
        <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 size={30} className="text-green-600" />
            </div>
            <h1 className="mt-4 text-lg font-bold text-gray-900">Akun Kamu Sudah Terverifikasi</h1>
            <p className="mt-2 text-sm text-gray-500">Kamu sudah bisa bertransaksi secara penuh.</p>
            <Link
                href="/mitra/dashboard"
                className="mt-8 flex items-center gap-1 text-sm font-bold text-green-600 hover:underline"
            >
                Kembali ke Beranda <ChevronRight size={16} />
            </Link>
        </div>
    );
}

function StepHeader({ title, onBack }) {
    return (
        <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
            <button onClick={onBack} className="text-gray-500">
                <ArrowLeft size={20} />
            </button>
            <p className="text-sm font-bold text-gray-900">{title}</p>
        </div>
    );
}