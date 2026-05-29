/*
	Precasterz — slideshow controller
	Crossfade via .is-active class, autoplay with hover/focus pause, arrow-key nav.
	Keeps plusSlides()/currentSlide() globals for the inline onclick handlers.
*/
(function () {
	"use strict";

	var slideIndex = 0;            // 0-based internally
	var timer = null;
	var DELAY = 5000;              // autoplay interval (ms)

	function slides() { return document.getElementsByClassName("mySlides"); }
	function dots() { return document.getElementsByClassName("dot"); }

	function render() {
		var s = slides(), d = dots(), i;
		if (!s.length) return;
		if (slideIndex >= s.length) slideIndex = 0;
		if (slideIndex < 0) slideIndex = s.length - 1;
		for (i = 0; i < s.length; i++) {
			if (i === slideIndex) s[i].classList.add("is-active");
			else s[i].classList.remove("is-active");
		}
		for (i = 0; i < d.length; i++) {
			if (i === slideIndex) d[i].classList.add("active");
			else d[i].classList.remove("active");
		}
	}

	function go(n) { slideIndex += n; render(); restart(); }
	function to(n) { slideIndex = n; render(); restart(); }

	// Backwards-compatible globals (inline onclick uses 1-based indices)
	window.plusSlides = function (n) { go(n); };
	window.currentSlide = function (n) { to(n - 1); };

	function start() {
		if (timer || slides().length < 2) return;
		timer = setInterval(function () { slideIndex++; render(); }, DELAY);
	}
	function stop() { if (timer) { clearInterval(timer); timer = null; } }
	function restart() { stop(); start(); }

	function init() {
		if (!slides().length) return;
		render();

		var box = document.querySelector(".slideshow-container");
		if (box) {
			box.addEventListener("mouseenter", stop);
			box.addEventListener("mouseleave", start);
			box.addEventListener("focusin", stop);
			box.addEventListener("focusout", start);
		}

		document.addEventListener("keydown", function (e) {
			if (e.key === "ArrowLeft") go(-1);
			else if (e.key === "ArrowRight") go(1);
		});

		start();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
