<?php

app('router')->setCompiledRoutes(
    array (
  'compiled' => 
  array (
    0 => false,
    1 => 
    array (
      '/sanctum/csrf-cookie' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'sanctum.csrf-cookie',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/internal/login' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'generated::XhSpBliO2lOdhEvA',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/internal/logout' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'generated::qdUWIDYem2nTeZJU',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/internal/me' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'generated::w0M6kWO8Yjlxp42X',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/internal/finance/dashboard' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'generated::LBTwmESmzF35yJbj',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/cities' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'generated::NWUhsfHESy5vrLqO',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/up' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'generated::3cF9oody0kqkYrrE',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'welcome',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mulai' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'onboarding',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/login' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'login',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'generated::3OkSKq5d326kPeLA',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/register' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'register',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'generated::MLuJA1cNHjrGhLzo',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/forgot-password' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'password.email.form',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'password.email.send',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/forgot-password/verify' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'password.verify.form',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'password.verify',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/forgot-password/reset' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'password.reset.form',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'password.reset',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/logout' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'logout',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/admin/login' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.login',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admin.',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/admin/forgot-password' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.password.request',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admin.password.email',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/admin/reset-password' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.password.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.onboarding',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/masuk' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.login',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.login.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/login' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.login.alias',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/daftar' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.register',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/lupa-password' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.password.request',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.password.email',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/reset-password' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.password.update',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/verifikasi-email' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.verify-email.notice',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/verifikasi-email/kirim-ulang' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.verify-email.send',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/registrasi-sukses' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.register.success',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/finance/dashboard' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'finance.dashboard',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/finance/profil' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'finance.profil.edit',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'finance.profil.update',
          ),
          1 => NULL,
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/finance/topup' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'finance.topup.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/finance/pendapatan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'finance.pendapatan.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/finance/penarikan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'finance.penarikan.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/finance/qris' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'finance.qris.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'finance.qris.update',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        2 => 
        array (
          0 => 
          array (
            '_route' => 'finance.qris.destroy',
          ),
          1 => NULL,
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/finance/orders' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'finance.orders.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/finance/pengembalian-dana' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'finance.pengembalian-dana.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/dashboard' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.dashboard',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/pengembalian-dana' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pengembalian-dana.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/penarikan-saldo' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.penarikan-saldo.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/total-transaksi' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.total-transaksi.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/laporan-layanan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.laporan-layanan.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/pengaturan/keamanan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pengaturan.keamanan.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pengaturan.keamanan.update',
          ),
          1 => NULL,
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/pengaturan/komisi' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pengaturan.komisi.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pengaturan.komisi.update',
          ),
          1 => NULL,
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/pengaturan/denda' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pengaturan.denda.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pengaturan.denda.update',
          ),
          1 => NULL,
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/pengaturan/qris' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pengaturan.qris.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pengaturan.qris.update',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        2 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pengaturan.qris.destroy',
          ),
          1 => NULL,
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/admin/dashboard' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.dashboard',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/admin/laporan-validasi' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.laporan-validasi.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/admin/klaim' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.klaim.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/admin/pengguna' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.pengguna.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/admin/partners' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.partners.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/admin/profil' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.profil.edit',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admin.profil.update',
          ),
          1 => NULL,
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/admin/pengaturan/keamanan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.pengaturan.keamanan',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admin.pengaturan.keamanan.update',
          ),
          1 => NULL,
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/admin/berita' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.berita.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admin.berita.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/admin/kota' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.kota.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admin.kota.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/admin/faq' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.faq.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admin.faq.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/admin/orders' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.orders.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/admin/orders/bulk-delete' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.orders.bulkDestroy',
          ),
          1 => NULL,
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/admin/reports' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.reports.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/admin/reports/export' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.reports.export',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/dashboard' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.dashboard',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/notifikasi' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.notifikasi.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/notifikasi/tandai-semua' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.notifikasi.readAll',
          ),
          1 => NULL,
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/profil' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.profil.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/profil/saya' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.profil.edit',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.profil.update',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/pesanan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.orders.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/alamat' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.alamat.edit',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.alamat.update',
          ),
          1 => NULL,
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/layanan/jam-operasional' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.jam-operasional.edit',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.jam-operasional.update',
          ),
          1 => NULL,
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/legalitas' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.legalitas.edit',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.legalitas.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/legalitas/pin' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.legalitas.pin.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/layanan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.layanan.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.layanan.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/rekening' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.rekening.edit',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.rekening.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/penarikan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.penarikan.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/penarikan/tarik' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.penarikan.create',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.penarikan.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/pendapatan/penarikan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.pendapatan.penarikan.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.pendapatan.penarikan.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/pendapatan/penarikan/tarik' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.pendapatan.penarikan.create',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/keamanan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.keamanan.edit',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.keamanan.update',
          ),
          1 => NULL,
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/keamanan/pin' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.keamanan.pin.update',
          ),
          1 => NULL,
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/keamanan/pin/lupa' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.keamanan.pin.lupa',
          ),
          1 => NULL,
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/kebijakan-privasi' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.kebijakan-privasi.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/bantuan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.bantuan.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/pendapatan/riwayat' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.pendapatan.riwayat',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/ditangguhkan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.suspended.notice',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/mitra/ajukan-pemulihan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.request.restoration',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/dashboard' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.dashboard',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/services' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/services/barang/paket-pilihan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.barang.pilihPaket',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/services/barang/landing' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.barang.landing',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/services/barang/search' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.barang.search',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/services/barang' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.barang.form',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.barang.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/services/bangunan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.bangunan.form',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.bangunan.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/services/bangunan/search' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.bangunan.search',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/services/bangunan/pesan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.bangunan.form.pesan',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/services/pindahan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.pindahan.form',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/services/pindahan/search' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.pindahan.search',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/services/kendaraan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.kendaraan.form',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.kendaraan.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/services/kendaraan/search' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.kendaraan.search',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/services/kendaraan/pesan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.kendaraan.form.pesan',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/berita' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.berita.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/orders' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/notifikasi' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.notifikasi.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/profile' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.update',
          ),
          1 => NULL,
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/profile/edit' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.edit',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/profile/bantuan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.bantuan',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/profile/tentang' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.tentang',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/profile/tentang/syarat-ketentuan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.tentang.syarat',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/profile/tentang/kebijakan-privasi' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.tentang.privasi',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/profile/keamanan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.keamanan',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/profile/keamanan/password' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.keamanan.password.edit',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.keamanan.password',
          ),
          1 => NULL,
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/profile/keamanan/pin' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.keamanan.pin.edit',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.keamanan.pin',
          ),
          1 => NULL,
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/profile/alamat' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.alamat.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.alamat.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/profile/alamat/tambah' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.alamat.create',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/saldo/topup' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.topup.create',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'customer.topup.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/app/saldo/riwayat' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.topup.riwayat',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/lengkapi-data' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.lengkapi-data.intro',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'customer.lengkapi-data.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/lengkapi-data/form' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.lengkapi-data.form',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/wilayah/provinces' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'generated::1WL36yKz8qlUiNIi',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/buat-pin' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.pin.create',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'customer.pin.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/kota' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.kota.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.kota.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/layanan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.layanan.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/profil' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.profil.edit',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.profil.update',
          ),
          1 => NULL,
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/profil/avatar' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.profil.avatar.update',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/user/customer' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.user.customer.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/user/vendor' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.user.vendor.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/user/finance' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.user.finance.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/user/admin' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.user.admin.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/user/tambah' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.user.create',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.user.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/pesanan' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pesanan.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/pesanan/bulk-delete' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pesanan.bulkDestroy',
          ),
          1 => NULL,
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/super-admin/sampah' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.sampah.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
    ),
    2 => 
    array (
      0 => '{^(?|/a(?|dmin/(?|re(?|set\\-password/([^/]++)(*:47)|ports/([^/]++)(?|(*:71)|/(?|suspend(*:89)|restore(*:103)|penangguhan(*:122))))|laporan\\-validasi/([^/]++)(?|(*:162)|/(?|approve(*:181)|reject(*:195)))|k(?|laim/([^/]++)(?|(*:225)|/(?|mulai\\-pemeriksaan(*:255)|se(?|tujui(*:273)|ngketa(*:287))|tolak(*:301)))|ota/([^/]++)(?|(*:326)))|p(?|eng(?|guna/([^/]++)(?|(*:362)|/status(*:377))|aturan/keamanan/sessions/([^/]++)(*:419))|artners/(?|([^/]++)(?|(*:450)|/(?|s(?|tatus(*:471)|ervices/([^/]++)/status(*:502))|restore(*:518)))|bulk\\-destroy(*:541)|([^/]++)(*:557)))|berita/([^/]++)(?|(*:585))|faq/([^/]++)(?|(*:609))|orders/([^/]++)(?|/(?|status(*:646)|approve\\-denda(*:668)|lapor(?|(*:684))|konfirmasi\\-cash(*:709)|verify\\-payment(*:732)|reject\\-payment(*:755)|cancel\\-order(*:776))|(*:785)))|p(?|p/(?|s(?|ervices/(?|ba(?|rang/([^/]++)/(?|detail(*:847)|invoice(*:862))|ngunan/([^/]++)/(?|detail(*:896)|titip(*:909)|invoice(*:924)))|pindahan/([^/]++)/(?|detail(*:961)|invoice(*:976)|titip(*:989))|kendaraan/([^/]++)/(?|detail(*:1026)|titip(*:1040)|invoice(*:1056))|([^/]++)(?|(*:1077)|/(?|pesan(*:1095)|metode\\-pembayaran(*:1122)|konfirmasi(*:1141))))|aldo/topup/([^/]++)/(?|instruksi(*:1185)|konfirmasi(*:1204)|menunggu(*:1221)|sukses(*:1236)))|berita/([^/]++)(*:1262)|orders/([^/]++)(?|(*:1289)|/(?|b(?|a(?|talkan(*:1316)|yar\\-(?|saldo(*:1338)|denda(*:1352)))|ukti\\-pembayaran(*:1379))|review(*:1395)|ajukan\\-pengambilan(*:1423)|lapor(?|(*:1440))|sukses(*:1456)|pembayaran(*:1475)|upload\\-bukti(?|(*:1500)|\\-denda(*:1516))|extend(?|(*:1535)|/(?|invoice(*:1555)|bayar\\-saldo(*:1576)|upload\\-bukti(*:1598)))|klaim(?|(*:1617))))|klaim/([^/]++)(*:1643)|notifikasi/([^/]++)/read(*:1676)|profile/alamat/([^/]++)(?|/edit(*:1716)|(*:1725)))|i/wilayah/(?|regencies/([^/]++)(*:1767)|districts/([^/]++)(*:1794))))|/mitra/(?|re(?|set\\-password/([^/]++)(*:1843)|kening/([^/]++)(?|(*:1870)|/verifikasi(?|(*:1893)|/k(?|irim\\-ulang(*:1918)|onfirmasi(*:1936)))))|verifikasi\\-email/([^/]++)/([^/]++)(*:1984)|notifikasi/([^/]++)/read(*:2017)|pe(?|sanan/([^/]++)(?|(*:2048)|/(?|verifikasi\\-(?|pe(?|mbayaran(*:2089)|rpanjangan(*:2108))|denda(*:2123))|ambil(*:2138)|t(?|olak(*:2155)|andai\\-dititip(*:2178))|serahkan(*:2196)|fase(*:2209)))|n(?|arikan/([^/]++)/sukses(*:2246)|dapatan/penarikan/([^/]++)/sukses(*:2288)))|layanan/(?|([^/]++)(?|(*:2321)|/toggle\\-aktif(*:2344))|ba(?|rang(*:2363)|ngunan(*:2378))|kendaraan(*:2397)|pindahan(*:2414)|([^/]++)(?|/fitur\\-penuh(*:2447)|(*:2456))))|/finance/(?|topup/([^/]++)(?|(*:2497)|/(?|approve(*:2517)|reject(*:2532)))|pen(?|arikan/([^/]++)/(?|approve(*:2575)|reject(*:2590))|gembalian\\-dana/([^/]++)/(?|setujui(*:2635)|tolak(*:2649)))|orders/([^/]++)/(?|verify\\-payment(*:2694)|reject\\-payment(*:2718)))|/s(?|uper\\-admin/(?|la(?|poran\\-layanan/([^/]++)(?|(*:2780)|/status(*:2796))|yanan/([^/]++)(?|(*:2823)|/(?|status(*:2842)|toggle\\-active(*:2865))|(*:2875)))|p(?|e(?|ngembalian\\-dana/([^/]++)/(?|setujui(*:2930)|tolak(*:2944))|sanan/([^/]++)(?|/(?|status(*:2981)|approve\\-denda(*:3004)|konfirmasi\\-cash(*:3029)|cancel\\-order(*:3051))|(*:3061)))|rofil/sesi/([^/]++)(*:3091))|kota/([^/]++)(?|(*:3117))|user/(?|customer/([^/]++)(?|(*:3155)|/status(*:3171))|vendor/([^/]++)(?|(*:3199)|/(?|s(?|tatus(*:3221)|ervices/([^/]++)/status(*:3253))|restore(*:3270)))|finance/([^/]++)(*:3297)|admin/([^/]++)(*:3320)|([^/]++)(?|/toggle\\-active(*:3355)|(*:3364)))|sampah/([^/]++)/([^/]++)(?|/restore(*:3410)|(*:3419)))|torage/(.*)(*:3441)))/?$}sDu',
    ),
    3 => 
    array (
      47 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.password.reset',
          ),
          1 => 
          array (
            0 => 'token',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      71 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.reports.show',
          ),
          1 => 
          array (
            0 => 'report',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      89 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.reports.suspend',
          ),
          1 => 
          array (
            0 => 'report',
          ),
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      103 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.reports.restore',
          ),
          1 => 
          array (
            0 => 'report',
          ),
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      122 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.reports.penangguhan',
          ),
          1 => 
          array (
            0 => 'report',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      162 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.laporan-validasi.show',
          ),
          1 => 
          array (
            0 => 'report',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      181 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.laporan-validasi.approve',
          ),
          1 => 
          array (
            0 => 'report',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      195 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.laporan-validasi.reject',
          ),
          1 => 
          array (
            0 => 'report',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      225 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.klaim.show',
          ),
          1 => 
          array (
            0 => 'claim',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      255 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.klaim.mulaiPemeriksaan',
          ),
          1 => 
          array (
            0 => 'claim',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      273 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.klaim.setujui',
          ),
          1 => 
          array (
            0 => 'claim',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      287 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.klaim.sengketa',
          ),
          1 => 
          array (
            0 => 'claim',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      301 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.klaim.tolak',
          ),
          1 => 
          array (
            0 => 'claim',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      326 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.kota.update',
          ),
          1 => 
          array (
            0 => 'kotum',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admin.kota.destroy',
          ),
          1 => 
          array (
            0 => 'kotum',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      362 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.pengguna.show',
          ),
          1 => 
          array (
            0 => 'user',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      377 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.pengguna.updateStatus',
          ),
          1 => 
          array (
            0 => 'user',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      419 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.pengaturan.keamanan.sessions.destroy',
          ),
          1 => 
          array (
            0 => 'sessionId',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      450 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.partners.show',
          ),
          1 => 
          array (
            0 => 'partner',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      471 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.partners.updateStatus',
          ),
          1 => 
          array (
            0 => 'partner',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      502 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.partners.services.updateStatus',
          ),
          1 => 
          array (
            0 => 'partner',
            1 => 'service',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      518 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.partners.restore',
          ),
          1 => 
          array (
            0 => 'partner',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      541 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.partners.bulkDestroy',
          ),
          1 => 
          array (
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      557 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.partners.destroy',
          ),
          1 => 
          array (
            0 => 'partner',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      585 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.berita.update',
          ),
          1 => 
          array (
            0 => 'berita',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admin.berita.destroy',
          ),
          1 => 
          array (
            0 => 'berita',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      609 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.faq.update',
          ),
          1 => 
          array (
            0 => 'faq',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admin.faq.destroy',
          ),
          1 => 
          array (
            0 => 'faq',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      646 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.orders.updateStatus',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      668 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.orders.approveDenda',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      684 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.orders.lapor',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admin.orders.lapor.store',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      709 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.orders.konfirmasiCash',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      732 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.orders.verifyPayment',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      755 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.orders.rejectPayment',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      776 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.orders.cancelOrder',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      785 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admin.orders.destroy',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      847 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.barang.detail',
          ),
          1 => 
          array (
            0 => 'service',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      862 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.barang.invoice',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      896 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.bangunan.detail',
          ),
          1 => 
          array (
            0 => 'service',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      909 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.bangunan.pesan',
          ),
          1 => 
          array (
            0 => 'service',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      924 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.bangunan.invoice',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      961 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.pindahan.detail',
          ),
          1 => 
          array (
            0 => 'service',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      976 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.pindahan.invoice',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      989 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.pindahan.pesan',
          ),
          1 => 
          array (
            0 => 'service',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1026 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.kendaraan.detail',
          ),
          1 => 
          array (
            0 => 'service',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1040 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.kendaraan.pesan',
          ),
          1 => 
          array (
            0 => 'service',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1056 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.kendaraan.invoice',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1077 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.show',
          ),
          1 => 
          array (
            0 => 'service',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1095 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.pesan',
          ),
          1 => 
          array (
            0 => 'service',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1122 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.metodePembayaranLayanan',
          ),
          1 => 
          array (
            0 => 'service',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1141 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.services.konfirmasiLayanan',
          ),
          1 => 
          array (
            0 => 'service',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1185 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.topup.instruksi',
          ),
          1 => 
          array (
            0 => 'topup',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1204 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.topup.konfirmasi',
          ),
          1 => 
          array (
            0 => 'topup',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1221 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.topup.menunggu',
          ),
          1 => 
          array (
            0 => 'topup',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1236 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.topup.sukses',
          ),
          1 => 
          array (
            0 => 'topup',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1262 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.berita.show',
          ),
          1 => 
          array (
            0 => 'berita',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1289 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.show',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1316 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.batalkan',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1338 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.bayarSaldo',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1352 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.bayarDenda',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1379 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.buktiPembayaran',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1395 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.review',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1423 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.ajukanPengambilan',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1440 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.lapor',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.lapor.store',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1456 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.success',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1475 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.pembayaran',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1500 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.uploadBukti',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1516 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.uploadBuktiDenda',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1535 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.extend.form',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.extend.store',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1555 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.extend.invoice',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1576 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.extend.bayarSaldo',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1598 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.extend.uploadBukti',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1617 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.klaim.create',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'customer.orders.klaim.store',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1643 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.klaim.show',
          ),
          1 => 
          array (
            0 => 'claim',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1676 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.notifikasi.read',
          ),
          1 => 
          array (
            0 => 'notifikasi',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1716 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.alamat.edit',
          ),
          1 => 
          array (
            0 => 'alamat',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1725 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.alamat.update',
          ),
          1 => 
          array (
            0 => 'alamat',
          ),
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'customer.profile.alamat.destroy',
          ),
          1 => 
          array (
            0 => 'alamat',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1767 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'generated::ya2QToUnRFE8xssu',
          ),
          1 => 
          array (
            0 => 'provinceId',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1794 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'generated::LkkPnWyeChQ6G8ox',
          ),
          1 => 
          array (
            0 => 'regencyId',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1843 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.password.reset',
          ),
          1 => 
          array (
            0 => 'token',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1870 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.rekening.update',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.rekening.destroy',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1893 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.rekening.verifikasi',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1918 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.rekening.verifikasi.kirim-ulang',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1936 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.rekening.verifikasi.konfirmasi',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1984 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'verification.verify',
          ),
          1 => 
          array (
            0 => 'id',
            1 => 'hash',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      2017 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.notifikasi.read',
          ),
          1 => 
          array (
            0 => 'notifikasi',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2048 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.orders.show',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      2089 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.orders.verifikasiPembayaran',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2108 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.orders.verifikasiPerpanjangan',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2123 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.orders.verifikasiDenda',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2138 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.orders.ambil',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2155 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.orders.tolak',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2178 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.orders.tandaiDititip',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2196 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.orders.serahkan',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2209 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.orders.updateFase',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2246 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.penarikan.sukses',
          ),
          1 => 
          array (
            0 => 'penarikan',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2288 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.pendapatan.penarikan.sukses',
          ),
          1 => 
          array (
            0 => 'penarikan',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2321 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.layanan.update',
          ),
          1 => 
          array (
            0 => 'layanan',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.layanan.destroy',
          ),
          1 => 
          array (
            0 => 'layanan',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      2344 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.layanan.toggleAktif',
          ),
          1 => 
          array (
            0 => 'layanan',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2363 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.layanan.barang',
          ),
          1 => 
          array (
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2378 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.layanan.bangunan',
          ),
          1 => 
          array (
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2397 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.layanan.kendaraan',
          ),
          1 => 
          array (
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2414 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.layanan.pindahan',
          ),
          1 => 
          array (
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2447 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.layanan.fiturPenuh',
          ),
          1 => 
          array (
            0 => 'kategori',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2456 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'mitra.layanan.show',
          ),
          1 => 
          array (
            0 => 'layanan',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      2497 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'finance.topup.show',
          ),
          1 => 
          array (
            0 => 'topup',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      2517 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'finance.topup.approve',
          ),
          1 => 
          array (
            0 => 'topup',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2532 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'finance.topup.reject',
          ),
          1 => 
          array (
            0 => 'topup',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2575 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'finance.penarikan.approve',
          ),
          1 => 
          array (
            0 => 'penarikan',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2590 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'finance.penarikan.reject',
          ),
          1 => 
          array (
            0 => 'penarikan',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2635 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'finance.pengembalian-dana.setujui',
          ),
          1 => 
          array (
            0 => 'report',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2649 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'finance.pengembalian-dana.tolak',
          ),
          1 => 
          array (
            0 => 'report',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2694 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'finance.orders.verifyPayment',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2718 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'finance.orders.rejectPayment',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2780 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.laporan-layanan.show',
          ),
          1 => 
          array (
            0 => 'report',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      2796 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.laporan-layanan.updateStatus',
          ),
          1 => 
          array (
            0 => 'report',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2823 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.layanan.show',
          ),
          1 => 
          array (
            0 => 'layanan',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      2842 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.layanan.updateStatus',
          ),
          1 => 
          array (
            0 => 'layanan',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2865 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.layanan.toggleActive',
          ),
          1 => 
          array (
            0 => 'layanan',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2875 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.layanan.destroy',
          ),
          1 => 
          array (
            0 => 'layanan',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      2930 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pengembalian-dana.setujui',
          ),
          1 => 
          array (
            0 => 'report',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2944 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pengembalian-dana.tolak',
          ),
          1 => 
          array (
            0 => 'report',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      2981 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pesanan.updateStatus',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      3004 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pesanan.approveDenda',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      3029 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pesanan.konfirmasiCash',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      3051 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pesanan.cancelOrder',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      3061 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.pesanan.destroy',
          ),
          1 => 
          array (
            0 => 'order',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      3091 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.profil.sessions.destroy',
          ),
          1 => 
          array (
            0 => 'sessionId',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      3117 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.kota.update',
          ),
          1 => 
          array (
            0 => 'kotum',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.kota.destroy',
          ),
          1 => 
          array (
            0 => 'kotum',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      3155 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.user.customer.show',
          ),
          1 => 
          array (
            0 => 'user',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      3171 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.user.customer.updateStatus',
          ),
          1 => 
          array (
            0 => 'user',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      3199 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.user.vendor.show',
          ),
          1 => 
          array (
            0 => 'partner',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      3221 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.user.vendor.updateStatus',
          ),
          1 => 
          array (
            0 => 'partner',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      3253 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.user.vendor.updateServiceStatus',
          ),
          1 => 
          array (
            0 => 'partner',
            1 => 'service',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      3270 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.user.vendor.restore',
          ),
          1 => 
          array (
            0 => 'partner',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      3297 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.user.finance.show',
          ),
          1 => 
          array (
            0 => 'user',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      3320 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.user.admin.show',
          ),
          1 => 
          array (
            0 => 'user',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      3355 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.user.toggleActive',
          ),
          1 => 
          array (
            0 => 'user',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      3364 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.user.destroy',
          ),
          1 => 
          array (
            0 => 'user',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      3410 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.sampah.restore',
          ),
          1 => 
          array (
            0 => 'type',
            1 => 'id',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      3419 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'super-admin.sampah.forceDelete',
          ),
          1 => 
          array (
            0 => 'type',
            1 => 'id',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      3441 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'storage.local',
          ),
          1 => 
          array (
            0 => 'path',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => NULL,
          1 => NULL,
          2 => NULL,
          3 => NULL,
          4 => false,
          5 => false,
          6 => 0,
        ),
      ),
    ),
    4 => NULL,
  ),
  'attributes' => 
  array (
    'sanctum.csrf-cookie' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'sanctum/csrf-cookie',
      'action' => 
      array (
        'uses' => 'Laravel\\Sanctum\\Http\\Controllers\\CsrfCookieController@show',
        'controller' => 'Laravel\\Sanctum\\Http\\Controllers\\CsrfCookieController@show',
        'namespace' => NULL,
        'prefix' => 'sanctum',
        'where' => 
        array (
        ),
        'middleware' => 
        array (
          0 => 'web',
        ),
        'as' => 'sanctum.csrf-cookie',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'generated::XhSpBliO2lOdhEvA' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/internal/login',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'throttle:5,1',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\InternalAuthController@login',
        'controller' => 'App\\Http\\Controllers\\Api\\InternalAuthController@login',
        'namespace' => NULL,
        'prefix' => 'api/internal',
        'where' => 
        array (
        ),
        'as' => 'generated::XhSpBliO2lOdhEvA',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'generated::qdUWIDYem2nTeZJU' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/internal/logout',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\InternalAuthController@logout',
        'controller' => 'App\\Http\\Controllers\\Api\\InternalAuthController@logout',
        'namespace' => NULL,
        'prefix' => 'api/internal',
        'where' => 
        array (
        ),
        'as' => 'generated::qdUWIDYem2nTeZJU',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'generated::w0M6kWO8Yjlxp42X' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/internal/me',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
        ),
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:0:{}s:8:"function";s:195:"function (\\Illuminate\\Http\\Request $request) {
            return \\response()->json([
                \'success\' => true,
                \'data\' => $request->user(),
            ]);
        }";s:5:"scope";s:37:"Illuminate\\Routing\\RouteFileRegistrar";s:4:"this";N;s:4:"self";s:32:"00000000000007320000000000000000";}}',
        'namespace' => NULL,
        'prefix' => 'api/internal',
        'where' => 
        array (
        ),
        'as' => 'generated::w0M6kWO8Yjlxp42X',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'generated::LBTwmESmzF35yJbj' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/internal/finance/dashboard',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:0:{}s:8:"function";s:246:"function (\\Illuminate\\Http\\Request $request) {
            return \\response()->json([
                \'success\' => true,
                \'data\' => [\'user\' => $request->user()->only([\'id\', \'name\', \'email\', \'role\'])],
            ]);
        }";s:5:"scope";s:37:"Illuminate\\Routing\\RouteFileRegistrar";s:4:"this";N;s:4:"self";s:32:"00000000000007340000000000000000";}}',
        'namespace' => NULL,
        'prefix' => 'api/internal',
        'where' => 
        array (
        ),
        'as' => 'generated::LBTwmESmzF35yJbj',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'generated::NWUhsfHESy5vrLqO' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/cities',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\CityController@search',
        'controller' => 'App\\Http\\Controllers\\Customer\\CityController@search',
        'namespace' => NULL,
        'prefix' => 'api',
        'where' => 
        array (
        ),
        'as' => 'generated::NWUhsfHESy5vrLqO',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'generated::3cF9oody0kqkYrrE' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'up',
      'action' => 
      array (
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:0:{}s:8:"function";s:856:"function () {
                    $exception = null;

                    try {
                        \\Illuminate\\Support\\Facades\\Event::dispatch(new \\Illuminate\\Foundation\\Events\\DiagnosingHealth);
                    } catch (\\Throwable $e) {
                        if (app()->hasDebugModeEnabled()) {
                            throw $e;
                        }

                        report($e);

                        $exception = $e->getMessage();
                    }

                    return response(\\Illuminate\\Support\\Facades\\View::file(\'C:\\\\Users\\\\Siti Mintarsih\\\\Documents\\\\GitHub\\\\Titipsini\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Foundation\\\\Configuration\'.\'/../resources/health-up.blade.php\', [
                        \'exception\' => $exception,
                    ]), status: $exception ? 500 : 200);
                }";s:5:"scope";s:54:"Illuminate\\Foundation\\Configuration\\ApplicationBuilder";s:4:"this";N;s:4:"self";s:32:"000000000000072c0000000000000000";}}',
        'as' => 'generated::3cF9oody0kqkYrrE',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'welcome' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => '/',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
        ),
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:0:{}s:8:"function";s:614:"function () {
    if (\\auth()->check()) {
        return match (\\auth()->user()->role) {
            \'admin\' => \\redirect()->route(\'admin.dashboard\'),
            \'finance\' => \\redirect(\'/finance/dashboard\'),
            \'super_admin\' => \\redirect(\'/super-admin/dashboard\'),
            \'partner\' => \\redirect()->route(\'mitra.dashboard\'),
            default => \\redirect()->route(\'customer.dashboard\'),
        };
    }

    // Landing page desktop (marketing) - halaman pertama yang dilihat
    // pengunjung, menggantikan Onboarding di posisi ini.
    return \\Inertia\\Inertia::render(\'Landing\');
}";s:5:"scope";s:37:"Illuminate\\Routing\\RouteFileRegistrar";s:4:"this";N;s:4:"self";s:32:"00000000000007360000000000000000";}}',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'welcome',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'onboarding' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mulai',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
        ),
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:0:{}s:8:"function";s:486:"function () {
    if (\\auth()->check()) {
        return match (\\auth()->user()->role) {
            \'admin\' => \\redirect()->route(\'admin.dashboard\'),
            \'finance\' => \\redirect(\'/finance/dashboard\'),
            \'super_admin\' => \\redirect(\'/super-admin/dashboard\'),
            \'partner\' => \\redirect()->route(\'mitra.dashboard\'),
            default => \\redirect()->route(\'customer.dashboard\'),
        };
    }

    return \\Inertia\\Inertia::render(\'Onboarding\');
}";s:5:"scope";s:37:"Illuminate\\Routing\\RouteFileRegistrar";s:4:"this";N;s:4:"self";s:32:"00000000000007380000000000000000";}}',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'onboarding',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'login' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'login',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Auth\\AuthenticatedSessionController@create',
        'controller' => 'App\\Http\\Controllers\\Auth\\AuthenticatedSessionController@create',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'login',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'generated::3OkSKq5d326kPeLA' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'login',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Auth\\AuthenticatedSessionController@store',
        'controller' => 'App\\Http\\Controllers\\Auth\\AuthenticatedSessionController@store',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'generated::3OkSKq5d326kPeLA',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'register' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'register',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Auth\\RegisteredUserController@create',
        'controller' => 'App\\Http\\Controllers\\Auth\\RegisteredUserController@create',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'register',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'generated::MLuJA1cNHjrGhLzo' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'register',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Auth\\RegisteredUserController@store',
        'controller' => 'App\\Http\\Controllers\\Auth\\RegisteredUserController@store',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'generated::MLuJA1cNHjrGhLzo',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'password.email.form' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'forgot-password',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Auth\\ForgotPasswordController@showEmailForm',
        'controller' => 'App\\Http\\Controllers\\Auth\\ForgotPasswordController@showEmailForm',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'password.email.form',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'password.email.send' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'forgot-password',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Auth\\ForgotPasswordController@sendOtp',
        'controller' => 'App\\Http\\Controllers\\Auth\\ForgotPasswordController@sendOtp',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'password.email.send',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'password.verify.form' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'forgot-password/verify',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Auth\\ForgotPasswordController@showVerifyForm',
        'controller' => 'App\\Http\\Controllers\\Auth\\ForgotPasswordController@showVerifyForm',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'password.verify.form',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'password.verify' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'forgot-password/verify',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Auth\\ForgotPasswordController@verifyOtp',
        'controller' => 'App\\Http\\Controllers\\Auth\\ForgotPasswordController@verifyOtp',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'password.verify',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'password.reset.form' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'forgot-password/reset',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Auth\\ForgotPasswordController@showResetForm',
        'controller' => 'App\\Http\\Controllers\\Auth\\ForgotPasswordController@showResetForm',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'password.reset.form',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'password.reset' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'forgot-password/reset',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Auth\\ForgotPasswordController@resetPassword',
        'controller' => 'App\\Http\\Controllers\\Auth\\ForgotPasswordController@resetPassword',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'password.reset',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'logout' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'logout',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
        ),
        'uses' => '\\App\\Http\\Controllers\\Auth\\AuthenticatedSessionController@destroy',
        'controller' => '\\App\\Http\\Controllers\\Auth\\AuthenticatedSessionController@destroy',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'logout',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.login' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/login',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\Auth\\AuthenticatedSessionController@create',
        'controller' => 'App\\Http\\Controllers\\Admin\\Auth\\AuthenticatedSessionController@create',
        'as' => 'admin.login',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'admin/login',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\Auth\\AuthenticatedSessionController@store',
        'controller' => 'App\\Http\\Controllers\\Admin\\Auth\\AuthenticatedSessionController@store',
        'as' => 'admin.',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.password.request' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/forgot-password',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\Auth\\PasswordResetLinkController@create',
        'controller' => 'App\\Http\\Controllers\\Admin\\Auth\\PasswordResetLinkController@create',
        'as' => 'admin.password.request',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.password.email' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'admin/forgot-password',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\Auth\\PasswordResetLinkController@store',
        'controller' => 'App\\Http\\Controllers\\Admin\\Auth\\PasswordResetLinkController@store',
        'as' => 'admin.password.email',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.password.reset' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/reset-password/{token}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\Auth\\NewPasswordController@create',
        'controller' => 'App\\Http\\Controllers\\Admin\\Auth\\NewPasswordController@create',
        'as' => 'admin.password.reset',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.password.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'admin/reset-password',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\Auth\\NewPasswordController@store',
        'controller' => 'App\\Http\\Controllers\\Admin\\Auth\\NewPasswordController@store',
        'as' => 'admin.password.store',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.onboarding' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\OnboardingController@index',
        'controller' => 'App\\Http\\Controllers\\Mitra\\OnboardingController@index',
        'as' => 'mitra.onboarding',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.login' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/masuk',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:0:{}s:8:"function";s:28:"fn () => \\redirect(\'/login\')";s:5:"scope";s:37:"Illuminate\\Routing\\RouteFileRegistrar";s:4:"this";N;s:4:"self";s:32:"000000000000074e0000000000000000";}}',
        'as' => 'mitra.login',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.login.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'mitra/masuk',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:0:{}s:8:"function";s:28:"fn () => \\redirect(\'/login\')";s:5:"scope";s:37:"Illuminate\\Routing\\RouteFileRegistrar";s:4:"this";N;s:4:"self";s:32:"00000000000007500000000000000000";}}',
        'as' => 'mitra.login.store',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.login.alias' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/login',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:0:{}s:8:"function";s:28:"fn () => \\redirect(\'/login\')";s:5:"scope";s:37:"Illuminate\\Routing\\RouteFileRegistrar";s:4:"this";N;s:4:"self";s:32:"00000000000007520000000000000000";}}',
        'as' => 'mitra.login.alias',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.register' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/daftar',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:0:{}s:8:"function";s:31:"fn () => \\redirect(\'/register\')";s:5:"scope";s:37:"Illuminate\\Routing\\RouteFileRegistrar";s:4:"this";N;s:4:"self";s:32:"00000000000007540000000000000000";}}',
        'as' => 'mitra.register',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.password.request' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/lupa-password',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\Auth\\PasswordResetLinkController@create',
        'controller' => 'App\\Http\\Controllers\\Mitra\\Auth\\PasswordResetLinkController@create',
        'as' => 'mitra.password.request',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.password.email' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'mitra/lupa-password',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\Auth\\PasswordResetLinkController@store',
        'controller' => 'App\\Http\\Controllers\\Mitra\\Auth\\PasswordResetLinkController@store',
        'as' => 'mitra.password.email',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.password.reset' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/reset-password/{token}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\Auth\\NewPasswordController@create',
        'controller' => 'App\\Http\\Controllers\\Mitra\\Auth\\NewPasswordController@create',
        'as' => 'mitra.password.reset',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.password.update' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'mitra/reset-password',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\Auth\\NewPasswordController@store',
        'controller' => 'App\\Http\\Controllers\\Mitra\\Auth\\NewPasswordController@store',
        'as' => 'mitra.password.update',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.verify-email.notice' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/verifikasi-email',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\Auth\\EmailVerificationPromptController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Mitra\\Auth\\EmailVerificationPromptController@__invoke',
        'as' => 'mitra.verify-email.notice',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.verify-email.send' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'mitra/verifikasi-email/kirim-ulang',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'throttle:6,1',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\Auth\\EmailVerificationNotificationController@store',
        'controller' => 'App\\Http\\Controllers\\Mitra\\Auth\\EmailVerificationNotificationController@store',
        'as' => 'mitra.verify-email.send',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.register.success' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/registrasi-sukses',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\Auth\\VerifyEmailController@success',
        'controller' => 'App\\Http\\Controllers\\Mitra\\Auth\\VerifyEmailController@success',
        'as' => 'mitra.register.success',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'verification.verify' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/verifikasi-email/{id}/{hash}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'signed',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\Auth\\VerifyEmailController@verify',
        'controller' => 'App\\Http\\Controllers\\Mitra\\Auth\\VerifyEmailController@verify',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'verification.verify',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.dashboard' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'finance/dashboard',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Finance\\DashboardController@index',
        'controller' => 'App\\Http\\Controllers\\Finance\\DashboardController@index',
        'as' => 'finance.dashboard',
        'namespace' => NULL,
        'prefix' => '/finance',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.profil.edit' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'finance/profil',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Finance\\ProfileController@edit',
        'controller' => 'App\\Http\\Controllers\\Finance\\ProfileController@edit',
        'as' => 'finance.profil.edit',
        'namespace' => NULL,
        'prefix' => '/finance',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.profil.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'finance/profil',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Finance\\ProfileController@update',
        'controller' => 'App\\Http\\Controllers\\Finance\\ProfileController@update',
        'as' => 'finance.profil.update',
        'namespace' => NULL,
        'prefix' => '/finance',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.topup.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'finance/topup',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Finance\\TopupController@index',
        'controller' => 'App\\Http\\Controllers\\Finance\\TopupController@index',
        'as' => 'finance.topup.index',
        'namespace' => NULL,
        'prefix' => 'finance/topup',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.topup.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'finance/topup/{topup}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Finance\\TopupController@show',
        'controller' => 'App\\Http\\Controllers\\Finance\\TopupController@show',
        'as' => 'finance.topup.show',
        'namespace' => NULL,
        'prefix' => 'finance/topup',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.topup.approve' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'finance/topup/{topup}/approve',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Finance\\TopupController@approve',
        'controller' => 'App\\Http\\Controllers\\Finance\\TopupController@approve',
        'as' => 'finance.topup.approve',
        'namespace' => NULL,
        'prefix' => 'finance/topup',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.topup.reject' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'finance/topup/{topup}/reject',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Finance\\TopupController@reject',
        'controller' => 'App\\Http\\Controllers\\Finance\\TopupController@reject',
        'as' => 'finance.topup.reject',
        'namespace' => NULL,
        'prefix' => 'finance/topup',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.pendapatan.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'finance/pendapatan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Finance\\PendapatanController@index',
        'controller' => 'App\\Http\\Controllers\\Finance\\PendapatanController@index',
        'as' => 'finance.pendapatan.index',
        'namespace' => NULL,
        'prefix' => '/finance',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.penarikan.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'finance/penarikan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Finance\\PenarikanController@index',
        'controller' => 'App\\Http\\Controllers\\Finance\\PenarikanController@index',
        'as' => 'finance.penarikan.index',
        'namespace' => NULL,
        'prefix' => 'finance/penarikan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.penarikan.approve' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'finance/penarikan/{penarikan}/approve',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Finance\\PenarikanController@approve',
        'controller' => 'App\\Http\\Controllers\\Finance\\PenarikanController@approve',
        'as' => 'finance.penarikan.approve',
        'namespace' => NULL,
        'prefix' => 'finance/penarikan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.penarikan.reject' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'finance/penarikan/{penarikan}/reject',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Finance\\PenarikanController@reject',
        'controller' => 'App\\Http\\Controllers\\Finance\\PenarikanController@reject',
        'as' => 'finance.penarikan.reject',
        'namespace' => NULL,
        'prefix' => 'finance/penarikan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.qris.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'finance/qris',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Finance\\QrisController@index',
        'controller' => 'App\\Http\\Controllers\\Finance\\QrisController@index',
        'as' => 'finance.qris.index',
        'namespace' => NULL,
        'prefix' => 'finance/qris',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.qris.update' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'finance/qris',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Finance\\QrisController@update',
        'controller' => 'App\\Http\\Controllers\\Finance\\QrisController@update',
        'as' => 'finance.qris.update',
        'namespace' => NULL,
        'prefix' => 'finance/qris',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.qris.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'finance/qris',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Finance\\QrisController@destroy',
        'controller' => 'App\\Http\\Controllers\\Finance\\QrisController@destroy',
        'as' => 'finance.qris.destroy',
        'namespace' => NULL,
        'prefix' => 'finance/qris',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.orders.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'finance/orders',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Finance\\OrderController@index',
        'controller' => 'App\\Http\\Controllers\\Finance\\OrderController@index',
        'as' => 'finance.orders.index',
        'namespace' => NULL,
        'prefix' => 'finance/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.orders.verifyPayment' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'finance/orders/{order}/verify-payment',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Finance\\OrderController@verifyPayment',
        'controller' => 'App\\Http\\Controllers\\Finance\\OrderController@verifyPayment',
        'as' => 'finance.orders.verifyPayment',
        'namespace' => NULL,
        'prefix' => 'finance/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.orders.rejectPayment' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'finance/orders/{order}/reject-payment',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Finance\\OrderController@rejectPayment',
        'controller' => 'App\\Http\\Controllers\\Finance\\OrderController@rejectPayment',
        'as' => 'finance.orders.rejectPayment',
        'namespace' => NULL,
        'prefix' => 'finance/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.pengembalian-dana.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'finance/pengembalian-dana',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\PengembalianDanaController@index',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\PengembalianDanaController@index',
        'as' => 'finance.pengembalian-dana.index',
        'namespace' => NULL,
        'prefix' => 'finance/pengembalian-dana',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.pengembalian-dana.setujui' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'finance/pengembalian-dana/{report}/setujui',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\PengembalianDanaController@setujui',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\PengembalianDanaController@setujui',
        'as' => 'finance.pengembalian-dana.setujui',
        'namespace' => NULL,
        'prefix' => 'finance/pengembalian-dana',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'finance.pengembalian-dana.tolak' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'finance/pengembalian-dana/{report}/tolak',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:finance,super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\PengembalianDanaController@tolak',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\PengembalianDanaController@tolak',
        'as' => 'finance.pengembalian-dana.tolak',
        'namespace' => NULL,
        'prefix' => 'finance/pengembalian-dana',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.dashboard' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/dashboard',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\DashboardController@index',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\DashboardController@index',
        'as' => 'super-admin.dashboard',
        'namespace' => NULL,
        'prefix' => '/super-admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pengembalian-dana.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/pengembalian-dana',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\PengembalianDanaController@index',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\PengembalianDanaController@index',
        'as' => 'super-admin.pengembalian-dana.index',
        'namespace' => NULL,
        'prefix' => 'super-admin/pengembalian-dana',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.penarikan-saldo.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/penarikan-saldo',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\PenarikanSaldoController@index',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\PenarikanSaldoController@index',
        'as' => 'super-admin.penarikan-saldo.index',
        'namespace' => NULL,
        'prefix' => '/super-admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.total-transaksi.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/total-transaksi',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\TotalTransaksiController@index',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\TotalTransaksiController@index',
        'as' => 'super-admin.total-transaksi.index',
        'namespace' => NULL,
        'prefix' => '/super-admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.laporan-layanan.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/laporan-layanan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\LaporanController@index',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\LaporanController@index',
        'as' => 'super-admin.laporan-layanan.index',
        'namespace' => NULL,
        'prefix' => 'super-admin/laporan-layanan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.laporan-layanan.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/laporan-layanan/{report}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\LaporanController@show',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\LaporanController@show',
        'as' => 'super-admin.laporan-layanan.show',
        'namespace' => NULL,
        'prefix' => 'super-admin/laporan-layanan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.laporan-layanan.updateStatus' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'super-admin/laporan-layanan/{report}/status',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\LaporanController@updateStatus',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\LaporanController@updateStatus',
        'as' => 'super-admin.laporan-layanan.updateStatus',
        'namespace' => NULL,
        'prefix' => 'super-admin/laporan-layanan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pengembalian-dana.setujui' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'super-admin/pengembalian-dana/{report}/setujui',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\PengembalianDanaController@setujui',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\PengembalianDanaController@setujui',
        'as' => 'super-admin.pengembalian-dana.setujui',
        'namespace' => NULL,
        'prefix' => 'super-admin/pengembalian-dana',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pengembalian-dana.tolak' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'super-admin/pengembalian-dana/{report}/tolak',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\PengembalianDanaController@tolak',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\PengembalianDanaController@tolak',
        'as' => 'super-admin.pengembalian-dana.tolak',
        'namespace' => NULL,
        'prefix' => 'super-admin/pengembalian-dana',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pengaturan.keamanan.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/pengaturan/keamanan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanKeamananController@index',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanKeamananController@index',
        'as' => 'super-admin.pengaturan.keamanan.index',
        'namespace' => NULL,
        'prefix' => 'super-admin/pengaturan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pengaturan.keamanan.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'super-admin/pengaturan/keamanan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanKeamananController@update',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanKeamananController@update',
        'as' => 'super-admin.pengaturan.keamanan.update',
        'namespace' => NULL,
        'prefix' => 'super-admin/pengaturan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pengaturan.komisi.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/pengaturan/komisi',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanKomisiController@index',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanKomisiController@index',
        'as' => 'super-admin.pengaturan.komisi.index',
        'namespace' => NULL,
        'prefix' => 'super-admin/pengaturan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pengaturan.komisi.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'super-admin/pengaturan/komisi',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanKomisiController@update',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanKomisiController@update',
        'as' => 'super-admin.pengaturan.komisi.update',
        'namespace' => NULL,
        'prefix' => 'super-admin/pengaturan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pengaturan.denda.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/pengaturan/denda',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanDendaController@index',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanDendaController@index',
        'as' => 'super-admin.pengaturan.denda.index',
        'namespace' => NULL,
        'prefix' => 'super-admin/pengaturan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pengaturan.denda.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'super-admin/pengaturan/denda',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanDendaController@update',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanDendaController@update',
        'as' => 'super-admin.pengaturan.denda.update',
        'namespace' => NULL,
        'prefix' => 'super-admin/pengaturan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pengaturan.qris.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/pengaturan/qris',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanQrisController@index',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanQrisController@index',
        'as' => 'super-admin.pengaturan.qris.index',
        'namespace' => NULL,
        'prefix' => 'super-admin/pengaturan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pengaturan.qris.update' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'super-admin/pengaturan/qris',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanQrisController@update',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanQrisController@update',
        'as' => 'super-admin.pengaturan.qris.update',
        'namespace' => NULL,
        'prefix' => 'super-admin/pengaturan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pengaturan.qris.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'super-admin/pengaturan/qris',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanQrisController@destroy',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\PengaturanQrisController@destroy',
        'as' => 'super-admin.pengaturan.qris.destroy',
        'namespace' => NULL,
        'prefix' => 'super-admin/pengaturan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.dashboard' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/dashboard',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\DashboardController@index',
        'controller' => 'App\\Http\\Controllers\\Admin\\DashboardController@index',
        'as' => 'admin.dashboard',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.laporan-validasi.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/laporan-validasi',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ValidasiLaporanController@index',
        'controller' => 'App\\Http\\Controllers\\Admin\\ValidasiLaporanController@index',
        'as' => 'admin.laporan-validasi.index',
        'namespace' => NULL,
        'prefix' => 'admin/laporan-validasi',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.laporan-validasi.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/laporan-validasi/{report}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ValidasiLaporanController@show',
        'controller' => 'App\\Http\\Controllers\\Admin\\ValidasiLaporanController@show',
        'as' => 'admin.laporan-validasi.show',
        'namespace' => NULL,
        'prefix' => 'admin/laporan-validasi',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.laporan-validasi.approve' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'admin/laporan-validasi/{report}/approve',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ValidasiLaporanController@approve',
        'controller' => 'App\\Http\\Controllers\\Admin\\ValidasiLaporanController@approve',
        'as' => 'admin.laporan-validasi.approve',
        'namespace' => NULL,
        'prefix' => 'admin/laporan-validasi',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.laporan-validasi.reject' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'admin/laporan-validasi/{report}/reject',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ValidasiLaporanController@reject',
        'controller' => 'App\\Http\\Controllers\\Admin\\ValidasiLaporanController@reject',
        'as' => 'admin.laporan-validasi.reject',
        'namespace' => NULL,
        'prefix' => 'admin/laporan-validasi',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.klaim.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/klaim',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ClaimController@index',
        'controller' => 'App\\Http\\Controllers\\Admin\\ClaimController@index',
        'as' => 'admin.klaim.index',
        'namespace' => NULL,
        'prefix' => 'admin/klaim',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.klaim.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/klaim/{claim}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ClaimController@show',
        'controller' => 'App\\Http\\Controllers\\Admin\\ClaimController@show',
        'as' => 'admin.klaim.show',
        'namespace' => NULL,
        'prefix' => 'admin/klaim',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.klaim.mulaiPemeriksaan' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'admin/klaim/{claim}/mulai-pemeriksaan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ClaimController@mulaiPemeriksaan',
        'controller' => 'App\\Http\\Controllers\\Admin\\ClaimController@mulaiPemeriksaan',
        'as' => 'admin.klaim.mulaiPemeriksaan',
        'namespace' => NULL,
        'prefix' => 'admin/klaim',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.klaim.setujui' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'admin/klaim/{claim}/setujui',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ClaimController@setujui',
        'controller' => 'App\\Http\\Controllers\\Admin\\ClaimController@setujui',
        'as' => 'admin.klaim.setujui',
        'namespace' => NULL,
        'prefix' => 'admin/klaim',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.klaim.tolak' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'admin/klaim/{claim}/tolak',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ClaimController@tolak',
        'controller' => 'App\\Http\\Controllers\\Admin\\ClaimController@tolak',
        'as' => 'admin.klaim.tolak',
        'namespace' => NULL,
        'prefix' => 'admin/klaim',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.klaim.sengketa' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'admin/klaim/{claim}/sengketa',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ClaimController@escalateSengketa',
        'controller' => 'App\\Http\\Controllers\\Admin\\ClaimController@escalateSengketa',
        'as' => 'admin.klaim.sengketa',
        'namespace' => NULL,
        'prefix' => 'admin/klaim',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.pengguna.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/pengguna',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\UserController@index',
        'controller' => 'App\\Http\\Controllers\\Admin\\UserController@index',
        'as' => 'admin.pengguna.index',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.pengguna.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/pengguna/{user}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\UserController@show',
        'controller' => 'App\\Http\\Controllers\\Admin\\UserController@show',
        'as' => 'admin.pengguna.show',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.pengguna.updateStatus' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'admin/pengguna/{user}/status',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\UserController@updateStatus',
        'controller' => 'App\\Http\\Controllers\\Admin\\UserController@updateStatus',
        'as' => 'admin.pengguna.updateStatus',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.partners.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/partners',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\PartnerController@index',
        'controller' => 'App\\Http\\Controllers\\Admin\\PartnerController@index',
        'as' => 'admin.partners.index',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.partners.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/partners/{partner}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\PartnerController@show',
        'controller' => 'App\\Http\\Controllers\\Admin\\PartnerController@show',
        'as' => 'admin.partners.show',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.partners.updateStatus' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'admin/partners/{partner}/status',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\PartnerController@updateStatus',
        'controller' => 'App\\Http\\Controllers\\Admin\\PartnerController@updateStatus',
        'as' => 'admin.partners.updateStatus',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.partners.services.updateStatus' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'admin/partners/{partner}/services/{service}/status',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\PartnerController@updateServiceStatus',
        'controller' => 'App\\Http\\Controllers\\Admin\\PartnerController@updateServiceStatus',
        'as' => 'admin.partners.services.updateStatus',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.partners.restore' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'admin/partners/{partner}/restore',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\PartnerController@restore',
        'controller' => 'App\\Http\\Controllers\\Admin\\PartnerController@restore',
        'as' => 'admin.partners.restore',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.partners.bulkDestroy' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'admin/partners/bulk-destroy',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\PartnerController@bulkDestroy',
        'controller' => 'App\\Http\\Controllers\\Admin\\PartnerController@bulkDestroy',
        'as' => 'admin.partners.bulkDestroy',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.partners.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'admin/partners/{partner}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\PartnerController@destroy',
        'controller' => 'App\\Http\\Controllers\\Admin\\PartnerController@destroy',
        'as' => 'admin.partners.destroy',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.profil.edit' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/profil',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ProfileController@edit',
        'controller' => 'App\\Http\\Controllers\\Admin\\ProfileController@edit',
        'as' => 'admin.profil.edit',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.profil.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'admin/profil',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ProfileController@update',
        'controller' => 'App\\Http\\Controllers\\Admin\\ProfileController@update',
        'as' => 'admin.profil.update',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.pengaturan.keamanan' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/pengaturan/keamanan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\PengaturanController@keamanan',
        'controller' => 'App\\Http\\Controllers\\Admin\\PengaturanController@keamanan',
        'as' => 'admin.pengaturan.keamanan',
        'namespace' => NULL,
        'prefix' => 'admin/pengaturan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.pengaturan.keamanan.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'admin/pengaturan/keamanan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\PengaturanController@updateKeamanan',
        'controller' => 'App\\Http\\Controllers\\Admin\\PengaturanController@updateKeamanan',
        'as' => 'admin.pengaturan.keamanan.update',
        'namespace' => NULL,
        'prefix' => 'admin/pengaturan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.pengaturan.keamanan.sessions.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'admin/pengaturan/keamanan/sessions/{sessionId}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\PengaturanController@destroySession',
        'controller' => 'App\\Http\\Controllers\\Admin\\PengaturanController@destroySession',
        'as' => 'admin.pengaturan.keamanan.sessions.destroy',
        'namespace' => NULL,
        'prefix' => 'admin/pengaturan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.berita.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/berita',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'as' => 'admin.berita.index',
        'uses' => 'App\\Http\\Controllers\\Admin\\BeritaController@index',
        'controller' => 'App\\Http\\Controllers\\Admin\\BeritaController@index',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.berita.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'admin/berita',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'as' => 'admin.berita.store',
        'uses' => 'App\\Http\\Controllers\\Admin\\BeritaController@store',
        'controller' => 'App\\Http\\Controllers\\Admin\\BeritaController@store',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.berita.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'admin/berita/{berita}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'as' => 'admin.berita.update',
        'uses' => 'App\\Http\\Controllers\\Admin\\BeritaController@update',
        'controller' => 'App\\Http\\Controllers\\Admin\\BeritaController@update',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.berita.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'admin/berita/{berita}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'as' => 'admin.berita.destroy',
        'uses' => 'App\\Http\\Controllers\\Admin\\BeritaController@destroy',
        'controller' => 'App\\Http\\Controllers\\Admin\\BeritaController@destroy',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.kota.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/kota',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'as' => 'admin.kota.index',
        'uses' => 'App\\Http\\Controllers\\Admin\\KotaController@index',
        'controller' => 'App\\Http\\Controllers\\Admin\\KotaController@index',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.kota.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'admin/kota',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'as' => 'admin.kota.store',
        'uses' => 'App\\Http\\Controllers\\Admin\\KotaController@store',
        'controller' => 'App\\Http\\Controllers\\Admin\\KotaController@store',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.kota.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'admin/kota/{kotum}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'as' => 'admin.kota.update',
        'uses' => 'App\\Http\\Controllers\\Admin\\KotaController@update',
        'controller' => 'App\\Http\\Controllers\\Admin\\KotaController@update',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.kota.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'admin/kota/{kotum}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'as' => 'admin.kota.destroy',
        'uses' => 'App\\Http\\Controllers\\Admin\\KotaController@destroy',
        'controller' => 'App\\Http\\Controllers\\Admin\\KotaController@destroy',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.faq.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/faq',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'as' => 'admin.faq.index',
        'uses' => 'App\\Http\\Controllers\\Admin\\FaqController@index',
        'controller' => 'App\\Http\\Controllers\\Admin\\FaqController@index',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.faq.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'admin/faq',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'as' => 'admin.faq.store',
        'uses' => 'App\\Http\\Controllers\\Admin\\FaqController@store',
        'controller' => 'App\\Http\\Controllers\\Admin\\FaqController@store',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.faq.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'admin/faq/{faq}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'as' => 'admin.faq.update',
        'uses' => 'App\\Http\\Controllers\\Admin\\FaqController@update',
        'controller' => 'App\\Http\\Controllers\\Admin\\FaqController@update',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.faq.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'admin/faq/{faq}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'as' => 'admin.faq.destroy',
        'uses' => 'App\\Http\\Controllers\\Admin\\FaqController@destroy',
        'controller' => 'App\\Http\\Controllers\\Admin\\FaqController@destroy',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.orders.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/orders',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\OrderController@index',
        'controller' => 'App\\Http\\Controllers\\Admin\\OrderController@index',
        'as' => 'admin.orders.index',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.orders.updateStatus' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'admin/orders/{order}/status',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\OrderController@updateStatus',
        'controller' => 'App\\Http\\Controllers\\Admin\\OrderController@updateStatus',
        'as' => 'admin.orders.updateStatus',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.orders.approveDenda' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'admin/orders/{order}/approve-denda',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\OrderController@approveDenda',
        'controller' => 'App\\Http\\Controllers\\Admin\\OrderController@approveDenda',
        'as' => 'admin.orders.approveDenda',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.orders.bulkDestroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'admin/orders/bulk-delete',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\OrderController@bulkDestroy',
        'controller' => 'App\\Http\\Controllers\\Admin\\OrderController@bulkDestroy',
        'as' => 'admin.orders.bulkDestroy',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.orders.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'admin/orders/{order}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\OrderController@destroy',
        'controller' => 'App\\Http\\Controllers\\Admin\\OrderController@destroy',
        'as' => 'admin.orders.destroy',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.orders.lapor' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/orders/{order}/lapor',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ReportController@create',
        'controller' => 'App\\Http\\Controllers\\Customer\\ReportController@create',
        'as' => 'admin.orders.lapor',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.orders.lapor.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'admin/orders/{order}/lapor',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ReportController@store',
        'controller' => 'App\\Http\\Controllers\\Customer\\ReportController@store',
        'as' => 'admin.orders.lapor.store',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.orders.konfirmasiCash' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'admin/orders/{order}/konfirmasi-cash',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\OrderController@confirmCashPayment',
        'controller' => 'App\\Http\\Controllers\\Admin\\OrderController@confirmCashPayment',
        'as' => 'admin.orders.konfirmasiCash',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.orders.verifyPayment' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'admin/orders/{order}/verify-payment',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\OrderController@verifyPayment',
        'controller' => 'App\\Http\\Controllers\\Admin\\OrderController@verifyPayment',
        'as' => 'admin.orders.verifyPayment',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.orders.rejectPayment' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'admin/orders/{order}/reject-payment',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\OrderController@rejectPayment',
        'controller' => 'App\\Http\\Controllers\\Admin\\OrderController@rejectPayment',
        'as' => 'admin.orders.rejectPayment',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.orders.cancelOrder' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'admin/orders/{order}/cancel-order',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\OrderController@cancelOrder',
        'controller' => 'App\\Http\\Controllers\\Admin\\OrderController@cancelOrder',
        'as' => 'admin.orders.cancelOrder',
        'namespace' => NULL,
        'prefix' => '/admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.reports.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/reports',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ReportController@index',
        'controller' => 'App\\Http\\Controllers\\Admin\\ReportController@index',
        'as' => 'admin.reports.index',
        'namespace' => NULL,
        'prefix' => 'admin/reports',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.reports.export' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/reports/export',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ReportController@export',
        'controller' => 'App\\Http\\Controllers\\Admin\\ReportController@export',
        'as' => 'admin.reports.export',
        'namespace' => NULL,
        'prefix' => 'admin/reports',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.reports.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/reports/{report}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ReportController@show',
        'controller' => 'App\\Http\\Controllers\\Admin\\ReportController@show',
        'as' => 'admin.reports.show',
        'namespace' => NULL,
        'prefix' => 'admin/reports',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.reports.suspend' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'admin/reports/{report}/suspend',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ReportController@suspend',
        'controller' => 'App\\Http\\Controllers\\Admin\\ReportController@suspend',
        'as' => 'admin.reports.suspend',
        'namespace' => NULL,
        'prefix' => 'admin/reports',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.reports.restore' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'admin/reports/{report}/restore',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ReportController@restore',
        'controller' => 'App\\Http\\Controllers\\Admin\\ReportController@restore',
        'as' => 'admin.reports.restore',
        'namespace' => NULL,
        'prefix' => 'admin/reports',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admin.reports.penangguhan' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'admin/reports/{report}/penangguhan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\ReportController@penangguhan',
        'controller' => 'App\\Http\\Controllers\\Admin\\ReportController@penangguhan',
        'as' => 'admin.reports.penangguhan',
        'namespace' => NULL,
        'prefix' => 'admin/reports',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.dashboard' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/dashboard',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\DashboardController@index',
        'controller' => 'App\\Http\\Controllers\\Mitra\\DashboardController@index',
        'as' => 'mitra.dashboard',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.notifikasi.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/notifikasi',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\NotifikasiController@index',
        'controller' => 'App\\Http\\Controllers\\Mitra\\NotifikasiController@index',
        'as' => 'mitra.notifikasi.index',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.notifikasi.read' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'mitra/notifikasi/{notifikasi}/read',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\NotifikasiController@markAsRead',
        'controller' => 'App\\Http\\Controllers\\Mitra\\NotifikasiController@markAsRead',
        'as' => 'mitra.notifikasi.read',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.notifikasi.readAll' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'mitra/notifikasi/tandai-semua',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\NotifikasiController@markAllAsRead',
        'controller' => 'App\\Http\\Controllers\\Mitra\\NotifikasiController@markAllAsRead',
        'as' => 'mitra.notifikasi.readAll',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.profil.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/profil',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\ProfileController@index',
        'controller' => 'App\\Http\\Controllers\\Mitra\\ProfileController@index',
        'as' => 'mitra.profil.index',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.profil.edit' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/profil/saya',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\ProfileController@edit',
        'controller' => 'App\\Http\\Controllers\\Mitra\\ProfileController@edit',
        'as' => 'mitra.profil.edit',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.profil.update' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'mitra/profil/saya',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\ProfileController@update',
        'controller' => 'App\\Http\\Controllers\\Mitra\\ProfileController@update',
        'as' => 'mitra.profil.update',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.orders.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/pesanan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\OrderController@index',
        'controller' => 'App\\Http\\Controllers\\Mitra\\OrderController@index',
        'as' => 'mitra.orders.index',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.orders.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/pesanan/{order}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\OrderController@show',
        'controller' => 'App\\Http\\Controllers\\Mitra\\OrderController@show',
        'as' => 'mitra.orders.show',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.alamat.edit' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/alamat',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\AlamatController@edit',
        'controller' => 'App\\Http\\Controllers\\Mitra\\AlamatController@edit',
        'as' => 'mitra.alamat.edit',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.alamat.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'mitra/alamat',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\AlamatController@update',
        'controller' => 'App\\Http\\Controllers\\Mitra\\AlamatController@update',
        'as' => 'mitra.alamat.update',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.jam-operasional.edit' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/layanan/jam-operasional',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\JamOperasionalController@edit',
        'controller' => 'App\\Http\\Controllers\\Mitra\\JamOperasionalController@edit',
        'as' => 'mitra.jam-operasional.edit',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.jam-operasional.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'mitra/layanan/jam-operasional',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\JamOperasionalController@update',
        'controller' => 'App\\Http\\Controllers\\Mitra\\JamOperasionalController@update',
        'as' => 'mitra.jam-operasional.update',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.legalitas.edit' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/legalitas',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\LegalitasController@edit',
        'controller' => 'App\\Http\\Controllers\\Mitra\\LegalitasController@edit',
        'as' => 'mitra.legalitas.edit',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.legalitas.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'mitra/legalitas',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\LegalitasController@storeKtp',
        'controller' => 'App\\Http\\Controllers\\Mitra\\LegalitasController@storeKtp',
        'as' => 'mitra.legalitas.store',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.legalitas.pin.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'mitra/legalitas/pin',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\LegalitasController@storePin',
        'controller' => 'App\\Http\\Controllers\\Mitra\\LegalitasController@storePin',
        'as' => 'mitra.legalitas.pin.store',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.layanan.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/layanan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'as' => 'mitra.layanan.index',
        'uses' => 'App\\Http\\Controllers\\Mitra\\ServiceController@index',
        'controller' => 'App\\Http\\Controllers\\Mitra\\ServiceController@index',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.layanan.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'mitra/layanan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'as' => 'mitra.layanan.store',
        'uses' => 'App\\Http\\Controllers\\Mitra\\ServiceController@store',
        'controller' => 'App\\Http\\Controllers\\Mitra\\ServiceController@store',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.layanan.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'mitra/layanan/{layanan}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'as' => 'mitra.layanan.update',
        'uses' => 'App\\Http\\Controllers\\Mitra\\ServiceController@update',
        'controller' => 'App\\Http\\Controllers\\Mitra\\ServiceController@update',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.layanan.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'mitra/layanan/{layanan}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'as' => 'mitra.layanan.destroy',
        'uses' => 'App\\Http\\Controllers\\Mitra\\ServiceController@destroy',
        'controller' => 'App\\Http\\Controllers\\Mitra\\ServiceController@destroy',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.layanan.toggleAktif' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'mitra/layanan/{layanan}/toggle-aktif',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\ServiceController@toggleAktif',
        'controller' => 'App\\Http\\Controllers\\Mitra\\ServiceController@toggleAktif',
        'as' => 'mitra.layanan.toggleAktif',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.layanan.barang' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/layanan/barang',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\ServiceController@kategori',
        'controller' => 'App\\Http\\Controllers\\Mitra\\ServiceController@kategori',
        'as' => 'mitra.layanan.barang',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
        'kategori' => 'barang',
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.layanan.kendaraan' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/layanan/kendaraan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\ServiceController@kategori',
        'controller' => 'App\\Http\\Controllers\\Mitra\\ServiceController@kategori',
        'as' => 'mitra.layanan.kendaraan',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
        'kategori' => 'kendaraan',
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.layanan.bangunan' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/layanan/bangunan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\ServiceController@kategori',
        'controller' => 'App\\Http\\Controllers\\Mitra\\ServiceController@kategori',
        'as' => 'mitra.layanan.bangunan',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
        'kategori' => 'bangunan',
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.layanan.pindahan' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/layanan/pindahan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\ServiceController@kategori',
        'controller' => 'App\\Http\\Controllers\\Mitra\\ServiceController@kategori',
        'as' => 'mitra.layanan.pindahan',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
        'kategori' => 'pindahan',
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.layanan.fiturPenuh' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'mitra/layanan/{kategori}/fitur-penuh',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\ServiceController@toggleFiturPenuh',
        'controller' => 'App\\Http\\Controllers\\Mitra\\ServiceController@toggleFiturPenuh',
        'as' => 'mitra.layanan.fiturPenuh',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.layanan.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/layanan/{layanan}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\ServiceController@show',
        'controller' => 'App\\Http\\Controllers\\Mitra\\ServiceController@show',
        'as' => 'mitra.layanan.show',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.rekening.edit' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/rekening',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\RekeningController@edit',
        'controller' => 'App\\Http\\Controllers\\Mitra\\RekeningController@edit',
        'as' => 'mitra.rekening.edit',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.rekening.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'mitra/rekening',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\RekeningController@store',
        'controller' => 'App\\Http\\Controllers\\Mitra\\RekeningController@store',
        'as' => 'mitra.rekening.store',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.rekening.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'mitra/rekening/{id}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\RekeningController@update',
        'controller' => 'App\\Http\\Controllers\\Mitra\\RekeningController@update',
        'as' => 'mitra.rekening.update',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.rekening.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'mitra/rekening/{id}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\RekeningController@destroy',
        'controller' => 'App\\Http\\Controllers\\Mitra\\RekeningController@destroy',
        'as' => 'mitra.rekening.destroy',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.rekening.verifikasi' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'mitra/rekening/{id}/verifikasi',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\RekeningController@verifikasi',
        'controller' => 'App\\Http\\Controllers\\Mitra\\RekeningController@verifikasi',
        'as' => 'mitra.rekening.verifikasi',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.rekening.verifikasi.kirim-ulang' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'mitra/rekening/{id}/verifikasi/kirim-ulang',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\RekeningController@verifikasiKirimUlang',
        'controller' => 'App\\Http\\Controllers\\Mitra\\RekeningController@verifikasiKirimUlang',
        'as' => 'mitra.rekening.verifikasi.kirim-ulang',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.rekening.verifikasi.konfirmasi' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'mitra/rekening/{id}/verifikasi/konfirmasi',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\RekeningController@verifikasiKonfirmasi',
        'controller' => 'App\\Http\\Controllers\\Mitra\\RekeningController@verifikasiKonfirmasi',
        'as' => 'mitra.rekening.verifikasi.konfirmasi',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.penarikan.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/penarikan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\PenarikanController@index',
        'controller' => 'App\\Http\\Controllers\\Mitra\\PenarikanController@index',
        'as' => 'mitra.penarikan.index',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.penarikan.create' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/penarikan/tarik',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\PenarikanController@create',
        'controller' => 'App\\Http\\Controllers\\Mitra\\PenarikanController@create',
        'as' => 'mitra.penarikan.create',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.penarikan.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'mitra/penarikan/tarik',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\PenarikanController@store',
        'controller' => 'App\\Http\\Controllers\\Mitra\\PenarikanController@store',
        'as' => 'mitra.penarikan.store',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.penarikan.sukses' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/penarikan/{penarikan}/sukses',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\PenarikanController@sukses',
        'controller' => 'App\\Http\\Controllers\\Mitra\\PenarikanController@sukses',
        'as' => 'mitra.penarikan.sukses',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.pendapatan.penarikan.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/pendapatan/penarikan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\PenarikanController@index',
        'controller' => 'App\\Http\\Controllers\\Mitra\\PenarikanController@index',
        'as' => 'mitra.pendapatan.penarikan.index',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.pendapatan.penarikan.create' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/pendapatan/penarikan/tarik',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\PenarikanController@create',
        'controller' => 'App\\Http\\Controllers\\Mitra\\PenarikanController@create',
        'as' => 'mitra.pendapatan.penarikan.create',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.pendapatan.penarikan.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'mitra/pendapatan/penarikan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\PenarikanController@store',
        'controller' => 'App\\Http\\Controllers\\Mitra\\PenarikanController@store',
        'as' => 'mitra.pendapatan.penarikan.store',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.pendapatan.penarikan.sukses' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/pendapatan/penarikan/{penarikan}/sukses',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\PenarikanController@sukses',
        'controller' => 'App\\Http\\Controllers\\Mitra\\PenarikanController@sukses',
        'as' => 'mitra.pendapatan.penarikan.sukses',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.keamanan.edit' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/keamanan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\KeamananController@edit',
        'controller' => 'App\\Http\\Controllers\\Mitra\\KeamananController@edit',
        'as' => 'mitra.keamanan.edit',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.keamanan.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'mitra/keamanan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\KeamananController@update',
        'controller' => 'App\\Http\\Controllers\\Mitra\\KeamananController@update',
        'as' => 'mitra.keamanan.update',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.keamanan.pin.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'mitra/keamanan/pin',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\KeamananController@updatePin',
        'controller' => 'App\\Http\\Controllers\\Mitra\\KeamananController@updatePin',
        'as' => 'mitra.keamanan.pin.update',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.keamanan.pin.lupa' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'mitra/keamanan/pin/lupa',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\KeamananController@lupaPin',
        'controller' => 'App\\Http\\Controllers\\Mitra\\KeamananController@lupaPin',
        'as' => 'mitra.keamanan.pin.lupa',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.kebijakan-privasi.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/kebijakan-privasi',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\KebijakanPrivasiController@index',
        'controller' => 'App\\Http\\Controllers\\Mitra\\KebijakanPrivasiController@index',
        'as' => 'mitra.kebijakan-privasi.index',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.bantuan.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/bantuan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\BantuanController@index',
        'controller' => 'App\\Http\\Controllers\\Mitra\\BantuanController@index',
        'as' => 'mitra.bantuan.index',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.orders.verifikasiPembayaran' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'mitra/pesanan/{order}/verifikasi-pembayaran',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\OrderController@verifikasiPembayaran',
        'controller' => 'App\\Http\\Controllers\\Mitra\\OrderController@verifikasiPembayaran',
        'as' => 'mitra.orders.verifikasiPembayaran',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.orders.ambil' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'mitra/pesanan/{order}/ambil',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\OrderController@ambilPesanan',
        'controller' => 'App\\Http\\Controllers\\Mitra\\OrderController@ambilPesanan',
        'as' => 'mitra.orders.ambil',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.orders.tolak' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'mitra/pesanan/{order}/tolak',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\OrderController@tolakPesanan',
        'controller' => 'App\\Http\\Controllers\\Mitra\\OrderController@tolakPesanan',
        'as' => 'mitra.orders.tolak',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.orders.verifikasiDenda' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'mitra/pesanan/{order}/verifikasi-denda',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\OrderController@verifikasiDenda',
        'controller' => 'App\\Http\\Controllers\\Mitra\\OrderController@verifikasiDenda',
        'as' => 'mitra.orders.verifikasiDenda',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.orders.verifikasiPerpanjangan' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'mitra/pesanan/{order}/verifikasi-perpanjangan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\OrderController@verifikasiPerpanjangan',
        'controller' => 'App\\Http\\Controllers\\Mitra\\OrderController@verifikasiPerpanjangan',
        'as' => 'mitra.orders.verifikasiPerpanjangan',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.orders.serahkan' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'mitra/pesanan/{order}/serahkan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\OrderController@confirmPickup',
        'controller' => 'App\\Http\\Controllers\\Mitra\\OrderController@confirmPickup',
        'as' => 'mitra.orders.serahkan',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.orders.tandaiDititip' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'mitra/pesanan/{order}/tandai-dititip',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\OrderController@tandaiDititip',
        'controller' => 'App\\Http\\Controllers\\Mitra\\OrderController@tandaiDititip',
        'as' => 'mitra.orders.tandaiDititip',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.orders.updateFase' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'mitra/pesanan/{order}/fase',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\OrderController@updateFase',
        'controller' => 'App\\Http\\Controllers\\Mitra\\OrderController@updateFase',
        'as' => 'mitra.orders.updateFase',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.pendapatan.riwayat' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/pendapatan/riwayat',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:partner',
          3 => 'partner.suspended',
        ),
        'uses' => 'App\\Http\\Controllers\\Mitra\\PendapatanController@riwayat',
        'controller' => 'App\\Http\\Controllers\\Mitra\\PendapatanController@riwayat',
        'as' => 'mitra.pendapatan.riwayat',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.suspended.notice' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'mitra/ditangguhkan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\PartnerController@suspendedNotice',
        'controller' => 'App\\Http\\Controllers\\Admin\\PartnerController@suspendedNotice',
        'as' => 'mitra.suspended.notice',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'mitra.request.restoration' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'mitra/ajukan-pemulihan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
        ),
        'uses' => 'App\\Http\\Controllers\\Admin\\PartnerController@requestRestoration',
        'controller' => 'App\\Http\\Controllers\\Admin\\PartnerController@requestRestoration',
        'as' => 'mitra.request.restoration',
        'namespace' => NULL,
        'prefix' => '/mitra',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.dashboard' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/dashboard',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\DashboardController@index',
        'controller' => 'App\\Http\\Controllers\\Customer\\DashboardController@index',
        'as' => 'customer.dashboard',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@index',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@index',
        'as' => 'customer.services.index',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.barang.pilihPaket' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/barang/paket-pilihan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@pilihPaket',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@pilihPaket',
        'as' => 'customer.services.barang.pilihPaket',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.barang.landing' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/barang/landing',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@landingBarang',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@landingBarang',
        'as' => 'customer.services.barang.landing',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.barang.search' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/barang/search',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@searchBarang',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@searchBarang',
        'as' => 'customer.services.barang.search',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.barang.form' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/barang',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@formBarang',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@formBarang',
        'as' => 'customer.services.barang.form',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.barang.detail' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/barang/{service}/detail',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@detailBarang',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@detailBarang',
        'as' => 'customer.services.barang.detail',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.barang.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/services/barang',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@simpanBarang',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@simpanBarang',
        'as' => 'customer.services.barang.store',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.barang.invoice' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/barang/{order}/invoice',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@invoiceBarang',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@invoiceBarang',
        'as' => 'customer.services.barang.invoice',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.bangunan.form' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/bangunan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@formBangunan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@formBangunan',
        'as' => 'customer.services.bangunan.form',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.bangunan.search' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/bangunan/search',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@searchBangunan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@searchBangunan',
        'as' => 'customer.services.bangunan.search',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.bangunan.form.pesan' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/bangunan/pesan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@formPesanBangunan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@formPesanBangunan',
        'as' => 'customer.services.bangunan.form.pesan',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.bangunan.detail' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/bangunan/{service}/detail',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@detailBangunan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@detailBangunan',
        'as' => 'customer.services.bangunan.detail',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.bangunan.pesan' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/bangunan/{service}/titip',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@pesanBangunan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@pesanBangunan',
        'as' => 'customer.services.bangunan.pesan',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.bangunan.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/services/bangunan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@simpanBangunan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@simpanBangunan',
        'as' => 'customer.services.bangunan.store',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.bangunan.invoice' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/bangunan/{order}/invoice',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@invoiceBangunan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@invoiceBangunan',
        'as' => 'customer.services.bangunan.invoice',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.pindahan.form' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/pindahan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@formPindahan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@formPindahan',
        'as' => 'customer.services.pindahan.form',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.pindahan.search' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/pindahan/search',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@searchPindahan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@searchPindahan',
        'as' => 'customer.services.pindahan.search',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.pindahan.detail' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/pindahan/{service}/detail',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@detailPindahan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@detailPindahan',
        'as' => 'customer.services.pindahan.detail',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.pindahan.invoice' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/pindahan/{order}/invoice',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@invoicePindahan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@invoicePindahan',
        'as' => 'customer.services.pindahan.invoice',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.kendaraan.form' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/kendaraan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@formKendaraan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@formKendaraan',
        'as' => 'customer.services.kendaraan.form',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.kendaraan.search' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/kendaraan/search',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@search',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@search',
        'as' => 'customer.services.kendaraan.search',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.kendaraan.form.pesan' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/kendaraan/pesan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@formPesanKendaraan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@formPesanKendaraan',
        'as' => 'customer.services.kendaraan.form.pesan',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.kendaraan.detail' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/kendaraan/{service}/detail',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@detailKendaraan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@detailKendaraan',
        'as' => 'customer.services.kendaraan.detail',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.kendaraan.pesan' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/kendaraan/{service}/titip',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@pesanKendaraan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@pesanKendaraan',
        'as' => 'customer.services.kendaraan.pesan',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.kendaraan.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/services/kendaraan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@simpanKendaraan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@simpanKendaraan',
        'as' => 'customer.services.kendaraan.store',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.kendaraan.invoice' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/kendaraan/{order}/invoice',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@invoiceKendaraan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@invoiceKendaraan',
        'as' => 'customer.services.kendaraan.invoice',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.pindahan.pesan' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/pindahan/{service}/titip',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:0:{}s:8:"function";s:95:"fn (\\App\\Models\\Service $service) => \\redirect()->route(\'customer.services.show\', $service->id)";s:5:"scope";s:37:"Illuminate\\Routing\\RouteFileRegistrar";s:4:"this";N;s:4:"self";s:32:"00000000000008110000000000000000";}}',
        'as' => 'customer.services.pindahan.pesan',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/{service}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@show',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@show',
        'as' => 'customer.services.show',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.pesan' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/services/{service}/pesan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@storePesanan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@storePesanan',
        'as' => 'customer.services.pesan',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.metodePembayaranLayanan' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/services/{service}/metode-pembayaran',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@metodePembayaranLayanan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@metodePembayaranLayanan',
        'as' => 'customer.services.metodePembayaranLayanan',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.services.konfirmasiLayanan' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/services/{service}/konfirmasi',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ServiceController@konfirmasiLayanan',
        'controller' => 'App\\Http\\Controllers\\Customer\\ServiceController@konfirmasiLayanan',
        'as' => 'customer.services.konfirmasiLayanan',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.berita.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/berita',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\BeritaController@index',
        'controller' => 'App\\Http\\Controllers\\Customer\\BeritaController@index',
        'as' => 'customer.berita.index',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.berita.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/berita/{berita}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\BeritaController@show',
        'controller' => 'App\\Http\\Controllers\\Customer\\BeritaController@show',
        'as' => 'customer.berita.show',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/orders',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\OrderController@index',
        'controller' => 'App\\Http\\Controllers\\Customer\\OrderController@index',
        'as' => 'customer.orders.index',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/orders/{order}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\OrderController@show',
        'controller' => 'App\\Http\\Controllers\\Customer\\OrderController@show',
        'as' => 'customer.orders.show',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.batalkan' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'app/orders/{order}/batalkan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\OrderController@cancel',
        'controller' => 'App\\Http\\Controllers\\Customer\\OrderController@cancel',
        'as' => 'customer.orders.batalkan',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.review' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/orders/{order}/review',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\OrderController@review',
        'controller' => 'App\\Http\\Controllers\\Customer\\OrderController@review',
        'as' => 'customer.orders.review',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.ajukanPengambilan' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'app/orders/{order}/ajukan-pengambilan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\OrderController@requestPickup',
        'controller' => 'App\\Http\\Controllers\\Customer\\OrderController@requestPickup',
        'as' => 'customer.orders.ajukanPengambilan',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.lapor' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/orders/{order}/lapor',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ReportController@create',
        'controller' => 'App\\Http\\Controllers\\Customer\\ReportController@create',
        'as' => 'customer.orders.lapor',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.lapor.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/orders/{order}/lapor',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ReportController@store',
        'controller' => 'App\\Http\\Controllers\\Customer\\ReportController@store',
        'as' => 'customer.orders.lapor.store',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.success' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/orders/{order}/sukses',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\OrderController@success',
        'controller' => 'App\\Http\\Controllers\\Customer\\OrderController@success',
        'as' => 'customer.orders.success',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.pembayaran' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/orders/{order}/pembayaran',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\OrderController@pembayaran',
        'controller' => 'App\\Http\\Controllers\\Customer\\OrderController@pembayaran',
        'as' => 'customer.orders.pembayaran',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.buktiPembayaran' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/orders/{order}/bukti-pembayaran',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\OrderController@buktiPembayaran',
        'controller' => 'App\\Http\\Controllers\\Customer\\OrderController@buktiPembayaran',
        'as' => 'customer.orders.buktiPembayaran',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.uploadBukti' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/orders/{order}/upload-bukti',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\OrderController@uploadBukti',
        'controller' => 'App\\Http\\Controllers\\Customer\\OrderController@uploadBukti',
        'as' => 'customer.orders.uploadBukti',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.bayarSaldo' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/orders/{order}/bayar-saldo',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\OrderController@bayarSaldo',
        'controller' => 'App\\Http\\Controllers\\Customer\\OrderController@bayarSaldo',
        'as' => 'customer.orders.bayarSaldo',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.bayarDenda' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/orders/{order}/bayar-denda',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\OrderController@bayarDenda',
        'controller' => 'App\\Http\\Controllers\\Customer\\OrderController@bayarDenda',
        'as' => 'customer.orders.bayarDenda',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.uploadBuktiDenda' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/orders/{order}/upload-bukti-denda',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\OrderController@uploadBuktiDenda',
        'controller' => 'App\\Http\\Controllers\\Customer\\OrderController@uploadBuktiDenda',
        'as' => 'customer.orders.uploadBuktiDenda',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.extend.form' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/orders/{order}/extend',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\OrderController@extendForm',
        'controller' => 'App\\Http\\Controllers\\Customer\\OrderController@extendForm',
        'as' => 'customer.orders.extend.form',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.extend.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/orders/{order}/extend',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\OrderController@extendStore',
        'controller' => 'App\\Http\\Controllers\\Customer\\OrderController@extendStore',
        'as' => 'customer.orders.extend.store',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.extend.invoice' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/orders/{order}/extend/invoice',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\OrderController@extendInvoice',
        'controller' => 'App\\Http\\Controllers\\Customer\\OrderController@extendInvoice',
        'as' => 'customer.orders.extend.invoice',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.extend.bayarSaldo' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/orders/{order}/extend/bayar-saldo',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\OrderController@extendBayarSaldo',
        'controller' => 'App\\Http\\Controllers\\Customer\\OrderController@extendBayarSaldo',
        'as' => 'customer.orders.extend.bayarSaldo',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.extend.uploadBukti' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/orders/{order}/extend/upload-bukti',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\OrderController@extendUploadBukti',
        'controller' => 'App\\Http\\Controllers\\Customer\\OrderController@extendUploadBukti',
        'as' => 'customer.orders.extend.uploadBukti',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.klaim.create' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/orders/{order}/klaim',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ClaimController@create',
        'controller' => 'App\\Http\\Controllers\\Customer\\ClaimController@create',
        'as' => 'customer.orders.klaim.create',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.orders.klaim.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/orders/{order}/klaim',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ClaimController@store',
        'controller' => 'App\\Http\\Controllers\\Customer\\ClaimController@store',
        'as' => 'customer.orders.klaim.store',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.klaim.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/klaim/{claim}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ClaimController@show',
        'controller' => 'App\\Http\\Controllers\\Customer\\ClaimController@show',
        'as' => 'customer.klaim.show',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.notifikasi.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/notifikasi',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\NotifikasiController@index',
        'controller' => 'App\\Http\\Controllers\\Customer\\NotifikasiController@index',
        'as' => 'customer.notifikasi.index',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.notifikasi.read' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'app/notifikasi/{notifikasi}/read',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\NotifikasiController@markAsRead',
        'controller' => 'App\\Http\\Controllers\\Customer\\NotifikasiController@markAsRead',
        'as' => 'customer.notifikasi.read',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/profile',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ProfileController@index',
        'controller' => 'App\\Http\\Controllers\\Customer\\ProfileController@index',
        'as' => 'customer.profile.index',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.edit' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/profile/edit',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ProfileController@edit',
        'controller' => 'App\\Http\\Controllers\\Customer\\ProfileController@edit',
        'as' => 'customer.profile.edit',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'app/profile',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\ProfileController@update',
        'controller' => 'App\\Http\\Controllers\\Customer\\ProfileController@update',
        'as' => 'customer.profile.update',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.bantuan' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/profile/bantuan    ',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\BantuanController@index',
        'controller' => 'App\\Http\\Controllers\\Customer\\BantuanController@index',
        'as' => 'customer.profile.bantuan',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.tentang' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/profile/tentang',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\TentangController@index',
        'controller' => 'App\\Http\\Controllers\\Customer\\TentangController@index',
        'as' => 'customer.profile.tentang',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.tentang.syarat' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/profile/tentang/syarat-ketentuan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\TentangController@syaratKetentuan',
        'controller' => 'App\\Http\\Controllers\\Customer\\TentangController@syaratKetentuan',
        'as' => 'customer.profile.tentang.syarat',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.tentang.privasi' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/profile/tentang/kebijakan-privasi',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\TentangController@kebijakanPrivasi',
        'controller' => 'App\\Http\\Controllers\\Customer\\TentangController@kebijakanPrivasi',
        'as' => 'customer.profile.tentang.privasi',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.keamanan' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/profile/keamanan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\SecurityController@edit',
        'controller' => 'App\\Http\\Controllers\\Customer\\SecurityController@edit',
        'as' => 'customer.profile.keamanan',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.keamanan.password.edit' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/profile/keamanan/password',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\SecurityController@editPassword',
        'controller' => 'App\\Http\\Controllers\\Customer\\SecurityController@editPassword',
        'as' => 'customer.profile.keamanan.password.edit',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.keamanan.password' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'app/profile/keamanan/password',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\SecurityController@updatePassword',
        'controller' => 'App\\Http\\Controllers\\Customer\\SecurityController@updatePassword',
        'as' => 'customer.profile.keamanan.password',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.keamanan.pin.edit' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/profile/keamanan/pin',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\SecurityController@editPin',
        'controller' => 'App\\Http\\Controllers\\Customer\\SecurityController@editPin',
        'as' => 'customer.profile.keamanan.pin.edit',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.keamanan.pin' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'app/profile/keamanan/pin',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\SecurityController@updatePin',
        'controller' => 'App\\Http\\Controllers\\Customer\\SecurityController@updatePin',
        'as' => 'customer.profile.keamanan.pin',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.alamat.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/profile/alamat',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\AddressController@index',
        'controller' => 'App\\Http\\Controllers\\Customer\\AddressController@index',
        'as' => 'customer.profile.alamat.index',
        'namespace' => NULL,
        'prefix' => 'app/profile/alamat',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.alamat.create' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/profile/alamat/tambah',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\AddressController@create',
        'controller' => 'App\\Http\\Controllers\\Customer\\AddressController@create',
        'as' => 'customer.profile.alamat.create',
        'namespace' => NULL,
        'prefix' => 'app/profile/alamat',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.alamat.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/profile/alamat',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\AddressController@store',
        'controller' => 'App\\Http\\Controllers\\Customer\\AddressController@store',
        'as' => 'customer.profile.alamat.store',
        'namespace' => NULL,
        'prefix' => 'app/profile/alamat',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.alamat.edit' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/profile/alamat/{alamat}/edit',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\AddressController@edit',
        'controller' => 'App\\Http\\Controllers\\Customer\\AddressController@edit',
        'as' => 'customer.profile.alamat.edit',
        'namespace' => NULL,
        'prefix' => 'app/profile/alamat',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.alamat.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'app/profile/alamat/{alamat}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\AddressController@update',
        'controller' => 'App\\Http\\Controllers\\Customer\\AddressController@update',
        'as' => 'customer.profile.alamat.update',
        'namespace' => NULL,
        'prefix' => 'app/profile/alamat',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.profile.alamat.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'app/profile/alamat/{alamat}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\AddressController@destroy',
        'controller' => 'App\\Http\\Controllers\\Customer\\AddressController@destroy',
        'as' => 'customer.profile.alamat.destroy',
        'namespace' => NULL,
        'prefix' => 'app/profile/alamat',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.topup.create' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/saldo/topup',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\TopUpController@create',
        'controller' => 'App\\Http\\Controllers\\Customer\\TopUpController@create',
        'as' => 'customer.topup.create',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.topup.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/saldo/topup',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\TopUpController@store',
        'controller' => 'App\\Http\\Controllers\\Customer\\TopUpController@store',
        'as' => 'customer.topup.store',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.topup.instruksi' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/saldo/topup/{topup}/instruksi',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\TopUpController@instruksi',
        'controller' => 'App\\Http\\Controllers\\Customer\\TopUpController@instruksi',
        'as' => 'customer.topup.instruksi',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.topup.konfirmasi' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'app/saldo/topup/{topup}/konfirmasi',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\TopUpController@konfirmasi',
        'controller' => 'App\\Http\\Controllers\\Customer\\TopUpController@konfirmasi',
        'as' => 'customer.topup.konfirmasi',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.topup.menunggu' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/saldo/topup/{topup}/menunggu',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\TopUpController@menunggu',
        'controller' => 'App\\Http\\Controllers\\Customer\\TopUpController@menunggu',
        'as' => 'customer.topup.menunggu',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.topup.sukses' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/saldo/topup/{topup}/sukses',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\TopUpController@sukses',
        'controller' => 'App\\Http\\Controllers\\Customer\\TopUpController@sukses',
        'as' => 'customer.topup.sukses',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.topup.riwayat' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'app/saldo/riwayat',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\TopUpController@riwayat',
        'controller' => 'App\\Http\\Controllers\\Customer\\TopUpController@riwayat',
        'as' => 'customer.topup.riwayat',
        'namespace' => NULL,
        'prefix' => '/app',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.lengkapi-data.intro' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'lengkapi-data',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\LengkapiDataController@intro',
        'controller' => 'App\\Http\\Controllers\\Customer\\LengkapiDataController@intro',
        'as' => 'customer.lengkapi-data.intro',
        'namespace' => NULL,
        'prefix' => '/lengkapi-data',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.lengkapi-data.form' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'lengkapi-data/form',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\LengkapiDataController@form',
        'controller' => 'App\\Http\\Controllers\\Customer\\LengkapiDataController@form',
        'as' => 'customer.lengkapi-data.form',
        'namespace' => NULL,
        'prefix' => '/lengkapi-data',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.lengkapi-data.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'lengkapi-data',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\LengkapiDataController@store',
        'controller' => 'App\\Http\\Controllers\\Customer\\LengkapiDataController@store',
        'as' => 'customer.lengkapi-data.store',
        'namespace' => NULL,
        'prefix' => '/lengkapi-data',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'generated::1WL36yKz8qlUiNIi' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/wilayah/provinces',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
        ),
        'uses' => 'App\\Http\\Controllers\\WilayahController@provinces',
        'controller' => 'App\\Http\\Controllers\\WilayahController@provinces',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'generated::1WL36yKz8qlUiNIi',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'generated::ya2QToUnRFE8xssu' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/wilayah/regencies/{provinceId}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
        ),
        'uses' => 'App\\Http\\Controllers\\WilayahController@regencies',
        'controller' => 'App\\Http\\Controllers\\WilayahController@regencies',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'generated::ya2QToUnRFE8xssu',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'generated::LkkPnWyeChQ6G8ox' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/wilayah/districts/{regencyId}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
        ),
        'uses' => 'App\\Http\\Controllers\\WilayahController@districts',
        'controller' => 'App\\Http\\Controllers\\WilayahController@districts',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'generated::LkkPnWyeChQ6G8ox',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.pin.create' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'buat-pin',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\PinController@create',
        'controller' => 'App\\Http\\Controllers\\Customer\\PinController@create',
        'as' => 'customer.pin.create',
        'namespace' => NULL,
        'prefix' => '/buat-pin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'customer.pin.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'buat-pin',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:customer',
        ),
        'uses' => 'App\\Http\\Controllers\\Customer\\PinController@store',
        'controller' => 'App\\Http\\Controllers\\Customer\\PinController@store',
        'as' => 'customer.pin.store',
        'namespace' => NULL,
        'prefix' => '/buat-pin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.kota.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/kota',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'as' => 'super-admin.kota.index',
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\KotaController@index',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\KotaController@index',
        'namespace' => NULL,
        'prefix' => '/super-admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.kota.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'super-admin/kota',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'as' => 'super-admin.kota.store',
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\KotaController@store',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\KotaController@store',
        'namespace' => NULL,
        'prefix' => '/super-admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.kota.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'super-admin/kota/{kotum}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'as' => 'super-admin.kota.update',
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\KotaController@update',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\KotaController@update',
        'namespace' => NULL,
        'prefix' => '/super-admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.kota.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'super-admin/kota/{kotum}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'as' => 'super-admin.kota.destroy',
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\KotaController@destroy',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\KotaController@destroy',
        'namespace' => NULL,
        'prefix' => '/super-admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.layanan.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/layanan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\ServiceController@index',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\ServiceController@index',
        'as' => 'super-admin.layanan.index',
        'namespace' => NULL,
        'prefix' => '/super-admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.layanan.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/layanan/{layanan}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\ServiceController@show',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\ServiceController@show',
        'as' => 'super-admin.layanan.show',
        'namespace' => NULL,
        'prefix' => '/super-admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.layanan.updateStatus' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'super-admin/layanan/{layanan}/status',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\ServiceController@updateStatus',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\ServiceController@updateStatus',
        'as' => 'super-admin.layanan.updateStatus',
        'namespace' => NULL,
        'prefix' => '/super-admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.layanan.toggleActive' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'super-admin/layanan/{layanan}/toggle-active',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\ServiceController@toggleActive',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\ServiceController@toggleActive',
        'as' => 'super-admin.layanan.toggleActive',
        'namespace' => NULL,
        'prefix' => '/super-admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.layanan.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'super-admin/layanan/{layanan}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\ServiceController@destroy',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\ServiceController@destroy',
        'as' => 'super-admin.layanan.destroy',
        'namespace' => NULL,
        'prefix' => '/super-admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.profil.edit' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/profil',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\ProfileController@edit',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\ProfileController@edit',
        'as' => 'super-admin.profil.edit',
        'namespace' => NULL,
        'prefix' => '/super-admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.profil.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'super-admin/profil',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\ProfileController@update',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\ProfileController@update',
        'as' => 'super-admin.profil.update',
        'namespace' => NULL,
        'prefix' => '/super-admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.profil.avatar.update' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'super-admin/profil/avatar',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\ProfileController@updateAvatar',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\ProfileController@updateAvatar',
        'as' => 'super-admin.profil.avatar.update',
        'namespace' => NULL,
        'prefix' => '/super-admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.profil.sessions.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'super-admin/profil/sesi/{sessionId}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\ProfileController@destroySession',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\ProfileController@destroySession',
        'as' => 'super-admin.profil.sessions.destroy',
        'namespace' => NULL,
        'prefix' => '/super-admin',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.user.customer.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/user/customer',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@customerIndex',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@customerIndex',
        'as' => 'super-admin.user.customer.index',
        'namespace' => NULL,
        'prefix' => '/super-admin/user',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.user.customer.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/user/customer/{user}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@customerShow',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@customerShow',
        'as' => 'super-admin.user.customer.show',
        'namespace' => NULL,
        'prefix' => '/super-admin/user',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.user.customer.updateStatus' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'super-admin/user/customer/{user}/status',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@updateCustomerStatus',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@updateCustomerStatus',
        'as' => 'super-admin.user.customer.updateStatus',
        'namespace' => NULL,
        'prefix' => '/super-admin/user',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.user.vendor.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/user/vendor',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@vendorIndex',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@vendorIndex',
        'as' => 'super-admin.user.vendor.index',
        'namespace' => NULL,
        'prefix' => '/super-admin/user',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.user.vendor.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/user/vendor/{partner}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@vendorShow',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@vendorShow',
        'as' => 'super-admin.user.vendor.show',
        'namespace' => NULL,
        'prefix' => '/super-admin/user',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.user.vendor.updateStatus' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'super-admin/user/vendor/{partner}/status',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@updateVendorStatus',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@updateVendorStatus',
        'as' => 'super-admin.user.vendor.updateStatus',
        'namespace' => NULL,
        'prefix' => '/super-admin/user',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.user.vendor.updateServiceStatus' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'super-admin/user/vendor/{partner}/services/{service}/status',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@updateVendorServiceStatus',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@updateVendorServiceStatus',
        'as' => 'super-admin.user.vendor.updateServiceStatus',
        'namespace' => NULL,
        'prefix' => '/super-admin/user',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.user.vendor.restore' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'super-admin/user/vendor/{partner}/restore',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@restoreVendor',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@restoreVendor',
        'as' => 'super-admin.user.vendor.restore',
        'namespace' => NULL,
        'prefix' => '/super-admin/user',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.user.finance.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/user/finance',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@financeIndex',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@financeIndex',
        'as' => 'super-admin.user.finance.index',
        'namespace' => NULL,
        'prefix' => '/super-admin/user',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.user.finance.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/user/finance/{user}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@financeShow',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@financeShow',
        'as' => 'super-admin.user.finance.show',
        'namespace' => NULL,
        'prefix' => '/super-admin/user',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.user.admin.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/user/admin',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@adminIndex',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@adminIndex',
        'as' => 'super-admin.user.admin.index',
        'namespace' => NULL,
        'prefix' => '/super-admin/user',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.user.admin.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/user/admin/{user}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@adminShow',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@adminShow',
        'as' => 'super-admin.user.admin.show',
        'namespace' => NULL,
        'prefix' => '/super-admin/user',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.user.toggleActive' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'super-admin/user/{user}/toggle-active',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@toggleActive',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@toggleActive',
        'as' => 'super-admin.user.toggleActive',
        'namespace' => NULL,
        'prefix' => '/super-admin/user',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.user.create' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/user/tambah',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@create',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@create',
        'as' => 'super-admin.user.create',
        'namespace' => NULL,
        'prefix' => '/super-admin/user',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.user.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'super-admin/user/tambah',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@store',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@store',
        'as' => 'super-admin.user.store',
        'namespace' => NULL,
        'prefix' => '/super-admin/user',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.user.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'super-admin/user/{user}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@destroy',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\UserController@destroy',
        'as' => 'super-admin.user.destroy',
        'namespace' => NULL,
        'prefix' => '/super-admin/user',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pesanan.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/pesanan',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\OrderController@index',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\OrderController@index',
        'as' => 'super-admin.pesanan.index',
        'namespace' => NULL,
        'prefix' => '/super-admin/pesanan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pesanan.updateStatus' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'super-admin/pesanan/{order}/status',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\OrderController@updateStatus',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\OrderController@updateStatus',
        'as' => 'super-admin.pesanan.updateStatus',
        'namespace' => NULL,
        'prefix' => '/super-admin/pesanan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pesanan.approveDenda' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'super-admin/pesanan/{order}/approve-denda',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\OrderController@approveDenda',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\OrderController@approveDenda',
        'as' => 'super-admin.pesanan.approveDenda',
        'namespace' => NULL,
        'prefix' => '/super-admin/pesanan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pesanan.konfirmasiCash' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'super-admin/pesanan/{order}/konfirmasi-cash',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\OrderController@confirmCashPayment',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\OrderController@confirmCashPayment',
        'as' => 'super-admin.pesanan.konfirmasiCash',
        'namespace' => NULL,
        'prefix' => '/super-admin/pesanan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pesanan.cancelOrder' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'super-admin/pesanan/{order}/cancel-order',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\OrderController@cancelOrder',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\OrderController@cancelOrder',
        'as' => 'super-admin.pesanan.cancelOrder',
        'namespace' => NULL,
        'prefix' => '/super-admin/pesanan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pesanan.bulkDestroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'super-admin/pesanan/bulk-delete',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\OrderController@bulkDestroy',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\OrderController@bulkDestroy',
        'as' => 'super-admin.pesanan.bulkDestroy',
        'namespace' => NULL,
        'prefix' => '/super-admin/pesanan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.pesanan.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'super-admin/pesanan/{order}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\OrderController@destroy',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\OrderController@destroy',
        'as' => 'super-admin.pesanan.destroy',
        'namespace' => NULL,
        'prefix' => '/super-admin/pesanan',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.sampah.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'super-admin/sampah',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\TrashController@index',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\TrashController@index',
        'as' => 'super-admin.sampah.index',
        'namespace' => NULL,
        'prefix' => '/super-admin/sampah',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.sampah.restore' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'super-admin/sampah/{type}/{id}/restore',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\TrashController@restore',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\TrashController@restore',
        'as' => 'super-admin.sampah.restore',
        'namespace' => NULL,
        'prefix' => '/super-admin/sampah',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'super-admin.sampah.forceDelete' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'super-admin/sampah/{type}/{id}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'auth',
          2 => 'role:super_admin',
        ),
        'uses' => 'App\\Http\\Controllers\\SuperAdmin\\TrashController@forceDelete',
        'controller' => 'App\\Http\\Controllers\\SuperAdmin\\TrashController@forceDelete',
        'as' => 'super-admin.sampah.forceDelete',
        'namespace' => NULL,
        'prefix' => '/super-admin/sampah',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'storage.local' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'storage/{path}',
      'action' => 
      array (
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:3:{s:4:"disk";s:5:"local";s:6:"config";a:5:{s:6:"driver";s:5:"local";s:4:"root";s:70:"C:\\Users\\Siti Mintarsih\\Documents\\GitHub\\Titipsini\\storage\\app/private";s:5:"serve";b:1;s:5:"throw";b:0;s:6:"report";b:0;}s:12:"isProduction";b:0;}s:8:"function";s:323:"function (\\Illuminate\\Http\\Request $request, string $path) use ($disk, $config, $isProduction) {
                    return (new \\Illuminate\\Filesystem\\ServeFile(
                        $disk,
                        $config,
                        $isProduction
                    ))($request, $path);
                }";s:5:"scope";s:47:"Illuminate\\Filesystem\\FilesystemServiceProvider";s:4:"this";N;s:4:"self";s:32:"000000000000084e0000000000000000";}}',
        'as' => 'storage.local',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
        'path' => '.*',
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
  ),
)
);
