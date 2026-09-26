import { useRef, useState } from "react";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import {
  ArrowLeft,
  Camera,
  Monitor,
  Smartphone,
  ShieldCheck,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import ProtectedRoute from "@/Components/ProtectedRoute";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";

export default function Edit({ user, sessions = [] }) {
  const { flash } = usePage().props;
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar ?? null);

  // Form nama & email
  const profileForm = useForm({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });

  // Form avatar (endpoint terpisah karena upload file)
  const avatarForm = useForm({ avatar: null });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    profileForm.put(route("super-admin.profil.update"), {
      preserveScroll: true,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    avatarForm.setData("avatar", file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = () => {
    if (!avatarForm.data.avatar) return;

    avatarForm.post(route("super-admin.profil.avatar.update"), {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => avatarForm.reset("avatar"),
    });
  };

  const handleEndSession = (sessionId) => {
    if (!window.confirm("Akhiri sesi login ini? Perangkat tersebut akan otomatis logout.")) {
      return;
    }

    router.delete(route("super-admin.profil.sessions.destroy", sessionId), {
      preserveScroll: true,
    });
  };

  return (
    <ProtectedRoute allowedRoles={["super_admin"]}>
      <SuperAdminLayout title="Profil Saya">
        <Link
          href={route("super-admin.dashboard")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:underline dark:text-green-400"
        >
          <ArrowLeft size={14} />
          Kembali ke Dashboard
        </Link>

        {flash?.success && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
            <CheckCircle2 size={16} />
            {flash.success}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Kolom kiri: Avatar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Foto Profil</h3>

            <div className="mt-4 flex flex-col items-center gap-4">
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={user?.name}
                    className="h-28 w-28 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-green-100 text-3xl font-bold text-green-700 dark:bg-green-950 dark:text-green-300">
                    {(user?.name ?? "S").charAt(0).toUpperCase()}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-white shadow-md transition hover:bg-green-700"
                  title="Ganti foto profil"
                >
                  <Camera size={16} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {avatarForm.errors.avatar && (
                <p className="text-center text-xs font-medium text-rose-500">{avatarForm.errors.avatar}</p>
              )}

              {avatarForm.data.avatar && (
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={avatarForm.processing}
                  className="w-full rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-60"
                >
                  {avatarForm.processing ? "Mengunggah..." : "Simpan Foto Baru"}
                </button>
              )}

              <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
                Format JPG, PNG, atau WEBP. Maks. 2MB.
              </p>
            </div>
          </div>

          {/* Kolom kanan: Data diri */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Informasi Akun</h3>

            <form onSubmit={handleProfileSubmit} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={profileForm.data.name}
                  onChange={(e) => profileForm.setData("name", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                {profileForm.errors.name && (
                  <p className="mt-1 text-xs font-medium text-rose-500">{profileForm.errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={profileForm.data.email}
                  onChange={(e) => profileForm.setData("email", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                {profileForm.errors.email && (
                  <p className="mt-1 text-xs font-medium text-rose-500">{profileForm.errors.email}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={profileForm.data.phone}
                  onChange={(e) => profileForm.setData("phone", e.target.value.replace(/\D/g, ''))}
                  placeholder="Opsional"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                {profileForm.errors.phone && (
                  <p className="mt-1 text-xs font-medium text-rose-500">{profileForm.errors.phone}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={profileForm.processing}
                className="rounded-xl bg-green-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-60"
              >
                {profileForm.processing ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          </div>
        </div>

        {/* Riwayat Login / Sesi Aktif */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-600 dark:text-green-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Riwayat Login &amp; Sesi Aktif</h3>
          </div>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Total {sessions.length} sesi tercatat. Akhiri sesi yang tidak Anda kenali untuk keamanan akun.
          </p>

          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {sessions.length === 0 && (
              <p className="py-6 text-center text-xs text-slate-400">Belum ada riwayat sesi tercatat.</p>
            )}

            {sessions.map((session) => {
              const isMobile = session.platform === "Android" || session.platform === "iOS";
              const DeviceIcon = isMobile ? Smartphone : Monitor;

              return (
                <div key={session.id} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <DeviceIcon size={18} />
                    </div>
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {session.browser} &middot; {session.platform}
                        {session.is_current_device && (
                          <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600 dark:bg-green-950/50 dark:text-green-400">
                            Perangkat ini
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        IP {session.ip_address} &middot; Aktif {session.last_active}
                      </p>
                    </div>
                  </div>

                  {!session.is_current_device && (
                    <button
                      type="button"
                      onClick={() => handleEndSession(session.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-[11px] font-bold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/30"
                    >
                      <LogOut size={12} />
                      Akhiri
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </SuperAdminLayout>
    </ProtectedRoute>
  );
}