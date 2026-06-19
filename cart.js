/**
 * Global Luxury Morphing Cart Experience
 * Depends on GSAP.
 */

class GlobalCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('nutspice_cart')) || [];
        this.isOpen = false;
        this.isAnimating = false;
        this.mobileBreakpoint = 768;
        
        this.initDOM();
        this.bindEvents();
        this.render();
    }

    initDOM() {
        // Create backdrop
        if (!document.getElementById('cart-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.id = 'cart-backdrop';
            document.body.appendChild(backdrop);
        }
        this.backdrop = document.getElementById('cart-backdrop');

        // Create Cart Panel
        if (!document.getElementById('global-cart')) {
            const cartPanel = document.createElement('div');
            cartPanel.id = 'global-cart';
            cartPanel.innerHTML = `
                <div class="cart-header">
                    <h2>Your Cart</h2>
                    <i class="ph ph-x close-cart magnetic" id="global-cart-close"></i>
                </div>
                <div class="cart-items" id="global-cart-items"></div>
                <div class="cart-footer">
                    <div class="cart-summary">
                        <span>Total</span>
                        <span id="global-cart-total">₹0</span>
                    </div>
                    <div class="cart-footer-btns" id="global-cart-btns">
                        <button class="btn btn-primary w-100 magnetic" onclick="window.location.href='checkout.html'">Proceed to Checkout</button>
                        <button class="btn btn-secondary w-100 magnetic" id="global-cart-continue">Continue Shopping</button>
                    </div>
                </div>
            `;
            document.body.appendChild(cartPanel);
        }
        this.panel = document.getElementById('global-cart');
        this.itemsContainer = document.getElementById('global-cart-items');
        this.totalEl = document.getElementById('global-cart-total');
        
        // Create Toast
        if (!document.getElementById('cart-toast')) {
            const toast = document.createElement('div');
            toast.id = 'cart-toast';
            toast.className = 'cart-toast';
            toast.innerHTML = `<i class="ph-fill ph-check-circle"></i> <span>Added To Cart</span>`;
            document.body.appendChild(toast);
        }
        this.toast = document.getElementById('cart-toast');

        // Update all cart buttons in the DOM (add previews)
        this.updateCartButtonsDOM();
    }

    updateCartButtonsDOM() {
        document.querySelectorAll('.cart-global-btn').forEach(btn => {
            // Append tooltip if not exists
            if (!btn.querySelector('.cart-preview-tooltip')) {
                const tooltip = document.createElement('div');
                tooltip.className = 'cart-preview-tooltip';
                tooltip.innerHTML = `
                    <div class="preview-header">
                        <span>Cart</span>
                        <span class="preview-count">0 items</span>
                    </div>
                    <div class="preview-content">
                        Total: <span class="preview-total text-brand-orange font-bold">₹0</span>
                    </div>
                    <div class="text-brand-orange preview-btn font-bold">Click to View Cart</div>
                `;
                btn.appendChild(tooltip);
            }
        });
    }

    bindEvents() {
        // Toggle cart via any button
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('.cart-global-btn');
            if (btn) {
                e.preventDefault();
                if (this.isOpen) {
                    this.close();
                } else {
                    this.open(btn);
                }
            }
        });

        // Close events
        document.getElementById('global-cart-close').addEventListener('click', () => this.close());
        document.getElementById('global-cart-continue').addEventListener('click', () => this.close());
        this.backdrop.addEventListener('click', () => this.close());

        // Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Listen for cross-tab storage changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'nutspice_cart') {
                this.cart = JSON.parse(e.newValue) || [];
                this.render();
            }
        });
    }

    saveCart() {
        localStorage.setItem('nutspice_cart', JSON.stringify(this.cart));
        this.render();
        // Dispatch event for any other listeners
        window.dispatchEvent(new Event('cartUpdated'));
    }

    render() {
        // Calculate totals
        const totalQty = this.cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        // Update total
        this.totalEl.innerText = `₹${totalPrice}`;

        // Update badges globally
        document.querySelectorAll('#cart-count').forEach(badge => {
            if (badge.innerText !== totalQty.toString()) {
                badge.innerText = totalQty;
                // Pop animation on update
                gsap.fromTo(badge, { scale: 1.5 }, { scale: 1, duration: 0.4, ease: "back.out(1.7)" });
            }
        });

        // Update tooltips globally
        document.querySelectorAll('.cart-preview-tooltip').forEach(tooltip => {
            if (totalQty === 0) {
                tooltip.classList.add('hidden-always');
            } else {
                tooltip.classList.remove('hidden-always');
                tooltip.querySelector('.preview-count').innerText = `${totalQty} items`;
                tooltip.querySelector('.preview-total').innerText = `₹${totalPrice}`;
            }
        });

        // Render Items
        if (this.cart.length === 0) {
            this.itemsContainer.innerHTML = `
                <div class="cart-empty">
                    <i class="ph ph-shopping-bag"></i>
                    <h3>Your Cart Is Empty</h3>
                    <p>Discover premium roasted makhana crafted for modern lifestyles.</p>
                    <button class="btn btn-secondary magnetic" onclick="window.location.href='index.html#flavours'">Explore Collection</button>
                </div>
            `;
            document.getElementById('global-cart-btns').style.display = 'none';
        } else {
            document.getElementById('global-cart-btns').style.display = 'flex';
            this.itemsContainer.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-flavor">${item.flavour}</p>
                        <div class="cart-item-price-qty">
                            <span class="cart-item-price">₹${item.price * item.qty}</span>
                            <div class="cart-qty-control">
                                <button class="qty-btn" onclick="window.globalCart.updateQty(${item.id}, -1)">-</button>
                                <span class="qty-value">${item.qty}</span>
                                <button class="qty-btn" onclick="window.globalCart.updateQty(${item.id}, 1)">+</button>
                            </div>
                        </div>
                        <button class="remove-btn mt-1" onclick="window.globalCart.removeItem(${item.id})">Remove</button>
                    </div>
                </div>
            `).join('');
        }
    }

    updateQty(id, delta) {
        const item = this.cart.find(i => i.id === id);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) {
            this.cart = this.cart.filter(i => i.id !== id);
        }
        this.saveCart();
    }

    removeItem(id) {
        this.cart = this.cart.filter(i => i.id !== id);
        this.saveCart();
    }

    /**
     * Morphing Open Animation
     */
    open(originBtn) {
        if (this.isOpen || this.isAnimating) return;
        this.isAnimating = true;
        this.isOpen = true;

        // Calculate origin
        const rect = originBtn.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;

        // Button pulse effect
        gsap.to(originBtn, {
            scale: 1.1,
            color: '#D85035',
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });

        // Show backdrop
        this.backdrop.classList.add('active');
        this.panel.classList.add('active');

        const isMobile = window.innerWidth <= this.mobileBreakpoint;

        // Set initial state for panel
        gsap.set(this.panel, {
            x: originX,
            y: originY,
            scale: 0.05,
            opacity: 0,
            transformOrigin: "center center"
        });

        // Destination coords
        let destX, destY, destScale = 1;

        if (isMobile) {
            // Bottom sheet layout
            destX = window.innerWidth * 0.025; // 2.5vw
            destY = window.innerHeight - this.panel.offsetHeight; // Bottom of screen
            
            gsap.to(this.panel, {
                x: destX,
                y: destY,
                scale: destScale,
                opacity: 1,
                duration: 0.7,
                ease: "power4.inOut",
                onComplete: () => {
                    this.isAnimating = false;
                }
            });
        } else {
            // Desktop right-side float
            // width is clamp(360, 28vw, 460). We position it right: 2rem, top: 2rem.
            destX = window.innerWidth - this.panel.offsetWidth - 32; // 32px = 2rem
            destY = 32;

            gsap.to(this.panel, {
                x: destX,
                y: destY,
                scale: destScale,
                opacity: 1,
                duration: 0.7,
                ease: "power4.inOut",
                onComplete: () => {
                    this.isAnimating = false;
                }
            });
        }
        
        // Stagger list items in cart
        gsap.fromTo('.cart-item', 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, delay: 0.3, ease: "power2.out" }
        );
    }

    /**
     * Morphing Close Animation
     */
    close() {
        if (!this.isOpen || this.isAnimating) return;
        this.isAnimating = true;

        // Find the active cart btn to morph back to
        const btn = document.querySelector('.cart-global-btn');
        let destX = window.innerWidth, destY = 0;
        
        if (btn) {
            const rect = btn.getBoundingClientRect();
            destX = rect.left + rect.width / 2;
            destY = rect.top + rect.height / 2;
        }

        this.backdrop.classList.remove('active');

        gsap.to(this.panel, {
            x: destX,
            y: destY,
            scale: 0.05,
            opacity: 0,
            duration: 0.5,
            ease: "power3.inOut",
            onComplete: () => {
                this.panel.classList.remove('active');
                this.isOpen = false;
                this.isAnimating = false;
                // Reset styling for safety
                gsap.set(this.panel, { clearProps: "all" });
            }
        });
        
        // Button bounce
        if (btn) {
            gsap.fromTo(btn, 
                { scale: 0.8 }, 
                { scale: 1, duration: 0.4, delay: 0.4, ease: "back.out(1.7)" }
            );
        }
    }

    /**
     * Reusable Add To Cart System with Flying Animation
     */
    addItem(product, originElement) {
        // Safety check
        if(!product || !product.id) return;

        // Add logic
        const existing = this.cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            this.cart.push({ ...product, qty: 1 });
        }
        this.saveCart();

        // Animation logic
        if (originElement && window.gsap) {
            this.playFlyingAnimation(originElement, product.image);
        } else {
            this.showToast();
        }
    }

    playFlyingAnimation(originElement, imageSrc) {
        // Find origin jar image inside the card
        // Assuming originElement is the button inside a product card
        const card = originElement.closest('.flavour-card') || originElement.closest('.product-card') || document.body;
        let originImg = card.querySelector('img');
        
        // Target is the cart icon
        const targetIcon = document.querySelector('.cart-global-btn');
        
        if (!originImg || !targetIcon) {
            this.showToast();
            return;
        }

        const originRect = originImg.getBoundingClientRect();
        const targetRect = targetIcon.getBoundingClientRect();

        // Create clone
        const clone = document.createElement('img');
        clone.src = imageSrc;
        clone.className = 'cart-flying-clone';
        document.body.appendChild(clone);

        // Initial setup
        gsap.set(clone, {
            x: originRect.left,
            y: originRect.top,
            width: originRect.width,
            height: originRect.height,
            opacity: 0.8
        });

        // Animation path
        const ctrlX = originRect.left + (targetRect.left - originRect.left) / 2;
        const ctrlY = Math.min(originRect.top, targetRect.top) - 150; // curve upwards

        const tl = gsap.timeline({
            onComplete: () => {
                clone.remove();
                this.showToast();
                
                // Icon fill/pulse
                gsap.fromTo(targetIcon, 
                    { scale: 1.3, color: '#D85035' },
                    { scale: 1, color: '', duration: 0.4, ease: "back.out(1.7)" }
                );
            }
        });

        // Curved flight
        tl.to(clone, {
            motionPath: {
                path: [
                    { x: originRect.left, y: originRect.top },
                    { x: ctrlX, y: ctrlY },
                    { x: targetRect.left + targetRect.width/2 - 20, y: targetRect.top + targetRect.height/2 - 20 }
                ]
            },
            width: 40,
            height: 40,
            opacity: 0.5,
            duration: 0.6,
            ease: "power2.inOut"
        });
    }

    showToast() {
        this.toast.classList.add('show');
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 2000);
    }
}

// Initialize Globally
window.addEventListener('DOMContentLoaded', () => {
    // Only register MotionPath if GSAP is available and loaded
    if (window.gsap && gsap.plugins && gsap.plugins.MotionPathPlugin) {
        // Wait, MotionPathPlugin might not be loaded. 
        // We can fallback to simple x/y tweens if it's not.
    }
    
    // We will use simple bezier-like animation without motionPath plugin to ensure it works
    // by using a container. Actually, motionPath requires an extra script.
    // Let's rewrite the flying animation slightly to avoid motionPath dependency to keep it clean.
    
    window.globalCart = new GlobalCart();
});

// Polyfill the flying animation to not require MotionPathPlugin
GlobalCart.prototype.playFlyingAnimation = function(originElement, imageSrc) {
    const card = originElement.closest('.flavour-card') || originElement.closest('.product-card') || document.body;
    let originImg = card.querySelector('img');
    const targetIcon = document.querySelector('.cart-global-btn');
    
    if (!originImg || !targetIcon) {
        this.showToast();
        return;
    }

    const originRect = originImg.getBoundingClientRect();
    const targetRect = targetIcon.getBoundingClientRect();

    // Create wrapper for bezier
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.zIndex = '9999';
    wrapper.style.pointerEvents = 'none';
    
    const clone = document.createElement('img');
    clone.src = imageSrc;
    clone.className = 'cart-flying-clone';
    clone.style.position = 'relative'; // relative to wrapper
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    gsap.set(wrapper, { x: originRect.left, y: originRect.top });
    gsap.set(clone, { width: originRect.width, height: originRect.height });

    // Animate X on wrapper, Y on clone to create curve
    gsap.to(wrapper, {
        x: targetRect.left + targetRect.width/2 - 20,
        duration: 0.7,
        ease: "power1.inOut"
    });
    
    gsap.to(clone, {
        y: (targetRect.top - originRect.top) + targetRect.height/2 - 20,
        width: 40,
        height: 40,
        opacity: 0.5,
        duration: 0.7,
        ease: "back.in(1.5)", // Gives the curved arc effect
        onComplete: () => {
            wrapper.remove();
            this.showToast();
            gsap.fromTo(targetIcon, 
                { scale: 1.3, color: '#D85035' },
                { scale: 1, color: '', duration: 0.4, ease: "back.out(1.7)" }
            );
        }
    });
};
