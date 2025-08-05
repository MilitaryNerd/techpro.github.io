// Theme Management
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  const themeIcon = document.querySelector('.theme-icon');
  const themeText = document.querySelector('.theme-text');

  document.documentElement.setAttribute('data-theme', newTheme);

  // Animate icon change
  themeIcon.style.transform = 'rotate(180deg) scale(0)';

  setTimeout(() => {
    if (newTheme === 'dark') {
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Light';
    } else {
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Dark';
    }
    themeIcon.style.transform = 'rotate(0deg) scale(1)';
  }, 150);

  // Save preference
  try {
    localStorage.setItem('theme', newTheme);
  } catch(e) {
    // localStorage not available
  }
}

// Load saved theme
function loadTheme() {
  try {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeIcon = document.querySelector('.theme-icon');
    const themeText = document.querySelector('.theme-text');

    if (savedTheme === 'dark') {
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Light';
    } else {
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Dark';
    }
  } catch(e) {
    // localStorage not available, use default
  }
}

// Enhanced Navigation Scroll Effects
let lastScrollY = window.scrollY;
let ticking = false;

function updateNavigation() {
  const navContainer = document.querySelector('.nav-container');
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    navContainer.classList.add('hidden');
  } else {
    navContainer.classList.remove('hidden');
  }

  // Add glass effect based on scroll
  if (currentScrollY > 50) {
    navContainer.style.background = 'rgba(255, 255, 255, 0.2)';
    navContainer.style.backdropFilter = 'blur(30px)';
  } else {
    navContainer.style.background = 'var(--glass)';
    navContainer.style.backdropFilter = 'blur(20px)';
  }

  lastScrollY = currentScrollY;
  ticking = false;
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Add pulse effect to target section
        target.style.animation = 'pulse 1s ease-in-out';
        setTimeout(() => {
          target.style.animation = '';
        }, 1000);
      }
    });
  });
}

// Toggle for Mobile App Drawer
function toggleMobileNav() {
  const drawer = document.getElementById('mobileDrawer');
  const isOpen = drawer.classList.toggle('open');
  const hamburger = document.querySelector('.hamburger');

  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

  if (isOpen) trapFocus(drawer);
}

// Trap Focus Helper
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  // Automatically focus the first focusable element
  if (first) first.focus();

  function handleTab(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  container.addEventListener('keydown', handleTab);

  // Clean up on close
  const observer = new MutationObserver(() => {
    if (!container.classList.contains('open')) {
      container.removeEventListener('keydown', handleTab);
      observer.disconnect();
    }
  });

  observer.observe(container, { attributes: true, attributeFilter: ['class'] });
}

// Auto-Close Mobile App Drawer On-Click
function initMobileNavClicks() {
  document.querySelectorAll('#mobileDrawer nav a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mobileDrawer').classList.remove('open');
      document.querySelector('.hamburger').setAttribute('aria-expanded', 'false');
    });
  });
}

// Close Mobile App Drawer on Escape
function initEscapeHandler() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const drawer = document.getElementById('mobileDrawer');
      const hamburger = document.querySelector('.hamburger');
      if (drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus(); // optional: return focus to toggle
      }
    }
  });
}

// Performance optimization: debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Scroll event handler with debouncing
const debouncedScrollHandler = debounce(() => {
  if (!ticking) {
    requestAnimationFrame(updateNavigation);
    ticking = true;
  }
}, 10);