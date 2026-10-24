/* ===== [PAGE JS — move into creds.js when migrating] ===== */
(function () {
  "use strict";
  var MD_URL = "credentials.md"; /* path to the markdown file */
  var PAGE = 50; /* rows per "show more" */
  var PW_L = "ChangeMe!",
    PW_S = "ChangeMe123!";
  var TITLE = /^(Prof\.|Snr\. Lec\.|Asst\. Lec\.|Jr\. Lec\.|Lec\.)\s+/;

  /* ---------- embedded fallback data (delete if you always serve the .md) ---------- */
  var LEC = [
    [
      "Agricultural Sciences",
      [
        "Prof. Daniel Ndungu",
        "Snr. Lec. David Mwangi",
        "Lec. Rose Odhiambo",
        "Lec. Beatrice Mutua",
        "Asst. Lec. Winnie Simiyu",
        "Jr. Lec. Ann Rotich",
        "Prof. Mercy Mohamed",
        "Snr. Lec. Joseph Onyango",
        "Lec. Faith Mohamed",
        "Lec. Collins Simiyu",
        "Asst. Lec. Kevin Wafula",
        "Jr. Lec. James Mutua",
      ],
    ],
    [
      "Business Administration",
      [
        "Prof. Nelson Rotich",
        "Snr. Lec. Caroline Mutua",
        "Lec. Ann Wekesa",
        "Lec. James Omondi",
        "Asst. Lec. Purity Omondi",
        "Jr. Lec. James Cheruiyot",
        "Prof. Samuel Mutua",
        "Snr. Lec. Felix Kiptoo",
        "Lec. Esther Wekesa",
        "Lec. Collins Rotich",
        "Asst. Lec. Lucy Otieno",
        "Jr. Lec. Isaac Ndungu",
      ],
    ],
    [
      "Civil Engineering",
      [
        "Prof. Joseph Omondi",
        "Snr. Lec. Victor Simiyu",
        "Lec. Naomi Karanja",
        "Lec. Daniel Odhiambo",
        "Asst. Lec. Ann Wafula",
        "Jr. Lec. Victor Kiptoo",
        "Prof. Esther Abdi",
        "Snr. Lec. Ann Karanja",
        "Lec. Dennis Otieno",
        "Lec. Irene Ndungu",
        "Asst. Lec. Ann Chebet",
        "Jr. Lec. Beatrice Langat",
      ],
    ],
    [
      "Clinical Medicine",
      [
        "Prof. Mercy Omondi",
        "Snr. Lec. Esther Kiptoo",
        "Lec. Isaac Rotich",
        "Lec. Jane Mwangi",
        "Asst. Lec. Winnie Kamau",
        "Jr. Lec. Peter Omondi",
        "Prof. Esther Omondi",
        "Snr. Lec. Beatrice Mwangi",
        "Lec. Naomi Rotich",
        "Lec. Brian Wekesa",
        "Asst. Lec. Brian Kamau",
        "Jr. Lec. Irene Otieno",
      ],
    ],
    [
      "Education Arts",
      [
        "Prof. Lucy Wafula",
        "Snr. Lec. David Kariuki",
        "Lec. Brian Kariuki",
        "Lec. James Mwangi",
        "Asst. Lec. Purity Onyango",
        "Jr. Lec. Mercy Onyango",
        "Prof. David Chebet",
        "Snr. Lec. Irene Karanja",
        "Lec. Kevin Wekesa",
        "Lec. Daniel Kilonzo",
        "Asst. Lec. Daniel Kiptoo",
        "Jr. Lec. James Wafula",
      ],
    ],
    [
      "Mathematics and Computer Science",
      [
        "Prof. Naomi Kamau",
        "Snr. Lec. Lucy Mohamed",
        "Lec. Felix Omondi",
        "Lec. Naomi Mutua",
        "Asst. Lec. Grace Rotich",
        "Jr. Lec. Joseph Langat",
        "Prof. James Kilonzo",
        "Snr. Lec. Esther Mutua",
        "Lec. Caroline Barasa",
        "Lec. Kevin Kariuki",
        "Asst. Lec. Irene Kiptoo",
        "Jr. Lec. Ann Kilonzo",
      ],
    ],
    [
      "Pharmacy",
      [
        "Prof. Beatrice Mohamed",
        "Snr. Lec. Beatrice Wafula",
        "Lec. Faith Kiptoo",
        "Lec. Mercy Kilonzo",
        "Asst. Lec. Purity Kiptoo",
        "Jr. Lec. Irene Kilonzo",
        "Prof. Collins Odhiambo",
        "Snr. Lec. Brian Mutua",
        "Lec. David Otieno",
        "Lec. Purity Ndungu",
        "Asst. Lec. Felix Rotich",
        "Jr. Lec. James Abdi",
      ],
    ],
    [
      "Private Law",
      [
        "Prof. David Odhiambo",
        "Snr. Lec. Irene Omondi",
        "Lec. Brian Odhiambo",
        "Lec. Collins Langat",
        "Asst. Lec. James Otieno",
        "Jr. Lec. Purity Mohamed",
        "Prof. Grace Abdi",
        "Snr. Lec. Faith Otieno",
        "Lec. Felix Karanja",
        "Lec. Daniel Mwangi",
        "Asst. Lec. Victor Rotich",
        "Jr. Lec. Naomi Kariuki",
      ],
    ],
  ];
  var CLS = [
    ["BCOM", 23, 26],
    ["BED-ARTS", 23, 26],
    ["BPHARM", 22, 26],
    ["BSC-AGR", 23, 26],
    ["BSC-CE", 22, 26],
    ["CS", 23, 26],
    ["LLB", 23, 26],
    ["MBCHB", 21, 26],
  ];
  var FEAT = [
    /* hand-seeded demo students: name, email local part, reg no */
    ["Grace Atieno Achieng", "grace.achieng", "BCOM/0005/26"],
    ["Hassan Juma Mohamed", "hassan.mohamed", "BCOM/0010/26"],
    ["Amina Hassan Abdi", "amina.abdi", "BED-ARTS/0003/26"],
    ["Faith Naliaka Wekesa", "faith.wekesa", "BPHARM/0007/26"],
    ["Peter Mutua Kioko", "peter.kioko", "BSC-AGR/0006/26"],
    ["Kevin Kipchoge Rotich", "kevin.rotich", "BSC-CE/0004/26"],
    ["Wanjiku Mwangi Njeri", "wanjiku.njeri", "CS/0001/26"],
    ["Daniel Lekishon Sankale", "daniel.sankale", "CS/0008/26"],
    ["Mercy Wairimu Kamau", "mercy.kamau", "LLB/0009/26"],
    ["Brian Otieno Odhiambo", "brian.odhiambo", "MBCHB/0002/26"],
  ];

  function buildEmbedded() {
    var secs = [],
      n = 0;
    LEC.forEach(function (d) {
      secs.push({
        group: "Lecturers",
        name: d[0],
        rows: d[1].map(function (nm, i) {
          n++;
          return [
            nm,
            i === 0 ? "HOD" : "",
            nm.replace(TITLE, "").toLowerCase().split(" ").join(".") +
              "@naetuniversity.com",
            PW_L,
            "NU/LEC/" + ("000" + n).slice(-4),
          ];
        }),
      });
    });
    CLS.forEach(function (c) {
      for (var y = c[1]; y <= c[2]; y++) {
        var rows =
          y !== 26
            ? []
            : FEAT.filter(function (f) {
                return f[2].indexOf(c[0] + "/") === 0;
              }).map(function (f) {
                return [
                  f[0],
                  "",
                  f[1] + "@example.com",
                  PW_S,
                  f[2],
                  f[1] + "@students.naetuniversity.com",
                ];
              });
        secs.push({
          group: "Students",
          name: c[0] + "/" + y + " (70)",
          rows: rows,
          sample: true,
        });
      }
    });
    return secs;
  }

  /* ---------- markdown parser ---------- */
  function parse(md) {
    var secs = [],
      group = "",
      cur = null;
    md.split("\n").forEach(function (l) {
      if (/^## Lecturers/.test(l)) group = "Lecturers";
      else if (/^## Students/.test(l)) group = "Students";
      else if (/^### /.test(l)) {
        cur = { group: group, name: l.slice(4).trim(), rows: [] };
        secs.push(cur);
      } else if (cur && l.charAt(0) === "|") {
        var c = l
          .split("|")
          .slice(1, -1)
          .map(function (s) {
            return s.trim();
          });
        if (c[0] === "Name" || /^[-:\s]+$/.test(c[0])) return;
        cur.rows.push(c);
      }
    });
    return secs.filter(function (s) {
      return s.group;
    });
  }

  /* ---------- UI ---------- */
  var $ = function (id) {
    return document.getElementById(id);
  };
  var secs = [],
    state = { g: "All", sec: "", q: "", limit: PAGE },
    fromFile = false;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function cp(value, sub) {
    var b = el("button", "cp" + (sub ? " cp--sub" : ""), value || "—");
    b.type = "button";
    b.title = "Click to copy";
    if (!value) {
      b.disabled = true;
      return b;
    }
    b.addEventListener("click", function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(value).then(function () {
        b.classList.add("ok");
        b.textContent = "Copied";
        setTimeout(function () {
          b.classList.remove("ok");
          b.textContent = value;
        }, 1100);
      });
    });
    return b;
  }

  function fillSelect() {
    var s = $("sec");
    s.textContent = "";
    var o = el("option", "", "All departments & classes");
    o.value = "";
    s.appendChild(o);
    secs.forEach(function (x) {
      if (state.g !== "All" && x.group !== state.g) return;
      var op = el("option", "", x.group === "Lecturers" ? x.name : x.name);
      op.value = x.group + "|" + x.name;
      s.appendChild(op);
    });
    state.sec = "";
  }

  function matches() {
    var out = [],
      q = state.q.toLowerCase();
    secs.forEach(function (s) {
      if (state.g !== "All" && s.group !== state.g) return;
      if (state.sec && state.sec !== s.group + "|" + s.name) return;
      s.rows.forEach(function (r) {
        if (!q || r.join(" ").toLowerCase().indexOf(q) > -1)
          out.push({ s: s, r: r });
      });
    });
    return out;
  }

  function render() {
    var list = $("list"),
      all = matches(),
      shown = all.slice(0, state.limit);
    list.textContent = "";
    var head = el("div", "creds__row creds__row--head");
    ["NAME", "LOGIN EMAIL", "PASSWORD", "STAFF / REG NO."].forEach(
      function (t) {
        head.appendChild(el("span", "", t));
      },
    );
    list.appendChild(head);

    if (!shown.length) {
      var sampleSec =
        state.sec &&
        secs.some(function (s) {
          return s.sample && state.sec === s.group + "|" + s.name;
        });
      list.appendChild(
        el(
          "div",
          "empty",
          sampleSec
            ? "The full class list loads from credentials.md. Serve this page next to that file over http(s) to see all 70 students."
            : "No matches. Try a different search.",
        ),
      );
    }
    shown.forEach(function (x) {
      var r = x.r,
        row = el("div", "creds__row"),
        who = el("div", "who", r[0]);
      if (r[1])
        who.appendChild(
          el(
            "span",
            "badge " + (r[1] === "HOD" ? "badge--hod" : "badge--rep"),
            r[1],
          ),
        );
      who.appendChild(el("small", "", x.s.name));
      row.appendChild(who);
      var mail = el("div");
      mail.appendChild(cp(r[2]));
      if (r[5]) mail.appendChild(cp(r[5], true));
      row.appendChild(mail);
      row.appendChild(cp(r[3]));
      row.appendChild(cp(r[4]));
      list.appendChild(row);
    });

    $("count").textContent =
      all.length.toLocaleString() +
      " account" +
      (all.length === 1 ? "" : "s") +
      (shown.length < all.length ? " · showing " + shown.length : "");
    var more = $("more");
    if (shown.length < all.length) {
      more.hidden = false;
      more.textContent = "";
      var b = el(
        "button",
        "btn btn--ghost",
        "Show " + Math.min(PAGE, all.length - shown.length) + " more",
      );
      b.type = "button";
      b.addEventListener("click", function () {
        state.limit += PAGE;
        render();
      });
      more.appendChild(b);
    } else more.hidden = true;
  }

  function status() {
    var total = secs.reduce(function (a, s) {
      return a + s.rows.length;
    }, 0);
    var s = $("src");
    if (fromFile) {
      s.className = "src";
      s.textContent =
        "● Loaded " + total.toLocaleString() + " accounts from credentials.md";
    } else {
      s.className = "src warn";
      s.textContent =
        "● Embedded sample (" +
        total +
        " accounts). credentials.md not reachable here.";
    }
  }

  function init() {
    status();
    fillSelect();
    render();
    document.querySelectorAll("[data-g]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.g = b.getAttribute("data-g");
        state.limit = PAGE;
        document.querySelectorAll("[data-g]").forEach(function (x) {
          x.setAttribute("aria-pressed", x === b ? "true" : "false");
        });
        fillSelect();
        render();
      });
    });
    $("sec").addEventListener("change", function (e) {
      state.sec = e.target.value;
      state.limit = PAGE;
      render();
    });
    var t;
    $("q").addEventListener("input", function (e) {
      clearTimeout(t);
      t = setTimeout(function () {
        state.q = e.target.value.trim();
        state.limit = PAGE;
        render();
      }, 120);
    });
  }

  /* Works over http:// and https:// alike. Tries fetch, then XHR (which also
     works from file:// in Firefox/Safari), then the embedded sample. */
  function xhr(url) {
    return new Promise(function (res, rej) {
      var x = new XMLHttpRequest();
      x.open("GET", url);
      x.onload = function () {
        x.status === 200 || (x.status === 0 && x.responseText)
          ? res(x.responseText)
          : rej();
      };
      x.onerror = rej;
      x.send();
    });
  }
  function load() {
    return fetch(MD_URL, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw 0;
        return r.text();
      })
      .catch(function () {
        return xhr(MD_URL);
      });
  }
  load()
    .then(function (t) {
      var p = parse(t);
      if (!p.length) throw 0;
      secs = p;
      fromFile = true;
    })
    .catch(function () {
      secs = buildEmbedded();
    })
    .then(function () {
      init();
      /* manual fallback: pick credentials.md from disk (works in every browser, any protocol) */
      $("pick").addEventListener("change", function (e) {
        var f = e.target.files[0];
        if (!f) return;
        var rd = new FileReader();
        rd.onload = function () {
          var p = parse(String(rd.result));
          if (!p.length) {
            $("src").className = "src warn";
            $("src").textContent =
              "● That file doesn't look like credentials.md";
            return;
          }
          secs = p;
          fromFile = true;
          state.limit = PAGE;
          state.sec = "";
          status();
          fillSelect();
          render();
        };
        rd.readAsText(f);
      });
    });
})();
