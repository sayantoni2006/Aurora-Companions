// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize smooth scrolling for navigation links
    initSmoothScrolling();
    
//     // Initialize video lazy loading
//     initVideoLazyLoading();
// });

// Animation initialization
function initAnimations() {
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    // Create Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.getAttribute('data-animation');
                const delay = element.getAttribute('data-delay') || 0;
                
                // Apply animation after delay
                setTimeout(() => {
                    element.classList.add(`animate-${animationType}`);
                    observer.unobserve(element); // Stop observing after animation
                }, parseInt(delay));
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust trigger point
    });
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Lazy load videos for better performance
function initVideoLazyLoading() {
    const videos = document.querySelectorAll('video[preload="auto"]');
    
    // Only load videos when they're in viewport
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                video.load();
                videoObserver.unobserve(video);
            }
        });
    }, {
        threshold: 0.1
    });
    
    videos.forEach(video => {
        videoObserver.observe(video);
    });
}

// Handle video errors gracefully
document.querySelectorAll('video').forEach(video => {
    video.addEventListener('error', function() {
        console.log('Video failed to load:', this.src);
        // You could set a placeholder image here if desired
    });
});

// Handle responsive navigation (for future implementation)
function setupMobileNavigation() {
    // This would be implemented when adding a mobile menu
    console.log('Mobile navigation setup would go here');
}

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
        // Handle any scroll-based animations or effects
    }, 100);
});

// Add subtle parallax effect to hero section
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroSection.style.transform = `translateY(${rate}px)`;
    });
}

// Initialize parallax effect
initParallax();