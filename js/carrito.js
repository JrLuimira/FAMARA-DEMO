document.addEventListener("DOMContentLoaded", function () {

    const STORAGE_KEY = "famara_carrito";

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartEmpty = document.getElementById("cartEmpty");

    if (!cartItems || !cartTotal || !cartEmpty) return;

    let carrito = [];

    // Recuperar los productos guardados
    try {
        const guardado = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        if (Array.isArray(guardado)) {
            carrito = guardado.filter(item =>
                typeof item.id === "string" &&
                typeof item.name === "string" &&
                Number.isFinite(item.price) &&
                item.price >= 0 &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0
            );
        }
    } catch (error) {
        carrito = [];
    }

    function moneda(valor) {
        return "$" + valor.toFixed(2);
    }

    // Guardar los productos
    function guardarCarrito() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(carrito)
            );
        } catch (error) {
            console.warn("No se pudo guardar el carrito.");
        }
    }

    // Crear un botón para los controles del carrito
    function crearBoton(texto, accion, id, etiqueta) {

        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "btn btn-outline-dark btn-sm";
        boton.textContent = texto;

        boton.dataset.cartAction = accion;
        boton.dataset.id = id;
        boton.setAttribute("aria-label", etiqueta);

        return boton;
    }

    // Actualizar carrito lateral
    function actualizarCarrito() {

        cartItems.replaceChildren();

        let total = 0;
        let cantidad = 0;

        carrito.forEach(function (producto) {

            const subtotal =
                producto.price * producto.quantity;

            total += subtotal;
            cantidad += producto.quantity;

            const li = document.createElement("li");

            li.className = "list-group-item py-3";

            // Nombre del producto
            const nombre = document.createElement("strong");

            nombre.className = "d-block text-dark";
            nombre.textContent = producto.name;

            // Precio y subtotal
            const precio = document.createElement("p");

            precio.className = "mb-2";

            precio.textContent =
                moneda(producto.price) +
                " × " +
                producto.quantity +
                " = " +
                moneda(subtotal);

            // Controles de cantidad
            const controles = document.createElement("div");

            controles.className =
                "d-flex align-items-center gap-2";

            const menos = crearBoton(
                "−",
                "menos",
                producto.id,
                "Disminuir cantidad"
            );

            const cantidadTexto = document.createElement("span");

            cantidadTexto.textContent = producto.quantity;

            const mas = crearBoton(
                "+",
                "mas",
                producto.id,
                "Aumentar cantidad"
            );

            const eliminar = crearBoton(
                "Eliminar",
                "eliminar",
                producto.id,
                "Eliminar producto"
            );

            eliminar.classList.add("ms-auto");

            controles.append(
                menos,
                cantidadTexto,
                mas,
                eliminar
            );

            li.append(nombre, precio, controles);

            cartItems.appendChild(li);

        });

        // Mostrar el total
        cartTotal.textContent = moneda(total);

        // Mostrar mensaje cuando está vacío
        cartEmpty.hidden = carrito.length > 0;

        // Actualizar contador de la navegación
        document.querySelectorAll(".cart-count")
            .forEach(function (contador) {

                contador.textContent = "(" + cantidad + ")";

            });

    }

    // Agregar producto
    function agregarProducto(boton) {

        const id = boton.dataset.id;
        const name = boton.dataset.name;
        const price = Number(boton.dataset.price);

        if (!id || !name || !Number.isFinite(price) || price < 0) {
            return;
        }

        const existente = carrito.find(
            producto => producto.id === id
        );

        if (existente) {

            existente.quantity++;

        } else {

            carrito.push({
                id: id,
                name: name,
                price: price,
                quantity: 1
            });

        }

        guardarCarrito();
        actualizarCarrito();

        // Abrir el carrito lateral automáticamente
        const panel = document.getElementById("offcanvasCart");

        if (panel && window.bootstrap?.Offcanvas) {

            bootstrap.Offcanvas
                .getOrCreateInstance(panel)
                .show();

        }

    }

    // Detectar clics en los botones
    document.addEventListener("click", function (event) {

        // Botón agregar al carrito
        const agregar = event.target.closest(".best-add-cart");

        if (agregar) {
            agregarProducto(agregar);
            return;
        }

        // Botones dentro del carrito
        const control = event.target.closest("[data-cart-action]");

        if (!control) return;

        const id = control.dataset.id;
        const accion = control.dataset.cartAction;

        const producto = carrito.find(
            item => item.id === id
        );

        if (!producto) return;

        if (accion === "mas") {

            producto.quantity++;

        } else if (accion === "menos") {

            producto.quantity--;

        } else if (accion === "eliminar") {

            producto.quantity = 0;

        }

        // Eliminar productos con cantidad cero
        carrito = carrito.filter(
            item => item.quantity > 0
        );

        guardarCarrito();
        actualizarCarrito();

    });

    // Mostrar el estado inicial
    actualizarCarrito();

});