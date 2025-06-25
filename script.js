// Smooth Scroll con GSAP
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      gsap.to(window, { duration: 1, scrollTo: target });
    }
  });
});

// Animación al hacer scroll
const faders = document.querySelectorAll(".fade-in");

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2
});

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

// Menú móvil
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  document.querySelector('.menu').classList.toggle('active');
});

// Carrito de compras
let carrito = [];
let products = []; // Almacena todos los productos obtenidos de la API
const API_URL = 'https://fakestoreapi.com/products';
   

async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error('Error al cargar los productos:', error);
  }
}

function renderProducts(productList) {
  const container = document.getElementById('productosGrid');
  container.innerHTML = '';

  if (productList.length === 0) {
    container.innerHTML = '<p>No se encontraron productos.</p>';
    return;
  }

  productList.forEach(product => {
    const card = document.createElement('div');
    card.className = 'producto-detalles-card';

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <div class="producto-detalles-info">
        <h3 class="producto-detalles-titulo">${product.title}</h3>
        <p class="producto-detalles-precio">$${product.price.toFixed(2)}</p>
        <p class="producto-detalles-especificaciones">
          - Categoría: ${product.category}<br>
          - Descripción: ${product.description.substring(0, 60)}...
        </p>
        <button class="producto-detalles-agregar" data-id="${product.id}">Añadir al carrito</button>
      </div>
    `;

    container.appendChild(card);
  });

  addAddToCartListeners();
}

function addAddToCartListeners() {
  document.querySelectorAll('.producto-detalles-agregar').forEach(button => {
    button.addEventListener('click', () => {
      const productId = parseInt(button.getAttribute('data-id'));
      const product = products.find(p => p.id === productId);

      if (!product) return;

      const existingItem = carrito.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        carrito.push({ ...product, quantity: 1 });
      }

      updateCart();
    });
  });
}

function updateCart() {
  const cartItemsDiv = document.querySelector('.carrito-items');
  cartItemsDiv.innerHTML = '';
  let total = 0;

  carrito.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'carrito-item';
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div>${item.title}</div>
      <div class="carrito-item-quantity">${item.quantity}</div>
      <span class="carrito-item-remove" data-id="${item.id}">X</span>
    `;
    cartItemsDiv.appendChild(itemDiv);

    total += item.price * item.quantity;
  });

  document.querySelector('.cart-count').textContent = carrito.length;
  document.querySelector('.carrito-total').textContent = `Total: $${total.toFixed(2)}`;
  saveCartToLocalStorage();
}

// Abrir/cerrar carrito lateral
document.querySelector('.carrito-icon')?.addEventListener('click', () => {
  document.querySelector('.carrito-lateral').classList.toggle('open');
});
document.querySelector('.close-cart')?.addEventListener('click', () => {
  document.querySelector('.carrito-lateral').classList.remove('open');
});

// Eventos de eliminar del carrito
document.querySelector('.carrito-items')?.addEventListener('click', (e) => {
  if (e.target.classList.contains('carrito-item-remove')) {
    const itemId = e.target.dataset.id;
    carrito = carrito.filter(item => item.id !== parseInt(itemId));
    updateCart();
  }
});

// Botón de checkout simulado
document.querySelector('.checkout-btn')?.addEventListener('click', () => {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }

  let resumen = 'Resumen de tu compra:\n\n';
  carrito.forEach(item => {
    resumen += `${item.title} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}\n`;
  });
  resumen += `\nTotal: $${carrito.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}`;

  const confirmar = confirm(resumen + '\n\n¿Deseas proceder al pago?');

  if (confirmar) {
    const nombre = prompt('Ingresa tu nombre:');
    const email = prompt('Ingresa tu correo electrónico:');
    const direccion = prompt('Ingresa tu dirección de envío:');
    const metodoPago = prompt('Elige tu método de pago (Efectivo, Tarjeta, PayPal):');

    if (nombre && email && direccion && metodoPago) {
      alert(`Gracias por tu compra, ${nombre}!\nPago realizado con: ${metodoPago}`);
      carrito = [];
      updateCart();
    } else {
      alert('Compra cancelada. Todos los campos son obligatorios.');
    }
  }
});

// Funciones de persistencia
function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(carrito));
}

function loadCartFromLocalStorage() {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    carrito = JSON.parse(storedCart);
    updateCart();
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts(); // Cargar productos desde la API
  loadCartFromLocalStorage(); // Recuperar carrito del localStorage
});

