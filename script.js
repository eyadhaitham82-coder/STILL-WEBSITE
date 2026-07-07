function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    // Close menu when a nav link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// Search
const searchBtn = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');
const searchNoResults = document.getElementById('searchNoResults');
const collectionItemsAll = document.querySelectorAll('.collection-item');

function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('is-open');
    searchOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    runSearch('');
    updateSearchSuggestions('');
    const shopAll = document.getElementById('shop-all');
    if (shopAll) shopAll.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('is-open');
    searchOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    runSearch('');
    if (searchSuggestions) {
        searchSuggestions.classList.remove('is-visible');
        searchSuggestions.innerHTML = '';
    }
}

function runSearch(query) {
    const q = (query || '').trim().toLowerCase();
    let visibleCount = 0;
    collectionItemsAll.forEach(item => {
        const name = (item.querySelector('h3') && item.querySelector('h3').textContent) || '';
        const match = !q || name.toLowerCase().includes(q);
        item.classList.toggle('search-hidden', !match);
        if (match) visibleCount++;
    });
    if (searchNoResults) searchNoResults.style.display = q && visibleCount === 0 ? 'block' : 'none';
}

function updateSearchSuggestions(query) {
    const q = (query || '').trim().toLowerCase();
    if (!searchSuggestions) return;

    if (!q) {
        searchSuggestions.classList.remove('is-visible');
        searchSuggestions.innerHTML = '';
        return;
    }

    const matchingItems = [];
    collectionItemsAll.forEach(item => {
        const name = (item.querySelector('h3') && item.querySelector('h3').textContent) || '';
        const price = (item.querySelector('.price') && item.querySelector('.price').textContent) || '';
        if (name.toLowerCase().includes(q)) {
            matchingItems.push({ element: item, name, price });
        }
    });

    searchSuggestions.innerHTML = '';
    if (matchingItems.length === 0) {
        searchSuggestions.classList.remove('is-visible');
        if (searchNoResults) searchNoResults.style.display = 'block';
        return;
    }

    if (searchNoResults) searchNoResults.style.display = 'none';
    searchSuggestions.classList.add('is-visible');

    matchingItems.forEach(({ element, name, price }) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'search-suggestion-item';
        btn.setAttribute('role', 'option');
        btn.innerHTML = `<span class="suggestion-name">${escapeHtml(name)}</span><span class="suggestion-price">${escapeHtml(price)}</span>`;
        btn.addEventListener('click', () => {
            const quickViewBtn = element.querySelector('.quick-view');
            if (quickViewBtn) {
                closeSearch();
                openQuickView(quickViewBtn);
            }
        });
        searchSuggestions.appendChild(btn);
    });
}

if (searchBtn) searchBtn.addEventListener('click', openSearch);
if (searchClose) searchClose.addEventListener('click', closeSearch);
if (searchOverlay) {
    const backdrop = searchOverlay.querySelector('.search-overlay-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeSearch);
}
if (searchInput) {
    searchInput.addEventListener('input', () => {
        const value = searchInput.value;
        runSearch(value);
        updateSearchSuggestions(value);
    });
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSearch();
    });
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('is-open')) closeSearch();
});

// Newsletter Form Submission
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // Show success message (you can customize this)
        alert(`You're on the list. We'll be in touch at ${email}.`);
        e.target.reset();
    });
}

// Collection Item Interaction — click anywhere on the card to open Quick View
const collectionItems = document.querySelectorAll('.collection-item');

// Quick View Modal
const quickViewModal = document.getElementById('quickViewModal');
const modalProductImage = document.getElementById('modalProductImage');
const modalProductName = document.getElementById('modalProductName');
const modalProductPrice = document.getElementById('modalProductPrice');
const quickViewOverlay = document.querySelector('.quick-view-overlay');
const quickViewClose = document.querySelector('.quick-view-close');
const modalSizeOptions = document.getElementById('modalSizeOptions');
const quickViewQuantity = document.getElementById('quickViewQuantity');
const quickQtyDec = document.getElementById('quickQtyDec');
const quickQtyInc = document.getElementById('quickQtyInc');
const quickQtyValue = document.getElementById('quickQtyValue');
let selectedQty = 1;

function getProductSizes(item) {
    const raw = item && item.dataset.sizes;
    if (raw) {
        return raw.split(',').map(s => s.trim()).filter(Boolean);
    }
    return ['Small', 'Medium', 'Large'];
}

function renderModalSizeOptions(sizes) {
    if (!modalSizeOptions) return;
    modalSizeOptions.innerHTML = sizes.map(size => {
        const safe = escapeHtml(size);
        return `<button type="button" class="size-btn" data-size="${safe}">${safe}</button>`;
    }).join('');
}

function openQuickView(button) {
    if (!quickViewModal) return;
    const item = button.closest('.collection-item');
    const name = item.querySelector('h3').textContent;
    const price = item.querySelector('.price').textContent;
    const imageContainer = item.querySelector('.collection-image');
    const imageSource = imageContainer.querySelector('img') || imageContainer.querySelector('.placeholder-image');

    modalProductName.textContent = name;
    modalProductPrice.textContent = price;

    modalProductImage.innerHTML = '';
    if (imageSource) {
        const clone = imageSource.cloneNode(true);
        if (clone.classList && clone.classList.contains('placeholder-image')) {
            clone.style.borderRadius = '0';
            clone.style.margin = '0';
        }
        modalProductImage.appendChild(clone);
    }

    renderModalSizeOptions(getProductSizes(item));
    if (modalSizeOptions) {
        modalSizeOptions.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
    }
    selectedQty = 1;
    if (quickQtyValue) quickQtyValue.textContent = String(selectedQty);
    if (quickViewQuantity) quickViewQuantity.style.display = 'none';
    quickViewModal.classList.add('is-open');
    quickViewModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    if (!quickViewModal) return;
    quickViewModal.classList.remove('is-open');
    quickViewModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

collectionItems.forEach(item => {
    item.addEventListener('click', () => {
        const quickViewBtn = item.querySelector('.quick-view');
        if (quickViewBtn) openQuickView(quickViewBtn);
    });
});

if (quickViewOverlay) quickViewOverlay.addEventListener('click', closeQuickView);
if (quickViewClose) quickViewClose.addEventListener('click', closeQuickView);

if (modalSizeOptions) {
    modalSizeOptions.addEventListener('click', (e) => {
        const btn = e.target.closest('.size-btn');
        if (!btn) return;
        modalSizeOptions.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        if (quickViewQuantity) quickViewQuantity.style.display = 'flex';
    });
}

if (quickQtyDec) {
    quickQtyDec.addEventListener('click', () => {
        selectedQty = Math.max(1, selectedQty - 1);
        if (quickQtyValue) quickQtyValue.textContent = String(selectedQty);
    });
}

if (quickQtyInc) {
    quickQtyInc.addEventListener('click', () => {
        selectedQty += 1;
        if (quickQtyValue) quickQtyValue.textContent = String(selectedQty);
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quickViewModal && quickViewModal.classList.contains('is-open')) {
        closeQuickView();
    }
});

// Cart
let cart = JSON.parse(localStorage.getItem('still-cart')) || [];

function normalizeCart() {
    cart = cart.map(item => ({
        ...item,
        qty: Math.max(1, parseInt(item.qty, 10) || 1)
    }));
}

function getCartItemKey(item) {
    return `${item.name}__${item.size}__${item.price}`;
}

function getCartUnitsCount() {
    return cart.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 1), 0);
}

function saveCart() {
    localStorage.setItem('still-cart', JSON.stringify(cart));
}

function addToCart(product) {
    const qtyAmount = Math.max(1, parseInt(product.qty, 10) || 1);
    const key = getCartItemKey(product);
    const existing = cart.find(item => getCartItemKey(item) === key);
    if (existing) {
        existing.qty = (parseInt(existing.qty, 10) || 1) + qtyAmount;
    } else {
        cart.push({ ...product, qty: qtyAmount });
    }
    saveCart();
    updateCartUI();
    showToast('Added to your bag.');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartFooter = document.getElementById('cartFooter');

    if (cartCount) cartCount.textContent = getCartUnitsCount();

    if (cartItems) {
        cartItems.querySelectorAll('.cart-item-row').forEach(el => el.remove());
        if (cartEmpty) cartEmpty.style.display = cart.length ? 'none' : 'block';

        cart.forEach((item, i) => {
            const thumb = item.imageSrc
                ? `<div class="cart-item-thumb"><img src="${escapeHtml(item.imageSrc)}" alt=""></div>`
                : item.imageStyle
                    ? `<div class="cart-item-thumb" style="background: ${escapeHtml(item.imageStyle)}"></div>`
                    : '<div class="cart-item-thumb cart-item-thumb-placeholder"></div>';
            const row = document.createElement('div');
            row.className = 'cart-item-row';
            row.innerHTML = `
                ${thumb}
                <div class="cart-item-info">
                    <strong>${escapeHtml(item.name)}</strong>
                    <span>${escapeHtml(item.size)} · Qty: ${item.qty || 1} · ${escapeHtml(typeof formatPrice === 'function' ? formatPrice(parsePrice(item.price)) : item.price)}</span>
                </div>
                <button type="button" class="cart-item-remove" data-index="${i}" aria-label="Remove">×</button>
            `;
            cartItems.appendChild(row);
        });
    }

    if (cartFooter) cartFooter.style.display = cart.length ? 'block' : 'none';

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.index, 10)));
    });
}

function showToast(message) {
    const existing = document.getElementById('cart-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.className = 'cart-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function getCartItemImage() {
    const container = document.getElementById('modalProductImage');
    if (!container || !container.firstElementChild) return {};
    const el = container.firstElementChild;
    if (el.tagName === 'IMG') return { imageSrc: el.getAttribute('src') || '' };
    if (el.style && el.style.background) return { imageStyle: el.style.background };
    return {};
}

function getQuickViewProduct() {
    if (!modalProductName || !modalProductPrice) return null;
    const selectedSize = document.querySelector('.size-btn.selected');
    if (!selectedSize) {
        showToast('Please choose a size.');
        return null;
    }
    const imageData = getCartItemImage();
    return {
        name: modalProductName.textContent,
        price: modalProductPrice.textContent,
        size: selectedSize.dataset.size,
        qty: selectedQty,
        imageSrc: imageData.imageSrc || null,
        imageStyle: imageData.imageStyle || null
    };
}

function proceedToCheckoutWithProduct(product) {
    cart = [{ ...product, qty: Math.max(1, parseInt(product.qty, 10) || 1) }];
    saveCart();
    updateCartUI();
    closeQuickView();
    window.location.href = 'checkout.html';
}

const quickViewAddBtn = document.querySelector('.quick-view-add');
if (quickViewAddBtn) {
    quickViewAddBtn.addEventListener('click', () => {
        const product = getQuickViewProduct();
        if (product) addToCart(product);
    });
}

const quickViewCheckoutBtn = document.querySelector('.quick-view-checkout');
if (quickViewCheckoutBtn) {
    quickViewCheckoutBtn.addEventListener('click', () => {
        const product = getQuickViewProduct();
        if (product) proceedToCheckoutWithProduct(product);
    });
}

const cartBtn = document.getElementById('cartBtn');
const cartDropdown = document.getElementById('cartDropdown');
const cartCloseBtn = document.getElementById('cartCloseBtn');

if (cartBtn && cartDropdown) {
    cartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cartDropdown.classList.toggle('is-open');
    });
}
if (cartCloseBtn && cartDropdown) {
    cartCloseBtn.addEventListener('click', () => cartDropdown.classList.remove('is-open'));
}
document.addEventListener('click', (e) => {
    if (cartDropdown && cartDropdown.classList.contains('is-open') &&
        !cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
        cartDropdown.classList.remove('is-open');
    }
});

normalizeCart();
saveCart();
updateCartUI();

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe collection items and sections for animations
document.querySelectorAll('.collection-item, .about-content, .newsletter-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});
