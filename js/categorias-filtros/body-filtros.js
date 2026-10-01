document.addEventListener("DOMContentLoaded", function () {

    const contenedor = document.getElementById("body-productos");

    if (!contenedor) return;

    // Obtener todos los productos
    const productos = Array.from(
        contenedor.querySelectorAll(".body-producto")
    );

    // Guardar el orden inicial
    productos.forEach(function (producto, indice) {
        producto.dataset.ordenOriginal = indice;
    });

    // Controles
    const busqueda = document.getElementById("body-busqueda");
    const talla = document.getElementById("body-talla");
    const color = document.getElementById("body-color");
    const precio = document.getElementById("body-precio");
    const orden = document.getElementById("body-orden");

    const contador = document.getElementById("body-contador");
    const sinResultados = document.getElementById("body-sin-resultados");
    const limpiar = document.getElementById("body-limpiar");


    function filtrarProductos() {

        const texto = busqueda.value.trim().toLowerCase();
        const tallaElegida = talla.value;
        const colorElegido = color.value;

        const precioMaximo = precio.value === ""
            ? Infinity
            : Number(precio.value);

        let visibles = 0;

        productos.forEach(function (producto) {

            // Datos del producto
            const nombre = producto.dataset.nombre.toLowerCase();

            const tallasDisponibles = producto.dataset.tallas
                .split(",")
                .map(valor => valor.trim());

            const colorProducto = producto.dataset.color;

            const precioProducto = Number(
                producto.dataset.precio
            );

            // Condiciones
            const coincideNombre = nombre.includes(texto);

            const coincideTalla =
                tallaElegida === "" ||
                tallasDisponibles.includes(tallaElegida);

            const coincideColor =
                colorElegido === "" ||
                colorProducto === colorElegido;

            const coincidePrecio =
                precio.value === "" ||
                (
                    Number.isFinite(precioMaximo) &&
                    precioMaximo >= 0 &&
                    precioProducto <= precioMaximo
                );

            // Mostrar u ocultar
            const mostrar =
                coincideNombre &&
                coincideTalla &&
                coincideColor &&
                coincidePrecio;

            producto.hidden = !mostrar;

            if (mostrar) {
                visibles++;
            }

        });

        // Actualizar contador
        contador.textContent =
            "Mostrando " +
            visibles +
            (visibles === 1 ? " producto" : " productos");

        // Mostrar mensaje cuando no existan coincidencias
        sinResultados.hidden = visibles > 0;

    }


    function ordenarProductos() {

        const criterio = orden.value;

        const productosOrdenados = [...productos];

        productosOrdenados.sort(function (a, b) {

            const precioA = Number(a.dataset.precio);
            const precioB = Number(b.dataset.precio);

            if (criterio === "precio-asc") {
                return precioA - precioB;
            }

            if (criterio === "precio-desc") {
                return precioB - precioA;
            }

            if (criterio === "nombre") {
                return a.dataset.nombre.localeCompare(
                    b.dataset.nombre,
                    "es"
                );
            }

            return (
                Number(a.dataset.ordenOriginal) -
                Number(b.dataset.ordenOriginal)
            );

        });

        // Reordenar visualmente las tarjetas
        productosOrdenados.forEach(function (producto) {
            contenedor.appendChild(producto);
        });

    }


    // Escuchar cambios en filtros
    busqueda.addEventListener("input", filtrarProductos);
    talla.addEventListener("change", filtrarProductos);
    color.addEventListener("change", filtrarProductos);
    precio.addEventListener("input", filtrarProductos);

    orden.addEventListener("change", ordenarProductos);


    // Limpiar todos los filtros
    limpiar.addEventListener("click", function () {

        busqueda.value = "";
        talla.value = "";
        color.value = "";
        precio.value = "";

        orden.value = "original";

        ordenarProductos();
        filtrarProductos();

    });


    // Estado inicial
    filtrarProductos();

});