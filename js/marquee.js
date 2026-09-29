document.addEventListener("DOMContentLoaded", function () {

    const banners = document.querySelectorAll(".famara-marquee");

    banners.forEach(function (banner) {

        const track = banner.querySelector(
            ".famara-marquee-track"
        );

        const grupo = track.querySelector(
            ".famara-marquee-group"
        );

        if (!grupo) return;

        // Crear una copia del grupo completo
        const copia = grupo.cloneNode(true);

        // Evitar que los enlaces duplicados
        // sean accesibles mediante el teclado
        copia.setAttribute("aria-hidden", "true");

        copia.querySelectorAll("a").forEach(function (link) {
            link.tabIndex = -1;
        });

        // Agregar la copia al carrusel
        track.appendChild(copia);

    });

});