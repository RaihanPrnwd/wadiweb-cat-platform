// ponytail: static config module; upgrade ke REST API / JSON endpoint saat butuh CMS admin terpusat

export const BRAND_CONFIG = {
  name: "Wadiweb CAT",
  parentDomain: "wadiweb.my.id",
  targetDomain: "cat.wadiweb.my.id",
  whatsappNumber: "6285133383215", // Nomor WA resmi Admin Wadiweb CAT
  tagline: "Platform Simulasi CAT Serbaguna untuk Bimbel TNI, Polri, Sekolah Kedinasan & Akademik Umum",
  demoDurationMinutes: 15
};

export const FEATURES = [
  {
    title: "Tampilan Mirip Ujian CAT Resmi",
    desc: "Navigasi nomor soal warna-warni (hijau terjawab, kuning ragu-ragu, abu belum dijawab) dan countdown timer presisi standar BKN, TNI, Polri & Kedinasan."
  },
  {
    title: "Proteksi Anti-Cheat & Keamanan Ujian",
    desc: "Dilengkapi deteksi pindah tab/jendela, blok klik kanan & copy-paste naskah, validasi sesi anti-submit ganda, serta log peringatan otomatis."
  },
  {
    title: "Autosave Jawaban Instan",
    desc: "Jawaban peserta tersimpan otomatis di perangkat. Aman dari refresh tidak sengaja atau gangguan koneksi saat ujian massal."
  },
  {
    title: "Multi-Modul & Penilaian Otomatis",
    desc: "Mendukung SKD (TWK, TIU, TKP), TPA, Akademik, Psikologi/Kecermatan, hingga ujian sekolah & tryout umum dengan rekap nilai instan."
  }
];

// Fitur Resmi Wadiweb CAT Security & Anti-Cheat Suite
export const SECURITY_FEATURES = [
  {
    id: "tab-switch",
    title: "Deteksi Pindah Tab & Jendela Browser",
    badge: "Active Proctoring",
    desc: "Sistem mendeteksi saat peserta beralih tab, meminimalkan browser, atau membuka aplikasi lain, memicu peringatan otomatis & pencatatan log pelanggaran."
  },
  {
    id: "copy-paste",
    title: "Blokir Klik Kanan & Salin Teks Soal",
    badge: "Content Shield",
    desc: "Mencegah klik kanan (context menu), drag seleksi teks, shortcut salin/tempel (Ctrl+C/Ctrl+V), dan shortcut inspeksi umum selama ujian aktif."
  },
  {
    id: "session-lock",
    title: "Autosave Lokal & Anti-Submit Ganda",
    badge: "Data Integrity",
    desc: "Jawaban peserta disimpan otomatis tiap detik. Jika tab ter-refresh, posisi & jawaban tetap utuh serta dilindungi token submit sekali pakai."
  },
  {
    id: "cross-device",
    title: "Responsif Multi-Device & Mobile Safe",
    badge: "Cross-Platform",
    desc: "Dukungan penuh untuk smartphone, tablet, laptop, hingga PC lab sekolah dengan antarmuka ergonomis tanpa mengorbankan proteksi keamanan."
  }
];

// Struktur spek server & limit peserta aktif bersamaan dengan skema durasi (1 Bulan, 3 Bulan, 6 Bulan, 1 Tahun)
export const SERVER_TIERS = [
  {
    id: "spec-2gb",
    name: "Spek 2 GB RAM",
    badge: "Kelas Pemula / Event Terfokus",
    specs: "2 GB RAM | 2 Core CPU | 30 GB NVMe",
    limitLabel: "Maks. 75 peserta aktif bersamaan",
    shortSpec: "2GB RAM • 2 Core • 30GB NVMe",
    maxActive: 75,
    durations: [
      {
        id: "2gb-1bln",
        duration: "1 Bulan",
        price: "Rp 299.000",
        priceNum: 299000,
        originalPrice: "Rp 350.000",
        savingsBadge: "Hemat Rp 51.000",
        savingsDesc: "Hemat Rp 51.000 vs harga normal",
        popular: false,
        features: [
          "Maks. 75 peserta aktif bersamaan",
          "Spek: 2 GB RAM | 2 Core CPU | 30 GB NVMe",
          "Timer presisi & autosave jawaban instan",
          "Modul SKD, TPA, Psikologi & Akademik",
          "Export rekap nilai ke Excel/CSV",
          "Setup instan & siap pakai di subdomain"
        ]
      },
      {
        id: "2gb-3bln",
        duration: "3 Bulan",
        price: "Rp 699.000",
        priceNum: 699000,
        originalPrice: "Rp 897.000",
        savingsBadge: "Hemat Rp 198.000",
        savingsDesc: "Hemat Rp 198.000 vs harga coret & vs 3x 1 bulan",
        popular: true,
        features: [
          "Maks. 75 peserta aktif bersamaan",
          "Spek: 2 GB RAM | 2 Core CPU | 30 GB NVMe",
          "Program latihan intensif 3 bulan penuh",
          "Branding logo & nama bimbel Anda",
          "Upload bank soal via template Excel/Word",
          "Export nilai & kunci pembahasan lengkap"
        ]
      },
      {
        id: "2gb-6bln",
        duration: "6 Bulan",
        price: "Rp 1.299.000",
        priceNum: 1299000,
        originalPrice: "Rp 1.794.000",
        savingsBadge: "Hemat Rp 495.000",
        savingsDesc: "Hemat Rp 495.000 vs 6x 1 bln & Hemat Rp 99.000 vs 2x 3 bln",
        popular: false,
        features: [
          "Maks. 75 peserta aktif bersamaan",
          "Spek: 2 GB RAM | 2 Core CPU | 30 GB NVMe",
          "Program bimbingan 1 semester lengkap",
          "Analitik perkembangan nilai siswa berkala",
          "Custom subdomain khusus bimbel Anda",
          "Bantuan teknis upload bank soal awal"
        ]
      },
      {
        id: "2gb-1thn",
        duration: "1 Tahun",
        price: "Rp 2.299.000",
        priceNum: 2299000,
        originalPrice: "Rp 3.588.000",
        savingsBadge: "Hemat Rp 1.289.000",
        savingsDesc: "Hemat Rp 1.289.000 vs 12x 1 bln & Hemat Rp 299.000 vs 2x 6 bln",
        popular: false,
        features: [
          "Maks. 75 peserta aktif bersamaan",
          "Spek: 2 GB RAM | 2 Core CPU | 30 GB NVMe",
          "Akses penuh 1 tahun kalender ajaran",
          "Bank soal unlimited & sesi ujian tanpa batas",
          "Maintenance teknis prioritas selama 1 tahun",
          "Sertifikat & laporan perkembangan casis"
        ]
      }
    ]
  },
  {
    id: "spec-4gb",
    name: "Spek 4 GB RAM",
    badge: "Paling Populer Bimbel",
    specs: "4 GB RAM | 3 Core CPU | 60 GB NVMe",
    limitLabel: "Maks. 200 peserta aktif bersamaan",
    shortSpec: "4GB RAM • 3 Core • 60GB NVMe",
    maxActive: 200,
    durations: [
      {
        id: "4gb-1bln",
        duration: "1 Bulan",
        price: "Rp 549.000",
        priceNum: 549000,
        originalPrice: "Rp 650.000",
        savingsBadge: "Hemat Rp 101.000",
        savingsDesc: "Hemat Rp 101.000 vs harga normal",
        popular: false,
        features: [
          "Maks. 200 peserta aktif bersamaan",
          "Spek: 4 GB RAM | 3 Core CPU | 60 GB NVMe",
          "Stabil saat tryout serentak ratusan casis",
          "Semua kategori SKD, TPA, Psikotes & Kedinasan",
          "Export Excel rekap nilai & ranking instan",
          "Setup cepat 1x24 jam siap pakai"
        ]
      },
      {
        id: "4gb-3bln",
        duration: "3 Bulan",
        price: "Rp 1.449.000",
        priceNum: 1449000,
        originalPrice: "Rp 1.647.000",
        savingsBadge: "Hemat Rp 198.000",
        savingsDesc: "Hemat Rp 198.000 vs harga coret & vs 3x 1 bulan",
        popular: true,
        features: [
          "Maks. 200 peserta aktif bersamaan",
          "Spek: 4 GB RAM | 3 Core CPU | 60 GB NVMe",
          "Paket intensif 3 bulan pilihan utama bimbel",
          "Branding logo & nama bimbel pada portal ujian",
          "Upload bank soal mandiri via Excel/Word",
          "Analitik kelemahan materi siswa"
        ]
      },
      {
        id: "4gb-6bln",
        duration: "6 Bulan",
        price: "Rp 2.699.000",
        priceNum: 2699000,
        originalPrice: "Rp 3.294.000",
        savingsBadge: "Hemat Rp 595.000",
        savingsDesc: "Hemat Rp 595.000 vs 6x 1 bln & Hemat Rp 199.000 vs 2x 3 bln",
        popular: false,
        features: [
          "Maks. 200 peserta aktif bersamaan",
          "Spek: 4 GB RAM | 3 Core CPU | 60 GB NVMe",
          "Semester reguler TNI, Polri, IPDN, STAN",
          "Custom Subdomain khusus bimbel Anda",
          "Rekap grafik nilai berkala tiap bulan",
          "Bantuan teknis VIP & pendampingan awal"
        ]
      },
      {
        id: "4gb-1thn",
        duration: "1 Tahun",
        price: "Rp 4.799.000",
        priceNum: 4799000,
        originalPrice: "Rp 6.588.000",
        savingsBadge: "Hemat Rp 1.789.000",
        savingsDesc: "Hemat Rp 1.789.000 vs 12x 1 bln & Hemat Rp 599.000 vs 2x 6 bln",
        popular: false,
        features: [
          "Maks. 200 peserta aktif bersamaan",
          "Spek: 4 GB RAM | 3 Core CPU | 60 GB NVMe",
          "Solusi tahunan lengkap & super hemat",
          "Unlimited paket tryout & ribuan bank soal",
          "White-label domain bimbel (opsional)",
          "Dukungan teknis prioritas penuh 1 tahun"
        ]
      }
    ]
  },
  {
    id: "spec-8gb",
    name: "Spek 8 GB RAM",
    badge: "Kapasitas Besar / Multi-Cabang",
    specs: "8 GB RAM | 4 Core CPU | 100 GB NVMe",
    limitLabel: "Maks. 500 peserta aktif bersamaan",
    shortSpec: "8GB RAM • 4 Core • 100GB NVMe",
    maxActive: 500,
    durations: [
      {
        id: "8gb-1bln",
        duration: "1 Bulan",
        price: "Rp 1.099.000",
        priceNum: 1099000,
        originalPrice: "Rp 1.299.000",
        savingsBadge: "Hemat Rp 200.000",
        savingsDesc: "Hemat Rp 200.000 vs harga normal",
        popular: false,
        features: [
          "Maks. 500 peserta aktif bersamaan",
          "Spek: 8 GB RAM | 4 Core CPU | 100 GB NVMe",
          "High concurrency untuk tryout akbar serentak",
          "Dukungan ribuan soal & ratusan peserta live",
          "Export data instan format Excel/CSV",
          "Setup server dedicated cloud"
        ]
      },
      {
        id: "8gb-3bln",
        duration: "3 Bulan",
        price: "Rp 2.899.000",
        priceNum: 2899000,
        originalPrice: "Rp 3.297.000",
        savingsBadge: "Hemat Rp 398.000",
        savingsDesc: "Hemat Rp 398.000 vs harga coret & vs 3x 1 bulan",
        popular: true,
        features: [
          "Maks. 500 peserta aktif bersamaan",
          "Spek: 8 GB RAM | 4 Core CPU | 100 GB NVMe",
          "Tryout intensif cabang & kemitraan besar",
          "Branding penuh logo bimbel / sekolah",
          "Kustom passing grade & pembobotan khusus",
          "Laporan analitik siswa komprehensif"
        ]
      },
      {
        id: "8gb-6bln",
        duration: "6 Bulan",
        price: "Rp 5.499.000",
        priceNum: 5499000,
        originalPrice: "Rp 6.594.000",
        savingsBadge: "Hemat Rp 1.095.000",
        savingsDesc: "Hemat Rp 1.095.000 vs 6x 1 bln & Hemat Rp 299.000 vs 2x 3 bln",
        popular: false,
        features: [
          "Maks. 500 peserta aktif bersamaan",
          "Spek: 8 GB RAM | 4 Core CPU | 100 GB NVMe",
          "Bimbingan 1 semester multi-cabang",
          "Custom Subdomain / Domain bimbel sendiri",
          "Integrasi data siswa & cetak rapor PDF",
          "Pendampingan teknis prioritas"
        ]
      },
      {
        id: "8gb-1thn",
        duration: "1 Tahun",
        price: "Rp 9.899.000",
        priceNum: 9899000,
        originalPrice: "Rp 13.188.000",
        savingsBadge: "Hemat Rp 3.289.000",
        savingsDesc: "Hemat Rp 3.289.000 vs 12x 1 bln & Hemat Rp 1.099.000 vs 2x 6 bln",
        popular: false,
        features: [
          "Maks. 500 peserta aktif bersamaan",
          "Spek: 8 GB RAM | 4 Core CPU | 100 GB NVMe",
          "Paket tahunan dedicated enterprise",
          "White-label penuh di domain bimbel sendiri",
          "Unlimited bank soal & seluruh cabang aktif",
          "Pendampingan teknis hari-H tryout besar"
        ]
      }
    ]
  }
];

// Helper untuk daftar paket flat (pilihan select order & sinkronisasi data)
export const ALL_PACKAGES = SERVER_TIERS.flatMap((tier) =>
  tier.durations.map((dur) => ({
    id: dur.id,
    tierId: tier.id,
    tierName: tier.name,
    specs: tier.specs,
    limitLabel: tier.limitLabel,
    duration: dur.duration,
    fullName: `${tier.name} (${dur.duration}) — ${dur.price}`,
    price: dur.price,
    priceNum: dur.priceNum,
    originalPrice: dur.originalPrice,
    savingsBadge: dur.savingsBadge,
    savingsDesc: dur.savingsDesc,
    popular: dur.popular,
    features: dur.features
  }))
);

export const FAQS = [
  {
    q: "Apa maksud batas peserta aktif bersamaan pada tiap paket?",
    a: "Batas peserta aktif bersamaan (concurrency) adalah jumlah siswa yang bisa mengerjakan ujian pada detik dan menit yang sama tanpa kendala lag atau server down. Misalnya Spek 2 GB nyaman untuk 75 siswa serentak, Spek 4 GB untuk 200 siswa serentak, dan Spek 8 GB hingga 500 siswa serentak."
  },
  {
    q: "Apakah harga yang tercantum sudah all-in atau ada biaya lain?",
    a: "Harga jual yang tercantum sudah all-in (mencakup biaya cloud server VPS NVMe, lisensi sistem CAT Wadiweb, jasa setup, hingga pemeliharaan teknis). Tidak ada biaya tambahan tersembunyi."
  },
  {
    q: "Mengapa durasi lebih lama (3 bulan, 6 bulan, 1 tahun) jauh lebih hemat?",
    a: "Karena durasi panjang menghemat biaya setup berulang dan biaya sewa cloud server jangka panjang. Anda bisa menghemat ratusan ribu hingga jutaan rupiah dibanding memperpanjang bulanan."
  },
  {
    q: "Apakah sistem CAT ini bisa dipakai untuk TNI, Kedinasan, dan Ujian Sekolah?",
    a: "Bisa untuk semua jenis ujian! Wadiweb CAT mendukung seleksi TNI (Akmil/Bintara), Polri, Sekolah Kedinasan (STAN, IPDN, STIS, dll.), CPNS/BKN, hingga tryout SNBT dan ujian sekolah dengan kustomisasi bobot nilai & passing grade."
  },
  {
    q: "Bagaimana cara memasukkan bank soal milik bimbel kami?",
    a: "Anda cukup mengisi template Excel/Word sederhana yang kami sediakan, atau mengirimkan dokumen naskah soal kepada tim kami untuk dibantu proses unggahnya ke sistem."
  },
  {
    q: "Berapa lama proses aktivasi setelah pemesanan paket dikonfirmasi?",
    a: "Instan hingga maksimal 1x24 jam kerja. Setelah konfirmasi paket via WhatsApp bersama Derema, ruang ujian bimbel Anda langsung disiapkan dan siap digunakan."
  }
];

export const DEMO_QUESTIONS = [
  {
    id: 1,
    category: "Wawasan Kebangsaan (TWK) — TNI/Polri/Kedinasan",
    question: "Sumpah Pemuda 28 Oktober 1928 merupakan tonggak persatuan bangsa. Makna utama persatuan dalam konteks pertahanan dan keamanan negara bagi calon aparatur/abdi negara adalah...",
    options: [
      "Mengutamakan kepentingan daerah asal di atas kepentingan nasional",
      "Mewujudkan kesadaran bela negara dan kesetiaan mutlak kepada keutuhan NKRI",
      "Membatasi kerja sama antar institusi pemerintah",
      "Memprioritaskan kelompok tertentu dalam penegakan hukum",
      "Menyerahkan seluruh tanggung jawab kedaulatan kepada pihak asing"
    ],
    answerIndex: 1,
    explanation: "Nilai luhur Sumpah Pemuda menegaskan satu tanah air, satu bangsa, dan satu bahasa persatuan sebagai fondasi utama kesadaran bela negara dan keutuhan NKRI."
  },
  {
    id: 2,
    category: "Pengetahuan Umum & Ketatanegaraan",
    question: "Berdasarkan UUD 1945 pasal 30 ayat (2), usaha pertahanan dan keamanan negara dilaksanakan melalui sistem pertahanan dan keamanan rakyat semesta (Sishankamrata) dengan komponen utama yaitu...",
    options: [
      "Kepolisian Negara RI dan Satuan Pengamanan Swakarsa",
      "Tentara Nasional Indonesia dan Kepolisian Negara Republik Indonesia",
      "Lembaga Peradilan dan Kementerian Pertahanan",
      "Organisasi kemasyarakatan dan seluruh partai politik",
      "Pemerintah Daerah dan Satpol PP"
    ],
    answerIndex: 1,
    explanation: "Pasal 30 ayat (2) UUD 1945 menyatakan TNI dan Polri merupakan kekuatan utama dalam sistem pertahanan dan keamanan rakyat semesta, sedangkan rakyat sebagai kekuatan pendukung."
  },
  {
    id: 3,
    category: "Numerik / Intelegensia Umum (TIU)",
    question: "Dalam sebuah tes kesamaptaan fisik, seorang peserta berlari 12 menit menempuh jarak 2.800 meter. Jika kecepatannya konstan, berapa meter jarak yang ditempuh dalam 18 menit?",
    options: [
      "3.600 meter",
      "3.900 meter",
      "4.000 meter",
      "4.200 meter",
      "4.500 meter"
    ],
    answerIndex: 3,
    explanation: "Kecepatan = 2.800 m / 12 menit = 233,33 m/menit. Jarak dalam 18 menit = (18 / 12) × 2.800 = 1,5 × 2.800 = 4.200 meter."
  },
  {
    id: 4,
    category: "Deret Angka / Logika Kuantitatif",
    question: "Perhatikan pola deret angka berikut: 4, 9, 19, 39, 79, ... Angka selanjutnya adalah:",
    options: [
      "149",
      "158",
      "159",
      "161",
      "169"
    ],
    answerIndex: 2,
    explanation: "Pola deret adalah dikali 2 lalu ditambah 1 (Un = 2 × Un-1 + 1). Maka 79 × 2 + 1 = 159."
  },
  {
    id: 5,
    category: "Penalaran Logis (Silogisme)",
    question: "Semua calon aparatur abdi negara (TNI/Polri/Kedinasan) wajib lulus tes kesehatan dan psikologi. Budi adalah peserta yang lulus tes kesehatan tetapi tidak lulus tes psikologi. Kesimpulan yang tepat adalah...",
    options: [
      "Budi tetap dinyatakan lulus karena sehat jasmani",
      "Budi tidak memenuhi syarat kelulusan seleksi",
      "Budi hanya perlu mengulang tes akademik saja",
      "Budi otomatis diikutsertakan tahap pantukhir",
      "Tidak dapat ditarik kesimpulan"
    ],
    answerIndex: 1,
    explanation: "Syarat wajib menggunakan konjungsi (kesehatan DAN psikologi). Gagal pada salah satu syarat berarti gugur dari persyaratan kelulusan seleksi."
  },
  {
    id: 6,
    category: "Kemampuan Verbal (Analogi Kata)",
    question: "Pilihlah pasangan kata yang memiliki hubungan paling setara dengan: KOMPAS : ARAH",
    options: [
      "Termometer : Suhu",
      "Kamera : Foto",
      "Buku : Perpustakaan",
      "Jam : Tangan",
      "Pena : Kertas"
    ],
    answerIndex: 0,
    explanation: "Kompas adalah alat untuk mengukur/menunjukkan Arah, sebagaimana Termometer adalah alat untuk mengukur Suhu."
  },
  {
    id: 7,
    category: "Wawasan Kebangsaan (Pancasila)",
    question: "Sila keempat Pancasila menekankan musyawarah mufakat. Sikap yang mencerminkan pengamalan sila ini dalam lingkungan kepemimpinan aparatur negara adalah...",
    options: [
      "Mengutamakan musyawarah dan menghargai masukan bersama demi kepentingan publik",
      "Mengambil keputusan secara sepihak tanpa mendengar pertimbangan teknis",
      "Mendahulukan kepentingan kelompok sendiri di atas kepentingan bangsa",
      "Memaksakan kehendak pribadi kepada bawahan secara mutlak",
      "Menghindari tanggung jawab tugas saat terjadi kendala operasional"
    ],
    answerIndex: 0,
    explanation: "Sila keempat mengajarkan musyawarah untuk mufakat yang diliputi oleh semangat kekeluargaan dan hikmat kebijaksanaan."
  },
  {
    id: 8,
    category: "Aritmetika Sosial & Logika Matematika",
    question: "Sebuah bimbel kedinasan memberikan diskon pendaftaran 20% untuk paket reguler seharga Rp 1.250.000. Berapa biaya yang harus dibayar peserta setelah diskon?",
    options: [
      "Rp 950.000",
      "Rp 1.000.000",
      "Rp 1.050.000",
      "Rp 1.100.000",
      "Rp 1.150.000"
    ],
    answerIndex: 1,
    explanation: "Diskon 20% dari Rp 1.250.000 = Rp 250.000. Biaya setelah diskon = Rp 1.250.000 - Rp 250.000 = Rp 1.000.000."
  }
];

export function calculateExamScore(questions, answersMap) {
  let correct = 0;
  let answered = 0;
  const details = questions.map((q) => {
    const selected = answersMap[q.id];
    const isAnswered = typeof selected === "number";
    const isCorrect = isAnswered && selected === q.answerIndex;
    if (isAnswered) answered += 1;
    if (isCorrect) correct += 1;
    return {
      id: q.id,
      category: q.category,
      selectedIndex: isAnswered ? selected : null,
      correctIndex: q.answerIndex,
      isCorrect
    };
  });

  const total = questions.length;
  const score100 = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = score100 >= 65;

  return {
    total,
    answered,
    unanswered: total - answered,
    correct,
    wrong: answered - correct,
    score100,
    passed,
    details
  };
}

export function buildWhatsAppUrl(phone, orderData) {
  const cleanPhone = String(phone).replace(/\D/g, "");
  const lines = [
    `Halo Admin *Wadiweb CAT* (cat.wadiweb.my.id),`,
    `Saya ingin memesan / konsultasi layanan sistem CAT Ujian & Bimbel:`,
    ``,
    `- *Paket Pilihan*: ${orderData.packageName || "-"}`,
    `- *Nama / Lembaga*: ${orderData.clientName || "-"}`,
    `- *Program*: ${orderData.programCategory || "TNI / Polri / Kedinasan / Akademik"}`,
    `- *Estimasi Peserta*: ${orderData.participants || "-"} siswa`,
    `- *Catatan*: ${orderData.notes || "-"}`,
    ``,
    `Mohon info langkah aktivasi selanjutnya. Terima kasih.`
  ];
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lines.join("\n"))}`;
}
