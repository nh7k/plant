// Scroll effects and interactions for PlantGift website

class ScrollEffects {
    constructor() {
        this.scrollPosition = 0;
        this.ticking = false;
        this.sections = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeScrollSpy();
        this.initializeScrollToTop();
        this.initializeParallaxScrolling();
        this.initializeScrollReveal();
        this.initializeScrollProgress();
        this.initializeSmoothScrolling();
        this.initializeScrollBasedAnimations();
        this.initializeInfiniteScroll();
    }

    bindEvents() {
        window.addEventListener('scroll', this.onScroll.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));
        
        // Passive event listeners for better performance
        window.addEventListener('scroll', this.updateScrollPosition.bind(this), { passive: true });
    }

    onScroll() {
        if (!this.ticking) {
            requestAnimationFrame(this.updateElements.bind(this));
            this.ticking = true;
        }
    }

    onResize() {
        this.calculateSections();
        this.updateScrollProgress();
    }

    updateScrollPosition() {
        this.scrollPosition = window.scrollY;
    }

    updateElements() {
        this.updateNavbarOnScroll();
        this.updateParallaxElements();
        this.updateScrollProgress();
        this.updateScrollSpy();
        this.updateScrollToTop();
        this.checkScrollAnimations();
        this.ticking = false;
    }

    // Navbar scroll effects
    updateNavbarOnScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        if (this.scrollPosition > 100) {
            navbar.classList.add('scrolled');
            navbar.style.backdropFilter = 'blur(15px)';
            navbar.style.backgroundColor = 'rgba(20, 83, 45, 0.98)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.backgroundColor = 'rgba(20, 83, 45, 0.95)';
        }

        // Add/remove shadow based on scroll
        if (this.scrollPosition > 50) {
            navbar.style.boxShadow = '0 4px 30px rgba(20, 83, 45, 0.2)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    }

    // Scroll spy for navigation highlighting
    initializeScrollSpy() {
        this.calculateSections();
    }

    calculateSections() {
        this.sections = [];
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                this.sections.push({
                    id: targetId,
                    element: targetElement,
                    link: link,
                    offset: targetElement.offsetTop - 150
                });
            }
        });
    }

    updateScrollSpy() {
        if (this.sections.length === 0) return;

        let activeSection = null;
        
        for (let i = this.sections.length - 1; i >= 0; i--) {
            if (this.scrollPosition >= this.sections[i].offset) {
                activeSection = this.sections[i];
                break;
            }
        }

        // Update active navigation link
        this.sections.forEach(section => {
            section.link.classList.remove('active');
        });

        if (activeSection) {
            activeSection.link.classList.add('active');
        }
    }

    // Scroll to top button
    initializeScrollToTop() {
        this.createScrollToTopButton();
    }

    createScrollToTopButton() {
        const existingButton = document.querySelector('.scroll-to-top');
        if (existingButton) return;

        const button = document.createElement('button');
        button.className = 'scroll-to-top';
        button.innerHTML = '<i class="fas fa-leaf"></i>';
        button.setAttribute('aria-label', 'Scroll to top');
        
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
            color: var(--color-white);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            opacity: 0;
            visibility: hidden;
            transform: scale(0.8);
            transition: all var(--transition-normal);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        `;

        button.addEventListener('click', () => {
            this.smoothScrollToTop();
        });

        document.body.appendChild(button);
        this.scrollToTopButton = button;
    }

    updateScrollToTop() {
        if (!this.scrollToTopButton) return;

        if (this.scrollPosition > 500) {
            this.scrollToTopButton.style.opacity = '1';
            this.scrollToTopButton.style.visibility = 'visible';
            this.scrollToTopButton.style.transform = 'scale(1)';
        } else {
            this.scrollToTopButton.style.opacity = '0';
            this.scrollToTopButton.style.visibility = 'hidden';
            this.scrollToTopButton.style.transform = 'scale(0.8)';
        }
    }

    smoothScrollToTop() {
        const scrollToTop = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > 0) {
                window.scrollTo(0, currentScroll - (currentScroll / 8));
                requestAnimationFrame(scrollToTop);
            }
        };
        scrollToTop();
    }

    // Parallax scrolling effects
    initializeParallaxScrolling() {
        this.parallaxElements = document.querySelectorAll(
            '.hero-background, .floating-leaves, .parallax-element'
        );
    }

    updateParallaxElements() {
        if (this.parallaxElements.length === 0) return;

        this.parallaxElements.forEach((element, index) => {
            const speed = element.dataset.parallaxSpeed || (0.2 + index * 0.1);
            const yPos = -(this.scrollPosition * speed);
            
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    // Scroll reveal animations
    initializeScrollReveal() {
        this.revealElements = document.querySelectorAll(
            '.reveal-on-scroll, .plant-card, .feature-card, .service-card'
        );

        this.observeRevealElements();
    }

    observeRevealElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealElement(entry.target);
                }
            });
        }, observerOptions);

        this.revealElements.forEach(element => {
            element.classList.add('reveal-hidden');
            this.revealObserver.observe(element);
        });
    }

    revealElement(element) {
        element.classList.remove('reveal-hidden');
        element.classList.add('reveal-visible');
        
        // Add staggered animation for child elements
        const children = element.querySelectorAll('.stagger-child');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('stagger-visible');
            }, index * 100);
        });

        this.revealObserver.unobserve(element);
    }

    // Scroll progress indicator
    initializeScrollProgress() {
        this.createProgressBar();
    }

    createProgressBar() {
        const existingBar = document.querySelector('.scroll-progress');
        if (existingBar) return;

        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--color-accent), var(--color-mint), var(--color-primary));
            z-index: 9999;
            transition: width 0.1s ease-out;
        `;

        document.body.appendChild(progressBar);
        this.progressBar = progressBar;
    }

    updateScrollProgress() {
        if (!this.progressBar) return;

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

        this.progressBar.style.width = `${Math.min(Math.max(scrollPercent, 0), 100)}%`;
    }

    // Smooth scrolling for anchor links
    initializeSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                this.smoothScrollToElement(targetElement);
            }
        });
    }

    smoothScrollToElement(target, offset = 80) {
        const targetPosition = target.offsetTop - offset;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = Math.min(Math.abs(distance) * 0.5, 1500);
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutCubic(timeElapsed, startPosition, distance, duration);
            
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    // Scroll-based animations
    initializeScrollBasedAnimations() {
        this.animatedElements = document.querySelectorAll(
            '.animate-on-scroll, .count-up, .progress-bar-fill'
        );

        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerScrollAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        this.animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }

    triggerScrollAnimation(element) {
        if (element.classList.contains('count-up')) {
            this.animateCounter(element);
        } else if (element.classList.contains('progress-bar-fill')) {
            this.animateProgressBar(element);
        } else {
            element.classList.add('animated');
        }
    }

    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString() + 
                    (element.textContent.includes('+') ? '+' : '');
            }
        };

        updateCounter();
    }

    animateProgressBar(element) {
        const targetWidth = element.dataset.width || '100';
        element.style.width = '0%';
        
        setTimeout(() => {
            element.style.transition = 'width 2s ease-out';
            element.style.width = `${targetWidth}%`;
        }, 100);
    }

    checkScrollAnimations() {
        // Floating elements based on scroll
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            const movement = Math.sin(this.scrollPosition * 0.001 + index) * 10;
            element.style.transform = `translateY(${movement}px)`;
        });

        // Parallax floating leaves
        const leaves = document.querySelectorAll('.floating-leaves .leaf');
        leaves.forEach((leaf, index) => {
            const speed = 0.05 + (index * 0.02);
            const movement = this.scrollPosition * speed;
            leaf.style.transform = `translateY(${movement}px) rotate(${movement * 0.1}deg)`;
        });
    }

    // Infinite scroll for plant catalog (if needed)
    initializeInfiniteScroll() {
        const loadMoreButton = document.getElementById('load-more');
        if (!loadMoreButton) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadMoreContent();
                }
            });
        }, {
            rootMargin: '100px'
        });

        observer.observe(loadMoreButton);
    }

    loadMoreContent() {
        const plantsGrid = document.getElementById('plants-grid');
        const loadMoreButton = document.getElementById('load-more');
        
        if (!plantsGrid || !loadMoreButton) return;

        // Simulate loading more plants
        loadMoreButton.innerHTML = '<span class="loading"></span> Loading...';
        loadMoreButton.disabled = true;

        setTimeout(() => {
            // This would typically fetch more data from an API
            this.addPlaceholderCards(plantsGrid);
            
            loadMoreButton.innerHTML = '<i class="fas fa-plus"></i> Load More Plants';
            loadMoreButton.disabled = false;
        }, 1500);
    }

    addPlaceholderCards(container) {
        // This method would add more plant cards in a real implementation
        // For now, we'll just show a message
        if (window.PlantGift && window.PlantGift.showNotification) {
            window.PlantGift.showNotification('More plants loaded!', 'success');
        }
    }

    // Scroll-based background effects
    initializeScrollBasedBackgrounds() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.updateSectionBackground(section, index);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(section);
        });
    }

    updateSectionBackground(section, index) {
        // Subtle background color shifts based on section
        const colors = [
            'rgba(187, 247, 208, 0.1)',
            'rgba(167, 243, 208, 0.1)',
            'rgba(20, 83, 45, 0.05)',
            'rgba(22, 101, 52, 0.05)'
        ];

        document.body.style.backgroundColor = colors[index % colors.length];
    }

    // Touch and mobile scroll optimizations
    initializeMobileScrollOptimizations() {
        if ('ontouchstart' in window) {
            // Optimize for touch devices
            this.optimizeForTouch();
        }
    }

    optimizeForTouch() {
        // Reduce animation frequency on mobile
        this.throttleDelay = 32; // 30fps instead of 60fps
        
        // Disable parallax on mobile for better performance
        if (window.innerWidth < 768) {
            this.parallaxElements.forEach(element => {
                element.style.transform = 'none';
            });
        }
    }

    // Performance monitoring
    monitorScrollPerformance() {
        if (performance.mark) {
            performance.mark('scroll-start');
            
            setTimeout(() => {
                performance.mark('scroll-end');
                performance.measure('scroll-performance', 'scroll-start', 'scroll-end');
                
                const measure = performance.getEntriesByName('scroll-performance')[0];
                if (measure.duration > 16) {
                    console.warn('Scroll performance issue detected:', measure.duration + 'ms');
                }
            }, 100);
        }
    }

    // Cleanup method
    destroy() {
        window.removeEventListener('scroll', this.onScroll.bind(this));
        window.removeEventListener('resize', this.onResize.bind(this));
        
        if (this.revealObserver) {
            this.revealObserver.disconnect();
        }
        
        if (this.scrollToTopButton) {
            this.scrollToTopButton.remove();
        }
        
        if (this.progressBar) {
            this.progressBar.remove();
        }
    }
}

// Add CSS for scroll effects
const scrollEffectsCSS = `
.reveal-hidden {
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.8s ease-out;
}

.reveal-visible {
    opacity: 1;
    transform: translateY(0);
}

.stagger-child {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease-out;
}

.stagger-visible {
    opacity: 1;
    transform: translateY(0);
}

.animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;
}

.animate-on-scroll.animated {
    opacity: 1;
    transform: translateY(0);
}

.scroll-to-top:hover {
    transform: scale(1.1) !important;
    box-shadow: 0 8px 25px rgba(20, 83, 45, 0.3) !important;
}

.scroll-to-top:active {
    transform: scale(0.95) !important;
}

/* Smooth scrolling for browsers that don't support CSS scroll-behavior */
html {
    scroll-behavior: smooth;
}

/* Loading indicator for infinite scroll */
.loading {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Parallax optimization for reduced motion */
@media (prefers-reduced-motion: reduce) {
    .parallax-element,
    .floating-element {
        transform: none !important;
    }
}

/* Mobile scroll optimizations */
@media (max-width: 768px) {
    .scroll-to-top {
        bottom: 20px !important;
        right: 20px !important;
        width: 45px !important;
        height: 45px !important;
        font-size: 16px !important;
    }
    
    .reveal-hidden {
        transform: translateY(30px);
    }
}
`;

// Inject scroll effects CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = scrollEffectsCSS;
document.head.appendChild(styleSheet);

// Initialize scroll effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scrollEffects = new ScrollEffects();
});

// Export for use in other scripts
window.ScrollEffects = ScrollEffects;
