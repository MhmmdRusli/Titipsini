# Titipsini Web App

Web app untuk Titipsini.com — Dashboard Admin (`/admin`) dan Web App Pelanggan (`/app`),
1 project Laravel, dibedakan lewat route prefix + role middleware.

## Stack

- Laravel 11
- Inertia.js (React adapter) — routing tetap di Laravel, tampilan pakai React, tanpa perlu bikin REST API terpisah
- React 18
- Tailwind CSS 3
- Vite

## Struktur Folder Penting

```
app/Http/Controllers/Admin/       -> controller khusus admin
app/Http/Controllers/Customer/    -> controller khusus pelanggan
app/Http/Middleware/EnsureUserHasRole.php   -> proteksi role (alias: "role")

routes/web.php                    -> route group /admin, /app, /mitra

resources/js/Layouts/AdminLayout.jsx      -> sidebar layout utk /admin/*
resources/js/Layouts/CustomerLayout.jsx   -> topnav layout utk /app/*
resources/js/Pages/Admin/                 -> halaman React utk admin
resources/js/Pages/Customer/              -> halaman React utk pelanggan
resources/js/Pages/Auth/                  -> login (shared, redirect otomatis by role)
```

## Cara Menjalankan (di komputer kamu, butuh PHP 8.2+, Composer, Node 18+, MySQL)

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate

# atur DB_* di .env sesuai MySQL lokal kamu, lalu:
php artisan migrate --seed

# jalankan dua terminal terpisah:
php artisan serve
npm run dev
```

Akun contoh dari seeder (password semua: `password`):

| Role     | Email                   |
|----------|--------------------------|
| Admin    | admin@titipsini.test     |
| Customer | customer@titipsini.test  |
| Partner  | partner@titipsini.test   |

Login lewat `/login` — sistem otomatis redirect:
- `role = admin`    -> `/admin/dashboard`
- `role = customer` -> `/app/dashboard`
- `role = partner`  -> `/mitra/dashboard`

## Menambah Halaman/Modul Baru

Acuan lengkap modul ada di dokumen **Daftar Modul Aplikasi & SRS** (Bab 3 & 4). Pola yang dipakai konsisten:

1. Tambahkan route di `routes/web.php` dalam group yang sesuai (`admin.` / `customer.`).
2. Buat Controller di `app/Http/Controllers/Admin/` atau `Customer/`, return `Inertia::render('Admin/NamaHalaman', [...])`.
3. Buat file React di `resources/js/Pages/Admin/NamaHalaman.jsx`, bungkus dengan `<AdminLayout>` atau `<CustomerLayout>`.

Contoh sudah tersedia di `DashboardController` + `Dashboard.jsx` masing-masing role — tinggal duplikasi polanya.

## Catatan

- Package `inertiajs/inertia-laravel`, `tightenco/ziggy`, dan `laravel/sanctum` sudah masuk `composer.json` — otomatis ter-install saat `composer install`.
- `config/*.php`, `bootstrap/providers.php`, `public/index.php`, `app/Providers/AppServiceProvider.php` diambil langsung dari skeleton resmi Laravel 11 (branch `11.x`), jadi strukturnya valid dan konsisten dengan `composer.json` (`laravel/framework ^11.0`).
- Belum menjalankan `composer install` / `npm install` di sisi saya (Claude) karena environment kerja saya tidak punya PHP/Composer. Sudah saya susun selengkap dan seakurat mungkin, tapi tetap tes dulu di komputer kamu sebelum lanjut develop fitur — kabari saya kalau ada error lain yang muncul.
- Kalau nanti mau menambah modul CSR (Controller-Service-Repository) seperti project Stockify, tinggal bilang — saya bisa generate Service + Repository interface untuk tiap modul.

## Troubleshooting

**`Could not open input file: artisan`** saat `composer install` → file `artisan` hilang. Sudah diperbaiki di versi ZIP ini (skeleton lengkap sudah disertakan).

Kalau masih ada file Laravel inti yang hilang/error lain, cara paling aman: buat project Laravel kosong terpisah (`composer create-project laravel/laravel nama-lain "11.*"`), lalu timpa/salin folder `app/`, `routes/`, `resources/`, `database/`, `bootstrap/app.php`, `tailwind.config.js`, `vite.config.js` dari ZIP ini ke project baru tsb, lalu gabungkan isi `composer.json` dan `package.json`-nya.
