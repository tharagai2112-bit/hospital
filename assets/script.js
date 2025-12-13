// ===== MOBILE MENU TOGGLE =====
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.getElementById('nav');

function toggleMenu() {
    nav.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
}

function closeMenu() {
    nav.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
}

mobileMenuToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent document click from closing immediately
    toggleMenu();
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        closeMenu();
    }
});

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== SMOOTH SCROLLING FOR NAVIGATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ACTIVE NAVIGATION LINK =====
const sections = document.querySelectorAll('section[id]');

function setActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveLink);

// ===== HERO CAROUSEL =====
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
const indicatorsContainer = document.getElementById('carouselIndicators');

let currentSlide = 0;
const totalSlides = slides.length;
let autoPlayInterval;

// Create indicators
function createIndicators() {
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (i === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    }
}

// Go to specific slide
function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.remove('active');

    currentSlide = (n + totalSlides) % totalSlides;

    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.add('active');
}

// Next slide
function nextSlide() {
    goToSlide(currentSlide + 1);
}

// Previous slide
function prevSlide() {
    goToSlide(currentSlide - 1);
}

// Auto play
function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Event listeners
prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoPlay();
    startAutoPlay();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoPlay();
    startAutoPlay();
});

// Pause on hover
const carouselContainer = document.querySelector('.carousel-container');
carouselContainer.addEventListener('mouseenter', stopAutoPlay);
carouselContainer.addEventListener('mouseleave', startAutoPlay);

// Initialize carousel
createIndicators();
startAutoPlay();

// ===== ANIMATED STATISTICS =====
const statNumbers = document.querySelectorAll('.stat-number');

function animateStats() {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;

        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current);
                setTimeout(updateCount, 20);
            } else {
                stat.textContent = target + (stat.parentElement.querySelector('.stat-label').textContent.includes('%') ? '' : '+');
            }
        };

        updateCount();
    });
}

// Intersection Observer for stats animation
const statsSection = document.querySelector('.about');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            animateStats();
            statsAnimated = true;
        }
    });
}, { threshold: 0.1 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===== TESTIMONIALS CAROUSEL =====
const testimonialsContainer = document.querySelector('.testimonials-container');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');

let currentTestimonial = 0;
let testimonialAutoPlayInterval;

function scrollTestimonials() {
    const cardWidth = testimonialCards[0].offsetWidth;
    const gap = 32; // 2rem gap
    const scrollAmount = (cardWidth + gap) * currentTestimonial;
    testimonialsContainer.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

function nextTestimonial() {
    const cardsPerView = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    const maxScroll = testimonialCards.length - cardsPerView;

    if (currentTestimonial < maxScroll) {
        currentTestimonial++;
    } else {
        currentTestimonial = 0;
    }

    scrollTestimonials();
}

function prevTestimonial() {
    const cardsPerView = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    const maxScroll = testimonialCards.length - cardsPerView;

    if (currentTestimonial > 0) {
        currentTestimonial--;
    } else {
        currentTestimonial = maxScroll;
    }

    scrollTestimonials();
}

function startTestimonialAutoPlay() {
    testimonialAutoPlayInterval = setInterval(nextTestimonial, 4000);
}

function stopTestimonialAutoPlay() {
    clearInterval(testimonialAutoPlayInterval);
}

if (testimonialNext) {
    testimonialNext.addEventListener('click', () => {
        nextTestimonial();
        stopTestimonialAutoPlay();
        startTestimonialAutoPlay();
    });
}

if (testimonialPrev) {
    testimonialPrev.addEventListener('click', () => {
        prevTestimonial();
        stopTestimonialAutoPlay();
        startTestimonialAutoPlay();
    });
}

// Pause testimonial autoplay on hover
const testimonialsCarousel = document.querySelector('.testimonials-carousel');
if (testimonialsCarousel) {
    testimonialsCarousel.addEventListener('mouseenter', stopTestimonialAutoPlay);
    testimonialsCarousel.addEventListener('mouseleave', startTestimonialAutoPlay);
    testimonialsCarousel.addEventListener('touchstart', stopTestimonialAutoPlay, { passive: true });
    testimonialsCarousel.addEventListener('touchend', startTestimonialAutoPlay, { passive: true });
    startTestimonialAutoPlay();
}

// Sync currentTestimonial on manual scroll
if (testimonialsContainer) {
    testimonialsContainer.addEventListener('scroll', () => {
        if (!testimonialCards.length) return;
        const cardWidth = testimonialCards[0].offsetWidth;
        const gap = 32; // 2rem gap
        const index = Math.round(testimonialsContainer.scrollLeft / (cardWidth + gap));

        // Update currentTestimonial if manually scrolled significantly
        // This ensures next auto-scroll happens from the correct position
        currentTestimonial = index;
    }, { passive: true });
}

// Reset testimonial position on resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        currentTestimonial = 0;
        scrollTestimonials();
    }, 250);
});

// ===== SCROLL TO TOP BUTTON =====
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== FORM SUBMISSION =====
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const formData = new FormData(contactForm);

        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        alert('Thank you for your message! We will get back to you soon.');

        // Reset form
        contactForm.reset();
    });
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translate(0, 0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
const animateOnScroll = document.querySelectorAll('.service-card, .feature-card, .testimonial-card');
animateOnScroll.forEach((el, index) => {
    el.style.opacity = '0';

    // Distinct animation for feature cards (slide from right with stagger + scale pop)
    if (el.classList.contains('feature-card')) {
        el.style.transform = 'translateX(50px) scale(0.9)';
        // Calculate index relative to its container to stagger just the group
        const siblingIndex = Array.from(el.parentNode.children).indexOf(el);
        el.style.transition = `opacity 0.6s ease ${siblingIndex * 0.1}s, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${siblingIndex * 0.1}s`;
    } else {
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }

    observer.observe(el);
});

// ===== PREVENT CAROUSEL TOUCH CONFLICTS ON MOBILE =====
let touchStartX = 0;
let touchEndX = 0;

const heroCarousel = document.querySelector('.hero-carousel');

heroCarousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

heroCarousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
    }
    if (touchEndX > touchStartX + 50) {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    }
}

// ===== PERFORMANCE: LAZY LOAD IMAGES =====
// Browser native lazy loading is used.
// No script needed.

// ===== INITIALIZE ON PAGE LOAD =====
window.addEventListener('load', () => {
    // Remove loading class if exists
    document.body.classList.remove('loading');

    // Set initial active link
    setActiveLink();
});

console.log('MediCare+ Website Initialized Successfully! 🏥');
