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

    function setMenuState(isOpen) {
        navToggle?.classList.toggle('active', isOpen);
        navLinks?.classList.toggle('open', isOpen);
        navToggle?.setAttribute('aria-expanded', String(isOpen));
        navToggle?.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    navToggle?.addEventListener('click', () => {
        setMenuState(!navLinks?.classList.contains('open'));
    });

    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            setMenuState(false);
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && navLinks?.classList.contains('open')) {
            setMenuState(false);
            navToggle?.focus();
        }
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
    // In WordPress this marked preview form is replaced server-side with the
    // imported WPForms form. Deliberately do not simulate successful sends.

    function setupPrivacyPolicyLink() {
        const privacyUrl = window.leadwerkTheme?.privacyUrl || 'datenschutz.html';
        const needle = 'Datenschutzerklärung';

        document.querySelectorAll('.wpforms-field-gdpr-checkbox .wpforms-field-label-inline').forEach(label => {
            if (label.querySelector('.leadwerk-privacy-link')) return;

            const walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);
            let textNode = walker.nextNode();

            while (textNode && !textNode.nodeValue.includes(needle)) {
                textNode = walker.nextNode();
            }
            if (!textNode) return;

            const [before, after] = textNode.nodeValue.split(needle);
            const fragment = document.createDocumentFragment();
            const link = document.createElement('a');

            fragment.append(document.createTextNode(before));
            link.className = 'leadwerk-privacy-link';
            link.href = privacyUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = needle;
            link.addEventListener('click', event => event.stopPropagation());
            fragment.append(link, document.createTextNode(after));
            textNode.replaceWith(fragment);
        });
    }

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
    // WOHNIDEEN-GALERIE (Inspiration Subpage)
    // Kacheln stammen aus assets/data/wohnideen.js
    // ==========================================

    // Wie viele Kacheln pro Schritt sichtbar werden
    const WOHNIDEEN_BATCH = 15;

    // Jede dritte Kachel breit, jede vierte hoch – erzeugt das Masonry-Muster
    // ohne dass pro Bild ein Format gepflegt werden muss.
    function wohnideeShapeClass(index) {
        if (index % 7 === 0) return ' masonry-item--wide';
        if (index % 5 === 2) return ' masonry-item--tall';
        return '';
    }

    function setupGallery() {
        const grid = document.getElementById('wohnideenGrid');
        const data = window.WOHNIDEEN;
        if (!grid || !Array.isArray(data)) return;

        const emptyMsg = grid.querySelector('.masonry-empty');
        const moreBtn = document.getElementById('wohnideenMore');
        const roomButtons = document.querySelectorAll('[data-filter-group="room"] button');
        const materialButtons = document.querySelectorAll('[data-filter-group="material"] button');
        const farbeButtons = document.querySelectorAll('[data-filter-group="farbe"] button');

        let activeRoom = 'all';
        let activeMaterial = 'all';
        let activeFarbe = 'all';
        let shownCount = WOHNIDEEN_BATCH;

        function matches(entry) {
            return (activeRoom === 'all' || entry.raum === activeRoom) &&
                   (activeMaterial === 'all' || entry.material === activeMaterial) &&
                   (activeFarbe === 'all' || entry.farbe === activeFarbe);
        }

        function buildTile(entry, index) {
            const tile = document.createElement('div');
            tile.className = 'masonry-item' + wohnideeShapeClass(index);
            tile.dataset.id = entry.id;

            const img = document.createElement('img');
            const assetBase = window.leadwerkTheme?.assetsUrl || '';
            img.src = assetBase + 'images/wohnideen/' + entry.id + '.webp';
            img.alt = entry.titel;
            img.loading = 'lazy';
            // Solange die Bilddateien aus OneDrive fehlen, bleibt die Kachel als
            // beschrifteter Platzhalter stehen, damit Filter und Großansicht
            // trotzdem geprüft werden können.
            img.addEventListener('error', () => {
                tile.classList.add('masonry-item--missing');
                tile.dataset.missing = 'Bild ' + entry.id + ' fehlt';
            });

            const overlay = document.createElement('div');
            overlay.className = 'masonry-overlay';
            const span = document.createElement('span');
            span.textContent = entry.titel;
            overlay.appendChild(span);

            tile.appendChild(img);
            tile.appendChild(overlay);
            tile.addEventListener('click', () => openLightbox(entry));
            return tile;
        }

        function render() {
            const filtered = data.filter(matches);
            const visible = filtered.slice(0, shownCount);

            grid.querySelectorAll('.masonry-item').forEach(el => el.remove());
            const fragment = document.createDocumentFragment();
            visible.forEach((entry, i) => fragment.appendChild(buildTile(entry, i)));
            grid.appendChild(fragment);

            // Großansicht blättert nur durch das, was gerade gefiltert ist
            setLightboxSet(filtered);

            if (emptyMsg) emptyMsg.hidden = filtered.length > 0;
            if (moreBtn) {
                const remaining = filtered.length - visible.length;
                moreBtn.hidden = remaining <= 0;
                moreBtn.textContent = 'Mehr Inspirationen laden (' + remaining + ')';
            }
            requestAnimationFrame(() => {
                grid.querySelectorAll('.masonry-item').forEach(el => el.classList.add('animated'));
            });
        }

        function bindGroup(buttons, setValue) {
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    setValue(btn);
                    shownCount = WOHNIDEEN_BATCH;
                    render();
                });
            });
        }

        bindGroup(roomButtons, btn => { activeRoom = btn.dataset.room; });
        bindGroup(materialButtons, btn => { activeMaterial = btn.dataset.material; });
        bindGroup(farbeButtons, btn => { activeFarbe = btn.dataset.farbe; });

        if (moreBtn) {
            moreBtn.addEventListener('click', () => {
                shownCount += WOHNIDEEN_BATCH;
                render();
            });
        }

        render();
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
    // GALLERY LIGHTBOX (Großansicht der Wohnideen)
    // ==========================================

    const KF_WHATSAPP = '4972407285';
    const KF_MAIL = 'info@kraft-fliesen.de';

    // Anzeigenamen der Filterwerte für die Hashtags in der Großansicht
    const WOHNIDEEN_LABELS = {
        bad: 'Bad',
        wohnbereich: 'Wohnbereich',
        kueche: 'Küche',
        outdoor: 'Outdoor',
        schlafen: 'Schlafen',
        fliesen: 'Fliesen',
        holz: 'Holz',
        naturstein: 'Naturstein',
        vinyl: 'Vinyl',
        Weiss: 'Weiß',
        Farben: 'Farbig'
    };

    // Der aktuell gefilterte Satz, durch den vor/zurück blättert.
    let lightboxSet = [];
    let lightboxIndex = 0;
    let showLightboxAt = null;
    let openLightboxEl = null;

    function setLightboxSet(entries) {
        lightboxSet = Array.isArray(entries) ? entries : [];
    }

    function openLightbox(entry) {
        const idx = lightboxSet.indexOf(entry);
        if (idx === -1 || !showLightboxAt || !openLightboxEl) return;
        showLightboxAt(idx);
        openLightboxEl();
    }

    function anfrageText(entry) {
        let text = 'Hallo Kraft Fliesen Team, ich interessiere mich für die Wohnidee "' +
                   entry.titel + '" (Bild-Nr. ' + entry.id + ').';
        if (entry.produkte && entry.produkte.length) {
            text += ' Abgebildete Produkte: ' + entry.produkte.join(', ') + '.';
        }
        text += ' Bitte melden Sie sich bei mir.';
        return text;
    }

    function setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;

        const imgEl = lightbox.querySelector('.lightbox-img');
        const titleEl = lightbox.querySelector('.lightbox-title');
        const textEl = lightbox.querySelector('.lightbox-text');
        const productsEl = lightbox.querySelector('.lightbox-products');
        const productListEl = lightbox.querySelector('.lightbox-product-list');
        const tagsEl = lightbox.querySelector('.lightbox-tags');
        const waEl = lightbox.querySelector('.lightbox-whatsapp');
        const mailEl = lightbox.querySelector('.lightbox-mail');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        function show(index) {
            if (lightboxSet.length === 0) return;
            lightboxIndex = (index + lightboxSet.length) % lightboxSet.length;
            const entry = lightboxSet[lightboxIndex];

            const assetBase = window.leadwerkTheme?.assetsUrl || '';
            imgEl.src = assetBase + 'images/wohnideen/' + entry.id + '.webp';
            imgEl.alt = entry.titel;
            if (titleEl) titleEl.textContent = entry.titel;
            if (textEl) textEl.textContent = entry.untertitel || '';

            if (productListEl && productsEl) {
                productListEl.replaceChildren();
                const produkte = entry.produkte || [];
                produkte.forEach(p => {
                    const li = document.createElement('li');
                    li.textContent = p;
                    productListEl.appendChild(li);
                });
                productsEl.hidden = produkte.length === 0;
            }

            if (tagsEl) {
                tagsEl.replaceChildren();
                [entry.raum, entry.material, entry.farbe].forEach(tag => {
                    if (!tag) return;
                    const span = document.createElement('span');
                    span.className = 'lightbox-tag';
                    span.textContent = '#' + (WOHNIDEEN_LABELS[tag] || tag);
                    tagsEl.appendChild(span);
                });
            }

            // Vorformulierte Anfrage: der Interessent muss nur noch absenden
            const text = anfrageText(entry);
            if (waEl) waEl.href = 'https://wa.me/' + KF_WHATSAPP + '?text=' + encodeURIComponent(text);
            if (mailEl) {
                mailEl.href = 'mailto:' + KF_MAIL +
                    '?subject=' + encodeURIComponent('Anfrage Wohnidee ' + entry.id + ' – ' + entry.titel) +
                    '&body=' + encodeURIComponent(text);
            }
        }

        function open() {
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function close() {
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        showLightboxAt = show;
        openLightboxEl = open;

        closeBtn.addEventListener('click', close);
        prevBtn.addEventListener('click', () => show(lightboxIndex - 1));
        nextBtn.addEventListener('click', () => show(lightboxIndex + 1));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) close();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowLeft') show(lightboxIndex - 1);
            else if (e.key === 'ArrowRight') show(lightboxIndex + 1);
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
        setupPrivacyPolicyLink();
        initTextReveal();
        setupTestimonials();
        setupLightbox();
        setupGallery();
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
