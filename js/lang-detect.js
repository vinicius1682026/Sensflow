/* ══════════════════════════════════════════════════
   SENSFLOW — Auto Language Detection & Redirect
   ──────────────────────────────────────────────────
   Ordem de prioridade:
     1. ?lang=xx na URL      (link direto, força idioma)
     2. Escolha manual salva (localStorage)
     3. Idioma do navegador  (navigator.languages)
     4. Fallback → pt

   Regras de segurança:
     • Nunca redireciona se já está no idioma certo
     • Redireciona no máximo 1× por sessão (anti-loop)
     • Preserva a página atual: /en/about → /pt/about
     • Preserva hash e query string
   ══════════════════════════════════════════════════ */
(function () {
  "use strict";

  var SUPPORTED = ["pt", "en", "es"];
  var FALLBACK  = "pt";
  var PREF_KEY  = "sf_lang";        // escolha manual (persiste)
  var FLAG_KEY  = "sf_redirected";  // anti-loop (só nesta sessão)

  /* Páginas válidas — evita redirecionar para uma URL que não existe */
  var SLUGS = [
    "", "index.html",
    "sensitivity-converter", "ads-converter",
    "about", "contact", "privacy"
  ];

  /* ── Helpers de storage (à prova de modo privado) ── */
  function get(store, key) {
    try { return window[store].getItem(key); } catch (e) { return null; }
  }
  function set(store, key, val) {
    try { window[store].setItem(key, val); } catch (e) {}
  }

  /* ── Analisa a URL atual ── */
  var path  = window.location.pathname;
  var match = path.match(/^\/(pt|en|es)(?:\/(.*))?$/);

  var currentLang = match ? match[1] : null;               // null = raiz
  var slug        = match && match[2] ? match[2] : "";     // "" = index
  slug = slug.replace(/\.html$/, "").replace(/\/$/, "");

  /* Se a página não é uma das conhecidas, não mexe */
  if (SLUGS.indexOf(slug) === -1) return;

  /* ── 1. ?lang=xx força e salva o idioma ── */
  var forced = new URLSearchParams(window.location.search).get("lang");
  if (forced && SUPPORTED.indexOf(forced) !== -1) {
    set("localStorage", PREF_KEY, forced);
    if (forced !== currentLang) return go(forced);
    return;
  }

  /* ── 2. Escolha manual anterior ── */
  var saved = get("localStorage", PREF_KEY);
  if (saved && SUPPORTED.indexOf(saved) !== -1) {
    if (saved !== currentLang) go(saved);
    return; // respeita a escolha, não olha o navegador
  }

  /* ── 3. Já redirecionou automaticamente nesta sessão? ── */
  if (get("sessionStorage", FLAG_KEY)) return;

  /* ── 4. Idioma do navegador ── */
  var target = detectBrowserLang();

  if (target !== currentLang) {
    set("sessionStorage", FLAG_KEY, "1");
    go(target);
  }

  /* ══════════════════════════════════════ */

  function detectBrowserLang() {
    var langs = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || FALLBACK];

    for (var i = 0; i < langs.length; i++) {
      var code = String(langs[i]).toLowerCase().split("-")[0];
      if (SUPPORTED.indexOf(code) !== -1) return code;
    }
    return FALLBACK;
  }

  function go(lang) {
    var dest = "/" + lang + "/" + (slug === "index.html" ? "" : slug);
    window.location.replace(dest + window.location.hash);
  }
})();
