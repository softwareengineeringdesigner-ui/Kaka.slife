/* ==============================================
   KAKA'S LIFE PERFUME STORE - MAIN JAVASCRIPT
   Author: Kaka's Life | Version: 1.0
   All logic: Cart, Checkout, Orders, Email
=============================================== */

'use strict';

/* ==================================================
   KAKA'S LIFE — MAISON DE PARFUM
   PAGE LOADER ENGINE — LUXURY SIGNATURE ANIMATION
================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("page-loader");
  const website = document.getElementById("website");
  const penPoint = document.getElementById("signature-pen-point");
  const clipRect = document.getElementById("sig-clip-rect");
  const textGroup = document.querySelector(".signature-text-group");
  const bottomSwoosh = document.getElementById("sig-bottom-swoosh");
  const container = document.querySelector(".signature-loader-container");

  let isFinished = false;

  // Initial state: hide clip rect and stroke
  if (clipRect) {
    clipRect.setAttribute("width", "0");
  }

  if (bottomSwoosh) {
    const len = bottomSwoosh.getTotalLength ? bottomSwoosh.getTotalLength() : 1000;
    bottomSwoosh.style.strokeDasharray = len;
    bottomSwoosh.style.strokeDashoffset = len;
    bottomSwoosh.classList.remove("drawing");
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Step 1: Draw/Reveal "Kaka's Life" in bold signature calligraphy (~650ms)
  function animateTextReveal(duration) {
    return new Promise(resolve => {
      const startX = 220;
      const endX = 780;
      const startTime = performance.now();

      if (textGroup) {
        textGroup.classList.add("ready");
      }

      if (penPoint) {
        penPoint.setAttribute("transform", `translate(${startX}, 195)`);
        penPoint.classList.add("active");
      }

      function frame(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);

        const currentX = startX + eased * (endX - startX);
        const clipW = eased * 1000;

        if (clipRect) {
          clipRect.setAttribute("width", clipW);
        }

        if (penPoint) {
          // Dynamic cursive baseline oscillation
          const penY = 195 + Math.sin(progress * 24) * 12;
          penPoint.setAttribute("transform", `translate(${currentX}, ${penY})`);
        }

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          if (clipRect) clipRect.setAttribute("width", 1000);
          resolve();
        }
      }

      requestAnimationFrame(frame);
    });
  }

  // Step 2: Underline paraph swoop flourish (~260ms)
  function animateSwoosh(path, duration) {
    return new Promise(resolve => {
      if (!path) return resolve();
      path.classList.add("drawing");

      const len = path.getTotalLength ? path.getTotalLength() : 1000;
      const startTime = performance.now();

      function frame(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const currentDist = eased * len;

        path.style.strokeDashoffset = Math.max(0, len - currentDist);

        if (penPoint && path.getPointAtLength) {
          const pt = path.getPointAtLength(currentDist);
          penPoint.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);
        }

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          path.style.strokeDashoffset = "0";
          resolve();
        }
      }

      requestAnimationFrame(frame);
    });
  }

  // Orchestrated Signature Sequence
  async function runSignatureLoader() {
    // Wait briefly for custom fonts if available
    if (document.fonts && document.fonts.ready) {
      try {
        await Promise.race([
          document.fonts.ready,
          new Promise(r => setTimeout(r, 220))
        ]);
      } catch (e) { }
    }

    // Write "Kaka's Life" signature
    await animateTextReveal(650);

    // Flow into bottom swoop flourish
    if (penPoint && bottomSwoosh && bottomSwoosh.getPointAtLength) {
      const pt = bottomSwoosh.getPointAtLength(0);
      penPoint.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);
    }
    await animateSwoosh(bottomSwoosh, 260);

    // Pen lifts gracefully
    if (penPoint) {
      penPoint.classList.remove("active");
    }

    if (container) {
      container.classList.add("signature-completed");
    }

    // Complete loader and smoothly unveil website
    setTimeout(finishLoader, 220);
  }

  function finishLoader() {
    if (isFinished) return;
    isFinished = true;

    if (loader) {
      loader.classList.add("loader-hidden");
      // Remove from layout after fade-out transition
      setTimeout(() => {
        loader.style.display = "none";
      }, 700);
    }

    setTimeout(() => {
      if (website) {
        website.classList.add("website-visible");
      }

      document.dispatchEvent(
        new CustomEvent("websiteReady", {
          detail: { brand: "KAKA'S LIFE" }
        })
      );
    }, 250);
  }

  // Safety fallback: maximum 2.0s so site is never blocked
  setTimeout(finishLoader, 2000);

  // Start sequence
  runSignatureLoader();
});


/* ===== PRODUCT DATA START ===== */
const PRODUCTS = [
  {
    id: 1,
    name: "ELITE — Luxury Feel",
    brand: "Kaka's Fragrance",
    category: "Pour Homme • Signature Luxury",
    gender: "men",
    genderBadgeText: "Men • Pour Homme",
    genderIcon: "bi bi-gender-male",
    description: "Premium, elegant & powerful luxury fragrance handcrafted for men. A captivating, magnetic blend crafted for those who demand distinction. Handcrafted with rich refined notes to leave an unforgettable impression.",
    scentNotes: ["Crisp Bergamot", "Fresh Marine Ozone", "Precious Amber", "Rich Cedarwood", "White Musk"],
    price: 1799,
    originalPrice: 2340,
    discountPercent: 23,
    image: "images/perfume_elite.jpg",
    badge: "sale",
    badgeText: "23% OFF",
    stockStatus: "available",
    stockText: "Available Stock",
    freeTester: true,
    freeDelivery: true,
    isLive: true,
    rating: 5.0,
    reviews: 148,
    volume: "50ml",
    filter: ["all", "men"]
  },
  {
    id: 2,
    name: "MIST — Soft & Fresh",
    brand: "Kaka's Fragrance",
    category: "Pour Femme • Floral Fragrance",
    gender: "women",
    genderBadgeText: "Women • Pour Femme",
    genderIcon: "bi bi-gender-female",
    description: "An ethereal and refreshing feminine mist. Premium, elegant & gentle, crafted with soft dewy petals, fresh peony, and a clean white musk base for an alluring, long-lasting touch of freshness.",
    scentNotes: ["Soft Peony", "Crisp Bergamot", "Fresh Lily", "Dewy Florals", "White Musk"],
    price: null,
    originalPrice: null,
    hidePrice: true,
    image: "images/perfume_mist.jpg",
    badge: "coming-soon",
    badgeText: "COMING SOON",
    stockStatus: "coming-soon",
    stockText: "Coming Soon",
    isLive: false,
    rating: 4.9,
    reviews: 112,
    volume: "75ml",
    filter: ["all", "women"]
  },
  {
    id: 3,
    name: "DISCOVERY SET — 5 Luxury Testers Box",
    brand: "Kaka's Fragrance",
    category: "Tester Set • Unisex Collection",
    gender: "tester",
    genderBadgeText: "Tester • Unisex Discovery Box",
    genderIcon: "bi bi-box2-heart",
    description: "Exclusive 5-piece luxury tester discovery set presented in a bespoke velvet-cushioned magnetic presentation box branded with Kaka's signature K monogram. Contains 5 premium glass spray vials (Pour Homme, Pour Femme & signature blends) to test and discover your signature scent before purchasing full bottles.",
    scentNotes: ["Elite Pour Homme", "Mist Pour Femme", "Royal Amber Oud", "Velvet Musk", "Citrus Marine Ozone"],
    price: null,
    originalPrice: null,
    hidePrice: true,
    image: "images/perfume_tester.jpg",
    badge: "coming-soon",
    badgeText: "COMING SOON",
    stockStatus: "coming-soon",
    stockText: "Coming Soon",
    isLive: false,
    rating: 5.0,
    reviews: 68,
    volume: "5 x 5ml (Box of 5)",
    filter: ["all", "tester", "unisex"]
  }
];
/* ===== PRODUCT DATA END ===== */

/* ===== STATE / CART DATA START ===== */
localStorage.removeItem('kakaslife_cart');
let cart = [];
let currentProductId = null;
let currentStep = 1;
let selectedPayment = null;
let orderData = {};
let uploadedFile = null;
let lastGeneratedReceiptBlob = null;
let lastOrderId = null;

// Primary Destination Email for all orders & screenshots
const OWNER_EMAIL = 'softwareengineeringdesigner@gmail.com';

// EmailJS Config (Optional fallback)
const EMAIL_CONFIG = {
  serviceID: 'YOUR_EMAILJS_SERVICE_ID',   // <-- REPLACE
  templateID: 'YOUR_EMAILJS_TEMPLATE_ID', // <-- REPLACE
  publicKey: 'YOUR_EMAILJS_PUBLIC_KEY'    // <-- REPLACE
};
/* ===== STATE / CART DATA END ===== */

/* ===== DOM READY START ===== */
document.addEventListener('DOMContentLoaded', function () {
  renderProducts('all');
  updateCartUI();
  initScrollEffects();
  initParallaxHero();
  initScrollReveal();
  initFilterTabs();
  init3DBottleMouseMove();
  createParticles();
  initWhatsAppChatbot();

  // Auto-collapse mobile navigation dropdown when a nav-link is clicked
  document.querySelectorAll('#navbarNav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const navbarCollapse = document.getElementById('navbarNav');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });
});
/* ===== DOM READY END ===== */

/* ===== PRODUCT RENDERING START ===== */
function renderProducts(filter) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const filtered = filter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => {
        if (Array.isArray(p.filter)) {
          return p.filter.includes(filter);
        }
        return p.filter === filter;
      });
  grid.innerHTML = '';
  filtered.forEach((p, i) => {
    const card = createProductCard(p, i);
    grid.innerHTML += card;
  });
}

function createProductCard(p, idx) {
  const delay = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3'][idx % 4];
  const stars = generateStars(p.rating);
  const genderHTML = `<span class="gender-pill gender-${p.gender}"><i class="${p.genderIcon}"></i> ${p.genderBadgeText}</span>`;

  if (p.isLive) {
    const priceHTML = `
      <div class="product-price-live">
        <span class="price-sale">Rs. ${p.price.toLocaleString()}</span>
        <span class="price-original"><del>Rs. ${p.originalPrice.toLocaleString()}</del></span>
        <span class="badge-discount-tag">23% OFF</span>
      </div>`;

    const badgeHTML = `<span class="product-badge badge-sale"><i class="bi bi-fire"></i> 23% OFF</span>`;

    return `
      <div class="col-lg-4 col-md-6 mb-4 reveal ${delay}">
        <div class="product-card product-card-live" id="product-card-${p.id}">
          <div class="product-img-wrap">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
            ${badgeHTML}
            <div class="product-wishlist" onclick="toggleWishlist(this, ${p.id})" title="Add to Wishlist">♡</div>
            <div class="product-actions">
              <button class="product-action-btn" onclick="openProductModal(${p.id})"><i class="bi bi-eye"></i> Quick View</button>
            </div>
          </div>
          <div class="product-info">
            <div class="d-flex justify-content-between align-items-center mb-2">
              ${genderHTML}
              <span class="stock-badge-live"><span class="stock-pulse-dot"></span> In Stock</span>
            </div>
            <p class="product-category mb-1">${p.category}</p>
            <h3 class="product-name">${p.name}</h3>
            <p class="product-desc-short">${p.description}</p>
            <div class="product-perks-row mb-2">
              <span class="perk-pill"><i class="bi bi-gift-fill text-gold"></i> Free Tester Sample</span>
              <span class="perk-pill"><i class="bi bi-truck text-gold"></i> Free Delivery</span>
            </div>
            <div class="product-rating">
              <span class="stars">${stars}</span>
              <span class="rating-count">(${p.reviews})</span>
              <span class="product-vol-tag ms-auto">${p.volume}</span>
            </div>
            <div class="product-price-row">${priceHTML}</div>
            <div class="product-card-cta-group">
              <button class="btn-add-cart" onclick="addToCartFromCard(${p.id}, this)">
                <i class="bi bi-bag-plus"></i> Add to Cart
              </button>
              <button class="btn-buy-now-card" onclick="buyNow(${p.id})">
                <i class="bi bi-lightning-fill"></i> Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }

  // Coming Soon Cards (MIST & TESTER DISCOVERY SET)
  const priceHTML = `
    <div class="d-flex align-items-center gap-2">
      <span class="coming-soon-pill"><i class="bi bi-clock"></i> Coming Soon</span>
      <span style="font-size:0.75rem;color:var(--text-muted);font-weight:600;">Price at Launch</span>
    </div>`;

  const badgeHTML = `<span class="product-badge badge-coming-soon"><i class="bi bi-clock"></i> COMING SOON</span>`;

  const perksHTML = p.gender === 'tester'
    ? `<div class="product-perks-row mb-2">
        <span class="perk-pill"><i class="bi bi-box-seam text-gold"></i> 5 Glass Atomizers</span>
        <span class="perk-pill"><i class="bi bi-gem text-gold"></i> Luxury Velvet Box</span>
      </div>`
    : `<div class="product-perks-row mb-2">
        <span class="perk-pill"><i class="bi bi-flower1 text-gold"></i> Soft & Fresh Floral</span>
        <span class="perk-pill"><i class="bi bi-stars text-gold"></i> Long-Lasting Sillage</span>
      </div>`;

  return `
    <div class="col-lg-4 col-md-6 mb-4 reveal ${delay}">
      <div class="product-card" id="product-card-${p.id}">
        <div class="product-img-wrap">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          ${badgeHTML}
          <div class="product-wishlist" onclick="toggleWishlist(this, ${p.id})" title="Add to Wishlist">♡</div>
          <div class="product-actions">
            <button class="product-action-btn" onclick="openProductModal(${p.id})"><i class="bi bi-eye"></i> Quick View</button>
          </div>
        </div>
        <div class="product-info">
          <div class="d-flex justify-content-between align-items-center mb-2">
            ${genderHTML}
            <span class="coming-soon-pill" style="padding:2px 8px;font-size:0.68rem;"><i class="bi bi-clock"></i> Launching Soon</span>
          </div>
          <p class="product-category mb-1">${p.category}</p>
          <h3 class="product-name">${p.name}</h3>
          <p class="product-desc-short">${p.description}</p>
          ${perksHTML}
          <div class="product-rating">
            <span class="stars">${stars}</span>
            <span class="rating-count">(${p.reviews})</span>
            <span class="product-vol-tag ms-auto">${p.volume}</span>
          </div>
          <div class="product-price-row">${priceHTML}</div>
          <button class="btn-add-cart btn-coming-soon" disabled onclick="event.preventDefault()">
            <i class="bi bi-clock-history"></i> COMING SOON
          </button>
        </div>
      </div>
    </div>`;
}

function generateStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= Math.floor(rating) ? '★' : (i - rating < 1 ? '✦' : '☆');
  }
  return stars;
}

/* Wishlist toggle - START */
function toggleWishlist(el, id) {
  el.classList.toggle('active');
  el.textContent = el.classList.contains('active') ? '♥' : '♡';
  showToast(
    el.classList.contains('active') ? '❤️' : '🤍',
    el.classList.contains('active') ? 'Added to Wishlist' : 'Removed from Wishlist',
    el.classList.contains('active') ? 'Item saved to your wishlist.' : 'Item removed from wishlist.',
    el.classList.contains('active') ? 'toast-success' : ''
  );
}
/* Wishlist toggle - END */
/* ===== PRODUCT RENDERING END ===== */

/* ===== FILTER TABS START ===== */
function initFilterTabs() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      renderProducts(this.dataset.filter);
      initScrollReveal();
    });
  });
}

function filterFromFooter(filter) {
  const tab = document.querySelector(`.filter-tab[data-filter="${filter}"]`);
  if (tab) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderProducts(filter);
    initScrollReveal();
  }
  const productsSec = document.getElementById('products');
  if (productsSec) {
    productsSec.scrollIntoView({ behavior: 'smooth' });
  }
}
/* ===== FILTER TABS END ===== */

/* ===== CART SYSTEM START ===== */

// SAVE CART TO LOCALSTORAGE - START
function saveCart() {
  localStorage.setItem('kakaslife_cart', JSON.stringify(cart));
}
// SAVE CART TO LOCALSTORAGE - COMPLETE

// GET PRODUCT BY ID - START
function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}
// GET PRODUCT BY ID - COMPLETE

// ADD TO CART FROM CARD BUTTON - START
function addToCartFromCard(productId, btnEl) {
  addToCart(productId, 1);
}
// ADD TO CART FROM CARD BUTTON - COMPLETE

// ADD TO CART CORE FUNCTION - START
function addToCart(productId, qty = 1) {
  const p = getProduct(productId);
  if (!p) return false;
  if (!p.isLive) {
    showToast('⏳', 'Coming Soon!', `${p.name} is launching soon. Orders are currently closed.`, 'toast-warning');
    return false;
  }

  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty: qty });
  }
  saveCart();
  updateCartUI();
  showToast('✨', 'Added to Cart!', `${p.name} (x${qty}) added. Free Tester & Free Delivery applied!`, 'toast-success');
  openCartOffcanvas();
  return true;
}
// ADD TO CART CORE FUNCTION - COMPLETE

// BUY NOW INSTANT CHECKOUT - START
function buyNow(productId, qty = 1) {
  const p = getProduct(productId);
  if (!p) return;
  if (!p.isLive) {
    showToast('⏳', 'Coming Soon!', `${p.name} is launching soon. Orders are currently closed.`, 'toast-warning');
    return;
  }

  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty = Math.max(existing.qty, qty);
  } else {
    cart.push({ id: productId, qty: qty });
  }
  saveCart();
  updateCartUI();

  const offcanvas = document.getElementById('cartOffcanvas');
  if (offcanvas) {
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
    if (bsOffcanvas) bsOffcanvas.hide();
  }

  goToStep(1);
  const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
  checkoutModal.show();
}
// BUY NOW INSTANT CHECKOUT - COMPLETE

// UPDATE CART BADGE COUNT - START
function updateCartBadge() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const badges = document.querySelectorAll('#cartCount, #mobileCartCount, .cart-badge');
  badges.forEach(badge => {
    badge.textContent = totalQty;
    if (totalQty > 0) {
      badge.classList.remove('d-none');
    } else {
      badge.classList.add('d-none');
    }
  });
}
// UPDATE CART BADGE COUNT - COMPLETE

// UPDATE CART OFFCANVAS UI - START
function updateCartUI() {
  updateCartBadge();
  renderCartItems();
  updateCartTotals();
}
// UPDATE CART OFFCANVAS UI - COMPLETE

// RENDER CART ITEMS IN OFFCANVAS - START
function renderCartItems() {
  const listEl = document.getElementById('cartItemsList');
  const emptyEl = document.getElementById('cartEmpty');
  const footerEl = document.getElementById('cartFooter');
  if (!listEl) return;

  if (cart.length === 0) {
    listEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'flex';
    if (footerEl) footerEl.style.display = 'none';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';
  if (footerEl) footerEl.style.display = 'block';

  listEl.innerHTML = cart.map(item => {
    const p = getProduct(item.id);
    if (!p) return '';
    const subtotal = p.price * item.qty;
    return `
      <div class="cart-item" id="cart-item-${p.id}">
        <img class="cart-item-img" src="${p.image}" alt="${p.name}">
        <div class="cart-item-details">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">Rs. ${p.price.toLocaleString()} / ea</div>
          <div class="cart-item-controls">
            <div class="mini-qty-selector">
              <button class="mini-qty-btn" onclick="changeCartQty(${p.id}, -1)">−</button>
              <span class="mini-qty-display">${item.qty}</span>
              <button class="mini-qty-btn" onclick="changeCartQty(${p.id}, 1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${p.id})" title="Remove">✕</button>
          </div>
        </div>
        <div class="cart-item-subtotal">Rs. ${subtotal.toLocaleString()}</div>
      </div>`;
  }).join('');
}
// RENDER CART ITEMS IN OFFCANVAS - COMPLETE

// CHANGE CART ITEM QUANTITY - START
function changeCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart();
  updateCartUI();
}
// CHANGE CART ITEM QUANTITY - COMPLETE

// REMOVE FROM CART - START
function removeFromCart(productId) {
  const p = getProduct(productId);
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
  showToast('🗑️', 'Item Removed', p ? `${p.name} removed from cart.` : 'Item removed.', '');
}
// REMOVE FROM CART - COMPLETE

// CALCULATE AND UPDATE CART TOTALS - START
function updateCartTotals() {
  const subtotal = cart.reduce((sum, item) => {
    const p = getProduct(item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
  const hasFreeDelivery = cart.some(item => {
    const p = getProduct(item.id);
    return p && (p.isLive || p.freeDelivery);
  }) || subtotal >= 1500;
  const shipping = (cart.length > 0 && !hasFreeDelivery) ? 200 : 0;
  const total = subtotal + shipping;
  const el = id => document.getElementById(id);
  if (el('cartSubtotal')) el('cartSubtotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
  if (el('cartShipping')) {
    if (cart.length === 0) {
      el('cartShipping').textContent = 'Rs. 0';
    } else if (shipping === 0) {
      el('cartShipping').innerHTML = '<span style="color:#2e7d32;font-weight:700;">FREE</span>';
    } else {
      el('cartShipping').textContent = `Rs. ${shipping.toLocaleString()}`;
    }
  }
  if (el('cartTotal')) el('cartTotal').textContent = `Rs. ${total.toLocaleString()}`;
}
// CALCULATE AND UPDATE CART TOTALS - COMPLETE

// OPEN CART OFFCANVAS - START
function openCartOffcanvas() {
  const offcanvas = document.getElementById('cartOffcanvas');
  if (!offcanvas) return;
  const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvas);
  bsOffcanvas.show();
}
// OPEN CART OFFCANVAS - COMPLETE

// CART BUTTON CLICK - START
document.addEventListener('click', function (e) {
  if (e.target.closest('#cartBtn') || e.target.closest('#mobileCartBtn')) {
    openCartOffcanvas();
  }
});
// CART BUTTON CLICK - COMPLETE

// CONTINUE SHOPPING BUTTON CLICK - START
function continueShopping() {
  const offcanvas = document.getElementById('cartOffcanvas');
  if (offcanvas) {
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
    if (bsOffcanvas) bsOffcanvas.hide();
  }
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}
// CONTINUE SHOPPING BUTTON CLICK - COMPLETE

/* ===== CART SYSTEM END ===== */

// OPEN PRODUCT MODAL - START
function openProductModal(productId) {
  currentProductId = productId;
  const p = getProduct(productId);
  if (!p) return;

  const stars = generateStars(p.rating);
  const scentHTML = p.scentNotes.map(n => `<span class="scent-note-tag">${n}</span>`).join('');

  document.getElementById('modalProductImg').src = p.image;
  document.getElementById('modalProductImg').alt = p.name;
  document.getElementById('modalProductCategory').textContent = p.category;
  const modalGenderEl = document.getElementById('modalProductGender');
  if (modalGenderEl) {
    modalGenderEl.innerHTML = `<span class="gender-pill gender-${p.gender}"><i class="${p.genderIcon}"></i> ${p.genderBadgeText}</span>`;
  }
  document.getElementById('modalProductName').textContent = p.name;
  if (document.getElementById('modalProductName2')) document.getElementById('modalProductName2').textContent = p.name;
  document.getElementById('modalProductDesc').textContent = p.description;
  document.getElementById('modalProductVolume').textContent = p.volume;
  document.getElementById('modalScentNotes').innerHTML = scentHTML;
  document.getElementById('modalStars').innerHTML = stars;
  document.getElementById('modalReviews').textContent = `(${p.reviews} reviews)`;

  const priceRow = document.getElementById('modalProductPrice');
  const launchNotice = document.getElementById('modalLaunchNotice') || document.querySelector('.launch-notice');
  const qtyRow = document.getElementById('modalQtyRow');
  const actionsContainer = document.getElementById('modalFooterActions');

  if (p.isLive) {
    if (priceRow) {
      priceRow.innerHTML = `
        <div class="d-flex align-items-baseline gap-2 flex-wrap mb-2">
          <span class="price-sale" style="font-size:1.85rem;color:var(--primary-gold-dark);">Rs. ${p.price.toLocaleString()}</span>
          <span class="price-original" style="font-size:1.1rem;"><del>Rs. ${p.originalPrice.toLocaleString()}</del></span>
          <span class="badge-discount-tag">23% OFF</span>
        </div>
        <div class="d-flex gap-2 flex-wrap mb-2">
          <span class="stock-badge-live"><span class="stock-pulse-dot"></span> Available Stock</span>
          <span class="perk-pill"><i class="bi bi-gift-fill text-gold"></i> Free Tester Sample</span>
          <span class="perk-pill"><i class="bi bi-truck text-gold"></i> Free Delivery</span>
        </div>`;
    }

    if (launchNotice) {
      launchNotice.style.background = 'rgba(46, 125, 50, 0.08)';
      launchNotice.style.borderColor = 'rgba(46, 125, 50, 0.3)';
      launchNotice.style.color = '#2e7d32';
      launchNotice.innerHTML = `
        <i class="bi bi-check-circle-fill" style="font-size:1.2rem;color:#2e7d32;"></i>
        <div>
          <strong style="display:block;">Available in Stock &bull; Ready to Dispatch</strong>
          <span style="font-size:0.8rem;color:var(--text-medium);">Includes complimentary free tester sample + free nationwide delivery with Cash on Delivery.</span>
        </div>`;
    }

    if (qtyRow) {
      qtyRow.style.display = 'block';
      const input = document.getElementById('modalQty');
      if (input) input.value = 1;
    }

    if (actionsContainer) {
      actionsContainer.innerHTML = `
        <button class="btn-outline-gold" data-bs-dismiss="modal">Close</button>
        <button class="btn-gold" id="modalAddToCartBtn" onclick="addToCartFromModal()">
          <i class="bi bi-bag-plus"></i> Add to Cart
        </button>
        <button class="btn-buy-now-card" id="modalBuyNowBtn" onclick="buyNowFromModal()" style="padding:12px 24px;">
          <i class="bi bi-lightning-fill"></i> Buy Now — Rs. ${p.price.toLocaleString()}
        </button>`;
    }
  } else {
    if (priceRow) {
      priceRow.innerHTML = `
        <div class="d-flex align-items-center gap-2 mb-2">
          <span class="coming-soon-pill" style="font-size:0.9rem;padding:7px 16px;"><i class="bi bi-clock"></i> Coming Soon</span>
          <span style="font-size:0.82rem;color:var(--text-muted);font-weight:600;">Price announced at launch</span>
        </div>`;
    }

    if (launchNotice) {
      launchNotice.style.background = 'rgba(201,168,76,0.1)';
      launchNotice.style.borderColor = 'rgba(201,168,76,0.3)';
      launchNotice.style.color = 'var(--primary-gold-dark)';
      launchNotice.innerHTML = `
        <i class="bi bi-clock-history" style="font-size:1.2rem;"></i>
        <div>
          <strong style="display:block;">${p.gender === 'tester' ? 'Discovery Tester Box' : 'Fragrance'} Launching Soon</strong>
          <span style="font-size:0.8rem;color:var(--text-medium);">Orders and pre-reservations will open shortly. Stay tuned!</span>
        </div>`;
    }

    if (qtyRow) {
      qtyRow.style.display = 'none';
    }

    if (actionsContainer) {
      actionsContainer.innerHTML = `
        <button class="btn-outline-gold" data-bs-dismiss="modal">Close</button>
        <button class="btn-gold btn-coming-soon" disabled id="modalAddToCartBtn">
          <i class="bi bi-clock-history"></i> Coming Soon
        </button>`;
    }
  }

  const modal = new bootstrap.Modal(document.getElementById('productModal'));
  modal.show();
}
// OPEN PRODUCT MODAL - COMPLETE

// MODAL QUANTITY SELECTOR - START
function changeModalQty(delta) {
  const input = document.getElementById('modalQty');
  if (!input) return;
  let val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  if (val > 10) val = 10;
  input.value = val;
}
// MODAL QUANTITY SELECTOR - COMPLETE

// ADD TO CART FROM MODAL BUTTON - START
function addToCartFromModal() {
  if (!currentProductId) return;
  const qtyEl = document.getElementById('modalQty');
  const qty = qtyEl ? parseInt(qtyEl.value) || 1 : 1;
  const added = addToCart(currentProductId, qty);
  if (added) {
    const modalEl = document.getElementById('productModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }
}
// ADD TO CART FROM MODAL BUTTON - COMPLETE

// BUY NOW FROM MODAL - START
function buyNowFromModal() {
  if (!currentProductId) return;
  const qtyEl = document.getElementById('modalQty');
  const qty = qtyEl ? parseInt(qtyEl.value) || 1 : 1;
  const modalEl = document.getElementById('productModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
  buyNow(currentProductId, qty);
}
// BUY NOW FROM MODAL - COMPLETE

/* ===== PRODUCT DETAIL MODAL END ===== */

/* ===== CHECKOUT FLOW START ===== */

// PLACE ORDER BUTTON CLICK - START
function placeOrder() {
  if (cart.length === 0) {
    showToast('🛒', 'Cart Empty', 'Your cart is empty. Please add items to order.', 'toast-warning');
    return;
  }
  const hasLive = cart.some(i => {
    const p = getProduct(i.id);
    return p && p.isLive;
  });
  if (!hasLive) {
    showToast('⏳', 'Coming Soon!', 'The items in your cart are launching soon. Orders are currently closed.', 'toast-warning');
    return;
  }

  const offcanvas = document.getElementById('cartOffcanvas');
  if (offcanvas) {
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
    if (bsOffcanvas) bsOffcanvas.hide();
  }

  goToStep(1);
  const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
  checkoutModal.show();
}
// PLACE ORDER BUTTON CLICK - COMPLETE

// NAVIGATE TO CHECKOUT STEP - START
function goToStep(step) {
  currentStep = step;
  document.querySelectorAll('.checkout-step-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`step${step}`);
  if (panel) panel.classList.add('active');
  updateStepIndicators(step);
}
// NAVIGATE TO CHECKOUT STEP - COMPLETE

// UPDATE STEP INDICATOR UI - START
function updateStepIndicators(activeStep) {
  document.querySelectorAll('.step-indicator').forEach((el, idx) => {
    const stepNum = idx + 1;
    el.classList.remove('active', 'done');
    if (stepNum < activeStep) el.classList.add('done');
    else if (stepNum === activeStep) el.classList.add('active');
  });
  document.querySelectorAll('.step-connector').forEach((el, idx) => {
    el.classList.toggle('done', idx < activeStep - 1);
  });
}
// UPDATE STEP INDICATOR UI - COMPLETE

// CONFIRM ADDRESS BUTTON CLICK - START
function confirmAddress() {
  const fields = ['fullName', 'phoneNumber', 'address', 'city', 'postalCode'];
  let valid = true;
  fields.forEach(f => {
    const input = document.getElementById(f);
    const val = input ? input.value.trim() : '';
    if (!val) {
      if (input) {
        input.classList.add('is-invalid');
        let fb = input.nextElementSibling;
        if (!fb || !fb.classList.contains('invalid-feedback')) {
          fb = document.createElement('div');
          fb.classList.add('invalid-feedback');
          fb.textContent = 'This field is required.';
          input.parentNode.appendChild(fb);
        }
      }
      valid = false;
    } else {
      if (input) input.classList.remove('is-invalid');
    }
  });

  if (!valid) {
    showToast('⚠️', 'Incomplete Form', 'Please fill in all required fields.', 'toast-error');
    return;
  }

  // Phone validation
  const phone = document.getElementById('phoneNumber').value.trim();
  if (!/^[\d\+\-\s]{10,15}$/.test(phone)) {
    document.getElementById('phoneNumber').classList.add('is-invalid');
    showToast('⚠️', 'Invalid Phone', 'Please enter a valid phone number.', 'toast-error');
    return;
  }

  // Save address data
  orderData.address = {
    fullName: document.getElementById('fullName').value.trim(),
    phone: document.getElementById('phoneNumber').value.trim(),
    address: document.getElementById('address').value.trim(),
    city: document.getElementById('city').value.trim(),
    postalCode: document.getElementById('postalCode').value.trim()
  };

  // Go to payment step
  goToStep(2);
}
// CONFIRM ADDRESS BUTTON CLICK - COMPLETE

// SELECT PAYMENT METHOD - START
function selectPayment(method) {
  selectedPayment = method;
  document.querySelectorAll('.payment-option-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById(`pay-${method}`);
  if (card) card.classList.add('selected');
}
// SELECT PAYMENT METHOD - COMPLETE

// CONFIRM PAYMENT METHOD BUTTON CLICK - START
function confirmPaymentMethod() {
  if (!selectedPayment) {
    showToast('⚠️', 'Select Payment', 'Please select a payment method.', 'toast-error');
    return;
  }
  orderData.paymentMethod = selectedPayment;

  if (selectedPayment === 'cod') {
    goToStep(3); // COD confirmation
    renderOrderSummaryStep3();
  } else {
    goToStep(4); // Online payment
    renderOrderSummaryStep4();
  }
}
// CONFIRM PAYMENT METHOD BUTTON CLICK - COMPLETE

// RENDER ORDER SUMMARY ON STEP 3 (COD) - START
function renderOrderSummaryStep3() {
  const addr = orderData.address;
  document.getElementById('addressSummaryText').innerHTML =
    `${addr.fullName}<br>${addr.phone}<br>${addr.address}<br>${addr.city} - ${addr.postalCode}`;

  const items = cart.map(item => {
    const p = getProduct(item.id);
    if (!p) return '';
    return `<div class="order-item-row">
      <div>
        <div class="order-item-name">${p.name}</div>
        <div class="order-item-qty">x${item.qty} &middot; ${p.volume}</div>
        ${p.isLive ? '<div style="font-size:0.75rem;color:#2e7d32;font-weight:600;"><i class="bi bi-gift-fill"></i> Free Tester + Free Delivery Included</div>' : ''}
      </div>
      <div class="order-item-price">Rs. ${(p.price * item.qty).toLocaleString()}</div>
    </div>`;
  }).join('');

  const subtotal = cart.reduce((s, i) => { const p = getProduct(i.id); return s + (p ? p.price * i.qty : 0); }, 0);
  const hasFreeDelivery = cart.some(item => {
    const p = getProduct(item.id);
    return p && (p.isLive || p.freeDelivery);
  }) || subtotal >= 1500;
  const shipping = (cart.length > 0 && !hasFreeDelivery) ? 200 : 0;
  const total = subtotal + shipping;

  document.getElementById('codOrderItems').innerHTML = items;
  const totalEl = document.getElementById('codOrderTotal');
  if (totalEl) {
    totalEl.textContent = `Rs. ${total.toLocaleString()}`;
    const row = totalEl.closest('.order-total-row');
    if (row) {
      const lbl = row.querySelector('.order-total-label');
      if (lbl) lbl.textContent = shipping === 0 ? 'Total (Free Delivery Included)' : `Total (inc. Rs. ${shipping} shipping)`;
    }
  }
}
// RENDER ORDER SUMMARY ON STEP 3 (COD) - COMPLETE

// RENDER ORDER SUMMARY ON STEP 4 (ONLINE) - START
function renderOrderSummaryStep4() {
  const items = cart.map(item => {
    const p = getProduct(item.id);
    if (!p) return '';
    return `<div class="order-item-row">
      <div>
        <div class="order-item-name">${p.name}</div>
        <div class="order-item-qty">x${item.qty} &middot; ${p.volume}</div>
        ${p.isLive ? '<div style="font-size:0.75rem;color:#2e7d32;font-weight:600;"><i class="bi bi-gift-fill"></i> Free Tester + Free Delivery Included</div>' : ''}
      </div>
      <div class="order-item-price">Rs. ${(p.price * item.qty).toLocaleString()}</div>
    </div>`;
  }).join('');

  const subtotal = cart.reduce((s, i) => { const p = getProduct(i.id); return s + (p ? p.price * i.qty : 0); }, 0);
  const hasFreeDelivery = cart.some(item => {
    const p = getProduct(item.id);
    return p && (p.isLive || p.freeDelivery);
  }) || subtotal >= 1500;
  const shipping = (cart.length > 0 && !hasFreeDelivery) ? 200 : 0;
  const total = subtotal + shipping;

  document.getElementById('onlineOrderItems').innerHTML = items;
  const totalEl = document.getElementById('onlineOrderTotal');
  if (totalEl) {
    totalEl.textContent = `Rs. ${total.toLocaleString()}`;
    const row = totalEl.closest('.order-total-row');
    if (row) {
      const lbl = row.querySelector('.order-total-label');
      if (lbl) lbl.textContent = shipping === 0 ? 'Total (Free Delivery Included)' : `Total (inc. Rs. ${shipping} shipping)`;
    }
  }
}
// RENDER ORDER SUMMARY ON STEP 4 (ONLINE) - COMPLETE

// CONFIRM COD ORDER BUTTON CLICK - START
async function confirmCODOrder() {
  const btn = document.getElementById('confirmCODBtn');
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Confirming Order...`;
  }

  try {
    orderData.orderId = 'KL-' + Date.now().toString().slice(-6);
    orderData.orderDate = new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
    orderData.paymentMethod = 'cod';
    orderData.items = cart.map(item => {
      const p = getProduct(item.id);
      return p ? { name: p.name, qty: item.qty, price: p.price, total: p.price * item.qty, volume: p.volume } : null;
    }).filter(Boolean);

    const subtotal = cart.reduce((s, i) => { const p = getProduct(i.id); return s + (p ? p.price * i.qty : 0); }, 0);
    const hasFreeDelivery = cart.some(item => {
      const p = getProduct(item.id);
      return p && (p.isLive || p.freeDelivery);
    }) || subtotal >= 1500;
    const shipping = (cart.length > 0 && !hasFreeDelivery) ? 200 : 0;
    orderData.subtotal = subtotal;
    orderData.shipping = shipping;
    orderData.total = subtotal + shipping;

    // Send order confirmation email with generated receipt screenshot
    await sendOrderEmail(orderData, null);

    goToStep(5);
    renderOrderSuccessStep(orderData, null);
    cart = [];
    saveCart();
    updateCartUI();
  } catch (err) {
    console.error('Order confirmation error:', err);
    goToStep(5);
    renderOrderSuccessStep(orderData, null);
    cart = [];
    saveCart();
    updateCartUI();
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
    }
  }
}
// CONFIRM COD ORDER BUTTON CLICK - COMPLETE

// SUBMIT ONLINE PAYMENT PROOF BUTTON CLICK - START
async function submitPaymentProof() {
  const trxId = document.getElementById('trxId');
  let valid = true;
  if (!trxId || !trxId.value.trim()) {
    if (trxId) trxId.classList.add('is-invalid');
    valid = false;
  } else {
    if (trxId) trxId.classList.remove('is-invalid');
  }
  if (!uploadedFile) {
    document.getElementById('screenshotZone').classList.add('is-invalid-zone');
    showToast('⚠️', 'Screenshot Required', 'Please upload your payment screenshot.', 'toast-error');
    valid = false;
  }
  if (!valid) {
    showToast('⚠️', 'Incomplete Info', 'Please fill in all required fields.', 'toast-error');
    return;
  }

  const btn = document.getElementById('submitPaymentBtn');
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending Order & Screenshot...`;
  }

  try {
    orderData.trxId = trxId.value.trim();
    orderData.screenshot = uploadedFile ? uploadedFile.name : 'Uploaded';
    orderData.orderId = 'KL-' + Date.now().toString().slice(-6);
    orderData.orderDate = new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
    orderData.paymentMethod = 'online';
    orderData.items = cart.map(item => {
      const p = getProduct(item.id);
      return p ? { name: p.name, qty: item.qty, price: p.price, total: p.price * item.qty, volume: p.volume } : null;
    }).filter(Boolean);

    const subtotal = cart.reduce((s, i) => { const p = getProduct(i.id); return s + (p ? p.price * i.qty : 0); }, 0);
    const hasFreeDelivery = cart.some(item => {
      const p = getProduct(item.id);
      return p && (p.isLive || p.freeDelivery);
    }) || subtotal >= 1500;
    const shipping = (cart.length > 0 && !hasFreeDelivery) ? 200 : 0;
    orderData.subtotal = subtotal;
    orderData.shipping = shipping;
    orderData.total = subtotal + shipping;

    // Send order confirmation email with screenshot attachments
    await sendOrderEmail(orderData, uploadedFile);

    goToStep(5);
    renderOrderSuccessStep(orderData, uploadedFile);
    cart = [];
    saveCart();
    updateCartUI();
  } catch (err) {
    console.error('Order submission error:', err);
    goToStep(5);
    renderOrderSuccessStep(orderData, uploadedFile);
    cart = [];
    saveCart();
    updateCartUI();
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
    }
  }
}
// SUBMIT ONLINE PAYMENT PROOF BUTTON CLICK - COMPLETE

// FILE UPLOAD ZONE CLICK - START
function triggerFileUpload() {
  document.getElementById('screenshotInput').click();
}

function handleFileUpload(input) {
  const file = input.files[0];
  if (!file) return;
  uploadedFile = file;
  const zone = document.getElementById('screenshotZone');
  zone.classList.add('has-file');
  zone.classList.remove('is-invalid-zone');
  document.getElementById('fileNameDisplay').textContent = '✓ ' + file.name;
}
// FILE UPLOAD ZONE CLICK - COMPLETE

// RESET CHECKOUT FORM - START
function resetCheckoutForm() {
  ['fullName', 'phoneNumber', 'address', 'city', 'postalCode', 'trxId'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.value = ''; el.classList.remove('is-invalid'); }
  });
  selectedPayment = null;
  uploadedFile = null;
  lastGeneratedReceiptBlob = null;
  lastOrderId = null;
  document.querySelectorAll('.payment-option-card').forEach(c => c.classList.remove('selected'));
  const zone = document.getElementById('screenshotZone');
  if (zone) { zone.classList.remove('has-file'); }
  const fname = document.getElementById('fileNameDisplay');
  if (fname) fname.textContent = '';
  const preview = document.getElementById('receiptPreviewContainer');
  if (preview) { preview.innerHTML = ''; preview.classList.add('d-none'); }
}
// RESET CHECKOUT FORM - COMPLETE

/* ===== CHECKOUT FLOW END ===== */

/* ===== ORDER SUCCESS & RECEIPT DOWNLOAD START ===== */
function renderOrderSuccessStep(data, proofFile) {
  const idEl = document.getElementById('successOrderId');
  if (idEl) {
    idEl.textContent = `Order ID: ${data.orderId}`;
  }

  // Dynamically update the Email & Dispatch Confirmation Banner
  const noticeBox = document.getElementById('orderDispatchNotice');
  const noticeTitle = document.getElementById('dispatchNoticeTitle');
  const noticeBody = document.getElementById('dispatchNoticeBody');

  if (noticeBox && noticeTitle && noticeBody) {
    noticeBox.style.background = 'rgba(46, 125, 50, 0.12)';
    noticeBox.style.borderColor = 'rgba(74, 222, 128, 0.4)';
    noticeTitle.innerHTML = `<i class="bi bi-check-circle-fill text-success" style="font-size:1.15rem;"></i> Order Sent to Management!`;
    noticeTitle.style.color = '#4ade80';
    noticeBody.innerHTML = `
      Your order details and verification slip have been dispatched to KAKA'S LIFE management.
      <div style="font-size:0.8rem;color:var(--text-light);margin-top:4px;">Official notification sent to: <span style="color:#ffffff;font-weight:600;">${OWNER_EMAIL}</span></div>
    `;
  }

  // Pre-fill WhatsApp quick notification link
  const waBtn = document.getElementById('successWhatsAppBtn');
  if (waBtn) {
    const itemsList = (data.items || []).map(i => `${i.name} (x${i.qty})`).join(', ');
    const msg = encodeURIComponent(
      `Assalam-o-Alaikum KAKA'S LIFE!\n\n` +
      `I have placed an order on your website:\n` +
      `• Order ID: ${data.orderId}\n` +
      `• Name: ${data.address.fullName}\n` +
      `• Phone: ${data.address.phone}\n` +
      `• Items: ${itemsList}\n` +
      `• Total Amount: Rs. ${data.total.toLocaleString()}\n` +
      `• Payment Method: ${data.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment'}\n` +
      (data.trxId ? `• TRX ID: ${data.trxId}\n` : '') +
      `\nPlease verify and dispatch my order. Thank you!`
    );
    waBtn.href = `https://wa.me/923287004634?text=${msg}`;
  }

  // Show receipt preview thumbnail if available
  const previewContainer = document.getElementById('receiptPreviewContainer');
  if (previewContainer && lastGeneratedReceiptBlob) {
    const url = URL.createObjectURL(lastGeneratedReceiptBlob);
    previewContainer.innerHTML = `
      <div style="font-size:0.8rem;color:var(--primary-gold);font-weight:600;margin-bottom:6px;">
        <i class="bi bi-eye"></i> Generated Order Receipt Slip:
      </div>
      <img src="${url}" alt="Order Receipt Slip"
        style="max-width:100%;max-height:220px;border-radius:10px;border:1px solid rgba(201,168,76,0.4);box-shadow:0 6px 20px rgba(0,0,0,0.5);cursor:pointer;transition:transform 0.2s ease;"
        onclick="downloadOrderReceipt()" title="Click to download high-resolution receipt">
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">(Click image or button below to download PNG)</div>
    `;
    previewContainer.classList.remove('d-none');
  }
}

function downloadOrderReceipt() {
  if (!lastGeneratedReceiptBlob) {
    showToast('ℹ️', 'Receipt Notice', 'Order receipt is being prepared...', 'toast-info');
    return;
  }
  const url = URL.createObjectURL(lastGeneratedReceiptBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `KakasLife_Order_${lastOrderId || 'Receipt'}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1200);
  showToast('📥', 'Downloaded', 'Order receipt image saved successfully!', 'toast-success');
}
/* ===== ORDER SUCCESS & RECEIPT DOWNLOAD END ===== */

/* ===== CANVAS ORDER RECEIPT GENERATOR START ===== */
/**
 * Generates an official, luxury high-resolution digital order receipt image (PNG Blob)
 * using HTML5 Canvas API. Renders all order details, customer info, itemized table,
 * pricing, and embeds the uploaded payment screenshot if provided.
 */
function generateOrderReceiptCanvas(data, proofFile) {
  return new Promise(async (resolve) => {
    try {
      const items = data.items || [];
      const hasProof = !!proofFile && (proofFile.type ? proofFile.type.startsWith('image/') : true);

      // Try loading proof image if provided
      let proofImg = null;
      if (hasProof && proofFile instanceof Blob) {
        proofImg = await new Promise((res) => {
          const url = URL.createObjectURL(proofFile);
          const img = new Image();
          img.onload = () => { URL.revokeObjectURL(url); res(img); };
          img.onerror = () => { URL.revokeObjectURL(url); res(null); };
          img.src = url;
        });
      }

      // Dynamic Canvas Dimensions (2x scale for Retina sharpness)
      const scale = 2;
      const baseW = 820;

      // Calculate dynamic height
      let calcH = 580; // Header + Meta + Customer + Payment boxes
      calcH += Math.max(1, items.length) * 44 + 60; // Items table
      calcH += 190; // Totals & Guarantee box
      if (proofImg) {
        calcH += 380; // Embedded Payment Screenshot Preview Box
      } else if (data.paymentMethod !== 'cod' && data.trxId) {
        calcH += 60; // Note about proof
      }
      calcH += 120; // Footer

      const canvas = document.createElement('canvas');
      canvas.width = baseW * scale;
      canvas.height = calcH * scale;
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);

      // Helper function for rounded rectangles
      function roundRect(x, y, w, h, r, fill = true, stroke = true) {
        if (typeof r === 'number') r = [r, r, r, r];
        ctx.beginPath();
        ctx.moveTo(x + r[0], y);
        ctx.lineTo(x + w - r[1], y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r[1]);
        ctx.lineTo(x + w, y + h - r[2]);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
        ctx.lineTo(x + r[3], y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r[3]);
        ctx.lineTo(x, y + r[0]);
        ctx.quadraticCurveTo(x, y, x + r[0], y);
        ctx.closePath();
        if (fill) ctx.fill();
        if (stroke) ctx.stroke();
      }

      // 1. Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, calcH);
      bgGrad.addColorStop(0, '#0c0c0e');
      bgGrad.addColorStop(0.5, '#121216');
      bgGrad.addColorStop(1, '#09090b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, baseW, calcH);

      // Luxury Outer Gold Border
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#c9a84c';
      roundRect(14, 14, baseW - 28, calcH - 28, 14, false, true);

      // Subtle Inner Border
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.25)';
      roundRect(22, 22, baseW - 44, calcH - 44, 10, false, true);

      // 2. Brand Header
      ctx.textAlign = 'center';

      // Emblem star
      ctx.fillStyle = '#e8c96b';
      ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('✦  ⚜  ✦', baseW / 2, 52);

      // Brand Title
      ctx.font = 'bold 28px "Playfair Display", Georgia, serif';
      const brandGrad = ctx.createLinearGradient(baseW / 2 - 120, 0, baseW / 2 + 120, 0);
      brandGrad.addColorStop(0, '#c9a84c');
      brandGrad.addColorStop(0.5, '#f5e2a3');
      brandGrad.addColorStop(1, '#a07830');
      ctx.fillStyle = brandGrad;
      ctx.fillText("KAKA'S LIFE", baseW / 2, 86);

      // Subtitle
      ctx.fillStyle = '#a89d7e';
      ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('HAUTE PARFUMERIE • OFFICIAL ORDER INVOICE & RECEIPT', baseW / 2, 106);

      // Gold divider line
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, 122);
      ctx.lineTo(baseW - 50, 122);
      ctx.stroke();

      // 3. Order Meta Bar
      let curY = 142;
      ctx.fillStyle = '#17171e';
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.3)';
      roundRect(40, curY, baseW - 80, 50, 8, true, true);

      ctx.textAlign = 'left';
      ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#9e9e9e';
      ctx.fillText('ORDER ID:', 60, curY + 31);
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#e8c96b';
      ctx.fillText(data.orderId || 'KL-UNKNOWN', 135, curY + 31);

      ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#9e9e9e';
      ctx.fillText('DATE:', 330, curY + 31);
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(data.orderDate || new Date().toLocaleString(), 375, curY + 31);

      // Status Pill on right
      const statusPillW = 120;
      const statusPillX = baseW - 60 - statusPillW;
      ctx.fillStyle = '#1b4332';
      ctx.strokeStyle = '#2d6a4f';
      roundRect(statusPillX, curY + 11, statusPillW, 28, 14, true, true);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#74c69d';
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('● CONFIRMED', statusPillX + statusPillW / 2, curY + 29);

      // 4. Customer Delivery & Payment Boxes (2 columns)
      curY += 66;
      const colW = (baseW - 95) / 2;
      const addr = data.address || {};

      // Box 1: Customer & Address
      ctx.fillStyle = '#15151c';
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.2)';
      roundRect(40, curY, colW, 140, 8, true, true);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#c9a84c';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('📍 DELIVERY DETAILS', 56, curY + 26);

      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#b0b0b0';
      ctx.fillText('Customer:', 56, curY + 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(addr.fullName || '—', 130, curY + 50);

      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#b0b0b0';
      ctx.fillText('Phone:', 56, curY + 72);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(addr.phone || '—', 130, curY + 72);

      ctx.fillStyle = '#b0b0b0';
      ctx.fillText('Address:', 56, curY + 94);
      ctx.fillStyle = '#e0e0e0';
      const addrLine = (addr.address || '—').length > 34 ? (addr.address.substring(0, 32) + '...') : (addr.address || '—');
      ctx.fillText(addrLine, 130, curY + 94);

      ctx.fillStyle = '#b0b0b0';
      ctx.fillText('City / Zip:', 56, curY + 116);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${addr.city || '—'} (${addr.postalCode || '—'})`, 130, curY + 116);

      // Box 2: Payment Details
      const col2X = 40 + colW + 15;
      ctx.fillStyle = '#15151c';
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.2)';
      roundRect(col2X, curY, colW, 140, 8, true, true);

      ctx.fillStyle = '#c9a84c';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('💳 PAYMENT INFORMATION', col2X + 16, curY + 26);

      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#b0b0b0';
      ctx.fillText('Method:', col2X + 16, curY + 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const isCod = data.paymentMethod === 'cod';
      ctx.fillText(isCod ? 'Cash on Delivery (COD)' : 'Online Payment (Bank/Sadapay)', col2X + 80, curY + 50);

      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#b0b0b0';
      ctx.fillText('Status:', col2X + 16, curY + 74);
      ctx.fillStyle = isCod ? '#f59e0b' : '#34d399';
      ctx.fillText(isCod ? 'Pay upon delivery' : 'Payment Proof Submitted', col2X + 80, curY + 74);

      if (data.trxId) {
        ctx.fillStyle = '#b0b0b0';
        ctx.fillText('TRX ID:', col2X + 16, curY + 98);
        ctx.fillStyle = '#e8c96b';
        ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(data.trxId, col2X + 80, curY + 98);
      }

      ctx.fillStyle = '#b0b0b0';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('Store Acct:', col2X + 16, curY + (data.trxId ? 122 : 98));
      ctx.fillStyle = '#a0a0a0';
      ctx.fillText('Meezan / Sadapay (03287004634)', col2X + 80, curY + (data.trxId ? 122 : 98));

      // 5. Items Table
      curY += 156;
      ctx.fillStyle = '#201f28';
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.35)';
      roundRect(40, curY, baseW - 80, 36, 6, true, true);

      ctx.fillStyle = '#c9a84c';
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('ITEM / FRAGRANCE', 58, curY + 22);
      ctx.textAlign = 'center';
      ctx.fillText('QTY', 470, curY + 22);
      ctx.textAlign = 'right';
      ctx.fillText('UNIT PRICE', 610, curY + 22);
      ctx.fillText('TOTAL', baseW - 58, curY + 22);

      curY += 36;
      items.forEach((it, idx) => {
        const rowH = 42;
        ctx.fillStyle = idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)';
        ctx.fillRect(40, curY, baseW - 80, rowH);

        // Item text
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        const itemName = (it.name || 'Perfume') + (it.volume ? ` (${it.volume})` : '');
        ctx.fillText(itemName, 58, curY + 25);

        // Qty
        ctx.textAlign = 'center';
        ctx.fillStyle = '#d0d0d0';
        ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(`x${it.qty}`, 470, curY + 25);

        // Price
        ctx.textAlign = 'right';
        ctx.fillText(`Rs. ${(it.price || 0).toLocaleString()}`, 610, curY + 25);

        // Total
        ctx.fillStyle = '#e8c96b';
        ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        const lineTotal = it.total || (it.price * it.qty) || 0;
        ctx.fillText(`Rs. ${lineTotal.toLocaleString()}`, baseW - 58, curY + 25);

        // Subtle divider
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.moveTo(40, curY + rowH);
        ctx.lineTo(baseW - 40, curY + rowH);
        ctx.stroke();

        curY += rowH;
      });

      // 6. Summary Rows
      curY += 14;
      ctx.textAlign = 'right';
      ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#a0a0a0';
      ctx.fillText('Subtotal:', baseW - 200, curY + 16);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Rs. ${(data.subtotal || data.total).toLocaleString()}`, baseW - 58, curY + 16);

      curY += 26;
      ctx.fillStyle = '#a0a0a0';
      ctx.fillText('Shipping / Delivery:', baseW - 200, curY + 16);
      ctx.fillStyle = data.shipping === 0 ? '#4ade80' : '#ffffff';
      ctx.fillText(data.shipping === 0 ? 'FREE Included' : `Rs. ${data.shipping}`, baseW - 58, curY + 16);

      // Grand Total Highlight Box
      curY += 34;
      ctx.fillStyle = '#1f1c16';
      ctx.strokeStyle = '#c9a84c';
      ctx.lineWidth = 1.8;
      roundRect(40, curY, baseW - 80, 52, 8, true, true);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#e8c96b';
      ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('TOTAL ORDER AMOUNT:', 60, curY + 32);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "Playfair Display", Georgia, serif';
      ctx.fillText(`Rs. ${(data.total || 0).toLocaleString()}`, baseW - 60, curY + 34);

      // 7. Payment Proof Screenshot Preview (if attached)
      if (proofImg) {
        curY += 72;
        ctx.fillStyle = '#17171e';
        ctx.strokeStyle = 'rgba(201, 168, 76, 0.3)';
        roundRect(40, curY, baseW - 80, 360, 8, true, true);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#c9a84c';
        ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('📸 ATTACHED PAYMENT PROOF SCREENSHOT', 58, curY + 26);

        // Draw image scaled inside box
        const maxImgW = baseW - 120;
        const maxImgH = 300;
        const imgRatio = proofImg.width / proofImg.height;
        let drawW = maxImgW;
        let drawH = drawW / imgRatio;
        if (drawH > maxImgH) {
          drawH = maxImgH;
          drawW = drawH * imgRatio;
        }
        const imgX = (baseW - drawW) / 2;
        const imgY = curY + 40 + (maxImgH - drawH) / 2;

        ctx.drawImage(proofImg, imgX, imgY, drawW, drawH);
        ctx.strokeStyle = 'rgba(201, 168, 76, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(imgX, imgY, drawW, drawH);
        curY += 360;
      }

      // 8. Footer
      curY += 34;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#7a766c';
      ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText("KAKA'S LIFE LUXURY PERFUMES • Lahore, Pakistan • WhatsApp: +92 328 7004634", baseW / 2, curY);
      ctx.fillStyle = '#c9a84c';
      ctx.fillText(`Sent to Management: ${OWNER_EMAIL}`, baseW / 2, curY + 18);

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    } catch (e) {
      console.error('Error drawing receipt canvas:', e);
      resolve(null);
    }
  });
}
/* ===== CANVAS ORDER RECEIPT GENERATOR END ===== */

/* ===== EMAIL SENDING DISPATCHER START ===== */
// Global state tracking actual email delivery status
let lastDispatchStatus = { ok: false, type: 'idle', message: '' };

/**
 * Sends complete order details along with generated receipt screenshot (and payment screenshot)
 * directly to softwareengineeringdesigner@gmail.com.
 * Supports EmailJS (direct Gmail delivery) and FormSubmit (automated form dispatch with attachments).
 */
async function sendOrderEmail(data, proofFile) {
  lastOrderId = data.orderId;
  lastDispatchStatus = { ok: false, type: 'sending', message: 'Sending order details...' };
  showToast('📨', 'Processing Order', 'Generating order receipt & sending confirmation...', 'toast-info');

  // 1. Generate high-resolution visual receipt screenshot
  let receiptBlob = null;
  try {
    receiptBlob = await generateOrderReceiptCanvas(data, proofFile);
    lastGeneratedReceiptBlob = receiptBlob;
  } catch (err) {
    console.warn('Canvas receipt generation fallback:', err);
  }

  // 2. Prepare items summary text
  const itemsText = (data.items || []).map(i =>
    `• ${i.name} (Qty: ${i.qty}) — Rs. ${(i.total || (i.price * i.qty)).toLocaleString()}`
  ).join('\n');

  // 3. Check if running directly as a file (file:///)
  const isFileProtocol = window.location.protocol === 'file:';

  // 4. Try EmailJS first if keys are configured
  const hasEmailJS = typeof emailjs !== 'undefined' && 
                     EMAIL_CONFIG && 
                     EMAIL_CONFIG.publicKey && 
                     EMAIL_CONFIG.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY';

  if (hasEmailJS) {
    try {
      emailjs.init(EMAIL_CONFIG.publicKey);
      const emailParams = {
        order_id: data.orderId,
        order_date: data.orderDate || new Date().toLocaleString(),
        customer_name: data.address.fullName,
        customer_phone: data.address.phone,
        customer_address: `${data.address.address}, ${data.address.city} (${data.address.postalCode})`,
        payment_method: data.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment (Bank/Sadapay)',
        trx_id: data.trxId || 'N/A',
        items: itemsText,
        subtotal: `Rs. ${(data.subtotal || data.total).toLocaleString()}`,
        shipping: data.shipping === 0 ? 'FREE Included' : `Rs. ${data.shipping}`,
        total: `Rs. ${data.total.toLocaleString()}`,
        to_email: OWNER_EMAIL
      };

      const emailRes = await emailjs.send(EMAIL_CONFIG.serviceID, EMAIL_CONFIG.templateID, emailParams);
      if (emailRes && (emailRes.status === 200 || emailRes.text === 'OK')) {
        console.log('Order email successfully delivered via EmailJS to:', OWNER_EMAIL);
        lastDispatchStatus = {
          ok: true,
          type: 'emailjs_success',
          message: `Order sent directly to ${OWNER_EMAIL} via EmailJS!`
        };
        showToast('✅', 'Email Delivered!', `Order sent to ${OWNER_EMAIL}`, 'toast-success');
        return;
      }
    } catch (ejsErr) {
      console.warn('EmailJS attempt failed, falling back to FormSubmit:', ejsErr);
    }
  }

  // 5. Build FormSubmit FormData payload
  const formData = new FormData();
  formData.append('_subject', `🔥 New Order [${data.orderId}] - Rs. ${data.total.toLocaleString()} - ${data.address.fullName}`);
  formData.append('_template', 'table');
  formData.append('_captcha', 'false');

  formData.append('Order ID', data.orderId);
  formData.append('Order Date & Time', data.orderDate || new Date().toLocaleString());
  formData.append('Customer Name', data.address.fullName);
  formData.append('Phone Number', data.address.phone);
  formData.append('Delivery Address', data.address.address);
  formData.append('City', data.address.city);
  formData.append('Postal Code', data.address.postalCode);
  formData.append('Payment Method', data.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment (Bank/Sadapay)');
  if (data.trxId) {
    formData.append('Transaction ID (TRX)', data.trxId);
  }
  formData.append('Ordered Products', itemsText);
  formData.append('Subtotal', `Rs. ${(data.subtotal || data.total).toLocaleString()}`);
  formData.append('Shipping', data.shipping === 0 ? 'FREE Delivery Included' : `Rs. ${data.shipping}`);
  formData.append('TOTAL AMOUNT', `Rs. ${data.total.toLocaleString()}`);

  // Attach digital order receipt screenshot
  if (receiptBlob) {
    formData.append('Order_Details_Receipt_Screenshot', receiptBlob, `Order_${data.orderId}_Receipt.png`);
  }

  // Attach customer's payment screenshot if uploaded
  if (proofFile) {
    formData.append('Customer_Payment_Screenshot', proofFile, proofFile.name || `Payment_Proof_${data.orderId}.png`);
  }

  // If opened directly from file:/// protocol, skip external fetch
  if (isFileProtocol) {
    console.warn('Local file:/// protocol detected.');
    return;
  }

  // 6. Send via FormSubmit AJAX to softwareengineeringdesigner@gmail.com
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14000); // 14-second timeout

    const response = await fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeoutId);

    const json = await response.json().catch(() => null);

    if (json && (json.success === 'true' || json.success === true)) {
      console.log('Order email successfully delivered to:', OWNER_EMAIL);
      showToast('✅', 'Order Dispatched!', 'Order details & verification slip sent to management.', 'toast-success');
    } else {
      console.warn('FormSubmit response:', json || response.status);
    }
  } catch (err) {
    console.error('Email dispatch network error:', err);
  }
}

// Backwards compatibility wrappers
function sendOrderEmailCOD() {
  return sendOrderEmail(orderData, null);
}

function sendOrderEmailOnline() {
  return sendOrderEmail(orderData, uploadedFile);
}
/* ===== EMAIL SENDING DISPATCHER END ===== */

/* ===== TOAST NOTIFICATION START ===== */
function showToast(icon, title, message, type) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.classList.add('custom-toast');
  if (type) toast.classList.add(type);
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
/* ===== TOAST NOTIFICATION END ===== */

/* ===== HERO PARALLAX START ===== */
function initParallaxHero() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  hero.addEventListener('mousemove', function (e) {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const orb1 = hero.querySelector('.hero-bg-orb-1');
    const orb2 = hero.querySelector('.hero-bg-orb-2');
    const orb3 = hero.querySelector('.hero-bg-orb-3');
    if (orb1) orb1.style.transform = `translate(${x * 40}px, ${y * 30}px)`;
    if (orb2) orb2.style.transform = `translate(${x * -30}px, ${y * 20}px)`;
    if (orb3) orb3.style.transform = `translate(${x * 20}px, ${y * -25}px)`;
    const content = hero.querySelector('.hero-content');
    if (content) content.style.transform = `translate(${x * 8}px, ${y * 6}px)`;
  });
  hero.addEventListener('mouseleave', function () {
    const els = hero.querySelectorAll('.hero-bg-orb, .hero-content');
    els.forEach(el => el.style.transform = '');
  });
}
/* ===== HERO PARALLAX END ===== */

/* ===== 3D BOTTLE MOUSE MOVE START ===== */
function init3DBottleMouseMove() {
  const scene = document.querySelector('.bottle-scene');
  const container = document.querySelector('.hero-3d-container');
  if (!scene || !container) return;

  let isHovered = false;
  let currentX = 0, currentY = 0;
  let targetX = 0, targetY = 0;
  let rafId = null;

  function updateOrientation() {
    if (!isHovered) return;
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    scene.style.transform = `translateY(-12px) rotateY(${currentX.toFixed(2)}deg) rotateX(${currentY.toFixed(2)}deg)`;
    rafId = requestAnimationFrame(updateOrientation);
  }

  container.addEventListener('mouseenter', function () {
    isHovered = true;
    scene.style.animation = 'none';
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateOrientation);
  });

  container.addEventListener('mousemove', function (e) {
    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    targetX = ((e.clientX - cx) / (rect.width / 2)) * 16;
    targetY = -((e.clientY - cy) / (rect.height / 2)) * 12;
  });

  container.addEventListener('mouseleave', function () {
    isHovered = false;
    if (rafId) cancelAnimationFrame(rafId);
    scene.style.transform = '';
    scene.style.animation = '';
    scene.style.animationName = 'bottle-float';
    scene.style.animationDuration = '6s';
    scene.style.animationTimingFunction = 'ease-in-out';
    scene.style.animationIterationCount = 'infinite';
  });
}
/* ===== 3D BOTTLE MOUSE MOVE END ===== */

/* ===== FLOATING PARTICLES START ===== */
function createParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 6 + 3;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: -10%;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
}
/* ===== FLOATING PARTICLES END ===== */

/* ===== SCROLL REVEAL START ===== */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target); // unobserve after revealing
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    el.classList.remove('revealed');
    observer.observe(el);
  });
}
/* ===== SCROLL REVEAL END ===== */


/* ===== SCROLL EFFECTS (NAVBAR + SCROLL TOP) START ===== */
function initScrollEffects() {
  const navbar = document.getElementById('mainNav');
  const scrollBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 80) {
      if (navbar) navbar.classList.add('scrolled');
      if (scrollBtn) scrollBtn.classList.add('visible');
    } else {
      if (navbar) navbar.classList.remove('scrolled');
      if (scrollBtn) scrollBtn.classList.remove('visible');
    }
    // Highlight active nav section (disabled)
    // updateActiveNav();
  });

  // SCROLL TO TOP BUTTON CLICK - START
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  // SCROLL TO TOP BUTTON CLICK - COMPLETE

  // SCROLL INDICATOR CLICK - START
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      document.getElementById('offers').scrollIntoView({ behavior: 'smooth' });
    });
  }
  // SCROLL INDICATOR CLICK - COMPLETE
}

// UPDATE ACTIVE NAV LINK - START
function updateActiveNav() {
  const sections = ['hero', 'products', 'about', 'contact'];
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) current = id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
}
// UPDATE ACTIVE NAV LINK - COMPLETE
/* ===== SCROLL EFFECTS END ===== */

/* ===== CLOSE CHECKOUT MODAL AND RESET - START ===== */
function closeAndResetCheckout() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
  if (modal) modal.hide();
  currentStep = 1;
  selectedPayment = null;
  orderData = {};
  resetCheckoutForm();
}
/* ===== CLOSE CHECKOUT MODAL AND RESET - END ===== */

/* ===== WHATSAPP CHATBOT WIDGET START ===== */
function initWhatsAppChatbot() {
  const widget = document.getElementById('waChatWidget');
  const triggerBtn = document.getElementById('waTriggerBtn');
  const closeBtn = document.getElementById('waChatCloseBtn');
  const chatBox = document.getElementById('waChatBox');
  const chatBody = document.getElementById('waChatBody');
  const chatForm = document.getElementById('waChatForm');
  const chatInput = document.getElementById('waInput');
  const badge = document.getElementById('waBadge');
  const initialTime = document.getElementById('waInitialTime');
  const chipButtons = document.querySelectorAll('.wa-chip-btn');

  if (!widget || !triggerBtn || !chatForm) return;

  const PHONE_NUMBER = '923287004634';

  // Format current local time (e.g. 1:15 PM)
  function formatCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  // Set greeting timestamp on load
  if (initialTime) {
    initialTime.textContent = formatCurrentTime();
  }

  // Escape HTML helper
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Scroll chat to bottom helper
  function scrollChatToBottom() {
    if (chatBody) {
      setTimeout(() => {
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 50);
    }
  }

  // Toggle chat widget visibility
  function toggleChat(forceOpen) {
    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !widget.classList.contains('is-open');

    if (shouldOpen) {
      widget.classList.add('is-open');
      triggerBtn.classList.add('is-open');
      triggerBtn.setAttribute('aria-expanded', 'true');
      if (chatBox) chatBox.setAttribute('aria-hidden', 'false');
      if (badge) badge.classList.add('hidden');
      setTimeout(() => {
        if (chatInput) chatInput.focus();
        scrollChatToBottom();
      }, 150);
    } else {
      widget.classList.remove('is-open');
      triggerBtn.classList.remove('is-open');
      triggerBtn.setAttribute('aria-expanded', 'false');
      if (chatBox) chatBox.setAttribute('aria-hidden', 'true');
    }
  }

  // Toggle trigger button
  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleChat();
  });

  // Close button in header
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleChat(false);
    });
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (widget.classList.contains('is-open') && !widget.contains(e.target)) {
      toggleChat(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && widget.classList.contains('is-open')) {
      toggleChat(false);
    }
  });

  // Prevent clicks inside popup from bubbling to document
  if (chatBox) {
    chatBox.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Handle message sending to WhatsApp
  function handleSendMessage(messageText) {
    const rawMsg = (messageText || (chatInput ? chatInput.value : '')).trim();
    const finalMsg = rawMsg || "Assalam-o-Alaikum KAKA'S LIFE, I would like to inquire about your perfumes.";
    const currentTime = formatCurrentTime();

    // Append outgoing user message bubble
    const userRow = document.createElement('div');
    userRow.className = 'wa-msg-row wa-msg-outgoing';
    userRow.innerHTML = `
      <div class="wa-msg-bubble">
        <p class="wa-msg-text">${escapeHtml(finalMsg)}</p>
        <span class="wa-msg-time">${currentTime}</span>
      </div>
    `;
    chatBody.appendChild(userRow);

    // Append bot redirecting message bubble
    const botRow = document.createElement('div');
    botRow.className = 'wa-msg-row wa-msg-incoming';
    botRow.innerHTML = `
      <div class="wa-msg-bubble">
        <p class="wa-msg-text">
          <i class="bi bi-whatsapp" style="color:#25D366;margin-right:4px;"></i>
          Redirecting to WhatsApp...
        </p>
      </div>
    `;
    chatBody.appendChild(botRow);
    scrollChatToBottom();

    // Clear input
    if (chatInput) chatInput.value = '';

    // Build URL & redirect
    const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(finalMsg)}`;

    setTimeout(() => {
      try {
        window.open(waUrl, '_blank');
      } catch (err) {
        window.location.href = waUrl;
      }

      // Update bot message with active fallback link
      botRow.innerHTML = `
        <div class="wa-msg-bubble">
          <p class="wa-msg-text">
            WhatsApp opened! If it didn't open automatically, <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="color:#128c7e;font-weight:600;text-decoration:underline;">tap here to open WhatsApp</a>.
          </p>
          <span class="wa-msg-time">${formatCurrentTime()}</span>
        </div>
      `;
      scrollChatToBottom();
    }, 600);
  }

  // Form submit (Enter or Send button)
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSendMessage();
  });

  // Quick Chips click
  chipButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const msg = btn.getAttribute('data-msg');
      if (msg) {
        handleSendMessage(msg);
      }
    });
  });
}
/* ===== WHATSAPP CHATBOT WIDGET END ===== */

