// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations and effects
    initScrollAnimations();
    initHoverEffects();
    initSmoothScrolling();
    initAccordion();
    initDarkModeToggle();
    initScrollProgress();
    handleResourcesNavigation();
});

// Initialize scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-title, .feature-card, .blog-card, .accordion-item');
    
    // Create Intersection Observer to detect when elements enter viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing after animation triggers
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe all animated elements
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize hover effects
function initHoverEffects() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.feature-card, .blog-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn, .discord-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-5px)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
    
    // Add hover effects to navigation items
    const navItems = document.querySelectorAll('nav ul li a');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.color = 'var(--primary)';
        });
        
        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('active')) {
                item.style.color = '';
            }
        });
    });
}

// Initialize smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate the position to scroll to, accounting for the fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Initialize accordion functionality
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle active class
            content.classList.toggle('active');
            
            // Change icon
            if (content.classList.contains('active')) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            } else {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            }
        });
    });
}

// Initialize dark mode toggle
function initDarkModeToggle() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (!darkModeToggle) return;
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        const icon = this.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            
            // Save preference to localStorage
            localStorage.setItem('darkMode', 'enabled');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            
            // Save preference to localStorage
            localStorage.setItem('darkMode', 'disabled');
        }
    });
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        const icon = darkModeToggle.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// Initialize scroll progress indicator
function initScrollProgress() {
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
        
        // Header scroll effect
        const header = document.getElementById('header');
        if (header) {
            if (winScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
}

// Handle resources navigation
function handleResourcesNavigation() {
    // Check if URL has hash for resources section on page load
    if (window.location.hash === '#resources-section') {
        setTimeout(() => {
            scrollToResources();
        }, 300);
    }
    
    // Listen for hash changes
    window.addEventListener('hashchange', function() {
        if (window.location.hash === '#resources-section') {
            setTimeout(() => {
                scrollToResources();
            }, 100);
        }
    });
}

// Specific function to scroll to resources section
function scrollToResources() {
    const resourcesSection = document.getElementById('resources-section');
    if (resourcesSection) {
        const headerOffset = 80;
        const elementPosition = resourcesSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Add this to your existing JavaScript code
document.addEventListener('DOMContentLoaded', function() {
    // Track read more clicks (optional)
    const readMoreLinks = document.querySelectorAll('.read-more');
    
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // You can add analytics tracking here if needed
            console.log('Read More clicked:', this.href);
            
            // The link will naturally redirect due to the href attribute
            // No need to prevent default or manually redirect
        });
    });
});
// Add this debug function to identify the problem
function debugResourcesNavigation() {
    console.log("Debugging Resources Navigation...");
    
    // Check if resources section exists
    const resourcesSection = document.getElementById('resources-section');
    console.log("Resources section found:", resourcesSection);
    
    // Check all navigation links
    const navLinks = document.querySelectorAll('nav a[href="#resources-section"]');
    console.log("Resources nav links found:", navLinks.length);
    
    // Add click event listeners to debug
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log("Resources link clicked");
            console.log("Hash:", window.location.hash);
            
            // Manually trigger the scroll after a short delay
            setTimeout(() => {
                scrollToResources();
            }, 300);
        });
    });
    
    // Check if URL already points to resources
    if (window.location.hash === '#resources-section') {
        console.log("URL already points to resources section");
        setTimeout(() => {
            scrollToResources();
        }, 500);
    }
}

// Enhanced scroll function with more debugging
function scrollToResources() {
    console.log("Attempting to scroll to resources section");
    
    const resourcesSection = document.getElementById('resources-section');
    if (resourcesSection) {
        console.log("Resources section found, scrolling...");
        const headerOffset = 80;
        const elementPosition = resourcesSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        console.log("Scroll completed");
    } else {
        console.error("Resources section not found!");
    }
}

// Update your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations and effects
    initScrollAnimations();
    initHoverEffects();
    initSmoothScrolling();
    initAccordion();
    initDarkModeToggle();
    initScrollProgress();
    
    // Add debug function
    debugResourcesNavigation();
    
    // Also handle direct navigation to resources
    if (window.location.hash === '#resources-section') {
        setTimeout(() => {
            scrollToResources();
        }, 300);
    }
});

// Modify your existing smooth scrolling function to handle resources specifically
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // For resources links, use our custom function
            if (this.getAttribute('href') === '#resources-section') {
                e.preventDefault();
                scrollToResources();
                // Update URL
                history.pushState(null, null, '#resources-section');
                return;
            }
            
            // For other links, use the original code
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                history.pushState(null, null, targetId);
            }
        });
    });
}
// Force title visibility
function forceTitleVisibility() {
    const resourcesSection = document.getElementById('resources-section');
    if (!resourcesSection) return;
    
    // Create header if it doesn't exist
    let header = resourcesSection.querySelector('.wellness-header');
    if (!header) {
        header = document.createElement('div');
        header.className = 'wellness-header';
        
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = 'The Wellness Toolkit';
        
        // REMOVED: Subtitle creation
        // const subtitle = document.createElement('p');
        // subtitle.className = 'section-subtitle';
        // subtitle.textContent = 'Curated resources for your mental wellbeing journey';
        // header.appendChild(subtitle);
        
        header.appendChild(title);
        
        const container = resourcesSection.querySelector('.container');
        if (container) {
            container.insertBefore(header, container.firstChild);
        }
    }
    
    // Force visibility
    header.style.display = 'block';
    header.style.visibility = 'visible';
    header.style.opacity = '1';
    
    const title = header.querySelector('.section-title');
    if (title) {
        title.style.display = 'block';
        title.style.visibility = 'visible';
        title.style.opacity = '1';
        title.style.color = '#ffffff';
    }
    
    // REMOVED: Subtitle visibility forcing
    // const subtitle = header.querySelector('.section-subtitle');
    // if (subtitle) {
    //     subtitle.style.display = 'block';
    //     subtitle.style.visibility = 'visible';
    //     subtitle.style.opacity = '1';
    // }
}

// Run on load and periodically to ensure visibility
document.addEventListener('DOMContentLoaded', function() {
    forceTitleVisibility();
    setTimeout(forceTitleVisibility, 100);
    setInterval(forceTitleVisibility, 1000);
});