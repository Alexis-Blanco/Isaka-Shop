let productos = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || {};
let historialCompras = JSON.parse(localStorage.getItem('historialCompras')) || [];

const contenedorProductos = document.getElementById('productosGrid');
const contenedorCarrito = document.querySelector('.carrito-items');
const totalCarrito = document.querySelector('.carrito-total');
const contadorCarrito = document.querySelectorAll('.cart-count');
const carritoLateral = document.querySelector('.carrito-lateral');
const botonCerrarCarrito = document.querySelector('.close-cart');
const botonFiltro = document.getElementById('sortSelect');
const botonesCategorias = document.querySelectorAll('.categoria');
const checkoutBtn = document.getElementById('checkoutBtn');
const verComprasAnterioresBtn = document.getElementById('verComprasAnteriores');
const historialComprasLateral = document.getElementById('historialComprasLateral');
const cerrarHistorialBtn = document.getElementById('cerrarHistorial');
const historialItems = document.getElementById('historialItems');

function mostrarHeroProduct() {
  const hero = document.getElementById('hero');
  const heroContent = document.createElement('div');
  heroContent.classList.add('hero-content');

  const heroTitle = document.createElement('h1');
  heroTitle.textContent = 'Monitor Gamer Samsung 49"';
  heroContent.appendChild(heroTitle);

  const heroDescription = document.createElement('p');
  heroDescription.textContent = 'Pantalla curva ultrawide 144Hz';
  heroContent.appendChild(heroDescription);

  const buyNowBtn = document.createElement('a');
  buyNowBtn.href = '#productos';
  buyNowBtn.classList.add('btn');
  buyNowBtn.textContent = 'Comprar ahora';
  heroContent.appendChild(buyNowBtn);

  const heroImage = document.createElement('img');
  heroImage.src = 'https://images.unsplash.com/photo-1681912818658-57e5438fcd3e?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  heroImage.alt = 'Monitor Gamer Samsung 49 pulgadas';
  heroImage.classList.add('hero-image');

  hero.appendChild(heroContent);
  hero.appendChild(heroImage);
}

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
  contenedorProductos.textContent = '';
  lista.forEach(producto => {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('producto-card');

    const imagen = document.createElement('img');
    imagen.src = producto.image;
    imagen.alt = producto.title;
    tarjeta.appendChild(imagen);

    const infoProducto = document.createElement('div');
    infoProducto.classList.add('producto-info');

    const titulo = document.createElement('h3');
    titulo.textContent = producto.title;
    infoProducto.appendChild(titulo);

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.textContent = `$${producto.price}`;
    infoProducto.appendChild(precio);

    const categoria = document.createElement('p');
    categoria.classList.add('categoria');
    categoria.textContent = producto.category;
    infoProducto.appendChild(categoria);

    const botonAgregar = document.createElement('button');
    botonAgregar.dataset.id = producto.id;
    botonAgregar.textContent = 'Agregar al carrito';
    infoProducto.appendChild(botonAgregar);

    tarjeta.appendChild(infoProducto);
    contenedorProductos.appendChild(tarjeta);
  });
}

function actualizarCarrito() {
  contenedorCarrito.textContent = '';
  let total = 0;
  let cantidadTotal = 0;
  for (let id in carrito) {
    const item = carrito[id];
    total += item.precio * item.cantidad;
    cantidadTotal += item.cantidad;

    const div = document.createElement('div');
    div.classList.add('carrito-item');

    const img = document.createElement('img');
    img.src = item.imagen;
    img.alt = item.nombre;
    div.appendChild(img);

    const info = document.createElement('div');
    info.classList.add('carrito-item-info');

    const nombreP = document.createElement('p');
    nombreP.textContent = item.nombre;
    info.appendChild(nombreP);

    const precioP = document.createElement('p');
    precioP.textContent = `$${item.precio}`;
    info.appendChild(precioP);
    div.appendChild(info);

    const controls = document.createElement('div');
    controls.classList.add('carrito-item-controls');

    const btnMenos = document.createElement('button');
    btnMenos.classList.add('quantity-btn');
    btnMenos.textContent = '-';
    btnMenos.onclick = () => cambiarCantidad(id, -1);
    controls.appendChild(btnMenos);

    const cantidadSpan = document.createElement('span');
    cantidadSpan.textContent = item.cantidad;
    controls.appendChild(cantidadSpan);

    const btnMas = document.createElement('button');
    btnMas.classList.add('quantity-btn');
    btnMas.textContent = '+';
    btnMas.onclick = () => cambiarCantidad(id, 1);
    controls.appendChild(btnMas);

    const btnQuitar = document.createElement('button');
    btnQuitar.classList.add('remove-item');
    btnQuitar.textContent = '×';
    btnQuitar.onclick = () => quitarDelCarrito(id);
    controls.appendChild(btnQuitar);

    div.appendChild(controls);
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

function guardarCompra() {
  if (Object.keys(carrito).length === 0) {
    alert('El carrito está vacío. Agregue productos antes de comprar.');
    return;
  }

  const compraActual = {
    fecha: new Date().toLocaleString(),
    productos: Object.values(carrito)
  };
  historialCompras.push(compraActual);
  localStorage.setItem('historialCompras', JSON.stringify(historialCompras));

  carrito = {};
  actualizarCarrito();
  alert('¡Compra realizada con éxito!');
  carritoLateral.classList.remove('open');
}

function renderizarHistorialCompras() {
  historialItems.textContent = '';
  if (historialCompras.length === 0) {
    const mensaje = document.createElement('p');
    mensaje.textContent = 'No hay compras anteriores.';
    historialItems.appendChild(mensaje);
    return;
  }

  historialCompras.forEach((compra, index) => {
    const divCompra = document.createElement('div');
    divCompra.classList.add('historial-item');

    const tituloCompra = document.createElement('h4');
    tituloCompra.textContent = `Compra #${index + 1} - ${compra.fecha}`;
    divCompra.appendChild(tituloCompra);

    compra.productos.forEach(producto => {
      const pProducto = document.createElement('p');
      pProducto.textContent = `${producto.nombre} x ${producto.cantidad} - $${(producto.precio * producto.cantidad).toFixed(2)}`;
      divCompra.appendChild(pProducto);
    });
    historialItems.appendChild(divCompra);
  });
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

checkoutBtn.addEventListener('click', guardarCompra);

verComprasAnterioresBtn.addEventListener('click', () => {
  renderizarHistorialCompras();
  historialComprasLateral.classList.add('open');
});

cerrarHistorialBtn.addEventListener('click', () => {
  historialComprasLateral.classList.remove('open');
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

document.querySelector('.logo').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
});

mostrarHeroProduct();
obtenerProductos();
actualizarCarrito();