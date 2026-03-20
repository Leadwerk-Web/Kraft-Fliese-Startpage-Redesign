(() => {
    'use strict';

    // ==========================================
    // NAVIGATION
    // ==========================================
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    let lastScroll = 0;

    function handleNavScroll() {
        const scrollY = window.scrollY;
        nav.classList.toggle('scrolled', scrollY > 80);
        lastScroll = scrollY;
    }

    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Active nav highlighting
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = navLinks?.querySelector(`a[href="#${id}"]`);
            if (link) {
                link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
            }
        });
    }

    // ==========================================
    // HERO SLIDESHOW with Countdown Circles
    // ==========================================
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.progress-dot');
    let currentSlide = 0;
    let slideInterval;
    const SLIDE_DURATION = 6000;

    function goToSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => {
            d.classList.remove('active');
            const ring = d.querySelector('.progress-ring');
            if (ring) {
                ring.style.animation = 'none';
                ring.offsetHeight; // trigger reflow
                ring.style.animation = '';
            }
        });

        currentSlide = index;
        slides[currentSlide]?.classList.add('active');
        dots[currentSlide]?.classList.add('active');
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function startSlideshow() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, SLIDE_DURATION);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.slide));
            startSlideshow();
        });
    });

    if (slides.length > 0) {
        goToSlide(0);
        startSlideshow();
    }

    // ==========================================
    // TEXT REVEAL ON SCROLL (Herzbube style)
    // ==========================================
    function initTextReveal() {
        const revealElements = document.querySelectorAll('[data-reveal]');

        revealElements.forEach(el => {
            const html = el.innerHTML;
            const parts = html.split(/(\s+)/);
            el.innerHTML = parts.map(part => {
                if (/^\s+$/.test(part)) return part;
                return `<span class="word">${part}</span>`;
            }).join('');
        });
    }

    function updateTextReveal() {
        const revealElements = document.querySelectorAll('[data-reveal]');

        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight;

            const words = el.querySelectorAll('.word');
            const totalWords = words.length;

            const sectionStart = vh * 0.8;
            const sectionEnd = vh * 0.2;
            const progress = Math.max(0, Math.min(1,
                (sectionStart - rect.top) / (sectionStart - sectionEnd)
            ));

            const wordsToShow = Math.floor(progress * totalWords);

            words.forEach((word, i) => {
                word.classList.toggle('visible', i < wordsToShow);
            });
        });
    }

    // ==========================================
    // HORIZONTAL SCROLL SHOWCASE
    // ==========================================
    function updateHorizontalScroll() {
        const section = document.querySelector('.horizontal-showcase');
        if (!section) return;

        const track = section.querySelector('.showcase-track');
        if (!track) return;

        const sectionRect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;
        const vh = window.innerHeight;

        const scrollProgress = Math.max(0, Math.min(1,
            -sectionRect.top / (sectionHeight - vh)
        ));

        const trackWidth = track.scrollWidth - track.parentElement.offsetWidth + 100;
        const translateX = scrollProgress * trackWidth;

        track.style.transform = `translateX(-${translateX}px)`;
    }

    // ==========================================
    // COUNTER ANIMATION (Pino style)
    // ==========================================
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        const counterSection = document.querySelector('.counters');
        if (!counterSection) return;

        const rect = counterSection.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.7) return;

        countersAnimated = true;

        document.querySelectorAll('.counter-item').forEach(item => {
            const countEl = item.querySelector('.count');
            const target = parseInt(item.dataset.count);
            if (!countEl || isNaN(target)) return;

            const duration = 2000;
            const start = performance.now();

            function easeOutExpo(t) {
                return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            }

            function updateCount(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutExpo(progress);
                const current = Math.floor(easedProgress * target);

                countEl.textContent = current.toLocaleString('de-DE');

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    countEl.textContent = target.toLocaleString('de-DE');
                }
            }

            requestAnimationFrame(updateCount);
        });
    }

    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    function animateOnScroll() {
        const elements = document.querySelectorAll('[data-animate]:not(.animated)');
        const vh = window.innerHeight;

        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const delay = parseInt(el.dataset.delay) || 0;

            if (rect.top < vh * 0.85) {
                setTimeout(() => el.classList.add('animated'), delay);
            }
        });
    }

    // ==========================================
    // PROCESS STEPS STAGGERED ANIMATION
    // ==========================================
    function animateProcessSteps() {
        const processSteps = document.querySelectorAll('.process-step:not(.animated)');
        if (processSteps.length === 0) return;

        const processSection = document.querySelector('.process');
        if (!processSection) return;

        const rect = processSection.getBoundingClientRect();
        const vh = window.innerHeight;

        // Wenn Prozess-Sektion sichtbar wird
        if (rect.top < vh * 0.85 && rect.bottom > 0) {
            processSteps.forEach((step, index) => {
                // Jeder Schritt mit 200ms Verzögerung (mittellangsam)
                setTimeout(() => {
                    step.classList.add('animated');
                }, index * 200);
            });
        }
    }

    // ==========================================
    // TESTIMONIAL INFINITE SCROLL
    // ==========================================
    function setupTestimonials() {
        const track = document.querySelector('.testimonial-track');
        if (!track) return;

        const items = track.innerHTML;
        track.innerHTML = items + items;
    }

    // ==========================================
    // FLOATING CTA
    // ==========================================
    function updateFloatingCta() {
        const cta = document.getElementById('floatingCta');
        if (cta) {
            cta.classList.toggle('visible', window.scrollY > 600);
        }
    }

    // ==========================================
    // SMOOTH SCROLL for anchor links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = nav?.offsetHeight || 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ==========================================
    // FORM HANDLING
    // ==========================================
    const form = document.getElementById('contactForm');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;

        btn.textContent = 'Wird gesendet...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = 'Nachricht gesendet!';
            btn.style.background = '#2ecc71';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 3000);
        }, 1500);
    });

    // ==========================================
    // SCROLL HANDLER (unified)
    // ==========================================
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleNavScroll();
                updateActiveNav();
                updateTextReveal();
                updateHorizontalScroll();
                animateCounters();
                animateOnScroll();
                animateProcessSteps();
                updateFloatingCta();
                ticking = false;
            });
            ticking = true;
        }
    }

    // ==========================================
    // INIT
    // ==========================================
    function init() {
        initTextReveal();
        setupTestimonials();
        animateOnScroll();
        handleNavScroll();

        window.addEventListener('scroll', () => {
            onScroll();
        }, { passive: true });
        window.addEventListener('resize', () => {
            updateHorizontalScroll();
        }, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
