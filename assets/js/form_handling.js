// Simple Web3Forms Integration - No interference approach
function initFormHandler() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    // Only prevent default for validation - if valid, let form submit naturally
    const validation = validateForm(this);
    if (!validation.isValid) {
      e.preventDefault();
      showFormErrors(validation.errors);
      return;
    }

    // Clear any existing errors
    clearFormErrors();
    
    // Add simple loading state
    const button = this.querySelector('button[type="submit"]');
    button.innerHTML = '<i data-feather="loader" width="20" height="20"></i> Sending...';
    button.disabled = true;
    
    if (typeof feather !== 'undefined') {
      feather.replace();
    }

    // Let the form submit naturally to Web3Forms
    // Web3Forms will handle the redirect automatically
  });
}

// Clear form errors
function clearFormErrors() {
  const existingErrors = document.querySelectorAll('.form-error');
  existingErrors.forEach(error => error.remove());
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
  clearFormErrors();

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
