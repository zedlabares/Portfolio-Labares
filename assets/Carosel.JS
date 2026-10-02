/* Carosel.JS — site controller: carousel, contact modal, navigation, scroll reveal.
   (File name kept as-is so index.html keeps working.) */

(function () {
  "use strict";

  // Lets the CSS know JavaScript is running (used for the mobile menu + reveal effects).
  document.documentElement.classList.add("js");

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     Carousel
     ============================================================ */
  function initCarousel() {
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    var carouselEl = document.querySelector(".carousel");
    var current = 0;
    var timer = null;
    var DELAY = 3000;

    function showSlide(n) {
      if (!slides.length) return;
      current = ((n % slides.length) + slides.length) % slides.length; // wrap around

      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
        if (dots[i]) dots[i].classList.remove("active");
      }
      slides[current].classList.add("active");
      if (dots[current]) dots[current].classList.add("active");
    }

    function nextSlide() { showSlide(current + 1); }
    function start() { stop(); if (!prefersReducedMotion) timer = setInterval(nextSlide, DELAY); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    showSlide(0);
    start();

    // Pause on hover
    if (carouselEl) {
      carouselEl.addEventListener("mouseenter", stop);
      carouselEl.addEventListener("mouseleave", start);
    }

    // Pause when the tab is hidden; resume when visible (and not hovered).
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stop();
      } else if (!carouselEl || !carouselEl.matches(":hover")) {
        start();
      }
    });
  }

  /* ============================================================
     Contact modal
     ============================================================ */
  function initModal() {
    var modal = document.getElementById("myModal");
    var openBtn = document.getElementById("contacts");
    var closeBtn = modal && modal.querySelector(".close");

    function openModal(e) {
      e.preventDefault();
      if (!modal) return;
      modal.style.display = "block";
      if (closeBtn) closeBtn.focus();
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      if (!modal) return;
      modal.style.display = "none";
      document.body.style.overflow = "";
      if (openBtn) openBtn.focus();
    }

    if (openBtn) openBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    // Close on overlay click
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeModal();
      });
    }

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal && modal.style.display === "block") {
        closeModal();
      }
    });

    // Expose so other modules (mobile menu) can close the modal if needed.
    return { open: openModal, close: closeModal };
  }

  /* ============================================================
     Navigation: mobile menu + highlight the section being viewed
     ============================================================ */
  function initNav() {
    var header = document.querySelector("header");
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!header || !toggle || !nav) return;

    function setMenu(open) {
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }

    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close the menu after choosing a link
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    // Close with Escape (and return focus to the button)
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });

    // Highlight the nav link for the section currently in view
    if (!("IntersectionObserver" in window)) return;
    var links = nav.querySelectorAll('a[href^="#"]');
    var map = {};
    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      if (id && document.getElementById(id)) map[id] = link;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove("is-active"); l.removeAttribute("aria-current"); });
        var link = map[entry.target.id];
        if (link) { link.classList.add("is-active"); link.setAttribute("aria-current", "true"); }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });

    Object.keys(map).forEach(function (id) { observer.observe(document.getElementById(id)); });
  }

  /* ============================================================
     Scroll reveal: a single, gentle fade-in for cards and titles
     ============================================================ */
  function initReveal() {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

    var targets = document.querySelectorAll(
      ".section-title, .timeline-item, .skill-card, .project-card, .stat-card"
    );

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(function (el, i) {
      el.classList.add("reveal");
      // Small stagger for siblings in the same grid
      el.style.setProperty("--reveal-delay", (i % 3) * 80 + "ms");
      observer.observe(el);
    });
  }

  /* ---------- Start everything ---------- */
  initCarousel();
  initModal();
  initNav();
  initReveal();
})();
