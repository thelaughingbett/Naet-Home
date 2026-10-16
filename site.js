/* Shared behaviour: mobile menu, contact dialog, current-page nav state. */
(function () {
  "use strict";

  /* ---------- current page in nav ---------- */
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("nav.primary a, .mobile-nav ul a").forEach(function (a) {
    var target = (a.getAttribute("href") || "").split("#")[0].toLowerCase();
    if (target && target === here) a.setAttribute("aria-current", "page");
  });

  /* ---------- mobile menu ---------- */
  (function () {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.getElementById("mobile-nav");
    if (!toggle || !nav) return;
    function setOpen(open) {
      nav.setAttribute("data-open", open ? "true" : "false");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    }
    toggle.addEventListener("click", function () {
      setOpen(nav.getAttribute("data-open") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.getAttribute("data-open") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  })();

  /* ---------- contact dialog (built on demand) ---------- */
  (function () {
    var cfg = window.NAET_CONTACT || {};
    var dlg = null;

    function build() {
      dlg = document.createElement("dialog");
      dlg.className = "contact-dialog";
      dlg.setAttribute("aria-labelledby", "contact-title");
      dlg.innerHTML =
        '<div class="contact-dialog__head"><h2 id="contact-title"></h2>' +
        '<button type="button" class="contact-dialog__close" data-contact-close>Close</button></div>' +
        '<div class="contact-dialog__body"><p class="contact-dialog__intro" id="contact-intro"></p>' +
        '<p class="contact-dialog__topic" id="contact-topic" hidden></p>' +
        '<ul class="contact-list" id="contact-list"></ul>' +
        '<p class="contact-dialog__note" id="contact-note"></p></div>';
      document.body.appendChild(dlg);
    }

    function digits(s) { return String(s).replace(/[^\d+]/g, ""); }

    function hrefFor(ch, topic) {
      switch (ch.type) {
        case "email":
          return "mailto:" + ch.value + (topic ? "?subject=" + encodeURIComponent(topic) : "");
        case "phone":
          return "tel:" + digits(ch.value);
        case "whatsapp":
          return "https://wa.me/" + digits(ch.value).replace("+", "") + (topic ? "?text=" + encodeURIComponent(topic) : "");
        case "link":
          return ch.href || "";
        default:
          return "";
      }
    }

    function render(topic) {
      var list = dlg.querySelector("#contact-list");
      var topicEl = dlg.querySelector("#contact-topic");
      dlg.querySelector("#contact-title").textContent = cfg.title || "Contact us";
      dlg.querySelector("#contact-intro").textContent = cfg.intro || "";
      dlg.querySelector("#contact-note").textContent = cfg.note || "";
      topicEl.hidden = !topic;
      topicEl.textContent = topic ? "Regarding: " + topic : "";
      list.textContent = "";

      var shown = 0;
      (cfg.channels || []).forEach(function (ch) {
        if (!ch || !ch.value) return;
        shown++;
        var li = document.createElement("li");
        li.className = "contact-item";
        var label = document.createElement("span");
        label.className = "contact-item__label";
        label.textContent = ch.label || ch.type.toUpperCase();
        var val = document.createElement("span");
        val.className = "contact-item__value";
        var href = hrefFor(ch, topic);
        if (href) {
          var a = document.createElement("a");
          a.href = href;
          a.textContent = ch.value;
          if (/^https?:/.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
          val.appendChild(a);
        } else {
          val.textContent = ch.value;
        }
        li.appendChild(label);
        li.appendChild(val);
        if (ch.type === "email" || ch.type === "phone" || ch.type === "whatsapp") {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "contact-item__copy";
          btn.textContent = "Copy";
          btn.addEventListener("click", function () {
            if (!navigator.clipboard) return;
            navigator.clipboard.writeText(ch.value).then(function () {
              btn.textContent = "Copied";
              setTimeout(function () { btn.textContent = "Copy"; }, 1500);
            });
          });
          li.appendChild(btn);
        } else {
          li.appendChild(document.createElement("span"));
        }
        list.appendChild(li);
      });

      if (!shown) {
        var empty = document.createElement("li");
        empty.className = "contact-empty";
        empty.textContent = "Contact channels haven't been configured yet. Add them in site-config.js.";
        list.appendChild(empty);
      }
    }

    function open(topic) {
      if (!dlg) build();
      if (typeof dlg.showModal !== "function") return;
      render(topic || "");
      if (!dlg.open) dlg.showModal();
    }

    document.addEventListener("click", function (e) {
      var link = e.target.closest && e.target.closest('a[href="#contact"]');
      if (link) {
        e.preventDefault();
        open(link.getAttribute("data-contact-topic"));
        return;
      }
      if (dlg && e.target.closest && e.target.closest("[data-contact-close]")) dlg.close();
      else if (dlg && e.target === dlg) dlg.close();
    });

    if (location.hash === "#contact") open("");
  })();
})();
