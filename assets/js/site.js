/* Precasterz — site.js (v2). No dependencies. */
(function () {
  "use strict";
  var d = document;

  /* Header: solid after scroll */
  var header = d.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 24); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* Mobile drawer */
  var drawer = d.getElementById("drawer");
  d.querySelectorAll("[data-drawer]").forEach(function (b) {
    b.addEventListener("click", function () {
      var open = b.getAttribute("data-drawer") === "open";
      drawer.classList.toggle("open", open);
      d.body.classList.toggle("lock", open);
      drawer.setAttribute("aria-hidden", open ? "false" : "true");
    });
  });
  d.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (drawer) { drawer.classList.remove("open"); d.body.classList.remove("lock"); }
      closeLightbox();
    }
  });

  /* Reveal on scroll */
  var rev = d.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    rev.forEach(function (el) { io.observe(el); });
  } else { rev.forEach(function (el) { el.classList.add("in"); }); }

  /* Galleries */
  d.querySelectorAll(".gallery").forEach(function (g) {
    var track = g.querySelector(".gallery-track");
    var slides = g.querySelectorAll(".gallery-slide");
    var dotsWrap = g.querySelector(".gallery-dots");
    var dots = [];
    slides.forEach(function (_, i) {
      var b = d.createElement("button");
      b.type = "button"; b.setAttribute("aria-label", "Go to slide " + (i + 1));
      b.addEventListener("click", function () { go(i); });
      dotsWrap.appendChild(b); dots.push(b);
    });
    function idx() { return Math.round(track.scrollLeft / track.clientWidth); }
    function go(i) { i = (i + slides.length) % slides.length; track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" }); }
    function mark() { var i = idx(); dots.forEach(function (b, j) { b.classList.toggle("on", j === i); }); }
    track.addEventListener("scroll", function () { window.requestAnimationFrame(mark); }, { passive: true });
    g.querySelector("[data-prev]").addEventListener("click", function () { go(idx() - 1); });
    g.querySelector("[data-next]").addEventListener("click", function () { go(idx() + 1); });
    mark();
  });

  /* Lightbox */
  var lb = d.createElement("div");
  lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true");
  lb.innerHTML = '<button type="button" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button><img alt="">';
  d.body.appendChild(lb);
  var lbImg = lb.querySelector("img");
  function closeLightbox() { lb.classList.remove("open"); }
  lb.addEventListener("click", closeLightbox);
  d.querySelectorAll("[data-zoom]").forEach(function (b) {
    b.addEventListener("click", function () {
      var img = b.querySelector("img");
      lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt;
      lb.classList.add("open");
    });
  });

  /* Careers: tabs + role preselect */
  var roleSelect = d.getElementById("role");
  d.querySelectorAll("[data-apply]").forEach(function (a) {
    a.addEventListener("click", function () {
      if (roleSelect) { roleSelect.value = a.getAttribute("data-apply"); roleSelect.dispatchEvent(new Event("change")); }
    });
  });
  if (roleSelect) {
    var sw = function () {
      var v = roleSelect.value;
      d.querySelectorAll("[data-for]").forEach(function (el) {
        var show = el.getAttribute("data-for") === v;
        el.hidden = !show;
        if (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) el.disabled = !show;
        el.querySelectorAll("input,select,textarea").forEach(function (i) { i.disabled = !show; });
      });
      d.querySelectorAll(".track-tabs button").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-val") === v ? "true" : "false"); });
    };
    roleSelect.addEventListener("change", sw);
    d.querySelectorAll(".track-tabs button").forEach(function (b) {
      b.addEventListener("click", function () { roleSelect.value = b.getAttribute("data-val"); sw(); });
    });
    sw();
  }

  /* File input label */
  d.querySelectorAll(".file-drop input[type=file]").forEach(function (inp) {
    inp.addEventListener("change", function () {
      var t = inp.closest(".file-drop").querySelector("[data-file-label]");
      if (t && inp.files.length) t.textContent = inp.files[0].name;
    });
  });

  /* Forms: AJAX submit to Formspree, with graceful fallback */
  d.querySelectorAll("form[data-ajax]").forEach(function (f) {
    var status = f.querySelector(".form-status");
    f.addEventListener("submit", function (e) {
      var email = f.querySelector("input[type=email]");
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        e.preventDefault(); show("err", "Please enter a valid email address."); email.focus(); return;
      }
      if (!window.fetch || !window.FormData) return; // native POST fallback
      e.preventDefault();
      var btn = f.querySelector("[type=submit]"); var label = btn.textContent;
      btn.disabled = true; btn.textContent = "Sending…";
      fetch(f.action, { method: "POST", body: new FormData(f), headers: { Accept: "application/json" } })
        .then(function (r) {
          if (r.ok) { f.reset(); show("ok", f.getAttribute("data-ok") || "Thank you. Your message has been sent."); }
          else { f.submit(); } // e.g. Formspree asks for a captcha: fall back to the normal post, as the old site did
        })
        .catch(function () { show("err", f.getAttribute("data-err") || "Sorry, the message could not be sent. Please email contact@precasterz.com."); })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    });
    function show(cls, msg) { if (!status) return; status.className = "form-status " + cls; status.textContent = msg; }
  });

  /* Site search (client-side, index in assets/js/search-index.js) */
  var sBox = d.getElementById("search");
  if (sBox) {
    var sIn = d.getElementById("search-q"), sOut = d.getElementById("search-results");
    var root = sBox.getAttribute("data-root") || "", sel = -1, hits = [];
    var norm = function (t) { return (t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); };
    var esc = function (t) { return t.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
    var docs = (window.PZ_INDEX || []).map(function (x) { return { x: x, t: norm(x.t), s: norm(x.s), h: norm(x.h), d: norm(x.d), b: norm(x.x) }; });
    function openS(q) {
      sBox.hidden = false; d.body.classList.add("lock");
      if (drawer) drawer.classList.remove("open");
      if (typeof q === "string") sIn.value = q;
      sIn.focus(); sIn.select(); run();
    }
    function closeS() { sBox.hidden = true; d.body.classList.remove("lock"); }
    function rx(t) { return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
    function snippet(text, terms) {
      var low = norm(text), i = -1;
      for (var k = 0; k < terms.length && i < 0; k++) { var m = new RegExp("(^|[^a-z0-9])" + rx(terms[k])).exec(low); if (m) i = m.index + m[1].length; }
      for (k = 0; k < terms.length && i < 0; k++) i = low.indexOf(terms[k]);
      var start = Math.max(0, i - 60);
      while (start > 0 && start > i - 90 && /\S/.test(text.charAt(start - 1))) start--;
      var out = (start ? "…" : "") + text.substr(start, 190) + (text.length > start + 190 ? "…" : "");
      out = esc(out);
      terms.forEach(function (t) { if (t.length > 1) out = out.replace(new RegExp("(^|[^A-Za-z0-9])(" + rx(t) + ")", "ig"), "$1<mark>$2</mark>"); });
      return out;
    }
    function run() {
      var q = norm(sIn.value).trim(), terms = q.split(/\s+/).filter(Boolean);
      sel = -1; hits = [];
      if (!terms.length) { sOut.innerHTML = ""; return; }
      docs.forEach(function (o) {
        var score = 0, all = true;
        terms.forEach(function (t) {
          var sc = 0;
          if (o.t.indexOf(t) > -1) sc += 12;
          if (o.h.indexOf(t) > -1) sc += 5;
          if (o.d.indexOf(t) > -1) sc += 4;
          if (o.s.indexOf(t) > -1) sc += 2;
          var m = o.b.split(t).length - 1; if (m) sc += Math.min(m, 6);
          if (!sc) all = false; score += sc;
        });
        if (all && score) hits.push({ o: o, score: score + (o.t.indexOf(q) > -1 ? 10 : 0) });
      });
      hits.sort(function (a, b) { return b.score - a.score; });
      hits = hits.slice(0, 12);
      if (!hits.length) { sOut.innerHTML = '<div class="search-empty">No results for “' + esc(sIn.value) + '”. Try another word, or <a href="' + root + 'contact.html">ask us directly</a>.</div>'; return; }
      sOut.innerHTML = hits.map(function (h, i) {
        var x = h.o.x;
        return '<a class="sr" role="option" id="sr' + i + '" href="' + root + x.u + '"><small>' + esc(x.s || "Page") + '</small><strong>' + esc(x.t) + "</strong><span>" + snippet(x.x || x.d, terms) + "</span></a>";
      }).join("");
    }
    function mark(i) {
      var els = sOut.querySelectorAll(".sr"); if (!els.length) return;
      sel = (i + els.length) % els.length;
      els.forEach(function (e, j) { e.classList.toggle("on", j === sel); });
      els[sel].scrollIntoView({ block: "nearest" });
    }
    sIn.addEventListener("input", run);
    sIn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); mark(sel + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); mark(sel - 1); }
      else if (e.key === "Enter") { var els = sOut.querySelectorAll(".sr"); var t = els[sel < 0 ? 0 : sel]; if (t) { e.preventDefault(); t.click(); } }
    });
    d.querySelectorAll("[data-search-open]").forEach(function (b) { b.addEventListener("click", function () { openS(); }); });
    sBox.querySelector("[data-search-close]").addEventListener("click", closeS);
    sBox.addEventListener("click", function (e) { if (e.target === sBox) closeS(); });
    sBox.querySelectorAll("[data-q]").forEach(function (b) { b.addEventListener("click", function () { openS(b.getAttribute("data-q")); }); });
    d.addEventListener("keydown", function (e) {
      var typing = /input|textarea|select/i.test((e.target || {}).tagName || "");
      if (e.key === "Escape" && !sBox.hidden) closeS();
      else if ((e.key === "/" && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) { e.preventDefault(); openS(); }
    });
  }

  /* Hero collage: crossfade each frame through its photos (paused on hover, off for reduced motion) */
  var col = d.querySelector(".collage");
  if (col && !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    var frames = [].slice.call(col.querySelectorAll(".rot")).filter(function (f) { return f.children.length > 1; });
    var paused = false, tick = 0;
    col.addEventListener("mouseenter", function () { paused = true; });
    col.addEventListener("mouseleave", function () { paused = false; });
    frames.forEach(function (f) { [].forEach.call(f.querySelectorAll("img"), function (im) { im.loading = "eager"; }); });
    setInterval(function () {
      if (paused || d.hidden || !frames.length) return;
      var f = frames[tick++ % frames.length], ims = f.querySelectorAll("img"), i = 0;
      for (; i < ims.length; i++) if (ims[i].classList.contains("on")) break;
      ims[i % ims.length].classList.remove("on");
      ims[(i + 1) % ims.length].classList.add("on");
    }, 1800);
  }

  /* Year */
  d.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
