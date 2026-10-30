// Registers the service worker and powers the "📲 התקנה" button.
(function () {
  var base = new URL("./", document.currentScript.src);
  if ("serviceWorker" in navigator) {
    addEventListener("load", function () { navigator.serviceWorker.register(new URL("sw.js", base)).catch(function () {}); });
  }
  var btn = document.getElementById("installBtn");
  if (!btn) return;
  var standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  if (standalone) return;
  var deferred = null;
  addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; btn.hidden = false; });
  addEventListener("appinstalled", function () { btn.hidden = true; });
  if (/iphone|ipad|ipod/i.test(navigator.userAgent)) btn.hidden = false;
  btn.addEventListener("click", function () {
    if (deferred) { deferred.prompt(); deferred.userChoice.then(function () { deferred = null; btn.hidden = true; }); }
    else alert("להתקנה באייפון: לחצו על כפתור השיתוף ⬆️ ואז על \"הוסף למסך הבית\"");
  });
})();