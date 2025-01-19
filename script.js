document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile menu toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    let menuOpen = false;

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('active');
    }); 
    
    // Close menu when clicking a link
    const navLinksArray = document.querySelectorAll('.nav-links a');
    navLinksArray.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navLinks.contains(event.target) && !menuBtn.contains(event.target)) {
            navLinks.classList.remove('active');
        }
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.event-card').forEach(card => {
        observer.observe(card);
    });

    // Add smooth reveal animations
    const revealElements = document.querySelectorAll('.section-title, .event-card, .ticket-card, .info-item');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
        revealObserver.observe(element);
    });

    // Fix mobile menu behavior
    document.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            document.querySelector('.navbar').style.background = 'rgba(26, 26, 26, 0.95)';
        } else {
            document.querySelector('.navbar').style.background = 'rgba(26, 26, 26, 0.8)';
        }
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Basic form validation
            if (name && email && message) {
                // Here you would typically send this data to your server
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            }
        });
    }

    // Ticket Selection Handling
    document.querySelectorAll('.ticket-btn').forEach(button => {
        button.addEventListener('click', function() {
            const ticketType = this.closest('.ticket-card').querySelector('h3').textContent;
            const ticketPrice = this.closest('.ticket-card').querySelector('.price .amount').textContent;
            
            // You would typically integrate this with a payment gateway
            alert(`Selected ${ticketType} ticket for EGP ${ticketPrice}`);
        });
    });

    // Ensure video plays
    const video = document.getElementById('bgVideo');
    
    // Function to handle video loading
    function handleVideo() {
        video.play().catch(function(error) {
            console.log("Video autoplay failed:", error);
            // Add fallback class if video fails
            video.closest('.hero').classList.add('video-fallback');
        });
    }

    // Handle video loading
    if (video) {
        video.addEventListener('loadeddata', handleVideo);
        
        // Reload video when it ends
        video.addEventListener('ended', function() {
            video.play();
        });

        // Handle visibility changes
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                video.pause();
            } else {
                video.play();
            }
        });

        // Handle video errors
        video.addEventListener('error', function(e) {
            console.error('Error loading video:', e);
            // Fallback to static background if video fails
            video.style.display = 'none';
            video.closest('.hero').style.backgroundImage = "url('party-zone-poster.jpg')";
        });
    }

    // Create Event Form Handling
    const createEventForm = document.getElementById('createEventForm');
    if (createEventForm) {
        createEventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            
            // Here you would typically send this data to your server
            console.log('Event Creation Data:', Object.fromEntries(formData));
            
            // Show success message
            alert('Event created successfully!');
            
            // Reset form
            this.reset();
        });
    }
});
