import {
  BRAND_CONFIG,
  FEATURES,
  SERVER_TIERS,
  ALL_PACKAGES,
  FAQS,
  DEMO_QUESTIONS,
  calculateExamScore,
  buildWhatsAppUrl
} from "./data.js";
import {
  ASSISTANT_INFO,
  INITIAL_QUICK_REPLIES,
  createInitialChatContext,
  getBotResponse,
  buildChatWhatsAppUrl
} from "./chatKnowledge.js";

const STORAGE_KEY = "wadiweb_cat_demo_state_v1";
const CHAT_STORAGE_KEY = "wadiweb_cat_derema_v2";
const OPTION_LETTERS = ["A", "B", "C", "D", "E"];

let currentTierId = "spec-4gb"; // Default spek populer (4 GB RAM)

// ponytail: client-side state + sessionStorage; upgrade ke backend session saat butuh proctoring multi-device
const state = {
  participantName: "CASIS-2026-001 (Tamu Bimbel)",
  currentIndex: 0,
  answers: {}, // { [questionId]: optionIndex }
  doubts: {},  // { [questionId]: boolean }
  remainingSeconds: BRAND_CONFIG.demoDurationMinutes * 60,
  timerInterval: null,
  tabViolations: 0,
  isExamActive: false
};

function saveSessionState() {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        participantName: state.participantName,
        currentIndex: state.currentIndex,
        answers: state.answers,
        doubts: state.doubts,
        remainingSeconds: state.remainingSeconds,
        tabViolations: state.tabViolations
      })
    );
  } catch {
    // Abaikan jika private mode memblokir storage
  }
}

function loadSessionState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      state.participantName = parsed.participantName || state.participantName;
      state.currentIndex = Number.isInteger(parsed.currentIndex) ? parsed.currentIndex : 0;
      state.answers = parsed.answers || {};
      state.doubts = parsed.doubts || {};
      state.remainingSeconds =
        typeof parsed.remainingSeconds === "number" && parsed.remainingSeconds > 0
          ? parsed.remainingSeconds
          : BRAND_CONFIG.demoDurationMinutes * 60;
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function clearSessionState() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

/* RENDER LANDING PAGE SECTIONS */
function renderPricingCards(tierId) {
  const tier = SERVER_TIERS.find((t) => t.id === tierId) || SERVER_TIERS[1];
  currentTierId = tier.id;

  // Update tabs
  document.querySelectorAll(".spec-tab-btn").forEach((btn) => {
    const isMatched = btn.getAttribute("data-tier") === tier.id;
    btn.classList.toggle("active", isMatched);
    btn.setAttribute("aria-selected", String(isMatched));
  });

  // Update header summary box
  document.getElementById("tier-badge-label").textContent = tier.badge;
  document.getElementById("tier-name-label").textContent = `${tier.name} | ${tier.specs}`;
  document.getElementById("tier-limit-label").innerHTML = `Limit daya tampung: <strong>${tier.limitLabel}</strong> tanpa lag.`;

  // Render cards per durasi (1 Bulan, 3 Bulan, 6 Bulan, 1 Tahun)
  const pricingGrid = document.getElementById("pricing-grid");
  pricingGrid.innerHTML = tier.durations.map((dur) => `
    <article class="price-card ${dur.popular ? "popular" : ""}">
      <div>
        <div class="price-badge-row">
          <span class="price-badge">${dur.popular ? "Paling Laris" : dur.duration}</span>
          ${dur.savingsBadge ? `<span class="savings-chip">${dur.savingsBadge}</span>` : ""}
        </div>
        <h3>Paket ${dur.duration}</h3>
        <p class="price-target">${tier.limitLabel}</p>

        <div class="price-strike-wrap">
          <span class="text-strike">${dur.originalPrice}</span>
        </div>
        <div class="price-value">${dur.price} <small>/ ${dur.duration.toLowerCase()}</small></div>

        <div class="savings-desc-box">
          ✓ ${dur.savingsDesc}
        </div>

        <div class="price-spec-pill">
          <strong>Spek:</strong> ${tier.shortSpec}
        </div>

        <ul class="price-features">
          ${dur.features.map((feat) => `<li>✓ ${feat}</li>`).join("")}
        </ul>
      </div>

      <button
        type="button"
        class="btn ${dur.popular ? "btn-primary" : "btn-outline"} btn-block btn-select-pkg"
        data-pkg-id="${dur.id}"
      >
        Pilih Paket ${dur.duration}
      </button>
    </article>
  `).join("");

  // Re-bind click event tombol pilih paket
  const orderSelect = document.getElementById("order-package");
  pricingGrid.querySelectorAll(".btn-select-pkg").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pkgId = btn.getAttribute("data-pkg-id");
      orderSelect.value = pkgId;
      updateOrderPreview();
      document.getElementById("pesan").scrollIntoView({ behavior: "smooth" });
      document.getElementById("order-name").focus();
    });
  });
}

function renderLandingContent() {
  const featuresGrid = document.getElementById("features-grid");
  featuresGrid.innerHTML = FEATURES.map(
    (f) => `
      <article class="feature-card">
        <h3>${f.title}</h3>
        <p>${f.desc}</p>
      </article>
    `
  ).join("");

  // Setup tab switcher click
  document.querySelectorAll(".spec-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTier = btn.getAttribute("data-tier");
      renderPricingCards(targetTier);
    });
  });

  // Render initial cards (default spec-4gb)
  renderPricingCards(currentTierId);

  const faqList = document.getElementById("faq-list");
  faqList.innerHTML = FAQS.map(
    (item, idx) => `
      <details class="faq-item" ${idx === 0 ? "open" : ""}>
        <summary>${item.q}</summary>
        <p>${item.a}</p>
      </details>
    `
  ).join("");

  const orderSelect = document.getElementById("order-package");
  orderSelect.innerHTML = ALL_PACKAGES.map(
    (pkg) => `<option value="${pkg.id}" ${pkg.id === "4gb-3bln" ? "selected" : ""}>${pkg.fullName} (${pkg.limitLabel})</option>`
  ).join("");
}

/* SIMULATOR CAT LOGIC */
function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function startTimer() {
  stopTimer();
  const timerEl = document.getElementById("cat-timer");
  timerEl.textContent = formatTime(state.remainingSeconds);

  state.timerInterval = setInterval(() => {
    state.remainingSeconds -= 1;
    saveSessionState();
    if (state.remainingSeconds <= 0) {
      state.remainingSeconds = 0;
      timerEl.textContent = "00:00";
      finishExam(true);
      return;
    }
    timerEl.textContent = formatTime(state.remainingSeconds);
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function renderQuestion() {
  const q = DEMO_QUESTIONS[state.currentIndex];
  if (!q) return;

  document.getElementById("cat-q-number").textContent = `Soal No. ${state.currentIndex + 1} dari ${DEMO_QUESTIONS.length}`;
  document.getElementById("cat-q-category").textContent = q.category;
  document.getElementById("cat-q-text").textContent = q.question;

  const selectedIdx = state.answers[q.id];
  const optionsContainer = document.getElementById("cat-options-list");
  optionsContainer.innerHTML = q.options
    .map((optText, idx) => {
      const isSelected = selectedIdx === idx;
      return `
        <button type="button" class="cat-option-btn ${isSelected ? "selected" : ""}" data-opt-idx="${idx}" role="radio" aria-checked="${isSelected}">
          <span class="opt-letter">${OPTION_LETTERS[idx] || idx + 1}</span>
          <span>${optText}</span>
        </button>
      `;
    })
    .join("");

  optionsContainer.querySelectorAll(".cat-option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const chosen = Number(btn.getAttribute("data-opt-idx"));
      state.answers[q.id] = chosen;
      saveSessionState();
      renderQuestion();
      renderNavGrid();
    });
  });

  const doubtCheckbox = document.getElementById("chk-doubt");
  doubtCheckbox.checked = Boolean(state.doubts[q.id]);

  document.getElementById("btn-prev-q").disabled = state.currentIndex === 0;
  const nextBtn = document.getElementById("btn-next-q");
  nextBtn.textContent = state.currentIndex === DEMO_QUESTIONS.length - 1 ? "Ke Soal Awal ↺" : "Selanjutnya →";
}

function renderNavGrid() {
  const navGrid = document.getElementById("cat-nav-grid");
  let answeredCount = 0;

  navGrid.innerHTML = DEMO_QUESTIONS.map((q, idx) => {
    const hasAnswer = typeof state.answers[q.id] === "number";
    if (hasAnswer) answeredCount += 1;
    const isDoubt = Boolean(state.doubts[q.id]);
    const isActive = idx === state.currentIndex;

    let statusClass = "";
    if (isDoubt) statusClass = "doubt";
    else if (hasAnswer) statusClass = "answered";

    return `
      <button type="button" class="nav-num-btn ${statusClass} ${isActive ? "active" : ""}" data-q-idx="${idx}">
        ${idx + 1}
      </button>
    `;
  }).join("");

  navGrid.querySelectorAll(".nav-num-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.currentIndex = Number(btn.getAttribute("data-q-idx"));
      saveSessionState();
      renderQuestion();
      renderNavGrid();
    });
  });

  document.getElementById("cat-progress-summary").textContent = `Terjawab: ${answeredCount} / ${DEMO_QUESTIONS.length} soal`;
}

function recordViolation() {
  if (!state.isExamActive) return;
  state.tabViolations += 1;
  saveSessionState();

  const indicator = document.getElementById("cat-security-indicator");
  if (indicator) {
    indicator.classList.add("violated");
  }
  const badge = document.getElementById("violation-count-badge");
  if (badge) {
    badge.textContent = `${state.tabViolations} Tab-Switch`;
  }
  const alertCount = document.getElementById("alert-violation-count");
  if (alertCount) {
    alertCount.textContent = String(state.tabViolations);
  }
  const alertBanner = document.getElementById("exam-violation-alert");
  if (alertBanner) {
    alertBanner.classList.remove("hidden");
  }
}

function attachSecurityListeners() {
  const zone = document.getElementById("cat-exam-selectable-zone");
  if (zone) zone.classList.add("anti-cheat-locked");

  window.addEventListener("blur", onWindowBlur);
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("contextmenu", onPreventDefault);
  window.addEventListener("copy", onPreventDefault);
  window.addEventListener("cut", onPreventDefault);
  window.addEventListener("paste", onPreventDefault);
  window.addEventListener("keydown", onExamKeydown);
}

function detachSecurityListeners() {
  const zone = document.getElementById("cat-exam-selectable-zone");
  if (zone) zone.classList.remove("anti-cheat-locked");

  window.removeEventListener("blur", onWindowBlur);
  document.removeEventListener("visibilitychange", onVisibilityChange);
  window.removeEventListener("contextmenu", onPreventDefault);
  window.removeEventListener("copy", onPreventDefault);
  window.removeEventListener("cut", onPreventDefault);
  window.removeEventListener("paste", onPreventDefault);
  window.removeEventListener("keydown", onExamKeydown);
}

function onPreventDefault(e) {
  if (state.isExamActive) {
    e.preventDefault();
  }
}

function onExamKeydown(e) {
  if (!state.isExamActive) return;
  if (
    (e.ctrlKey && (e.key === "c" || e.key === "C" || e.key === "v" || e.key === "V" || e.key === "u" || e.key === "U")) ||
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j"))
  ) {
    e.preventDefault();
  }
}

function onWindowBlur() {
  if (state.isExamActive) {
    recordViolation();
  }
}

function onVisibilityChange() {
  if (state.isExamActive && document.hidden) {
    recordViolation();
  }
}

function startExam(reset = true) {
  if (reset) {
    const customName = document.getElementById("demo-name-input").value.trim();
    state.participantName = customName || "PESERTA-DEMO-001 (Tamu Bimbel)";
    state.currentIndex = 0;
    state.answers = {};
    state.doubts = {};
    state.remainingSeconds = BRAND_CONFIG.demoDurationMinutes * 60;
    state.tabViolations = 0;
    saveSessionState();
  }

  state.isExamActive = true;
  attachSecurityListeners();

  const indicator = document.getElementById("cat-security-indicator");
  if (indicator) indicator.classList.remove("violated");
  const badge = document.getElementById("violation-count-badge");
  if (badge) badge.textContent = "0 Tab-Switch";
  const alertBanner = document.getElementById("exam-violation-alert");
  if (alertBanner) alertBanner.classList.add("hidden");

  document.getElementById("cat-active-user").textContent = `Peserta: ${state.participantName}`;
  document.getElementById("cat-screen-intro").classList.add("hidden");
  document.getElementById("cat-screen-result").classList.add("hidden");
  document.getElementById("cat-screen-exam").classList.remove("hidden");

  renderQuestion();
  renderNavGrid();
  startTimer();
}

function finishExam(autoSubmitted = false) {
  if (!autoSubmitted) {
    const answeredCount = Object.keys(state.answers).length;
    const unanswered = DEMO_QUESTIONS.length - answeredCount;
    const confirmMsg =
      unanswered > 0
        ? `Masih ada ${unanswered} soal yang belum dijawab. Yakin ingin mengakhiri simulasi dan melihat nilai?`
        : "Yakin ingin mengumpulkan jawaban dan melihat skor hasil simulasi?";
    if (!window.confirm(confirmMsg)) return;
  }

  state.isExamActive = false;
  detachSecurityListeners();
  stopTimer();
  clearSessionState();

  const report = calculateExamScore(DEMO_QUESTIONS, state.answers);

  document.getElementById("cat-screen-exam").classList.add("hidden");
  document.getElementById("cat-screen-result").classList.remove("hidden");

  document.getElementById("result-subtitle").textContent = `Peserta: ${state.participantName} • Selesai ${
    autoSubmitted ? "(Waktu Habis)" : "Tepat Waktu"
  }`;
  document.getElementById("result-score-value").textContent = report.score100;

  const badgeEl = document.getElementById("result-pass-badge");
  badgeEl.textContent = report.passed ? "MEMENUHI AMBANG LULUS" : "BELUM MEMENUHI AMBANG";
  badgeEl.className = `pass-badge ${report.passed ? "pass" : "fail"}`;

  document.getElementById("stat-total").textContent = report.total;
  document.getElementById("stat-correct").textContent = report.correct;
  document.getElementById("stat-wrong").textContent = report.wrong;
  document.getElementById("stat-empty").textContent = report.unanswered;

  const statViolations = document.getElementById("stat-violations");
  if (statViolations) {
    statViolations.textContent = `${state.tabViolations} kali`;
  }

  const reviewList = document.getElementById("result-review-list");
  reviewList.innerHTML = DEMO_QUESTIONS.map((q, idx) => {
    const userAns = state.answers[q.id];
    const isAnswered = typeof userAns === "number";
    const isCorrect = isAnswered && userAns === q.answerIndex;
    const userLabel = isAnswered ? `${OPTION_LETTERS[userAns]}. ${q.options[userAns]}` : "Tidak dijawab";
    const correctLabel = `${OPTION_LETTERS[q.answerIndex]}. ${q.options[q.answerIndex]}`;

    return `
      <article class="review-item">
        <div class="review-item-head">
          <strong>Soal ${idx + 1} (${q.category})</strong>
          <span class="review-status ${isCorrect ? "ok" : "err"}">${isCorrect ? "✓ Benar" : "✗ Salah / Kosong"}</span>
        </div>
        <p>${q.question}</p>
        <div class="review-exp">
          <div><strong>Jawaban Anda:</strong> ${userLabel}</div>
          <div><strong>Kunci Jawaban:</strong> ${correctLabel}</div>
          <div><strong>Pembahasan:</strong> ${q.explanation}</div>
        </div>
      </article>
    `;
  }).join("");
}

/* ORDER FORM LOGIC */
function updateOrderPreview() {
  const pkgId = document.getElementById("order-package").value;
  const pkg = ALL_PACKAGES.find((p) => p.id === pkgId) || ALL_PACKAGES[0];
  const name = document.getElementById("order-name").value.trim() || "(Nama Bimbel / Sekolah)";
  const count = document.getElementById("order-participants").value.trim() || "-";

  const previewEl = document.getElementById("order-summary-preview");
  previewEl.innerHTML = `
    <strong>Ringkasan Pesanan:</strong> ${pkg.fullName} (${pkg.limitLabel}) untuk <strong>${name}</strong> • Estimasi <strong>${count} siswa</strong>.
  `;
}

function initEvents() {
  document.getElementById("btn-start-cat").addEventListener("click", () => startExam(true));

  document.getElementById("btn-prev-q").addEventListener("click", () => {
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
      saveSessionState();
      renderQuestion();
      renderNavGrid();
    }
  });

  document.getElementById("btn-next-q").addEventListener("click", () => {
    state.currentIndex = (state.currentIndex + 1) % DEMO_QUESTIONS.length;
    saveSessionState();
    renderQuestion();
    renderNavGrid();
  });

  document.getElementById("chk-doubt").addEventListener("change", (e) => {
    const q = DEMO_QUESTIONS[state.currentIndex];
    state.doubts[q.id] = e.target.checked;
    saveSessionState();
    renderNavGrid();
  });

  document.getElementById("btn-reset-answer").addEventListener("click", () => {
    const q = DEMO_QUESTIONS[state.currentIndex];
    delete state.answers[q.id];
    delete state.doubts[q.id];
    saveSessionState();
    renderQuestion();
    renderNavGrid();
  });

  document.getElementById("btn-finish-cat").addEventListener("click", () => finishExam(false));

  const dismissAlertBtn = document.getElementById("btn-dismiss-alert");
  if (dismissAlertBtn) {
    dismissAlertBtn.addEventListener("click", () => {
      const alertBanner = document.getElementById("exam-violation-alert");
      if (alertBanner) alertBanner.classList.add("hidden");
    });
  }

  document.getElementById("btn-retry-cat").addEventListener("click", () => {
    state.isExamActive = false;
    detachSecurityListeners();
    clearSessionState();
    document.getElementById("cat-screen-result").classList.add("hidden");
    document.getElementById("cat-screen-intro").classList.remove("hidden");
  });

  ["order-package", "order-name", "order-participants", "order-notes"].forEach((id) => {
    document.getElementById(id).addEventListener("input", updateOrderPreview);
  });

  document.getElementById("order-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const pkgId = document.getElementById("order-package").value;
    const pkg = ALL_PACKAGES.find((p) => p.id === pkgId) || ALL_PACKAGES[0];
    const clientName = document.getElementById("order-name").value.trim();
    const participants = document.getElementById("order-participants").value.trim();
    const notes = document.getElementById("order-notes").value.trim();

    if (!clientName || !participants) {
      alert("Mohon lengkapi Nama Anda/Bimbel dan Estimasi Jumlah Peserta.");
      return;
    }

    const url = buildWhatsAppUrl(BRAND_CONFIG.whatsappNumber, {
      packageName: `${pkg.fullName} (${pkg.limitLabel})`,
      clientName,
      participants,
      notes
    });

    window.open(url, "_blank", "noopener");
  });
}

/* FLOATING SMART CHAT ASSISTANT "DEREMA" LOGIC */
const WELCOME_MESSAGE =
  "Halo, saya **Derema** dari tim Wadiweb CAT. 👋\n" +
  "Siap membantu sistem CAT simulasi & ujian untuk **TNI, Polri, Sekolah Kedinasan, CPNS, maupun Bimbel Akademik** di `cat.wadiweb.my.id`.\n\n" +
  "Silakan pilih topik cepat di bawah atau tulis kebutuhan lembaga Anda:";

function getTimestamp() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

const chatState = {
  isOpen: false,
  messages: [],
  quickReplies: [...INITIAL_QUICK_REPLIES],
  context: createInitialChatContext(),
  highlightWa: false
};

function saveChatState() {
  try {
    localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify({
        messages: chatState.messages,
        quickReplies: chatState.quickReplies,
        context: chatState.context,
        highlightWa: chatState.highlightWa
      })
    );
  } catch {
    // Abaikan jika storage penuh / diblokir
  }
}

function loadChatState() {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.messages) && parsed.messages.length > 0) {
      chatState.messages = parsed.messages;
      chatState.quickReplies = parsed.quickReplies || [...INITIAL_QUICK_REPLIES];
      chatState.context = parsed.context || createInitialChatContext();
      chatState.highlightWa = Boolean(parsed.highlightWa);
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function formatChatMarkdown(text) {
  const escaped = String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function renderChatUI() {
  const messagesEl = document.getElementById("chat-messages");
  messagesEl.innerHTML = chatState.messages
    .map((m) => {
      const isBot = m.sender === "bot";
      const timeStr = m.time || getTimestamp();

      const avatarMarkup = isBot
        ? `<img
             src="${ASSISTANT_INFO.avatarUrl}"
             alt="Derema"
             class="chat-msg-avatar"
             loading="lazy"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';"
           />
           <span class="chat-msg-avatar-fallback hidden">D</span>`
        : "";

      return `
        <div class="chat-msg-row ${isBot ? "bot" : "user"}">
          ${avatarMarkup}
          <div class="chat-bubble-wrap">
            <div class="chat-bubble">
              ${formatChatMarkdown(m.text)}
            </div>
            <span class="chat-msg-meta">${isBot ? "Derema • " : ""}${timeStr}</span>
          </div>
        </div>
      `;
    })
    .join("");
  messagesEl.scrollTop = messagesEl.scrollHeight;

  const quickRepliesEl = document.getElementById("chat-quick-replies");
  quickRepliesEl.innerHTML = (chatState.quickReplies || [])
    .map(
      (label) =>
        `<button type="button" class="quick-reply-chip" data-reply="${label}">${label}</button>`
    )
    .join("");

  quickRepliesEl.querySelectorAll(".quick-reply-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      handleUserChatMessage(chip.getAttribute("data-reply"));
    });
  });

  // Update summary bar & WhatsApp link
  const ctx = chatState.context;
  const summaryParts = [];
  if (ctx.selectedPackage) summaryParts.push(`Paket: ${ctx.selectedPackage}`);
  if (ctx.bimbelName) summaryParts.push(`Bimbel: ${ctx.bimbelName}`);
  if (ctx.participants) summaryParts.push(`Kuota: ${ctx.participants}`);

  const summaryTextEl = document.getElementById("chat-summary-text");
  summaryTextEl.textContent =
    summaryParts.length > 0
      ? `Rangkuman Derema: ${summaryParts.join(" • ")}`
      : "Rangkuman obrolan Derema siap diteruskan ke WhatsApp.";

  const summaryBarEl = document.getElementById("chat-summary-bar");
  summaryBarEl.classList.toggle("highlight", Boolean(chatState.highlightWa));

  const waBtn = document.getElementById("chat-wa-btn");
  waBtn.href = buildChatWhatsAppUrl(BRAND_CONFIG.whatsappNumber, ctx);
}

function resetChatSession() {
  chatState.messages = [{ sender: "bot", text: WELCOME_MESSAGE, time: getTimestamp() }];
  chatState.quickReplies = [...INITIAL_QUICK_REPLIES];
  chatState.context = createInitialChatContext();
  chatState.highlightWa = false;
  saveChatState();
  renderChatUI();
}

function handleUserChatMessage(rawText) {
  const text = String(rawText || "").trim();
  if (!text) return;

  chatState.messages.push({ sender: "user", text, time: getTimestamp() });
  renderChatUI();

  const typingEl = document.getElementById("chat-typing");
  typingEl.classList.remove("hidden");

  const delayMs = 500;
  setTimeout(() => {
    const result = getBotResponse(text, chatState.context);
    typingEl.classList.add("hidden");

    chatState.context = result.updatedContext;
    chatState.quickReplies = result.quickReplies;
    chatState.highlightWa = Boolean(result.showWaCta);
    chatState.messages.push({ sender: "bot", text: result.reply, time: getTimestamp() });

    saveChatState();
    renderChatUI();

    if (result.action === "scroll_demo") {
      document.getElementById("demo-cat").scrollIntoView({ behavior: "smooth" });
    }
  }, delayMs);
}

function initChatWidget() {
  if (!loadChatState()) {
    resetChatSession();
  } else {
    renderChatUI();
  }

  const toggleBtn = document.getElementById("chat-toggle-btn");
  const closeBtn = document.getElementById("chat-close-btn");
  const resetBtn = document.getElementById("chat-reset-btn");
  const panelEl = document.getElementById("chat-panel");
  const badgeEl = document.getElementById("chat-notif-badge");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");

  function setChatOpen(open) {
    chatState.isOpen = open;
    panelEl.classList.toggle("hidden", !open);
    toggleBtn.setAttribute("aria-expanded", String(open));
    if (open) {
      badgeEl.classList.add("hidden");
      renderChatUI();
      chatInput.focus();
    }
  }

  toggleBtn.addEventListener("click", () => setChatOpen(!chatState.isOpen));
  closeBtn.addEventListener("click", () => setChatOpen(false));
  resetBtn.addEventListener("click", () => resetChatSession());

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = chatInput.value.trim();
    if (!val) return;
    chatInput.value = "";
    handleUserChatMessage(val);
  });
}

function init() {
  renderLandingContent();
  document.getElementById("demo-total-q").textContent = `${DEMO_QUESTIONS.length} Soal Pilihan Ganda`;
  document.getElementById("demo-duration-label").textContent = `${BRAND_CONFIG.demoDurationMinutes} Menit`;
  initEvents();
  initChatWidget();
  updateOrderPreview();

  if (loadSessionState() && Object.keys(state.answers).length > 0) {
    startExam(false);
  }
}

init();
