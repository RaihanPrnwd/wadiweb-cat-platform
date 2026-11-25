// ponytail: rule-based keyword & intent matcher di client; upgrade ke RAG/LLM hanya jika butuh percakapan bebas tak terstruktur

import { BRAND_CONFIG, SERVER_TIERS, ALL_PACKAGES } from "./data.js";

export const ASSISTANT_INFO = {
  name: "Derema",
  title: "Derema • Konsultan Wadiweb CAT",
  role: "Konsultan B2B Sistem CAT TNI, Polri, Kedinasan & Akademik",
  status: "Online • Siap Bantu Bimbel & Sekolah",
  avatarUrl: "./public/images/derema-avatar.svg",
  avatarAlt: "Foto Profil Derema - Konsultan Wadiweb CAT"
};

export const INITIAL_QUICK_REPLIES = [
  "Fitur Anti-Cheat & Keamanan",
  "Daftar Harga Spek 2 GB",
  "Daftar Harga Spek 4 GB",
  "Daftar Harga Spek 8 GB",
  "Konsultasi & Pesan Sekarang"
];

export function createInitialChatContext() {
  return {
    bimbelName: "",
    selectedPackage: "",
    participants: "",
    topicsAsked: [],
    lastQueries: []
  };
}

// Daftar intent modular Derema dengan skema harga jual coret, hemat durasi, dan limit peserta
export const CHAT_INTENTS = [
  {
    id: "pricing_all",
    topicLabel: "Info & Perbandingan Harga Paket",
    showWaCta: true,
    keywords: [
      "lihat daftar harga paket",
      "daftar harga",
      "harga",
      "biaya",
      "tarif",
      "murah",
      "paket",
      "berlangganan",
      "bayar",
      "pricelist"
    ],
    buildReply: () => {
      const summary = SERVER_TIERS.map((tier) => {
        const d1 = tier.durations.find((d) => d.duration === "1 Bulan");
        const d3 = tier.durations.find((d) => d.duration === "3 Bulan");
        const d1y = tier.durations.find((d) => d.duration === "1 Tahun");
        return (
          `• **${tier.name}** (${tier.limitLabel}):\n` +
          `  - 1 Bln: **${d1.price}** (coret ~~${d1.originalPrice}~~)\n` +
          `  - 3 Bln: **${d3.price}** (${d3.savingsBadge})\n` +
          `  - 1 Thn: **${d1y.price}** (${d1y.savingsBadge})`
        );
      }).join("\n\n");

      return (
        `Halo! Ini struktur harga resmi **Wadiweb CAT** (sudah all-in server VPS NVMe + sistem CAT + margin hemat):\n\n` +
        `${summary}\n\n` +
        `Semakin lama durasi (3 bulan, 6 bulan, 1 tahun), semakin besar selisih hematnya!\n\n` +
        `Berapa perkiraan peserta aktif bersamaan di bimbel Anda? (75 siswa, 200 siswa, atau 500 siswa?)`
      );
    },
    quickReplies: [
      "Fitur Anti-Cheat & Keamanan",
      "Daftar Harga Spek 2 GB",
      "Daftar Harga Spek 4 GB",
      "Daftar Harga Spek 8 GB",
      "Konsultasi & Pesan Sekarang"
    ]
  },
  {
    id: "security_anti_cheat",
    topicLabel: "Fitur Anti-Cheat & Keamanan Ujian",
    showWaCta: true,
    keywords: [
      "fitur anti-cheat & keamanan",
      "anti cheat",
      "anticheat",
      "anti-cheat",
      "keamanan",
      "curang",
      "nyontek",
      "joki",
      "pindah tab",
      "copy paste",
      "klik kanan",
      "aman",
      "proctoring"
    ],
    buildReply: () =>
      `Sistem **Wadiweb CAT** dilengkapi sistem keamanan & **Anti-Cheat terpadu**:\n\n` +
      `1. **Deteksi Pindah Tab (Tab-Switch / Blur)**: Otomatis mendeteksi saat siswa keluar jendela browser, memunculkan popup peringatan, dan mencatat frekuensi pelanggaran.\n` +
      `2. **Proteksi Konten Soal**: Blokir klik kanan, seleksi/copy-paste teks, dan shortcut inspeksi umum (Ctrl+C, Ctrl+V, F12) saat simulasi berlangsung.\n` +
      `3. **Autosave & Anti-Submit Ganda**: Jawaban tersimpan real-time di perangkat. Jika refresh/koneksi terputus sesaat, posisi soal tetap aman & tidak bisa submit berulang.\n` +
      `4. **Multi-Device Safe**: Berjalan optimal & aman di HP Android/iOS, tablet, laptop, hingga PC laboratorium.\n\n` +
      `Untuk bimbel Anda, proteksi ini sudah terpasang otomatis dan dapat disesuaikan toleransi pelanggarannya.`,
    quickReplies: ["Daftar Harga Spek 4 GB", "Cara Coba Demo CAT", "Bisa untuk TNI & Kedinasan?", "Konsultasi & Pesan Sekarang"]
  },
  {
    id: "pricing_spec_2gb",
    topicLabel: "Harga Spek 2 GB (Maks. 75 Peserta)",
    packageTag: "Spek 2 GB RAM (Maks. 75 Aktif)",
    showWaCta: true,
    keywords: ["spek 2 gb", "2gb", "2 gb", "75 peserta", "75 aktif", "daftar harga spek 2 gb"],
    buildReply: () => {
      const tier = SERVER_TIERS.find((t) => t.id === "spec-2gb") || SERVER_TIERS[0];
      const rows = tier.durations.map((d) =>
        `• **${d.duration}**: **${d.price}** (coret ~~${d.originalPrice}~~) ➔ *${d.savingsDesc}*`
      ).join("\n");

      return (
        `**Spek 2 GB RAM | 2 Core CPU | 30 GB NVMe**\n` +
        `*(Limit maks. 75 peserta aktif bersamaan)*\n\n` +
        `${rows}\n\n` +
        `Sangat pas untuk tryout berkala atau bimbel rintisan. Mau kami bantu siapkan untuk durasi berapa bulan?`
      );
    },
    quickReplies: ["Spek 2 GB (3 Bulan - Rp 699.000)", "Spek 2 GB (6 Bulan - Rp 1.299.000)", "Daftar Harga Spek 4 GB", "Konsultasi & Pesan Sekarang"]
  },
  {
    id: "pricing_spec_4gb",
    topicLabel: "Harga Spek 4 GB (Maks. 200 Peserta)",
    packageTag: "Spek 4 GB RAM (Maks. 200 Aktif)",
    showWaCta: true,
    keywords: ["spek 4 gb", "4gb", "4 gb", "200 peserta", "200 aktif", "daftar harga spek 4 gb", "paling populer"],
    buildReply: () => {
      const tier = SERVER_TIERS.find((t) => t.id === "spec-4gb") || SERVER_TIERS[1];
      const rows = tier.durations.map((d) =>
        `• **${d.duration}**: **${d.price}** (coret ~~${d.originalPrice}~~) ➔ *${d.savingsDesc}*`
      ).join("\n");

      return (
        `**Spek 4 GB RAM | 3 Core CPU | 60 GB NVMe**\n` +
        `*(Limit maks. 200 peserta aktif bersamaan — Paling Laris)*\n\n` +
        `${rows}\n\n` +
        `Cocok untuk program intensif seleksi TNI, Polri, IPDN & STAN. Siap disambungkan ke WhatsApp untuk aktivasi?`
      );
    },
    quickReplies: ["Spek 4 GB (3 Bulan - Rp 1.449.000)", "Spek 4 GB (6 Bulan - Rp 2.699.000)", "Daftar Harga Spek 8 GB", "Konsultasi & Pesan Sekarang"]
  },
  {
    id: "pricing_spec_8gb",
    topicLabel: "Harga Spek 8 GB (Maks. 500 Peserta)",
    packageTag: "Spek 8 GB RAM (Maks. 500 Aktif)",
    showWaCta: true,
    keywords: ["spek 8 gb", "8gb", "8 gb", "500 peserta", "500 aktif", "daftar harga spek 8 gb", "multi-cabang"],
    buildReply: () => {
      const tier = SERVER_TIERS.find((t) => t.id === "spec-8gb") || SERVER_TIERS[2];
      const rows = tier.durations.map((d) =>
        `• **${d.duration}**: **${d.price}** (coret ~~${d.originalPrice}~~) ➔ *${d.savingsDesc}*`
      ).join("\n");

      return (
        `**Spek 8 GB RAM | 4 Core CPU | 100 GB NVMe**\n` +
        `*(Limit maks. 500 peserta aktif bersamaan — High Concurrency)*\n\n` +
        `${rows}\n\n` +
        `Solusi terbaik untuk tryout akbar gabungan cabang atau sekolah kedinasan besar.`
      );
    },
    quickReplies: ["Spek 8 GB (3 Bulan - Rp 2.899.000)", "Spek 8 GB (1 Tahun - Rp 9.899.000)", "Konsultasi & Pesan Sekarang"]
  },
  {
    id: "multipurpose_intent",
    topicLabel: "Kesesuaian TNI, Polri, Kedinasan & Akademik",
    showWaCta: true,
    keywords: [
      "bisa untuk tni & kedinasan?",
      "bisa untuk apa saja",
      "tni",
      "akmil",
      "aal",
      "aau",
      "bintara tni",
      "tamtama tni",
      "polri",
      "kedinasan",
      "sekolah kedinasan",
      "ipdn",
      "stan",
      "stis",
      "poltekip",
      "cpns",
      "skd",
      "tiu",
      "twk",
      "tkp",
      "snbt",
      "ujian sekolah",
      "akademik"
    ],
    buildReply: () =>
      `**Bisa semua dan sangat fleksibel!** Sistem **Wadiweb CAT** mendukung:\n\n` +
      `1. **TNI & Polri**: Akmil, AAL, AAU, Bintara, Tamtama, Akpol, Psikologi Kecermatan & Akademik.\n` +
      `2. **Kedinasan & CPNS**: Format SKD standar BKN (TWK, TIU, TKP bobot 1–5), TPA, & Psikotes (IPDN, STAN, Poltekip, STIS).\n` +
      `3. **Bimbel Akademik & Sekolah**: Tryout SNBT, Ujian Sekolah berbasis komputer, hingga olimpiade.\n\n` +
      `Tinggal pilih paket spek server sesuai jumlah siswa aktif bersamaan!`,
    quickReplies: ["Daftar Harga Spek 2 GB", "Daftar Harga Spek 4 GB", "Daftar Harga Spek 8 GB", "Konsultasi & Pesan Sekarang"]
  },
  {
    id: "technical_usage",
    topicLabel: "Teknis Input Soal, Subdomain & Kuota",
    showWaCta: true,
    keywords: [
      "input soal",
      "upload soal",
      "bank soal",
      "excel",
      "word",
      "subdomain",
      "domain sendiri",
      "kuota",
      "aktivasi",
      "berapa lama",
      "setup"
    ],
    buildReply: () =>
      `Teknis pengoperasian di **${BRAND_CONFIG.targetDomain}** sangat mudah:\n` +
      `• **Upload Bank Soal**: Menggunakan template Excel/Word atau dibantu input oleh tim kami.\n` +
      `• **Alamat Ujian**: Bisa di subdomain \`cat.wadiweb.my.id\` atau custom domain milik bimbel sendiri.\n` +
      `• **Aktivasi Cepat**: Siap digunakan dalam 1–24 jam kerja setelah konfirmasi WhatsApp.`,
    quickReplies: ["Lihat Daftar Harga Paket", "Cara Coba Demo CAT", "Konsultasi & Pesan Sekarang"]
  },
  {
    id: "try_demo",
    topicLabel: "Panduan Coba Demo CAT",
    showWaCta: false,
    action: "scroll_demo",
    keywords: ["cara coba demo", "coba demo", "demo", "simulasi", "tes coba", "uji coba", "latihan"],
    buildReply: () =>
      `Anda dapat menguji **Simulator Demo CAT** langsung di website:\n\n` +
      `1. Masukkan nama/bimbel Anda lalu klik **"Mulai Simulasi CAT Sekarang"**.\n` +
      `2. Kerjakan 8 contoh soal (Wawasan Kebangsaan, TIU, Analogi, & Silogisme).\n` +
      `3. Perhatikan navigasi nomor, tandai ragu-ragu, dan timer real-time.\n` +
      `4. Klik **"Selesai & Kumpulkan"** untuk melihat skor nilai dan kunci pembahasan.\n\n` +
      `Layar sudah saya arahkan ke bagian Demo CAT!`,
    quickReplies: ["Daftar Harga Spek 4 GB", "Daftar Harga Spek 2 GB", "Konsultasi & Pesan Sekarang"]
  },
  {
    id: "order_consult",
    topicLabel: "Konsultasi & Pemesanan Paket",
    showWaCta: true,
    keywords: [
      "konsultasi & pesan sekarang",
      "pesan",
      "order",
      "beli",
      "daftar",
      "admin",
      "whatsapp",
      "wa",
      "hubungi",
      "kontak",
      "minat"
    ],
    buildReply: (ctx) => {
      const pkgInfo = ctx.selectedPackage ? ` (${ctx.selectedPackage})` : "";
      return (
        `Saya siap membantu pengaktifan sistem CAT bimbel/lembaga Anda${pkgInfo}!\n\n` +
        `Anda dapat menuliskan **Nama Bimbel / Sekolah**, **Spek yang diminati**, dan **Estimasi Peserta** di sini, atau langsung klik tombol **Lanjut ke WhatsApp**.`
      );
    },
    quickReplies: ["Spek 2 GB (3 Bulan - Rp 699.000)", "Spek 4 GB (3 Bulan - Rp 1.449.000)", "Spek 8 GB (3 Bulan - Rp 2.899.000)"]
  }
];

export function extractLeadContext(userText, currentContext = createInitialChatContext()) {
  const ctx = {
    ...currentContext,
    topicsAsked: [...(currentContext.topicsAsked || [])],
    lastQueries: [...(currentContext.lastQueries || [])]
  };

  const clean = String(userText || "").trim();
  if (!clean) return ctx;

  const lower = clean.toLowerCase();

  // 1. Deteksi minat paket dari spek & durasi
  if (/2\s*gb|75\s*peserta|299|699|1\.?299|2\.?299/i.test(lower)) {
    if (/1\s*tahun|12\s*bln|2\.?299/i.test(lower)) ctx.selectedPackage = "Spek 2 GB RAM (1 Tahun - Rp 2.299.000)";
    else if (/6\s*bulan|1\.?299/i.test(lower)) ctx.selectedPackage = "Spek 2 GB RAM (6 Bulan - Rp 1.299.000)";
    else if (/3\s*bulan|699/i.test(lower)) ctx.selectedPackage = "Spek 2 GB RAM (3 Bulan - Rp 699.000)";
    else ctx.selectedPackage = "Spek 2 GB RAM (Maks. 75 Aktif)";
  } else if (/4\s*gb|200\s*peserta|549|1\.?449|2\.?699|4\.?799/i.test(lower)) {
    if (/1\s*tahun|12\s*bln|4\.?799/i.test(lower)) ctx.selectedPackage = "Spek 4 GB RAM (1 Tahun - Rp 4.799.000)";
    else if (/6\s*bulan|2\.?699/i.test(lower)) ctx.selectedPackage = "Spek 4 GB RAM (6 Bulan - Rp 2.699.000)";
    else if (/3\s*bulan|1\.?449/i.test(lower)) ctx.selectedPackage = "Spek 4 GB RAM (3 Bulan - Rp 1.449.000)";
    else ctx.selectedPackage = "Spek 4 GB RAM (Maks. 200 Aktif)";
  } else if (/8\s*gb|500\s*peserta|1\.?099|2\.?899|5\.?499|9\.?899/i.test(lower)) {
    if (/1\s*tahun|12\s*bln|9\.?899/i.test(lower)) ctx.selectedPackage = "Spek 8 GB RAM (1 Tahun - Rp 9.899.000)";
    else if (/6\s*bulan|5\.?499/i.test(lower)) ctx.selectedPackage = "Spek 8 GB RAM (6 Bulan - Rp 5.499.000)";
    else if (/3\s*bulan|2\.?899/i.test(lower)) ctx.selectedPackage = "Spek 8 GB RAM (3 Bulan - Rp 2.899.000)";
    else ctx.selectedPackage = "Spek 8 GB RAM (Maks. 500 Aktif)";
  }

  // 2. Deteksi jumlah peserta / siswa
  const participantMatch =
    clean.match(/(\d{1,5})\s*(?:siswa|peserta|casis|orang|anak)/i) ||
    clean.match(/(?:kuota|peserta|siswa)\s*[:=-]?\s*(\d{1,5})/i);
  if (participantMatch) {
    ctx.participants = `${participantMatch[1]} siswa`;
  }

  // 3. Deteksi nama bimbel / nama klien
  const bimbelMatch =
    clean.match(/((?:bimbel|lbb|akademi|kursus|sekolah|yayasan)\s+[a-zA-Z0-9\s.'-]{2,35})/i) ||
    clean.match(/(?:nama\s+saya|saya)\s+([a-zA-Z0-9\s.'-]{2,35})/i);
  if (bimbelMatch) {
    const extractedName = bimbelMatch[1].replace(/[,.].*$/, "").trim();
    if (extractedName.length >= 3) {
      ctx.bimbelName = extractedName;
    }
  }

  // 4. Catat riwayat pertanyaan bermakna (maksimal 4 poin terakhir)
  if (!ctx.lastQueries.includes(clean)) {
    ctx.lastQueries = [...ctx.lastQueries.slice(-3), clean];
  }

  return ctx;
}

export function getBotResponse(userText, currentContext = createInitialChatContext()) {
  const updatedContext = extractLeadContext(userText, currentContext);
  const lower = String(userText || "").trim().toLowerCase();

  // Cek apakah user baru saja menginfokan nama bimbel / jumlah siswa
  const hasNewLeadDetail =
    (/(\d{1,5})\s*(?:siswa|peserta|casis|orang)/i.test(lower) || /(?:bimbel|sekolah|yayasan)\s+\w+/i.test(lower)) &&
    !/harga|cara|fitur|demo|spek|server|tni|kedinasan|2gb|4gb|8gb/i.test(lower);

  if (hasNewLeadDetail) {
    if (!updatedContext.topicsAsked.includes("Data Kualifikasi Bimbel")) {
      updatedContext.topicsAsked.push("Data Kualifikasi Bimbel");
    }
    const summaryParts = [
      updatedContext.bimbelName ? `Lembaga: **${updatedContext.bimbelName}**` : null,
      updatedContext.participants ? `Kuota: **${updatedContext.participants}**` : null,
      updatedContext.selectedPackage ? `Paket: **${updatedContext.selectedPackage}**` : null
    ].filter(Boolean);

    return {
      reply:
        `Baik, data calon klien sudah saya catat ke dalam rangkuman pesanan:\n` +
        `• ${summaryParts.join("\n• ")}\n\n` +
        `Silakan klik tombol **Lanjut ke WhatsApp** di bawah. Format obrolan ini akan otomatis terisi rapi saat Anda terhubung dengan kami.`,
      quickReplies: ["Daftar Harga Spek 4 GB", "Daftar Harga Spek 2 GB", "Konsultasi & Pesan Sekarang"],
      showWaCta: true,
      updatedContext,
      action: null
    };
  }

  // Cari intent dengan skor kecocokan tertinggi
  let bestIntent = null;
  let bestScore = 0;

  for (const intent of CHAT_INTENTS) {
    let score = 0;
    for (const kw of intent.keywords) {
      if (lower === kw) {
        score += 5;
      } else if (lower.includes(kw)) {
        score += kw.includes(" ") ? 3 : 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  if (bestIntent && bestScore > 0) {
    if (bestIntent.packageTag && !updatedContext.selectedPackage) {
      updatedContext.selectedPackage = bestIntent.packageTag;
    }
    if (!updatedContext.topicsAsked.includes(bestIntent.topicLabel)) {
      updatedContext.topicsAsked.push(bestIntent.topicLabel);
    }

    return {
      reply: bestIntent.buildReply(updatedContext),
      quickReplies: bestIntent.quickReplies || INITIAL_QUICK_REPLIES,
      showWaCta: Boolean(bestIntent.showWaCta || updatedContext.selectedPackage),
      updatedContext,
      action: bestIntent.action || null
    };
  }

  // Fallback ramah jika di luar keyword
  if (!updatedContext.topicsAsked.includes("Pertanyaan Kustom")) {
    updatedContext.topicsAsked.push("Pertanyaan Kustom");
  }

  return {
    reply:
      `Terima kasih atas pertanyaannya. Terkait **"${String(userText).slice(0, 50)}"**, ` +
      `sistem **Wadiweb CAT** menyediakan 3 pilihan server spek: 2 GB (maks 75 aktif), 4 GB (maks 200 aktif), dan 8 GB (maks 500 aktif). Silakan pilih opsi di bawah atau langsung konsultasi ke WhatsApp kami.`,
    quickReplies: INITIAL_QUICK_REPLIES,
    showWaCta: true,
    updatedContext,
    action: null
  };
}

export function buildChatWhatsAppUrl(phone = BRAND_CONFIG.whatsappNumber, context = createInitialChatContext()) {
  const cleanPhone = String(phone).replace(/\D/g, "");
  const packageInterest = context.selectedPackage || "Belum dipilih (Ingin rekomendasi spek server)";

  const needsParts = [];
  if (context.bimbelName) needsParts.push(`Bimbel/Lembaga: ${context.bimbelName}`);
  if (context.participants) needsParts.push(`Estimasi: ${context.participants}`);
  if (context.topicsAsked && context.topicsAsked.length > 0) {
    needsParts.push(`Topik: ${context.topicsAsked.join(", ")}`);
  }
  if (context.lastQueries && context.lastQueries.length > 0) {
    needsParts.push(`Pertanyaan: "${context.lastQueries.join(" | ")}"`);
  }

  const needsSummary = needsParts.length > 0 ? needsParts.join(" • ") : "Konsultasi paket spek server & sistem CAT Bimbel";

  const lines = [
    `Halo Tim Wadiweb CAT, saya baru saja berkonsultasi dengan Derema di website terkait sistem CAT Bimbel & Ujian (TNI / Polri / Kedinasan / Akademik).`,
    ``,
    `*Rangkuman Konsultasi Bersama Derema:*`,
    `- Minat Spek / Paket: ${packageInterest}`,
    `- Kebutuhan / Pertanyaan: ${needsSummary}`,
    `- Asal Portal: ${BRAND_CONFIG.targetDomain}`,
    ``,
    `Mohon dibantu info aktivasi dan penawaran terbaiknya. Terima kasih!`
  ];

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lines.join("\n"))}`;
}
