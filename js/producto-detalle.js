document.addEventListener("DOMContentLoaded", function () {

    const parametros = new URLSearchParams(window.location.search);

    const id = parametros.get("id");

    const producto = window.FAMARA_PRODUCTOS?.[id];

    const mensaje = document.getElementById("detalle-mensaje");
    const boton = document.getElementById("detalle-agregar");

    // Verificar si existe el producto
    if (!producto) {

        document.getElementById("detalle-nombre").textContent =
            "Producto no encontrado";

        boton.hidden = true;

        return;
    }


    // ======================================
    // MOSTRAR INFORMACIÓN
    // ======================================

    document.title = producto.nombre + " | FAMARA";

    const imagen = document.getElementById("detalle-imagen");

    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;

    document.getElementById("detalle-nombre").textContent =
        producto.nombre;

    document.getElementById("detalle-precio").textContent =
        "$" + producto.precio.toFixed(2);

    document.getElementById("detalle-descripcion").textContent =
        producto.descripcion;

    document.getElementById("detalle-color").textContent =
        producto.color;


    // ======================================
    // MOSTRAR TALLAS
    // ======================================

    const selector = document.getElementById("detalle-talla");

    const contenedorTallas =
        document.getElementById("detalle-tallas-contenedor");

    const tallas = producto.tallas || [];

    if (tallas.length === 0) {

        contenedorTallas.hidden = true;

    } else {

        tallas.forEach(function (talla) {

            const opcion = document.createElement("option");

            opcion.value = talla;
            opcion.textContent = talla;

            selector.appendChild(opcion);

        });

    }


    // ======================================
    // AGREGAR AL CARRITO
    // ======================================

    boton.addEventListener("click", function () {

        const tallaElegida = selector.value;

        if (tallas.length > 0 && !tallaElegida) {

            mensaje.textContent =
                "Selecciona una talla antes de agregar el producto.";

            return;
        }

        // Mismo almacenamiento utilizado por carrito.js
        const STORAGE_KEY = "famara_carrito";

        let carrito = [];

        try {

            const guardado = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            if (Array.isArray(guardado)) {
                carrito = guardado;
            }

        } catch (error) {

            carrito = [];

        }

        // Cada talla se guarda como una variante diferente
        const identificador = tallaElegida
            ? id + "-" + tallaElegida
            : id;

        const nombreCompleto = tallaElegida
            ? producto.nombre + " - Talla " + tallaElegida
            : producto.nombre;


        const existente = carrito.find(function (item) {

            return item.id === identificador;

        });


        if (existente) {

            existente.quantity += 1;

        } else {

            carrito.push({

                id: identificador,

                name: nombreCompleto,

                price: producto.precio,

                quantity: 1

            });

        }


        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(carrito)
            );

        } catch (error) {

            mensaje.textContent =
                "No se pudo guardar el producto. Revisa el almacenamiento del navegador.";

            return;
        }


        // Confirmación dentro de la página.
        // No abrimos ningún offcanvas.
        mensaje.textContent =
            "¡" + nombreCompleto + " agregado al carrito!";

    });

});