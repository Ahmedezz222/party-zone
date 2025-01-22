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
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (!menuBtn || !navLinks) {
        console.warn('Navigation elements not found');
        return;
    }

    menuBtn.addEventListener('click', () => toggleMenu(menuBtn, navLinks));

    // Improved outside click handling
    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!navLinks.contains(target) && !menuBtn.contains(target)) {
            closeMenu(menuBtn, navLinks);
        }
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
}

function toggleMenu(btn, nav) {
    if (!btn || !nav) return;
    
    const isExpanded = nav.classList.toggle('active');
    btn.setAttribute('aria-expanded', String(isExpanded));
    btn.setAttribute('aria-label', isExpanded ? 'Close menu' : 'Open menu');
}

function closeMenu(btn, nav) {
    if (!btn || !nav) return;
    
    nav.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
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
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    const errorMessage = document.getElementById('error-message');
    
    // Reset previous errors
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    
    let hasErrors = false;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            hasErrors = true;
            input.classList.add('error');
            input.setAttribute('aria-invalid', 'true');
        } else {
            input.setAttribute('aria-invalid', 'false');
        }
    });
    
    if (hasErrors) {
        showError(errorMessage, 'Please fill in all required fields');
        return false;
    }

    // Enhanced email validation
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && !isValidEmail(emailInput.value)) {
        showError(errorMessage, 'Please enter a valid email address');
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

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
        button.addEventListener('click', showPaymentModal);
    });

    // Initialize payment modal events
    const modal = document.getElementById('paymentModal');
    const closeBtn = modal.querySelector('.close-modal');
    const confirmBtn = document.getElementById('confirmPayment');
    const paymentMethods = modal.querySelectorAll('.payment-method');

    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    confirmBtn.addEventListener('click', handlePaymentConfirmation);
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', selectPaymentMethod);
    });

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
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
    if (!button) return;
    
    const loadingState = {
        text: button.innerHTML,
        disabled: button.disabled
    };
    
    try {
        setButtonLoading(button, 'Processing...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        showSuccessMessage('Booking successful! Check your email for confirmation.');
    } catch (error) {
        console.error('Booking error:', error);
        showErrorMessage('Booking failed. Please try again.');
    } finally {
        restoreButtonState(button, loadingState);
    }
}

function setButtonLoading(button, text) {
    button.innerHTML = `<span>${text}</span> <i class="fas fa-spinner fa-spin"></i>`;
    button.disabled = true;
}

function restoreButtonState(button, state) {
    button.innerHTML = state.text;
    button.disabled = state.disabled;
}

function showSuccessMessage(message) {
    alert(message); // Consider replacing with a more modern notification system
}

function showErrorMessage(message) {
    alert(message); // Consider replacing with a more modern notification system
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

function showPaymentModal(e) {
    e.preventDefault();
    const button = e.currentTarget;
    const ticketType = button.closest('.ticket-type');
    const eventDetails = document.querySelector('.event-info-detailed');
    const modal = document.getElementById('paymentModal');
    
    // Get ticket and event information
    const ticketTitle = ticketType.querySelector('h3').textContent;
    const priceText = ticketType.querySelector('.price').textContent;
    const price = parseFloat(priceText.replace('EGP', '').trim());
    
    // Calculate fees
    const serviceFee = price * 0.05;
    const vat = price * 0.14;
    const total = price + serviceFee + vat;
    
    // Update event details
    modal.querySelector('.event-date').textContent = eventDetails.querySelector('.fa-calendar').parentNode.textContent.trim();
    modal.querySelector('.event-time').textContent = eventDetails.querySelector('.fa-clock').parentNode.textContent.trim();
    modal.querySelector('.event-location').textContent = eventDetails.querySelector('.fa-map-marker-alt').parentNode.textContent.trim();
    
    // Update price breakdown
    modal.querySelector('.ticket-info').textContent = `Ticket Type: ${ticketTitle}`;
    modal.querySelector('.subtotal').textContent = `${price.toFixed(2)} EGP`;
    modal.querySelector('.service-fee').textContent = `${serviceFee.toFixed(2)} EGP`;
    modal.querySelector('.vat-amount').textContent = `${vat.toFixed(2)} EGP`;
    modal.querySelector('.total-amount').textContent = `${total.toFixed(2)} EGP`;
    
    // Show modal and reset form
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    const form = modal.querySelector('#paymentForm');
    form.reset();
    document.querySelectorAll('.payment-method').forEach(btn => btn.classList.remove('selected'));
}

function selectPaymentMethod(e) {
    const buttons = document.querySelectorAll('.payment-method');
    buttons.forEach(btn => btn.classList.remove('selected'));
    e.currentTarget.classList.add('selected');
    
    // Toggle credit card fields
    const creditCardFields = document.getElementById('creditCardFields');
    creditCardFields.style.display = 
        e.currentTarget.dataset.method === 'credit-card' ? 'block' : 'none';
}

// Add form validation and handling
document.getElementById('paymentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!document.querySelector('.payment-method.selected')) {
        alert('Please select a payment method');
        return;
    }
    
    const confirmBtn = document.getElementById('confirmPayment');
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        showSuccessMessage('Payment successful! Check your email for confirmation.');
        document.getElementById('paymentModal').style.display = 'none';
    } catch (error) {
        showErrorMessage('Payment failed. Please try again.');
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = 'Confirm Payment';
    }
});
