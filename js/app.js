/* ================================================
   CRAB STATION — JavaScript Application
   ================================================ */

'use strict';

// ===== MENU DATA =====
const menuItems = [
  {
    id: 1,
    name: "Signature Crab Donburi",
    desc: "Premium blue crab over steamed jasmine rice with spicy coral sauce, pickled ginger & nori.",
    price: 380,
    emoji: "🦀",
    category: "donburi",
    bg: "bg-coral",
    hot: true
  },
  {
    id: 2,
    name: "Prawn Tempura Bowl",
    desc: "Crispy golden tiger prawns on fluffy rice with teriyaki glaze, sesame & spring onion.",
    price: 320,
    emoji: "🦐",
    category: "donburi",
    bg: "bg-teal",
    hot: false
  },
  {
    id: 3,
    name: "Lobster Royale Bowl",
    desc: "Half lobster tail in garlic butter sauce with saffron rice & microgreens.",
    price: 400,
    emoji: "🦞",
    category: "crab",
    bg: "bg-gold",
    hot: true
  },
  {
    id: 4,
    name: "Spicy Crab Rice",
    desc: "Shredded crab meat tossed in our signature chilli-coconut sauce over fragrant basmati.",
    price: 300,
    emoji: "🦀",
    category: "crab",
    bg: "bg-coral",
    hot: true
  },
  {
    id: 5,
    name: "Salmon Teriyaki Bowl",
    desc: "Seared Atlantic salmon fillet with house-made teriyaki, cucumber ribbon & tobiko.",
    price: 350,
    emoji: "🐟",
    category: "donburi",
    bg: "bg-blue",
    hot: false
  },
  {
    id: 6,
    name: "Seafood Ocean Platter",
    desc: "A generous mix of crab, prawn, squid rings & fish cake on golden fried rice.",
    price: 400,
    emoji: "🌊",
    category: "donburi",
    bg: "bg-teal",
    hot: false
  },
  {
    id: 7,
    name: "Crispy Calamari",
    desc: "Golden-fried squid rings with lemon aioli & sweet chilli dipping sauce.",
    price: 220,
    emoji: "🦑",
    category: "sides",
    bg: "bg-green",
    hot: false
  },
  {
    id: 8,
    name: "Miso Soup",
    desc: "Traditional Japanese miso with silken tofu, wakame seaweed & spring onion.",
    price: 120,
    emoji: "🍜",
    category: "sides",
    bg: "bg-gold",
    hot: false
  },
  {
    id: 9,
    name: "Coconut Lychee Cooler",
    desc: "Fresh coconut water blended with lychee juice, lime & mint. Utterly refreshing.",
    price: 150,
    emoji: "🥥",
    category: "drinks",
    bg: "bg-teal",
    hot: false
  },
  {
    id: 10,
    name: "Ocean Blue Lemonade",
    desc: "Butterfly pea flower lemonade with blue curacao syrup & sparkling water.",
    price: 160,
    emoji: "💙",
    category: "drinks",
    bg: "bg-blue",
    hot: false
  },
  {
    id: 11,
    name: "Steamed Edamame",
    desc: "Salted Japanese soybeans — the perfect starter to your seafood journey.",
    price: 130,
    emoji: "🫛",
    category: "sides",
    bg: "bg-green",
    hot: false
  },
  {
    id: 12,
    name: "Crab Miso Ramen",
    desc: "Rich crab-infused miso broth with ramen noodles, soft-boiled egg & nori.",
    price: 350,
    emoji: "🍥",
    category: "crab",
    bg: "bg-purple",
    hot: true
  }
];

// ===== CART STATE =====
let cart = {};

// ===== DOM REFS =====
const menuGrid   = document.getElementById('menuGrid');
const cartItems  = document.getElementById('cartItems');
const cartCount  = document.getElementById('cartCount');
const cartTotal  = document.getElementById('cartTotal');
const cartFooter = document.getElementById('cartFooter');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const toastEl    = document.getElementById('toast');
const navbar     = document.getElementById('navbar');

// ===== RENDER MENU =====
function renderMenu(filter = 'all') {
  menuGrid.innerHTML = '';
  const filtered = filter === 'all' ? menuItems : menuItems.filter(i => i.category === filter);

  filtered.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = `menu-card fade-up`;
    card.style.transitionDelay = `${idx * 0.06}s`;
    card.innerHTML = `
      <div class="menu-card-img ${item.bg}">
        <span>${item.emoji}</span>
        ${item.hot ? '<span class="badge-hot">🔥 Popular</span>' : ''}
      </div>
      <div class="menu-card-body">
        <span class="menu-card-tag">${categoryLabel(item.category)}</span>
        <h4>${item.name}</h4>
        <p>${item.desc}</p>
        <div class="menu-card-footer">
          <span class="menu-price">৳${item.price}</span>
          <button class="add-btn" onclick="addToCart(${item.id})" title="Add to order">+</button>
        </div>
      </div>
    `;
    menuGrid.appendChild(card);
    // Trigger animation
    requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('visible')));
  });
}

function categoryLabel(cat) {
  const map = { donburi: '🍱 Donburi', crab: '🦀 Crab', sides: '🌿 Sides', drinks: '🥤 Drinks' };
  return map[cat] || cat;
}

// ===== FILTER BUTTONS =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMenu(btn.dataset.filter);
  });
});

// ===== CART LOGIC =====
function addToCart(id) {
  const item = menuItems.find(i => i.id === id);
  if (!item) return;
  cart[id] = cart[id] ? { ...cart[id], qty: cart[id].qty + 1 } : { ...item, qty: 1 };
  updateCartUI();
  showToast(`${item.emoji} ${item.name} added to order!`);
}

function removeFromCart(id) {
  delete cart[id];
  updateCartUI();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  updateCartUI();
}

function updateCartUI() {
  const items = Object.values(cart);
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  cartCount.textContent = totalQty;
  cartTotal.textContent = `৳${totalPrice}`;

  if (items.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <span>🦀</span>
        <p>Your cart is empty</p>
        <a href="#menu" onclick="toggleCart()">Browse Menu</a>
      </div>`;
    cartFooter.style.display = 'none';
  } else {
    cartFooter.style.display = 'block';
    cartItems.innerHTML = items.map(item => `
      <div class="cart-item">
        <span class="cart-item-emoji">${item.emoji}</span>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-qty-controls">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
          <div class="cart-item-price">৳${item.price * item.qty}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `).join('');
  }
}

function toggleCart() {
  cartSidebar.classList.toggle('open');
  cartOverlay.classList.toggle('open');
  document.body.style.overflow = cartSidebar.classList.contains('open') ? 'hidden' : '';
}

// ===== TOAST =====
let toastTimeout;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toastEl.classList.remove('show'), 2800);
}

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  const btn = document.getElementById('scrollTopBtn');
  if (btn) {
    btn.classList.toggle('visible', window.scrollY > 400);
  }
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

function observeElements() {
  document.querySelectorAll('.feature-card, .review-card, .gallery-item, .info-item, .about-inner > *').forEach(el => {
    el.classList.add('fade-up');
    observer.observe(el);
  });
}

// ===== MOBILE NAV =====
function toggleMenu() {
  const links = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  links.classList.toggle('open');
  hamburger.classList.toggle('open');
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  });
});

// ===== SCROLL TO TOP BUTTON =====
function addScrollTopBtn() {
  const btn = document.createElement('button');
  btn.id = 'scrollTopBtn';
  btn.className = 'scroll-top';
  btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  btn.title = 'Back to top';
  btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(btn);
}

// ===== SMOOTH REVEAL on SCROLL for menu =====
const menuObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      menuObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  observeElements();
  addScrollTopBtn();
  updateCartUI();

  // Smooth section highlights on nav click
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Observe menu cards as they render
  const menuMutationObs = new MutationObserver(() => {
    document.querySelectorAll('.menu-card:not(.observed)').forEach(card => {
      card.classList.add('observed');
      menuObserver.observe(card);
    });
  });
  menuMutationObs.observe(menuGrid, { childList: true });
});
