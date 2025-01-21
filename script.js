// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    initNavigation();
    initScrollEffects();
    initForms();
    initVideoHandling();
    initBookingSystem();
}

function initNavigation() {
    // Mobile menu handling
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => toggleMenu(menuBtn, navLinks));
    }

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!navLinks?.contains(event.target) && !menuBtn?.contains(event.target)) {
            navLinks?.classList.remove('active');
        }
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
}

function toggleMenu(btn, nav) {
    nav.classList.toggle('active');
    const isExpanded = nav.classList.contains('active');
    btn.setAttribute('aria-expanded', isExpanded);
}

function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
}

function initScrollEffects() {
    // Intersection Observer for animations
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        },
        { threshold: 0.1 }
    );

    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.section-title, .event-card, .ticket-card, .info-item'
    );

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });
}

function initForms() {
    // Form validation
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', validateForm);
    });
}

function validateForm(event) {
    event.preventDefault();
    const form = event.target;
    const inputs = form.querySelectorAll('input[required]');
    const errorMessage = document.getElementById('error-message');
    
    // Check required fields
    const isValid = Array.from(inputs).every(input => input.value.trim());
    
    if (!isValid) {
        showError(errorMessage, 'Please fill in all required fields');
        return false;
    }

    // Password validation if present
    const password = form.querySelector('input[type="password"]');
    if (password && password.value.length < 6) {
        showError(errorMessage, 'Password must be at least 6 characters');
        return false;
    }

    // Submit form if validation passes
    form.submit();
    return true;
}

function showError(element, message, duration = 3000) {
    if (!element) return;
    
    element.textContent = message;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, duration);
}

function initVideoHandling() {
    const video = document.getElementById('bgVideo');
    if (!video) return;

    const handleVideoPlay = () => {
        video.play().catch(error => {
            console.warn('Video autoplay failed:', error);
            video.closest('.hero')?.classList.add('video-fallback');
        });
    };

    video.addEventListener('loadeddata', handleVideoPlay);
    video.addEventListener('ended', () => video.play());
    
    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
        document.hidden ? video.pause() : video.play();
    });
}

function initBookingSystem() {
    document.querySelectorAll('.book-btn').forEach(button => {
        button.addEventListener('click', handleBooking);
    });
}

async function handleBooking(e) {
    e.preventDefault();
    const button = e.currentTarget;
    const eventInfo = getEventInfo(button);
    
    if (await confirmBooking(eventInfo)) {
        await processBooking(button);
    }
}

function getEventInfo(button) {
    const eventCard = button.closest('.event-card');
    return {
        title: eventCard.querySelector('.event-info h3')?.textContent,
        date: eventCard.querySelector('.event-date')?.textContent
    };
}

function confirmBooking(eventInfo) {
    return new Promise(resolve => {
        resolve(confirm(`Confirm booking for:\n${eventInfo.title}\n${eventInfo.date}`));
    });
}

async function processBooking(button) {
    const originalText = button.innerHTML;
    
    try {
        button.innerHTML = '<span>Processing...</span> <i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        alert('Booking successful! Check your email for confirmation.');
    } catch (error) {
        alert('Booking failed. Please try again.');
        console.error('Booking error:', error);
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

// Forgot Password Functions
function showForgotPassword(event) {
    event.preventDefault();
    const modal = document.getElementById('forgotPasswordModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

async function handleResetPassword(event) {
    event.preventDefault();
    const email = document.getElementById('resetEmail').value;
    const errorMessage = document.getElementById('error-message');
    
    try {
        // Show loading state
        const submitBtn = event.target.querySelector('button');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        // Simulate API call - Replace with your actual API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        alert('Password reset link has been sent to your email');
        closeForgotPassword();
        
    } catch (error) {
        showError(errorMessage, 'Failed to send reset link. Please try again.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('forgotPasswordModal');
    if (event.target === modal) {
        closeForgotPassword();
    }
}
