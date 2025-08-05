// Main Initialization File
// This file coordinates all the modules and initializes the application

// Initialize libraries
function initLibraries() {
  // Initialize Feather Icons
  if (typeof feather !== 'undefined') {
    feather.replace();
  }

  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100
    });
  }
}

// Initialize all functionality
function init() {
  // Initialize external libraries first
  initLibraries();
  
  // Theme and Navigation (from theme-navigation.js)
  loadTheme();
  initSmoothScrolling();
  initMobileNavClicks();
  initEscapeHandler();
  
  // Form Handling (from form-handling.js)
  initFormHandler();
  initFormInputEffects();
  
  // Animations and Effects (from animations-effects.js)
  initParallaxEffect();
  initStatsObserver();
  initSkipLinkHandler();
  initNavLinksHandler();
  initServiceCardEffects();
  initButtonRippleEffect();
  initPageLoadAnimations();
  
  // Add scroll event listener with debouncing (from theme-navigation.js)
  window.addEventListener('scroll', debouncedScrollHandler);
}

// Start everything when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Expose global functions that are called from HTML
window.toggleTheme = toggleTheme;
window.toggleMobileNav = toggleMobileNav;