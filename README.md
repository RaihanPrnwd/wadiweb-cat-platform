# Wadiweb CAT (`cat.wadiweb.my.id`)

Aplikasi web landing page promosi, simulasi ujian CAT (Computer Assisted Test) interaktif dengan proctoring Anti-Cheat, dan asisten konsultasi "Derema" untuk bimbingan belajar TNI, Polri, Sekolah Kedinasan, CPNS, serta akademik bagi brand **Wadiweb CAT** (`cat.wadiweb.my.id` — bagian dari `wadiweb.my.id`).

## Struktur Proyek

```text
CAT/
├── .gitignore         # Filter file rahasia, arsip zip, log, dan file OS/editor
├── index.html         # Halaman utama landing page & workspace ujian CAT
├── style.css          # Styling profesional & responsif multi-resolusi
├── app.js             # Logika interaktif simulasi, anti-cheat, kalkulasi & chat Derema
├── data.js            # Konfigurasi publik brand, katalog spek/paket, & bank soal demo dummy
├── chatKnowledge.js   # Basis pengetahuan, intent matching, & ringkasan konsultasi Derema
├── test.mjs           # Automated test suite (skor, link WhatsApp, spek, responsivitas)
├── assets/            # Aset visual resmi (favicon, logo light/dark, visual brand)
└── public/images/     # Aset publik (avatar resmi Derema)
```

## Fitur Utama

- **Katalog Spek Server & Paket**: 3 tingkat spesifikasi VPS NVMe (2 GB / 4 GB / 8 GB RAM) dengan batasan peserta aktif bersamaan (75 / 200 / 500) dan 4 opsi durasi hemat.
- **Demo Simulasi Ruang Ujian**: 8 soal pilihan ganda dummy (SKD, TWK, TIU, TPA, Penalaran), timer mundur real-time, navigasi ragu-ragu, dan rekap pembahasan instan.
- **Sistem Keamanan & Anti-Cheat**: Deteksi pindah tab (*tab-switch/blur*), pencegahan klik kanan, blok seleksi/copy-paste, dan perlindungan autosave lokal.
- **Asisten Chat "Derema"**: Widget floating responsif dengan knowledge base paket, FAQ, dan generator pesan WhatsApp resmi ke admin (`6285133383215`).

## Menjalankan di Lokal

Aplikasi menggunakan Web Standards murni (HTML5, Vanilla CSS, dan Native ES Modules) tanpa build tool:

1. **Jalankan server HTTP lokal**:
   ```powershell
   npx serve .
   # atau menggunakan Python:
   python -m http.server 8080
   ```
2. Buka `http://localhost:8080` pada peramban web.
3. **Menjalankan Automated Tests**:
   ```powershell
   node test.mjs
   ```

## Keamanan Repositori Publik

- Tidak ada kredensial, API key, token rahasia, password database, atau server private keys.
- Seluruh bank soal di repositori ini adalah data contoh/dummy terbuka untuk keperluan demonstrasi UI/UX. Bank soal bimbel riil dikelola mandiri oleh klien pada instalasi server CAT masing-masing.
- File arsip `.zip` dan file sementara telah diabaikan melalui `.gitignore`.

## Deployment ke `cat.wadiweb.my.id`

Unggah seluruh file di root repositori langsung ke document root subdomain `cat.wadiweb.my.id` di hosting cPanel / web server (Nginx/Apache). Tidak memerlukan compile/transpile.
