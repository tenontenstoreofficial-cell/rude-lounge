// ===== DOM ELEMENTS =====
const preloader = document.getElementById('preloader');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const galleryTrack = document.getElementById('gallery-track');
const galleryPrev = document.getElementById('gallery-prev');
const galleryNext = document.getElementById('gallery-next');
const reservationForm = document.getElementById('reservation-form');
const heroVideo = document.getElementById('hero-video');

// ===== PRELOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = 'visible';
    }, 2000);
});

// ===== NAVBAR SCROLL EFFECT =====
let lastScrollY = 0;

function handleNavbarScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleNavbarScroll);

// ===== MOBILE NAVIGATION =====
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');

    const spans = navToggle.querySelectorAll('span');
    if (navToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(6px)';
        spans[1].style.transform = 'rotate(-45deg) translateY(-6px)';
        document.body.style.overflow = 'hidden';
    } else {
        spans[0].style.transform = '';
        spans[1].style.transform = '';
        document.body.style.overflow = '';
    }
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.transform = '';
        document.body.style.overflow = '';
    });
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===== GALLERY SLIDER =====
let galleryPosition = 0;
const gallerySlides = document.querySelectorAll('.gallery-slide');
const slideWidth = gallerySlides[0]?.offsetWidth + 30 || 400;
const maxPosition = -(slideWidth * (gallerySlides.length - 3));

function updateGalleryPosition() {
    if (galleryTrack) {
        galleryTrack.style.transform = `translateX(${galleryPosition}px)`;
    }
}

galleryNext?.addEventListener('click', () => {
    if (galleryPosition > maxPosition) {
        galleryPosition -= slideWidth;
        updateGalleryPosition();
    } else {
        galleryPosition = 0;
        updateGalleryPosition();
    }
});

galleryPrev?.addEventListener('click', () => {
    if (galleryPosition < 0) {
        galleryPosition += slideWidth;
        updateGalleryPosition();
    } else {
        galleryPosition = maxPosition;
        updateGalleryPosition();
    }
});

// Auto-slide gallery
let galleryAutoSlide = setInterval(() => {
    if (galleryPosition > maxPosition) {
        galleryPosition -= slideWidth;
    } else {
        galleryPosition = 0;
    }
    updateGalleryPosition();
}, 5000);

// Pause auto-slide on hover
galleryTrack?.addEventListener('mouseenter', () => {
    clearInterval(galleryAutoSlide);
});

galleryTrack?.addEventListener('mouseleave', () => {
    galleryAutoSlide = setInterval(() => {
        if (galleryPosition > maxPosition) {
            galleryPosition -= slideWidth;
        } else {
            galleryPosition = 0;
        }
        updateGalleryPosition();
    }, 5000);
});

// ===== STATS COUNTER ANIMATION =====
function animateCounter(element, target) {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const counter = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===== SCROLL ANIMATIONS =====
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
            animationObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// Add animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .animate-visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .animate-delay-1 { transition-delay: 0.1s; }
    .animate-delay-2 { transition-delay: 0.2s; }
    .animate-delay-3 { transition-delay: 0.3s; }
    .animate-delay-4 { transition-delay: 0.4s; }
`;
document.head.appendChild(animationStyles);

// Apply animation to elements
const animateElements = document.querySelectorAll(
    '.intro-content, .intro-images, .feature-card, .space-item, ' +
    '.dining-content, .dining-visual, .gallery-header, .award-item, ' +
    '.reservation-content, .section-title, .section-label'
);

animateElements.forEach((el, index) => {
    el.classList.add('animate-on-scroll');
    el.classList.add(`animate-delay-${(index % 4) + 1}`);
    animationObserver.observe(el);
});

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    // Hero parallax
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg && scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
    }
});

// ===== WHATSAPP RESERVATION =====
// TODO: Replace with your actual WhatsApp business number (with country code, no + or spaces)
const WHATSAPP_NUMBER = '919876543210'; // e.g., '919876543210' for +91 98765 43210

const whatsappBtn = document.getElementById('whatsapp-btn');
const datetimeInput = document.getElementById('datetime');

// Set minimum date to now (prevent past bookings)
function setMinDateTime() {
    const now = new Date();
    // Format: YYYY-MM-DDTHH:MM
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    if (datetimeInput) {
        datetimeInput.min = minDateTime;
    }
}

// Set min date on page load
setMinDateTime();

whatsappBtn?.addEventListener('click', function () {
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const guests = document.getElementById('guests').value;
    const datetime = document.getElementById('datetime').value;
    const requests = document.getElementById('requests').value.trim();

    // Validate required fields
    if (!name || !email || !phone || !guests || !datetime) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Format date and time for message
    const dateObj = new Date(datetime);
    const formattedDate = dateObj.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = dateObj.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    // Create WhatsApp message
    const message = `🍽️ *New Reservation Request*

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}
*Guests:* ${guests}
*Date:* ${formattedDate}
*Time:* ${formattedTime}
*Special Requests:* ${requests || 'None'}

_Sent from Rude Lounge Website_`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    showNotification('Opening WhatsApp...', 'success');
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 20px 30px;
        background: ${type === 'success' ? '#1a472a' : type === 'error' ? '#4a1a1a' : '#1a1a4a'};
        color: #fff;
        font-size: 0.9rem;
        border-left: 3px solid ${type === 'success' ? '#4ade80' : type === 'error' ? '#f87171' : '#60a5fa'};
        z-index: 10000;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===== CURSOR EFFECT (Desktop Only) =====
if (window.innerWidth > 992) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
    document.body.appendChild(cursor);

    const cursorStyles = document.createElement('style');
    cursorStyles.textContent = `
        .custom-cursor {
            pointer-events: none;
            position: fixed;
            z-index: 9999;
        }
        
        .cursor-dot {
            width: 8px;
            height: 8px;
            background: var(--accent-gold);
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease;
        }
        
        .cursor-ring {
            width: 40px;
            height: 40px;
            border: 1px solid rgba(201, 169, 97, 0.5);
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: transform 0.15s ease, opacity 0.15s ease;
        }
        
        .cursor-hover .cursor-ring {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.5;
        }
        
        .cursor-click .cursor-dot {
            transform: translate(-50%, -50%) scale(0.5);
        }
    `;
    document.head.appendChild(cursorStyles);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add hover effect to interactive elements
    const hoverElements = document.querySelectorAll('a, button, .feature-card, .space-item, .gallery-slide');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });

    document.addEventListener('mousedown', () => cursor.classList.add('cursor-click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('cursor-click'));
}

// ===== VIDEO HANDLING =====
if (heroVideo) {
    // Fallback image if video fails to load
    heroVideo.addEventListener('error', () => {
        const heroBg = document.querySelector('.hero-bg');
        heroBg.style.backgroundImage = 'url(https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)';
        heroBg.style.backgroundSize = 'cover';
        heroBg.style.backgroundPosition = 'center';
        heroVideo.style.display = 'none';
    });

    // Reduce video quality on mobile for performance
    if (window.innerWidth < 768) {
        heroVideo.pause();
        const heroBg = document.querySelector('.hero-bg');
        heroBg.style.backgroundImage = 'url(https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)';
        heroBg.style.backgroundSize = 'cover';
        heroBg.style.backgroundPosition = 'center';
        heroVideo.style.display = 'none';
    }
}

// ===== ACTIVE NAVIGATION HIGHLIGHTING =====
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentSection}`) {
            item.classList.add('active');
        }
    });
}

// Add active nav styles
const activeNavStyles = document.createElement('style');
activeNavStyles.textContent = `
    .nav-links a.active {
        color: var(--accent-gold);
    }
    .nav-links a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(activeNavStyles);

window.addEventListener('scroll', updateActiveNav);

// ===== TYPING EFFECT FOR HERO =====
function typeWriter(element, text, speed = 100, callback) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}

// ===== IMAGE LAZY LOADING =====
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ===== TOUCH GESTURES FOR GALLERY (Mobile) =====
let touchStartX = 0;
let touchEndX = 0;

galleryTrack?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    clearInterval(galleryAutoSlide);
});

galleryTrack?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && galleryPosition > maxPosition) {
            // Swipe left - next
            galleryPosition -= slideWidth;
        } else if (diff < 0 && galleryPosition < 0) {
            // Swipe right - prev
            galleryPosition += slideWidth;
        }
        updateGalleryPosition();
    }
}

// ===== WINDOW RESIZE HANDLER =====
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate gallery slide width
        if (gallerySlides.length > 0) {
            const newSlideWidth = gallerySlides[0].offsetWidth + 30;
            galleryPosition = 0;
            updateGalleryPosition();
        }
    }, 250);
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.transform = '';
        document.body.style.overflow = '';
    }

    // Arrow keys for gallery
    if (e.key === 'ArrowRight') {
        galleryNext?.click();
    } else if (e.key === 'ArrowLeft') {
        galleryPrev?.click();
    }
});

console.log('Rude Lounge - Luxury Website Loaded ✨');
