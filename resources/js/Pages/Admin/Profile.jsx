import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Pencil } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";

/**
 * Halaman "Ubah Profil" — Admin
 *
 * Route (contoh):
 *   Route::get('/admin/profil/ubah', [ProfileController::class, 'edit'])->name('admin.profile.edit');
 *   Route::put('/admin/profil', [ProfileController::class, 'update'])->name('admin.profile.update');
 *
 * Props yang diharapkan dari controller (lihat ProfileController::edit di bawah):
 *   admin: {
 *     id_admin, name, email, phone, tanggal_lahir, gender,
 *     provinsi, city, kecamatan, address,
 *     peran, wilayah, foto_url
 *   }
 */
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
    <AdminLayout title="Ubah Profil">
      <p className="text-sm text-gray-400 mb-6">
        Profil <span className="mx-1">›</span> Ubah Profil
      </p>

      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          {/* Kartu kiri: foto + identitas ringkas */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
            <div className="relative">
                <img
                src={preview ?? "/storage/avatars/anF3Zp3bp6oR6MlmcrpzjVkQ9LbwLbaq20PLq1W4.png"}
                alt={data.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              <label
                htmlFor="foto"
                className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow cursor-pointer border border-gray-200"
                title="Ganti foto"
              >
                <Pencil size={14} className="text-gray-600" />
                <input
                  id="foto"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-800">
              {data.name}
            </h2>

            <div className="w-full mt-6 text-left text-sm">
              <InfoRow label="Id admin" value={admin.id_admin} />
              <InfoRow label="Peran akun" value={admin.peran ?? "Admin"} highlight />
              <InfoRow label="Wilayah" value={admin.wilayah} highlight last />
            </div>
          </div>

          {/* Kartu kanan: biodata form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Biodata admin</h3>

            <div className="text-sm divide-y divide-gray-100">
              <FieldRow label="Nama lengkap" error={errors.name}>
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

              <FieldRow label="Email" error={errors.email}>
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

              <FieldRow label="Nomor telepon" error={errors.phone}>
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

              <FieldRow label="Tanggal lahir" error={errors.tanggal_lahir}>
                <input
                  type="date"
                  value={data.tanggal_lahir}
                  onChange={(e) => updateField("tanggal_lahir", e.target.value)}
                  className="field-input"
                />
              </FieldRow>

              <FieldRow label="Jenis kelamin" error={errors.gender}>
                <select
                  value={data.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="field-input"
                >
                  <option value="">Pilih</option>
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

              <FieldRow label="Kabupaten/kota" error={errors.city}>
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

              <FieldRow label="Alamat lengkap" error={errors.address} last>
                <textarea
                  rows={2}
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

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={processing}
            className="px-6 py-2 rounded-lg bg-brand-teal-700 text-white font-medium hover:bg-brand-teal-800 transition disabled:opacity-60"
          >
            Simpan
          </button>
        </div>
      </form>

      <style>{`
        .field-input {
          width: 100%;
          text-align: left;
          border: 1px solid #d1d5db; /* gray-300 */
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: #ffffff;
          color: #111827; /* gray-900 */
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field-input:hover {
          border-color: #9ca3af; /* gray-400 */
        }
        .field-input:focus {
          border-color: #0f766e; /* brand-teal-700 */
          box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.15);
        }
        .field-input:disabled {
          background: #f3f4f6;
          color: #6b7280;
          cursor: not-allowed;
        }
      `}</style>
    </AdminLayout>
  );
}

function InfoRow({ label, value, highlight, last }) {
  return (
    <div
      className={`flex justify-between py-2 ${
        !last ? "border-b border-gray-100" : ""
      }`}
    >
      <span className="text-gray-600">{label}</span>
      <span className={highlight ? "text-brand-teal-700 font-semibold" : "text-gray-900 font-medium"}>
        {value}
      </span>
    </div>
  );
}

function FieldRow({ label, children, error }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="text-gray-600 font-medium pt-2 w-36 shrink-0">
        {label}
      </span>
      <span className="text-gray-400 pt-2">:</span>
      <div className="flex-1 flex flex-col">
        {children}
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    </div>
  );
}