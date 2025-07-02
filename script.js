let productos = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || {};
let comprasAnteriores = JSON.parse(localStorage.getItem('comprasAnteriores')) || [];

const contenedorProductos = document.getElementById('productosGrid');
const contenedorCarrito = document.querySelector('.carrito-items');
const totalCarrito = document.querySelector('.carrito-total');
const contadorCarrito = document.querySelectorAll('.cart-count');
const carritoLateral = document.querySelector('.carrito-lateral');
const botonCerrarCarrito = document.querySelector('.close-cart');
const botonFiltro = document.getElementById('sortSelect');
const botonesCategorias = document.querySelectorAll('.categoria');
const checkoutBtn = document.getElementById('checkoutBtn');
const verComprasAnterioresBtn = document.getElementById('verComprasAnterioresBtn');
const modalComprasAnteriores = document.getElementById('modalComprasAnteriores');
const cerrarModalCompras = document.getElementById('cerrarModalCompras');
const historialComprasContenido = document.getElementById('historialComprasContenido');

function mostrarHeroProduct() {
  const hero = document.getElementById('hero');

  const heroContent = document.createElement('div');
  heroContent.classList.add('hero-content');

  const h1 = document.createElement('h1');
  h1.id = 'hero-title';
  h1.textContent = 'Enciende tu juego';
  heroContent.appendChild(h1);

  const p = document.createElement('p');
  p.id = 'hero-description';
  p.textContent = 'Monitor 8K';
  heroContent.appendChild(p);

  const a = document.createElement('a');
  a.href = '#productos';
  a.classList.add('btn');
  a.textContent = 'Comprar ahora';
  heroContent.appendChild(a);

  const img = document.createElement('img');
  img.src = 'https://images.unsplash.com/photo-1681912818658-57e5438fcd3e?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  img.alt = 'Monitor Gamer Samsung 49 pulgadas';
  img.classList.add('hero-image');

  hero.appendChild(heroContent);
  hero.appendChild(img);
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

    const img = document.createElement('img');
    img.src = producto.image;
    img.alt = producto.title;
    tarjeta.appendChild(img);

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('producto-info');

    const h3 = document.createElement('h3');
    h3.textContent = producto.title;
    infoDiv.appendChild(h3);

    const precioP = document.createElement('p');
    precioP.classList.add('precio');
    precioP.textContent = `$${producto.price}`;
    infoDiv.appendChild(precioP);

    const categoriaP = document.createElement('p');
    categoriaP.classList.add('categoria');
    categoriaP.textContent = producto.category;
    infoDiv.appendChild(categoriaP);

    const botonAgregar = document.createElement('button');
    botonAgregar.dataset.id = producto.id;
    botonAgregar.textContent = 'Agregar al carrito';
    infoDiv.appendChild(botonAgregar);

    tarjeta.appendChild(infoDiv);
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

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('carrito-item-info');
    const nombreP = document.createElement('p');
    nombreP.textContent = item.nombre;
    infoDiv.appendChild(nombreP);
    const precioP = document.createElement('p');
    precioP.textContent = `$${item.precio}`;
    infoDiv.appendChild(precioP);
    div.appendChild(infoDiv);

    const controlsDiv = document.createElement('div');
    controlsDiv.classList.add('carrito-item-controls');

    const btnMenos = document.createElement('button');
    btnMenos.classList.add('quantity-btn');
    btnMenos.textContent = '-';
    btnMenos.onclick = () => cambiarCantidad(id, -1);
    controlsDiv.appendChild(btnMenos);

    const spanCantidad = document.createElement('span');
    spanCantidad.textContent = item.cantidad;
    controlsDiv.appendChild(spanCantidad);

    const btnMas = document.createElement('button');
    btnMas.classList.add('quantity-btn');
    btnMas.textContent = '+';
    btnMas.onclick = () => cambiarCantidad(id, 1);
    controlsDiv.appendChild(btnMas);

    const btnRemover = document.createElement('button');
    btnRemover.classList.add('remove-item');
    btnRemover.textContent = '×';
    btnRemover.onclick = () => quitarDelCarrito(id);
    controlsDiv.appendChild(btnRemover);

    div.appendChild(controlsDiv);
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
    alert('El carrito está vacío. Agrega productos antes de comprar.');
    return;
  }

  const fechaActual = new Date().toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const compra = {
    fecha: fechaActual,
    items: { ...carrito }
  };

  comprasAnteriores.push(compra);
  localStorage.setItem('comprasAnteriores', JSON.stringify(comprasAnteriores));

  carrito = {};
  actualizarCarrito();
  carritoLateral.classList.remove('open');
  alert('¡Compra realizada con éxito!');
}

function mostrarComprasAnteriores() {
  historialComprasContenido.textContent = '';
  if (comprasAnteriores.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No hay compras anteriores registradas.';
    historialComprasContenido.appendChild(p);
  } else {
    comprasAnteriores.forEach((compra, index) => {
      const divCompra = document.createElement('div');
      divCompra.classList.add('compra-anterior-item');

      const fechaP = document.createElement('p');
      fechaP.textContent = `Fecha: ${compra.fecha}`;
      divCompra.appendChild(fechaP);

      const ulItems = document.createElement('ul');
      for (const itemId in compra.items) {
        const item = compra.items[itemId];
        const li = document.createElement('li');
        li.textContent = `${item.nombre} - Cantidad: ${item.cantidad} - Precio: $${item.precio.toFixed(2)}`;
        ulItems.appendChild(li);
      }
      divCompra.appendChild(ulItems);
      historialComprasContenido.appendChild(divCompra);
    });
  }
  modalComprasAnteriores.style.display = 'block';
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

verComprasAnterioresBtn.addEventListener('click', mostrarComprasAnteriores);

cerrarModalCompras.addEventListener('click', () => {
  modalComprasAnteriores.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target == modalComprasAnteriores) {
    modalComprasAnteriores.style.display = 'none';
  }
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