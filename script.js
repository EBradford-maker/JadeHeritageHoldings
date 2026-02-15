/* ============================================================
   Jade Heritage Holdings — Script
   ============================================================ */

(function () {
    'use strict';

    // --- DOM References ---
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');
    const navLinks = document.querySelectorAll('.nav__link');
    const heroBackground = document.querySelector('.hero__bg');
    const contactForm = document.getElementById('contactForm');

    // --- Navbar: Scroll Behavior ---
    let lastScroll = 0;

    function handleNavScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 60) {
            navbar.classList.add('nav--scrolled');
        } else {
            navbar.classList.remove('nav--scrolled');
        }

        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // --- Mobile Menu ---
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveNav() {
        const scrollY = window.scrollY + 200;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNav, { passive: true });

    // --- Subtle Parallax on Hero ---
    function handleParallax() {
        if (!heroBackground) return;
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            heroBackground.style.transform = 'translateY(' + scrollY * 0.3 + 'px)';
        }
    }

    window.addEventListener('scroll', handleParallax, { passive: true });

    // --- Reveal on Scroll (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -60px 0px',
            }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: show everything
        revealElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // --- Stats Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat__number[data-target]');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        statNumbers.forEach(function (el) {
            const target = parseInt(el.getAttribute('data-target'), 10);
            const duration = 2000;
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);

                el.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    el.textContent = target;
                }
            }

            requestAnimationFrame(updateCount);
        });

        statsAnimated = true;
    }

    if ('IntersectionObserver' in window && statNumbers.length > 0) {
        const statsSection = document.querySelector('.about__stats');
        if (statsSection) {
            const statsObserver = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            animateStats();
                            statsObserver.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.3 }
            );

            statsObserver.observe(statsSection);
        }
    }

    // --- Contact Form (visual feedback only) ---
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var btn = contactForm.querySelector('button[type="submit"]');
            var originalText = btn.textContent;

            btn.textContent = 'Message Sent!';
            btn.style.background = '#2E7D32';
            btn.style.color = '#fff';
            btn.disabled = true;

            setTimeout(function () {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
                btn.disabled = false;
                contactForm.reset();
            }, 3000);
        });
    }

    // --- Smooth Scroll for anchor links (Safari fallback) ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var offsetTop = target.offsetTop - 80; // nav height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth',
                });
            }
        });
    });

    // --- Initial call ---
    handleNavScroll();
    highlightActiveNav();
})();
