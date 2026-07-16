/* ══════════════════════════════════════════════════
   SENSFLOW — FAQ Accordion
   Abre/fecha as perguntas. Uma aberta por vez.
   ══════════════════════════════════════════════════ */
(function () {
  "use strict";
  var items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach(function (item) {
    var q = item.querySelector(".faq-q");
    if (!q) return;
    q.setAttribute("aria-expanded", "false");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      items.forEach(function (o) {
        o.classList.remove("open");
        var oq = o.querySelector(".faq-q");
        if (oq) oq.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        q.setAttribute("aria-expanded", "true");
      }
    });
  });
})();
