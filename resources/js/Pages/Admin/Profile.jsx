import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Pencil } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Profile({ admin }) {
  const { data, setData, post, processing, errors, clearErrors, reset, transform } = useForm({
    name: admin.name ?? "",
    email: admin.email ?? "",
    phone: admin.phone ?? "",
    tanggal_lahir: admin.tanggal_lahir ?? "",
    gender: admin.gender ?? "",
    provinsi: admin.provinsi ?? "",
    city: admin.city ?? "",
    kecamatan: admin.kecamatan ?? "",
    address: admin.address ?? "",
    foto: null,
  });

  const [preview, setPreview] = useState(admin.foto_url ?? null);

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
    setPreview(admin.foto_url ?? null);
  }

  return (
    <AdminLayout title="Informasi Akun">
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
          
          {/* Kartu Kiri: Foto & Ringkasan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={preview ?? "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(data.name || "Admin")}
                alt={data.name}
                className="w-28 h-28 rounded-2xl object-cover border border-gray-200 shadow-sm"
              />
              <label
                htmlFor="foto"
                className="absolute -bottom-2 -right-2 bg-green-700 text-white rounded-xl p-2 shadow-md cursor-pointer hover:bg-green-800 transition border-2 border-white"
                title="Ganti foto"
              >
                <Pencil size={14} />
                <input
                  id="foto"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>

            <h2 className="mt-4 text-sm font-semibold text-gray-900 line-clamp-1">
              {data.name || "Administrator"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{data.email || "email@domain.com"}</p>

            <div className="w-full mt-6 pt-5 border-t border-gray-100 text-xs space-y-3">
              <InfoRow label="ID Admin" value={admin.id_admin} />
              <InfoRow label="Peran Akun" value={admin.peran ?? "Admin"} highlight />
              <InfoRow label="Wilayah" value={admin.wilayah} highlight last />
            </div>
          </div>

          {/* Kartu Kanan: Form Biodata */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 lg:p-8">
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Biodata Administrator</h3>
              <p className="text-xs text-gray-500 mt-0.5">Pastikan data pribadi yang Anda masukkan sudah benar.</p>
            </div>

            <div className="space-y-4">
              <FieldRow label="Nama Lengkap" error={errors.name}>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="field-input"
                  autoComplete="off"
                  name="f_nm_01"
                  id="f_nm_01"
                />
              </FieldRow>

              <FieldRow label="Alamat Email" error={errors.email}>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="field-input"
                  autoComplete="off"
                  name="f_em_02"
                  id="f_em_02"
                />
              </FieldRow>

              <FieldRow label="Nomor Telepon" error={errors.phone}>
                <input
                  type="text"
                  value={data.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="field-input"
                  autoComplete="off"
                  name="f_tp_03"
                  id="f_tp_03"
                />
              </FieldRow>

              <FieldRow label="Tanggal Lahir" error={errors.tanggal_lahir}>
                <input
                  type="date"
                  value={data.tanggal_lahir}
                  onChange={(e) => updateField("tanggal_lahir", e.target.value)}
                  className="field-input"
                />
              </FieldRow>

              <FieldRow label="Jenis Kelamin" error={errors.gender}>
                <select
                  value={data.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="field-input"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </FieldRow>

              <FieldRow label="Provinsi" error={errors.provinsi}>
                <input
                  type="text"
                  value={data.provinsi}
                  onChange={(e) => updateField("provinsi", e.target.value)}
                  className="field-input"
                  autoComplete="off"
                  name="f_pv_04"
                  id="f_pv_04"
                />
              </FieldRow>

              <FieldRow label="Kabupaten / Kota" error={errors.city}>
                <input
                  type="text"
                  value={data.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="field-input"
                  autoComplete="off"
                  name="f_kb_05"
                  id="f_kb_05"
                />
              </FieldRow>

              <FieldRow label="Kecamatan" error={errors.kecamatan}>
                <input
                  type="text"
                  value={data.kecamatan}
                  onChange={(e) => updateField("kecamatan", e.target.value)}
                  className="field-input"
                  autoComplete="off"
                  name="f_kc_06"
                  id="f_kc_06"
                />
              </FieldRow>

              <FieldRow label="Alamat Lengkap" error={errors.address} last>
                <textarea
                  rows={3}
                  value={data.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="field-input resize-none"
                  autoComplete="off"
                  name="f_al_07"
                  id="f_al_07"
                />
              </FieldRow>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={processing}
            className="rounded-xl bg-green-700 px-4 py-2 text-xs font-semibold text-white hover:bg-green-800 disabled:opacity-60 shadow-sm transition select-none"
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
      `}</style>
    </AdminLayout>
  );
}

function InfoRow({ label, value, highlight, last }) {
  return (
    <div className={`flex items-center justify-between pb-2.5 ${!last ? "border-b border-gray-100" : ""}`}>
      <span className="text-gray-500 font-medium">{label}</span>
      <span className={highlight ? "rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-semibold text-emerald-700" : "text-gray-800 font-semibold"}>
        {value ?? "-"}
      </span>
    </div>
  );
}

function FieldRow({ label, children, error, last }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2 sm:gap-4 items-start ${!last ? "pb-4 border-b border-gray-100" : ""}`}>
      <label className="text-xs font-semibold text-gray-700 pt-2">
        {label}
      </label>
      <div className="flex flex-col">
        {children}
        {error && <span className="text-[11px] text-red-600 mt-1 font-medium">{error}</span>}
      </div>
    </div>
  );
}