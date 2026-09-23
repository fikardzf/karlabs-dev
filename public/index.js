/* KAR Labs v2.8.0 - Homepage interactions (cacheable asset) */
'use strict';
// Initialize Lucide Icons after deferred vendor script is ready
        if (window.lucide) window.lucide.createIcons();

        // ===== Navbar Scroll Effect =====
        const navbar = document.getElementById('navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }

            lastScroll = currentScroll;
        });

        // ===== Smooth Scroll with Offset =====
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offset = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                // Close mobile menu if open
                closeMobileMenu();
            });
        });

        // ===== Mobile Menu =====
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const closeMenuBtn = document.getElementById('close-menu');
        const overlay = document.getElementById('overlay');

        function openMobileMenu() {
            document.body.classList.add('mobile-menu-open');
            mobileMenu.classList.add('open');
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        }

        function closeMobileMenu() {
            document.body.classList.remove('mobile-menu-open');
            mobileMenu.classList.remove('open');
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }

        mobileMenuBtn.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) closeMobileMenu();
            else openMobileMenu();
        });
        closeMenuBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            closeMobileMenu();
        });
        closeMenuBtn.addEventListener('touchend', (event) => {
            event.preventDefault();
            event.stopPropagation();
            closeMobileMenu();
        }, { passive: false });
        overlay.addEventListener('click', closeMobileMenu);
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeMobileMenu();
        });

        // Close mobile menu on link click
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // ===== Scroll Animations (Intersection Observer) =====
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add stagger delay for grid items
                    const parent = entry.target.parentElement;
                    const siblings = parent ? Array.from(parent.querySelectorAll('.fade-in-up')) : [];
                    const siblingIndex = siblings.indexOf(entry.target);

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, siblingIndex * 100);

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in-up').forEach(el => {
            observer.observe(el);
        });

        // ===== Active Nav Link on Scroll =====
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        function updateActiveNav() {
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveNav);

        // ===== FAQ Accordion =====
        document.querySelectorAll('.faq-trigger').forEach(button => {
            button.addEventListener('click', () => {
                const content = button.nextElementSibling;
                const icon = button.querySelector('.accordion-icon');
                const isOpen = content.classList.contains('open');

                // Toggle current accordion
                content.classList.toggle('open');
                icon.classList.toggle('open');
            });
        });

        // ===== Contact Form =====
        const contactForm = document.getElementById('contact-form');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nama = document.getElementById('nama').value.trim();
            const kontak = document.getElementById('kontak-calon-client').value.trim();
            const jasa = document.getElementById('jasa').value;
            const pesan = document.getElementById('pesan').value.trim();

            if (!nama || !kontak) {
                alert('Nama dan Email / WhatsApp wajib diisi!');
                return;
            }

            const detailKebutuhan = pesan ? ` Kebutuhan saya: ${pesan}` : '';
            let message = `Halo KAR Labs, saya ${nama}. Saya tertarik dengan ${jasa || 'layanan digital KAR Labs'}.${detailKebutuhan} Kontak saya: ${kontak}`;
            message = encodeURIComponent(message);

            const waNumber = '6285777345985';
            const waWindow = window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
            if (waWindow) waWindow.opener = null;
        });

        // ===== Typing Animation for Code Editor (Optional Enhancement) =====
        // Already handled via CSS animations for simplicity
