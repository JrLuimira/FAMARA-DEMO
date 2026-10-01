// Esta ruta funciona tanto desde index.html
// como desde las páginas dentro de pages/
const rutaDetalle = new URL(
    "../pages/producto.html",
    document.currentScript.src
);

document.addEventListener("DOMContentLoaded", function () {

    // Busca todas las tarjetas que utilizan el formato Best Sellers
    document.querySelectorAll(".best-product-card").forEach(function (card) {

        const boton = card.querySelector(".best-add-cart");
        const contenedorFoto = card.querySelector(".best-product-photo");

        if (!boton || !contenedorFoto) return;

        // Conservamos el identificador que ya tiene cada producto
        const id = boton.dataset.id;

        if (!id) return;

        const destino = new URL(rutaDetalle);
        destino.searchParams.set("id", id);

        // Algunas tarjetas tienen un <a> y otras un <div> alrededor de la imagen.
        // Convertimos ambos casos en un enlace.
        let enlace = contenedorFoto;

        if (contenedorFoto.tagName.toLowerCase() !== "a") {

            enlace = document.createElement("a");
            enlace.className = contenedorFoto.className;

            while (contenedorFoto.firstChild) {
                enlace.appendChild(contenedorFoto.firstChild);
            }

            contenedorFoto.replaceWith(enlace);
        }

        enlace.href = destino.href;
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";
        enlace.setAttribute("aria-label", "Ver detalles de " + boton.dataset.name);

        // Quitamos el botón del listado
        boton.remove();

    });

});