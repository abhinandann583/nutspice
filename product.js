// ==========================================
// NUTSPICE - LUXURY PRODUCT PAGE LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get current product info
    const productBody = document.querySelector('body.product-page');
    if (!productBody) return;
    const productId = productBody.getAttribute('data-product-id') || 'peri';

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
        'peri': { id: 'peri', name: "Peri Peri Makhana", price: 149, flavour: "Peri Peri", img: "./assets/peri-peri.png" },
        'pudina': { id: 'pudina', name: "Pudina Burst Makhana", price: 149, flavour: "Pudina", img: "./assets/pudina-burst.png" },
        'cream': { id: 'cream', name: "Cream & Onion Makhana", price: 149, flavour: "Cream & Onion", img: "./assets/cream-onion.png" },
        'cheesy': { id: 'cheesy', name: "Cheesy Delight Makhana", price: 149, flavour: "Cheese", img: "./assets/cheesy.png" }
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
    // 8. Interactive Hero
    const interactiveHero = document.querySelector('.interactive-hero');
    if (interactiveHero) {
        const jar = interactiveHero.querySelector('.hero-jar');
        const glow = interactiveHero.querySelector('.flavour-hover-glow');
        const card = interactiveHero.querySelector('.flavour-story-card');
        const particleContainer = interactiveHero.querySelector('.flavour-particles');
        const flavour = interactiveHero.getAttribute('data-flavour');

        const glowColors = {
            'peri': 'radial-gradient(circle, rgba(229,57,53,0.5) 0%, rgba(200,40,30,0) 70%)',
            'pudina': 'radial-gradient(circle, rgba(76,175,80,0.5) 0%, rgba(50,130,60,0) 70%)',
            'cream': 'radial-gradient(circle, rgba(142,122,230,0.5) 0%, rgba(100,80,180,0) 70%)',
            'cheesy': 'radial-gradient(circle, rgba(255,179,71,0.5) 0%, rgba(200,130,40,0) 70%)'
        };

        const particleColors = {
            'peri': ['#E53935', '#FF5722', '#D84315'],
            'pudina': ['#4CAF50', '#81C784', '#2E7D32'],
            'cream': ['#FFFFFF', '#F3E5F5', '#E1BEE7'],
            'cheesy': ['#FFB347', '#FFCA28', '#FFA000']
        };

        let particleInterval;
        let isHovered = false;

        function createParticle() {
            if (!isHovered) return;
            const p = document.createElement('div');
            p.classList.add('hover-particle');
            const colors = particleColors[flavour] || ['#fff'];
            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            const size = Math.random() * 6 + 2;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            
            p.style.left = (Math.random() * 80 + 10) + '%';
            p.style.top = (Math.random() * 20 + 80) + '%';
            
            particleContainer.appendChild(p);
            
            gsap.to(p, {
                y: -Math.random() * 100 - 50,
                x: (Math.random() - 0.5) * 40,
                opacity: 0,
                duration: Math.random() * 1.5 + 1,
                ease: "power1.out",
                onComplete: () => p.remove()
            });
        }

        function activateHover() {
            if(isHovered) return;
            isHovered = true;
            // Jar pop
            gsap.to(jar, {
                scale: 1.12,
                y: -20,
                filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.5)) brightness(1.15)',
                duration: 0.5,
                ease: 'back.out(1.5)'
            });
            // Glow
            glow.style.background = glowColors[flavour] || glowColors['peri'];
            gsap.to(glow, {
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out'
            });
            // Card
            gsap.to(card, {
                opacity: 1,
                y: -15,
                scale: 1.05,
                filter: 'blur(0px)',
                duration: 0.5,
                ease: 'back.out(1.2)'
            });
            // Particles
            particleInterval = setInterval(createParticle, 200);
        }

        function deactivateHover() {
            if(!isHovered) return;
            isHovered = false;
            gsap.to(jar, {
                scale: 1,
                y: 0,
                filter: 'drop-shadow(0 0 0 rgba(0,0,0,0)) brightness(1)',
                duration: 0.4,
                ease: 'power3.out'
            });
            gsap.to(glow, {
                opacity: 0,
                duration: 0.5
            });
            gsap.to(card, {
                opacity: 0,
                y: 20,
                scale: 1,
                filter: 'blur(5px)',
                duration: 0.4
            });
            clearInterval(particleInterval);
        }

        // Desktop Events
        interactiveHero.addEventListener('mouseenter', activateHover);
        interactiveHero.addEventListener('mouseleave', deactivateHover);

        // Mobile Events
        let tapped = false;
        interactiveHero.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!tapped) {
                    activateHover();
                    tapped = true;
                    // Reset if tapped elsewhere
                    const clickOutside = (evt) => {
                        if (!interactiveHero.contains(evt.target)) {
                            deactivateHover();
                            tapped = false;
                            document.removeEventListener('click', clickOutside);
                        }
                    };
                    setTimeout(() => document.addEventListener('click', clickOutside), 100);
                } else {
                    deactivateHover();
                    tapped = false;
                }
            }
        });
    }
});
