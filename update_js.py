import sys

with open('c:\\Users\\Dell\\OneDrive\\Documents\\MyFirstWebsite\\script.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_js = """// 6. Interactive Flavour Mood System
const moodItems = document.querySelectorAll('.mood-item');
const universeJars = document.querySelectorAll('.universe-jar');
const ambientGlow = document.getElementById('ambient-glow');

const flavourGlowMap = {
    'peri': 'radial-gradient(circle, rgba(216, 80, 53, 0.2) 0%, rgba(216, 80, 53, 0) 70%)',
    'pudina': 'radial-gradient(circle, rgba(46, 204, 113, 0.2) 0%, rgba(46, 204, 113, 0) 70%)',
    'cream': 'radial-gradient(circle, rgba(155, 89, 182, 0.2) 0%, rgba(155, 89, 182, 0) 70%)',
    'cheesy': 'radial-gradient(circle, rgba(241, 196, 15, 0.2) 0%, rgba(241, 196, 15, 0) 70%)'
};

if(moodItems.length && universeJars.length) {
    moodItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const flavour = item.getAttribute('data-flavour');
            
            // Update ambient glow
            if(ambientGlow) {
                ambientGlow.style.background = flavourGlowMap[flavour] || '';
            }

            // Dim all jars except the matched one
            universeJars.forEach(jar => {
                if(jar.getAttribute('data-id') === flavour) {
                    jar.classList.remove('dimmed');
                    gsap.to(jar, { scale: 1.1, duration: 0.4, ease: "power2.out" });
                } else {
                    jar.classList.add('dimmed');
                    gsap.to(jar, { scale: 1, duration: 0.4, ease: "power2.out" });
                }
            });
        });

        item.addEventListener('mouseleave', () => {
            // Reset jars
            universeJars.forEach(jar => {
                jar.classList.remove('dimmed');
                gsap.to(jar, { scale: 1, duration: 0.4, ease: "power2.out" });
            });
            // Reset glow
            if(ambientGlow) {
                ambientGlow.style.background = 'radial-gradient(circle, rgba(216, 80, 53, 0.15) 0%, rgba(216, 80, 53, 0) 70%)';
            }
        });
    });
}

// 7. Hero Mouse Parallax (Floating Universe)
const heroSection = document.querySelector('.editorial-hero-section');
if(heroSection && universeJars.length) {
    heroSection.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        universeJars.forEach(jar => {
            const depth = parseFloat(jar.getAttribute('data-depth')) || 0.1;
            gsap.to(jar, {
                x: x * 100 * depth,
                y: y * 100 * depth,
                duration: 1,
                ease: "power2.out"
            });
        });
    });
    
    // Continuous subtle floating
    universeJars.forEach((jar, index) => {
        gsap.to(jar, {
            y: "+=15",
            duration: 2 + index * 0.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });
}

// 8. Cinematic Scroll Transformation
const cinematicText = document.querySelector('.cinematic-scroll-section');
if(cinematicText && universeJars.length) {
    let mm = gsap.matchMedia();
    
    mm.add("(min-width: 769px)", () => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.editorial-hero-section',
                start: "top top",
                end: "+=100%",
                scrub: 1,
                pin: true,
            }
        });

        // Jars explode outwards
        tl.to(universeJars[0], { x: -300, y: 200, scale: 1.2, rotation: -15 }, 0)
          .to(universeJars[1], { x: 300, y: -100, scale: 1.2, rotation: 10 }, 0)
          .to(universeJars[2], { x: 200, y: 300, scale: 1.2, rotation: 20 }, 0)
          .to(universeJars[3], { scale: 0.5, opacity: 0, y: -200 }, 0)
          
          // Fade out hero content
          .to('.hero-content', { opacity: 0, y: -50 }, 0)
          .to('#ambient-glow', { opacity: 0 }, 0)
          .to('#particles', { opacity: 0 }, 0);
          
        // Cinematic text reveals as hero pins
        const cLines = document.querySelectorAll('.c-line');
        if(cLines.length) {
            gsap.from(cLines, {
                y: 100,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                scrollTrigger: {
                    trigger: cinematicText,
                    start: "top 70%",
                    end: "center center",
                    scrub: 1
                }
            });
        }
    });
}

// 9. Scroll Reveals
gsap.utils.toArray('section:not(.editorial-hero-section)').forEach(section => {
    const elements = section.querySelectorAll('.gs-fade-up');
    if (elements.length) {
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

// 10. Statistics Counters
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
                onUpdate: function () {
                    counter.innerText = Math.floor(this.targets()[0].val);
                }
            });
        },
        once: true
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
});
"""

with open('c:\\Users\\Dell\\OneDrive\\Documents\\MyFirstWebsite\\script.js', 'w', encoding='utf-8') as f:
    f.writelines(lines[:93])
    f.write(new_js)

print("Updated script.js successfully")
