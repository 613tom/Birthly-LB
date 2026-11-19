(function () {
  "use strict";

  var COPY = {
    English: {
      locale: "en-US",
      all: "All classes",
      allShort: "All",
      english: "English",
      spanish: "Español",
      book: "Book this class",
      oneLink: "One link for every date",
      showMore: function (n) { return "Show " + n + " more date" + (n === 1 ? "" : "s"); },
      showLess: "Show fewer dates",
      showAllDates: "Show all upcoming dates",
      sessionsLabel: function (n) { return n + " sessions"; },
      calHint: "Highlighted dates have classes · Click a date to filter",
      noDates: "No dates scheduled right now.",
      loading: "Loading classes…",
      failed: "Class times are unavailable right now.",
      askAbout: "Ask about this class",
      and: "&",
      weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    },
    Spanish: {
      locale: "es-US",
      all: "Todas las clases",
      allShort: "Todas",
      english: "English",
      spanish: "Español",
      book: "Reservar esta clase",
      oneLink: "Un enlace para todas las fechas",
      showMore: function (n) { return "Ver " + n + " fecha" + (n === 1 ? "" : "s") + " más"; },
      showLess: "Ver menos dates",
      showAllDates: "Ver todas las fechas",
      sessionsLabel: function (n) { return n + " sesiones"; },
      calHint: "Fechas marcadas tienen clase · Haz clic para filtrar",
      noDates: "No hay fechas programadas.",
      loading: "Cargando clases…",
      failed: "Los horarios no están disponibles en este momento.",
      askAbout: "Consultar sobre esta clase",
      and: "y",
      weekdays: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"]
    }
  };

  var CSS = [
    ".bec{--pink:#C56F9C;--pink-dark:#A75E85;--pink-tint:#F7EAF1;--pink-mid:#E7C3D6;--ink:#2E2E2E;",
    "--muted:#6E6E6E;--rule:#E8E8E8;--rule-soft:#F2F2F2;--hair:#9E9E9E;--panel:#F6F6F6;",
    "font-family:'TeXGyreAdventorWeb','Century Gothic','URW Gothic',sans-serif;font-weight:400;",
    "color:var(--ink);max-width:940px;margin:0 auto;line-height:1.5;box-sizing:border-box}",
    ".bec *,.bec *::before,.bec *::after{box-sizing:inherit}",

    /* Brand Header */
    ".bec__brand{display:flex;align-items:center;justify-content:center;gap:18px;flex-wrap:wrap;",
    "padding-bottom:18px;border-bottom:1px solid var(--rule);margin-bottom:18px}",
    ".bec__brand img{height:38px;width:auto;display:block}",
    ".bec__x{color:var(--hair);font-size:15px}",

    /* Sticky Two-Tier Navigation */
    ".bec__nav{position:sticky;top:0;z-index:10;background:rgba(255,255,255,0.97);",
    "backdrop-filter:blur(4px);padding:10px 0 14px;border-bottom:1px solid var(--rule);margin-bottom:20px}",
    ".bec__filters{display:flex;gap:8px;flex-wrap:wrap;margin:0;padding:0;list-style:none}",
    ".bec__filter{appearance:none;background:#fff;border:1px solid var(--hair);color:var(--ink);",
    "border-radius:999px;padding:7px 16px;font:inherit;font-size:13.5px;cursor:pointer;line-height:1.2;transition:all .15s ease}",
    ".bec__filter:hover{border-color:var(--pink-dark);color:var(--pink-dark)}",
    ".bec__filter[aria-pressed=true]{background:var(--pink-dark);border-color:var(--pink-dark);color:#fff}",
    ".bec__filter:focus-visible{outline:2px solid var(--pink-dark);outline-offset:2px}",
    ".bec__count{opacity:.75;margin-left:5px;font-size:12px}",

    /* Class Quick-Jump Pills */
    ".bec__classnav{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;padding-top:10px;border-top:1px dashed var(--rule)}",
    ".bec__cpill{appearance:none;background:var(--panel);border:1px solid transparent;color:var(--ink);",
    "border-radius:999px;padding:5px 12px;font:inherit;font-size:12.5px;cursor:pointer;line-height:1.25;transition:all .15s ease}",
    ".bec__cpill:hover{border-color:var(--pink-dark);color:var(--pink-dark);background:#fff}",
    ".bec__cpill[aria-pressed=true]{background:var(--pink-tint);border-color:var(--pink-dark);color:#8E4F70}",
    ".bec__cpill:focus-visible{outline:2px solid var(--pink-dark);outline-offset:2px}",

    /* Course Card */
    ".bec__card{border:1px solid var(--rule);border-radius:12px;overflow:hidden;margin-bottom:20px;background:#fff}",
    ".bec__head{display:flex;gap:18px;padding:20px 22px;border-bottom:1px solid var(--rule)}",
    ".bec__thumb{width:128px;height:94px;flex:none;border-radius:8px;object-fit:cover;background:var(--panel)}",
    ".bec__headbody{flex:1;min-width:0}",
    ".bec__title{font-size:19px;line-height:1.3;margin:0;color:var(--ink);font-weight:400}",
    ".bec__tags{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 0}",
    ".bec__tag{font-size:11.5px;padding:3px 10px;border-radius:999px;background:var(--panel);color:#5A5A5A}",
    ".bec__tag--lang{background:var(--pink-tint);color:#8E4F70}",
    ".bec__desc{margin:10px 0 0;font-size:13.5px;color:var(--ink);line-height:1.55}",
    ".bec__cat{margin:6px 0 0;font-size:12px;color:var(--muted)}",

    /* Split Body: Calendar + Compact Dates */
    ".bec__body{display:grid;grid-template-columns:280px 1fr;background:#fff}",

    /* Mini Calendar */
    ".bec__calwrap{padding:24px;border-right:1px solid var(--rule);background:#FCFAFB;display:flex;flex-direction:column;justify-content:center}",
    ".bec__calhead{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}",
    ".bec__calmonth{font-size:15px;color:var(--ink);letter-spacing:.01em}",
    ".bec__calnav{display:flex;gap:6px}",
    ".bec__calbtn{appearance:none;background:#fff;border:1px solid var(--rule);color:var(--ink);",
    "width:28px;height:28px;border-radius:6px;font:inherit;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center}",
    ".bec__calbtn:hover:not(:disabled){border-color:var(--pink-dark);color:var(--pink-dark)}",
    ".bec__calbtn:disabled{opacity:.35;cursor:default}",
    ".bec__calgrid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center}",
    ".bec__caldow{font-size:12px;color:var(--muted);padding-bottom:8px}",
    ".bec__calday{aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;font-size:13px;",
    "border-radius:50%;border:1px solid transparent;background:transparent;color:var(--muted);padding:0;font-family:inherit}",
    ".bec__calday--empty{visibility:hidden}",
    /* REMOVED PINK HIGHLIGHT: Now just bold text with a subtle hover effect */
    ".bec__calday--has{color:var(--ink);font-weight:bold;cursor:pointer}",
    ".bec__calday--has:hover{background:#F6F6F6;border-color:var(--rule)}",
    ".bec__calday--active{background:var(--pink-dark);color:#fff;border-color:var(--pink-dark);font-weight:bold}",
    ".bec__calday--active:hover{background:#8E4F70;color:#fff}",
    ".bec__calhint{margin:10px 0 0;font-size:11px;color:var(--muted);line-height:1.35}",

    /* Compact Dates Panel */
    ".bec__dateswrap{display:flex;flex-direction:column;justify-content:space-between;padding-top:10px}",
    ".bec__datestop{padding:0 10px}",
    ".bec__dates{margin:0;padding:0;list-style:none}",
    ".bec__date{display:flex;justify-content:space-between;align-items:center;gap:10px;",
    "padding:12px 16px;border-bottom:1px solid var(--rule-soft)}",
    ".bec__dateline{font-size:14px;color:var(--ink);line-height:1.4}",
    ".bec__datemeta{color:var(--muted);font-size:13px}",
    ".bec__pill{font-size:11px;color:#8E4F70;background:var(--pink-tint);padding:2px 9px;",
    "border-radius:999px;white-space:nowrap;flex:none}",
    ".bec__more{appearance:none;background:none;border:0;width:100%;text-align:left;padding:12px 16px;",
    "font:inherit;font-size:13.5px;color:var(--pink-dark);cursor:pointer}",
    ".bec__more:hover{background:#FDF8FB}",
    ".bec__more:focus-visible{outline:2px solid var(--pink-dark);outline-offset:-2px}",

    /* Card Footer */
    ".bec__foot{padding:16px 24px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;background:#FAFAFA;border-top:1px solid var(--rule)}",
    ".bec__note{font-size:12.5px;color:var(--muted)}",
    ".bec__cta{display:inline-block;background:var(--pink-dark);color:#fff;text-decoration:none;",
    "border-radius:999px;padding:12px 26px;font-size:14px;line-height:1;transition:background .15s ease}",
    ".bec__cta:hover{background:#8E4F70;color:#fff}",
    ".bec__cta:focus-visible{outline:2px solid var(--ink);outline-offset:2px}",
    ".bec__cta--quiet{background:#fff;color:var(--pink-dark);border:1px solid var(--pink-dark)}",
    ".bec__cta--quiet:hover{background:var(--pink-tint);color:#8E4F70}",
    ".bec__status{padding:28px 0;color:var(--muted);font-size:14px}",
    ".bec__sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",

    /* Mobile Responsive */
    "@media (max-width:720px){",
    ".bec__body{grid-template-columns:1fr}",
    ".bec__calwrap{border-right:0;border-bottom:1px solid var(--rule)}",
    ".bec__classnav{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:8px}",
    ".bec__cpill{white-space:nowrap;flex:none}}",
    "@media (max-width:560px){",
    ".bec__head{flex-direction:column;gap:12px;padding:16px}",
    ".bec__thumb{width:100%;height:140px}",
    ".bec__date{padding:9px 16px}",
    ".bec__foot{flex-direction:column;align-items:stretch;padding:14px 16px}",
    ".bec__cta{text-align:center}}"
  ].join("");

  /* Set initial dates to 4 to match the mockup */
  var INITIAL_DATES = 4;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function getDateKey(iso, tz) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
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
    var d = new Date(Date.UTC(year, monthIdx, 15, 12, 0, 0));
    var str = new Intl.DateTimeFormat(locale, {
      month: "long", year: "numeric", timeZone: "UTC"
    }).format(d);
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function renderDate(offering, tz, copy) {
    var li = el("li", "bec__date");
    var line = el("div", "bec__dateline");

    var days = offering.sessions.map(function (s) { return fmtDay(s, tz, copy.locale); });
    line.appendChild(document.createTextNode(days.join(" " + copy.and + " ")));

    var metaText = " · " + fmtTime(offering.sessions[0], tz, copy.locale);
    if (offering.instructor) metaText += " · " + offering.instructor;
    line.appendChild(el("span", "bec__datemeta", metaText));

    li.appendChild(line);

    if (offering.sessions.length > 1) {
      li.appendChild(el("span", "bec__pill", copy.sessionsLabel(offering.sessions.length)));
    }
    return li;
  }

  function renderCard(course, tz, opts) {
    var copy = COPY[course.language] || COPY.English;
    var card = el("article", "bec__card");
    card.id = "bec-course-" + course.code.replace(/[^a-zA-Z0-9]/g, "-");

    /* Card Header with Description */
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
    var langTag = el("span", "bec__tag bec__tag--lang",
      course.language === "Spanish" ? copy.spanish : copy.english);
    tags.appendChild(langTag);
    [course.sessions, course.duration, course.topics].forEach(function (t) {
      if (t) tags.appendChild(el("span", "bec__tag", t));
    });
    meta.appendChild(tags);

    if (course.description) {
      meta.appendChild(el("p", "bec__desc", course.description));
    }
    if (course.category) {
      meta.appendChild(el("p", "bec__cat", course.category));
    }
    head.appendChild(meta);
    card.appendChild(head);

    /* Map offerings by YYYY-MM-DD for Calendar */
    var dayMap = {};
    var allKeys = [];
    course.offerings.forEach(function (o) {
      o.sessions.forEach(function (sIso) {
        var k = getDateKey(sIso, tz);
        if (!dayMap[k]) {
          dayMap[k] = [];
          allKeys.push(k);
        }
        if (dayMap[k].indexOf(o) === -1) {
          dayMap[k].push(o);
        }
      });
    });
    allKeys.sort();

    /* Determine initial calendar month from first available class */
    var startYear, startMonth;
    if (allKeys.length) {
      var parts = allKeys[0].split("-").map(Number);
      startYear = parts[0];
      startMonth = parts[1] - 1;
    } else {
      var now = new Date();
      startYear = now.getFullYear();
      startMonth = now.getMonth();
    }

    var minYM = startYear * 12 + startMonth;
    var maxYM = minYM;
    if (allKeys.length) {
      var lastParts = allKeys[allKeys.length - 1].split("-").map(Number);
      maxYM = lastParts[0] * 12 + (lastParts[1] - 1);
    }

    var viewYear = startYear;
    var viewMonth = startMonth;
    var selectedDayKey = null;
    var expanded = false;

    /* Split Body */
    var body = el("div", "bec__body");

    /* Left: Mini Calendar */
    var calWrap = el("div", "bec__calwrap");
    var calHead = el("div", "bec__calhead");
    var calMonthLabel = el("span", "bec__calmonth");
    var calNav = el("div", "bec__calnav");
    var prevBtn = el("button", "bec__calbtn", "‹");
    prevBtn.type = "button";
    prevBtn.setAttribute("aria-label", "Previous month");
    var nextBtn = el("button", "bec__calbtn", "›");
    nextBtn.type = "button";
    nextBtn.setAttribute("aria-label", "Next month");
    calNav.appendChild(prevBtn);
    calNav.appendChild(nextBtn);
    calHead.appendChild(calMonthLabel);
    calHead.appendChild(calNav);
    calWrap.appendChild(calHead);

    var calGrid = el("div", "bec__calgrid");
    calWrap.appendChild(calGrid);
    body.appendChild(calWrap);

    /* Right: Compact Dates + Footer */
    var datesWrap = el("div", "bec__dateswrap");
    var datesTop = el("div", "bec__datestop");

    var list = el("ul", "bec__dates");
    datesTop.appendChild(list);

    var moreBtn = el("button", "bec__more");
    moreBtn.type = "button";
    datesTop.appendChild(moreBtn);
    datesWrap.appendChild(datesTop);

    /* Card Footer CTA */
    var foot = el("div", "bec__foot");
    var link = course.bookingLink || opts.fallbackHref;
    var isFallback = !course.bookingLink;
    foot.appendChild(el("span", "bec__note", isFallback ? "" : copy.oneLink));
    if (link) {
      var a = el("a", "bec__cta" + (isFallback ? " bec__cta--quiet" : ""),
        isFallback ? copy.askAbout : copy.book);
      a.href = link;
      if (!isFallback) { a.target = "_blank"; a.rel = "noopener"; }
      a.appendChild(el("span", "bec__sr", " — " + course.name));
      foot.appendChild(a);
    }
    datesWrap.appendChild(foot);
    body.appendChild(datesWrap);
    card.appendChild(body);

    function drawCalendar() {
      calMonthLabel.textContent = fmtMonthYear(viewYear, viewMonth, copy.locale);
      var curYM = viewYear * 12 + viewMonth;
      prevBtn.disabled = curYM <= minYM;
      nextBtn.disabled = curYM >= maxYM;

      calGrid.innerHTML = "";
      copy.weekdays.forEach(function (wd) {
        calGrid.appendChild(el("div", "bec__caldow", wd));
      });

      var firstDow = new Date(Date.UTC(viewYear, viewMonth, 1)).getUTCDay();
      var daysInMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();

      for (var blank = 0; blank < firstDow; blank++) {
        calGrid.appendChild(el("span", "bec__calday bec__calday--empty", ""));
      }

      for (var d = 1; d <= daysInMonth; d++) {
        var mm = String(viewMonth + 1);
        if (mm.length < 2) mm = "0" + mm;
        var dd = String(d);
        if (dd.length < 2) dd = "0" + dd;
        var key = viewYear + "-" + mm + "-" + dd;
        var hasClass = Boolean(dayMap[key]);

        if (hasClass) {
          var dayBtn = el("button", "bec__calday bec__calday--has", String(d));
          dayBtn.type = "button";
          if (selectedDayKey === key) {
            dayBtn.classList.add("bec__calday--active");
          }
          dayBtn.setAttribute("aria-pressed", String(selectedDayKey === key));
          (function (k) {
            dayBtn.addEventListener("click", function () {
              selectedDayKey = (selectedDayKey === k) ? null : k;
              drawCalendar();
              drawDates();
            });
          })(key);
          calGrid.appendChild(dayBtn);
        } else {
          calGrid.appendChild(el("span", "bec__calday", String(d)));
        }
      }
    }

    function drawDates() {
      list.innerHTML = "";
      var source = selectedDayKey ? (dayMap[selectedDayKey] || []) : course.offerings;

      if (selectedDayKey) {
        source.forEach(function (o) { list.appendChild(renderDate(o, tz, copy)); });
        moreBtn.style.display = "none";
      } else {
        var visible = expanded ? source : source.slice(0, INITIAL_DATES);
        visible.forEach(function (o) { list.appendChild(renderDate(o, tz, copy)); });

        var hidden = source.length - INITIAL_DATES;
        if (hidden > 0) {
          moreBtn.style.display = "block";
          moreBtn.textContent = expanded ? copy.showLess : copy.showMore(hidden);
          moreBtn.setAttribute("aria-expanded", String(expanded));
        } else {
          moreBtn.style.display = "none";
        }
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

    moreBtn.addEventListener("click", function () {
      expanded = !expanded;
      drawDates();
    });

    drawCalendar();
    drawDates();
    return card;
  }

  function mount(root) {
    var src = root.getAttribute("data-src") || "classes.json";
    var opts = {
      fallbackHref: root.getAttribute("data-contact") || "",
      logoHost: root.getAttribute("data-logo-host") || "",
      logoBirthly: root.getAttribute("data-logo-birthly") || "",
      /* MODIFIED: Default language changed to English */
      defaultLang: root.getAttribute("data-language") || "English"
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

        var tz = data.timezone || "America/New_York";
        var courses = data.courses || [];
        var counts = {
          all: courses.length,
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

        var currentLang = opts.defaultLang;
        var currentCourse = "all";

        function drawClassPills(langCourses) {
          classNav.innerHTML = "";
          var activeCopy = COPY[currentLang] || COPY.English;

          var allBtn = el("button", "bec__cpill", activeCopy.allShort + " (" + langCourses.length + ")");
          allBtn.type = "button";
          allBtn.setAttribute("aria-pressed", String(currentCourse === "all"));
          allBtn.addEventListener("click", function () {
            currentCourse = "all";
            draw();
          });
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
            return currentLang === "all" || c.language === currentLang;
          });

          if (currentCourse !== "all" && !langFiltered.some(function (c) { return c.code === currentCourse; })) {
            currentCourse = "all";
          }

          drawClassPills(langFiltered);

          var list = langFiltered.filter(function (c) {
            return currentCourse === "all" || c.code === currentCourse;
          });

          if (!list.length) {
            results.appendChild(el("p", "bec__status", COPY.English.noDates));
          } else {
            list.forEach(function (c) { results.appendChild(renderCard(c, tz, opts)); });
          }

          live.textContent = list.length + " classes shown";
          Array.prototype.forEach.call(bar.children, function (b) {
            b.setAttribute("aria-pressed", String(b.dataset.lang === currentLang));
          });
        }

        /* MODIFIED: Removed the "all" toggle option from the array */
        [["English", COPY.English.english], ["Spanish", COPY.English.spanish]]
          .forEach(function (pair) {
            var key = pair[0];
            var b = el("button", "bec__filter");
            b.type = "button";
            b.dataset.lang = key;
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
    var nodes = document.querySelectorAll("[data-birthly-classes]");
    Array.prototype.forEach.call(nodes, mount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else init();
})();
