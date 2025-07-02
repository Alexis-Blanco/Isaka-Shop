---

# 📊 Análisis de Diseño - Isaka Shop

## 📝 Descripción General

Isaka Shop es una tienda online minimalista diseñada con un enfoque moderno, elegante y funcional. Utiliza la API pública [FakeStoreAPI](https://fakestoreapi.com) para obtener productos reales y mostrarlos dinámicamente. La interfaz está pensada para ofrecer una experiencia fluida de navegación, filtrado inteligente, y gestión del carrito intuitiva, todo ello con un estilo visual coherente y accesible.

---

## 💡 Decisiones de Diseño de Interfaz

### 1. 🧱 Layout y Estructura

- **Decisión**: Uso de secciones claramente definidas: Hero, Categorías, Filtro, Productos, Contacto y Footer.
- **Justificación**: Permite al usuario navegar fácilmente por cada parte del sitio sin perder contexto.
- **Beneficio**: Mejora la usabilidad y facilita el descubrimiento de contenido.

- **Decisión**: Carrito lateral desplegable
- **Justificación**: Mantiene la navegación principal intacta mientras se revisa o modifica el carrito.
- **Beneficio**: Reduce interrupciones y mejora la percepción de control del usuario.

### 2. 🎨 Sistema de Colores

- **Paleta Seleccionada**:
  - Primario: #00ffea (Cian brillante)
  - Secundario: #00cccc (Cian suave)
  - Fondo: #111 (gris oscuro)
  - Éxito: #00ffea (acciones positivas)
  - Peligro: #ff4d4d (acciones destructivas)

- **Justificación**:
  - El cian contrasta bien con el fondo oscuro y transmite modernidad y energía.
  - Los colores son consistentes con una estética tecnológica y juvenil.
  - Alto contraste mejora la accesibilidad visual.

### 3. 🔤 Tipografía y Jerarquía Visual

- **Decisión**: Fuente `Montserrat` para el logo, `Segoe UI` para el cuerpo.
- **Justificación**: `Montserrat` ofrece un estilo limpio y moderno ideal para marcas digitales.
- **Beneficio**: Mejora la legibilidad y refuerza la identidad visual del sitio.

- **Decisión**: Jerarquía visual clara con tamaños diferenciados:
  - Títulos grandes en hero y secciones
  - Texto base legible
  - Botones destacados visualmente

- **Justificación**: Guía la atención del usuario y reduce la carga cognitiva.
- **Beneficio**: Mejora la usabilidad y facilita la navegación intuitiva.

---

## 👥 Experiencia de Usuario (UX)

### 1. 🚶 Flujo de Navegación

**Flujo Principal:**
1. Explorar categorías →  
2. Filtrar u ordenar productos →  
3. Agregar al carrito →  
4. Ver total y continuar compra

**Optimizaciones:**
- Scroll suave entre secciones
- Acceso rápido al carrito desde header
- Feedback inmediato al agregar/quitar productos

**Feedback Visual:**
- Resaltado de categoría seleccionada
- Cambios visuales al interactuar con botones
- Contador de productos en carrito visible

### 2. 🛒 Gestión del Carrito

**Decisión**: Carrito lateral con edición inline
- **Justificación**: Permite modificar cantidades y eliminar elementos sin abandonar la página.
- **Beneficio**: Mayor control del usuario sobre su carrito.

**Funcionalidades Clave:**
- Añadir productos con un solo clic
- Modificar cantidad (+/-)
- Eliminar productos individualmente
- Limpiar carrito completo
- Total calculado automáticamente
- Persistencia mediante `localStorage`

### 3. 🔍 Sistema de Filtros y Ordenamiento

**Filtros Implementados:**
- Por categoría (`men's clothing`, `women's clothing`, `jewelery`, `electronics`)
- Opción "Ver todos"

**Ordenamientos Disponibles:**
- Precio ascendente/descendente
- Nombre A-Z/Z-A
- Por defecto

**Justificación**:
- Las categorías cubren las disponibles en FakeStoreAPI.
- El ordenamiento sigue patrones comunes en e-commerce.
- Estas opciones permiten exploración eficiente del catálogo.

**Feedback Visual:**
- Categorías resaltadas al ser seleccionadas
- Iconos de flecha indicando tipo de ordenamiento
- Actualización instantánea del catálogo

---

## 🗃️ Estructura de Datos

### 1. 🧠 Estado Global del Proyecto

```javascript
let productos = []; // Almacena los productos obtenidos de la API
let carrito = {};   // Objeto indexado por ID con info del producto y cantidad
```

**Justificación**:
- `productos`: permite aplicar filtros y ordenamientos localmente sin hacer nuevas llamadas a la API.
- `carrito`: estructura optimizada para acceso rápido, usando ID como clave.

### 2. 📦 Estructura del Carrito

```javascript
carrito = {
  [idProducto]: {
    nombre: String,
    precio: Number,
    imagen: String,
    cantidad: Number
  }
}
```

**Justificación**:
- Incluye toda la información necesaria para renderizar el carrito sin recargar datos.
- Facilita operaciones de suma, resta y eliminación rápida.

### 3. 💾 Persistencia de Datos

**Implementación**:
- `localStorage.setItem('carrito', JSON.stringify(carrito))`
- Recuperación automática al cargar la página

**Justificación**:
- Mejora la experiencia del usuario manteniendo el estado del carrito tras recargar.
- Evita frustración por pérdida accidental de productos seleccionados.

---

## 🔍 Decisiones de Filtros y Ordenamiento

### 1. 📁 Filtros por Categoría

**Implementación**: Tarjetas interactivas con imágenes y nombres de categoría.
- **Justificación**: Ofrece feedback visual inmediato y hace más atractivo el proceso de selección.
- **Beneficio**: Mejora la usabilidad y facilita la navegación temática.

### 2. 📊 Ordenamiento

**Opciones Disponibles**:
- Precio ascendente/descendente
- Nombre A-Z/Z-A
- Por defecto

**Justificación**:
- Cubre las formas más comunes en las que los usuarios organizan productos.
- Mejora la usabilidad y reduce la sobrecarga cognitiva.

### 3. ✅ Búsqueda (opcional sugerida)

**Posible Futura Implementación**:
- Campo de búsqueda con debounce
- Filtrado por título y descripción

**Justificación**:
- Ayudaría a usuarios que buscan un producto específico.
- Reduciría el tiempo necesario para encontrar artículos.

---

## ♿ Consideraciones de Accesibilidad

### 1. 🎮 Navegación por Teclado
- Todos los elementos interactivos son accesibles con tabulador
- Indicadores de foco visibles
- Cerrar carrito con tecla Escape

### 2. 🌈 Contraste y Legibilidad
- Colores con alto contraste (WCAG AA)
- Tamaño de fuente mínimo de 16px
- No usar color como único medio de comunicación

### 3. 🧠 Semántica HTML
- Uso correcto de etiquetas semánticas (`header`, `section`, `footer`, etc.)
- Atributos `alt` en todas las imágenes
- Estructura lógica de encabezados

---

## 📱 Responsive Design

### 1. 📏 Breakpoints

- **Desktop**: > 900px (3 columnas)
- **Tablet**: 600px - 900px (2 columnas)
- **Mobile**: < 600px (1 columna)

### 2. 📲 Adaptaciones Móviles

- Carrito oculto por defecto y desplegable
- Botones redimensionados para tacto
- Imágenes optimizadas y centradas
- Navegación simplificada en móvil

---

## ⚡ Optimizaciones de Rendimiento

### 1. 🖼️ Carga de Imágenes

- Uso de `object-fit: cover` para evitar deformaciones
- Imágenes cargadas directamente desde la API con tamaño controlado

### 2. 🧹 Gestión de Estado

- Reutilización de lista original para filtrados
- No se realizan múltiples llamadas a la API

### 3. 🎞️ Animaciones

- Transiciones suaves en hover y active
- Scroll suave entre secciones
- Respeto por preferencias de usuario (`prefers-reduced-motion`)

---

## 🧩 Posibles Mejoras Futuras

| Mejora | Descripción |
|-------|-------------|
| Carrusel en Hero | Mostrar varias imágenes destacadas rotando automáticamente. |
| Búsqueda por texto | Agregar campo de búsqueda para encontrar productos por nombre o categoría. |
| Notificaciones | Mostrar mensajes tipo toast al agregar/quitar productos del carrito. |
| Guardar filtros | Mantener la última categoría seleccionada o el ordenamiento tras recargar la página. |
| Checkout simulado | Agregar una pantalla de pago simulada con formulario básico. |

---

## ✅ Conclusiones

El diseño de Isaka Shop prioriza la **experiencia del usuario**, combinando un estilo visual moderno con funcionalidades prácticas. Se han implementado **patrones reconocidos de e-commerce**, asegurando una navegación intuitiva, un sistema de carrito flexible y un filtrado eficiente.

La estructura de datos es sencilla pero efectiva, permitiendo **filtrado local, persistencia del carrito y ordenamiento inmediato**, lo cual mejora considerablemente la experiencia del usuario.

Este proyecto es escalable y adaptable, con posibilidad de integrar nuevas funcionalidades sin afectar la arquitectura actual.

---

---
## Actualización

-Se le implementa el ícono de carrito de compras que no lo tenía para hacer más intuitiva la página con el usuario al momento de ubicar el carro de compras.
-Se agrega el botón de favoritos para una futura actualización donde las personas pueden marcar un producto como favorito y luego visualizarlo en otra sección donde sólo vea los productos favoritos.
