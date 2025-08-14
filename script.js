// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    try {
        setupFormValidation();
        setupDateTimeHandlers();
        setupLocationInputs();
        setupButtonHandlers();
        setupMobileNavigation();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Form Validation Setup
function setupFormValidation() {
    const seePricesBtn = document.querySelector('.see-prices-btn');
    const pickupInput = document.querySelector('.location-input:first-of-type');
    const dropoffInput = document.querySelector('.location-input:last-of-type');
    const dateInput = document.querySelector('.date-input');
    
    if (seePricesBtn) {
        seePricesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            validateAndSubmitForm();
        });
    }
}

// Validate form inputs
function validateAndSubmitForm() {
    try {
        const pickupInput = document.querySelector('.location-input:first-of-type');
        const dropoffInput = document.querySelector('.location-input:last-of-type');
        const dateInput = document.querySelector('.date-input');
        
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous error styles
        clearErrorStyles();
        
        // Validate pickup location
        if (!pickupInput.value.trim()) {
            showInputError(pickupInput, 'Please enter a pickup location');
            isValid = false;
        }
        
        // Validate dropoff location
        if (!dropoffInput.value.trim()) {
            showInputError(dropoffInput, 'Please enter a dropoff location');
            isValid = false;
        }
        
        // Validate date (optional, defaults to today)
        if (dateInput.value) {
            const selectedDate = new Date(dateInput.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showInputError(dateInput, 'Please select a future date');
                isValid = false;
            }
        }
        
        if (isValid) {
            // Simulate form submission
            showSuccessMessage();
        }
        
    } catch (error) {
        console.error('Error validating form:', error);
        showErrorMessage('An error occurred. Please try again.');
    }
}

// Show input error
function showInputError(input, message) {
    input.style.borderColor = '#ff4444';
    input.style.backgroundColor = '#fff5f5';
    
    // Create or update error message
    let errorElement = input.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#ff4444';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '4px';
        input.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

// Clear error styles
function clearErrorStyles() {
    const inputs = document.querySelectorAll('.location-input, .date-input');
    inputs.forEach(input => {
        input.style.borderColor = '#e0e0e0';
        input.style.backgroundColor = input.classList.contains('location-input') ? '#f6f6f6' : '#fff';
        
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    });
}

// Show success message
function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 16px 24px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 1001;
        font-size: 14px;
        font-weight: 500;
    `;
    message.textContent = 'Searching for rides...';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Show error message
function showErrorMessage(text) {
    const message = document.createElement('div');
    message.className = 'error-message-global';
    message.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #ff4444;
        color: white;
        padding: 16px 24px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 1001;
        font-size: 14px;
        font-weight: 500;
    `;
    message.textContent = text;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Setup Date and Time Handlers
function setupDateTimeHandlers() {
    const dateInput = document.querySelector('.date-input');
    const timeInput = document.querySelector('.time-input');
    
    // Set default date to today
    if (dateInput) {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        dateInput.value = formattedDate;
        
        dateInput.addEventListener('change', function() {
            validateDateSelection(this);
        });
    }
    
    // Handle time selection
    if (timeInput) {
        timeInput.addEventListener('change', function() {
            if (this.value === 'Schedule for later') {
                // Could expand this to show time picker
                console.log('Schedule for later selected');
            }
        });
    }
}

// Validate date selection
function validateDateSelection(dateInput) {
    try {
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showInputError(dateInput, 'Please select today or a future date');
            // Reset to today
            const formattedDate = today.toISOString().split('T')[0];
            dateInput.value = formattedDate;
        } else {
            // Clear any existing errors
            const errorElement = dateInput.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
            dateInput.style.borderColor = '#e0e0e0';
        }
    } catch (error) {
        console.error('Error validating date:', error);
    }
}

// Setup Location Input Handlers
function setupLocationInputs() {
    const locationInputs = document.querySelectorAll('.location-input');
    
    locationInputs.forEach(input => {
        // Add focus and blur handlers for better UX
        input.addEventListener('focus', function() {
            this.style.borderColor = '#000';
            this.style.backgroundColor = '#fff';
        });
        
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = '#e0e0e0';
                this.style.backgroundColor = '#f6f6f6';
            }
        });
        
        // Add input handler for real-time validation
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                // Clear any existing errors
                const errorElement = this.parentNode.querySelector('.error-message');
                if (errorElement) {
                    errorElement.remove();
                }
                this.style.borderColor = '#000';
                this.style.backgroundColor = '#fff';
            }
        });
    });
}

// Setup Button Handlers
function setupButtonHandlers() {
    // Handle all primary buttons
    const primaryBtns = document.querySelectorAll('.primary-btn');
    primaryBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Don't prevent default for the main "See prices" button
            if (!this.classList.contains('see-prices-btn')) {
                e.preventDefault();
                handleButtonClick(this);
            }
        });
    });
    
    // Handle secondary links
    const secondaryLinks = document.querySelectorAll('.secondary-link');
    secondaryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            handleLinkClick(this);
        });
    });
    
    // Handle change city button
    const changeCityBtn = document.querySelector('.change-city-btn');
    if (changeCityBtn) {
        changeCityBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleChangeCityClick();
        });
    }
}

// Handle button clicks
function handleButtonClick(button) {
    const buttonText = button.textContent.trim();
    
    try {
        switch (buttonText) {
            case 'Get started':
                showInfoMessage('Redirecting to driver signup...');
                break;
            case 'Log in to your account':
                showInfoMessage('Redirecting to login...');
                break;
            case 'Learn more':
                showInfoMessage('Opening safety information...');
                break;
            default:
                showInfoMessage(`${buttonText} clicked`);
        }
    } catch (error) {
        console.error('Error handling button click:', error);
    }
}

// Handle link clicks
function handleLinkClick(link) {
    const linkText = link.textContent.trim();
    showInfoMessage(`${linkText} clicked`);
}

// Handle change city click
function handleChangeCityClick() {
    const locationText = document.querySelector('.location-text');
    if (locationText) {
        const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
        const currentCity = locationText.textContent.replace("You're exploring ", "");
        let newCity = cities[Math.floor(Math.random() * cities.length)];
        
        // Make sure we don't select the same city
        while (newCity === currentCity) {
            newCity = cities[Math.floor(Math.random() * cities.length)];
        }
        
        locationText.textContent = `You're exploring ${newCity}`;
        showInfoMessage(`Location changed to ${newCity}`);
    }
}

// Show info message
function showInfoMessage(text) {
    const message = document.createElement('div');
    message.className = 'info-message';
    message.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #2196F3;
        color: white;
        padding: 16px 24px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 1001;
        font-size: 14px;
        font-weight: 500;
    `;
    message.textContent = text;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Setup Mobile Navigation (for future enhancement)
function setupMobileNavigation() {
    // This could be expanded for mobile menu toggle functionality
    const nav = document.querySelector('.nav');
    
    // Add touch-friendly interactions for mobile
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
}

// Smooth scrolling for anchor links (if any are added)
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize smooth scrolling
document.addEventListener('DOMContentLoaded', setupSmoothScrolling);

// Handle window resize for responsive adjustments
window.addEventListener('resize', function() {
    // Could add responsive JavaScript adjustments here if needed
    console.log('Window resized to:', window.innerWidth, 'x', window.innerHeight);
});

// Error boundary for unhandled errors
window.addEventListener('error', function(e) {
    console.error('Unhandled error:', e.error);
    // Could show user-friendly error message here
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});
