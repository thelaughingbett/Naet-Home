/* Shared behaviour: mobile menu, contact dialog, current-page nav state. */
(function () {
  "use strict";

  /* ---------- current page in nav ---------- */
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document
    .querySelectorAll("nav.primary a, .mobile-nav ul a")
    .forEach(function (a) {
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

    // Converts 0712345678, +254712345678 or 254712345678 to 254712345678
    function intl(s) {
      var cc = cfg.countryCode || "254";
      var d = String(s).replace(/[^\d+]/g, "");
      if (d.charAt(0) === "+") return d.slice(1);
      if (d.indexOf("00") === 0) return d.slice(2);
      if (d.charAt(0) === "0") return cc + d.slice(1);
      return d;
    }

    function waLink(value, text) {
      return (
        "https://wa.me/" +
        intl(value) +
        (text ? "?text=" + encodeURIComponent(text) : "")
      );
    }

    function hrefFor(ch, topic) {
      switch (ch.type) {
        case "email":
          return (
            "mailto:" +
            ch.value +
            (topic ? "?subject=" + encodeURIComponent(topic) : "")
          );
        case "phone":
          return "tel:+" + intl(ch.value);
        case "whatsapp":
          return waLink(ch.value, topic || cfg.whatsappMessage || "");
        case "link":
          return ch.href || "";
        default:
          return "";
      }
    }

    function render(topic) {
      var list = dlg.querySelector("#contact-list");
      var topicEl = dlg.querySelector("#contact-topic");
      dlg.querySelector("#contact-title").textContent =
        cfg.title || "Contact us";
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
          if (/^https?:/.test(href)) {
            a.target = "_blank";
            a.rel = "noopener";
          }
          val.appendChild(a);
        } else {
          val.textContent = ch.value;
        }
        li.appendChild(label);
        li.appendChild(val);
        if (
          ch.type === "email" ||
          ch.type === "phone" ||
          ch.type === "whatsapp"
        ) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "contact-item__copy";
          btn.textContent = "Copy";
          btn.addEventListener("click", function () {
            if (!navigator.clipboard) return;
            navigator.clipboard.writeText(ch.value).then(function () {
              btn.textContent = "Copied";
              setTimeout(function () {
                btn.textContent = "Copy";
              }, 1500);
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
        empty.textContent =
          "Contact channels haven't been configured yet. Add them in site-config.js.";
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
      if (dlg && e.target.closest && e.target.closest("[data-contact-close]"))
        dlg.close();
      else if (dlg && e.target === dlg) dlg.close();
    });

    // Floating WhatsApp button
    (function () {
      if (cfg.floatingWhatsApp === false) return;
      var wa = (cfg.channels || []).filter(function (c) {
        return c && c.type === "whatsapp" && c.value;
      })[0];
      if (!wa) return;
      var a = document.createElement("a");
      a.className = "wa-float";
      a.href = waLink(wa.value, cfg.whatsappMessage || "");
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", "Chat with us on WhatsApp");
      a.innerHTML =
        '<svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true" fill="currentColor"><path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.3.7 4.5 1.9 6.3L4 29l8-2.1c1.7.9 3.6 1.4 5.6 1.4h.1c6.6 0 11.9-5.3 11.9-11.9C29.6 8.8 23.2 3 16 3zm0 22.6c-1.8 0-3.5-.5-5-1.4l-.4-.2-4.7 1.2 1.3-4.6-.3-.4a9.6 9.6 0 0 1-1.5-5.1C5.4 9.9 10.1 5.2 16 5.2s10.6 4.7 10.6 10.6S21.9 25.6 16 25.6zm5.8-7.2c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.1.8.4 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>' +
        "<span>Chat on WhatsApp</span>";
      document.body.appendChild(a);
    })();

    if (location.hash === "#contact") open("");
  })();

  /* ---------- video dialog (playlist; player is created only when played) ---------- */
  (function () {
    var list = (
      window.NAET_VIDEOS || (window.NAET_VIDEO ? [window.NAET_VIDEO] : [])
    ).filter(function (v) {
      return v && v.url;
    });
    if (!list.length) return; // nothing configured: triggers stay hidden

    var triggers = document.querySelectorAll("[data-video-trigger]");
    triggers.forEach(function (t) {
      t.hidden = false;
      // Generic triggers (no data-video-id) open the playlist, so label them accordingly
      if (list.length > 1 && !t.getAttribute("data-video-id")) {
        t.textContent = "▶ Watch the videos";
      }
    });

    var dlg = null,
      lastFocus = null,
      current = 0;

    function parse(url) {
      var m;
      if (
        (m = url.match(
          /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
        ))
      )
        return {
          kind: "iframe",
          src:
            "https://www.youtube-nocookie.com/embed/" +
            m[1] +
            "?autoplay=1&rel=0",
        };
      if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)))
        return {
          kind: "iframe",
          src: "https://player.vimeo.com/video/" + m[1] + "?autoplay=1",
        };
      return { kind: "file", src: url };
    }

    function build() {
      dlg = document.createElement("dialog");
      dlg.className = "video-dialog";
      dlg.setAttribute("aria-labelledby", "video-title");
      dlg.innerHTML =
        '<div class="contact-dialog__head"><h2 id="video-title"></h2>' +
        '<button type="button" class="contact-dialog__close" data-video-close>Close</button></div>' +
        '<div class="video-dialog__tabs" id="video-tabs" role="group" aria-label="Choose a video" hidden></div>' +
        '<div class="video-dialog__stage" id="video-stage"></div>' +
        '<p class="video-dialog__caption" id="video-caption" hidden></p>';
      document.body.appendChild(dlg);

      var tabs = dlg.querySelector("#video-tabs");
      if (list.length > 1) {
        tabs.hidden = false;
        list.forEach(function (v, i) {
          var b = document.createElement("button");
          b.type = "button";
          b.textContent = v.title || "Video " + (i + 1);
          b.addEventListener("click", function () {
            play(i);
          });
          tabs.appendChild(b);
        });
      }

      dlg.addEventListener("close", function () {
        dlg.querySelector("#video-stage").textContent = ""; // destroys the player, stops playback
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      });
      dlg.addEventListener("click", function (e) {
        if (
          e.target === dlg ||
          (e.target.closest && e.target.closest("[data-video-close]"))
        )
          dlg.close();
      });
    }

    function play(i) {
      current = i;
      var v = list[i];
      var title = v.title || "Overview video";
      dlg.querySelector("#video-title").textContent = title;

      var cap = dlg.querySelector("#video-caption");
      cap.hidden = !v.caption;
      cap.textContent = v.caption || "";

      dlg.querySelectorAll("#video-tabs button").forEach(function (b, n) {
        b.setAttribute("aria-pressed", n === i ? "true" : "false");
      });

      var stage = dlg.querySelector("#video-stage");
      stage.textContent = ""; // tears down the previous player first
      var p = parse(v.url),
        el;
      if (p.kind === "iframe") {
        el = document.createElement("iframe");
        el.src = p.src;
        el.title = title;
        el.allow = "autoplay; fullscreen; picture-in-picture";
        el.allowFullscreen = true;
        el.referrerPolicy = "strict-origin-when-cross-origin";
      } else {
        el = document.createElement("video");
        el.controls = true;
        el.autoplay = true;
        el.playsInline = true;
        el.preload = "metadata";
        if (v.poster) el.poster = v.poster;
        el.src = p.src;
      }
      stage.appendChild(el);
    }

    function indexOf(id) {
      for (var i = 0; i < list.length; i++) if (list[i].id === id) return i;
      return 0; // unknown or missing id: first video
    }

    function open(id) {
      if (!dlg) build();
      var i = indexOf(id);
      if (typeof dlg.showModal !== "function") {
        window.open(list[i].url, "_blank", "noopener");
        return;
      }
      lastFocus = document.activeElement;
      play(i);
      if (!dlg.open) dlg.showModal();
    }

    document.addEventListener("click", function (e) {
      var t = e.target.closest && e.target.closest("[data-video-trigger]");
      if (t) {
        e.preventDefault();
        open(t.getAttribute("data-video-id"));
      }
    });

    // #video opens the first video, #video-<id> opens a specific one
    var m = location.hash.match(/^#video(?:-([\w-]+))?$/);
    if (m) open(m[1] || "");
  })();
})();
