//Punto 1 = array de frutas
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

//Punto 2 - mostrar nombre y apellido
function imprimirDatosAlumno() {
    const alumno = {
        dni: 42346609,
        nombre: "Joaquin",
        apellido: "Messina"
    };

    // Consola
    console.log(`Alumno: ${alumno.nombre} ${alumno.apellido} - DNI: ${alumno.dni}`);

    // HTML
    const divNombre = document.querySelector(".nombreAlumno");
    divNombre.textContent = `${alumno.nombre} ${alumno.apellido}`;
}

//fin punto 2

//punto 3 mostrar productos en pantalla
function mostrarProductos(productos) {
    const contenedor = document.querySelector(".contenedor-productos");
    contenedor.innerHTML = "";

    productos.forEach(fruta => {
        contenedor.innerHTML += `
            <div class="card-producto">
                <img src="${fruta.img}" alt="${fruta.nombre}">
                <h3>${fruta.nombre}</h3>
                <p>$${fruta.precio}</p>
                <button data-id="${fruta.id}" class="btn-agregar-carrito">Agregar al carrito</button>
            </div>`;
    });

    // Asociar eventos a botones de agregar
    document.querySelectorAll(".btn-agregar-carrito").forEach(btn => {
        btn.addEventListener("click", () => agregarAlCarrito(parseInt(btn.dataset.id)));
    });
}

//fin punto 3

//inicio punto 8 ordenado por nombre y por precio

function ordenarPorNombre() {
    const ordenado = [...listaFrutas].sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
    );

    mostrarProductos(ordenado);
}

function ordenarPorPrecio() {
    const ordenado = [...listaFrutas].sort((a, b) => a.precio - b.precio);
    mostrarProductos(ordenado);
}

//fin punto 8


//punto 4 filtrado de productos
function aplicarFiltro() {
    const input = document.querySelector(".barra-busqueda");
    input.addEventListener("input", () => {
      const texto = input.value.toLowerCase();
      const filtrados = listaFrutas.filter(fruta => fruta.nombre.toLowerCase().includes(texto));
      mostrarProductos(filtrados);
    });
  }
//fin punto 4

//punto 5 funcionalidad carrito + mostrar carrito + eliminar carrito

let carrito = [];

function agregarAlCarrito(id) {
    const producto = listaFrutas.find(p => p.id === id);
    const enCarrito = carrito.find(p => p.id === id);
  
    if (enCarrito) {
      enCarrito.cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    guardarCarritoEnLocalStorage(); //punto 6
    mostrarCarrito();
  }
  

function mostrarCarrito() {
    const contenedor = document.querySelector("#items-carrito");
    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>No hay elementos en el carrito.</p>";
        document.querySelector("#precio-total").textContent = "$0";
        actualizarContadorCarrito();
        return;
    }

    carrito.forEach(producto => {
        const li = document.createElement("li");
        li.classList.add("bloque-item");

        const nombrePrecio = document.createElement("p");
        nombrePrecio.classList.add("nombre-item");
        nombrePrecio.textContent = `${producto.nombre} - $${producto.precio * producto.cantidad}`;

        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("boton-eliminar");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", () => eliminarProducto(producto.id));

        li.appendChild(nombrePrecio);
        li.appendChild(btnEliminar);
        contenedor.appendChild(li);
    });

    actualizarContadorCarrito();
    actualizarTotal();
}

function eliminarProducto(id) {
    carrito = carrito.filter(p => p.id !== id);
    guardarCarritoEnLocalStorage(); // idem, actualizada la funcion con aparicion del punto 6
    mostrarCarrito();
}

//fin punto 5

//punto 6 Sincronizacion con localstorage

function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
    const data = localStorage.getItem("carrito");
    return data ? JSON.parse(data) : [];
}

//fin punto 6

//inicio punto 7 contador y precio total

function actualizarContadorCarrito() {
    const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    document.querySelector("#contador-carrito").textContent = totalProductos;
  }
  
  function actualizarTotal() {
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    document.querySelector("#precio-total").textContent = `$${total}`;
  }
  
//fin punto 7

//inicio punto 9
function vaciarCarrito() {
    localStorage.removeItem("carrito");
    carrito = [];
    mostrarCarrito();
}

//fin punto 9

function init() {
    imprimirDatosAlumno();
    carrito = cargarCarritoDesdeLocalStorage(); // actualizado al aparecere punto 6
    mostrarCarrito(); //idem al aparecer punto
    mostrarProductos(listaFrutas);
    aplicarFiltro();
    document.querySelector("#ordenar-nombre").addEventListener("click", ordenarPorNombre);
    document.querySelector("#ordenar-precio").addEventListener("click", ordenarPorPrecio);
    document.getElementById("btn-vaciar-carrito").addEventListener("click", vaciarCarrito);

}

window.addEventListener("DOMContentLoaded", init);