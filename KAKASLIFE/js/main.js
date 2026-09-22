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
    name: "Aurelia Gold",
    category: "Pour Femme",
    description: "A radiant, opulent fragrance featuring top notes of bergamot and mandarin, a heart of jasmine and ylang-ylang, and a rich base of amber, musk, and sandalwood. Perfect for the woman who commands every room she enters.",
    scentNotes: ["Bergamot", "Jasmine", "Amber", "Musk", "Sandalwood"],
    price: 4500,
    originalPrice: null,
    image: "images/perfume_gold.jpg",
    badge: "coming-soon",
    badgeText: "COMING SOON",
    rating: 4.9,
    reviews: 142,
    volume: "100ml",
    filter: "women"
  },
  {
    id: 2,
    name: "Rose Elegance",
    category: "Pour Femme",
    description: "An exquisite floral masterpiece. The sweetness of Bulgarian rose petals dances with fresh peony and a whisper of lychee, resting on a delicate base of white musk and cedarwood. Feminine, timeless, unforgettable.",
    scentNotes: ["Rose", "Peony", "Lychee", "White Musk", "Cedarwood"],
    price: 3800,
    originalPrice: null,
    image: "images/perfume_rose.jpg",
    badge: "coming-soon",
    badgeText: "COMING SOON",
    rating: 4.8,
    reviews: 87,
    volume: "75ml",
    filter: "women"
  },
  {
    id: 3,
    name: "Nocturne Bleu",
    category: "Pour Homme",
    description: "A bold, mysterious fragrance for the modern man. Opens with crisp ozonic notes and cardamom, deepens into leather and vetiver, and settles into a smoky base of dark wood and tonka bean. Power, elegance, mystery.",
    scentNotes: ["Cardamom", "Leather", "Vetiver", "Dark Wood", "Tonka Bean"],
    price: 5200,
    originalPrice: null,
    image: "images/perfume_noir.jpg",
    badge: "coming-soon",
    badgeText: "COMING SOON",
    rating: 4.9,
    reviews: 203,
    volume: "100ml",
    filter: "men"
  },
  {
    id: 4,
    name: "Oud Royal",
    category: "Unisex",
    description: "A majestic Oriental fragrance inspired by ancient Arabian perfumery. Rich, smoky oud intertwines with saffron, rose, and a warm base of amber and benzoin. Wear it as your signature — powerful, precious, regal.",
    scentNotes: ["Oud", "Saffron", "Rose", "Amber", "Benzoin"],
    price: 7500,
    originalPrice: null,
    image: "images/perfume_gold.jpg",
    badge: "coming-soon",
    badgeText: "COMING SOON",
    rating: 5.0,
    reviews: 318,
    volume: "100ml",
    filter: "unisex"
  },
  {
    id: 5,
    name: "Velvet Dusk",
    category: "Pour Femme",
    description: "A sensual evening fragrance that wraps you in luxury. Warm vanilla bourbon meets smoky iris and violet, enveloped in a velvety base of musk and praline. The perfect fragrance from dusk till dawn.",
    scentNotes: ["Vanilla", "Iris", "Violet", "Musk", "Praline"],
    price: 4200,
    originalPrice: null,
    image: "images/perfume_rose.jpg",
    badge: "coming-soon",
    badgeText: "COMING SOON",
    rating: 4.7,
    reviews: 95,
    volume: "75ml",
    filter: "women"
  },
  {
    id: 6,
    name: "Cedar Storm",
    category: "Pour Homme",
    description: "Fresh, woody, and invigorating. Top notes of green tea and citrus give way to a heart of lavender and geranium, settling into a masculine base of cedarwood, patchouli, and white musks. Confidence in a bottle.",
    scentNotes: ["Green Tea", "Lavender", "Geranium", "Cedarwood", "Patchouli"],
    price: 3500,
    originalPrice: null,
    image: "images/perfume_noir.jpg",
    badge: "coming-soon",
    badgeText: "COMING SOON",
    rating: 4.6,
    reviews: 64,
    volume: "100ml",
    filter: "men"
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

// EmailJS Config (REPLACE WITH YOUR EMAILJS KEYS)
const EMAIL_CONFIG = {
  serviceID: 'YOUR_EMAILJS_SERVICE_ID',   // <-- REPLACE
  templateID: 'YOUR_EMAILJS_TEMPLATE_ID', // <-- REPLACE
  publicKey: 'YOUR_EMAILJS_PUBLIC_KEY'    // <-- REPLACE
};
const OWNER_EMAIL = 'your.email@gmail.com'; // <-- REPLACE with your email
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
});
/* ===== DOM READY END ===== */

/* ===== PRODUCT RENDERING START ===== */
function renderProducts(filter) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.filter === filter);
  grid.innerHTML = '';
  filtered.forEach((p, i) => {
    const card = createProductCard(p, i);
    grid.innerHTML += card;
  });
}

function createProductCard(p, idx) {
  const delay = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3'][idx % 4];
  const stars = generateStars(p.rating);
  const priceHTML = `
    <span class="price-regular">Rs. ${p.price.toLocaleString()}</span>
    <span class="coming-soon-pill"><i class="bi bi-clock"></i> Coming Soon</span>`;

  const badgeHTML = `<span class="product-badge badge-coming-soon"><i class="bi bi-clock"></i> COMING SOON</span>`;

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
          <p class="product-category">${p.category}</p>
          <h3 class="product-name">${p.name}</h3>
          <p class="product-desc-short">${p.description}</p>
          <div class="product-rating">
            <span class="stars">${stars}</span>
            <span class="rating-count">(${p.reviews})</span>
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
// ADD TO CART FROM CARD BUTTON - START
function addToCartFromCard(productId, btnEl) {
  showToast('⏳', 'Coming Soon!', 'Our luxury fragrances are launching soon. Orders are currently closed.', 'toast-warning');
}
// ADD TO CART FROM CARD BUTTON - COMPLETE

// ADD TO CART CORE FUNCTION - START
function addToCart(productId, qty) {
  showToast('⏳', 'Coming Soon!', 'Our luxury fragrances are launching soon. Orders are currently closed.', 'toast-warning');
  return false;
}
// ADD TO CART CORE FUNCTION - COMPLETE

// UPDATE CART BADGE COUNT - START
function updateCartBadge() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  badge.textContent = totalQty;
  if (totalQty > 0) {
    badge.classList.remove('d-none');
  } else {
    badge.classList.add('d-none');
  }
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
  const shipping = cart.length > 0 ? 200 : 0;
  const total = subtotal + shipping;
  const el = id => document.getElementById(id);
  if (el('cartSubtotal')) el('cartSubtotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
  if (el('cartShipping')) el('cartShipping').textContent = shipping > 0 ? `Rs. ${shipping.toLocaleString()}` : 'FREE';
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
  if (e.target.closest('#cartBtn')) {
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

/* ===== PROD// OPEN PRODUCT MODAL - START
function openProductModal(productId) {
  currentProductId = productId;
  const p = getProduct(productId);
  if (!p) return;

  const priceHTML = `
    <span class="price-regular" style="font-size:1.6rem;">Rs. ${p.price.toLocaleString()}</span>
    <span class="coming-soon-pill" style="font-size:0.8rem;padding:6px 14px;"><i class="bi bi-clock"></i> Coming Soon</span>`;

  const scentHTML = p.scentNotes.map(n => `<span class="scent-note-tag">${n}</span>`).join('');
  const stars = generateStars(p.rating);

  document.getElementById('modalProductImg').src = p.image;
  document.getElementById('modalProductImg').alt = p.name;
  document.getElementById('modalProductCategory').textContent = p.category;
  document.getElementById('modalProductName').textContent = p.name;
  if (document.getElementById('modalProductName2')) document.getElementById('modalProductName2').textContent = p.name;
  document.getElementById('modalProductDesc').textContent = p.description;
  document.getElementById('modalProductVolume').textContent = p.volume;
  document.getElementById('modalProductPrice').innerHTML = priceHTML;
  document.getElementById('modalScentNotes').innerHTML = scentHTML;
  document.getElementById('modalStars').innerHTML = stars;
  document.getElementById('modalReviews').textContent = `(${p.reviews} reviews)`;
  if (document.getElementById('modalQty')) document.getElementById('modalQty').value = 1;

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
  showToast('⏳', 'Coming Soon!', 'Our luxury fragrances are launching soon. Orders are currently closed.', 'toast-warning');
}
// ADD TO CART FROM MODAL BUTTON - COMPLETE

/* ===== PRODUCT DETAIL MODAL END ===== */

/* ===== CHECKOUT FLOW START ===== */

// PLACE ORDER BUTTON CLICK - START
function placeOrder() {
  showToast('⏳', 'Coming Soon!', 'Our collection is launching soon. Orders are currently closed.', 'toast-warning');
  return;
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
      </div>
      <div class="order-item-price">Rs. ${(p.price * item.qty).toLocaleString()}</div>
    </div>`;
  }).join('');

  const subtotal = cart.reduce((s, i) => { const p = getProduct(i.id); return s + (p ? p.price * i.qty : 0); }, 0);
  const total = subtotal + 200;

  document.getElementById('codOrderItems').innerHTML = items;
  document.getElementById('codOrderTotal').textContent = `Rs. ${total.toLocaleString()}`;
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
        <div class="order-item-qty">x${item.qty}</div>
      </div>
      <div class="order-item-price">Rs. ${(p.price * item.qty).toLocaleString()}</div>
    </div>`;
  }).join('');

  const subtotal = cart.reduce((s, i) => { const p = getProduct(i.id); return s + (p ? p.price * i.qty : 0); }, 0);
  const total = subtotal + 200;
  document.getElementById('onlineOrderItems').innerHTML = items;
  document.getElementById('onlineOrderTotal').textContent = `Rs. ${total.toLocaleString()}`;
}
// RENDER ORDER SUMMARY ON STEP 4 (ONLINE) - COMPLETE

// CONFIRM COD ORDER BUTTON CLICK - START
function confirmCODOrder() {
  orderData.orderId = 'KL-' + Date.now().toString().slice(-6);
  orderData.items = cart.map(item => {
    const p = getProduct(item.id);
    return p ? { name: p.name, qty: item.qty, price: p.price * item.qty } : null;
  }).filter(Boolean);
  orderData.total = cart.reduce((s, i) => { const p = getProduct(i.id); return s + (p ? p.price * i.qty : 0); }, 0) + 200;

  sendOrderEmailCOD();
  goToStep(5);
  document.getElementById('successOrderId').textContent = `Order ID: ${orderData.orderId}`;
  cart = [];
  saveCart();
  updateCartUI();
}
// CONFIRM COD ORDER BUTTON CLICK - COMPLETE

// SUBMIT ONLINE PAYMENT PROOF BUTTON CLICK - START
function submitPaymentProof() {
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

  orderData.trxId = trxId.value.trim();
  orderData.screenshot = uploadedFile ? uploadedFile.name : 'Uploaded';
  orderData.orderId = 'KL-' + Date.now().toString().slice(-6);
  orderData.items = cart.map(item => {
    const p = getProduct(item.id);
    return p ? { name: p.name, qty: item.qty, price: p.price * item.qty } : null;
  }).filter(Boolean);
  orderData.total = cart.reduce((s, i) => { const p = getProduct(i.id); return s + (p ? p.price * i.qty : 0); }, 0) + 200;

  sendOrderEmailOnline();
  goToStep(5);
  document.getElementById('successOrderId').textContent = `Order ID: ${orderData.orderId}`;
  cart = [];
  saveCart();
  updateCartUI();
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
  document.querySelectorAll('.payment-option-card').forEach(c => c.classList.remove('selected'));
  const zone = document.getElementById('screenshotZone');
  if (zone) { zone.classList.remove('has-file'); }
  const fname = document.getElementById('fileNameDisplay');
  if (fname) fname.textContent = '';
}
// RESET CHECKOUT FORM - COMPLETE

/* ===== CHECKOUT FLOW END ===== */

/* ===== EMAIL SENDING START ===== */

/*
 * HOW TO INTEGRATE EMAILJS:
 * 1. Sign up at https://www.emailjs.com/ (Free plan available)
 * 2. Create a service (Gmail/Outlook etc.)
 * 3. Create an email template with these template variables:
 *    {{order_id}}, {{customer_name}}, {{phone}}, {{address}},
 *    {{city}}, {{postal_code}}, {{items}}, {{total}}, {{payment_method}},
 *    {{trx_id}} (for online payment)
 * 4. Copy your Service ID, Template ID, and Public Key
 * 5. Replace the values in EMAIL_CONFIG at the top of this file
 * 6. Include EmailJS SDK in index.html:
 *    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
 *    <script>emailjs.init("YOUR_PUBLIC_KEY");</script>
 */

// SEND COD ORDER EMAIL - START
function sendOrderEmailCOD() {
  const itemsText = orderData.items.map(i => `${i.name} x${i.qty} = Rs. ${i.price.toLocaleString()}`).join('\n');

  // OPTION 1: EMAILJS (Recommended)
  // Uncomment below when EmailJS is configured:
  /*
  emailjs.send(EMAIL_CONFIG.serviceID, EMAIL_CONFIG.templateID, {
    order_id: orderData.orderId,
    customer_name: orderData.address.fullName,
    phone: orderData.address.phone,
    address: orderData.address.address,
    city: orderData.address.city,
    postal_code: orderData.address.postalCode,
    items: itemsText,
    total: 'Rs. ' + orderData.total.toLocaleString(),
    payment_method: 'Cash on Delivery (COD)'
  }).then(() => {
    console.log('Order email sent!');
  }).catch(err => {
    console.error('Email failed:', err);
  });
  */

  // OPTION 2: MAILTO FALLBACK (works without EmailJS)
  const body = encodeURIComponent(
    `NEW ORDER - CASH ON DELIVERY\n\n` +
    `Order ID: ${orderData.orderId}\n` +
    `Customer: ${orderData.address.fullName}\n` +
    `Phone: ${orderData.address.phone}\n` +
    `Address: ${orderData.address.address}, ${orderData.address.city} - ${orderData.address.postalCode}\n\n` +
    `ITEMS:\n${itemsText}\n\n` +
    `TOTAL: Rs. ${orderData.total.toLocaleString()}\n` +
    `Payment: Cash on Delivery\n\n` +
    `Please process this order. Thank you!`
  );
  // Auto-trigger mailto (replace with your email below)
  const mailLink = `mailto:${OWNER_EMAIL}?subject=New Order ${orderData.orderId} - COD&body=${body}`;
  window.open(mailLink, '_blank');
}
// SEND COD ORDER EMAIL - COMPLETE

// SEND ONLINE PAYMENT ORDER EMAIL - START
function sendOrderEmailOnline() {
  const itemsText = orderData.items.map(i => `${i.name} x${i.qty} = Rs. ${i.price.toLocaleString()}`).join('\n');

  // OPTION 1: EMAILJS (Recommended - supports file attachments)
  // Uncomment below when EmailJS is configured:
  /*
  emailjs.send(EMAIL_CONFIG.serviceID, EMAIL_CONFIG.templateID, {
    order_id: orderData.orderId,
    customer_name: orderData.address.fullName,
    phone: orderData.address.phone,
    address: orderData.address.address,
    city: orderData.address.city,
    postal_code: orderData.address.postalCode,
    items: itemsText,
    total: 'Rs. ' + orderData.total.toLocaleString(),
    payment_method: 'Online Payment',
    trx_id: orderData.trxId,
    screenshot: orderData.screenshot
  });
  */

  // OPTION 2: MAILTO FALLBACK
  const body = encodeURIComponent(
    `NEW ORDER - ONLINE PAYMENT\n\n` +
    `Order ID: ${orderData.orderId}\n` +
    `Customer: ${orderData.address.fullName}\n` +
    `Phone: ${orderData.address.phone}\n` +
    `Address: ${orderData.address.address}, ${orderData.address.city} - ${orderData.address.postalCode}\n\n` +
    `ITEMS:\n${itemsText}\n\n` +
    `TOTAL: Rs. ${orderData.total.toLocaleString()}\n` +
    `Payment: Online Payment\n` +
    `Transaction ID: ${orderData.trxId}\n` +
    `Screenshot File: ${orderData.screenshot}\n\n` +
    `NOTE: Payment screenshot file will be sent separately.\n` +
    `Please verify and process this order. Thank you!`
  );
  const mailLink = `mailto:${OWNER_EMAIL}?subject=New Order ${orderData.orderId} - Online Payment&body=${body}`;
  window.open(mailLink, '_blank');
}
// SEND ONLINE PAYMENT ORDER EMAIL - COMPLETE

/* ===== EMAIL SENDING END ===== */

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
  container.addEventListener('mousemove', function (e) {
    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rotY = ((e.clientX - cx) / (rect.width / 2)) * 20;
    const rotX = -((e.clientY - cy) / (rect.height / 2)) * 15;
    scene.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;
    scene.style.animation = 'none';
  });
  container.addEventListener('mouseleave', function () {
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
      }
    });
  }, { threshold: 0.1 });
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
    // Highlight active nav section
    updateActiveNav();
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
