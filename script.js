// Variables globales
let productos = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || {};

const contenedorProductos = document.getElementById('productosGrid');
const contenedorCarrito = document.querySelector('.carrito-items');
const totalCarrito = document.querySelector('.carrito-total');
const contadorCarrito = document.querySelectorAll('.cart-count');
const carritoLateral = document.querySelector('.carrito-lateral');
const botonCerrarCarrito = document.querySelector('.close-cart');
const botonFiltro = document.getElementById('sortSelect');
const botonesCategorias = document.querySelectorAll('.categoria');

// Mostrar producto en el hero (pantalla o tecnología)
function mostrarHeroProduct() {
  const hero = document.getElementById('hero');
  hero.innerHTML = `
    <div class="hero-content">
      <h1>Monitor Gamer Samsung 49"</h1>
      <p>Pantalla curva ultrawide 144Hz</p>
      <a href="#productos" class="btn">Comprar ahora</a>
    </div>
    <img src="https://images.unsplash.com/photo-1681912818658-57e5438fcd3e?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
         alt="Monitor Gamer Samsung 49 pulgadas" 
         class="hero-image">
  `;
}

// Obtener productos y renderizar
async function obtenerProductos() {
  try {
    const respuesta = await fetch('https://fakestoreapi.com/products');   
    productos = await respuesta.json();
    renderizarProductos(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
  }
}

function renderizarProductos(lista) {
  contenedorProductos.innerHTML = '';
  lista.forEach(producto => {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('producto-card');
    tarjeta.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}">
      <div class="producto-info">
        <h3>${producto.title}</h3>
        <p class="precio">$${producto.price}</p>
        <p class="categoria">${producto.category}</p>
        <button data-id="${producto.id}">Agregar al carrito</button>
      </div>
    `;
    contenedorProductos.appendChild(tarjeta);
  });
}

function actualizarCarrito() {
  contenedorCarrito.innerHTML = '';
  let total = 0;
  let cantidadTotal = 0;
  for (let id in carrito) {
    const item = carrito[id];
    total += item.precio * item.cantidad;
    cantidadTotal += item.cantidad;

    const div = document.createElement('div');
    div.classList.add('carrito-item');
    div.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}">
      <div class="carrito-item-info">
        <p>${item.nombre}</p>
        <p>$${item.precio}</p>
      </div>
      <div class="carrito-item-controls">
        <button class="quantity-btn" onclick="cambiarCantidad(${id}, -1)">-</button>
        <span>${item.cantidad}</span>
        <button class="quantity-btn" onclick="cambiarCantidad(${id}, 1)">+</button>
        <button class="remove-item" onclick="quitarDelCarrito(${id})">&times;</button>
      </div>
    `;
    contenedorCarrito.appendChild(div);
  }
  totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
  contadorCarrito.forEach(el => el.textContent = cantidadTotal);
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cambiarCantidad(id, cantidad) {
  if (!carrito[id]) return;
  carrito[id].cantidad += cantidad;
  if (carrito[id].cantidad <= 0) {
    delete carrito[id];
  }
  actualizarCarrito();
}

function quitarDelCarrito(id) {
  delete carrito[id];
  actualizarCarrito();
}

contenedorProductos.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const id = e.target.dataset.id;
    const producto = productos.find(p => p.id == id);
    if (!carrito[id]) {
      carrito[id] = {
        nombre: producto.title,
        precio: producto.price,
        imagen: producto.image,
        cantidad: 1
      };
    } else {
      carrito[id].cantidad++;
    }
    actualizarCarrito();
  }
});

botonCerrarCarrito.addEventListener('click', () => {
  carritoLateral.classList.remove('open');
});

document.querySelector('.carrito-icon').addEventListener('click', () => {
  carritoLateral.classList.toggle('open');
});


botonFiltro.addEventListener('change', () => {
  const opcion = botonFiltro.value;
  let listaFiltrada = [...productos];

  switch (opcion) {
    case 'price_asc':
      listaFiltrada.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      listaFiltrada.sort((a, b) => b.price - a.price);
      break;
    case 'name_asc':
      listaFiltrada.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'name_desc':
      listaFiltrada.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'name_fav':
      listaFiltrada.sort((a, b) => {
        const isAFav = carrito[a.id] ? 1 : 0;
        const isBFav = carrito[b.id] ? 1 : 0;
        return isBFav - isAFav; // Favoritos primero
      });
      break;
  }

  renderizarProductos(listaFiltrada);
});

botonesCategorias.forEach(boton => {
  boton.addEventListener('click', () => {
    const categoria = boton.dataset.categoria;
    if (categoria === 'all') {
      renderizarProductos(productos);
    } else {
      const filtrados = productos.filter(p => p.category === categoria);
      renderizarProductos(filtrados);
    }
  });
});

// Scroll al hero al hacer clic en el logo
document.querySelector('.logo').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
});

// Inicialización
mostrarHeroProduct();
obtenerProductos();
actualizarCarrito();
