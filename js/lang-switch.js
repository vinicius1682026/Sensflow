/* ══════════════════════════════════════════════════
   SENSFLOW — Language Switcher (3 bandeiras visíveis)
   Clica na bandeira → troca de idioma mantendo a página.
   ══════════════════════════════════════════════════ */
(function () {
  "use strict";
  var PREF_KEY = "sf_lang";

  document.querySelectorAll(".lang-opt[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var lang = btn.getAttribute("data-lang");
      if (btn.classList.contains("active")) return; // já está nesse idioma

      try { localStorage.setItem(PREF_KEY, lang); } catch (e) {}

      /* /en/ads-converter#meu-ads → /pt/ads-converter#meu-ads */
      var slug = window.location.pathname.replace(/^\/(pt|en|es)\/?/, "");
      window.location.href = "/" + lang + "/" + slug + window.location.hash;
    });
  });
})();
