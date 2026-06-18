// ==========================================
// NUTSPICE - SHOP LOGIC & ANIMATIONS
// ==========================================

const products = [
    { id: 1, name: "Peri Peri Makhana", desc: "Fiery African bird's eye chili.", weight: "100g", price: 149, img: "./assets/peri-peri.png", color: "#D85035" },
    { id: 2, name: "Pudina Burst", desc: "Refreshing mint and spices.", weight: "100g", price: 149, img: "./assets/pudina-burst.png", color: "#4A7A59" },
    { id: 3, name: "Cream & Onion", desc: "Classic rich cream and chives.", weight: "100g", price: 149, img: "./assets/cream-onion.png", color: "#8A7BB4" },
    { id: 4, name: "Cheesy Makhana", desc: "Decadent cheddar cheese dust.", weight: "100g", price: 149, img: "./assets/cheesy.png", color: "#F29C38" }
];

// --- CART STATE ---
let cart = JSON.parse(localStorage.getItem('nutspice_cart')) || [];

const cartApp = {
    init() {
        this.renderProducts();
        this.updateCartUI();
        this.bindEvents();
    },

    renderProducts() {
        const grid = document.getElementById('product-grid');
        if (!grid) return;
        
        grid.innerHTML = products.map(p => `
            <div class="product-card gs-fade-up">
                <div class="product-image-container">
                    <img src="${p.img}" alt="${p.name}" class="product-image">
                </div>
                <div>
                    <h3 class="font-display text-dark-brown text-xl mb-05">${p.name}</h3>
                    <p class="text-sm text-choc-brown mb-1">${p.desc}</p>
                    <div class="product-meta">
                        <span class="badge border-brown">${p.weight}</span>
                        <span class="rating"><i class="ph-fill ph-star"></i> 4.9</span>
                    </div>
                    <div class="product-price">₹${p.price}</div>
                    <div class="product-actions">
                        <button class="btn btn-secondary btn-add magnetic" onclick="cartApp.addToCart(${p.id})">Add to Cart</button>
                        <button class="btn btn-buy magnetic" onclick="cartApp.buyNow(${p.id})">Buy Now</button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    addToCart(id) {
        const product = products.find(p => p.id === id);
        const existing = cart.find(item => item.id === id);
        
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        
        this.saveCart();
        this.openSidebar();
    },
    
    updateQty(id, delta) {
        const item = cart.find(item => item.id === id);
        if(!item) return;
        item.qty += delta;
        if(item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        this.saveCart();
    },

    saveCart() {
        localStorage.setItem('nutspice_cart', JSON.stringify(cart));
        this.updateCartUI();
    },

    updateCartUI() {
        // Update count
        const countEl = document.getElementById('cart-count');
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        if (countEl) countEl.innerText = totalQty;

        // Update items list
        const container = document.getElementById('cart-items-container');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="text-center mt-4">
                    <i class="ph ph-shopping-cart text-choc-brown" style="font-size: 3rem; opacity: 0.2;"></i>
                    <p class="mt-1 text-choc-brown">Your cart is empty.</p>
                </div>
            `;
        } else {
            container.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.img}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4 class="font-display text-dark-brown">${item.name}</h4>
                        <div class="text-brand-orange font-bold">₹${item.price}</div>
                        <div class="cart-qty-ctrl">
                            <button class="qty-btn" onclick="cartApp.updateQty(${item.id}, -1)">-</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn" onclick="cartApp.updateQty(${item.id}, 1)">+</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Update total
        const totalEl = document.getElementById('cart-total-price');
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        if (totalEl) totalEl.innerText = `₹${total}`;
    },

    buyNow(id) {
        // Clear cart and add this single item
        cart = [];
        this.addToCart(id);
        window.location.href = 'checkout.html';
    },

    openSidebar() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if(sidebar) sidebar.classList.add('open');
        if(overlay) overlay.classList.add('show');
    },
    
    closeSidebar() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if(sidebar) sidebar.classList.remove('open');
        if(overlay) overlay.classList.remove('show');
    },

    bindEvents() {
        const btn = document.getElementById('cart-btn');
        const overlay = document.getElementById('cart-overlay');
        const close = document.getElementById('close-cart-btn');
        
        if(btn) btn.addEventListener('click', () => this.openSidebar());
        if(overlay) overlay.addEventListener('click', () => this.closeSidebar());
        if(close) close.addEventListener('click', () => this.closeSidebar());
    }
};

// --- INITIALIZE GSAP & LENIS ---
const lenis = new Lenis({
    duration: 0.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1.5,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
    cartApp.init();

    // Fade up animations
    gsap.utils.toArray('.gs-fade-up').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 85%" },
            y: 40, opacity: 0, duration: 1, ease: "power3.out"
        });
    });

    // Comparison Bars Animation
    gsap.utils.toArray('.gs-bar').forEach(bar => {
        gsap.to(bar, {
            scrollTrigger: { trigger: bar, start: "top 80%" },
            width: bar.getAttribute('data-width'),
            duration: 1.5, ease: "power3.out"
        });
    });

    initMagneticCursor();
    initFAQ();
    initParticles();
});

// --- CURSOR LOGIC ---
function initMagneticCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if(!cursor || !follower) return;

    gsap.set(cursor, {xPercent: -50, yPercent: -50});
    gsap.set(follower, {xPercent: -50, yPercent: -50});

    let xTo = gsap.quickTo(cursor, "x", {duration: 0, ease: "none"}),
        yTo = gsap.quickTo(cursor, "y", {duration: 0, ease: "none"}),
        xfTo = gsap.quickTo(follower, "x", {duration: 0.1, ease: "power3"}),
        yfTo = gsap.quickTo(follower, "y", {duration: 0.1, ease: "power3"});

    document.addEventListener('mousemove', (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
        xfTo(e.clientX);
        yfTo(e.clientY);
    });

    const magneticElements = document.querySelectorAll('a, button, .magnetic, .faq-head, .product-card, input');
    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 0, duration: 0.3 });
            gsap.to(follower, { scale: 1.5, backgroundColor: 'rgba(96,59,23,0.1)', border: '1px solid transparent', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, duration: 0.3 });
            gsap.to(follower, { scale: 1, backgroundColor: 'transparent', border: '1px solid var(--dark-brown)', duration: 0.3 });
        });
    });
}

// --- FAQ ACCORDION ---
function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
        const head = item.querySelector('.faq-head');
        head.addEventListener('click', () => {
            // Close others
            items.forEach(i => {
                if(i !== item) {
                    i.classList.remove('active');
                    gsap.to(i.querySelector('.faq-body'), {height: 0, paddingTop: 0, duration: 0.4, ease: "power2.out"});
                }
            });
            // Toggle current
            const body = item.querySelector('.faq-body');
            if(item.classList.contains('active')) {
                item.classList.remove('active');
                gsap.to(body, {height: 0, paddingTop: 0, duration: 0.4, ease: "power2.out"});
            } else {
                item.classList.add('active');
                gsap.set(body, {height: 'auto'});
                const targetHeight = body.offsetHeight;
                gsap.set(body, {height: 0});
                gsap.to(body, {height: targetHeight, paddingTop: '1rem', duration: 0.4, ease: "power2.out"});
            }
        });
    });
}

// --- PARTICLES ---
function initParticles() {
    const container = document.getElementById('shop-particles');
    if(!container) return;
    for(let i=0; i<20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.width = Math.random() * 5 + 3 + 'px';
        p.style.height = p.style.width;
        container.appendChild(p);
        
        gsap.to(p, {
            y: -100 - Math.random() * 100,
            x: -50 + Math.random() * 100,
            rotation: 360,
            duration: 5 + Math.random() * 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
}
