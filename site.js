// Game catalogue + topic selector for the grade pages (grade2/, grade6/).
// To add a game: copy a line in GAMES. Grade pages and topic cards update by themselves.
(function () {
  var TOPICS = {
    math:    { name: "מתמטיקה", icon: "➗", color: "blue" },
    english: { name: "אנגלית",  icon: "🔤", color: "pink" },
    hebrew:  { name: "עברית",   icon: "📖", color: "purple" }
  };
  var TOPIC_ORDER = ["math", "english", "hebrew"];
  var MONTHS = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
  var EN2 = "אנגלית · 20 מילים";
  // grade, topic, folder, icon, color, title, desc, date (newest first inside a topic), isNew
  var GAMES = [
    { grade: 2, topic: "english", dir: "words-b-animals", icon: "🐱", color: "green",  title: "הרפתקת המילים: חיות",          desc: EN2, date: "2026-10-30", isNew: 1 },
    { grade: 2, topic: "english", dir: "words-b-colors",  icon: "🎨", color: "pink",   title: "הרפתקת המילים: צבעים וצורות", desc: EN2, date: "2026-10-30", isNew: 1 },
    { grade: 2, topic: "english", dir: "words-b-food",    icon: "🍎", color: "orange", title: "הרפתקת המילים: אוכל",          desc: EN2, date: "2026-10-30", isNew: 1 },
    { grade: 2, topic: "english", dir: "words-b-home",    icon: "🏠", color: "blue",   title: "הרפתקת המילים: משפחה ובית",   desc: EN2, date: "2026-10-30", isNew: 1 },
    { grade: 2, topic: "english", dir: "words-b-body",    icon: "👕", color: "purple", title: "הרפתקת המילים: גוף ובגדים",   desc: EN2, date: "2026-10-30", isNew: 1 },
    { grade: 2, topic: "hebrew",  dir: "shoresh-b",       icon: "🧩", color: "orange", title: "הרפתקת השורש שׂ.ח.ק", desc: "עברית · שורש וניקוד", date: "2026-11-02", isNew: 1 },
    { grade: 6, topic: "math",    dir: "math-adventure",  icon: "➗", color: "blue",   title: "הרפתקת המתמטיקה", desc: "שברים, עשרוניים וגיאומטריה", date: "2026-10-30", isNew: 1 },
    { grade: 6, topic: "english", dir: "words-adventure-2", icon: "🔤", color: "pink",   title: "הרפתקת המילים 2", desc: "אנגלית", date: "2026-10-31", isNew: 1 },
    { grade: 6, topic: "english", dir: "words-adventure", icon: "🔤", color: "pink",   title: "הרפתקת המילים",   desc: "אנגלית", date: "2026-10-28" },
    { grade: 6, topic: "hebrew",  dir: "smichut",         icon: "📖", color: "purple", title: "משחק הסמיכות",    desc: "עברית",  date: "2026-10-25" }
  ];

  var GRADE_NAMES = { 2: "כיתה ב'", 6: "כיתה ו'" };
  var grade = +document.body.getAttribute("data-grade");
  var app = document.getElementById("app");
  var games = GAMES.filter(function (g) { return g.grade === grade; });
  var topics = TOPIC_ORDER.filter(function (t) { return games.some(function (g) { return g.topic === t; }); });

  function fmt(d) { var p = d.split("-"); return +p[2] + " ב" + MONTHS[+p[1] - 1] + " " + p[0]; }
  function count(n) { return n === 1 ? "משחק אחד" : n + " משחקים"; }

  function render() {
    var t = decodeURIComponent(location.hash.slice(1));
    if (topics.length === 1) t = topics[0];
    if (topics.indexOf(t) < 0) t = "";
    var h = "";
    if (!t) {
      h += '<a class="pill" href="../">⬅ כל הכיתות</a><h1>' + GRADE_NAMES[grade] + '</h1><p class="sub">באיזה נושא תרצו לשחק?</p><div class="grid">';
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