/* ══════════════════════════════════════════════════
   SENSFLOW — Sensibilidade dos Pros
   ──────────────────────────────────────────────────
   Preenche o conversor com a config de um pro player.

   ⚠️ IMPORTANTE: pros trocam de sensibilidade com
   frequência. Estes valores são os mais divulgados
   publicamente, mas PODEM ESTAR DESATUALIZADOS.
   Confira em prosettings.net antes de confiar.
   ══════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* game = nome EXATO como aparece em games.js */
  var PROS = [
    { name: "TenZ",        team: "Sentinels",  game: "Valorant", sens: 0.485, dpi: 800 },
    { name: "aspas",       team: "Leviatán",   game: "Valorant", sens: 0.40,  dpi: 800 },
    { name: "Demon1",      team: "NRG",        game: "Valorant", sens: 0.35,  dpi: 1600 },
    { name: "Less",        team: "LOUD",       game: "Valorant", sens: 0.28,  dpi: 1600 },
    { name: "s1mple",      team: "NAVI",       game: "CS2",      sens: 3.09,  dpi: 400 },
    { name: "FalleN",      team: "FURIA",      game: "CS2",      sens: 1.65,  dpi: 400 },
    { name: "ZywOo",       team: "Vitality",   game: "CS2",      sens: 2.00,  dpi: 400 },
    { name: "NiKo",        team: "Falcons",    game: "CS2",      sens: 1.35,  dpi: 400 },
    { name: "ImperialHal", team: "TSM",        game: "Apex Legends", sens: 1.60, dpi: 800 },
    { name: "Bugao",       team: "Alliance",   game: "Apex Legends", sens: 1.80, dpi: 800 }
  ];

  var sel  = document.getElementById("proSelect");
  var note = document.getElementById("proNote");
  if (!sel) return;

  /* ── Popula o dropdown agrupado por jogo ── */
  var byGame = {};
  PROS.forEach(function (p) {
    (byGame[p.game] = byGame[p.game] || []).push(p);
  });

  Object.keys(byGame).forEach(function (game) {
    var og = document.createElement("optgroup");
    og.label = game;
    byGame[game].forEach(function (p, i) {
      var o = document.createElement("option");
      o.value = game + "|" + p.name;
      o.textContent = p.name + " — " + p.team + "  (" + p.sens + " @ " + p.dpi + ")";
      og.appendChild(o);
    });
    sel.appendChild(og);
  });

  /* ── Ao escolher, preenche o conversor ── */
  sel.addEventListener("change", function () {
    if (!sel.value) return;
    var parts = sel.value.split("|");
    var pro = PROS.filter(function (p) {
      return p.game === parts[0] && p.name === parts[1];
    })[0];
    if (!pro) return;

    var fromGame = document.getElementById("fromGame");
    var fromSens = document.getElementById("fromSens");
    var fromDpi  = document.getElementById("fromDpi");
    if (!fromGame || !fromSens || !fromDpi) return;

    /* seleciona o jogo (só se existir na lista) */
    var found = false;
    Array.prototype.forEach.call(fromGame.options, function (o) {
      if (o.value === pro.game || o.textContent.trim() === pro.game) {
        fromGame.value = o.value; found = true;
      }
    });
    if (!found) return;

    fromSens.value = pro.sens;
    fromDpi.value  = pro.dpi;

    /* dispara os eventos que o conversor escuta (tempo real) */
    [fromGame, fromSens, fromDpi].forEach(function (el) {
      el.dispatchEvent(new Event("input",  { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });

    if (note) {
      note.textContent = pro.name + " · " + pro.game + " · " + pro.sens + " @ " + pro.dpi + " DPI";
      note.classList.add("show");
    }
  });
})();
