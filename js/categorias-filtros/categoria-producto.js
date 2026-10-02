(() => {
  "use strict";

  document.querySelectorAll("[data-catalogo]").forEach((catalogo) => {
    const form = catalogo.querySelector(".categoria-filtros");
    const grid = catalogo.querySelector(".categoria-grid");
    const orden = catalogo.querySelector("#categoria-orden");
    const contador = catalogo.querySelector(".categoria-contador");
    const sinResultados = catalogo.querySelector(
      ".categoria-sin-resultados"
    );
    const sidebar = catalogo.querySelector(".categoria-sidebar");
    const toggle = catalogo.querySelector(".categoria-filtros-toggle");

    if (!grid || !form) return;

    const productos = Array.from(
      grid.querySelectorAll(".product-card")
    );

    // Actualiza las tarjetas usando los mismos datos del detalle.
    productos.forEach((tarjeta) => {
      const enlace = tarjeta.querySelector(".product-photo");

      if (!enlace) return;

      const destino = new URL(
        enlace.getAttribute("href"),
        document.baseURI
      );

      const id = destino.searchParams.get("id");
      const producto = window.PRODUCTOS?.[id];

      if (!producto) {
        console.error(`Producto sin datos: ${id}`);
        return;
      }

      tarjeta.dataset.nombre = producto.nombre;
      tarjeta.dataset.precio = producto.precio;
      tarjeta.dataset.color = producto.color;
      tarjeta.dataset.tallas = producto.tallas.join(",");

      const titulo = tarjeta.querySelector(".product-info h5 a");

      if (titulo) {
        titulo.textContent = producto.nombre;
        titulo.href = destino.href;
      }

      const precio = tarjeta.querySelector(
        ".product-price-box-strong"
      );

      if (precio) {
        precio.textContent =
          `$${Number(producto.precio).toFixed(2)}`;
      }

      const imagenes = producto.imagenes.map((ruta, indice) => {
        const imagen = document.createElement("img");

        imagen.src = new URL(ruta, destino).href;
        imagen.alt = `${producto.nombre}, foto ${indice + 1}`;
        imagen.loading = "lazy";
        imagen.draggable = false;
        imagen.hidden = indice !== 0;

        return imagen;
      });

      enlace.replaceChildren(...imagenes);

      tarjeta.querySelector(".categoria-galeria")?.setAttribute(
        "aria-label",
        `Fotos de ${producto.nombre}`
      );
    });

    const normalizar = (texto) =>
      texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    function actualizarProductos() {
      const datos = new FormData(form);

      const busqueda = normalizar(
        String(datos.get("busqueda") || "")
      );

      const colores = datos.getAll("color");
      const tallas = datos.getAll("talla");

      const valorMinimo = String(
        datos.get("minimo") || ""
      ).trim();

      const valorMaximo = String(
        datos.get("maximo") || ""
      ).trim();

      const minimo =
        valorMinimo === "" ? 0 : Number(valorMinimo);

      const maximo =
        valorMaximo === "" ? Infinity : Number(valorMaximo);

      let visibles = 0;

      productos.forEach((producto) => {
        const precio = Number(producto.dataset.precio);

        const nombre = normalizar(
          producto.dataset.nombre || ""
        );

        const tallasProducto = (
          producto.dataset.tallas || ""
        )
          .split(",")
          .map((talla) => talla.trim());

        const coincide =
          nombre.includes(busqueda) &&
          precio >= minimo &&
          precio <= maximo &&
          (
            colores.length === 0 ||
            colores.includes(producto.dataset.color)
          ) &&
          (
            tallas.length === 0 ||
            tallas.some((talla) => tallasProducto.includes(talla))
          );

        producto.hidden = !coincide;

        if (coincide) visibles++;
      });

      const ordenados = [...productos];

      if (orden.value === "precio-asc") {
        ordenados.sort(
          (a, b) =>
            Number(a.dataset.precio) -
            Number(b.dataset.precio)
        );
      } else if (orden.value === "precio-desc") {
        ordenados.sort(
          (a, b) =>
            Number(b.dataset.precio) -
            Number(a.dataset.precio)
        );
      } else if (orden.value === "nombre") {
        ordenados.sort((a, b) =>
          a.dataset.nombre.localeCompare(
            b.dataset.nombre,
            "es"
          )
        );
      }

      // "Destacados" restaura el orden original del HTML.
      ordenados.forEach((producto) => {
        grid.appendChild(producto);
      });

      contador.textContent =
        `${visibles} ${visibles === 1 ? "producto" : "productos"}`;

      sinResultados.hidden = visibles !== 0;
    }

    form.addEventListener("submit", (evento) => {
      evento.preventDefault();
    });

    form.addEventListener("input", actualizarProductos);

    orden.addEventListener("change", actualizarProductos);

    form.addEventListener("reset", () => {
      orden.value = "original";

      // Espera a que el navegador termine de limpiar los campos.
      setTimeout(actualizarProductos, 0);
    });

    toggle.addEventListener("click", () => {
      const abierto = sidebar.classList.toggle("is-open");

      toggle.setAttribute(
        "aria-expanded",
        String(abierto)
      );

      toggle.querySelector("span").textContent =
        abierto ? "−" : "+";
    });

    // Galería de fotos de cada tarjeta.
    catalogo.querySelectorAll(".categoria-galeria").forEach(
      (galeria) => {
        const enlace = galeria.querySelector(".product-photo");

        const fotos = Array.from(
          enlace.querySelectorAll("img")
        );

        const anterior = galeria.querySelector(
          ".categoria-foto-anterior"
        );

        const siguiente = galeria.querySelector(
          ".categoria-foto-siguiente"
        );

        const indicador = galeria.querySelector(
          ".categoria-foto-contador"
        );

        let indice = 0;
        let inicio = null;
        let bloquearClickHasta = 0;

        function mostrarFoto(nuevoIndice) {
          indice =
            (nuevoIndice + fotos.length) % fotos.length;

          fotos.forEach((foto, posicion) => {
            foto.hidden = posicion !== indice;
          });

          indicador.textContent =
            `${indice + 1} / ${fotos.length}`;
        }

        if (fotos.length <= 1) {
          anterior.hidden = true;
          siguiente.hidden = true;
          indicador.hidden = true;
          return;
        }

        anterior.addEventListener("click", () => {
          mostrarFoto(indice - 1);
        });

        siguiente.addEventListener("click", () => {
          mostrarFoto(indice + 1);
        });

        enlace.addEventListener("pointerdown", (evento) => {
          if (
            !evento.isPrimary ||
            evento.pointerType === "mouse"
          ) {
            return;
          }

          inicio = {
            id: evento.pointerId,
            x: evento.clientX,
            y: evento.clientY
          };
        });

        enlace.addEventListener("pointerup", (evento) => {
          if (!inicio || inicio.id !== evento.pointerId) {
            return;
          }

          const desplazamientoX =
            evento.clientX - inicio.x;

          const desplazamientoY =
            evento.clientY - inicio.y;

          inicio = null;

          // Cambia la foto con un gesto claramente horizontal.
          if (
            Math.abs(desplazamientoX) >= 45 &&
            Math.abs(desplazamientoX) >
              Math.abs(desplazamientoY) * 1.5
          ) {
            mostrarFoto(
              indice + (desplazamientoX < 0 ? 1 : -1)
            );

            // Evita abrir el detalle al terminar de deslizar.
            bloquearClickHasta = Date.now() + 500;
          }
        });

        enlace.addEventListener("pointercancel", () => {
          inicio = null;
        });

        enlace.addEventListener("pointerleave", () => {
          inicio = null;
        });

        enlace.addEventListener("click", (evento) => {
          if (
            evento.detail !== 0 &&
            Date.now() < bloquearClickHasta
          ) {
            evento.preventDefault();
          }
        });

        mostrarFoto(0);
      }
    );

    actualizarProductos();
  });
})();