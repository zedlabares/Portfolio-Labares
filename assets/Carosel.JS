/* Carosel.JS — carousel + modal controller */

(function () {
  "use strict";

  /* ---------- Carousel ---------- */
  var slides = document.getElementsByClassName("mySlides");
  var dots   = document.getElementsByClassName("dot");
  var current = 0;
  var timer;

  function showSlide(n) {
    if (!slides.length) return;
    // bounds wrap
    current = (n % slides.length + slides.length) % slides.length;

    for (var i = 0; i < slides.length; i++) {
      slides[i].classList.remove("active");
      if (dots[i]) dots[i].classList.remove("active");
    }

    slides[current].classList.add("active");
    if (dots[current]) dots[current].classList.add("active");
  }

  function nextSlide() {
    showSlide(current + 1);
  }

  // Start
  showSlide(0);
  timer = setInterval(nextSlide, 3000);

  // Pause on hover
  var carouselEl = document.querySelector(".carousel");
  if (carouselEl) {
    carouselEl.addEventListener("mouseenter", function () {
      clearInterval(timer);
    });
    carouselEl.addEventListener("mouseleave", function () {
      timer = setInterval(nextSlide, 3000);
    });
  }

  // Fix 4: Pause when tab is hidden; resume when visible again.
  // Prevents the interval from firing (and wasting CPU/battery) in the background.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      clearInterval(timer);
    } else {
      // Only restart if the carousel el isn't currently hovered
      if (!carouselEl || !carouselEl.matches(":hover")) {
        timer = setInterval(nextSlide, 3000);
      }
    }
  });

  /* ---------- Modal ---------- */
  var modal  = document.getElementById("myModal");
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

})();
