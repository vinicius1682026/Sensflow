/* ══════════════════════════════════════
   SENSFLOW — Profile Manager
   Gerencia: Sensibilidade Universal + ADS Universal
   ══════════════════════════════════════ */

const STORAGE_KEY     = "sensflow_profile";
const ADS_STORAGE_KEY = "sensflow_ads_profile";

/* ─────────────────────────────────────
   CROSSHAIR CANVAS
   ───────────────────────────────────── */
const chCanvas = document.getElementById("chCanvas");
const chCtx    = chCanvas ? chCanvas.getContext("2d") : null;
let   chStyle  = "cross";

function drawCrosshair(style) {
  if (!chCtx) return;
  const c = chCtx, W = 140, H = 140, cx = 70, cy = 70;
  c.clearRect(0, 0, W, H);
  c.strokeStyle = "#D4FF3F"; c.fillStyle = "#D4FF3F";
  c.lineWidth = 2; c.lineCap = "round";
  const gap = 8, arm = 20, r = 22;

  switch (style) {
    case "cross":
      [[cx-arm-gap,cy,cx-gap,cy],[cx+gap,cy,cx+arm+gap,cy],
       [cx,cy-arm-gap,cx,cy-gap],[cx,cy+gap,cx,cy+arm+gap]].forEach(([x1,y1,x2,y2])=>{
        c.beginPath(); c.moveTo(x1,y1); c.lineTo(x2,y2); c.stroke();
      });
      c.beginPath(); c.arc(cx,cy,2,0,Math.PI*2); c.fill();
      break;
    case "dot":
      c.beginPath(); c.arc(cx,cy,4,0,Math.PI*2); c.fill();
      c.lineWidth=1.5; c.strokeStyle="rgba(212,255,63,.4)";
      c.beginPath(); c.arc(cx,cy,10,0,Math.PI*2); c.stroke();
      break;
    case "circle":
      c.beginPath(); c.arc(cx,cy,r,0,Math.PI*2); c.stroke();
      c.beginPath(); c.arc(cx,cy,2,0,Math.PI*2); c.fill();
      break;
    case "tcross":
      [[cx-arm-gap,cy,cx-gap,cy],[cx+gap,cy,cx+arm+gap,cy],
       [cx,cy+gap,cx,cy+arm+gap]].forEach(([x1,y1,x2,y2])=>{
        c.beginPath(); c.moveTo(x1,y1); c.lineTo(x2,y2); c.stroke();
      });
      c.beginPath(); c.arc(cx,cy,2,0,Math.PI*2); c.fill();
      break;
    case "sniper":
      c.lineWidth=1;
      c.beginPath(); c.moveTo(4,cy); c.lineTo(W-4,cy); c.stroke();
      c.beginPath(); c.moveTo(cx,4); c.lineTo(cx,H-4); c.stroke();
      c.beginPath(); c.arc(cx,cy,r,0,Math.PI*2); c.stroke();
      break;
  }
}

function setChStyle(btn) {
  document.querySelectorAll(".ch-tab[data-style]").forEach(t => t.classList.remove("active"));
  btn.classList.add("active");
  chStyle = btn.dataset.style;
  drawCrosshair(chStyle);
}

/* ─────────────────────────────────────
   SENSIBILIDADE UNIVERSAL — Save / Load / Clear
   ───────────────────────────────────── */
function updateSensBadge(game) {
  const b = document.getElementById("chGameBadge");
  if (b) b.textContent = game || "Sem perfil salvo";
}

function saveProfile() {
  const p = {
    game:    document.getElementById("pfGame")?.value   || "",
    sens:    document.getElementById("pfSens")?.value   || "0.40",
    dpi:     document.getElementById("pfDpi")?.value    || "800",
    chStyle: chStyle,
    chCode:  document.getElementById("pfChCode")?.value || "",
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));

  const badge = document.getElementById("savedBadge");
  if (badge) { badge.classList.add("show"); setTimeout(() => badge.classList.remove("show"), 3000); }

  updateSensBadge(p.game);
  applyProfileToConverter(p);
}

function loadProfile() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const p = JSON.parse(raw);

  const pfGame = document.getElementById("pfGame");
  if (pfGame && p.game && pfGame.querySelector(`option[value="${p.game}"]`))
    pfGame.value = p.game;

  if (p.sens)    { const el = document.getElementById("pfSens"); if(el) el.value = p.sens; }
  if (p.dpi)     { const el = document.getElementById("pfDpi");  if(el) el.value = p.dpi;  }
  if (p.chCode)  { const el = document.getElementById("pfChCode"); if(el) el.value = p.chCode; }

  if (p.chStyle) {
    chStyle = p.chStyle;
    document.querySelectorAll(".ch-tab[data-style]").forEach(t =>
      t.classList.toggle("active", t.dataset.style === p.chStyle)
    );
  }

  drawCrosshair(chStyle);
  updateSensBadge(p.game);
  applyProfileToConverter(p);
}

function clearProfile() {
  localStorage.removeItem(STORAGE_KEY);
  document.getElementById("autofillBanner")?.classList.remove("show");
  updateSensBadge(null);

  const pfGame = document.getElementById("pfGame");   if(pfGame) pfGame.value = "Valorant";
  const pfSens = document.getElementById("pfSens");   if(pfSens) pfSens.value = "0.40";
  const pfDpi  = document.getElementById("pfDpi");    if(pfDpi)  pfDpi.value  = "800";
  const pfCode = document.getElementById("pfChCode"); if(pfCode) pfCode.value = "";

  chStyle = "cross";
  document.querySelectorAll(".ch-tab[data-style]").forEach((t,i) =>
    t.classList.toggle("active", i === 0)
  );
  drawCrosshair("cross");

  const fromGame = document.getElementById("fromGame"); if(fromGame) fromGame.value = "Valorant";
  const fromSens = document.getElementById("fromSens"); if(fromSens) fromSens.value = "0.40";
  const fromDpi  = document.getElementById("fromDpi");  if(fromDpi)  fromDpi.value  = "800";

  if (typeof compute === "function") compute();
}

function applyProfileToConverter(p) {
  const fromGame = document.getElementById("fromGame");
  const fromSens = document.getElementById("fromSens");
  const fromDpi  = document.getElementById("fromDpi");
  if (fromGame && p.game && fromGame.querySelector(`option[value="${p.game}"]`)) fromGame.value = p.game;
  if (fromSens && p.sens) fromSens.value = p.sens;
  if (fromDpi  && p.dpi)  fromDpi.value  = p.dpi;

  const banner = document.getElementById("autofillBanner");
  const txt    = document.getElementById("autofillText");
  if (banner && txt) {
    const edpi = Math.round(parseFloat(p.sens) * parseFloat(p.dpi));
    txt.textContent = `✓ Perfil "${p.game}" — Sens ${p.sens} · DPI ${p.dpi} · eDPI ${edpi}`;
    banner.classList.add("show");
  }
  if (typeof compute === "function") compute();
}

/* ─────────────────────────────────────
   COPY CROSSHAIR CODE BUTTON
   ───────────────────────────────────── */
document.getElementById("btnCopyCode")?.addEventListener("click", () => {
  const code = document.getElementById("pfChCode")?.value;
  if (!code) return;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById("btnCopyCode");
    btn.classList.add("copied");
    btn.title = "Copiado!";
    setTimeout(() => { btn.classList.remove("copied"); btn.title = "Copiar código"; }, 2000);
  });
});

/* ─────────────────────────────────────
   MEU ADS UNIVERSAL — Save / Load / Clear
   ───────────────────────────────────── */
let currentScopeType = "iron";

function setScopeType(btn) {
  document.querySelectorAll(".ch-tab[data-scope]").forEach(t => t.classList.remove("active"));
  btn.classList.add("active");
  currentScopeType = btn.dataset.scope;
}

function updateAdsMultDisplay(mult) {
  const d = document.getElementById("adsUnivMultDisplay");
  if (d) d.textContent = "×" + parseFloat(mult).toFixed(2);
}

function updateAdsBadge(game) {
  const b = document.getElementById("adsUnivGameBadge");
  if (b) b.textContent = game || "Sem ADS salvo";
}

function saveAdsProfile() {
  const p = {
    game:  document.getElementById("adsUnivGame")?.value || "",
    sens:  document.getElementById("adsUnivSens")?.value || "0.40",
    dpi:   document.getElementById("adsUnivDpi")?.value  || "800",
    mult:  document.getElementById("adsUnivMult")?.value || "1.00",
    scope: currentScopeType,
  };
  localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(p));

  const badge = document.getElementById("adsSavedBadge");
  if (badge) { badge.classList.add("show"); setTimeout(() => badge.classList.remove("show"), 3000); }

  updateAdsMultDisplay(p.mult);
  updateAdsBadge(p.game);
  applyAdsProfileToConverter(p);
}

function loadAdsProfile() {
  const raw = localStorage.getItem(ADS_STORAGE_KEY);
  if (!raw) return;
  const p = JSON.parse(raw);

  const adsGame = document.getElementById("adsUnivGame");
  if (adsGame && p.game && adsGame.querySelector(`option[value="${p.game}"]`)) adsGame.value = p.game;
  if (p.sens)  { const el = document.getElementById("adsUnivSens"); if(el) el.value = p.sens; }
  if (p.dpi)   { const el = document.getElementById("adsUnivDpi");  if(el) el.value = p.dpi;  }
  if (p.mult)  { const el = document.getElementById("adsUnivMult"); if(el) el.value = p.mult; }

  if (p.scope) {
    currentScopeType = p.scope;
    document.querySelectorAll(".ch-tab[data-scope]").forEach(t =>
      t.classList.toggle("active", t.dataset.scope === p.scope)
    );
  }

  // sync presets
  if (p.mult) {
    document.querySelectorAll(".ads-univ-preset").forEach(b =>
      b.classList.toggle("active", b.dataset.mult === p.mult)
    );
  }

  updateAdsMultDisplay(p.mult || "1.00");
  updateAdsBadge(p.game);
  applyAdsProfileToConverter(p);
}

function clearAdsProfile() {
  localStorage.removeItem(ADS_STORAGE_KEY);
  updateAdsBadge(null);
  updateAdsMultDisplay("1.00");

  const adsGame = document.getElementById("adsUnivGame"); if(adsGame) adsGame.value = "Valorant";
  const adsSens = document.getElementById("adsUnivSens"); if(adsSens) adsSens.value = "0.40";
  const adsDpi  = document.getElementById("adsUnivDpi");  if(adsDpi)  adsDpi.value  = "800";
  const adsMult = document.getElementById("adsUnivMult"); if(adsMult) adsMult.value = "1.00";

  currentScopeType = "iron";
  document.querySelectorAll(".ch-tab[data-scope]").forEach((t,i) =>
    t.classList.toggle("active", i === 0)
  );
  document.querySelectorAll(".ads-univ-preset").forEach((b,i) =>
    b.classList.toggle("active", i === 0)
  );
}

function applyAdsProfileToConverter(p) {
  /* Se o conversor ADS estiver aberto na mesma página, preenche automaticamente */
  const adsToggle = document.getElementById("adsToggle");
  const adsMult   = document.getElementById("adsMult");
  const adsDpiTo  = document.getElementById("adsDpiTo");
  if (adsMult  && p.mult) adsMult.value  = p.mult;
  if (adsDpiTo && p.dpi)  adsDpiTo.value = p.dpi;
  if (adsToggle && !adsToggle.checked) {
    adsToggle.checked = true;
    document.getElementById("adsPanel")?.classList.add("open");
  }
  document.querySelectorAll(".ads-preset").forEach(b =>
    b.classList.toggle("active", b.dataset.mult === p.mult)
  );
  if (typeof computeAds === "function") computeAds();
}

/* ─────────────────────────────────────
   ADS Universal preset buttons
   ───────────────────────────────────── */
document.querySelectorAll(".ads-univ-preset").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".ads-univ-preset").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const el = document.getElementById("adsUnivMult");
    if (el) { el.value = btn.dataset.mult; updateAdsMultDisplay(btn.dataset.mult); }
  });
});
document.getElementById("adsUnivMult")?.addEventListener("input", e => {
  document.querySelectorAll(".ads-univ-preset").forEach(b => b.classList.remove("active"));
  updateAdsMultDisplay(e.target.value);
});
document.getElementById("pfGame")?.addEventListener("change", e => updateSensBadge(e.target.value));
document.getElementById("adsUnivGame")?.addEventListener("change", e => updateAdsBadge(e.target.value));

/* ─────────────────────────────────────
   INIT
   ───────────────────────────────────── */
drawCrosshair("cross");
loadProfile();
loadAdsProfile();

/* Expose globals */
window.setChStyle     = setChStyle;
window.setScopeType   = setScopeType;
window.saveProfile    = saveProfile;
window.clearProfile   = clearProfile;
window.saveAdsProfile = saveAdsProfile;
window.clearAdsProfile= clearAdsProfile;
