document.addEventListener('DOMContentLoaded', () => {
    // 0. Preloader Logic
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.querySelector('.preloader-bar');
    const percentText = document.querySelector('.preloader-status .percent');

    document.body.classList.add('preloader-active');

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;

        if (preloaderBar) preloaderBar.style.width = `${progress}%`;
        if (percentText) percentText.textContent = `${Math.floor(progress)}%`;

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                if (preloader) {
                    preloader.classList.add('loaded');
                    document.body.classList.remove('preloader-active');

                    // Trigger initial animations
                    document.querySelectorAll('section').forEach((s, i) => {
                        setTimeout(() => s.classList.add('reveal'), 200 * i);
                    });
                }
            }, 600);
        }
    }, 150);

    // Initial check for window load to ensure everything is ready
    window.addEventListener('load', () => {
        if (progress < 90) progress = 90; // Fast track to end
    });

    // Theme & Navigation Elements
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.querySelector('.menu-toggle');
    const navContent = document.querySelector('.nav-content');
    const html = document.documentElement;
    const body = document.body;

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    html.setAttribute('data-theme', savedTheme);

    // Premium Theme Toggle Logic
    if (themeToggle) {
        // Magnetic Effect
        themeToggle.addEventListener('mousemove', (e) => {
            const rect = themeToggle.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            themeToggle.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
        });

        themeToggle.addEventListener('mouseleave', () => {
            themeToggle.style.transform = '';
        });

        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Refresh background blobs for the new theme
            if (typeof initBlobs === 'function') initBlobs();

            // Pop animation
            themeToggle.style.transform = 'scale(1.4)';
            setTimeout(() => themeToggle.style.transform = '', 250);
        });
    }

    // Mobile Menu Logic
    if (menuToggle && navContent) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navContent.classList.toggle('active');
            body.style.overflow = navContent.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navContent.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }

    // 1. Mesh Background Simulation (Advanced)
    const canvas = document.getElementById('liquid-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let blobs = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Blob {
        constructor(color) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 400 + 300;
            this.color = color;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.sinX = Math.random() * Math.PI * 2;
            this.sinY = Math.random() * Math.PI * 2;
        }

        update() {
            this.sinX += 0.005;
            this.sinY += 0.005;

            this.x += this.vx + Math.sin(this.sinX) * 0.5;
            this.y += this.vy + Math.cos(this.sinY) * 0.5;

            if (this.x < -this.radius) this.x = width + this.radius;
            if (this.x > width + this.radius) this.x = -this.radius;
            if (this.y < -this.radius) this.y = height + this.radius;
            if (this.y > height + this.radius) this.y = -this.radius;
        }

        draw() {
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'transparent');

            const currentTheme = document.documentElement.getAttribute('data-theme');
            ctx.globalCompositeOperation = currentTheme === 'light' ? 'multiply' : 'screen';
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initBlobs() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const colors = isLight ? [
            'rgba(255, 139, 115, 0.28)', // Rich Peach
            'rgba(138, 153, 255, 0.25)',  // Saturated Periwinkle
            'rgba(86, 255, 164, 0.18)',  // Vibrant Mint
            'rgba(191, 125, 255, 0.15)'  // Royal Lavender
        ] : [
            'rgba(255, 77, 77, 0.12)',   // Original Dark Blobs
            'rgba(138, 43, 226, 0.1)',
            'rgba(0, 212, 255, 0.06)',
            'rgba(255, 77, 77, 0.04)'
        ];

        blobs = colors.map(color => new Blob(color));

        // Initialize colorful particles ONLY for light mode
        if (isLight) {
            initColorfulParticles();
        } else {
            colorfulParticles = [];
        }
    }

    let colorfulParticles = [];
    class ColorfulParticle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 150 + 50;
            const colors = ['rgba(255, 139, 115, 0.15)', 'rgba(138, 153, 255, 0.12)', 'rgba(86, 255, 164, 0.1)', 'rgba(191, 125, 255, 0.08)'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < -this.size) this.x = width + this.size;
            if (this.x > width + this.size) this.x = -this.size;
            if (this.y < -this.size) this.y = height + this.size;
            if (this.y > height + this.size) this.y = -this.size;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initColorfulParticles() {
        colorfulParticles = [];
        for (let i = 0; i < 8; i++) {
            colorfulParticles.push(new ColorfulParticle());
        }
    }

    initBlobs();

    // 2. Setup Jellyfish Cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 40 40" style="overflow: visible;">
            <path class="jellyfish-head" d="M10,20 C10,5 30,5 30,20 L30,22 Q20,25 10,22 Z" />
            <g class="tentacles">
                <path d="M15,22 Q15,30 15,38" />
                <path d="M20,22 Q20,32 20,40" />
                <path d="M25,22 Q25,30 25,38" />
            </g>
        </svg>
    `;
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let cursorX = mouseX, cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.body.style.setProperty('--mouse-x', `${(mouseX / window.innerWidth) * 100}%`);
        document.body.style.setProperty('--mouse-y', `${(mouseY / window.innerHeight) * 100}%`);
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw Mesh Blobs
        blobs.forEach(blob => {
            blob.update();
            blob.draw();
        });

        // Draw Colorful Bokeh Particles (Light Mode Only)
        colorfulParticles.forEach(p => {
            p.update();
            p.draw();
        });

        // Interactive Cursor Follow logic
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.transform = `translate(${cursorX - 40}px, ${cursorY - 40}px)`;

        requestAnimationFrame(animate);
    }
    animate();

    // Cursor Hover States
    const interactiveElements = document.querySelectorAll('a, button, .glass');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            cursor.style.transform += ' scale(1.3)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(2.5)';
            cursorDot.style.backgroundColor = currentTheme === 'light' ? 'var(--text)' : '#fff';
            cursorDot.style.boxShadow = `0 0 15px ${currentTheme === 'light' ? 'var(--text)' : '#fff'}`;
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = cursor.style.transform.replace(' scale(1.3)', '');
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorDot.style.backgroundColor = 'var(--accent)';
            cursorDot.style.boxShadow = '0 0 8px var(--accent)';
        });
    });

    // 3. Magnetic Buttons & Click Ripple
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0, 0)`;
        });

        // Button Click Glow Ripple
        btn.addEventListener('click', function (e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const glow = document.createElement('span');
            glow.classList.add('btn-glow');
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;

            this.appendChild(glow);
            setTimeout(() => glow.remove(), 600);
        });
    });

    // 4. 3D Tilt & Glare Tracking for Cards
    const cards = document.querySelectorAll('.glass');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // X and Y relative to the card, required for CSS glare mask
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--card-mouse-x', `${x}px`);
            card.style.setProperty('--card-mouse-y', `${y}px`);
        });
    });

    // 5. Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, .glass, .work-card').forEach(el => {
        observer.observe(el);
    });

    const revealStyle = document.createElement('style');
    revealStyle.innerHTML = `.reveal { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(revealStyle);

    // 7. Global Click Interactive Effects
    document.addEventListener('click', (e) => {
        // 1. Spawn Ripple
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => ripple.remove(), 800);

        // 2. Jellyfish Cursor Pulse Burst
        const head = cursor.querySelector('.jellyfish-head');
        if (head) {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const pulseColor = currentTheme === 'light' ? '#000' : '#fff';

            head.style.fill = pulseColor;
            head.style.filter = `drop-shadow(0 0 40px ${pulseColor})`;
            head.style.transform = 'scale(1.2)';
            head.style.transformOrigin = 'center';
            head.style.transition = 'all 0.1s ease-out';

            setTimeout(() => {
                head.style.fill = 'var(--accent)';
                head.style.filter = 'drop-shadow(0 0 15px var(--accent))';
                head.style.transform = 'scale(1)';
            }, 150);
        }
    });

    // 6. Active Link Highlight
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').includes(current));
        });
    });


    // 9. Scroll Progress Bar
    const scrollProgress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        if (!scrollProgress) return;
        const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = `${(totalScroll / windowHeight) * 100}%`;
        scrollProgress.style.width = scroll;
    });

    // Performance adjustment: Lower canvas opacity on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            canvas.style.opacity = '0.3';
        }
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            canvas.style.opacity = '0.6';
            scrollTimeout = null;
        }, 150);
    });
});
