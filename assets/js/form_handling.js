// Enhanced Form Submission with Web3Forms Integration
function initFormHandler() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const button = this.querySelector('button[type="submit"]');
    const originalHTML = button.innerHTML;
    const formInputs = this.querySelectorAll('.form-input');

    // Validate form before submission
    const validation = validateForm(this);
    if (!validation.isValid) {
      showFormErrors(validation.errors);
      return;
    }

    // Clear any existing errors
    clearFormErrors();

    // Add loading state
    button.classList.add('loading');
    button.innerHTML = '<i data-feather="loader" width="20" height="20"></i> Sending...';
    button.disabled = true;

    // Replace feather icons
    if (typeof feather !== 'undefined') {
      feather.replace();
    }

    // Add spinning animation
    const loader = button.querySelector('[data-feather="loader"]');
    if (loader) {
      loader.style.animation = 'spin 1s linear infinite';
    }

    // Disable form inputs
    formInputs.forEach(input => {
      input.style.opacity = '0.6';
      input.disabled = true;
    });

    // Prepare form data for Web3Forms
    const formData = new FormData(this);

    // Submit to Web3Forms
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Success - show success state
        button.classList.remove('loading');
        button.classList.add('success');
        button.innerHTML = '<i data-feather="check" width="20" height="20"></i> Message Sent!';
        
        if (typeof feather !== 'undefined') {
          feather.replace();
        }

        // Show success animation
        button.style.transform = 'scale(1.05)';

        // Wait a moment then redirect to thank you page
        setTimeout(() => {
          window.location.href = 'thank-you.html';
        }, 1500);

      } else {
        // Error from Web3Forms
        throw new Error(data.message || 'Submission failed');
      }
    })
    .catch(error => {
      console.error('Form submission error:', error);
      
      // Show error state
      button.classList.remove('loading');
      button.classList.add('error');
      button.innerHTML = '<i data-feather="x-circle" width="20" height="20"></i> Failed to Send';
      
      if (typeof feather !== 'undefined') {
        feather.replace();
      }

      // Show error message
      showFormErrors(['Failed to send message. Please try again.']);

      // Reset button after delay
      setTimeout(() => {
        button.classList.remove('error');
        button.innerHTML = originalHTML;
        button.disabled = false;
        button.style.transform = '';

        // Re-enable form inputs
        formInputs.forEach(input => {
          input.style.opacity = '';
          input.disabled = false;
        });

        if (typeof feather !== 'undefined') {
          feather.replace();
        }
      }, 3000);
    });
  });
}

// Clear form errors
function clearFormErrors() {
  const existingErrors = document.querySelectorAll('.form-error');
  existingErrors.forEach(error => error.remove());
}

// Reset form with staggered animation
function resetFormWithAnimation(formInputs) {
  formInputs.forEach((input, index) => {
    setTimeout(() => {
      input.value = '';
      input.style.animation = 'fadeInUp 0.3s ease-out';
      setTimeout(() => {
        input.style.animation = '';
      }, 300);
    }, index * 100);
  });
}

// Form input focus effects
function initFormInputEffects() {
  const formInputs = document.querySelectorAll('.form-input');
  
  formInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.style.transform = 'translateY(-2px)';
    });

    input.addEventListener('blur', function() {
      if (!this.value) {
        this.style.transform = '';
      }
    });

    input.addEventListener('input', function() {
      if (this.value) {
        this.style.borderColor = 'var(--success)';
      } else {
        this.style.borderColor = 'var(--border)';
      }
    });
  });
}

// Form validation helpers
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateForm(form) {
  const name = form.querySelector('input[name="name"]').value.trim();
  const email = form.querySelector('input[name="email"]').value.trim();
  const message = form.querySelector('textarea[name="message"]').value.trim();

  const errors = [];

  if (!name) {
    errors.push('Name is required');
  }

  if (!email) {
    errors.push('Email is required');
  } else if (!validateEmail(email)) {
    errors.push('Please enter a valid email address');
  }

  if (!message) {
    errors.push('Message is required');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

// Show form errors
function showFormErrors(errors) {
  // Remove existing error messages
  clearFormErrors();

  // Add new error messages
  errors.forEach(error => {
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.style.cssText = `
      color: var(--warning);
      font-size: 0.875rem;
      margin-top: 0.5rem;
      animation: fadeInUp 0.3s ease-out;
    `;
    errorElement.textContent = error;

    const form = document.querySelector('.contact-form');
    form.insertBefore(errorElement, form.querySelector('button'));
  });
}
