// Carrito de compras
let carrito = [];
let products = []; // Almacena todos los productos obtenidos de la API
const API_URL = 'https://fakestoreapi.com/products'; 

async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    products = await response.json();
    renderProducts(products);

    // Asignar eventos a categorías después de cargar los productos
    setupCategoryFilters();
    setupSortListeners();
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
    card.dataset.id = product.id;

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <div class="producto-detalles-info">
        <h3>${product.title}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <p>- Categoría: ${product.category}</p>
        <p>- Descripción: ${product.description.substring(0, 60)}...</p>
        <button class="producto-detalles-agregar">Añadir al carrito</button>
      </div>
    `;

    container.appendChild(card);
  });

  addAddToCartListeners();
}

function addAddToCartListeners() {
  document.querySelectorAll('.producto-detalles-agregar').forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.producto-detalles-card');
      const productId = parseInt(card.dataset.id);
      const product = products.find(p => p.id === productId);

      addToCart(product);
    });
  });
}

function addToCart(product) {
  const existingItem = carrito.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    carrito.push({ ...product, quantity: 1 });
  }

  updateCart();
}

function updateCart() {
  const cartItemsDiv = document.querySelector('.carrito-items');
  cartItemsDiv.innerHTML = '';
  let total = 0;

  carrito.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'carrito-item';

    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.title}" style="width: 40px; height: 40px;">
      <div>${item.title}</div>
      <div>
        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
        <span class="carrito-item-quantity">${item.quantity}</span>
        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
      </div>
      <span class="carrito-item-remove" data-id="${item.id}">X</span>
    `;

    cartItemsDiv.appendChild(itemDiv);
    total += item.price * item.quantity;
  });

  document.querySelector('.cart-count').textContent = carrito.length;
  document.querySelector('.carrito-total').textContent = `Total: $${total.toFixed(2)}`;
  saveCartToLocalStorage();
}

// Eliminar del carrito
document.querySelector('.carrito-items')?.addEventListener('click', (e) => {
  if (e.target.classList.contains('carrito-item-remove')) {
    const itemId = e.target.dataset.id;
    carrito = carrito.filter(item => item.id !== parseInt(itemId));
    updateCart();
  }

  if (e.target.classList.contains('quantity-btn')) {
    const action = e.target.dataset.action;
    const itemId = parseInt(e.target.dataset.id);
    const item = carrito.find(i => i.id === itemId);

    if (item) {
      if (action === 'increase') item.quantity++;
      if (action === 'decrease' && item.quantity > 1) item.quantity--;

      updateCart();
    }
  }
});

// Filtros por categoría
function setupCategoryFilters() {
  const categories = [...new Set(products.map(p => p.category))];

  document.querySelectorAll('.categoria h3').forEach(categoryElement => {
    const category = categoryElement.textContent.trim();
    categoryElement.style.cursor = 'pointer';
    categoryElement.addEventListener('click', () => {
      const filtered = products.filter(p => p.category === category);
      renderProducts(filtered);
    });
  });
}

// Ordenamiento
function setupSortListeners() {
  const sortSelect = document.getElementById('sortSelect');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', () => {
    const sortBy = sortSelect.value;
    let sorted = [...products];

    switch (sortBy) {
      case 'price_asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name_desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        sorted = products;
    }

    renderProducts(sorted);
  });
}

// Abrir/cerrar carrito lateral
document.querySelector('.carrito-icon')?.addEventListener('click', () => {
  document.querySelector('.carrito-lateral').classList.toggle('open');
});
document.querySelector('.close-cart')?.addEventListener('click', () => {
  document.querySelector('.carrito-lateral').classList.remove('open');
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
    alert('Gracias por tu compra. ¡El pago ha sido procesado!');
    carrito = [];
    updateCart();
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