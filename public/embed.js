(function () {
  "use strict";

  var COPY = {
    English: {
      locale: "en-US",
      all: "All classes",
      english: "English",
      spanish: "Español",
      book: "Book this class",
      oneLink: "One link for every date",
      showMore: function (n) { return "Show " + n + " more date" + (n === 1 ? "" : "s"); },
      showLess: "Show fewer dates",
      sessionsLabel: function (n) { return n + " sessions"; },
      noDates: "No dates scheduled right now.",
      loading: "Loading classes…",
      failed: "Class times are unavailable right now.",
      askAbout: "Ask about this class",
      and: "&"
    },
    Spanish: {
      locale: "es-US",
      all: "Todas las clases",
      english: "English",
      spanish: "Español",
      book: "Reservar esta clase",
      oneLink: "Un enlace para todas las fechas",
      showMore: function (n) { return "Ver " + n + " fecha" + (n === 1 ? "" : "s") + " más"; },
      showLess: "Ver menos fechas",
      sessionsLabel: function (n) { return n + " sesiones"; },
      noDates: "No hay fechas programadas.",
      loading: "Cargando clases…",
      failed: "Los horarios no están disponibles en este momento.",
      askAbout: "Consultar sobre esta clase",
      and: "y"
    }
  };

  var CSS = [
    ".bec{--pink:#C56F9C;--pink-dark:#A75E85;--pink-tint:#F7EAF1;--ink:#2E2E2E;",
    "--muted:#6E6E6E;--rule:#E8E8E8;--rule-soft:#F0F0F0;--hair:#9E9E9E;--panel:#F4F4F4;",
    "font-family:'TeXGyreAdventorWeb','Century Gothic','URW Gothic',sans-serif;font-weight:400;",
    "color:var(--ink);max-width:860px;margin:0 auto;line-height:1.5;box-sizing:border-box}",
    ".bec *,.bec *::before,.bec *::after{box-sizing:inherit}",
    ".bec__brand{display:flex;align-items:center;justify-content:center;gap:18px;flex-wrap:wrap;",
    "padding-bottom:20px;border-bottom:1px solid var(--rule);margin-bottom:22px}",
    ".bec__brand img{height:38px;width:auto;display:block}",
    ".bec__x{color:var(--hair);font-size:15px}",
    ".bec__filters{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 22px;padding:0;list-style:none}",
    ".bec__filter{appearance:none;background:#fff;border:1px solid var(--hair);color:var(--ink);",
    "border-radius:999px;padding:8px 18px;font:inherit;font-size:14px;cursor:pointer;line-height:1.2}",
    ".bec__filter:hover{border-color:var(--pink-dark);color:var(--pink-dark)}",
    ".bec__filter[aria-pressed=true]{background:var(--pink-dark);border-color:var(--pink-dark);color:#fff}",
    ".bec__filter:focus-visible{outline:2px solid var(--pink-dark);outline-offset:2px}",
    ".bec__count{opacity:.7;margin-left:4px}",
    ".bec__card{border:1px solid var(--rule);border-radius:10px;overflow:hidden;margin-bottom:16px;background:#fff}",
    ".bec__head{display:flex;gap:18px;padding:20px}",
    ".bec__thumb{width:112px;height:82px;flex:none;border-radius:6px;object-fit:cover;background:var(--panel)}",
    ".bec__title{font-size:19px;line-height:1.3;margin:0;color:var(--ink);font-weight:400}",
    ".bec__tags{display:flex;gap:6px;flex-wrap:wrap;margin:9px 0 0}",
    ".bec__tag{font-size:12px;padding:3px 11px;border-radius:999px;background:var(--panel);color:#5A5A5A}",
    ".bec__tag--lang{background:var(--pink-tint);color:#8E4F70}",
    ".bec__desc{margin:10px 0 0;font-size:13.5px;color:var(--muted);line-height:1.6}",
    ".bec__dates{border-top:1px solid var(--rule);margin:0;padding:0;list-style:none}",
    ".bec__date{display:flex;justify-content:space-between;align-items:center;gap:14px;",
    "padding:12px 20px;border-bottom:1px solid var(--rule-soft)}",
    ".bec__when{font-size:14.5px;color:var(--ink)}",
    ".bec__who{font-size:12.5px;color:var(--muted);margin-top:3px}",
    ".bec__pill{font-size:11.5px;color:#8E4F70;background:var(--pink-tint);padding:3px 10px;",
    "border-radius:999px;white-space:nowrap}",
    ".bec__more{appearance:none;background:none;border:0;border-bottom:1px solid var(--rule-soft);",
    "width:100%;text-align:left;padding:12px 20px;font:inherit;font-size:13.5px;color:var(--pink-dark);cursor:pointer}",
    ".bec__more:hover{background:#FDF8FB}",
    ".bec__more:focus-visible{outline:2px solid var(--pink-dark);outline-offset:-2px}",
    ".bec__foot{padding:18px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}",
    ".bec__note{font-size:12.5px;color:var(--muted)}",
    ".bec__cta{display:inline-block;background:var(--pink-dark);color:#fff;text-decoration:none;",
    "border-radius:999px;padding:12px 26px;font-size:14px;line-height:1}",
    ".bec__cta:hover{background:#8E4F70;color:#fff}",
    ".bec__cta:focus-visible{outline:2px solid var(--ink);outline-offset:2px}",
    ".bec__cta--quiet{background:#fff;color:var(--pink-dark);border:1px solid var(--pink-dark)}",
    ".bec__cta--quiet:hover{background:var(--pink-tint);color:#8E4F70}",
    ".bec__status{padding:28px 0;color:var(--muted);font-size:14px}",
    ".bec__sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    "@media (max-width:560px){.bec__head{flex-direction:column;gap:14px}",
    ".bec__thumb{width:100%;height:150px}",
    ".bec__date{flex-direction:column;align-items:flex-start;gap:6px}",
    ".bec__foot{flex-direction:column;align-items:stretch}",
    ".bec__cta{text-align:center}}"
  ].join("");

  var INITIAL_DATES = 3;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function fmtDay(iso, tz, locale) {
    return new Intl.DateTimeFormat(locale, {
      weekday: "short", month: "short", day: "numeric", timeZone: tz
    }).format(new Date(iso));
  }

  function fmtTime(iso, tz, locale) {
    return new Intl.DateTimeFormat(locale, {
      hour: "numeric", minute: "2-digit", timeZoneName: "short", timeZone: tz
    }).format(new Date(iso));
  }

  function renderDate(offering, tz, copy) {
    var li = el("li", "bec__date");
    var left = el("div");
    var days = offering.sessions.map(function (s) { return fmtDay(s, tz, copy.locale); });
    left.appendChild(el("div", "bec__when", days.join(" " + copy.and + " ")));
    var who = fmtTime(offering.sessions[0], tz, copy.locale);
    if (offering.instructor) who += " · " + offering.instructor;
    left.appendChild(el("div", "bec__who", who));
    li.appendChild(left);
    if (offering.sessions.length > 1) {
      li.appendChild(el("span", "bec__pill", copy.sessionsLabel(offering.sessions.length)));
    }
    return li;
  }

  function renderCard(course, tz, opts) {
    var copy = COPY[course.language] || COPY.English;
    var card = el("article", "bec__card");

    var head = el("div", "bec__head");
    if (course.image) {
      var img = el("img", "bec__thumb");
      img.src = course.image;
      img.alt = "";
      img.loading = "lazy";
      head.appendChild(img);
    }
    var meta = el("div");
    meta.appendChild(el("h3", "bec__title", course.name));

    var tags = el("div", "bec__tags");
    var langTag = el("span", "bec__tag bec__tag--lang",
      course.language === "Spanish" ? copy.spanish : copy.english);
    tags.appendChild(langTag);
    [course.sessions, course.duration, course.topics].forEach(function (t) {
      if (t) tags.appendChild(el("span", "bec__tag", t));
    });
    meta.appendChild(tags);

    if (course.category) meta.appendChild(el("p", "bec__desc", course.category));
    head.appendChild(meta);
    card.appendChild(head);

    var list = el("ul", "bec__dates");
    var shown = course.offerings.slice(0, INITIAL_DATES);
    shown.forEach(function (o) { list.appendChild(renderDate(o, tz, copy)); });
    card.appendChild(list);

    var hidden = course.offerings.length - INITIAL_DATES;
    if (hidden > 0) {
      var btn = el("button", "bec__more", copy.showMore(hidden));
      btn.type = "button";
      btn.setAttribute("aria-expanded", "false");
      var expanded = false;
      btn.addEventListener("click", function () {
        expanded = !expanded;
        list.innerHTML = "";
        (expanded ? course.offerings : shown).forEach(function (o) {
          list.appendChild(renderDate(o, tz, copy));
        });
        btn.textContent = expanded ? copy.showLess : copy.showMore(hidden);
        btn.setAttribute("aria-expanded", String(expanded));
      });
      card.appendChild(btn);
    }

    var foot = el("div", "bec__foot");
    var link = course.bookingLink || opts.fallbackHref;
    var isFallback = !course.bookingLink;
    foot.appendChild(el("span", "bec__note",
      isFallback ? "" : copy.oneLink));
    if (link) {
      var a = el("a", "bec__cta" + (isFallback ? " bec__cta--quiet" : ""),
        isFallback ? copy.askAbout : copy.book);
      a.href = link;
      if (!isFallback) { a.target = "_blank"; a.rel = "noopener"; }
      a.appendChild(el("span", "bec__sr", " — " + course.name));
      foot.appendChild(a);
    }
    card.appendChild(foot);
    return card;
  }

  function mount(root) {
    var src = root.getAttribute("data-src") || "classes.json";
    var opts = {
      fallbackHref: root.getAttribute("data-contact") || "",
      logoHost: root.getAttribute("data-logo-host") || "",
      logoBirthly: root.getAttribute("data-logo-birthly") || "",
      defaultLang: root.getAttribute("data-language") || "all"
    };

    root.className = (root.className ? root.className + " " : "") + "bec";
    if (!document.getElementById("bec-styles")) {
      var style = el("style");
      style.id = "bec-styles";
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    var status = el("p", "bec__status", COPY.English.loading);
    root.appendChild(status);

    fetch(src, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        root.innerHTML = "";

        if (opts.logoHost || opts.logoBirthly) {
          var brand = el("div", "bec__brand");
          if (opts.logoHost) {
            var l1 = el("img"); l1.src = opts.logoHost; l1.alt = "Little Bellies Spa";
            brand.appendChild(l1);
          }
          if (opts.logoHost && opts.logoBirthly) brand.appendChild(el("span", "bec__x", "×"));
          if (opts.logoBirthly) {
            var l2 = el("img"); l2.src = opts.logoBirthly; l2.alt = "Birthly";
            brand.appendChild(l2);
          }
          root.appendChild(brand);
        }

        var tz = data.timezone;
        var courses = data.courses || [];
        var counts = {
          all: courses.length,
          English: courses.filter(function (c) { return c.language === "English"; }).length,
          Spanish: courses.filter(function (c) { return c.language === "Spanish"; }).length
        };

        var bar = el("div", "bec__filters");
        bar.setAttribute("role", "group");
        bar.setAttribute("aria-label", "Filter classes by language");
        var results = el("div");
        var live = el("p", "bec__sr");
        live.setAttribute("role", "status");
        live.setAttribute("aria-live", "polite");

        var current = opts.defaultLang;

        function draw() {
          results.innerHTML = "";
          var list = courses.filter(function (c) {
            return current === "all" || c.language === current;
          });
          if (!list.length) {
            results.appendChild(el("p", "bec__status", COPY.English.noDates));
          } else {
            list.forEach(function (c) { results.appendChild(renderCard(c, tz, opts)); });
          }
          live.textContent = list.length + " classes shown";
          Array.prototype.forEach.call(bar.children, function (b) {
            b.setAttribute("aria-pressed", String(b.dataset.lang === current));
          });
        }

        [["all", COPY.English.all], ["English", COPY.English.english], ["Spanish", COPY.English.spanish]]
          .forEach(function (pair) {
            var key = pair[0];
            if (key !== "all" && !counts[key]) return;
            var b = el("button", "bec__filter");
            b.type = "button";
            b.dataset.lang = key;
            b.appendChild(document.createTextNode(pair[1]));
            b.appendChild(el("span", "bec__count", String(counts[key])));
            b.addEventListener("click", function () { current = key; draw(); });
            bar.appendChild(b);
          });

        root.appendChild(bar);
        root.appendChild(live);
        root.appendChild(results);
        draw();
      })
      .catch(function (err) {
        root.innerHTML = "";
        root.appendChild(el("p", "bec__status", COPY.English.failed));
        if (window.console) console.error("[birthly-embed]", err);
      });
  }

  function init() {
    var nodes = document.querySelectorAll("[data-birthly-classes]");
    Array.prototype.forEach.call(nodes, mount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else init();
})();
