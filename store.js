let allProducts = JSON.parse(localStorage.getItem("angaworld_products")) || INITIAL_PRODUCTS;
let displayedCount = 0;
const BATCH_SIZE = 8;
let currentCategory = "All";
let searchQuery = "";
let currentSlide = 0;
let carouselTimer = null;

const DEFAULT_BANNERS = [
  {
    title: "The Grand Anga Handloom Festival",
    subtitle: "Direct from master weavers of Bhagalpur & eastern craft clusters. Up to 40% off.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80",
    linkText: "Explore Pure Silks",
    category: "Handloom Sarees"
  },
  {
    title: "Sacred Folk Arts & Terracotta Decor",
    subtitle: "GI-Certified Madhubani paintings, Dokra brass inlays, and festive pottery.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1600&q=80",
    linkText: "Shop Heritage Decor",
    category: "Home Decor"
  },
  {
    title: "Artisanal Stoles & Royal Ethnic Wear",
    subtitle: "Manjusha scroll art silk scarves and hand-woven chanderi dupattas.",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1600&q=80",
    linkText: "Discover Handcrafted Stoles",
    category: "Stoles & Dupattas"
  }
];

let activeBanners = JSON.parse(localStorage.getItem("angaworld_banners")) || DEFAULT_BANNERS;

document.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  updateCartBadge();
  loadInitialProducts();
  setupInfiniteScroll();
});

function initCarousel() {
  const container = document.getElementById("carouselSlides");
  if (!container) return;

  container.innerHTML = activeBanners.map((banner, idx) => `
    <div class="carousel-slide ${idx === 0 ? 'active' : ''}" style="background-image: url('${banner.image}');">
      <div class="carousel-content">
        <h2>${banner.title}</h2>
        <p>${banner.subtitle}</p>
        <a href="#catalog" class="btn-carousel" onclick="filterCategory('${banner.category}')">${banner.linkText} →</a>
      </div>
      <div class="carousel-gradient-overlay"></div>
    </div>

  `).join('');

  startCarouselAuto();
}

function startCarouselAuto() {
  if (carouselTimer) clearInterval(carouselTimer);
  carouselTimer = setInterval(() => nextSlide(), 5000);
}

function nextSlide() {
  const slides = document.querySelectorAll(".carousel-slide");
  if (!slides.length) return;
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
}

function prevSlide() {
  const slides = document.querySelectorAll(".carousel-slide");
  if (!slides.length) return;
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
}

function getFilteredCatalog() {
  allProducts = JSON.parse(localStorage.getItem("angaworld_products")) || INITIAL_PRODUCTS;
  return allProducts.filter(item => {
    const matchCat = (currentCategory === "All") || (item.category === currentCategory);
    const matchSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery) ||
      item.origin.toLowerCase().includes(searchQuery) ||
      item.category.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });
}

function loadInitialProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = "";
  displayedCount = 0;
  loadMoreProducts();
}

function loadMoreProducts() {
  const grid = document.getElementById("productGrid");
  const loader = document.getElementById("infiniteLoader");
  const filtered = getFilteredCatalog();

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: #fff; border-radius: 8px;">
        <h3>No matching ethnic items found</h3>
        <p style="color: #666; margin-top: 8px;">Try searching for "silk", "handloom", "terracotta", or check all categories.</p>
      </div>`;
    if (loader) loader.style.display = "none";
    return;
  }

  const start = displayedCount;
  const countToLoad = Math.min(BATCH_SIZE, 300);

  for (let i = 0; i < countToLoad; i++) {
    const itemIndex = (start + i) % filtered.length;
    const baseItem = filtered[itemIndex];
    const item = { ...baseItem, uid: baseItem.id + "-" + (start + i) };
    
    const card = createProductCardHTML(item);
    grid.insertAdjacentHTML("beforeend", card);
  }

  displayedCount += countToLoad;
  if (loader) loader.style.display = "flex";
}

function createProductCardHTML(item) {
  const primaryImg = item.images && item.images.length > 0 ? item.images[0] : "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";
  const starsString = "★".repeat(Math.floor(item.rating || 5)) + "☆".repeat(5 - Math.floor(item.rating || 5));
  
  return `
    <article class="product-card" id="card-${item.uid}">
      <div class="card-media-box">
        <span class="badge-artisan-origin">📍 ${item.origin || 'Anga Heritage'}</span>
        ${item.discount ? `<span class="badge-deal">${item.discount}</span>` : ''}
        <img src="${primaryImg}" alt="${item.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'" />
      </div>

      <div class="ratings-row">
        <span class="stars">${starsString}</span>
        <span class="review-count">(${item.reviewsCount || 120})</span>
      </div>

      <h4 class="product-title" title="${item.title}">${item.title}</h4>

      <div class="prime-row">
        <span class="badge-anga-express">AngaExpress</span>
        <span class="prime-delivery">FREE delivery by <b>Tomorrow</b></span>
      </div>

      <div class="price-row">
        <span class="price-symbol">₹</span>
        <span class="price-main">${Number(item.price).toLocaleString("en-IN")}</span>
        ${item.mrp ? `<span class="price-mrp">₹${Number(item.mrp).toLocaleString("en-IN")}</span>` : ''}
      </div>

      <button class="btn-add-cart" onclick="quickAddToCart('${item.id}', '${item.title.replace(/'/g, "\\\\'")}', ${item.price}, '${primaryImg}')">
        Add to Cart
      </button>
    </article>
  `;
}

function setupInfiniteScroll() {
  const loader = document.getElementById("infiniteLoader");
  if (!loader) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(() => {
        loadMoreProducts();
      }, 300);
    }
  }, { rootMargin: "250px" });

  observer.observe(loader);
}

function filterCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.innerText.includes(cat) || (cat === "All" && btn.innerText.includes("All")));
  });
  loadInitialProducts();
}

function executeSearch() {
  const input = document.getElementById("amazonSearchInput");
  const catSelect = document.getElementById("searchCategorySelect");
  if (input) searchQuery = input.value.trim().toLowerCase();
  if (catSelect && catSelect.value !== "All") currentCategory = catSelect.value;
  loadInitialProducts();
}

function quickAddToCart(id, title, price, image) {
  let cart = JSON.parse(localStorage.getItem("angaworld_cart")) || [];
  const existing = cart.find(x => x.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, title, price, image, quantity: 1 });
  }
  localStorage.setItem("angaworld_cart", JSON.stringify(cart));
  updateCartBadge();
  showQuickToast(`✓ Added to Cart: ${title.substring(0, 30)}...`);
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("angaworld_cart")) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll(".cartCountDisplay");
  badges.forEach(b => b.innerText = totalCount);
}

function showQuickToast(msg) {
  let toast = document.getElementById("quickToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "quickToast";
    toast.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; background: #131921;
      color: #FFF; padding: 12px 20px; border-radius: 6px; border-left: 4px solid #FF9900;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3); z-index: 99999; font-size: 13px; font-weight: 600;
    `;
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 3200);
}