import assert from "node:assert/strict";
import fs from "node:fs";
import {
  BRAND_CONFIG,
  SERVER_TIERS,
  ALL_PACKAGES,
  DEMO_QUESTIONS,
  calculateExamScore,
  buildWhatsAppUrl
} from "./data.js";
import {
  ASSISTANT_INFO,
  createInitialChatContext,
  getBotResponse,
  buildChatWhatsAppUrl
} from "./chatKnowledge.js";

// 1. Validasi konfigurasi brand & paket tiers
assert.equal(BRAND_CONFIG.targetDomain, "cat.wadiweb.my.id");
assert.equal(BRAND_CONFIG.whatsappNumber, "6285133383215");
assert.equal(SERVER_TIERS.length, 3, "Harus memiliki 3 spek server (2GB, 4GB, 8GB)");
assert.equal(ALL_PACKAGES.length, 12, "Harus memiliki 12 kombinasi paket (3 spek x 4 durasi)");
assert.ok(DEMO_QUESTIONS.length >= 5, "Harus memiliki minimal 5 soal demo");

// Validasi harga jual & limit spesifik
const spec2 = SERVER_TIERS.find((t) => t.id === "spec-2gb");
assert.equal(spec2.maxActive, 75);
assert.equal(spec2.durations.find((d) => d.duration === "1 Bulan").price, "Rp 299.000");
assert.equal(spec2.durations.find((d) => d.duration === "3 Bulan").price, "Rp 699.000");
assert.equal(spec2.durations.find((d) => d.duration === "6 Bulan").price, "Rp 1.299.000");
assert.equal(spec2.durations.find((d) => d.duration === "1 Tahun").price, "Rp 2.299.000");

const spec4 = SERVER_TIERS.find((t) => t.id === "spec-4gb");
assert.equal(spec4.maxActive, 200);
assert.equal(spec4.durations.find((d) => d.duration === "1 Bulan").price, "Rp 549.000");
assert.equal(spec4.durations.find((d) => d.duration === "3 Bulan").price, "Rp 1.449.000");
assert.equal(spec4.durations.find((d) => d.duration === "6 Bulan").price, "Rp 2.699.000");
assert.equal(spec4.durations.find((d) => d.duration === "1 Tahun").price, "Rp 4.799.000");

const spec8 = SERVER_TIERS.find((t) => t.id === "spec-8gb");
assert.equal(spec8.maxActive, 500);
assert.equal(spec8.durations.find((d) => d.duration === "1 Bulan").price, "Rp 1.099.000");
assert.equal(spec8.durations.find((d) => d.duration === "3 Bulan").price, "Rp 2.899.000");
assert.equal(spec8.durations.find((d) => d.duration === "6 Bulan").price, "Rp 5.499.000");
assert.equal(spec8.durations.find((d) => d.duration === "1 Tahun").price, "Rp 9.899.000");

// 2. Validasi kalkulasi nilai sempurna (100%)
const allCorrectAnswers = Object.fromEntries(
  DEMO_QUESTIONS.map((q) => [q.id, q.answerIndex])
);
const fullReport = calculateExamScore(DEMO_QUESTIONS, allCorrectAnswers);
assert.equal(fullReport.score100, 100);
assert.equal(fullReport.correct, DEMO_QUESTIONS.length);
assert.equal(fullReport.unanswered, 0);
assert.equal(fullReport.passed, true);

// 3. Validasi kalkulasi nilai sebagian & tidak dijawab
const firstQ = DEMO_QUESTIONS[0];
const secondQ = DEMO_QUESTIONS[1];
const partialAnswers = {
  [firstQ.id]: firstQ.answerIndex, // benar
  [secondQ.id]: (secondQ.answerIndex + 1) % secondQ.options.length // salah
};
const partialReport = calculateExamScore(DEMO_QUESTIONS, partialAnswers);
assert.equal(partialReport.answered, 2);
assert.equal(partialReport.correct, 1);
assert.equal(partialReport.wrong, 1);
assert.equal(partialReport.unanswered, DEMO_QUESTIONS.length - 2);
assert.equal(partialReport.passed, false);

// 4. Validasi generator link WhatsApp Form
const waUrl = buildWhatsAppUrl(BRAND_CONFIG.whatsappNumber, {
  packageName: "Spek 4 GB RAM (3 Bulan) — Rp 1.449.000",
  clientName: "Bimbel Presisi",
  participants: "120",
  notes: "Siap minggu depan"
});
assert.ok(waUrl.startsWith("https://wa.me/6285133383215?text="));
assert.ok(decodeURIComponent(waUrl).includes("Bimbel Presisi"));
assert.ok(decodeURIComponent(waUrl).includes("1.449.000"));

// 5. Validasi Smart Chat Assistant "Derema" (Intent Matching + Auto-Summary + WA URL)
assert.equal(ASSISTANT_INFO.name, "Derema");
assert.ok(fs.existsSync(new URL("./public/images/derema-avatar.svg", import.meta.url)), "Aset avatar Derema harus ada");

let chatCtx = createInitialChatContext();

const resPricing = getBotResponse("Lihat Daftar Harga Paket", chatCtx);
assert.ok(resPricing.reply.includes("Spek 2 GB"));
assert.ok(resPricing.reply.includes("Spek 4 GB"));
assert.ok(resPricing.reply.includes("Spek 8 GB"));
assert.equal(resPricing.showWaCta, true);
chatCtx = resPricing.updatedContext;

// Validasi intent spek tertentu
const res2gb = getBotResponse("Daftar Harga Spek 2 GB", chatCtx);
assert.ok(res2gb.reply.includes("Rp 299.000"));
assert.ok(res2gb.reply.includes("Rp 699.000"));
assert.ok(res2gb.reply.includes("75 peserta"));

const res4gb = getBotResponse("Daftar Harga Spek 4 GB", chatCtx);
assert.ok(res4gb.reply.includes("Rp 549.000"));
assert.ok(res4gb.reply.includes("Rp 1.449.000"));
assert.ok(res4gb.reply.includes("200 peserta"));

const resPkg = getBotResponse("Saya tertarik Spek 4 GB untuk 3 Bulan di Bimbel Garuda dengan 150 siswa", chatCtx);
chatCtx = resPkg.updatedContext;
assert.ok(chatCtx.selectedPackage.includes("Spek 4 GB"));
assert.ok(chatCtx.bimbelName.includes("Bimbel Garuda"));
assert.equal(chatCtx.participants, "150 siswa");

const chatWaUrl = buildChatWhatsAppUrl(BRAND_CONFIG.whatsappNumber, chatCtx);
const decodedChatWa = decodeURIComponent(chatWaUrl);
assert.ok(chatWaUrl.startsWith("https://wa.me/6285133383215?text="));
assert.ok(decodedChatWa.includes("*Rangkuman Konsultasi Bersama Derema:*"));
assert.ok(decodedChatWa.includes("Spek 4 GB"));
assert.ok(decodedChatWa.includes("Bimbel Garuda"));
assert.ok(decodedChatWa.includes("150 siswa"));
assert.ok(decodedChatWa.includes("Asal Portal: cat.wadiweb.my.id"));

// 6. Validasi aturan responsivitas multi-resolusi (CSS & HTML) & Anti-Cheat
const cssText = fs.readFileSync(new URL("./style.css", import.meta.url), "utf8");
const htmlText = fs.readFileSync(new URL("./index.html", import.meta.url), "utf8");
const appText = fs.readFileSync(new URL("./app.js", import.meta.url), "utf8");

assert.ok(cssText.includes("overflow-x: clip"), "Harus mencegah horizontal overflow");
assert.ok(cssText.includes("min-height: 44px"), "Harus menerapkan touch target minimal 44px");
assert.ok(cssText.includes(".spec-tab-switcher"), "Harus memiliki tab switcher spek");
assert.ok(cssText.includes(".savings-chip"), "Harus memiliki badge hemat");
assert.ok(htmlText.includes("spec-tab-switcher"), "HTML harus memuat tab switcher spek");

// Validasi Anti-Cheat di UI & Logika
assert.ok(htmlText.includes("security-banner-strip"), "HTML harus memuat security banner strip");
assert.ok(htmlText.includes("cat-security-indicator"), "HTML harus memuat security indicator saat ujian");
assert.ok(htmlText.includes("exam-violation-alert"), "HTML harus memuat alert banner pelanggaran tab");
assert.ok(htmlText.includes("stat-violations"), "HTML harus memuat stat box pelanggaran tab di hasil ujian");
assert.ok(cssText.includes(".anti-cheat-locked"), "CSS harus memuat class proteksi copy & seleksi teks");
assert.ok(appText.includes("visibilitychange"), "app.js harus memantau visibilitychange tab");
assert.ok(appText.includes("tabViolations"), "app.js harus melacak total pelanggaran tab");

// Validasi respon Derema untuk topik keamanan anti cheat
const resSecurity = getBotResponse("Apakah ada fitur anti-cheat dan pengawasan ujian?", chatCtx);
assert.ok(resSecurity.reply.includes("Anti-Cheat"));
assert.ok(resSecurity.reply.includes("Pindah Tab"));

// 7. Validasi kelengkapan & integritas seluruh aset visual
const assetFiles = [
  "assets/favicon.svg",
  "assets/logo-wadiweb.svg",
  "assets/logo-wadiweb-dark.svg",
  "public/images/derema-avatar.svg"
];

for (const relPath of assetFiles) {
  assert.ok(
    fs.existsSync(new URL(`./${relPath}`, import.meta.url)),
    `Aset visual harus ada pada disk: ${relPath}`
  );
  assert.ok(
    htmlText.includes(relPath),
    `Aset visual harus terhubung di index.html: ${relPath}`
  );
}

console.log("ALL TESTS PASSED");
