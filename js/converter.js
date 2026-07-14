/* ══════════════════════════════════════
   SENSFLOW — Converter + Modal
   Depende de: games.js, profile.js
   ══════════════════════════════════════ */

/* ── Populate selects ── */
populateGameSelect(document.getElementById("fromGame"), "Valorant");
populateGameSelect(document.getElementById("toGame"),   "CS2");
if (document.getElementById("pfGame"))   populateGameSelect(document.getElementById("pfGame"), "Valorant");
if (document.getElementById("gameStrip")) populateGameStrip(document.getElementById("gameStrip"));

/* ── State ── */
let lastCm360  = 0;
let lastSensTo = 0;

/* ── Math ── */
function getCm360(yaw, sens, dpi) {
  return (360 / (yaw * sens * dpi)) * 2.54;
}
function getSens(cm360, yaw, dpi) {
  return (360 * 2.54) / (cm360 * yaw * dpi);
}

/* ── Core compute ── */
function compute() {
  const fromGame = document.getElementById("fromGame").value;
  const toGame   = document.getElementById("toGame").value;
  const sens     = parseFloat(document.getElementById("fromSens").value) || 0;
  const dpiFrom  = parseFloat(document.getElementById("fromDpi").value)  || 1;
  const dpiTo    = parseFloat(document.getElementById("toDpi").value)    || 1;
  const yawFrom  = GAMES[fromGame] || 0.022;
  const yawTo    = GAMES[toGame]   || 0.022;

  const cm = getCm360(yawFrom, sens, dpiFrom);
  const st = getSens(cm, yawTo, dpiTo);
  lastCm360  = cm;
  lastSensTo = st;

  document.getElementById("resultSens").textContent = st.toFixed(3);
  document.getElementById("resultEdpi").textContent = Math.round(st * dpiTo);
  document.getElementById("resultCm").textContent   = cm.toFixed(2) + " cm";
  document.getElementById("resultIn").textContent   = (cm / 2.54).toFixed(2) + " in";

  const clamped = Math.max(10, Math.min(70, cm));
  const pct     = (clamped - 10) / 60;
  document.getElementById("dialArc").setAttribute("stroke-dashoffset", 314 - pct * 314);
  document.getElementById("dialLabel").textContent = cm.toFixed(0) + "cm";
}

/* ── Reset ── */
function resetConverter() {
  const raw = localStorage.getItem("sensflow_profile");
  if (raw) { applyProfileToConverter(JSON.parse(raw)); return; }
  document.getElementById("fromGame").value = "Valorant";
  document.getElementById("toGame").value   = "CS2";
  document.getElementById("fromSens").value = "0.40";
  document.getElementById("fromDpi").value  = "800";
  document.getElementById("toDpi").value    = "800";
  compute();
}

/* ── eDPI calculator ── */
function computeEdpi() {
  const s = parseFloat(document.getElementById("edpiSens")?.value) || 0;
  const d = parseFloat(document.getElementById("edpiDpi")?.value)  || 0;
  const r = document.getElementById("edpiResult");
  if (r) r.textContent = Math.round(s * d);
}
document.getElementById("edpiSens")?.addEventListener("input", computeEdpi);
document.getElementById("edpiDpi")?.addEventListener("input",  computeEdpi);

/* ── Explain Modal ── */
function openModal() {
  updateModal();
  document.getElementById("explainModal").classList.add("open");
}
function closeModal() {
  document.getElementById("explainModal").classList.remove("open");
}
function updateModal() {
  const fromGame = document.getElementById("fromGame").value;
  const toGame   = document.getElementById("toGame").value;
  const sens     = parseFloat(document.getElementById("fromSens").value) || 0;
  const dpiFrom  = parseFloat(document.getElementById("fromDpi").value)  || 800;
  const dpiTo    = parseFloat(document.getElementById("toDpi").value)    || 800;
  const yawFrom  = GAMES[fromGame] || 0.022;
  const yawTo    = GAMES[toGame]   || 0.022;
  const cm       = lastCm360 || getCm360(yawFrom, sens, dpiFrom);

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set("mFromGame", fromGame);
  set("mToGame",   toGame);
  set("mSensFrom", sens);
  set("mDpiFrom",  dpiFrom);
  set("mYawFrom",  yawFrom);
  set("mCm360",    cm.toFixed(2));
  set("mYawTo",    yawTo);
  set("mDpiTo",    dpiTo);
  set("mResult",   lastSensTo.toFixed(3));
  set("mFormula1",
    `cm/360 = (360 ÷ (${yawFrom} × ${sens} × ${dpiFrom})) × 2.54\n       = ${cm.toFixed(2)} cm`);
  set("mFormula2",
    `Sens = (${cm.toFixed(2)} ÷ 2.54) × ${dpiTo} × ${yawTo} ÷ 360\n     = ${lastSensTo.toFixed(3)}`);
}

/* ── Bind modal button by ID (sem depender de onclick inline) ── */
document.getElementById("btnExplain")?.addEventListener("click", openModal);
document.getElementById("btnCloseModal")?.addEventListener("click", closeModal);
document.getElementById("explainModal")?.addEventListener("click", function(e) {
  if (e.target === this) closeModal();
});

/* ── Bind reset button ── */
document.getElementById("btnReset")?.addEventListener("click", resetConverter);

/* ── Event listeners converter ── */
document.getElementById("fromGame").addEventListener("change", compute);
document.getElementById("toGame").addEventListener("change",   compute);
["fromSens", "fromDpi", "toDpi"].forEach(id =>
  document.getElementById(id).addEventListener("input", compute)
);

/* ── Expose para profile.js poder chamar compute() ── */
window.compute = compute;

/* ── Init ── */
loadProfile();
computeEdpi();
