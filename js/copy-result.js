/* ══════════════════════════════════════════════════
   SENSFLOW — Copiar resultado da conversão
   Botão ao lado da sensibilidade convertida.
   Funciona no conversor hipfire e no ADS.
   ══════════════════════════════════════════════════ */
(function () {
  "use strict";

  var I18N = {
    pt: { copy: "Copiar", done: "Copiado!", fail: "Erro ao copiar" },
    en: { copy: "Copy",   done: "Copied!",  fail: "Copy failed" },
    es: { copy: "Copiar", done: "¡Copiado!", fail: "Error al copiar" }
  };

  var lang = (document.documentElement.lang || "pt").slice(0, 2);
  var t = I18N[lang] || I18N.pt;

  /* IDs de resultado que devem ganhar botão de copiar */
  var TARGETS = ["resultSens", "adsResultSens"];

  /* Fallback para navegadores sem navigator.clipboard (http, Safari antigo) */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy") ? resolve() : reject();
      } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  TARGETS.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-result";
    btn.setAttribute("aria-label", t.copy);
    btn.title = t.copy;
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="9" y="9" width="13" height="13" rx="2"/>' +
      '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
      '<span class="copy-label">' + t.copy + '</span>';

    /* envolve o valor + botão numa linha */
    var row = document.createElement("div");
    row.className = "result-value-row";
    el.parentNode.insertBefore(row, el);
    row.appendChild(el);
    row.appendChild(btn);

    btn.addEventListener("click", function () {
      var val = (el.textContent || "").trim();
      /* não copia placeholder vazio */
      if (!val || val === "—") return;

      copyText(val).then(function () {
        btn.classList.add("copied");
        btn.querySelector(".copy-label").textContent = t.done;
        btn.title = t.done;
        setTimeout(function () {
          btn.classList.remove("copied");
          btn.querySelector(".copy-label").textContent = t.copy;
          btn.title = t.copy;
        }, 1800);
      }).catch(function () {
        btn.querySelector(".copy-label").textContent = t.fail;
        setTimeout(function () {
          btn.querySelector(".copy-label").textContent = t.copy;
        }, 1800);
      });
    });
  });
})();
