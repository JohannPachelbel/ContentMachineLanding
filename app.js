// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Контент-Машина: Page loading...');
    
    // Get all navigation elements
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const navbarHeight = 70;
                    const targetPosition = targetSection.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Active menu highlighting and navbar styling on scroll
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const navbarHeight = 70;
        
        // Update navbar style
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active navigation link
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollTop >= sectionTop - navbarHeight - 100 && 
                scrollTop < sectionTop + sectionHeight - navbarHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
        
        // Parallax effect for hero section
        if (hero && scrollTop < window.innerHeight) {
            const parallaxSpeed = 0.5;
            const yPos = scrollTop * parallaxSpeed;
            hero.style.transform = `translateY(${yPos}px)`;
        }
    }
    
    // Throttled scroll event for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', function() {
        requestTick();
        ticking = false;
    });
    
    // Initial calls
    handleScroll();
    
    // FIXED: Enhanced Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    console.log('Found accordion headers:', accordionHeaders.length);
    
    accordionHeaders.forEach((header, index) => {
        console.log(`Setting up accordion ${index + 1}`);
        
        // Set initial state
        const accordionItem = header.parentElement;
        const accordionIcon = header.querySelector('.accordion-icon');
        
        if (accordionIcon) {
            accordionIcon.textContent = '+';
        }
        
        // Set accessibility attributes
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('aria-controls', `accordion-content-${index}`);
        
        const accordionContent = accordionItem.querySelector('.accordion-content');
        if (accordionContent) {
            accordionContent.setAttribute('id', `accordion-content-${index}`);
        }
        
        // Click handler
        header.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`Accordion ${index + 1} clicked`);
            
            const isActive = accordionItem.classList.contains('active');
            
            // Close all other accordion items
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    const otherItem = otherHeader.parentElement;
                    const otherIcon = otherHeader.querySelector('.accordion-icon');
                    
                    otherItem.classList.remove('active');
                    if (otherIcon) {
                        otherIcon.textContent = '+';
                    }
                    otherHeader.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current accordion item
            if (isActive) {
                accordionItem.classList.remove('active');
                if (accordionIcon) {
                    accordionIcon.textContent = '+';
                }
                header.setAttribute('aria-expanded', 'false');
                console.log(`Accordion ${index + 1} closed`);
            } else {
                accordionItem.classList.add('active');
                if (accordionIcon) {
                    accordionIcon.textContent = '−';
                }
                header.setAttribute('aria-expanded', 'true');
                console.log(`Accordion ${index + 1} opened`);
                
                // Smooth scroll to the opened accordion if it's not fully visible
                setTimeout(() => {
                    const rect = accordionItem.getBoundingClientRect();
                    const navbarHeight = 70;
                    
                    if (rect.bottom > window.innerHeight || rect.top < navbarHeight) {
                        const scrollPosition = window.pageYOffset + rect.top - navbarHeight - 20;
                        window.scrollTo({
                            top: scrollPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 400);
            }
        });
        
        // Keyboard accessibility
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Focus styles
        header.addEventListener('focus', function() {
            this.style.outline = '2px solid #1fb8cd';
            this.style.outlineOffset = '2px';
        });
        
        header.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for grid items
                const gridItems = entry.target.querySelectorAll('.problem-card, .audience-card, .skill-button, .pricing-card');
                gridItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }
        });
    }, observerOptions);
    
    // Observe sections for animations
    const animatedSections = document.querySelectorAll('.section');
    animatedSections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Observe individual cards for staggered animations
    const cards = document.querySelectorAll('.problem-card, .audience-card, .skill-button, .accordion-item, .pricing-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        
        observer.observe(card);
    });
    
    // Enhanced contact button interactions
    const contactButtons = document.querySelectorAll('.contact-btn');
    contactButtons.forEach((button, index) => {
        console.log(`Setting up contact button ${index + 1}:`, button.href);
        
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
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
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Log click for debugging
            console.log('Contact button clicked:', this.href);
        });
        
        // Hover effect enhancement
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Skill button interactions
    const skillButtons = document.querySelectorAll('.skill-button');
    skillButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            console.log(`Skill button ${index + 1} clicked`);
            
            // Add pulse animation
            this.style.animation = 'pulse 0.6s ease-out';
            
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
        
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Pricing card enhanced interactions
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            if (this.classList.contains('pricing-card--featured')) {
                this.style.transform = 'translateY(-10px) scale(1.08)';
            } else {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('pricing-card--featured')) {
                this.style.transform = 'scale(1.05)';
            } else {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // Hero section animation on load
    function initHeroAnimation() {
        const heroContent = document.querySelector('.hero-content');
        const heroOverlay = document.querySelector('.hero-overlay');
        
        if (heroContent) {
            setTimeout(() => {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 500);
        }
        
        if (heroOverlay) {
            setTimeout(() => {
                heroOverlay.style.opacity = '0.6';
            }, 1000);
        }
        
        console.log('Hero animation initialized');
    }
    
    // Initialize hero animation
    initHeroAnimation();
    
    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Add keyboard shortcuts for quick navigation
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case '2':
                    e.preventDefault();
                    document.getElementById('problems')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case '3':
                    e.preventDefault();
                    document.getElementById('audience')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case '4':
                    e.preventDefault();
                    document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case '5':
                    e.preventDefault();
                    document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case '6':
                    e.preventDefault();
                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                    break;
            }
        }
    });
    
    // Performance optimization: Preload images
    function preloadImages() {
        const images = [
            'https://pplx-res.cloudinary.com/image/upload/v1749075365/pplx_project_search_images/1ce621060e267a8c79cb742804c35bb6cfad0374.jpg',
            'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/562961d7-8334-4528-ba11-d426c96b6abd.png',
            'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/4b25f2ff-78f3-4bad-92cb-7d5773492972.png',
            'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/f79f6daf-abd8-4628-a6a2-9fc8dfb7dd1c.png',
            'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/8711eab4-f1ae-438c-9458-d6d8a2828522.png'
        ];
        
        images.forEach((src, index) => {
            const img = new Image();
            img.onload = () => console.log(`Image ${index + 1} preloaded`);
            img.onerror = () => console.warn(`Failed to preload image ${index + 1}:`, src);
            img.src = src;
        });
        
        console.log('Image preloading started');
    }
    
    // Initialize preloading
    preloadImages();
    
    // Add resize handler for responsive behavior
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Recalculate positions after resize
            handleScroll();
            console.log('Window resized, recalculating positions');
        }, 250);
    });
    
    // Add loading states
    function showLoading() {
        document.body.classList.add('loading');
        console.log('Loading state: ON');
    }
    
    function hideLoading() {
        document.body.classList.remove('loading');
        console.log('Loading state: OFF');
    }
    
    // Initialize page
    showLoading();
    
    // Hide loading after everything is ready
    window.addEventListener('load', function() {
        setTimeout(() => {
            hideLoading();
            console.log('Page fully loaded');
        }, 1000);
    });
    
    // Add error handling for background images
    function checkBackgroundImages() {
        const sections = [
            { element: '.hero', url: 'https://pplx-res.cloudinary.com/image/upload/v1749075365/pplx_project_search_images/1ce621060e267a8c79cb742804c35bb6cfad0374.jpg' },
            { element: '.problems-section', url: 'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/562961d7-8334-4528-ba11-d426c96b6abd.png' },
            { element: '.skills-section', url: 'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/4b25f2ff-78f3-4bad-92cb-7d5773492972.png' },
            { element: '.program-section', url: 'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/f79f6daf-abd8-4628-a6a2-9fc8dfb7dd1c.png' },
            { element: '.pricing-section', url: 'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/8711eab4-f1ae-438c-9458-d6d8a2828522.png' }
        ];
        
        sections.forEach(section => {
            const element = document.querySelector(section.element);
            if (element) {
                const img = new Image();
                img.onload = () => console.log(`Background image loaded for ${section.element}`);
                img.onerror = () => {
                    console.warn(`Failed to load background image for ${section.element}:`, section.url);
                    element.style.backgroundColor = '#1a1a1a';
                };
                img.src = section.url;
            }
        });
    }
    
    // Check background images
    checkBackgroundImages();
    
    // Add smooth scrolling to contact buttons
    const phoneLinks = document.querySelectorAll('a[href*="wa.me"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('WhatsApp contact clicked:', this.href);
        });
    });
    
    const telegramLinks = document.querySelectorAll('a[href*="t.me"]');
    telegramLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Telegram contact clicked:', this.href);
        });
    });
    
    const vkLinks = document.querySelectorAll('a[href*="vk.com"]');
    vkLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('VK contact clicked:', this.href);
        });
    });
    
    // Final debug information
    setTimeout(() => {
        console.log('=== Контент-Машина Debug Info ===');
        console.log('Navigation links:', navLinks.length);
        console.log('Sections:', sections.length);
        console.log('Accordion items:', accordionHeaders.length);
        console.log('Contact buttons:', contactButtons.length);
        console.log('Skill buttons:', skillButtons.length);
        console.log('Pricing cards:', pricingCards.length);
        console.log('Hero element:', !!hero);
        console.log('Navbar element:', !!navbar);
        console.log('=== End Debug Info ===');
    }, 2000);
    
    // Ensure all elements are visible
    setTimeout(() => {
        const allSections = document.querySelectorAll('.section');
        allSections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
        
        const allCards = document.querySelectorAll('.problem-card, .audience-card, .skill-button, .accordion-item, .pricing-card');
        allCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        
        console.log('All elements visibility ensured');
    }, 3000);
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .contact-btn {
        position: relative;
        overflow: hidden;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Add performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page load time:', Math.round(perfData.loadEventEnd - perfData.loadEventStart), 'ms');
            }
        }, 0);
    });
}

// Export for debugging
window.KontentMashina = {
    version: '1.0.0',
    debug: true,
    initialized: false
};

// Mark as initialized
setTimeout(() => {
    window.KontentMashina.initialized = true;
    console.log('Контент-Машина fully initialized');
}, 1000);