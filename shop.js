// ==========================================
// NUTSPICE - SHOP LOGIC & ANIMATIONS
// ==========================================

const products = [
    { id: 1, name: "Peri Peri Makhana", desc: "Fiery African bird's eye chili.", weight: "100g", price: 149, img: "./assets/peri-peri.png", color: "#D85035", url: "product-peri-peri.html" },
    { id: 2, name: "Pudina Burst", desc: "Refreshing mint and spices.", weight: "100g", price: 149, img: "./assets/pudina-burst.png", color: "#4A7A59", url: "product-pudina.html" },
    { id: 3, name: "Cream & Onion", desc: "Classic rich cream and chives.", weight: "100g", price: 149, img: "./assets/cream-onion.png", color: "#8A7BB4", url: "product-cream-onion.html" },
    { id: 4, name: "Cheesy Makhana", desc: "Decadent cheddar cheese dust.", weight: "100g", price: 149, img: "./assets/cheesy.png", color: "#F29C38", url: "product-cheesy.html" }
];

// --- CART STATE ---

const cartApp = {
    init() {
        this.renderProducts();
    },

    renderProducts() {
        const grid = document.getElementById('product-grid');
        if (!grid) return;
        
        grid.innerHTML = products.map(p => `
            <div class="product-card gs-fade-up">
                <div class="product-image-container">
                    <a href="${p.url}"><img src="${p.img}" alt="${p.name}" class="product-image"></a>
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
                        <button class="btn btn-secondary btn-add magnetic" onclick="cartApp.addToCart(${p.id}, this)">Add to Cart</button>
                        <button class="btn btn-buy magnetic" onclick="cartApp.buyNow(${p.id})">Buy Now</button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    addToCart(id, originElement) {
        const product = products.find(p => p.id === id);
        if (window.globalCart) {
            window.globalCart.addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                flavour: product.flavour,
                image: product.img
            }, originElement);
        }
    },
    
    buyNow(id) {
        if (window.globalCart) {
            window.globalCart.cart = [];
            this.addToCart(id, null);
            window.location.href = 'checkout.html';
        }
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
    // Custom cursor removed
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

// ==========================================
// SCROLLSPY (ADDED)
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').includes('#' + id)) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(sec => observer.observe(sec));
    }
});
