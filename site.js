// Game catalogue + topic selector for the grade pages (grade2/, grade6/).
// To add a game / test / quiz: add a line in ../school.json. Grade pages and topic cards update by themselves.
(function () {
  var TOPICS = {
    math:    { name: "מתמטיקה", icon: "➗", color: "blue" },
    english: { name: "אנגלית",  icon: "🔤", color: "pink" },
    hebrew:  { name: "עברית",   icon: "📖", color: "purple" },
    science: { name: "מדע",     icon: "🔬", color: "green" }
  };
  var TOPIC_ORDER = ["math", "english", "hebrew", "science"];
  var MONTHS = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
  // Games, tests and quizzes live in school.json (shared with the homework app).
  var CLASSES = ["מעוף", "דיאלוג", "מקוריות", "חדשנות"];
  var HALVES = { 1: "מחצית ראשונה", 2: "מחצית שנייה" };
  var DAYS = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"];
  var SHORT_MONTHS = ["ינו'","פבר'","מרץ","אפר'","מאי","יוני","יולי","אוג'","ספט'","אוק'","נוב'","דצמ'"];

  var GRADE_NAMES = { 2: "כיתה ב'", 6: "כיתה ו'" };
  var grade = +document.body.getAttribute("data-grade");
  var app = document.getElementById("app");
  var games = [], topics = [], tests = [];

  function fmt(d) { var p = d.split("-"); return +p[2] + " ב" + MONTHS[+p[1] - 1] + " " + p[0]; }
  function count(n) { return n === 1 ? "משחק אחד" : n + " משחקים"; }

  var KEY = "games-class-" + grade;
  function getClass() { try { var c = localStorage.getItem(KEY); return CLASSES.indexOf(c) >= 0 ? c : ""; } catch (e) { return ""; } }
  function setClass(c) { try { localStorage.setItem(KEY, c); } catch (e) {} }
  var picked = getClass();

  function day(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function daysLeft(s) { var n = new Date(); n = new Date(n.getFullYear(), n.getMonth(), n.getDate()); return Math.round((day(s) - n) / 864e5); }
  function leftText(n) { return n === 0 ? "היום!" : n === 1 ? "מחר!" : "עוד " + n + " ימים"; }
  function testsFor(c) {
    return tests.map(function (x) { var d = x.dates[c] || x.dates["*"]; return d ? { t: x, date: d, left: daysLeft(d) } : null; })
      .filter(Boolean).sort(function (a, b) { return a.left - b.left; });
  }
  function nextTest(c) { return testsFor(c).filter(function (r) { return r.left >= 0; })[0]; }

  // Tests keep the topic name (as before); quizzes show their own title.
  function label(x) { return x.kind === "quiz" ? x.title : TOPICS[x.topic].name; }
  function halfOf(x, date) { if (x.half) return x.half; var m = +date.split("-")[1]; return m >= 2 && m <= 8 ? 2 : 1; }

  function testCard(r, isNext) {
    var d = day(r.date), x = r.t, tp = TOPICS[x.topic];
    var go = x.game ? '<a class="go" href="../' + x.game + '/">🎮 לשחק</a>' : r.left < 0 ? "" : '<span class="go soon">בקרוב</span>';
    var sub = (x.kind === "quiz" ? "בוחן" : "משימת הערכה") +(r.left > 1 && !isNext ? ' · <span class="nw">' + leftText(r.left) + "</span>" : "");
    return '<div class="test' + (isNext ? " next" : "") + (r.left < 0 ? " past" : "") + '">' +
      '<span class="date" style="background:var(--' + tp.color + ')"><b>' + d.getDate() + '</b><span>' + SHORT_MONTHS[d.getMonth()] + " · " + DAYS[d.getDay()] + '</span></span>' +
      '<span class="info"><span class="t">' + tp.icon + " " + label(x) + (x.note ? " (" + x.note + ")" : "") +
      (isNext ? ' <span class="badge">' + leftText(r.left) + "</span>" : "") + '</span><span class="d">' + sub + "</span></span>" + go + "</div>";
  }

  function renderTests() {
    var c = picked || CLASSES[0];
    var h = '<a class="pill" href="#">⬅ חזרה לנושאים</a><h1>📅 לוח מבחנים</h1><p class="sub">' + GRADE_NAMES[grade] + " · בחרו את הכיתה שלכם</p>";
    h += '<div class="tabs" role="tablist">' + CLASSES.map(function (k) {
      return '<button class="tab' + (k === c ? " on" : "") + '" role="tab" aria-selected="' + (k === c) + '" data-class="' + k + '">' + k + "</button>";
    }).join("") + "</div>";
    var rows = testsFor(c), nxt = rows.filter(function (r) { return r.left >= 0; })[0];
    Object.keys(HALVES).forEach(function (half) {
      var hr = rows.filter(function (r) { return String(halfOf(r.t, r.date)) === half; });
      if (!hr.length) return;
      var up = hr.filter(function (r) { return r.left >= 0; }), past = hr.filter(function (r) { return r.left < 0; }).reverse();
      h += '<h2 class="half">' + HALVES[half] + '</h2><div class="grid">';
      up.forEach(function (r) { h += testCard(r, r === nxt); });
      h += "</div>";
      if (past.length) {
        h += '<div class="sec">✓ מבחנים שעברו</div><div class="grid">';
        past.forEach(function (r) { h += testCard(r, false); });
        h += "</div>";
      }
    });
    app.innerHTML = h;
    app.querySelectorAll(".tab").forEach(function (b) {
      b.onclick = function () { picked = b.getAttribute("data-class"); setClass(picked); renderTests(); };
    });
  }

  function testsButton() {
    if (!tests.length) return "";
    var line;
    if (!picked) line = "מתי המבחן הבא? בחרו כיתה";
    else {
      var n = nextTest(picked);
      line = n ? picked + " · הבא: " + label(n.t) + ' · <span class="nw">' + leftText(n.left) + "</span>" : picked + " · אין מבחנים קרובים";
    }
    return '<a class="tests-btn" href="#tests"><span class="ic">📅</span><span><b>לוח מבחנים</b><small>' + line + "</small></span></a>";
  }

  function render() {
    var t = decodeURIComponent(location.hash.slice(1));
    if (t === "tests" && tests.length) { renderTests(); scrollTo(0, 0); return; }
    if (topics.length === 1) t = topics[0];
    if (topics.indexOf(t) < 0) t = "";
    var h = "";
    if (!t) {
      h += '<a class="pill" href="../">⬅ כל הכיתות</a><h1>' + GRADE_NAMES[grade] + '</h1><p class="sub">באיזה נושא תרצו לשחק?</p>' + testsButton() + '<div class="grid">';
      topics.forEach(function (k) {
        var n = games.filter(function (g) { return g.topic === k; }).length;
        h += '<a class="game grade" href="#' + k + '"><span class="big">' + TOPICS[k].icon + '</span><span class="t">' + TOPICS[k].name + '</span><span class="d">' + count(n) + '</span></a>';
      });
    } else {
      var back = topics.length > 1 ? '<a class="pill" href="#">⬅ חזרה לנושאים</a>' : '<a class="pill" href="../">⬅ כל הכיתות</a>';
      h += back + '<h1>' + TOPICS[t].name + '</h1><p class="sub">' + GRADE_NAMES[grade] + " · בחרו משחק והתחילו להרפתקה!</p><div class=\"grid\">";
      games.filter(function (g) { return g.topic === t; })
        .sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; })
        .forEach(function (g) {
          h += '<a class="game" href="../' + g.dir + '/"><span class="icon" style="background:var(--' + g.color + ')">' + g.icon + '</span>' +
               '<span><div class="t">' + g.title + '</div><div class="d">' + g.desc + " · " + fmt(g.date) + "</div></span>" +
               (g.isNew ? '<span class="new">חדש</span>' : "") + "</a>";
        });
    }
    app.innerHTML = h + "</div>";
    scrollTo(0, 0);
  }
  function start(data) {
    games = (data.games || []).filter(function (g) { return g.grade === grade; });
    topics = TOPIC_ORDER.filter(function (t) { return games.some(function (g) { return g.topic === t; }); });
    // The tests view has class tabs, so only grade 6 (split into CLASSES) gets it.
    tests = grade === 6 ? (data.items || []).filter(function (x) { return x.grade === grade && TOPICS[x.topic]; }) : [];
    addEventListener("hashchange", render);
    render();
  }
  fetch("../school.json").then(function (r) { if (!r.ok) throw r; return r.json(); }).then(start)
    .catch(function (e) { console.error(e); app.innerHTML = '<a class="pill" href="../">⬅ כל הכיתות</a><h1>' + GRADE_NAMES[grade] + '</h1><p class="sub">לא הצלחנו לטעון את רשימת המשחקים. נסו לרענן את הדף.</p>'; });
})();
