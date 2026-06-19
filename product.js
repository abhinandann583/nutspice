// ==========================================
// NUTSPICE - LUXURY PRODUCT PAGE LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get current product info
    const productBody = document.querySelector('body.product-page');
    if (!productBody) return;
    
    const productId = parseInt(productBody.getAttribute('data-product-id') || '1');

    // 2. Sticky Bar Logic
    const stickyBar = document.querySelector('.sticky-bar');
    const heroSection = document.querySelector('.editorial-hero');
    
    if (stickyBar && heroSection) {
        ScrollTrigger.create({
            trigger: heroSection,
            start: "bottom top", // when bottom of hero hits top of viewport
            onEnter: () => stickyBar.classList.add('visible'),
            onLeaveBack: () => stickyBar.classList.remove('visible')
        });
    }

    // 3. Purchase Button Integrations
    const btnAdd = document.getElementById('sticky-add-cart');
    const btnBuy = document.getElementById('sticky-buy-now');

    const productDataMap = {
        1: { id: 1, name: "Peri Peri Makhana", price: 149, flavour: "Peri Peri", image: "./assets/peri-peri.png" },
        2: { id: 2, name: "Pudina Burst", price: 149, flavour: "Pudina", image: "./assets/pudina-burst.png" },
        3: { id: 3, name: "Cream & Onion", price: 149, flavour: "Cream & Onion", image: "./assets/cream-onion.png" },
        4: { id: 4, name: "Cheesy Makhana", price: 149, flavour: "Cheese", image: "./assets/cheesy.png" }
    };

    if (btnAdd) {
        btnAdd.addEventListener('click', (e) => {
            if (window.globalCart && productDataMap[productId]) {
                window.globalCart.addItem(productDataMap[productId], e.target);
            }
        });
    }
    
    if (btnBuy) {
        btnBuy.addEventListener('click', (e) => {
            if (window.globalCart && productDataMap[productId]) {
                window.globalCart.cart = [];
                window.globalCart.addItem(productDataMap[productId], e.target);
                setTimeout(() => window.location.href = 'checkout.html', 300);
            }
        });
    }

    // 4. Reveal Animations
    // Emotional Statement
    gsap.from('.hero-emotional-statement', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.5
    });

    gsap.from('.hero-sub-copy, .hero-flavour-name', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        delay: 0.8
    });

    // Personality Text
    gsap.to('.personality-statement', {
        scrollTrigger: {
            trigger: '.personality-section',
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1
        },
        opacity: 1,
        scale: 1.05,
        ease: "none"
    });

    // 5. Sensory Dots Reveal
    const sensoryRows = document.querySelectorAll('.sensory-row');
    sensoryRows.forEach(row => {
        const dots = row.querySelectorAll('.dot');
        gsap.fromTo(dots, 
            { scale: 0, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: "back.out(1.5)",
                scrollTrigger: {
                    trigger: row,
                    start: "top 85%"
                }
            }
        );
    });

    // 6. Flavour Journey Timeline
    const journeySteps = document.querySelectorAll('.journey-step');
    journeySteps.forEach((step, index) => {
        ScrollTrigger.create({
            trigger: step,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => step.classList.add('active'),
            onLeaveBack: () => step.classList.remove('active'),
            onLeave: () => step.classList.remove('active'),
            onEnterBack: () => step.classList.add('active')
        });
    });

    // 7. Testimonials Fade
    const testimonials = document.querySelectorAll('.testimonial-item');
    testimonials.forEach(t => {
        gsap.from(t, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: t,
                start: "top 80%"
            }
        });
    });
});
