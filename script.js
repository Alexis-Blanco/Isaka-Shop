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

