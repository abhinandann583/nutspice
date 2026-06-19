// ==========================================
// NUTSPICE - LUXURY GSAP ANIMATIONS & LOGIC
// ==========================================

// 1. Initialize Lenis Smooth Scrolling
const lenis = new Lenis({
    duration: 0.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1.5,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

// 1.5 Mobile Menu Toggle
const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenuOverlay');
if(mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('open');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    // Close menu when clicking a link
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileBtn.classList.remove('open');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// 2. Loading Screen & Hero Initial Animations
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    tl.to('.loader-progress', { width: '100%', duration: 1.5, ease: "power2.inOut" })
      .to('.loader-logo', { opacity: 0, y: -20, duration: 0.5 }, "+=0.2")
      .to('.loader', { yPercent: -100, duration: 1, ease: "power4.inOut" })
      .from('.title-line span', { y: 100, opacity: 0, duration: 1.2, ease: "power4.out", stagger: 0.1 }, "-=0.4")
      .from('.gs-fade-up', { y: 30, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.1 }, "-=0.8");
});

// 3. Custom Magnetic Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

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

document.querySelectorAll('a, button, .magnetic, .faq-head, .hero-jar-layer').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 0, duration: 0.3 });
        gsap.to(follower, { scale: 1.5, backgroundColor: 'rgba(96,59,23,0.1)', border: '1px solid transparent', duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, duration: 0.3 });
        gsap.to(follower, { scale: 1, backgroundColor: 'transparent', border: '1px solid var(--dark-brown)', duration: 0.3 });
    });
});

document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
        const position = this.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;
        gsap.to(this, { x: x * 0.3, y: y * 0.3, duration: 0.5, ease: "power2.out" });
    });
    btn.addEventListener('mouseleave', function() {
        gsap.to(this, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });
});

// 5. Hero Floating Particles
const particlesContainer = document.getElementById('particles');
if(particlesContainer) {
    for(let i=0; i<15; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.width = Math.random() * 6 + 4 + 'px';
        p.style.height = p.style.width;
        particlesContainer.appendChild(p);
        
        gsap.to(p, {
            y: -100 - Math.random() * 100,
            x: -50 + Math.random() * 100,
            opacity: 0,
            duration: 3 + Math.random() * 4,
            repeat: -1,
            ease: "none",
            delay: Math.random() * 2
        });
    }
}

// 6. Interactive Flavour Showcase
const flavourItems = document.querySelectorAll('.flavour-item');
const fsBg = document.querySelector('.fs-bg');
const fsImg = document.getElementById('fs-active-img');

if(flavourItems.length > 0) {
    const updateShowcaseColors = (activeItem) => {
        const newBg = activeItem.getAttribute('data-bg');
        const activeText = activeItem.getAttribute('data-text');
        const isLightBg = newBg === '#FFB347'; // Cheesy Delight
        
        const headingColor = isLightBg ? 'var(--dark-brown)' : '#FFF8CE';
        const pColor = isLightBg ? 'var(--choc-brown)' : 'rgba(255, 255, 255, 0.7)';

        // Animate BG
        gsap.to(fsBg, { backgroundColor: newBg, duration: 0.8, ease: "power2.inOut" });
        
        // Animate all text to base readable color
        gsap.to('.fs-content h2, .flavour-item h3', { color: headingColor, duration: 0.4 });
        gsap.to('.fs-content > p, .flavour-item p', { color: pColor, duration: 0.4 });
        
        // Highlight active item heading
        gsap.to(activeItem.querySelector('h3'), { color: activeText, duration: 0.4 });
    };

    // Init BG
    updateShowcaseColors(flavourItems[0]);

    flavourItems.forEach(item => {
        // Support touch, click, and hover for mobile friendliness
        ['mouseenter', 'click', 'touchstart'].forEach(eventType => {
            item.addEventListener(eventType, function(e) {
                if (eventType === 'touchstart') e.preventDefault(); // prevent double firing
                
                if(this.classList.contains('active')) return;
                
                // Remove active from all
                flavourItems.forEach(i => i.classList.remove('active'));
                
                // Add active to current
                this.classList.add('active');
                
                updateShowcaseColors(this);
                
                const newImg = this.getAttribute('data-img');
            
            // Image swap with scale/rotate bounce
            gsap.to(fsImg, {
                scale: 0.8,
                opacity: 0,
                rotation: -10,
                duration: 0.3,
                onComplete: () => {
                    fsImg.src = newImg;
                    gsap.to(fsImg, {
                        scale: 1,
                        opacity: 1,
                        rotation: 0,
                        duration: 0.6,
                        ease: "back.out(1.5)"
                    });
                }
            }); // end gsap.to
        }); // end addEventListener
        }); // end eventType.forEach
    }); // end flavourItems.forEach
} // end if(flavourItems.length > 0)

// ==========================================
// 6B. FLAVOUR JOURNEY — Horizontal Scroll
// ==========================================
const journeySection = document.querySelector('.flavour-journey');
const journeyTrack = document.querySelector('.journey-track');

if (journeySection && journeyTrack) {
    const panels = gsap.utils.toArray('.journey-panel');
    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
        // Desktop: Pin the section and scroll horizontally
        const horizontalScroll = gsap.to(journeyTrack, {
            x: () => -(journeyTrack.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: journeySection,
                pin: true,
                scrub: 1,
                end: () => "+=" + (journeyTrack.scrollWidth - window.innerWidth),
                invalidateOnRefresh: true,
            }
        });

        // Desktop: Per-panel entrance animations (containerAnimation)
        panels.forEach((panel, i) => {
            const badge = panel.querySelector('.panel-badge');
            const headline = panel.querySelector('.panel-headline');
            const sub = panel.querySelector('.panel-sub');
            const jar = panel.querySelector('.panel-jar');

            const panelTl = gsap.timeline({
                scrollTrigger: {
                    trigger: panel,
                    containerAnimation: horizontalScroll,
                    start: "left 80%",
                    end: "left 20%",
                    toggleActions: "play none none reverse",
                }
            });

            panelTl.from(badge, { y: 30, opacity: 0, duration: 0.6, ease: "power3.out" })
                   .from(headline, { y: 80, opacity: 0, duration: 0.8, ease: "power4.out" }, "-=0.3")
                   .from(sub, { y: 40, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
                   .from(jar, { scale: 0.6, opacity: 0, rotation: -15, duration: 1, ease: "back.out(1.4)" }, "-=0.6");
        });
    });

    mm.add("(max-width: 768px)", () => {
        // Mobile: Vertical scroll animations
        panels.forEach((panel, i) => {
            const badge = panel.querySelector('.panel-badge');
            const headline = panel.querySelector('.panel-headline');
            const sub = panel.querySelector('.panel-sub');
            const jar = panel.querySelector('.panel-jar');

            const panelTl = gsap.timeline({
                scrollTrigger: {
                    trigger: panel,
                    start: "top 70%",
                    toggleActions: "play none none reverse",
                }
            });

            panelTl.from(badge, { y: 20, opacity: 0, duration: 0.5, ease: "power3.out" })
                   .from(headline, { y: 40, opacity: 0, duration: 0.6, ease: "power4.out" }, "-=0.2")
                   .from(sub, { y: 20, opacity: 0, duration: 0.5, ease: "power3.out" }, "-=0.3")
                   .from(jar, { scale: 0.8, opacity: 0, duration: 0.8, ease: "back.out(1.2)" }, "-=0.4");
        });
    });

    // Universal: Continuous jar floating & glow pulses
    panels.forEach(panel => {
        const jar = panel.querySelector('.panel-jar');
        
        // Continuous jar floating
        if (jar) {
            gsap.to(jar, {
                y: -15,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }

        // Glow pulse
        const glow = panel.querySelector('.panel-glow');
        if (glow) {
            gsap.to(glow, {
                scale: 1.2,
                opacity: 0.6,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    });

    // Spawn floating particles for each panel
    const particleConfigs = [
        { id: 'peri-particles', count: 15 },
        { id: 'pudina-particles', count: 15 },
        { id: 'cream-particles', count: 12 },
        { id: 'cheesy-particles', count: 15 }
    ];

    particleConfigs.forEach(config => {
        const container = document.getElementById(config.id);
        if (!container) return;
        for (let i = 0; i < config.count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 6 + 3;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            container.appendChild(p);

            gsap.to(p, {
                y: -80 - Math.random() * 120,
                x: -40 + Math.random() * 80,
                opacity: 0,
                duration: 4 + Math.random() * 4,
                repeat: -1,
                delay: Math.random() * 3,
                ease: "none"
            });
        }
    });
}

// 7. Scroll Reveals
gsap.utils.toArray('section:not(.hero)').forEach(section => {
    const elements = section.querySelectorAll('.gs-fade-up');
    if(elements.length) {
        gsap.from(elements, {
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    }
});

// 8. Parallax Image
gsap.utils.toArray('.parallax-img').forEach(img => {
    gsap.to(img, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

// 9. Statistics Counters
const counters = document.querySelectorAll('.counter-val');
counters.forEach(counter => {
    ScrollTrigger.create({
        trigger: counter,
        start: "top 90%",
        onEnter: () => {
            const target = parseInt(counter.getAttribute('data-target'));
            gsap.to({ val: 0 }, {
                val: target,
                duration: 2.5,
                ease: "power3.out",
                onUpdate: function() {
                    counter.innerText = Math.floor(this.targets()[0].val);
                }
            });
        },
        once: true
    });
});

// 10. FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const head = item.querySelector('.faq-head');
    head.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all
        faqItems.forEach(i => {
            i.classList.remove('active');
            gsap.to(i.querySelector('.faq-body'), { height: 0, duration: 0.3, ease: "power2.inOut" });
        });

        // Open clicked if it wasn't active
        if(!isActive) {
            item.classList.add('active');
            const body = item.querySelector('.faq-body');
            gsap.set(body, { height: 'auto' });
            const height = body.offsetHeight;
            gsap.fromTo(body, { height: 0 }, { height: height, duration: 0.3, ease: "power2.inOut" });
        }
    });
});

// ==========================================
// SCROLLSPY & GLOBAL CART LOGIC
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    // ScrollSpy for Navigation Links
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle of the viewport
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    // Remove active from all
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        // If link href contains the section ID, make it active
                        if (link.getAttribute('href').includes('#' + id)) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(sec => observer.observe(sec));
    }

    // Global Cart Counter update
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('nutspice_cart')) || [];
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountEl.textContent = count;
        };
        
        // Initial update
        updateCartCount();

        // Listen for storage changes in case cart updates from another tab
        window.addEventListener('storage', (e) => {
            if (e.key === 'nutspice_cart') {
                updateCartCount();
            }
        });
        
        // Listen to custom event for same-page updates (e.g., from shop.js)
        window.addEventListener('cartUpdated', updateCartCount);
    }
});
