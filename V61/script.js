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
    const outlineCta = document.getElementById('heroOutlineCta');
    let currentSlide = 0;
    let slideInterval;
    const SLIDE_DURATION = 6000;

    // Slide-spezifische Outline-CTA (Text + Ziel)
    const slideOutlineCtas = [
        { text: 'Sortiment entdecken', href: '#sortiment' },
        { text: 'Sortiment entdecken', href: '#sortiment' },
        { text: '3D Planung anfragen', href: '#kontakt' }
    ];

    function updateOutlineCta(index) {
        if (!outlineCta) return;
        const cta = slideOutlineCtas[index];
        if (!cta) return;
        outlineCta.textContent = cta.text;
        outlineCta.setAttribute('href', cta.href);
    }

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
        updateOutlineCta(currentSlide);
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
    // GALLERY FILTER (Inspiration Subpage)
    // ==========================================
    function setupGalleryFilter() {
        const roomButtons = document.querySelectorAll('[data-filter-group="room"] button');
        const materialButtons = document.querySelectorAll('[data-filter-group="material"] button');
        const items = document.querySelectorAll('.masonry-grid .masonry-item');
        if (items.length === 0 || (roomButtons.length === 0 && materialButtons.length === 0)) return;

        const emptyMsg = document.querySelector('.masonry-empty');
        let activeRoom = 'all';
        let activeMaterial = 'all';

        function applyFilter() {
            let visibleCount = 0;
            items.forEach(item => {
                const room = item.dataset.room;
                const material = item.dataset.material;
                const show = (activeRoom === 'all' || room === activeRoom) &&
                             (activeMaterial === 'all' || material === activeMaterial);
                item.style.display = show ? '' : 'none';
                if (show) {
                    visibleCount++;
                    item.classList.remove('animated');
                    requestAnimationFrame(() => item.classList.add('animated'));
                }
            });
            if (emptyMsg) emptyMsg.hidden = visibleCount > 0;
        }

        function bindGroup(buttons, setValue) {
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    setValue(btn);
                    applyFilter();
                });
            });
        }

        bindGroup(roomButtons, btn => { activeRoom = btn.dataset.room; });
        bindGroup(materialButtons, btn => { activeMaterial = btn.dataset.material; });
    }

    // ==========================================
    // CURSOR FOLLOWER
    // ==========================================
    function initCursorFollower() {
        // Only on desktop with mouse
        if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
            return;
        }

        const cursor = document.createElement('div');
        cursor.className = 'cursor-follower';
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let isHovering = false;
        let rafId = null;

        function updateCursor() {
            // Smooth lagged movement
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            rafId = requestAnimationFrame(updateCursor);
        }

        function handleMouseMove(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!cursor.classList.contains('active')) {
                cursor.classList.add('active');
                updateCursor();
            }
        }

        function handleMouseEnter() {
            isHovering = true;
            cursor.classList.add('hover');
        }

        function handleMouseLeave() {
            isHovering = false;
            cursor.classList.remove('hover');
        }

        function handleMouseDown() {
            cursor.classList.add('click');
        }

        function handleMouseUp() {
            cursor.classList.remove('click');
        }

        // Interactive elements
        const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, .btn, .service-link, .popup-close';
        const interactiveElements = document.querySelectorAll(interactiveSelectors);

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        });

        document.addEventListener('mouseenter', () => {
            if (!cursor.classList.contains('active')) {
                cursor.classList.add('active');
                updateCursor();
            }
        });
    }

    // ==========================================
    // GALLERY LIGHTBOX
    // ==========================================
    function setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        const grid = document.querySelector('.masonry-grid');
        if (!lightbox || !grid) return;

        const imgEl = lightbox.querySelector('.lightbox-img');
        const captionEl = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const allItems = Array.from(grid.querySelectorAll('.masonry-item'));

        let visible = [];
        let current = 0;

        function refreshVisible() {
            visible = allItems.filter(item => item.style.display !== 'none');
        }

        function show(index) {
            if (visible.length === 0) return;
            current = (index + visible.length) % visible.length;
            const item = visible[current];
            const img = item.querySelector('img');
            const caption = item.querySelector('.masonry-overlay span');
            if (!img) return;
            imgEl.src = img.currentSrc || img.src;
            imgEl.alt = img.alt || '';
            captionEl.textContent = caption ? caption.textContent : '';
        }

        function open(item) {
            refreshVisible();
            const idx = visible.indexOf(item);
            if (idx === -1) return;
            show(idx);
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function close() {
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        allItems.forEach(item => {
            item.addEventListener('click', () => open(item));
        });

        closeBtn.addEventListener('click', close);
        prevBtn.addEventListener('click', () => show(current - 1));
        nextBtn.addEventListener('click', () => show(current + 1));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) close();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowLeft') show(current - 1);
            else if (e.key === 'ArrowRight') show(current + 1);
        });
    }

    // ==========================================
    // NEWS ARTICLE MODAL (Inspiration subpage)
    // ==========================================
    function setupNewsModal() {
        const modal = document.getElementById('newsModal');
        const cards = document.querySelectorAll('[data-news-card]');
        if (!modal || cards.length === 0) return;

        const imgEl = modal.querySelector('.news-modal-img');
        const tagEl = modal.querySelector('.news-modal-tag');
        const titleEl = modal.querySelector('.news-modal-title');
        const articleEl = modal.querySelector('.news-modal-article');

        function open(card) {
            const img = card.querySelector('.news-card-image img');
            const tag = card.querySelector('.news-date');
            const title = card.querySelector('h3');
            const full = card.querySelector('.news-article-full');
            if (!img || !title || !full) return;

            imgEl.src = img.currentSrc || img.src;
            imgEl.alt = img.alt || '';
            tagEl.textContent = tag ? tag.textContent : '';
            titleEl.textContent = title.textContent;
            articleEl.innerHTML = full.innerHTML;

            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function close() {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        cards.forEach(card => {
            card.addEventListener('click', () => open(card));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    open(card);
                }
            });
        });

        modal.querySelectorAll('[data-news-close]').forEach(btn => {
            btn.addEventListener('click', close);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
        });
    }

    // ==========================================
    // CHRONIK / TIMELINE
    // ==========================================
    function setupChronik() {
        const pin = document.querySelector('[data-chronik]');
        if (!pin) return;

        const ticks = Array.from(pin.querySelectorAll('.chronik-tick'));
        const cards = Array.from(pin.querySelectorAll('.chronik-card'));
        const stage = pin.querySelector('.chronik-stage');
        const viewport = pin.querySelector('.chronik-viewport');
        const rail = pin.querySelector('.chronik-rail');
        const railTrack = pin.querySelector('.chronik-rail-track');
        const line = pin.querySelector('.chronik-rail-line');
        const fill = pin.querySelector('.chronik-rail-fill');
        const prevBtn = pin.querySelector('.chronik-arrow[data-dir="prev"]');
        const nextBtn = pin.querySelector('.chronik-arrow[data-dir="next"]');
        if (!stage || cards.length === 0) return;

        const count = cards.length;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobileChronik = window.matchMedia('(max-width: 768px)').matches;

        pin.querySelectorAll('[data-animate]').forEach(el => el.classList.add('animated'));

        const tickCenter = (i) => ticks[i].offsetLeft + ticks[i].offsetWidth / 2;
        const cardCenter = (i) => cards[i].offsetLeft + cards[i].offsetWidth / 2;
        const lerp = (a, b, t) => a + (b - a) * t;

        function centerAt(getCenter, pos) {
            const i = Math.max(0, Math.min(count - 1, Math.floor(pos)));
            if (i >= count - 1) return getCenter(count - 1);
            return lerp(getCenter(i), getCenter(i + 1), pos - i);
        }

        function layoutRail() {
            if (!line || ticks.length === 0) return;
            const first = tickCenter(0);
            const last = tickCenter(ticks.length - 1);
            line.style.left = first + 'px';
            line.style.width = (last - first) + 'px';
            if (fill) fill.style.left = first + 'px';
        }

        // Continuous render for a fractional position (0 .. count-1)
        function render(pos) {
            const x = centerAt(cardCenter, pos);
            stage.style.transform = `translate3d(${(viewport.clientWidth / 2 - x).toFixed(2)}px, 0, 0)`;

            if (railTrack && rail) {
                const tx = centerAt(tickCenter, pos);
                railTrack.style.transform = `translate3d(${(rail.clientWidth / 2 - tx).toFixed(2)}px, 0, 0)`;
                if (fill) fill.style.width = Math.max(0, tx - tickCenter(0)).toFixed(2) + 'px';
            }

            cards.forEach((c, i) => {
                const d = Math.abs(i - pos);
                c.style.opacity = Math.max(0.16, 1 - d * 0.5).toFixed(3);
                c.style.transform = `scale(${Math.max(0.9, 1 - Math.min(d, 1) * 0.08).toFixed(3)})`;
                const bl = Math.min(d, 1.2);
                c.style.filter = bl > 0.05 ? `blur(${bl.toFixed(2)}px)` : 'none';
            });

            const active = Math.round(pos);
            cards.forEach((c, i) => c.classList.toggle('is-active', i === active));
            ticks.forEach((t, i) => t.classList.toggle('is-active', i === active));
            if (prevBtn) prevBtn.disabled = active <= 0;
            if (nextBtn) nextBtn.disabled = active >= count - 1;
        }

        // --- Reduced motion / mobile: classic click/arrow stepping, no scroll pinning ---
        if (reduceMotion || isMobileChronik) {
            let current = 0;
            const activate = (index) => { current = Math.max(0, Math.min(count - 1, index)); render(current); };
            ticks.forEach((tick) => tick.addEventListener('click', () => activate(parseInt(tick.dataset.index, 10))));
            if (prevBtn) prevBtn.addEventListener('click', () => activate(current - 1));
            if (nextBtn) nextBtn.addEventListener('click', () => activate(current + 1));
            pin.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') activate(current - 1);
                else if (e.key === 'ArrowRight') activate(current + 1);
            });
            window.addEventListener('resize', () => { layoutRail(); render(current); }, { passive: true });
            requestAnimationFrame(() => { layoutRail(); render(0); });
            return;
        }

        // --- Scroll-driven (pinned): milestones slide right→left while scrolling ---
        let disp = 0, target = 0, ticking = false, inView = false;

        const scrollDistance = () => Math.max(1, pin.offsetHeight - window.innerHeight);

        function readTarget() {
            const total = scrollDistance();
            const top = pin.getBoundingClientRect().top;
            const scrolled = Math.min(Math.max(-top, 0), total);
            target = (scrolled / total) * (count - 1);
        }

        function frame() {
            readTarget();
            disp += (target - disp) * 0.16;
            if (Math.abs(target - disp) < 0.0008) disp = target;
            render(disp);
            if (Math.abs(target - disp) >= 0.0008) {
                requestAnimationFrame(frame);
            } else {
                ticking = false;
            }
        }

        function ensureLoop() {
            if (!ticking) { ticking = true; requestAnimationFrame(frame); }
        }

        function scrollToIndex(i) {
            const idx = Math.max(0, Math.min(count - 1, i));
            const total = scrollDistance();
            const p = count > 1 ? idx / (count - 1) : 0;
            const y = window.scrollY + pin.getBoundingClientRect().top + p * total;
            window.scrollTo({ top: Math.round(y), behavior: 'smooth' });
        }

        ticks.forEach((tick) => tick.addEventListener('click', () => scrollToIndex(parseInt(tick.dataset.index, 10))));
        if (prevBtn) prevBtn.addEventListener('click', () => scrollToIndex(Math.round(disp) - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => scrollToIndex(Math.round(disp) + 1));
        pin.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') scrollToIndex(Math.round(disp) - 1);
            else if (e.key === 'ArrowRight') scrollToIndex(Math.round(disp) + 1);
        });

        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((e) => { inView = e.isIntersecting; if (inView) ensureLoop(); });
            }, { threshold: 0 });
            io.observe(pin);
        } else {
            inView = true;
        }

        window.addEventListener('scroll', ensureLoop, { passive: true });
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => { layoutRail(); ensureLoop(); }, 120);
        }, { passive: true });

        requestAnimationFrame(() => {
            layoutRail();
            readTarget();
            disp = target;
            render(disp);
            ensureLoop();
        });
    }

    // ==========================================
    // INIT
    // ==========================================
    function init() {
        initTextReveal();
        setupTestimonials();
        setupGalleryFilter();
        setupLightbox();
        setupNewsModal();
        setupChronik();
        animateOnScroll();
        handleNavScroll();
        initCursorFollower();

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
