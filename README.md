# 🏷️ Titipsini Web App

Web app untuk **Titipsini.com** — platform penitipan barang, kendaraan, dan properti, sekaligus jasa pindahan.

Project ini terdiri dari **3 area** dalam satu aplikasi Laravel:

| Area | Prefix Route | Untuk |
|---|---|---|
| 🛠️ Admin Panel | `/admin` | Pengelola platform |
| 📱 Web App Pelanggan | `/app` | Customer |
| 🤝 Web App Mitra | `/mitra` | Vendor/Partner |

Ketiganya dibedakan lewat **route prefix + role middleware**, bukan project terpisah.

---

## ⚙️ Stack

| Layer | Teknologi |
|---|---|
| Backend | Laravel 11 |
| Bridge | Inertia.js (React adapter) — routing tetap di Laravel, tampilan pakai React, **tanpa perlu bikin REST API terpisah** |
| Frontend | React 18 |
| Styling | Tailwind CSS 3 |
| Build tool | Vite |

---

## 📁 Struktur Folder Penting

```
app/Http/Controllers/Admin/                -> controller khusus admin
app/Http/Controllers/Customer/             -> controller khusus pelanggan
app/Http/Controllers/Partner/              -> controller khusus mitra
app/Http/Middleware/EnsureUserHasRole.php  -> proteksi role (alias: "role")

routes/web.php                             -> route group /admin, /app, /mitra

resources/js/Layouts/AdminLayout.jsx       -> sidebar layout utk /admin/*
resources/js/Layouts/CustomerLayout.jsx    -> mobile layout utk /app/*
resources/js/Layouts/PartnerLayout.jsx     -> mobile layout utk /mitra/*

resources/js/Pages/Admin/                  -> halaman React utk admin
resources/js/Pages/Customer/               -> halaman React utk pelanggan
resources/js/Pages/Partner/                -> halaman React utk mitra
resources/js/Pages/Auth/                   -> login customer (shared, redirect otomatis by role)
```

---

## 🚀 Cara Menjalankan

**Kebutuhan:** PHP 8.2+, Composer, Node 18+, MySQL

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate

# atur DB_* di .env sesuai MySQL lokal kamu, lalu:
php artisan migrate --seed
```

Jalankan di **dua terminal terpisah**:

```bash
php artisan serve
```
```bash
npm run dev
```

### 🔑 Akun Contoh dari Seeder

| Role | Email | Password |
|---|---|---|
| Admin | `admin@titipsini.test` | `password` |
| Customer | `customer@titipsini.test` | `password` |
| Partner | `partner@titipsini.test` | `password` |

Login lewat `/login` — sistem otomatis redirect sesuai role:

- `admin` → `/admin/dashboard`
- `customer` → `/app/dashboard`
- `partner` → `/mitra/dashboard`

---

## 🧩 Menambah Halaman/Modul Baru

> Acuan lengkap modul ada di dokumen **Daftar Modul Aplikasi & SRS** (Bab 3 & 4).

Polanya konsisten untuk semua area, tinggal disesuaikan folder/prefix-nya:

1. Tambahkan route di `routes/web.php`, di dalam group yang sesuai (`admin.` / `customer.` / `partner.`).
2. Buat Controller di `app/Http/Controllers/{Admin|Customer|Partner}/`, return:
   ```php
   return Inertia::render('Admin/NamaHalaman', [...]);
   ```
3. Buat file React di `resources/js/Pages/{Admin|Customer|Partner}/NamaHalaman.jsx`, bungkus dengan layout yang sesuai (`<AdminLayout>`, `<CustomerLayout>`, atau `<PartnerLayout>`).

💡 Contoh referensi yang sudah jadi: `DashboardController` + `Dashboard.jsx` di masing-masing role — tinggal duplikasi polanya.

---

## 📝 Catatan

- Package `inertiajs/inertia-laravel`, `tightenco/ziggy`, dan `laravel/sanctum` sudah masuk `composer.json` — otomatis ter-install saat `composer install`.
- `config/*.php`, `bootstrap/providers.php`, `public/index.php`, `app/Providers/AppServiceProvider.php` diambil langsung dari skeleton resmi Laravel 11 (branch `11.x`), jadi strukturnya valid dan konsisten dengan `composer.json` (`laravel/framework ^11.0`).
- Install 'composer install/npm install' agar bisa di riview
---

## 🛠️ Troubleshooting

<details>
<summary><code>Could not open input file: artisan</code> saat <code>composer install</code></summary>

File `artisan` hilang. Sudah diperbaiki di versi ZIP ini (skeleton lengkap sudah disertakan).

Kalau masih ada file Laravel inti yang hilang/error lain, cara paling aman:

1. Buat project Laravel kosong terpisah:
   ```bash
   composer create-project laravel/laravel nama-lain "11.*"
   ```
2. Timpa/salin folder `app/`, `routes/`, `resources/`, `database/`, `bootstrap/app.php`, `tailwind.config.js`, `vite.config.js` dari ZIP ini ke project baru tersebut.
3. Gabungkan isi `composer.json` dan `package.json`-nya.

</details>
