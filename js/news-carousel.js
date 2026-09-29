/* Carrusel de noticias FAMARA: independiente de Swiper y jQuery. */

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".news-carousel").forEach(function (carousel) {
    const track = carousel.querySelector(".news-track");
    const slides = Array.from(carousel.querySelectorAll(".news-slide"));
    const dots = Array.from(carousel.querySelectorAll(".news-dot"));

    if (!track || slides.length === 0 || dots.length !== slides.length) {
      return;
    }

    const autoplayMs = Number(carousel.dataset.autoplayMs) || 4000;
    let currentNews = 0;
    let intervalId = null;

    function showNews(index) {
      currentNews = ((index % slides.length) + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentNews * 100}%)`;

      dots.forEach(function (dot, i) {
        const selected = i === currentNews;
        dot.classList.toggle("active", selected);
        dot.setAttribute("aria-pressed", String(selected));
      });

      slides.forEach(function (slide, i) {
        const visible = i === currentNews;
        slide.setAttribute("aria-hidden", String(!visible));
        slide.tabIndex = visible ? 0 : -1;
      });
    }

    function startAutoplay() {
      window.clearInterval(intervalId);
      intervalId = null;

      if (slides.length > 1 && !document.hidden) {
        intervalId = window.setInterval(function () {
          showNews(currentNews + 1);
        }, autoplayMs);
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showNews(i);
        startAutoplay(); // Reinicia los 4 segundos tras elegir una noticia.
      });
    });

    document.addEventListener("visibilitychange", startAutoplay);

    showNews(0);
    startAutoplay();
  });
});