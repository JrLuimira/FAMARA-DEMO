(() => {
  "use strict";

  const detalle = document.getElementById("detalle-producto");
  const error = document.getElementById("detalle-error");

  if (!detalle || !error) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const catalogo = window.PRODUCTOS;

  const producto =
    catalogo && Object.prototype.hasOwnProperty.call(catalogo, id)
      ? catalogo[id]
      : null;

  detalle.hidden = true;
  error.hidden = true;

  if (!producto) {
    error.textContent = catalogo
      ? "No encontramos ese producto. Vuelve al catálogo y selecciona una prenda."
      : "No se pudieron cargar los datos de productos. Recarga la página.";

    error.hidden = false;
    return;
  }

  document.title = `${producto.nombre} | FAMARA`;

  document.getElementById("detalle-nombre").textContent =
    producto.nombre;

  document.getElementById("detalle-precio").textContent =
    `$${Number(producto.precio).toFixed(2)}`;

  document.getElementById("detalle-descripcion").textContent =
    producto.descripcion || "Descripción pendiente.";

  document.getElementById("detalle-color").textContent =
    producto.color;

  const imagen = document.getElementById("detalle-imagen");

  imagen.src = producto.imagenes[0];
  imagen.alt = producto.nombre;

  const volver = document.getElementById("detalle-volver");

  volver.href = producto.paginaCategoria;
  volver.textContent = `Volver a ${producto.categoria}`;

  const selector = document.getElementById("detalle-talla");

  selector.replaceChildren(new Option("Elige una talla", ""));

  producto.tallas.forEach((talla) => {
    selector.add(new Option(talla, talla));
  });

  detalle.dataset.productoId = id;
  detalle.hidden = false;
})();