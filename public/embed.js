(function () {
  "use strict";

  var COPY = {
    English: {
      locale: "en-US",
      english: "English",
      spanish: "Español",
      book: "Book this class",
      nextClass: "Next class",
      onThisDate: "Class on this date",
      noDates: "No dates scheduled right now.",
      loading: "Loading classes…",
      failed: "Class times are unavailable right now.",
      askAbout: "Ask about this class",
      allShort: "All",
      and: "&",
      prevMonth: "Previous month",
      nextMonth: "Next month",
      weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    },
    Spanish: {
      locale: "es-US",
      english: "English",
      spanish: "Español",
      book: "Reservar esta clase",
      nextClass: "Próxima clase",
      onThisDate: "Clase en esta fecha",
      noDates: "No hay fechas programadas.",
      loading: "Cargando clases…",
      failed: "Los horarios no están disponibles en este momento.",
      askAbout: "Consultar sobre esta clase",
      allShort: "Todas",
      and: "y",
      prevMonth: "Mes anterior",
      nextMonth: "Mes siguiente",
      weekdays: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"]
    }
  };

  var CSS = [
    ".bec{--pink:#C56F9C;--pink-dark:#A75E85;--pink-tint:#F7EAF1;--ink:#2E2E2E;",
    "--muted:#6E6E6E;--rule:#E8E8E8;--hair:#9E9E9E;--panel:#F6F6F6;",
    "font-family:'TeXGyreAdventorWeb','Century Gothic','URW Gothic',sans-serif;font-weight:400;",
    "color:var(--ink);max-width:940px;margin:0 auto;line-height:1.5;box-sizing:border-box}",
    ".bec *,.bec *::before,.bec *::after{box-sizing:inherit}",

    /* Brand header */
    ".bec__brand{display:flex;align-items:center;justify-content:center;gap:18px;flex-wrap:wrap;",
    "padding-bottom:16px;border-bottom:1px solid var(--rule);margin-bottom:16px}",
    ".bec__brand img{height:38px;width:auto;display:block}",
    ".bec__x{color:var(--hair);font-size:15px}",

    /* Sticky nav: language + class pills */
    ".bec__nav{position:sticky;top:0;z-index:10;background:rgba(255,255,255,0.97);",
    "backdrop-filter:blur(4px);padding:10px 0 14px;margin-bottom:14px}",
    ".bec__filters{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 12px;padding:0 0 12px;",
    "border-bottom:1px dashed var(--rule)}",
    ".bec__filter{appearance:none;background:#fff;border:1px solid var(--hair);color:var(--ink);",
    "border-radius:999px;padding:8px 20px;font:inherit;font-size:14px;cursor:pointer;line-height:1.2;transition:all .15s ease}",
    ".bec__filter:hover{border-color:var(--pink-dark);color:var(--pink-dark)}",
    ".bec__filter[aria-pressed=true]{background:var(--pink-dark);border-color:var(--pink-dark);color:#fff}",
    ".bec__filter:focus-visible{outline:2px solid var(--pink-dark);outline-offset:2px}",
    ".bec__count{opacity:.75;margin-left:5px;font-size:12px}",
    ".bec__classnav{display:flex;gap:8px;flex-wrap:wrap}",
    ".bec__cpill{appearance:none;background:var(--panel);border:1px solid transparent;color:var(--ink);",
    "border-radius:999px;padding:7px 15px;font:inherit;font-size:13.5px;cursor:pointer;line-height:1.25;transition:all .15s ease}",
    ".bec__cpill:hover{border-color:var(--pink-dark);color:var(--pink-dark);background:#fff}",
    ".bec__cpill[aria-pressed=true]{background:var(--pink-tint);border-color:var(--pink-dark);color:#8E4F70}",
    ".bec__cpill:focus-visible{outline:2px solid var(--pink-dark);outline-offset:2px}",

    /* Card: info + footer on the left, calendar on the right */
    ".bec__card{display:grid;grid-template-columns:minmax(0,1fr) 272px;grid-template-rows:1fr auto;",
    "grid-template-areas:'head cal' 'foot cal';border:1px solid var(--rule);border-radius:12px;",
    "overflow:hidden;margin-bottom:16px;background:#fff}",

    ".bec__head{grid-area:head;display:flex;gap:18px;padding:20px 22px}",
    ".bec__thumb{width:120px;height:96px;flex:none;border-radius:8px;object-fit:cover;background:var(--panel)}",
    ".bec__headbody{flex:1;min-width:0}",
    ".bec__title{font-size:19px;line-height:1.3;margin:0;color:var(--ink);font-weight:400}",
    ".bec__tags{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 0}",
    ".bec__tag{font-size:11.5px;padding:3px 10px;border-radius:999px;background:var(--panel);color:#5A5A5A}",
    ".bec__tag--lang{background:var(--pink-tint);color:#8E4F70}",
    ".bec__desc{margin:10px 0 0;font-size:13.5px;line-height:1.55}",
    ".bec__cat{margin:6px 0 0;font-size:12px;color:var(--muted)}",

    /* Footer: next/selected class + CTA */
    ".bec__foot{grid-area:foot;display:flex;align-items:center;justify-content:space-between;gap:16px;",
    "padding:14px 22px;background:#FAFAFA;border-top:1px solid var(--rule)}",
    ".bec__detail{min-width:0;font-size:13.5px;line-height:1.4}",
    ".bec__detlabel{display:block;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:2px}",
    ".bec__detline{display:block}",
    ".bec__detmeta{color:var(--muted)}",
    ".bec__cta{flex:none;display:inline-block;background:var(--pink-dark);color:#fff;text-decoration:none;",
    "border-radius:999px;padding:12px 26px;font-size:14px;line-height:1;transition:background .15s ease}",
    ".bec__cta:hover{background:#8E4F70;color:#fff}",
    ".bec__cta:focus-visible{outline:2px solid var(--ink);outline-offset:2px}",
    ".bec__cta--quiet{background:#fff;color:var(--pink-dark);border:1px solid var(--pink-dark)}",
    ".bec__cta--quiet:hover{background:var(--pink-tint);color:#8E4F70}",

    /* Compact calendar */
    ".bec__calwrap{grid-area:cal;padding:16px 18px;border-left:1px solid var(--rule);background:#FCFAFB}",
    ".bec__calinner{max-width:300px;margin:0 auto}",
    ".bec__calhead{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}",
    ".bec__calmonth{font-size:14px;letter-spacing:.01em}",
    ".bec__calnav{display:flex;gap:6px}",
    ".bec__calbtn{appearance:none;background:#fff;border:1px solid var(--rule);color:var(--ink);",
    "width:26px;height:26px;border-radius:6px;font:inherit;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}",
    ".bec__calbtn:hover:not(:disabled){border-color:var(--pink-dark);color:var(--pink-dark)}",
    ".bec__calbtn:disabled{opacity:.35;cursor:default}",
    ".bec__calgrid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px 0;text-align:center}",
    ".bec__caldow{font-size:11px;color:var(--muted);padding-bottom:4px}",
    ".bec__calday{width:30px;height:30px;margin:0 auto;display:flex;align-items:center;justify-content:center;",
    "font-size:12.5px;border-radius:50%;border:1px solid transparent;background:transparent;color:var(--hair);padding:0;font-family:inherit}",
    ".bec__calday--empty{visibility:hidden}",
    ".bec__calday--has{color:var(--ink);font-weight:bold;cursor:pointer}",
    ".bec__calday--has:hover{background:#F1F1F1;border-color:var(--rule)}",
    ".bec__calday--has:focus-visible{outline:2px solid var(--pink-dark);outline-offset:1px}",
    ".bec__calday--active,.bec__calday--active:hover{background:var(--pink-dark);color:#fff;border-color:var(--pink-dark)}",

    ".bec__status{padding:28px 0;color:var(--muted);font-size:14px}",
    ".bec__sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",

    /* Tablet / mobile: stack head → calendar → footer */
    "@media (max-width:720px){",
    ".bec__card{grid-template-columns:1fr;grid-template-rows:auto;grid-template-areas:'head' 'cal' 'foot'}",
    ".bec__calwrap{border-left:0;border-top:1px solid var(--rule)}",
    ".bec__classnav{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:6px}",
    ".bec__cpill{white-space:nowrap;flex:none}}",
    "@media (max-width:560px){",
    ".bec__head{flex-direction:column;gap:12px;padding:16px}",
    ".bec__thumb{width:100%;height:140px}",
    ".bec__foot{flex-direction:column;align-items:stretch;padding:14px 16px}",
    ".bec__cta{text-align:center}}"
  ].join("");

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  // English unless the page explicitly asks for Spanish (any casing, "es", "Español", etc.)
  function normalizeLang(value) {
    return /^(es|spa|spanish|español)/i.test(String(value || "").trim()) ? "Spanish" : "English";
  }

  function getDateKey(iso, tz) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit"
    }).format(new Date(iso));
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

  function fmtMonthYear(year, monthIdx, locale) {
    var str = new Intl.DateTimeFormat(locale, {
      month: "long", year: "numeric", timeZone: "UTC"
    }).format(new Date(Date.UTC(year, monthIdx, 15, 12)));
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function fmtLongDate(year, monthIdx, day, locale) {
    return new Intl.DateTimeFormat(locale, {
      weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC"
    }).format(new Date(Date.UTC(year, monthIdx, day, 12)));
  }

  // "Sat, Nov 21 & Sun, Nov 22" + " · 2:30 PM EST · Anne Hoover"
  function offeringLine(o, tz, copy) {
    var line = el("span", "bec__detline");
    var days = o.sessions.map(function (s) { return fmtDay(s, tz, copy.locale); });
    line.appendChild(document.createTextNode(days.join(" " + copy.and + " ")));
    var meta = " · " + fmtTime(o.sessions[0], tz, copy.locale);
    if (o.instructor) meta += " · " + o.instructor;
    line.appendChild(el("span", "bec__detmeta", meta));
    return line;
  }

  function renderCard(course, tz, opts) {
    var copy = COPY[course.language] || COPY.English;
    var card = el("article", "bec__card");
    card.id = "bec-course-" + course.code.replace(/[^a-zA-Z0-9]/g, "-");

    /* ---- Head ---- */
    var head = el("div", "bec__head");
    if (course.image) {
      var img = el("img", "bec__thumb");
      img.src = course.image;
      img.alt = "";
      img.loading = "lazy";
      head.appendChild(img);
    }
    var meta = el("div", "bec__headbody");
    meta.appendChild(el("h3", "bec__title", course.name));
    var tags = el("div", "bec__tags");
    tags.appendChild(el("span", "bec__tag bec__tag--lang",
      course.language === "Spanish" ? copy.spanish : copy.english));
    [course.sessions, course.duration, course.topics].forEach(function (t) {
      if (t) tags.appendChild(el("span", "bec__tag", t));
    });
    meta.appendChild(tags);
    if (course.description) meta.appendChild(el("p", "bec__desc", course.description));
    if (course.category) meta.appendChild(el("p", "bec__cat", course.category));
    head.appendChild(meta);
    card.appendChild(head);

    /* ---- Index sessions by local day ---- */
    var offerings = (course.offerings || []).filter(function (o) {
      return o.sessions && o.sessions.length;
    }).slice().sort(function (a, b) {
      return new Date(a.sessions[0]) - new Date(b.sessions[0]);
    });
    var offeringKeys = offerings.map(function (o) {
      return o.sessions.map(function (s) { return getDateKey(s, tz); });
    });
    var dayMap = {};
    var allKeys = [];
    offeringKeys.forEach(function (keys, i) {
      keys.forEach(function (k) {
        if (!dayMap[k]) { dayMap[k] = []; allKeys.push(k); }
        if (dayMap[k].indexOf(i) === -1) dayMap[k].push(i);
      });
    });
    allKeys.sort();

    var viewYear, viewMonth, minYM, maxYM;
    if (allKeys.length) {
      var first = allKeys[0].split("-").map(Number);
      var last = allKeys[allKeys.length - 1].split("-").map(Number);
      viewYear = first[0]; viewMonth = first[1] - 1;
      minYM = viewYear * 12 + viewMonth;
      maxYM = last[0] * 12 + (last[1] - 1);
    } else {
      var now = new Date();
      viewYear = now.getFullYear(); viewMonth = now.getMonth();
      minYM = maxYM = viewYear * 12 + viewMonth;
    }
    var selectedDayKey = null;

    /* ---- Calendar ---- */
    var calWrap = el("div", "bec__calwrap");
    var calInner = el("div", "bec__calinner");
    var calHead = el("div", "bec__calhead");
    var calMonthLabel = el("span", "bec__calmonth");
    calMonthLabel.setAttribute("aria-live", "polite");
    var calNav = el("div", "bec__calnav");
    var prevBtn = el("button", "bec__calbtn", "‹");
    prevBtn.type = "button";
    prevBtn.setAttribute("aria-label", copy.prevMonth);
    var nextBtn = el("button", "bec__calbtn", "›");
    nextBtn.type = "button";
    nextBtn.setAttribute("aria-label", copy.nextMonth);
    calNav.appendChild(prevBtn);
    calNav.appendChild(nextBtn);
    calHead.appendChild(calMonthLabel);
    calHead.appendChild(calNav);
    calInner.appendChild(calHead);
    var calGrid = el("div", "bec__calgrid");
    calInner.appendChild(calGrid);
    calWrap.appendChild(calInner);
    card.appendChild(calWrap);

    /* ---- Footer: detail line + CTA ---- */
    var foot = el("div", "bec__foot");
    var detail = el("div", "bec__detail");
    detail.setAttribute("aria-live", "polite");
    foot.appendChild(detail);

    var link = course.bookingLink || opts.fallbackHref;
    var isFallback = !course.bookingLink;
    if (link) {
      var a = el("a", "bec__cta" + (isFallback ? " bec__cta--quiet" : ""),
        isFallback ? copy.askAbout : copy.book);
      a.href = link;
      if (!isFallback) { a.target = "_blank"; a.rel = "noopener"; }
      a.appendChild(el("span", "bec__sr", " — " + course.name));
      foot.appendChild(a);
    }
    card.appendChild(foot);

    function selectedIndexes() {
      return selectedDayKey ? (dayMap[selectedDayKey] || []) : [];
    }

    function drawCalendar() {
      calMonthLabel.textContent = fmtMonthYear(viewYear, viewMonth, copy.locale);
      var curYM = viewYear * 12 + viewMonth;
      prevBtn.disabled = curYM <= minYM;
      nextBtn.disabled = curYM >= maxYM;

      // Every day belonging to the selected class (e.g. both days of a 2-session class)
      var activeKeys = {};
      selectedIndexes().forEach(function (i) {
        offeringKeys[i].forEach(function (k) { activeKeys[k] = true; });
      });

      calGrid.innerHTML = "";
      copy.weekdays.forEach(function (wd) {
        calGrid.appendChild(el("div", "bec__caldow", wd));
      });

      var firstDow = new Date(Date.UTC(viewYear, viewMonth, 1)).getUTCDay();
      var daysInMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();
      for (var b = 0; b < firstDow; b++) {
        calGrid.appendChild(el("span", "bec__calday bec__calday--empty", ""));
      }

      for (var d = 1; d <= daysInMonth; d++) {
        var key = viewYear + "-" + pad2(viewMonth + 1) + "-" + pad2(d);
        if (dayMap[key]) {
          var btn = el("button", "bec__calday bec__calday--has", String(d));
          btn.type = "button";
          if (activeKeys[key]) btn.classList.add("bec__calday--active");
          btn.setAttribute("aria-pressed", String(selectedDayKey === key));
          btn.setAttribute("aria-label", fmtLongDate(viewYear, viewMonth, d, copy.locale));
          (function (k) {
            btn.addEventListener("click", function () {
              selectedDayKey = (selectedDayKey === k) ? null : k;
              drawCalendar();
              drawDetail();
            });
          })(key);
          calGrid.appendChild(btn);
        } else {
          calGrid.appendChild(el("span", "bec__calday", String(d)));
        }
      }
    }

    function drawDetail() {
      detail.innerHTML = "";
      var idx = selectedIndexes();
      if (idx.length) {
        detail.appendChild(el("span", "bec__detlabel", copy.onThisDate));
        idx.forEach(function (i) { detail.appendChild(offeringLine(offerings[i], tz, copy)); });
      } else if (offerings.length) {
        detail.appendChild(el("span", "bec__detlabel", copy.nextClass));
        detail.appendChild(offeringLine(offerings[0], tz, copy));
      } else {
        detail.appendChild(el("span", "bec__detline bec__detmeta", copy.noDates));
      }
    }

    prevBtn.addEventListener("click", function () {
      viewMonth--;
      if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      drawCalendar();
    });
    nextBtn.addEventListener("click", function () {
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      drawCalendar();
    });

    drawCalendar();
    drawDetail();
    return card;
  }

  function mount(root) {
    var src = root.getAttribute("data-src") || "classes.json";
    var opts = {
      fallbackHref: root.getAttribute("data-contact") || "",
      logoHost: root.getAttribute("data-logo-host") || "",
      logoBirthly: root.getAttribute("data-logo-birthly") || "",
      defaultLang: normalizeLang(root.getAttribute("data-language"))
    };

    root.className = (root.className ? root.className + " " : "") + "bec";
    if (!document.getElementById("bec-styles")) {
      var style = el("style");
      style.id = "bec-styles";
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    root.appendChild(el("p", "bec__status", COPY.English.loading));

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

        var tz = data.timezone || "America/New_York";
        var courses = data.courses || [];
        var counts = {
          English: courses.filter(function (c) { return c.language === "English"; }).length,
          Spanish: courses.filter(function (c) { return c.language === "Spanish"; }).length
        };

        var nav = el("div", "bec__nav");
        var bar = el("div", "bec__filters");
        bar.setAttribute("role", "group");
        bar.setAttribute("aria-label", "Filter classes by language");
        var classNav = el("div", "bec__classnav");
        classNav.setAttribute("role", "group");
        classNav.setAttribute("aria-label", "Select a class");
        nav.appendChild(bar);
        nav.appendChild(classNav);

        var results = el("div");
        var live = el("p", "bec__sr");
        live.setAttribute("role", "status");
        live.setAttribute("aria-live", "polite");

        // English is preselected on load (Spanish only if data-language asks for it)
        var currentLang = opts.defaultLang;
        var currentCourse = "all";

        function drawClassPills(langCourses) {
          classNav.innerHTML = "";
          var activeCopy = COPY[currentLang] || COPY.English;
          var allBtn = el("button", "bec__cpill", activeCopy.allShort + " (" + langCourses.length + ")");
          allBtn.type = "button";
          allBtn.setAttribute("aria-pressed", String(currentCourse === "all"));
          allBtn.addEventListener("click", function () { currentCourse = "all"; draw(); });
          classNav.appendChild(allBtn);

          langCourses.forEach(function (c) {
            var pill = el("button", "bec__cpill", c.name);
            pill.type = "button";
            pill.setAttribute("aria-pressed", String(currentCourse === c.code));
            pill.addEventListener("click", function () {
              currentCourse = (currentCourse === c.code) ? "all" : c.code;
              draw();
            });
            classNav.appendChild(pill);
          });
        }

        function draw() {
          results.innerHTML = "";
          var langFiltered = courses.filter(function (c) {
            return c.language === currentLang;
          });
          if (currentCourse !== "all" && !langFiltered.some(function (c) { return c.code === currentCourse; })) {
            currentCourse = "all";
          }
          drawClassPills(langFiltered);

          var list = langFiltered.filter(function (c) {
            return currentCourse === "all" || c.code === currentCourse;
          });
          if (!list.length) {
            results.appendChild(el("p", "bec__status", (COPY[currentLang] || COPY.English).noDates));
          } else {
            list.forEach(function (c) { results.appendChild(renderCard(c, tz, opts)); });
          }

          live.textContent = list.length + " classes shown";
          Array.prototype.forEach.call(bar.children, function (b) {
            b.setAttribute("aria-pressed", String(b.dataset.lang === currentLang));
          });
        }

        [["English", COPY.English.english], ["Spanish", COPY.English.spanish]].forEach(function (pair) {
          var key = pair[0];
          var b = el("button", "bec__filter");
          b.type = "button";
          b.dataset.lang = key;
          b.setAttribute("aria-pressed", String(key === currentLang));
          b.appendChild(document.createTextNode(pair[1]));
          b.appendChild(el("span", "bec__count", String(counts[key])));
          b.addEventListener("click", function () {
            currentLang = key;
            currentCourse = "all";
            draw();
          });
          bar.appendChild(b);
        });

        root.appendChild(nav);
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
    Array.prototype.forEach.call(document.querySelectorAll("[data-birthly-classes]"), mount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else init();
})();
