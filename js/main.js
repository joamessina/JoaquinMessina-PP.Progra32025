//Punto 1 = array de frutas
// Se crea un array de objetos llamado listaFrutas. Cada objeto representa una fruta disponible en la tienda.
// Cada fruta tiene un id, un nombre, un precio y la ruta a su imagen correspondiente desde la carpeta /img.
// Esta estructura permite manipular fácilmente cada fruta en otras funciones como mostrar, filtrar o agregar al carrito.
const listaFrutas = [
    { id: 1, nombre: "arandano", precio: 5000, img: "img/arandano.jpg" },
    { id: 2, nombre: "banana", precio: 1000, img: "img/banana.jpg" },
    { id: 3, nombre: "frambuesa", precio: 4000, img: "img/frambuesa.png" },
    { id: 4, nombre: "frutilla", precio: 3000, img: "img/frutilla.jpg" },
    { id: 5, nombre: "kiwi", precio: 2000, img: "img/kiwi.jpg" },
    { id: 6, nombre: "mandarina", precio: 800, img: "img/mandarina.jpg" },
    { id: 7, nombre: "manzana", precio: 1500, img: "img/manzana.jpg" },
    { id: 8, nombre: "naranja", precio: 9000, img: "img/naranja.jpg" },
    { id: 9, nombre: "pera", precio: 2500, img: "img/pera.jpg" },
    { id: 10, nombre: "anana", precio: 3000, img: "img/anana.jpg" },
    { id: 11, nombre: "pomelo-amarillo", precio: 2000, img: "img/pomelo-amarillo.jpg" },
    { id: 12, nombre: "pomelo-rojo", precio: 2000, img: "img/pomelo-rojo.jpg" },
    { id: 13, nombre: "sandia", precio: 6000, img: "img/sandia.jpg" }
];

//fin punto 1

// Punto 2 - Mostrar alumno
// La función imprimirDatosAlumno crea un objeto con datos del alumno: DNI, nombre y apellido.
// Muestra estos datos por consola y también los inyecta en el HTML dentro del <header>.
// Además, genera un mensaje de bienvenida en pantalla que desaparece automáticamente tras unos segundos.
function imprimirDatosAlumno() {
    const alumno = { dni: 42346609, nombre: "Joaquin", apellido: "Messina" };
    const alerta = document.getElementById("bienvenida");
    alerta.textContent = `¡Bienvenido a la tienda de frutas de ${alumno.nombre} ${alumno.apellido}!`;

    // Ocultar con fade-out
    setTimeout(() => {
        alerta.style.transition = "opacity 0.8s ease";
        alerta.style.opacity = "0";
        setTimeout(() => alerta.remove(), 1000);
    }, 3000); // visible durante 3 segundos


    console.log(`Alumno: ${alumno.nombre} ${alumno.apellido} - DNI: ${alumno.dni}`);
    document.querySelector("#nombre-alumno").textContent = `${alumno.nombre} ${alumno.apellido}`;
      // Mostrar en HTML
    const divNombre = document.querySelector("#nombre-alumno");
    divNombre.textContent = `${alumno.nombre} ${alumno.apellido}`;

}
// Fin punto 2

// Punto 3 - Mostrar productos con imagenes
// La función mostrarProductos se encarga de pintar dinámicamente en pantalla todas las frutas disponibles.
// Por cada fruta, crea una tarjeta (card) con su imagen, nombre, precio y botón para agregar al carrito.
// También se asigna un evento a cada botón para que al hacer click, esa fruta se agregue al carrito.
// Se usan clases de Bootstrap e íconos para mejorar la estética.
function mostrarProductos(lista) {
    const contenedor = document.querySelector("#contenedor-productos");
    contenedor.innerHTML = "";

    lista.forEach(fruta => {
        const col = document.createElement("div");
        col.classList.add("col");

        col.innerHTML = `
        <div class="card-producto p-2 text-center h-100 d-flex flex-column justify-content-between">
            <img src="${fruta.img}" alt="${fruta.nombre}" class="img-fluid mx-auto">
            <h3 class="mt-2">${fruta.nombre}</h3>
            <p>$${fruta.precio}</p>
            <button class="btn btn-success mt-auto" data-id="${fruta.id}"><i class="bi bi-cart-plus-fill me-1"></i>Agregar</button>
        </div>
        `;

        contenedor.appendChild(col);
    });

    // Asociar eventos
    document.querySelectorAll(".card-producto button").forEach(boton => {
        boton.addEventListener("click", () => {
            agregarAlCarrito(parseInt(boton.dataset.id));
        });
    });
}
// Fin punto 3

// Punto 4 - Filtro
// Esta función aplicarFiltro escucha el input del usuario mientras escribe en el buscador.
// Va filtrando en tiempo real las frutas cuyo nombre contenga el texto ingresado.
// Al detectar coincidencias, vuelve a mostrar solo esos productos filtrados.

function aplicarFiltro() {
    const input = document.querySelector("#buscador");
    input.addEventListener("input", () => {
        const texto = input.value.toLowerCase();
        const filtrado = listaFrutas.filter(fruta => fruta.nombre.toLowerCase().includes(texto));
        mostrarProductos(filtrado);
    });
}
// Fin punto 4

// Punto 5 - Agregar al carrito, mostrar y eliminar
// Esta sección maneja todo lo relacionado con el carrito:
// - agregarAlCarrito: suma una fruta al carrito o aumenta su cantidad si ya estaba.
// - mostrarCarrito: recorre los productos en el carrito y los muestra con su cantidad y precio total.
// - eliminarProducto: quita un producto del carrito al hacer clic en el botón eliminar.
// También se incluye una pequeña animación visual y un mensaje tipo toast al agregar productos.

let carrito = [];

function agregarAlCarrito(id) {
    const producto = listaFrutas.find(p => p.id === id);
    const yaExiste = carrito.find(p => p.id === id);
    const btn = document.querySelector(`button[data-id="${id}"]`);
    btn.classList.add("btn-agregado");
    setTimeout(() => btn.classList.remove("btn-agregado"), 500);3

    if (yaExiste) {
    yaExiste.cantidad += 1;
    } else {
    carrito.push({ ...producto, cantidad: 1 });
    }
    mostrarToast(`✅ ${producto.nombre} agregado al carrito`);

guardarCarritoEnLocalStorage(); // Punto 6
mostrarCarrito();
}

function mostrarCarrito() {
    const lista = document.querySelector("#items-carrito");
    lista.innerHTML = "";

    if (carrito.length === 0) { 
        lista.innerHTML = `<li class="list-group-item">No hay elementos en el carrito.</li>`;
        actualizarContadorCarrito();
        document.querySelector("#precio-total").textContent = "$0";
        return;
    }   

    carrito.forEach(prod => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        li.innerHTML = `
        <span>${prod.nombre} x${prod.cantidad} - $${prod.precio * prod.cantidad}</span>
        <div>
            <button class="btn btn-sm btn-warning me-1 boton-restar" title="Restar 1">
                <i class="bi bi-dash-circle"></i>
            </button>
            <button class="btn btn-sm btn-danger boton-eliminar" title="Eliminar producto">
                <i class="bi bi-trash3-fill"></i>
            </button>
        </div>
        `;

        // Asociar eventos
        li.querySelector(".boton-restar").addEventListener("click", () => restarItemDelCarrito(prod.id));
        li.querySelector(".boton-eliminar").addEventListener("click", () => eliminarProducto(prod.id));

        lista.appendChild(li);
    });

    actualizarContadorCarrito();
    actualizarTotal();
}


// Fin punto 5

// Punto 6 - LocalStorage
// Estas funciones permiten guardar el contenido del carrito en el LocalStorage del navegador
// para que se mantenga aunque se recargue la página. También recupera el contenido si ya existía.

function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
    const data = localStorage.getItem("carrito");
    return data ? JSON.parse(data) : [];
}
// Fin punto 6


// Punto 7 - Contador y total
// Actualiza el número total de productos en el carrito y el monto total a pagar.
// La cantidad incluye todas las unidades (ej: 3 manzanas cuentan como 3 productos).
// El total se calcula multiplicando cantidad por precio para cada producto.

function actualizarContadorCarrito() {
    const total = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    document.querySelector("#contador-carrito").textContent = total;
}

function actualizarTotal() {
    const total = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
    document.querySelector("#precio-total").textContent = `$${total}`;
}
// Fin punto 7


/** 
 * Funcionalidad agregada - mostrarToast(mensaje)
 * Esta función muestra un pequeño mensaje flotante (toast) en pantalla,
 * que sirve como retroalimentación visual para el usuario, por ejemplo
 * al agregar un producto al carrito.
 * Recibe un texto (mensaje) y lo inserta en el elemento con id="toast".
 * Luego le agrega la clase "visible" para que se vea, y lo oculta automáticamente
 * luego de 2.5 segundos, quitando dicha clase.
 * Mejora la experiencia de usuario permitiendo confirmar acciones sin interrumpir el flujo.
 */

function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    toast.textContent = mensaje;
    toast.classList.add("visible");

    setTimeout(() => {
        toast.classList.remove("visible");
    }, 2500); // dura 2.5 segundos
}


/** Fin funcionalidad agregada */


// Punto 8 - Ordenar
// Permite ordenar la lista de frutas de dos formas:
// - Por nombre alfabéticamente de A a Z.
// - Por precio de menor a mayor.
// Esto mejora la experiencia del usuario al buscar productos.

function ordenarPorNombre() {
    const copia = [...listaFrutas].sort((a, b) => a.nombre.localeCompare(b.nombre));
    mostrarProductos(copia);
}

function ordenarPorPrecio() {
    const copia = [...listaFrutas].sort((a, b) => a.precio - b.precio);
    mostrarProductos(copia);
}
  // Fin punto 8



// Punto 9 - Vaciar carrito
// El botón "Vaciar carrito" elimina todos los productos del carrito y del LocalStorage.
// Luego actualiza la interfaz mostrando que el carrito está vacío.

function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem("carrito");
    mostrarCarrito();
}

// Eliminar individual
function eliminarProducto(id) {
    carrito = carrito.filter(p => p.id !== id);
    guardarCarritoEnLocalStorage();
    mostrarCarrito();
}

function restarItemDelCarrito(id) {
    const item = carrito.find(p => p.id === id);
    if (!item) return;

    if (item.cantidad > 1) {
        item.cantidad--;
    } else {
        carrito = carrito.filter(p => p.id !== id);
    }

    guardarCarritoEnLocalStorage();
    mostrarCarrito();
}

// Fin punto 9


// INIT - Iniciar toda la lógica
// La función init se ejecuta apenas carga la página.
// Llama a todas las funciones necesarias para inicializar la tienda:
// - Muestra los datos del alumno
// - Carga productos y carrito desde memoria
// - Muestra productos y permite filtrar y ordenar
// - Conecta todos los botones del HTML con sus funciones correspondientes

function init() {
    imprimirDatosAlumno(); // Punto 2
    carrito = cargarCarritoDesdeLocalStorage(); // Punto 6
    mostrarCarrito(); // Punto 5
    mostrarProductos(listaFrutas); // Punto 3
    aplicarFiltro(); // Punto 4
  
    // Punto 8 - ordenar
    document.querySelector("#btn-ordenar-nombre").addEventListener("click", ordenarPorNombre);
    document.querySelector("#btn-ordenar-precio").addEventListener("click", ordenarPorPrecio);
  
    // Punto 9 - vaciar
    document.querySelector("#btn-vaciar-carrito").addEventListener("click", vaciarCarrito);
  }
  
  window.addEventListener("DOMContentLoaded", init);