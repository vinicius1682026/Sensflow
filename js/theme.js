/* ══════════════════════════════════════════════════
   SENSFLOW — Trocador de Temas
   Aplica data-theme no <html> e salva no localStorage.
   Temas: dark (padrão) · cyber · pastel
   ══════════════════════════════════════════════════ */
(function () {
  "use strict";

  var KEY    = "sf_theme";
  var THEMES = ["dark", "cyber", "pastel"];

  function get() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(t) {
    try { localStorage.setItem(KEY, t); } catch (e) {}
  }

  function apply(theme) {
    if (THEMES.indexOf(theme) === -1) theme = "dark";
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll(".theme-opt").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-theme") === theme);
    });
  }

  /* aplica o salvo assim que o script roda (evita "flash" do tema errado) */
  apply(get() || "dark");

  document.addEventListener("DOMContentLoaded", function () {
    apply(get() || "dark");
    document.querySelectorAll(".theme-opt").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var t = btn.getAttribute("data-theme");
        save(t);
        apply(t);
      });
    });
  });
})();
