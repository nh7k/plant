// Advanced animations and 3D effects for PlantGift website

class PlantAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.initializeFloatingLeaves();
        this.initializeParallaxEffects();
        this.initializePlantGrowthAnimations();
        this.initializeHoverEffects();
        this.initializeScrollAnimations();
        this.initializeBackgroundAnimations();
        this.initializeMorphingEffects();
    }

    // Floating leaves animation system
    initializeFloatingLeaves() {
        const leavesContainer = document.querySelector('.floating-leaves');
        if (!leavesContainer) return;

        // Create additional floating leaves
        this.createFloatingLeaves(leavesContainer, 10);
        
        // Animate existing leaves
        const leaves = leavesContainer.querySelectorAll('.leaf');
        leaves.forEach((leaf, index) => {
            this.animateLeaf(leaf, index);
        });

        // Regenerate leaves periodically
        setInterval(() => {
            this.regenerateLeaves(leavesContainer);
        }, 15000);
    }

    createFloatingLeaves(container, count) {
        const leafTypes = ['🍃', '🌿', '🍀', '🌱'];
        
        for (let i = 0; i < count; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'leaf floating-leaf';
            leaf.textContent = leafTypes[Math.floor(Math.random() * leafTypes.length)];
            
            // Random positioning
            leaf.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                font-size: ${Math.random() * 20 + 15}px;
                opacity: ${Math.random() * 0.6 + 0.2};
                z-index: ${Math.floor(Math.random() * 5) + 1};
                pointer-events: none;
            `;
            
            container.appendChild(leaf);
            this.animateLeaf(leaf, i);
        }
    }

    animateLeaf(leaf, index) {
        const duration = Math.random() * 10 + 8; // 8-18 seconds
        const delay = index * 0.5;
        
        leaf.style.animation = `
            floatLeaf ${duration}s ease-in-out ${delay}s infinite,
            leafSway ${duration * 0.3}s ease-in-out ${delay}s infinite alternate
        `;
    }

    regenerateLeaves(container) {
        const existingLeaves = container.querySelectorAll('.floating-leaf');
        
        // Remove old leaves gradually
        existingLeaves.forEach((leaf, index) => {
            setTimeout(() => {
                if (leaf.parentNode) {
                    leaf.style.opacity = '0';
                    setTimeout(() => {
                        if (leaf.parentNode) {
                            leaf.parentNode.removeChild(leaf);
                        }
                    }, 1000);
                }
            }, index * 200);
        });

        // Add new leaves
        setTimeout(() => {
            this.createFloatingLeaves(container, 5);
        }, 2000);
    }

    // Parallax effects for depth
    initializeParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax, .hero-background, .floating-leaves');
        
        if (parallaxElements.length === 0) return;

        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.scrollY;
            const rate = scrolled * -0.5;
            const rate2 = scrolled * -0.3;

            parallaxElements.forEach((element, index) => {
                const speed = index % 2 === 0 ? rate : rate2;
                element.style.transform = `translateY(${speed}px)`;
            });

            ticking = false;
        };

        const requestParallaxUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestParallaxUpdate);
    }

    // Plant growth animations
    initializePlantGrowthAnimations() {
        this.animateHeroPlant();
        this.animateTreeIllustration();
        this.initializeIntersectionObserver();
    }

    animateHeroPlant() {
        const plantContainer = document.querySelector('.plant-container');
        if (!plantContainer) return;

        // Add breathing animation
        plantContainer.style.animation = 'plantBreathe 4s ease-in-out infinite';

        // Animate individual plant parts
        const stem = plantContainer.querySelector('.stem');
        const leaves = plantContainer.querySelectorAll('.leaf-large, .leaf-medium, .leaf-small');

        if (stem) {
            stem.style.animation = 'growFromBottom 2s ease-out 0.5s both';
        }

        leaves.forEach((leaf, index) => {
            leaf.style.animation = `
                leafGrowIn 1.5s ease-out ${1 + index * 0.3}s both,
                leafSway ${3 + index}s ease-in-out infinite
            `;
        });
    }

    animateTreeIllustration() {
        const animatedTree = document.querySelector('.animated-tree');
        if (!animatedTree) return;

        const trunk = animatedTree.querySelector('.tree-trunk');
        const treeLeaves = animatedTree.querySelectorAll('.tree-leaves div');

        if (trunk) {
            trunk.style.animation = 'growFromBottom 2s ease-out both';
        }

        treeLeaves.forEach((leaf, index) => {
            leaf.style.animation = `
                scaleIn 1s ease-out ${1.5 + index * 0.2}s both,
                treeSway ${4 + index * 0.5}s ease-in-out infinite
            `;
        });
    }

    initializeIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger specific animations based on element type
                    if (entry.target.classList.contains('plant-card')) {
                        this.animatePlantCard(entry.target);
                    } else if (entry.target.classList.contains('feature-card')) {
                        this.animateFeatureCard(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const elementsToObserve = document.querySelectorAll(
            '.plant-card, .feature-card, .service-card, .testimonial-card, .team-member'
        );

        elementsToObserve.forEach(el => observer.observe(el));
    }

    animatePlantCard(card) {
        const image = card.querySelector('img');
        const content = card.querySelector('.card-content');

        if (image) {
            image.style.animation = 'zoomIn 0.8s ease-out';
        }

        if (content) {
            content.style.animation = 'fadeInUp 0.8s ease-out 0.2s both';
        }
    }

    animateFeatureCard(card) {
        const icon = card.querySelector('.feature-icon');
        const content = card.querySelector('h3, p');

        if (icon) {
            icon.style.animation = 'bounceIn 0.8s ease-out';
        }

        if (content) {
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.6s ease-out both';
            }, 200);
        }
    }

    // Enhanced hover effects
    initializeHoverEffects() {
        this.initializeCardHoverEffects();
        this.initializeButtonRippleEffects();
        this.initializeMagneticEffects();
    }

    initializeCardHoverEffects() {
        const cards = document.querySelectorAll('.plant-card, .feature-card, .service-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createParticleEffect(e.target);
            });

            card.addEventListener('mousemove', (e) => {
                this.updateCardTilt(e, card);
            });

            card.addEventListener('mouseleave', (e) => {
                this.resetCardTilt(card);
            });
        });
    }

    createParticleEffect(element) {
        const particles = document.createElement('div');
        particles.className = 'particle-effect';
        particles.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            overflow: hidden;
            border-radius: inherit;
        `;

        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--color-accent);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                opacity: 0;
                animation: particleFloat 2s ease-out infinite;
                animation-delay: ${i * 0.1}s;
            `;
            particles.appendChild(particle);
        }

        element.appendChild(particles);

        setTimeout(() => {
            if (particles.parentNode) {
                particles.parentNode.removeChild(particles);
            }
        }, 2000);
    }

    updateCardTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateZ(20px)
        `;
    }

    resetCardTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    }

    initializeButtonRippleEffects() {
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
        });
    }

    createRippleEffect(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;

        element.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    initializeMagneticEffects() {
        const magneticElements = document.querySelectorAll('.btn-primary, .nav-logo');

        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Scroll-based animations
    initializeScrollAnimations() {
        this.initializeCounterAnimations();
        this.initializeProgressBars();
        this.initializeTextRevealAnimations();
    }

    initializeCounterAnimations() {
        const counters = document.querySelectorAll('.stat h3, .impact-stat h3');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
        if (isNaN(target)) return;

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

    initializeProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.getAttribute('data-width') || '100';
                    bar.style.width = `${width}%`;
                    observer.unobserve(bar);
                }
            });
        });

        progressBars.forEach(bar => observer.observe(bar));
    }

    initializeTextRevealAnimations() {
        const textElements = document.querySelectorAll('.hero-title, .section-header h2');
        
        textElements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.cssText = `
                    display: inline-block;
                    opacity: 0;
                    animation: fadeInUp 0.5s ease-out ${index * 0.05}s both;
                `;
                element.appendChild(span);
            });
        });
    }

    // Background animations
    initializeBackgroundAnimations() {
        this.createFloatingElements();
        this.initializeGradientAnimation();
    }

    createFloatingElements() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        for (let i = 0; i < 5; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.style.cssText = `
                position: absolute;
                width: ${Math.random() * 100 + 50}px;
                height: ${Math.random() * 100 + 50}px;
                background: radial-gradient(circle, var(--color-accent), transparent);
                border-radius: 50%;
                opacity: 0.1;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatRandom ${Math.random() * 10 + 10}s ease-in-out infinite;
                pointer-events: none;
            `;
            hero.appendChild(element);
        }
    }

    initializeGradientAnimation() {
        const gradientElements = document.querySelectorAll('.hero, .cta-section');
        
        gradientElements.forEach(element => {
            element.style.backgroundSize = '400% 400%';
            element.style.animation = 'gradientShift 15s ease infinite';
        });
    }

    // Morphing effects
    initializeMorphingEffects() {
        this.initializeShapeTransitions();
        this.initializeColorTransitions();
    }

    initializeShapeTransitions() {
        const morphElements = document.querySelectorAll('.feature-icon, .service-icon');
        
        morphElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.borderRadius = '30% 70% 70% 30% / 30% 30% 70% 70%';
                element.style.transform = 'scale(1.1) rotate(5deg)';
            });

            element.addEventListener('mouseleave', () => {
                element.style.borderRadius = '50%';
                element.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }

    initializeColorTransitions() {
        const colorElements = document.querySelectorAll('.plant-card, .btn');
        
        colorElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.filter = 'hue-rotate(10deg) saturate(1.2)';
            });

            element.addEventListener('mouseleave', () => {
                element.style.filter = 'none';
            });
        });
    }
}

// Add custom CSS animations
const customAnimationsCSS = `
@keyframes plantBreathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
}

@keyframes leafSway {
    0%, 100% { transform: rotate(-2deg); }
    50% { transform: rotate(2deg); }
}

@keyframes treeSway {
    0%, 100% { transform: rotate(-1deg) scale(1); }
    50% { transform: rotate(1deg) scale(1.02); }
}

@keyframes growFromBottom {
    from {
        height: 0;
        opacity: 0;
    }
    to {
        height: 100%;
        opacity: 1;
    }
}

@keyframes leafGrowIn {
    from {
        transform: scale(0) rotate(-90deg);
        opacity: 0;
    }
    to {
        transform: scale(1) rotate(0deg);
        opacity: 1;
    }
}

@keyframes zoomIn {
    from {
        transform: scale(0.8);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes bounceIn {
    0% {
        transform: scale(0.3);
        opacity: 0;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.8;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes particleFloat {
    0% {
        opacity: 0;
        transform: translateY(0) scale(0);
    }
    20% {
        opacity: 1;
        transform: translateY(-20px) scale(1);
    }
    100% {
        opacity: 0;
        transform: translateY(-100px) scale(0);
    }
}

@keyframes floatRandom {
    0%, 100% {
        transform: translateY(0) translateX(0);
    }
    25% {
        transform: translateY(-20px) translateX(10px);
    }
    50% {
        transform: translateY(-10px) translateX(-10px);
    }
    75% {
        transform: translateY(-30px) translateX(5px);
    }
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject custom animations CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = customAnimationsCSS;
document.head.appendChild(styleSheet);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PlantAnimations();
});

// Export for use in other scripts
window.PlantAnimations = PlantAnimations;
