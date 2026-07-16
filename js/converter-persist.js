/* ══════════════════════════════════════════════════
   SENSFLOW — Persistência automática do conversor
   ──────────────────────────────────────────────────
   Salva jogo + DPI + sens conforme o usuário digita,
   e restaura ao reabrir o site. Não exige clicar em
   "Salvar perfil" (isso continua sendo outra coisa:
   o perfil é a config "oficial" do usuário).

   Precedência ao carregar:
     1. perfil salvo (aplicado por profile.js)
     2. último estado do conversor  ← este script
   O último estado vence porque é mais recente.
   ══════════════════════════════════════════════════ */
(function () {
  "use strict";

  var KEY = "sf_converter_state";

  /* Campos monitorados.
     As duas páginas de conversor compartilham os mesmos IDs
     (fromGame, toGame, …); a de ADS acrescenta adsMult.
     NÃO inclui os campos pf* / adsUniv* — esses pertencem aos
     painéis de perfil, que têm o próprio botão "Salvar". */
  var FIELDS = [
    "fromGame", "toGame", "fromSens", "fromDpi", "toDpi", "adsMult"
  ];

  function present() {
    return FIELDS.map(function (id) {
      return document.getElementById(id);
    }).filter(Boolean);
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  var els = present();
  if (!els.length) return;

  /* ── Restaura o último estado ── */
  var saved = load();
  if (saved) {
    els.forEach(function (el) {
      var v = saved[el.id];
      if (v === undefined || v === null || v === "") return;

      /* para <select>, só aplica se a opção existir */
      if (el.tagName === "SELECT") {
        var has = Array.prototype.some.call(el.options, function (o) {
          return o.value === v;
        });
        if (!has) return;
      }
      el.value = v;
    });

    /* dispara o recálculo (os conversores escutam input/change) */
    els.forEach(function (el) {
      el.dispatchEvent(new Event("input",  { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  /* ── Salva a cada alteração (com debounce) ── */
  var timer = null;
  function persist() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var state = load() || {};
      present().forEach(function (el) { state[el.id] = el.value; });
      save(state);
    }, 250);
  }

  els.forEach(function (el) {
    el.addEventListener("input", persist);
    el.addEventListener("change", persist);
  });
})();
