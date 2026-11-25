# Wadiweb CAT Platform (`cat.wadiweb.my.id`)

Landing page promosi, katalog paket cloud VPS, simulator ujian Computer Assisted Test (CAT) interaktif dengan sistem pengawasan Anti-Cheat terpadu, dan asisten chat konsultasi resmi **"Derema"** untuk bimbingan belajar seleksi TNI, Polri, Sekolah Kedinasan, CPNS, serta tryout akademik sekolah.

Platform ini di-host pada subdomain [cat.wadiweb.my.id](https://cat.wadiweb.my.id) sebagai bagian dari layanan [wadiweb.my.id](https://wadiweb.my.id).

---

## Fitur Utama

- **Katalog Spesifikasi Server & Paket Fleksibel**:
  - Pilihan Cloud SSD NVMe berbasis batas kapasitas peserta aktif bersamaan (*concurrency*):
    - **Spek 2 GB RAM (2 Core CPU, 30 GB NVMe)**: Maks. 75 peserta aktif bersamaan (mulai Rp 299.000/bulan).
    - **Spek 4 GB RAM (3 Core CPU, 60 GB NVMe)**: Maks. 200 peserta aktif bersamaan (mulai Rp 549.000/bulan).
    - **Spek 8 GB RAM (4 Core CPU, 100 GB NVMe)**: Maks. 500 peserta aktif bersamaan (mulai Rp 1.099.000/bulan).
  - Skema durasi hemat (1 Bulan, 3 Bulan, 6 Bulan, dan 1 Tahun) lengkap dengan harga coret dan kalkulasi selisih hemat.
- **Simulator Ujian CAT Interaktif**:
  - Ruang simulasi ujian mandiri tanpa registrasi rumit.
  - 8 soal demo dummy lintas materi tes (TWK, TIU, TPA, Penalaran Analitis, Pancasila, Penalaran Figural).
  - Countdown timer presisi (15 menit), navigasi nomor soal dengan status terjawab/ragu-ragu/kosong, tombol reset jawaban, dan rekap skor instan beserta kunci dan pembahasan.
- **Sistem Keamanan & Anti-Cheat Terpadu**:
  - **Tab-Switch & Blur Detection**: Mendeteksi saat peserta beralih tab atau meminimalkan jendela browser, memunculkan notifikasi peringatan, dan menghitung frekuensi pelanggaran.
  - **Content Protection**: Menonaktifkan klik kanan (*context menu*), blok seleksi teks soal, dan pencegahan shortcut inspeksi/salin (`Ctrl+C`, `Ctrl+V`, `Ctrl+U`, `F12`, DevTools).
  - **Data Integrity & Autosave**: Jawaban disimpan real-time ke peramban (`sessionStorage`) untuk mencegah data hilang saat koneksi tidak stabil.
- **Asisten Chat Resmi "Derema"**:
  - Floating chat assistant beridentitas korporat resmi dengan foto avatar profesional (`public/images/derema-avatar.svg`).
  - Dilengkapi *Quick Replies* instan, pemahaman konteks paket, penanganan FAQ bimbel, dan generator rute konsultasi langsung ke WhatsApp Admin (`6285133383215`).
- **Desain Responsif Bebas Overflow**:
  - Dioptimasi menggunakan layout adaptif CSS Grid/Flexbox dan tipografi `clamp()` untuk smartphone kecil (320px–389px), mobile standar (390px–767px), tablet portrait/landscape (768px–1024px), laptop, hingga monitor desktop lebar (1440px–1920px+).

---

## Tech Stack

- **Markup & Struktur**: HTML5 Semantik (Open Graph & Twitter Cards terintegrasi).
- **Styling**: Vanilla CSS modern (CSS Custom Properties/Variables, Flexbox, Grid, Media Queries multi-resolusi).
- **Logika Aplikasi & Simulator**: Vanilla JavaScript (Modern ECMAScript / ES Modules murni tanpa transpiler/bundler eksternal).
- **Aset Grafis**: Vektor SVG (`assets/favicon.svg`, `assets/logo-wadiweb.svg`, `assets/logo-wadiweb-dark.svg`, `public/images/derema-avatar.svg`) dan JPEG (`assets/wadiweb-brand-identity.jpg`).
- **Pengujian**: Native Node.js Test Script (`test.mjs`) menggunakan modul bawaan `node:assert/strict` dan `node:fs`.

---

## Prasyarat

- **Untuk Menjalankan Aplikasi Web**:
  - Peramban web modern (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari) yang mendukung ES Modules dan Web Storage API.
  - *Local HTTP Server* (karena peramban membatasi pemuatan modul ES langsung lewat protokol `file:///`).
- **Untuk Menjalankan Automated Test**:
  - [Node.js](https://nodejs.org/) versi 18 atau lebih baru.

---

## Instalasi & Konfigurasi

Repositori ini tidak memerlukan instalasi *package manager* (`npm install` / `yarn` / `pnpm`) karena seluruh dependensi frontend berjalan secara native di browser.

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/RaihanPrnwd/wadiweb-cat-platform.git
   cd wadiweb-cat-platform
   ```

2. **File Environment (`.env`)**:
   - Proyek ini berjalan 100% sisi klien (*client-side static site*), sehingga **tidak memerlukan file `.env`** atau variabel lingkungan privat.
   - Seluruh pengaturan publik dikelola terpusat di `data.js`.

3. **Konfigurasi Brand & Kontak (`data.js`)**:
   Jika ingin menyesuaikan informasi lembaga atau nomor tujuan:
   - Nomor WhatsApp: Sunting nilai `BRAND_CONFIG.whatsappNumber` (format internasional, contoh: `"6285133383215"`).
   - Domain Layanan: Sunting `BRAND_CONFIG.targetDomain`.
   - Durasi Ujian Demo: Sunting `BRAND_CONFIG.demoDurationMinutes`.
   - Daftar Paket & Spek: Sunting array `SERVER_TIERS` dan generator `ALL_PACKAGES`.

---

## Cara Penggunaan

### 1. Menjalankan di Lingkungan Lokal
Jalankan server statis menggunakan alat bantu CLI favorit Anda:

- **Menggunakan Node.js `npx serve`**:
  ```bash
  npx serve .
  ```
- **Menggunakan Python 3**:
  ```bash
  python -m http.server 8080
  ```
- **Menggunakan PHP CLI**:
  ```bash
  php -S localhost:8080
  ```

Buka URL yang ditampilkan (misalnya `http://localhost:8080` atau `http://localhost:3000`) pada peramban web.

### 2. Menjalankan Pengujian Logika (Automated Unit Test)
Proyek dilengkapi berkas pengujian otomatis untuk memverifikasi kalkulasi nilai, integritas paket harga, logika konsultasi Derema, format link WhatsApp, dan integritas aset visual:

```bash
node test.mjs
```
*Hasil yang diharapkan: `ALL TESTS PASSED`.*

### 3. Deployment ke Subdomain (`cat.wadiweb.my.id`)
1. Siapkan direktori root subdomain pada hosting web (cPanel / DirectAdmin / VPS Nginx / Apache / Cloudflare Pages).
2. Unggah seluruh berkas proyek (`index.html`, `style.css`, `app.js`, `data.js`, `chatKnowledge.js`, `.gitignore`, folder `assets/`, dan folder `public/`) langsung ke direktori root subdomain tersebut.
3. Pastikan `index.html` berada pada posisi terluar (*root*). Tidak diperlukan tahapan kompilasi (*build process*).

---

## Struktur Folder

```text
wadiweb-cat-platform/
├── .gitignore         # Filter berkas lingkungan, arsip zip, log, dan artefak editor
├── README.md          # Dokumentasi teknis, arsitektur, dan panduan proyek
├── index.html         # Halaman utama landing page & workspace simulasi CAT
├── style.css          # Desain antarmuka responsif & sistem proteksi tampilan
├── app.js             # Orkestrasi simulator ujian, anti-cheat listener, dan widget chat
├── data.js            # Basis data konfigurasi paket VPS, spesifikasi, dan soal demo
├── chatKnowledge.js   # Basis pengetahuan & engine pencocokan pesan konsultasi Derema
├── test.mjs           # Unit test otomatis menggunakan modul assert bawaan Node.js
├── scripts/           # Skrip otomasi Git commit & push
│   ├── git-push.ps1     # Skrip PowerShell untuk Windows
│   └── git-push.sh      # Skrip Bash untuk Linux/macOS/Git Bash
├── assets/            # Aset visual brand Wadiweb
│   ├── favicon.svg              # Ikon tab peramban & shortcut
│   ├── logo-wadiweb.svg         # Logo utama brand (latar terang)
│   ├── logo-wadiweb-dark.svg    # Logo varian kontras tinggi (latar gelap)
│   └── wadiweb-brand-identity.jpg # Visual identitas brand untuk meta tag OG/Twitter
└── public/
    └── images/
        └── derema-avatar.svg    # Ilustrasi avatar resmi asisten chat Derema
```

---

## Kontribusi & Lisensi

- **Kontribusi**: Kontribusi perbaikan bug, penyempurnaan UI/UX, dan optimasi performa terbuka melalui *pull request*. Pastikan seluruh pengujian pada `node test.mjs` tetap berstatus lulus sebelum mengajukan perubahan.
- **Lisensi**:
  - `[PERLU VERIFIKASI]` **Lisensi belum ditentukan secara eksplisit**: Repositori ini saat ini belum menyertakan berkas lisensi resmi (`LICENSE` atau `LICENSE.md`).
  - Seluruh merek dagang, logo, dan identitas nama **Wadiweb** serta **Wadiweb CAT** merupakan hak milik dari pemilik layanan [wadiweb.my.id](https://wadiweb.my.id).
  - Soal-soal dalam modul demo merupakan data contoh simulasi terbuka dan tidak mencerminkan naskah rahasia instansi kedinasan manapun. Untuk penggunaan komersial atau integrasi sistem CAT bimbel resmi, silakan hubungi pengelola melalui portal [cat.wadiweb.my.id](https://cat.wadiweb.my.id).
