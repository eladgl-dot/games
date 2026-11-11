// Game catalogue + topic selector for the grade pages (grade2/, grade6/).
// To add a game: copy a line in GAMES. Grade pages and topic cards update by themselves.
(function () {
  var TOPICS = {
    math:    { name: "מתמטיקה", icon: "➗", color: "blue" },
    english: { name: "אנגלית",  icon: "🔤", color: "pink" },
    hebrew:  { name: "עברית",   icon: "📖", color: "purple" },
    science: { name: "מדע",     icon: "🔬", color: "green" }
  };
  var TOPIC_ORDER = ["math", "english", "hebrew", "science"];
  var MONTHS = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
  var EN2 = "אנגלית · 20 מילים";
  // grade, topic, folder, icon, color, title, desc, date (newest first inside a topic), isNew
  var GAMES = [
    { grade: 2, topic: "english", dir: "words-b-animals", icon: "🐱", color: "green",  title: "הרפתקת המילים: חיות",          desc: EN2, date: "2026-10-30", isNew: 1 },
    { grade: 2, topic: "english", dir: "words-b-colors",  icon: "🎨", color: "pink",   title: "הרפתקת המילים: צבעים וצורות", desc: EN2, date: "2026-10-30", isNew: 1 },
    { grade: 2, topic: "english", dir: "words-b-food",    icon: "🍎", color: "orange", title: "הרפתקת המילים: אוכל",          desc: EN2, date: "2026-10-30", isNew: 1 },
    { grade: 2, topic: "english", dir: "words-b-home",    icon: "🏠", color: "blue",   title: "הרפתקת המילים: משפחה ובית",   desc: EN2, date: "2026-10-30", isNew: 1 },
    { grade: 2, topic: "english", dir: "words-b-body",    icon: "👕", color: "purple", title: "הרפתקת המילים: גוף ובגדים",   desc: EN2, date: "2026-10-30", isNew: 1 },
    { grade: 2, topic: "hebrew",  dir: "shoresh-b-2",     icon: "👕", color: "green",  title: "הכתבה 2: השורש ל.ב.שׁ", desc: "שורש וניקוד", date: "2026-11-09", isNew: 1 },
    { grade: 2, topic: "hebrew",  dir: "shoresh-b",       icon: "🧩", color: "orange", title: "הכתבה 1: השורש שׂ.ח.ק", desc: "שורש וניקוד", date: "2026-11-02", isNew: 1 },
    { grade: 6, topic: "math",    dir: "math-adventure",  icon: "➗", color: "blue",   title: "הרפתקת המתמטיקה", desc: "שברים, עשרוניים וגיאומטריה", date: "2026-10-30", isNew: 1 },
    { grade: 6, topic: "english", dir: "english-test", icon: "🚀", color: "blue", title: "משימת המבחן באנגלית", desc: "Present Simple & Progressive · חזרה למבחן", date: "2026-11-12", isNew: 1 },
    { grade: 6, topic: "english", dir: "words-adventure-3", icon: "🔤", color: "pink",   title: "הרפתקת המילים 3", desc: "אנגלית", date: "2026-11-05", isNew: 1 },
    { grade: 6, topic: "english", dir: "words-adventure-2", icon: "🔤", color: "pink",   title: "הרפתקת המילים 2", desc: "אנגלית", date: "2026-10-31", isNew: 1 },
    { grade: 6, topic: "english", dir: "words-adventure", icon: "🔤", color: "pink",   title: "הרפתקת המילים",   desc: "אנגלית", date: "2026-10-28" },
    { grade: 6, topic: "science", dir: "science-adventure", icon: "🔬", color: "green", title: "הרפתקת המדע", desc: "אנרגיה ומערכות טכנולוגיות", date: "2026-11-07", isNew: 1 },
    { grade: 6, topic: "hebrew",  dir: "smichut",         icon: "📖", color: "purple", title: "משחק הסמיכות",    desc: "עברית",  date: "2026-10-25" }
  ];

  // Test schedule (from the school's PDF). One line per test; dates per class.
  // dir = game folder for "לשחק"; leave it out and the test shows "בקרוב".
  var CLASSES = ["מעוף", "דיאלוג", "מקוריות", "חדשנות"];
  var HALVES = { 1: "מחצית ראשונה", 2: "מחצית שנייה" };
  var TESTS = [
    { grade: 6, half: 1, topic: "hebrew",  note: "שכבתי", dates: { "מעוף": "2026-10-30", "דיאלוג": "2026-10-30", "מקוריות": "2026-10-30", "חדשנות": "2026-10-30" } },
    { grade: 6, half: 1, topic: "math",    dir: "math-adventure", dates: { "מעוף": "2026-11-12", "דיאלוג": "2026-11-08", "מקוריות": "2026-11-10", "חדשנות": "2026-11-11" } },
    { grade: 6, half: 1, topic: "english", dir: "english-test", dates: { "מעוף": "2026-11-18", "דיאלוג": "2026-11-18", "מקוריות": "2026-11-19", "חדשנות": "2026-11-19" } },
    { grade: 6, half: 1, topic: "science", dir: "science-adventure", dates: { "מעוף": "2026-12-01", "דיאלוג": "2026-11-30", "מקוריות": "2026-11-29", "חדשנות": "2026-12-03" } },
    { grade: 6, half: 1, topic: "hebrew",  dates: { "מעוף": "2026-12-16", "דיאלוג": "2026-12-18", "מקוריות": "2026-12-15", "חדשנות": "2026-12-14" } },
    { grade: 6, half: 1, topic: "math",    dates: { "מעוף": "2026-12-31", "דיאלוג": "2026-12-27", "מקוריות": "2026-12-29", "חדשנות": "2026-12-30" } },
    { grade: 6, half: 1, topic: "english", dates: { "מעוף": "2027-01-13", "דיאלוג": "2027-01-13", "מקוריות": "2027-01-14", "חדשנות": "2027-01-14" } }
  ];
  var DAYS = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"];
  var SHORT_MONTHS = ["ינו'","פבר'","מרץ","אפר'","מאי","יוני","יולי","אוג'","ספט'","אוק'","נוב'","דצמ'"];

  var GRADE_NAMES = { 2: "כיתה ב'", 6: "כיתה ו'" };
  var grade = +document.body.getAttribute("data-grade");
  var app = document.getElementById("app");
  var games = GAMES.filter(function (g) { return g.grade === grade; });
  var topics = TOPIC_ORDER.filter(function (t) { return games.some(function (g) { return g.topic === t; }); });

  function fmt(d) { var p = d.split("-"); return +p[2] + " ב" + MONTHS[+p[1] - 1] + " " + p[0]; }
  function count(n) { return n === 1 ? "משחק אחד" : n + " משחקים"; }

  var tests = TESTS.filter(function (x) { return x.grade === grade; });
  var KEY = "games-class-" + grade;
  function getClass() { try { var c = localStorage.getItem(KEY); return CLASSES.indexOf(c) >= 0 ? c : ""; } catch (e) { return ""; } }
  function setClass(c) { try { localStorage.setItem(KEY, c); } catch (e) {} }
  var picked = getClass();

  function day(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function daysLeft(s) { var n = new Date(); n = new Date(n.getFullYear(), n.getMonth(), n.getDate()); return Math.round((day(s) - n) / 864e5); }
  function leftText(n) { return n === 0 ? "היום!" : n === 1 ? "מחר!" : "עוד " + n + " ימים"; }
  function testsFor(c) {
    return tests.map(function (x) { return { t: x, date: x.dates[c], left: daysLeft(x.dates[c]) }; })
      .sort(function (a, b) { return a.left - b.left; });
  }
  function nextTest(c) { return testsFor(c).filter(function (r) { return r.left >= 0; })[0]; }

  function testCard(r, isNext) {
    var d = day(r.date), x = r.t, tp = TOPICS[x.topic];
    var go = x.dir ? '<a class="go" href="../' + x.dir + '/">🎮 לשחק</a>' : r.left < 0 ? "" : '<span class="go soon">בקרוב</span>';
    var sub = "משימת הערכה" + (r.left > 1 && !isNext ? ' · <span class="nw">' + leftText(r.left) + "</span>" : "");
    return '<div class="test' + (isNext ? " next" : "") + (r.left < 0 ? " past" : "") + '">' +
      '<span class="date" style="background:var(--' + tp.color + ')"><b>' + d.getDate() + '</b><span>' + SHORT_MONTHS[d.getMonth()] + " · " + DAYS[d.getDay()] + '</span></span>' +
      '<span class="info"><span class="t">' + tp.icon + " " + tp.name + (x.note ? " (" + x.note + ")" : "") +
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
      var hr = rows.filter(function (r) { return String(r.t.half) === half; });
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
      line = n ? picked + " · הבא: " + TOPICS[n.t.topic].name + ' · <span class="nw">' + leftText(n.left) + "</span>" : picked + " · אין מבחנים קרובים";
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
  addEventListener("hashchange", render);
  render();
})();