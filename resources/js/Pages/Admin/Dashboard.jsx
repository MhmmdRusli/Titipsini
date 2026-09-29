import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Package,
  Users,
  Handshake,
  Activity,
  Box,
  Car,
  Building2,
  Truck,
  Wallet,
  MapPin,
  Calendar,
  Sparkles,
  ChevronDown,
  Trophy,
  CalendarDays,
  TrendingUp,
  Repeat,
} from "lucide-react";

// --- Warna Chart & Accents (sama dengan Super Admin) ---
const COLOR_BARANG = "#6366f1"; // Indigo 500
const COLOR_PICKUP = "#0284c7"; // Sky 600
const COLOR_KENDARAAN = "#d97706"; // Amber 600
const COLOR_BANGUNAN = "#e11d48"; // Rose 600
const COLOR_EMPTY = "#e2e8f0"; // Slate 200

const COLOR_PINDAHAN = "#0d9488"; // Teal 600

// Cadangan untuk jenis layanan baru yang belum dikenali (tidak sama dengan warna di atas)
const EXTRA_COLORS = ["#8b5cf6", "#64748b", "#65a30d", "#db2777"];

const PERIOD_OPTIONS = [
  { value: "all", label: "Semua Waktu" },
  { value: "month", label: "Bulan Ini" },
  { value: "quarter", label: "3 Bulan Terakhir" },
  { value: "year", label: "Tahun Ini" },
];

const TOOLTIP_STYLE = { borderRadius: 12, fontSize: 12, borderColor: "#e2e8f0" };

// Mencocokkan service_type dari backend ke label + warna yang konsisten
function resolveService(type) {
  const key = String(type ?? "").toLowerCase().replace(/[^a-z]/g, "");
  if (key.includes("pindah")) return { label: "Pindahan", color: COLOR_PINDAHAN };
  if (key.includes("barang")) return { label: "Barang", color: COLOR_BARANG };
  if (key.includes("pickup") || key.includes("antar")) return { label: "Pick Up", color: COLOR_PICKUP };
  if (key.includes("kendaraan")) return { label: "Kendaraan", color: COLOR_KENDARAAN };
  if (key.includes("bangunan")) return { label: "Bangunan", color: COLOR_BANGUNAN };
  return { label: String(type ?? "Lainnya"), color: null };
}

// Menyusun data pie dan menjamin tidak ada dua layanan dengan warna yang sama
function buildServiceItems(data = []) {
  const used = new Set();
  return data.map((d) => {
    const meta = resolveService(d.service_type);
    let color = meta.color;
    if (!color || used.has(color)) {
      color = EXTRA_COLORS.find((c) => !used.has(c)) ?? "#94a3b8";
    }
    used.add(color);
    return { label: meta.label, color, value: Number(d.total ?? 0) };
  });
}

function formatDecimal(value) {
  return Number(value ?? 0).toLocaleString("id-ID", { maximumFractionDigits: 1 });
}

function formatRupiah(value) {
  return `Rp${Number(value ?? 0).toLocaleString("id-ID")}`;
}

export default function Dashboard({
  summary = {},
  monthlyTrend = [],
  serviceDistribution = [],
  vendorServiceCounts = {},
  cities = [],
  filters = {},
}) {
  const [city, setCity] = useState(filters.city ?? "");
  const [period, setPeriod] = useState(filters.period ?? "all");
  const { props } = usePage();
  const adminName = props.auth?.user?.name;

  const applyFilters = (nextCity, nextPeriod) => {
    router.get(
      "/admin/dashboard",
      { city: nextCity || undefined, period: nextPeriod },
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };

  const periodLabel = PERIOD_OPTIONS.find((p) => p.value === period)?.label ?? "Semua Waktu";

  const cityOptions = [{ value: "", label: "Semua Kota" }, ...cities.map((c) => ({ value: c, label: c }))];

  // Isi `href` dengan route halaman detail admin bila tersedia, contoh: "/admin/pesanan"
  const stats = [
    {
      label: `Komisi Platform (${summary.persenKomisi ?? 10}%)`,
      value: formatRupiah(summary.totalKomisiAdmin),
      icon: Wallet,
      iconColor: "text-emerald-600",
      badgeBg: "bg-emerald-50 dark:bg-emerald-950/50",
      isCurrency: true,
      href: undefined,
    },
    {
      label: "Total Pesanan",
      value: summary.totalOrders,
      icon: Package,
      iconColor: "text-indigo-500",
      badgeBg: "bg-indigo-50 dark:bg-indigo-950/50",
      href: undefined,
    },
    {
      label: "Total Pelanggan",
      value: summary.totalCustomers,
      icon: Users,
      iconColor: "text-sky-500",
      badgeBg: "bg-sky-50 dark:bg-sky-950/50",
      href: undefined,
    },
    {
      label: "Total Vendor",
      value: summary.totalVendors,
      icon: Handshake,
      iconColor: "text-amber-500",
      badgeBg: "bg-amber-50 dark:bg-amber-950/50",
      href: undefined,
    },
    {
      label: "Layanan Aktif Berjalan",
      value: summary.activeServices,
      icon: Activity,
      iconColor: "text-rose-500",
      badgeBg: "bg-rose-50 dark:bg-rose-950/50",
      href: undefined,
    },
  ];

  const serviceItems = buildServiceItems(serviceDistribution);
  const serviceTotal = serviceItems.reduce((sum, d) => sum + d.value, 0);
  const topService = serviceTotal > 0 ? [...serviceItems].sort((a, b) => b.value - a.value)[0] : null;

  const trendTotals = monthlyTrend.map((m) => ({ month: m.month, total: Number(m.total ?? 0) }));
  const trendSum = trendTotals.reduce((sum, m) => sum + m.total, 0);
  const peakMonth = trendSum > 0 ? trendTotals.reduce((best, m) => (m.total > best.total ? m : best)) : null;
  const avgPerMonth = trendTotals.length ? trendSum / trendTotals.length : 0;
  const ordersPerCustomer = Number(summary.totalCustomers) > 0 ? Number(summary.totalOrders ?? 0) / Number(summary.totalCustomers) : 0;

  const sorotan = [
    {
      icon: Trophy,
      color: topService?.color ?? COLOR_KENDARAAN,
      label: "Layanan terpopuler",
      value: topService ? topService.label : "-",
      note: topService ? `${Math.round((topService.value / serviceTotal) * 100)}% dari seluruh pesanan` : "Belum ada pesanan",
    },
    {
      icon: CalendarDays,
      color: COLOR_PICKUP,
      label: "Bulan tersibuk",
      value: peakMonth ? peakMonth.month : "-",
      note: peakMonth ? `${peakMonth.total.toLocaleString("id-ID")} pesanan` : "Belum ada pesanan",
    },
    {
      icon: TrendingUp,
      color: COLOR_BARANG,
      label: "Rata-rata per bulan",
      value: formatDecimal(avgPerMonth),
      note: "pesanan setiap bulan",
    },
    {
      icon: Repeat,
      color: COLOR_BANGUNAN,
      label: "Frekuensi pemesanan",
      value: formatDecimal(ordersPerCustomer),
      note: "pesanan per pelanggan",
    },
  ];

  const layananVendor = [
    { key: "barang", label: "Penitipan Barang", icon: Box, color: COLOR_BARANG },
    { key: "bangunan", label: "Penitipan Bangunan", icon: Building2, color: COLOR_BANGUNAN },
    { key: "pickup", label: "Antar-Jemput", icon: Truck, color: COLOR_PICKUP },
    { key: "kendaraan", label: "Penitipan Kendaraan", icon: Car, color: COLOR_KENDARAAN },
  ].map((item) => ({ ...item, value: vendorServiceCounts[item.key] ?? 0 }));

  return (
    <AdminLayout title="Dashboard">
      <Head title="Dashboard Admin" />

      {/* Banner Hijau */}
      <div className="relative overflow-hidden rounded-2xl bg-[#007b49] p-6 text-white shadow-md">
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-xl" />
        <div className="pointer-events-none absolute -bottom-12 right-24 h-48 w-48 rounded-full bg-white/5 blur-lg" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 backdrop-blur-sm">
              <Sparkles size={13} />
              <span>ADMIN DASHBOARD</span>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              {adminName ? `Halo, ${adminName}` : "Halo, Selamat Datang di Dashboard Admin"}
            </h1>
            <p className="mt-1 text-xs text-emerald-100 md:text-sm">
              Pantau performa vendor, pesanan aktif, dan statistik layanan dari seluruh wilayah.
            </p>
          </div>

          {/* Filter Dropdown Berbentuk Kapsul */}
          <div className="flex items-center rounded-xl border border-white/30 bg-white/10 p-1 backdrop-blur-md">
            <BannerSelect
              icon={MapPin}
              label="Filter kota"
              value={city}
              options={cityOptions}
              divider
              onChange={(val) => {
                setCity(val);
                applyFilters(val, period);
              }}
            />
            <BannerSelect
              icon={Calendar}
              label="Filter periode"
              value={period}
              options={PERIOD_OPTIONS}
              onChange={(val) => {
                setPeriod(val);
                applyFilters(city, val);
              }}
            />
          </div>
        </div>
      </div>

      {/* Kartu Statistik */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s, i) => (
          <div key={s.label} className={i === 0 ? "col-span-2 lg:col-span-1" : ""}>
            <StatCard {...s} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <ChartTrenCard data={monthlyTrend} periodLabel={periodLabel} city={city} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <DistribusiLayananCard items={serviceItems} periodLabel={periodLabel} />

          <div className="flex flex-col lg:col-span-1">
            <SectionLabel>Layanan Vendor</SectionLabel>
            <div className="mt-3 grid flex-1 auto-rows-fr grid-cols-2 gap-3">
              {layananVendor.map((item) => (
                <LayananVendorCard key={item.key} item={item} />
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:col-span-1">
            <SectionLabel>Sorotan Data</SectionLabel>
            <SorotanCard rows={sorotan} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ---------------------------------------------------------------- */
/* Komponen                                                          */
/* ---------------------------------------------------------------- */

function BannerSelect({ icon: Icon, label, value, options, onChange, divider = false }) {
    return (
        <div className={`relative flex items-center px-3 py-1.5 ${divider ? "border-r border-white/20" : ""}`}>
            <Icon size={14} className="mr-2 text-amber-300" />
            <select
                aria-label={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="cursor-pointer appearance-none rounded-md border-none pr-5 text-xs font-semibold shadow-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-amber-300 filter-dropdown"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-white text-gray-900 dark:bg-[#007b49] dark:text-white">
                        {opt.label}
                    </option>
                ))}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2 text-white/80" />
        </div>
    );
}

function StatCard({ label, value, icon: Icon, iconColor, badgeBg, href, isCurrency = false }) {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <Icon
        size={100}
        strokeWidth={1}
        className={`pointer-events-none absolute -bottom-5 -right-5 opacity-10 ${iconColor} dark:opacity-20`}
      />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${badgeBg} ${iconColor}`}>
            <Icon size={18} />
          </div>
        </div>

        <div className="mt-3">
          <p
            className={`font-black tracking-tight text-slate-900 dark:text-white ${
              isCurrency ? "break-words text-xl md:text-2xl" : "text-2xl md:text-3xl"
            }`}
          >
            {isCurrency ? value : Number(value ?? 0).toLocaleString("id-ID")}
          </p>
        </div>

        {href && (
          <div className="mt-4 border-t border-slate-100 pt-2 dark:border-slate-800">
            <Link
              href={href}
              className={`inline-flex items-center gap-1 text-[11px] font-bold ${iconColor} hover:underline`}
            >
              Lihat Detail
              <ChevronDown size={12} className="-rotate-90" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{children}</h3>;
}

function Chip({ children }) {
  return (
    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
      {children}
    </span>
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

function ChartTrenCard({ data, periodLabel, city }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Tren Pesanan Bulanan</h3>
        <div className="flex items-center gap-2">
          {city && <Chip>{city}</Chip>}
          <Chip>{periodLabel}</Chip>
        </div>
      </div>

      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Line
              type="monotone"
              dataKey="total"
              name="Pesanan"
              stroke={COLOR_BARANG}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <LegendDot color={COLOR_BARANG} label="Pesanan Masuk" />
      </div>
    </div>
  );
}

function DistribusiLayananCard({ items, periodLabel }) {
  const total = items.reduce((sum, d) => sum + d.value, 0);
  const isEmpty = total === 0;
  const chartData = isEmpty ? [{ label: "Belum ada data", value: 1, color: COLOR_EMPTY }] : items;
  const percent = (value) => (total ? Math.round((value / total) * 100) : 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Distribusi Layanan</h3>
        <Chip>{periodLabel}</Chip>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="label" innerRadius={45} outerRadius={70} paddingAngle={2}>
                {chartData.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              {!isEmpty && (
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value, name) => [`${value} (${percent(value)}%)`, name]}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{total}</span>
            <span className="text-[10px] text-slate-400">Total</span>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          {items.length === 0 && (
            <p className="text-xs text-slate-400 dark:text-slate-500">Belum ada pesanan pada periode ini.</p>
          )}
          {items.map((entry) => (
            <div key={entry.label} className="flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="truncate font-medium text-slate-600 dark:text-slate-300">{entry.label}</span>
              <span className="ml-auto font-bold text-slate-900 dark:text-slate-100">{entry.value}</span>
              <span className="w-8 text-right text-[10px] text-slate-400">{percent(entry.value)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LayananVendorCard({ item }) {
  const Icon = item.icon;
  return (
    <div
      className="rounded-2xl border bg-white p-3.5 shadow-sm dark:bg-slate-900"
      style={{ borderColor: `${item.color}33` }}
    >
      <div
        className="flex h-8 w-8 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${item.color}1a`, color: item.color }}
      >
        <Icon size={16} />
      </div>
      <p className="mt-2.5 text-xl font-extrabold text-slate-900 dark:text-slate-100">{item.value}</p>
      <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
    </div>
  );
}

function SorotanCard({ rows }) {
  return (
    <div className="mt-3 flex flex-1 flex-col rounded-2xl border border-slate-200 bg-white px-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-1 flex-col divide-y divide-slate-100 dark:divide-slate-800">
        {rows.map(({ icon: Icon, color, label, value, note }) => (
          <div key={label} className="flex flex-1 items-center gap-3 py-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${color}1a`, color }}
            >
              <Icon size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{label}</p>
              <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{value}</p>
            </div>
            <p className="max-w-[45%] text-right text-[11px] font-medium leading-snug text-slate-500 dark:text-slate-400">
              {note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}