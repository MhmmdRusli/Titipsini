import { useState } from "react";
import { useForm } from "@inertiajs/react";
import {
  Pencil,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building2,
  Landmark,
  Home,
  ShieldCheck,
} from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Profile({ admin }) {
  const { data, setData, post, processing, errors, clearErrors, reset, transform } = useForm({
    name: admin?.name ?? "",
    email: admin?.email ?? "",
    phone: admin?.phone ?? "",
    tanggal_lahir: admin?.tanggal_lahir ?? "",
    gender: admin?.gender ?? "",
    provinsi: admin?.provinsi ?? "",
    city: admin?.city ?? "",
    kecamatan: admin?.kecamatan ?? "",
    address: admin?.address ?? "",
    foto: null,
  });

  const [preview, setPreview] = useState(admin?.foto_url ?? null);

  function updateField(field, value) {
    setData(field, value);
    if (errors[field]) clearErrors(field);
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setData("foto", file);
    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e) {
    e.preventDefault();
    transform((data) => ({
      ...data,
      _method: "put",
    }));
    post(route("admin.profil.update"), {
      forceFormData: true,
      preserveScroll: true,
    });
  }

  function handleCancel() {
    reset();
    setPreview(admin?.foto_url ?? null);
  }

  return (
    <AdminLayout title="Informasi Akun">
      <form onSubmit={handleSubmit} autoComplete="off" className="pb-24 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

          {/* ================= Kartu Kiri: Foto & Ringkasan ================= */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-800 p-6 transition-colors lg:sticky lg:top-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={preview ?? "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(data.name || "Admin")}
                  alt={data.name}
                  className="w-24 h-24 rounded-2xl object-cover border border-gray-200 dark:border-gray-700 shadow-sm"
                />
                <label
                  htmlFor="foto"
                  className="absolute -bottom-2 -right-2 bg-green-700 dark:bg-emerald-600 text-white rounded-xl p-1.5 shadow-md cursor-pointer hover:bg-green-800 dark:hover:bg-emerald-500 transition border-2 border-white dark:border-gray-900"
                  title="Ganti foto"
                >
                  <Pencil size={13} />
                  <input
                    id="foto"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>

              <h2 className="mt-4 text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                {data.name || "Administrator"}
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
                {data.email || "email@domain.com"}
              </p>

              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                <ShieldCheck size={12} />
                {admin?.peran ?? "Admin"}
              </span>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-1">
              <SummaryRow label="ID Admin" value={admin?.id_admin} />
              <SummaryRow label="Wilayah" value={admin?.wilayah} last />
            </div>
          </div>

          {/* ================= Kartu Kanan: Form Biodata ================= */}
          <div className="space-y-6">

            {/* --- Section: Informasi Pribadi --- */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-800 p-6 lg:p-8 transition-colors">
              <SectionHeading
                title="Informasi Pribadi"
                subtitle="Data diri utama yang tampil pada akun kamu."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                <Field label="Nama Lengkap" icon={User} error={errors.name}>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="field-input"
                    autoComplete="off"
                    name="f_nm_01"
                    id="f_nm_01"
                  />
                </Field>

                <Field label="Alamat Email" icon={Mail} error={errors.email}>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="field-input"
                    autoComplete="off"
                    name="f_em_02"
                    id="f_em_02"
                  />
                </Field>

                <Field label="Nomor Telepon" icon={Phone} error={errors.phone}>
                  <input
                    type="text"
                    value={data.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="field-input"
                    autoComplete="off"
                    name="f_tp_03"
                    id="f_tp_03"
                  />
                </Field>

                <Field label="Tanggal Lahir" icon={Calendar} error={errors.tanggal_lahir}>
                  <input
                    type="date"
                    value={data.tanggal_lahir}
                    onChange={(e) => updateField("tanggal_lahir", e.target.value)}
                    className="field-input dark:[color-scheme:dark]"
                  />
                </Field>

                <Field label="Jenis Kelamin" icon={User} error={errors.gender} className="sm:col-span-2 sm:max-w-[calc(50%-0.625rem)]">
                  <select
                    value={data.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                    className="field-input"
                  >
                    <option value="">Pilih jenis kelamin</option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </Field>
              </div>
            </div>

            {/* --- Section: Alamat --- */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-800 p-6 lg:p-8 transition-colors">
              <SectionHeading
                title="Alamat"
                subtitle="Lokasi domisili untuk keperluan administrasi."
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-4">
                <Field label="Provinsi" icon={Landmark} error={errors.provinsi}>
                  <input
                    type="text"
                    value={data.provinsi}
                    onChange={(e) => updateField("provinsi", e.target.value)}
                    className="field-input"
                    autoComplete="off"
                    name="f_pv_04"
                    id="f_pv_04"
                  />
                </Field>

                <Field label="Kabupaten / Kota" icon={Building2} error={errors.city}>
                  <input
                    type="text"
                    value={data.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="field-input"
                    autoComplete="off"
                    name="f_kb_05"
                    id="f_kb_05"
                  />
                </Field>

                <Field label="Kecamatan" icon={MapPin} error={errors.kecamatan}>
                  <input
                    type="text"
                    value={data.kecamatan}
                    onChange={(e) => updateField("kecamatan", e.target.value)}
                    className="field-input"
                    autoComplete="off"
                    name="f_kc_06"
                    id="f_kc_06"
                  />
                </Field>

                <Field label="Alamat Lengkap" icon={Home} error={errors.address} className="sm:col-span-3">
                  <textarea
                    rows={3}
                    value={data.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="field-input resize-none"
                    autoComplete="off"
                    name="f_al_07"
                    id="f_al_07"
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>

        {/* ================= Action Buttons ================= */}
        {/* Sticky di mobile supaya selalu terjangkau tanpa scroll ke bawah,
            statis di desktop karena form sudah muat di layar. */}
        <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-[#111827]/95 backdrop-blur px-4 py-3 lg:static lg:mt-6 lg:border-0 lg:bg-transparent lg:dark:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={processing}
            className="rounded-xl bg-green-700 dark:bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-green-800 dark:hover:bg-emerald-500 disabled:opacity-60 shadow-sm transition select-none"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>

      <style>{`
        .field-input {
          width: 100%;
          text-align: left;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 0.5rem 0.75rem;
          background: #ffffff;
          font-size: 0.75rem;
          color: #1f2937;
          outline: none;
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .field-input:hover {
          border-color: #d1d5db;
        }
        .field-input:focus {
          border-color: #15803d;
          box-shadow: 0 0 0 1px #15803d;
        }
        .field-input:disabled {
          background: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
        }

        /* Support Dark Mode pada style kustom */
        .dark .field-input {
          border-color: #1f293d;
          background: #1f293d;
          color: #f3f4f6;
        }
        .dark .field-input:hover {
          border-color: #374151;
        }
        .dark .field-input:focus {
          border-color: #059669;
          box-shadow: 0 0 0 1px #059669;
        }
        .dark .field-input:disabled {
          background: #111827;
          color: #6b7280;
        }
      `}</style>
    </AdminLayout>
  );
}

function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
    </div>
  );
}

function SummaryRow({ label, value, last }) {
  return (
    <div className={`flex items-center justify-between py-2 ${!last ? "border-b border-gray-100 dark:border-gray-800" : ""}`}>
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
      <span className="text-xs text-gray-800 dark:text-gray-200 font-semibold">{value ?? "-"}</span>
    </div>
  );
}

function Field({ label, icon: Icon, children, error, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
        {Icon && <Icon size={13} className="text-gray-400 dark:text-gray-500" />}
        {label}
      </label>
      {children}
      {error && <span className="mt-1 block text-[11px] text-red-600 dark:text-red-400 font-medium">{error}</span>}
    </div>
  );
}