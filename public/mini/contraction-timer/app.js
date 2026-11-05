(() => {
  "use strict";

  const STORAGE_KEY = "waves.contractions.v1";
  const $ = (id) => document.getElementById(id);
  const min = 60_000;
  const hour = 60 * min;
  const defaultSettings = { hospitalName: "", hospitalPhone: "", cueMinutes: 15, planNotes: "" };
  const state = { contractions: [], activeStart: null, settings: { ...defaultSettings } };
  let shownCount = 6;
  let savingAvailable = true;
  let toastTimeout;
  let pendingConfirm = null;

  function safeText(value, maxLength) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
  }

  function restore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (Array.isArray(saved.contractions)) {
        state.contractions = saved.contractions
          .filter((item) => item && typeof item.id === "string" && Number.isFinite(item.start) && Number.isFinite(item.end) && item.end > item.start)
          .map((item) => ({ id: item.id, start: item.start, end: item.end }))
          .sort((a, b) => a.start - b.start);
      }
      if (Number.isFinite(saved.activeStart) && saved.activeStart > 0) state.activeStart = saved.activeStart;
      if (saved.settings && typeof saved.settings === "object") {
        state.settings = {
          hospitalName: safeText(saved.settings.hospitalName, 80),
          hospitalPhone: safeText(saved.settings.hospitalPhone, 40),
          cueMinutes: clampCue(saved.settings.cueMinutes),
          planNotes: safeText(saved.settings.planNotes, 400),
        };
      }
    } catch {
      savingAvailable = false;
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      savingAvailable = true;
    } catch {
      savingAvailable = false;
      showToast("This browser could not save your times. Keep this page open.");
    }
    renderPrivacy();
  }

  function clampCue(value) {
    const number = Number(value);
    return Number.isInteger(number) && number >= 2 && number <= 20 ? number : 15;
  }

  function pad(number) { return String(number).padStart(2, "0"); }

  function formatElapsed(milliseconds) {
    const seconds = Math.max(0, Math.floor(milliseconds / 1000));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const rest = seconds % 60;
    return hours ? `${pad(hours)}:${pad(minutes)}:${pad(rest)}` : `${pad(minutes)}:${pad(rest)}`;
  }

  function formatCompact(milliseconds) {
    if (!Number.isFinite(milliseconds) || milliseconds < 0) return "—";
    const seconds = milliseconds > 0 ? Math.max(1, Math.round(milliseconds / 1000)) : 0;
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ${pad(seconds % 60)}s`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  }

  function formatStart(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const today = date.toDateString() === now.toDateString();
    const yesterday = date.toDateString() === new Date(Date.now() - 24 * hour).toDateString();
    const day = today ? "Today" : yesterday ? "Yesterday" : new Intl.DateTimeFormat("en-SG", { day: "numeric", month: "short" }).format(date);
    const time = new Intl.DateTimeFormat("en-SG", { hour: "numeric", minute: "2-digit", hour12: true }).format(date);
    return { day, time };
  }

  function localInputValue(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function cleanPhone(value) {
    const source = safeText(value, 40);
    if (!/^\+?[\d()\s-]+$/.test(source)) return "";
    const digits = source.replace(/\D/g, "");
    return digits.length >= 3 ? `${source.startsWith("+") ? "+" : ""}${digits}` : "";
  }

  function showToast(message, duration = 4200) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.remove("is-hidden");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.add("is-hidden"), duration);
  }

  function showDialog(id) {
    const dialog = $(id);
    if (!dialog.open) dialog.showModal();
  }

  function hideDialog(id) { if ($(id).open) $(id).close(); }

  function confirmAction(title, copy, yesLabel) {
    $("confirm-title").textContent = title;
    $("confirm-copy").textContent = copy;
    $("confirm-yes").textContent = yesLabel;
    showDialog("confirm-dialog");
    return new Promise((resolve) => { pendingConfirm = resolve; });
  }

  function settleConfirm(answer) {
    const resolve = pendingConfirm;
    pendingConfirm = null;
    hideDialog("confirm-dialog");
    if (resolve) resolve(answer);
  }

  function renderPrivacy() {
    const label = document.querySelector(".privacy-label");
    label.innerHTML = savingAvailable ? '<span class="privacy-dot" aria-hidden="true"></span> Saved on this device' : '<span class="privacy-dot" aria-hidden="true"></span> Saving unavailable';
    label.classList.toggle("storage-warning", !savingAvailable);
  }

  function renderTimer() {
    const active = state.activeStart !== null;
    $("timer-card").classList.toggle("is-active", active);
    $("timer-state").innerHTML = active ? '<span class="timer-state-dot" aria-hidden="true"></span> Timing now' : '<span class="timer-state-dot" aria-hidden="true"></span> Not timing';
    $("timer-caption").textContent = active ? "CONTRACTION IN PROGRESS" : "READY TO BEGIN";
    $("timer-hint").textContent = active ? "Tap end when the contraction eases." : "Take a breath. Tap start when it begins.";
    $("timer-button-label").textContent = active ? "End contraction" : "Start contraction";
    $("timer-toggle").querySelector(".button-icon").textContent = active ? "■" : "＋";
    $("timer-cancel").classList.toggle("is-hidden", !active);
    updateTimerFace();
  }

  function updateTimerFace() {
    const elapsed = state.activeStart === null ? 0 : Math.max(0, Date.now() - state.activeStart);
    $("timer-readout").textContent = formatElapsed(elapsed);
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    $("timer-readout").setAttribute("aria-label", `Elapsed time, ${minutes} minute${minutes === 1 ? "" : "s"} ${seconds % 60} second${seconds % 60 === 1 ? "" : "s"}`);
    if (state.activeStart !== null && elapsed >= 10 * min) $("timer-hint").textContent = "Still timing? End or cancel if this was an accidental tap.";
  }

  function recentPattern() {
    const records = state.contractions;
    if (records.length < 3) return false;
    const latest = records[records.length - 1];
    const cue = state.settings.cueMinutes * min;
    if (Date.now() - latest.end > Math.max(20 * min, cue * 2)) return false;
    const lastThree = records.slice(-3);
    return lastThree.slice(1).every((record, index) => record.start - lastThree[index].start <= cue && record.start > lastThree[index].start);
  }

  function renderStatus() {
    const records = state.contractions;
    const latest = records.at(-1);
    const isAlert = recentPattern();
    const status = $("status-card");
    status.classList.toggle("is-alert", isAlert);
    const setText = (id, value) => { if ($(id).textContent !== value) $(id).textContent = value; };
    setText("status-symbol", isAlert ? "!" : records.length ? "↗" : "◌");
    if (isAlert) {
      setText("status-title", "Time to call your maternity unit");
      setText("status-copy", `Your last 2 start-to-start gaps were ${state.settings.cueMinutes} minutes or less. Call now to ask when to leave. Follow your care team’s own advice if they told you to call earlier.`);
    } else if (!latest) {
      setText("status-title", "Ready when you are");
      setText("status-copy", "Start timing whenever a contraction begins. If you think labour has started or you’re unsure, call your maternity unit.");
    } else if (Date.now() - latest.end > 30 * min) {
      setText("status-title", "Ready for the next one");
      setText("status-copy", "Your earlier times are saved below. Call your maternity unit if you think labour has started or have any concerns.");
    } else {
      setText("status-title", "Keep tracking your pattern");
      setText("status-copy", "Watch for contractions becoming regular and stronger. You can call your maternity unit at any time if you’re unsure.");
    }
    const phone = cleanPhone(state.settings.hospitalPhone);
    for (const id of ["call-link", "help-call-link"]) {
      $(id).classList.toggle("is-hidden", !phone);
      if (phone) $(id).href = `tel:${phone}`;
    }
    $("status-plan").classList.toggle("is-hidden", !!phone);
    $("help-add-number").classList.toggle("is-hidden", !!phone);
  }

  function renderSummary() {
    const records = state.contractions;
    const latest = records.at(-1);
    const previous = records.at(-2);
    $("last-duration").textContent = latest ? formatCompact(latest.end - latest.start) : "—";
    const spacing = latest && previous ? latest.start - previous.start : null;
    $("last-spacing").textContent = spacing !== null && spacing < 2 * hour ? formatCompact(spacing) : "—";
    $("last-hour").textContent = records.filter((item) => item.start >= Date.now() - hour).length;
  }

  function renderHistory() {
    const records = state.contractions;
    const hasHistory = records.length > 0;
    $("history-empty").classList.toggle("is-hidden", hasHistory);
    $("history-list-wrap").classList.toggle("is-hidden", !hasHistory);
    $("history-footer").classList.toggle("is-hidden", !hasHistory);
    $("export-button").disabled = !hasHistory;
    $("show-more").classList.toggle("is-hidden", records.length <= shownCount);
    $("history-list").replaceChildren();
    if (!hasHistory) return;
    records.slice().reverse().slice(0, shownCount).forEach((record) => {
      const index = records.findIndex((item) => item.id === record.id);
      const previous = index > 0 ? records[index - 1] : null;
      const spacing = previous ? record.start - previous.start : null;
      const start = formatStart(record.start);
      const row = document.createElement("li");
      row.className = "history-item";
      const time = document.createElement("span");
      time.className = "history-time";
      time.innerHTML = `<strong>${start.time}</strong><small>${start.day}</small>`;
      time.setAttribute("aria-label", `Started ${start.day} at ${start.time}`);
      const duration = document.createElement("span");
      duration.className = "history-value";
      duration.textContent = formatCompact(record.end - record.start);
      duration.setAttribute("aria-label", `Duration ${Math.round((record.end - record.start) / 1000)} seconds`);
      const gap = document.createElement("span");
      gap.className = "history-value";
      gap.textContent = spacing !== null && spacing < 2 * hour ? formatCompact(spacing) : "—";
      gap.setAttribute("aria-label", spacing !== null && spacing < 2 * hour ? `Spacing from previous start ${Math.max(1, Math.round(spacing / 1000))} seconds` : "No recent previous start");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "history-edit";
      button.textContent = "Edit";
      button.setAttribute("aria-label", `Edit contraction started ${start.day} at ${start.time}`);
      button.dataset.id = record.id;
      row.append(time, duration, gap, button);
      $("history-list").append(row);
    });
  }

  function renderPlan() {
    const plan = state.settings;
    $("plan-hospital").textContent = plan.hospitalName || "Not added yet";
    $("plan-phone").textContent = plan.hospitalPhone;
    $("plan-phone").classList.toggle("is-hidden", !plan.hospitalPhone);
    $("plan-cue").textContent = `2 gaps of ${plan.cueMinutes} min or less`;
    $("plan-note").textContent = plan.planNotes;
    $("plan-note").classList.toggle("is-hidden", !plan.planNotes);
    $("hospital-name").value = plan.hospitalName;
    $("hospital-phone").value = plan.hospitalPhone;
    $("cue-minutes").value = plan.cueMinutes;
    $("plan-notes").value = plan.planNotes;
  }

  function render() {
    renderTimer();
    renderStatus();
    renderSummary();
    renderHistory();
    renderPlan();
    renderPrivacy();
  }

  function startContraction() {
    state.activeStart = Date.now();
    persist();
    render();
  }

  function endContraction() {
    const end = Date.now();
    const start = state.activeStart;
    if (start === null) return;
    const previousCue = recentPattern();
    state.contractions.push({ id: globalThis.crypto?.randomUUID?.() || `${start}-${Math.random().toString(36).slice(2)}`, start, end: Math.max(end, start + 1000) });
    state.contractions.sort((a, b) => a.start - b.start);
    state.activeStart = null;
    shownCount = Math.max(shownCount, 6);
    persist();
    render();
    if (!previousCue && recentPattern()) {
      showToast("Contact cue met. Call your maternity unit now to ask when to leave.", 7000);
      $("status-card").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    } else showToast("Contraction saved.");
  }

  function openPlan() {
    renderPlan();
    showDialog("plan-dialog");
  }

  function openEdit(id) {
    const record = state.contractions.find((item) => item.id === id);
    if (!record) return;
    $("edit-id").value = id;
    $("edit-start").value = localInputValue(record.start);
    $("edit-end").value = localInputValue(record.end);
    $("edit-error").classList.add("is-hidden");
    showDialog("edit-dialog");
  }

  function exportCsv() {
    const records = state.contractions;
    if (!records.length) return;
    const escape = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const localDate = (timestamp) => new Intl.DateTimeFormat("en-SG", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date(timestamp));
    const rows = [["Started (local time)", "Ended (local time)", "Duration (seconds)", "Spacing from previous start (seconds)"]];
    records.forEach((record, index) => rows.push([localDate(record.start), localDate(record.end), Math.round((record.end - record.start) / 1000), index ? Math.round((record.start - records[index - 1].start) / 1000) : ""]));
    const csv = rows.map((row) => row.map(escape).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    const now = new Date();
    link.download = `waves-contractions-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  restore();
  render();
  setInterval(() => {
    if (state.activeStart !== null) updateTimerFace();
    renderStatus();
    renderSummary();
  }, 1000);

  $("timer-toggle").addEventListener("click", () => state.activeStart === null ? startContraction() : endContraction());
  $("timer-cancel").addEventListener("click", async () => {
    if (await confirmAction("Cancel this timing?", "This contraction will not be added to your history.", "Cancel timing")) {
      state.activeStart = null;
      persist();
      render();
    }
  });
  for (const id of ["header-help", "safety-help", "guide-help", "footer-help"]) $(id).addEventListener("click", () => showDialog("help-dialog"));
  for (const id of ["edit-plan", "status-plan"]) $(id).addEventListener("click", openPlan);
  $("help-add-number").addEventListener("click", () => { hideDialog("help-dialog"); openPlan(); });
  document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => hideDialog(button.dataset.close)));
  document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); }));
  $("confirm-no").addEventListener("click", () => settleConfirm(false));
  $("confirm-yes").addEventListener("click", () => settleConfirm(true));
  $("confirm-dialog").addEventListener("close", () => { if (pendingConfirm) settleConfirm(false); });
  $("plan-form").addEventListener("submit", (event) => {
    event.preventDefault();
    state.settings = {
      hospitalName: safeText($("hospital-name").value, 80),
      hospitalPhone: safeText($("hospital-phone").value, 40),
      cueMinutes: clampCue($("cue-minutes").value),
      planNotes: safeText($("plan-notes").value, 400),
    };
    persist();
    hideDialog("plan-dialog");
    render();
    showToast("Your plan was saved on this device.");
  });
  $("history-list").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-id]");
    if (button) openEdit(button.dataset.id);
  });
  $("edit-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const record = state.contractions.find((item) => item.id === $("edit-id").value);
    if (!record) return;
    const start = new Date($("edit-start").value).getTime();
    const end = new Date($("edit-end").value).getTime();
    const error = $("edit-error");
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start || end > Date.now() + min) {
      error.textContent = "End time must be after the start and cannot be in the future.";
      error.classList.remove("is-hidden");
      return;
    }
    record.start = start;
    record.end = end;
    state.contractions.sort((a, b) => a.start - b.start);
    persist();
    hideDialog("edit-dialog");
    render();
    showToast("Contraction updated.");
  });
  $("delete-contraction").addEventListener("click", async () => {
    const id = $("edit-id").value;
    hideDialog("edit-dialog");
    if (await confirmAction("Delete this contraction?", "This timing will be removed from your history.", "Delete contraction")) {
      state.contractions = state.contractions.filter((item) => item.id !== id);
      persist();
      render();
      showToast("Contraction deleted.");
    }
  });
  $("clear-history").addEventListener("click", async () => {
    if (await confirmAction("Clear all history?", "All saved contractions on this device will be removed. Your care plan will stay.", "Clear history")) {
      state.contractions = [];
      shownCount = 6;
      persist();
      render();
      showToast("History cleared.");
    }
  });
  $("show-more").addEventListener("click", () => { shownCount += 8; renderHistory(); });
  $("export-button").addEventListener("click", exportCsv);
  if ("serviceWorker" in navigator && window.isSecureContext) navigator.serviceWorker.register("./sw.js?v=3").catch(() => {});
})();
