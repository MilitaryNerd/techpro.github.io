// Parallax effect for floating elements
function initParallaxEffect() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-element');

    parallaxElements.forEach((element, index) => {
      const speed = 0.5 + (index * 0.1);
      element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
  });
}

// Add intersection observer for stats animation
function initStatsObserver() {
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll('.stat-item h3');
        statNumbers.forEach((stat, index) => {
          setTimeout(() => {
            stat.style.animation = 'countUp 1s ease-out forwards';
          }, index * 200);
        });
      }
    });
  }, observerOptions);

  // Observe stats section
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }
}

// Apply Shimmer
function applyShimmer(heading) {
  heading.classList.add('skip-highlight');

  // Automatically remove the class after the animation completes
  setTimeout(() => {
    heading.classList.remove('skip-highlight');
  }, 1600); // 1.5s animation duration + buffer
}

// Skip Link Handler
function initSkipLinkHandler() {
  document.querySelector('.skip-link')?.addEventListener('click', function () {
    const mainEl = document.getElementById('main-content');
    if (!mainEl) return;

    mainEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const highlightHeading = mainEl.querySelector('.section-title');
    if (highlightHeading) applyShimmer(highlightHeading);
  });
}

// Nav Links Handler
function initNavLinksHandler() {
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const section = document.querySelector(targetId);

      if (!section) return;
      e.preventDefault();

      section.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const heading = section.querySelector('.section-title');
      if (heading) applyShimmer(heading);
    });
  });
}

// Add hover effects for service cards
function initServiceCardEffects() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// Enhanced button ripple effect
function initButtonRippleEffect() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Initialize all animations after page load
function initPageLoadAnimations() {
  window.addEventListener('load', () => {
    // Trigger initial animations
    document.body.style.opacity = '1';

    // Add staggered animations to service cards
    document.querySelectorAll('.service-card').forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });
  });
}