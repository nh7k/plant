// Form validation and handling for PlantGift website

class FormValidator {
    constructor() {
        this.init();
    }

    init() {
        this.initializeFormHandlers();
        this.setupRealTimeValidation();
        this.initializeCustomValidations();
    }

    initializeFormHandlers() {
        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            this.setupFormHandler(contactForm, this.handleContactForm.bind(this));
        }

        // Bulk order form
        const bulkOrderForm = document.getElementById('bulk-order-form');
        if (bulkOrderForm) {
            this.setupFormHandler(bulkOrderForm, this.handleBulkOrderForm.bind(this));
        }

        // Gift form
        const giftForm = document.getElementById('gift-form');
        if (giftForm) {
            this.setupFormHandler(giftForm, this.handleGiftForm.bind(this));
        }

        // Newsletter signup forms
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        newsletterForms.forEach(form => {
            this.setupFormHandler(form, this.handleNewsletterForm.bind(this));
        });
    }

    setupFormHandler(form, handler) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm(form)) {
                this.showLoadingState(form);
                handler(form);
            }
        });
    }

    setupRealTimeValidation() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            // Clear errors on focus
            input.addEventListener('focus', () => {
                this.clearFieldError(input);
            });

            // Real-time validation for specific field types
            if (input.type === 'email') {
                input.addEventListener('input', PlantGift.debounce(() => {
                    this.validateEmail(input);
                }, 500));
            }

            if (input.type === 'tel') {
                input.addEventListener('input', () => {
                    this.formatPhoneNumber(input);
                });
            }

            if (input.name === 'contactName' || input.name === 'firstName' || input.name === 'lastName') {
                input.addEventListener('input', () => {
                    this.validateNameField(input);
                });
            }
        });
    }

    initializeCustomValidations() {
        // Date validation for delivery dates
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.validateDeliveryDate(input);
            });
            
            // Set minimum date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            input.min = tomorrow.toISOString().split('T')[0];
        });

        // Quantity validation
        const quantitySelects = document.querySelectorAll('select[name="quantity"]');
        quantitySelects.forEach(select => {
            select.addEventListener('change', () => {
                this.validateQuantity(select);
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Custom form-specific validations
        if (form.id === 'bulk-order-form') {
            isValid = this.validateBulkOrderSpecific(form) && isValid;
        }

        if (form.id === 'gift-form') {
            isValid = this.validateGiftFormSpecific(form) && isValid;
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'This field is required';
            isValid = false;
        }
        // Email validation
        else if (field.type === 'email' && value) {
            if (!this.isValidEmail(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        }
        // Phone validation
        else if (field.type === 'tel' && value) {
            if (!this.isValidPhone(value)) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
        }
        // Name validation
        else if ((field.name === 'contactName' || field.name === 'firstName' || field.name === 'lastName') && value) {
            if (!this.isValidName(value)) {
                errorMessage = 'Please enter a valid name (letters only)';
                isValid = false;
            }
        }
        // Minimum length validation
        else if (field.hasAttribute('minlength')) {
            const minLength = parseInt(field.getAttribute('minlength'));
            if (value.length < minLength) {
                errorMessage = `Minimum ${minLength} characters required`;
                isValid = false;
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    validateBulkOrderSpecific(form) {
        let isValid = true;

        // Validate organization field for corporate projects
        const projectType = form.querySelector('select[name="projectType"]').value;
        const organization = form.querySelector('input[name="organization"]').value.trim();

        if (projectType === 'corporate' && !organization) {
            this.showFieldError(
                form.querySelector('input[name="organization"]'),
                'Organization name is required for corporate projects'
            );
            isValid = false;
        }

        // Validate area size for large projects
        const quantity = form.querySelector('select[name="quantity"]').value;
        const areaSize = form.querySelector('input[name="areaSize"]').value;

        if ((quantity === '1000+') && (!areaSize || parseInt(areaSize) < 1000)) {
            this.showFieldError(
                form.querySelector('input[name="areaSize"]'),
                'Area size should be at least 1000 sq ft for 1000+ plants'
            );
            isValid = false;
        }

        return isValid;
    }

    validateGiftFormSpecific(form) {
        let isValid = true;

        // Validate delivery date is not in the past
        const deliveryDate = form.querySelector('input[name="deliveryDate"]');
        if (deliveryDate && deliveryDate.value) {
            const selectedDate = new Date(deliveryDate.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                this.showFieldError(deliveryDate, 'Delivery date cannot be in the past');
                isValid = false;
            }
        }

        return isValid;
    }

    validateEmail(input) {
        const email = input.value.trim();
        if (email && !this.isValidEmail(email)) {
            this.showFieldError(input, 'Please enter a valid email address');
            return false;
        }
        this.clearFieldError(input);
        return true;
    }

    validateDeliveryDate(input) {
        const selectedDate = new Date(input.value);
        const today = new Date();
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3); // 3 months from now

        if (selectedDate < today) {
            this.showFieldError(input, 'Delivery date cannot be in the past');
            return false;
        }

        if (selectedDate > maxDate) {
            this.showFieldError(input, 'Delivery date cannot be more than 3 months from now');
            return false;
        }

        // Check if date is a Sunday (delivery not available)
        if (selectedDate.getDay() === 0) {
            this.showFieldError(input, 'Delivery not available on Sundays');
            return false;
        }

        this.clearFieldError(input);
        return true;
    }

    validateQuantity(select) {
        const quantity = select.value;
        const form = select.closest('form');
        const projectType = form.querySelector('select[name="projectType"]')?.value;

        // Validate quantity based on project type
        if (projectType === 'residential' && quantity === '1000+') {
            this.showFieldError(select, 'Quantity too large for residential projects');
            return false;
        }

        this.clearFieldError(select);
        return true;
    }

    validateNameField(input) {
        const name = input.value.trim();
        if (name && !this.isValidName(name)) {
            this.showFieldError(input, 'Please enter a valid name (letters only)');
            return false;
        }
        this.clearFieldError(input);
        return true;
    }

    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        }
        
        input.value = value;
    }

    // Validation helper methods
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
        return phoneRegex.test(phone);
    }

    isValidName(name) {
        const nameRegex = /^[a-zA-Z\s'-]+$/;
        return nameRegex.test(name) && name.length >= 2;
    }

    // Error display methods
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--color-error);
            font-size: var(--font-size-sm);
            margin-top: var(--space-1);
            display: flex;
            align-items: center;
            gap: var(--space-1);
        `;
        
        // Add error icon
        const icon = document.createElement('i');
        icon.className = 'fas fa-exclamation-circle';
        errorElement.insertBefore(icon, errorElement.firstChild);
        
        field.parentNode.appendChild(errorElement);
        
        // Add error styling to field
        field.style.borderColor = 'var(--color-error)';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    }

    clearFieldError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showLoadingState(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <span class="loading"></span>
                Sending...
            `;
        }
    }

    hideLoadingState(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            // Restore original button text based on form type
            if (form.id === 'contact-form') {
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            } else if (form.id === 'bulk-order-form') {
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Request';
            } else if (form.id === 'gift-form') {
                submitButton.innerHTML = 'Send Gift';
            }
        }
    }

    // Form submission handlers
    async handleContactForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Simulate API call
            await this.simulateAPICall();
            
            this.showSuccessMessage(form, 'Thank you for your message! We\'ll get back to you within 24 hours.');
            form.reset();
            
            // Track form submission
            this.trackFormSubmission('contact', data);
            
        } catch (error) {
            this.showErrorMessage(form, 'Sorry, there was an error sending your message. Please try again.');
        } finally {
            this.hideLoadingState(form);
        }
    }

    async handleBulkOrderForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Simulate API call
            await this.simulateAPICall();
            
            this.showSuccessMessage(form, 'Thank you for your bulk order request! Our team will contact you within 2 business days with a custom quote.');
            form.reset();
            
            // Track form submission
            this.trackFormSubmission('bulk-order', data);
            
        } catch (error) {
            this.showErrorMessage(form, 'Sorry, there was an error submitting your request. Please try again.');
        } finally {
            this.hideLoadingState(form);
        }
    }

    async handleGiftForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Simulate API call
            await this.simulateAPICall();
            
            this.showSuccessMessage(form, 'Gift order confirmed! Your recipient will receive their plant on the selected delivery date.');
            form.reset();
            
            // Close modal if form is in modal
            const modal = form.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
            
            // Track form submission
            this.trackFormSubmission('gift', data);
            
        } catch (error) {
            this.showErrorMessage(form, 'Sorry, there was an error processing your gift order. Please try again.');
        } finally {
            this.hideLoadingState(form);
        }
    }

    async handleNewsletterForm(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        
        if (!this.isValidEmail(email)) {
            this.showErrorMessage(form, 'Please enter a valid email address.');
            this.hideLoadingState(form);
            return;
        }
        
        try {
            // Simulate API call
            await this.simulateAPICall();
            
            this.showSuccessMessage(form, 'Thank you for subscribing! You\'ll receive plant care tips and updates.');
            form.reset();
            
            // Track form submission
            this.trackFormSubmission('newsletter', { email });
            
        } catch (error) {
            this.showErrorMessage(form, 'Sorry, there was an error with your subscription. Please try again.');
        } finally {
            this.hideLoadingState(form);
        }
    }

    simulateAPICall() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 95% success rate
                if (Math.random() > 0.05) {
                    resolve();
                } else {
                    reject(new Error('API Error'));
                }
            }, 1500);
        });
    }

    showSuccessMessage(form, message) {
        if (window.PlantGift && window.PlantGift.showNotification) {
            window.PlantGift.showNotification(message, 'success');
        } else {
            alert(message);
        }
    }

    showErrorMessage(form, message) {
        if (window.PlantGift && window.PlantGift.showNotification) {
            window.PlantGift.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    trackFormSubmission(formType, data) {
        // Analytics tracking would go here
        console.log(`Form submitted: ${formType}`, data);
        
        // Example: Google Analytics event tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                form_type: formType,
                value: 1
            });
        }
    }
}

// Initialize form validation
document.addEventListener('DOMContentLoaded', () => {
    new FormValidator();
});

// Export for use in other scripts
window.FormValidator = FormValidator;
