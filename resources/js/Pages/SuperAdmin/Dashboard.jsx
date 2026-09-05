import { Link, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Package,
  Building2,
  Truck,
  Car,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  LayoutDashboard,
  Users,
  UserCheck,
  Boxes,
  Sparkles,
  Calendar,
} from "lucide-react";
import ProtectedRoute from "@/Components/ProtectedRoute";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";

// --- Warna Chart & Accents ---
const COLOR_BARANG = "#6366f1";   // Indigo 500
const COLOR_PICKUP = "#0284c7";   // Sky 600
const COLOR_KENDARAAN = "#d97706"; // Amber 600
const COLOR_BANGUNAN = "#e11d48";  // Rose 600

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

const DEFAULT_STATS = {
  total_pesanan: 0,
  total_customer: 0,
  total_vendor: 0,
  total_layanan: 0,
};

const DEFAULT_CHART_PESANAN = MONTHS.map((bulan) => ({
  bulan,
  barang: 0,
  pickup: 0,
  kendaraan: 0,
  bangunan: 0,
}));

const DEFAULT_PESANAN_BREAKDOWN = [
  { label: "Barang", value: 0, color: COLOR_BARANG },
  { label: "Pick Up", value: 0, color: COLOR_PICKUP },
  { label: "Kendaraan", value: 0, color: COLOR_KENDARAAN },
  { label: "Bangunan", value: 0, color: COLOR_BANGUNAN },
];

const DEFAULT_LAYANAN_VENDOR = [
  { key: "barang", label: "Total Layanan Barang", value: 0, icon: Package, color: COLOR_BARANG },
  { key: "bangunan", label: "Total Layanan Bangunan", value: 0, icon: Building2, color: COLOR_BANGUNAN },
  { key: "pickup", label: "Total Layanan Pick Up", value: 0, icon: Truck, color: COLOR_PICKUP },
  { key: "kendaraan", label: "Total Layanan Kendaraan", value: 0, icon: Car, color: COLOR_KENDARAAN },
];

const ICON_BY_KEY = {
  barang: Package,
  bangunan: Building2,
  pickup: Truck,
  kendaraan: Car,
};

const DEFAULT_KEUANGAN = {
  total_saldo: 0,
  transaksi_keluar: 0,
  transaksi_masuk: 0,
};

const DEFAULT_PEMBAYARAN_LAYANAN = MONTHS.map((bulan) => ({
  bulan,
  pickup: 0,
  kendaraan: 0,
  konstruksi: 0,
}));

const BULAN_FULL = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const TAHUN_OPTIONS = (() => {
  const start = 2023;
  const end = new Date().getFullYear() + 1;
  return Array.from({ length: end - start + 1 }, (_, i) => String(start + i));
})();

function formatRupiah(value) {
  return `Rp${Number(value ?? 0).toLocaleString("id-ID")}`;
}

export default function Dashboard({
  user,
  stats = DEFAULT_STATS,
  chartPesanan = DEFAULT_CHART_PESANAN,
  pesananBreakdown = DEFAULT_PESANAN_BREAKDOWN,
  layananVendor = DEFAULT_LAYANAN_VENDOR,
  keuangan = DEFAULT_KEUANGAN,
  pembayaranLayanan = DEFAULT_PEMBAYARAN_LAYANAN,
  filter = null,
}) {
  const pageUser = usePage().props.auth?.user || user;
  const [bulan, setBulan] = useState(String(filter?.bulan ?? new Date().getMonth() + 1));
  const [tahun, setTahun] = useState(String(filter?.tahun ?? new Date().getFullYear()));

  const applyPeriode = (bulanBaru, tahunBaru) => {
    router.get(
      route("super-admin.dashboard"),
      { bulan: bulanBaru, tahun: tahunBaru },
      {
        preserveState: true,
        preserveScroll: true,
        only: ["stats", "chartPesanan", "pesananBreakdown", "layananVendor", "keuangan", "pembayaranLayanan", "filter"],
      }
    );
  };

  const handleBulanChange = (value) => {
    const idx = BULAN_FULL.indexOf(value);
    if (idx === -1) return;
    setBulan(String(idx + 1));
    applyPeriode(idx + 1, tahun);
  };

  const handleTahunChange = (value) => {
    setTahun(value);
    applyPeriode(bulan, value);
  };

  return (
    <ProtectedRoute allowedRoles={["super_admin"]}>
      <SuperAdminLayout title="Dashboard Super Admin">
        
        {/* Banner Hijau */}
        <div className="relative overflow-hidden rounded-2xl bg-[#007b49] p-6 text-white shadow-md">
          <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-xl" />
          <div className="pointer-events-none absolute -bottom-12 right-24 h-48 w-48 rounded-full bg-white/5 blur-lg" />

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 backdrop-blur-sm">
                <Sparkles size={13} />
                <span>SUPER ADMIN DASHBOARD</span>
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                Halo, Selamat Datang di Dashboard Admin
              </h1>
              <p className="mt-1 text-xs text-emerald-100 md:text-sm">
                Pantau seluruh aktivitas transaksi, pelanggan, dan vendor Titipsini secara terpusat.
              </p>
            </div>

            {/* Filter Dropdown Berbentuk Kapsul Fix Transparan Dark Mode */}
            <div className="flex items-center rounded-xl border border-white/30 bg-white/10 p-1 backdrop-blur-md">
              <div className="relative flex items-center border-r border-white/20 px-3 py-1.5">
                <Calendar size={14} className="mr-2 text-amber-300" />
                <select
                  value={BULAN_FULL[Number(bulan) - 1] ?? "Januari"}
                  onChange={(e) => handleBulanChange(e.target.value)}
                  style={{ backgroundColor: "transparent", color: "white" }}
                  className="appearance-none !bg-transparent dark:!bg-transparent text-xs font-semibold !text-white border-none outline-none focus:outline-none focus:ring-0 focus:!bg-transparent active:!bg-transparent shadow-none cursor-pointer pr-5"
                >
                  {BULAN_FULL.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#007b49] text-white dark:bg-[#007b49]">
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="pointer-events-none absolute right-2 text-white/80" />
              </div>

              <div className="relative flex items-center px-3 py-1.5">
                <select
                  value={tahun}
                  onChange={(e) => handleTahunChange(e.target.value)}
                  style={{ backgroundColor: "transparent", color: "white" }}
                  className="appearance-none !bg-transparent dark:!bg-transparent text-xs font-semibold !text-white border-none outline-none focus:outline-none focus:ring-0 focus:!bg-transparent active:!bg-transparent shadow-none cursor-pointer pr-5"
                >
                  {TAHUN_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#007b49] text-white dark:bg-[#007b49]">
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="pointer-events-none absolute right-2 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Kartu Statistik */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Pesanan"
            value={stats.total_pesanan}
            icon={LayoutDashboard}
            iconColor="text-indigo-500"
            badgeBg="bg-indigo-50 dark:bg-indigo-950/50"
            href={route("super-admin.pesanan.index")}
          />
          <StatCard
            label="Total Customer"
            value={stats.total_customer}
            icon={Users}
            iconColor="text-sky-500"
            badgeBg="bg-sky-50 dark:bg-sky-950/50"
            href={route("super-admin.user.customer.index")}
          />
          <StatCard
            label="Total Vendor"
            value={stats.total_vendor}
            icon={UserCheck}
            iconColor="text-amber-500"
            badgeBg="bg-amber-50 dark:bg-amber-950/50"
            href={route("super-admin.user.vendor.index")}
          />
          <StatCard
            label="Total Layanan"
            value={stats.total_layanan}
            icon={Boxes}
            iconColor="text-rose-500"
            badgeBg="bg-rose-50 dark:bg-rose-950/50"
            href={route("super-admin.layanan.index")}
          />
        </div>

        <div className="mt-6 flex flex-col gap-6">
          <ChartPesananCard data={chartPesanan} tahun={tahun} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <PesananBreakdownCard data={pesananBreakdown} tahun={tahun} />

            <div className="lg:col-span-1">
              <SectionLabel>Layanan Vendor</SectionLabel>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {layananVendor.map((item) => (
                  <LayananVendorCard key={item.key} item={item} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <SectionLabel>Catatan Keuangan</SectionLabel>
              <div className="mt-3 flex flex-col gap-3">
                <KeuanganCard
                  icon={Wallet}
                  label="Total Saldo"
                  value={formatRupiah(keuangan.total_saldo)}
                  tone="indigo"
                />
                <KeuanganCard
                  icon={ArrowUpRight}
                  label="Transaksi Keluar"
                  value={formatRupiah(keuangan.transaksi_keluar)}
                  tone="red"
                />
                <KeuanganCard
                  icon={ArrowDownRight}
                  label="Transaksi Masuk"
                  value={formatRupiah(keuangan.transaksi_masuk)}
                  tone="amber"
                />
              </div>
            </div>
          </div>

          <PembayaranLayananCard data={pembayaranLayanan} />
        </div>
      </SuperAdminLayout>
    </ProtectedRoute>
  );
}

function StatCard({ label, value, icon: Icon, iconColor, badgeBg, href }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <Icon
        size={100}
        strokeWidth={1}
        className={`pointer-events-none absolute -bottom-5 -right-5 opacity-10 ${iconColor} dark:opacity-20`}
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${badgeBg} ${iconColor}`}>
            <Icon size={18} />
          </div>
        </div>

        <div className="mt-3">
          <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">
            {Number(value ?? 0).toLocaleString("id-ID")}
          </p>
        </div>

        <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Link
            href={href}
            className={`inline-flex items-center gap-1 text-[11px] font-bold ${iconColor} hover:underline`}
          >
            Lihat Detail
            <ChevronDown size={12} className="-rotate-90" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
      {children}
    </h3>
  );
}

function ChartPesananCard({ data, tahun }) {
  const series = [
    { key: "barang", label: "Penitipan Barang", color: COLOR_BARANG },
    { key: "pickup", label: "Pick Up", color: COLOR_PICKUP },
    { key: "kendaraan", label: "Penitipan Kendaraan", color: COLOR_KENDARAAN },
    { key: "bangunan", label: "Penitipan Bangunan", color: COLOR_BANGUNAN },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Chart Pesanan</h3>
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          {tahun}
        </span>
      </div>

      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, borderColor: "#e2e8f0" }} />
            {series.map((s) => (
              <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        {series.map((s) => (
          <LegendDot key={s.key} color={s.color} label={s.label} />
        ))}
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function PesananBreakdownCard({ data, tahun }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Total Pesanan</h3>
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          {tahun}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="label" innerRadius={45} outerRadius={70} paddingAngle={2}>
                {data.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, borderColor: "#e2e8f0" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{total}</span>
            <span className="text-[10px] text-slate-400">Total</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {data.map((entry) => (
            <div key={entry.label} className="flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="font-medium text-slate-600 dark:text-slate-300">{entry.label}</span>
              <span className="ml-auto font-bold text-slate-900 dark:text-slate-100">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LayananVendorCard({ item }) {
  const Icon = ICON_BY_KEY[item.key] ?? Package;
  return (
    <div className="rounded-2xl border bg-white p-3.5 shadow-sm dark:bg-slate-900" style={{ borderColor: `${item.color}33` }}>
      <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ backgroundColor: `${item.color}1a`, color: item.color }}>
        <Icon size={16} />
      </div>
      <p className="mt-2.5 text-xl font-extrabold text-slate-900 dark:text-slate-100">{item.value}</p>
      <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
    </div>
  );
}

function KeuanganCard({ icon: Icon, label, value, tone }) {
  const toneMap = {
    indigo: { bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-600 dark:text-indigo-400" },
    red: { bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-500 dark:text-rose-400" },
    amber: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-600 dark:text-amber-400" },
  };
  const t = toneMap[tone] ?? toneMap.indigo;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.bg} ${t.text}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{label}</p>
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{value}</p>
      </div>
    </div>
  );
}

function PembayaranLayananCard({ data }) {
  const series = [
    { key: "pickup", label: "Pick up", color: "#818cf8" },
    { key: "kendaraan", label: "Kendaraan", color: "#38bdf8" },
    { key: "konstruksi", label: "Konstruksi", color: "#f43f5e" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Pembayaran Berdasarkan Layanan</h3>
          <div className="mt-2 flex gap-4">
            {series.map((s) => (
              <LegendDot key={s.key} color={s.color} label={s.label} />
            ))}
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
        >
          Bulan
          <ChevronDown size={12} />
        </button>
      </div>

      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, borderColor: "#e2e8f0" }} />
            {series.map((s) => (
              <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2} fill={`url(#grad-${s.key})`} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}