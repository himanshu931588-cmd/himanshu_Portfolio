/**
 * Main Application Script for Himanshu Mishra (@himanshu931588-cmd)
 * 2nd Year Engineering Student • Cloud Architect & AI Specialist
 * Handles Interactive Preloader, Unique Brand Logo FX, Theme, Collaboration Hub, Filters, and Form.
 */

document.addEventListener('DOMContentLoaded', () => {
  initInteractiveLoader();
  initCustomCursor();
  initTheme();
  initSoundFX();
  initNavigation();
  initCollabHub();
  initProjectFilters();
  initStatsCounter();
  initGitHubLiveSync();
  initLightboxModals();
  initBackToTop();
  initContactForm();
  setCurrentYear();
});

/* ==========================================================================
   0. Interactive Starting Loading Page (Preloader)
   ========================================================================== */
function initInteractiveLoader() {
  const loader = document.getElementById('interactive-loader');
  const coreTrigger = document.getElementById('loader-core-trigger');
  const skipBtn = document.getElementById('loader-skip-btn');
  const progressBar = document.getElementById('loader-progress-bar');
  const percentText = document.getElementById('loader-percent');
  const logText = document.getElementById('loader-log');

  if (!loader || !progressBar || !percentText) return;

  const bootLogs = [
    '> [01/05] Initializing Himanshu Mishra Neural Environment...',
    '> [02/05] 2nd Year Engineering Student Core Online...',
    '> [03/05] Mounting Vero AI Forensics & BaseGuard Defense...',
    '> [04/05] Syncing KrishiAlert Satellite Telemetry...',
    '> [05/05] Ready! Systems 100% Operational. Welcome.'
  ];

  let currentPercent = 0;
  let isFinished = false;
  let intervalSpeed = 22; // ms per progress tick

  function updateLoader() {
    if (isFinished) return;

    if (currentPercent < 100) {
      const increment = Math.max(1, Math.floor(Math.random() * 3) + 1);
      currentPercent = Math.min(100, currentPercent + increment);

      progressBar.style.width = `${currentPercent}%`;
      percentText.textContent = `${currentPercent}%`;

      if (currentPercent < 25) {
        logText.textContent = bootLogs[0];
      } else if (currentPercent < 50) {
        logText.textContent = bootLogs[1];
      } else if (currentPercent < 75) {
        logText.textContent = bootLogs[2];
      } else if (currentPercent < 95) {
        logText.textContent = bootLogs[3];
      } else {
        logText.textContent = bootLogs[4];
      }

      setTimeout(updateLoader, intervalSpeed);
    } else {
      finishLoading();
    }
  }

  function finishLoading() {
    if (isFinished) return;
    isFinished = true;
    currentPercent = 100;
    progressBar.style.width = '100%';
    percentText.textContent = '100%';
    logText.textContent = '> [READY] Launching Portfolio...';

    setTimeout(() => {
      loader.classList.add('loader-hidden');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 700);
    }, 350);
  }

  // Interactive core click fast-forwards/launches
  if (coreTrigger) {
    coreTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      intervalSpeed = 4;
      currentPercent = Math.max(currentPercent, 88);
      coreTrigger.style.transform = 'scale(1.15)';
      setTimeout(() => {
        coreTrigger.style.transform = '';
        finishLoading();
      }, 140);
    });
  }

  // Skip button click
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      finishLoading();
    });
  }

  // Tap anywhere on loader to speed up / finish (great for mobile)
  loader.addEventListener('click', () => {
    if (!isFinished) {
      finishLoading();
    }
  });

  // Spacebar or Enter to skip/launch
  window.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'Enter') && !isFinished) {
      e.preventDefault();
      finishLoading();
    }
  });

  // Mobile failsafe: auto-dismiss preloader within 2.2s so no device gets stuck
  setTimeout(() => {
    if (!isFinished) {
      finishLoading();
    }
  }, 2200);

  // Start progress
  setTimeout(updateLoader, 100);
}

/* ==========================================================================
   1. Theme Management (Dark / Light with LocalStorage)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  if (!toggleBtn || !themeIcon) return;

  const savedTheme = localStorage.getItem('himanshu_theme') || 'dark';
  applyTheme(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('himanshu_theme', newTheme);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
      themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
  }
}

/* ==========================================================================
   1.1 Audio FX Feedback (Web Audio API Synthesizer - Optional, Crisp UI Clicks)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = localStorage.getItem('himanshu_sound') === 'true';

function playSound(type = 'click') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'chime') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    }
  } catch (err) {
    // AudioContext blocked or not supported
  }
}

function initSoundFX() {
  const soundBtn = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  if (!soundBtn || !soundIcon) return;

  function updateSoundUI() {
    if (soundEnabled) {
      soundIcon.className = 'fa-solid fa-volume-high';
      soundBtn.title = 'Sound FX: ON (Click to Mute)';
      soundBtn.setAttribute('aria-label', 'Sound FX enabled, click to mute');
    } else {
      soundIcon.className = 'fa-solid fa-volume-xmark';
      soundBtn.title = 'Sound FX: OFF (Click to Enable)';
      soundBtn.setAttribute('aria-label', 'Sound FX muted, click to enable');
    }
  }

  updateSoundUI();

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('himanshu_sound', soundEnabled);
    updateSoundUI();
    if (soundEnabled) {
      playSound('chime');
      showToast('Sound FX Enabled (Crisp Tactile Clicks)', 'info', 2500);
    } else {
      showToast('Sound FX Muted', 'info', 2000);
    }
  });

  // Attach tactile sound to interactive elements
  document.addEventListener('click', (e) => {
    if (!soundEnabled) return;
    const target = e.target.closest('button, .btn, .filter-chip, .collab-card, .nav-link, .interactive-logo');
    if (target && target !== soundBtn) {
      playSound('click');
    }
  });
}

/* ==========================================================================
   2. Navigation, Sticky Header & Mobile Drawer
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navBackdrop = document.getElementById('nav-backdrop');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-drawer-cta a');

  // Sticky Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveNavLink();
  }, { passive: true });

  function openMenu() {
    if (!navMenu || !mobileToggle) return;
    navMenu.classList.add('open');
    mobileToggle.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.classList.add('nav-open');
  }

  function closeMenu() {
    if (!navMenu || !mobileToggle) return;
    navMenu.classList.remove('open');
    mobileToggle.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.classList.remove('nav-open');
  }

  // Mobile Menu Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMenu);
    }

    // Close on escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close when window resized to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close mobile menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Active Link Spy using scroll position
  const sections = document.querySelectorAll('section[id]');
  function highlightActiveNavLink() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  }
}

/* ==========================================================================
   3. Collaboration Hub Interactions
   ========================================================================== */
function initCollabHub() {
  const collabBtns = document.querySelectorAll('.collab-action-btn');
  const directPitchBtn = document.getElementById('direct-pitch-btn');
  const subjectInput = document.getElementById('subject');
  const messageArea = document.getElementById('message');

  collabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const collabType = btn.getAttribute('data-collab-type') || 'Student Project Collaboration';
      
      if (subjectInput) {
        subjectInput.value = `Collaboration: ${collabType} (with Himanshu)`;
      }

      if (messageArea) {
        messageArea.value = `Hi Himanshu,\n\nI saw your portfolio as a 2nd Year Engineering Student and would love to collaborate with you on ${collabType}.\n\nHere are some thoughts and ideas I have in mind: `;
      }

      // Smooth scroll to contact form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (messageArea) messageArea.focus();
        }, 650);
      }

      showToast(`Collaboration mode: ${collabType} selected!`, 'info');
    });
  });

  if (directPitchBtn) {
    directPitchBtn.addEventListener('click', (e) => {
      if (subjectInput && !subjectInput.value) {
        subjectInput.value = `Collaboration Proposal (with 2nd Year Student Himanshu)`;
      }
    });
  }
}

/* ==========================================================================
   4. Project Category Filter Controls & Live Search
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const searchInput = document.getElementById('project-search');
  const clearSearchBtn = document.getElementById('clear-search-btn');

  if (projectCards.length === 0) return;

  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    projectCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardText = card.textContent.toLowerCase();
      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
      const matchesSearch = !searchQuery || cardText.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 30);
      } else {
        card.style.display = 'none';
      }
    });

    if (clearSearchBtn) {
      clearSearchBtn.style.display = searchQuery ? 'inline-flex' : 'none';
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      searchInput.focus();
      applyFilters();
    });
  }
}

/* ==========================================================================
   5. Animated Numerical Stats Counter
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length === 0) return;

  let hasAnimated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(num => {
          const target = parseInt(num.getAttribute('data-target'), 10);
          animateCount(num, target, 1500);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    observer.observe(statsSection);
  }

  function animateCount(el, target, duration) {
    let start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const currentVal = Math.floor(easedProgress * target);

      el.textContent = currentVal;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  }
}

/* ==========================================================================
   6. Interactive Contact Form with Validation & Feedback
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    clearErrors();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    let isValid = true;

    if (!name) {
      showError('name', 'Please enter your name.');
      isValid = false;
    }

    if (!email) {
      showError('email', 'Please provide your email address.');
      isValid = false;
    } else if (!validateEmail(email)) {
      showError('email', 'Please provide a valid email format (e.g. name@domain.com).');
      isValid = false;
    }

    if (!subject) {
      showError('subject', 'Please specify a subject or brief scope.');
      isValid = false;
    }

    if (!message) {
      showError('message', 'Please share a short message about your project or collaboration idea.');
      isValid = false;
    } else if (message.length < 8) {
      showError('message', 'Please provide at least 8 characters.');
      isValid = false;
    }

    if (!isValid) return;

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      feedback.className = 'form-feedback success';
      feedback.textContent = `Thank you, ${name}! Your collaboration note has been received by Himanshu. He'll get back to you shortly!`;
      
      showToast(`Collaboration request sent to Himanshu Mishra!`, 'success');

      form.reset();

      setTimeout(() => {
        feedback.style.display = 'none';
      }, 7000);
    }, 1100);
  });

  function showError(fieldId, msg) {
    const errorEl = document.getElementById(`${fieldId}-error`);
    const groupEl = errorEl ? errorEl.closest('.form-group') : null;
    if (errorEl) errorEl.textContent = msg;
    if (groupEl) groupEl.classList.add('has-error');
  }

  function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group').forEach(el => el.classList.remove('has-error'));
    if (feedback) {
      feedback.style.display = 'none';
      feedback.textContent = '';
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}

/* ==========================================================================
   7. Toast Notification Helper
   ========================================================================== */
function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/* ==========================================================================
   8. Live GitHub Profile & Repositories Sync
   ========================================================================== */
function initGitHubLiveSync() {
  fetch('https://api.github.com/users/himanshu931588-cmd')
    .then(res => {
      if (!res.ok) throw new Error('API Rate Limited or Offline');
      return res.json();
    })
    .then(data => {
      if (data && data.public_repos !== undefined) {
        const repoStat = document.querySelector('.hero-stats .stat-number[data-target="10"]');
        if (repoStat) {
          repoStat.setAttribute('data-target', data.public_repos);
          repoStat.textContent = data.public_repos;
        }
      }
    })
    .catch(() => {
      // Graceful offline fallback: curated static metrics remain intact
    });
}

/* ==========================================================================
   9. Dynamic Current Year
   ========================================================================== */
function setCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   10. Tactical Cyber-Architect Custom Cursor (Desktop Only)
   ========================================================================== */
function initCustomCursor() {
  // Only initialize on desktop devices that have fine pointer and hover support
  const isPointerDevice = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isPointerDevice) return;

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  document.body.classList.add('custom-cursor-active');

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let hasMoved = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!hasMoved) {
      ringX = mouseX;
      ringY = mouseY;
      hasMoved = true;
    }
    dot.classList.remove('cursor-hidden');
    ring.classList.remove('cursor-hidden');
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    dot.classList.add('cursor-hidden');
    ring.classList.add('cursor-hidden');
  });

  window.addEventListener('mouseenter', () => {
    dot.classList.remove('cursor-hidden');
    ring.classList.remove('cursor-hidden');
  });

  // Smooth lerp animation loop for 60fps/120fps high-refresh displays
  function animateCursor() {
    if (hasMoved) {
      // 1:1 instantaneous tracking for the precision laser dot
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      // Smooth fluid spring lerp for the outer tactical crosshair ring
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  // Dynamic Hover and State Management using Event Delegation
  document.addEventListener('mouseover', (e) => {
    const isClickable = e.target.closest('a, button, .btn, .filter-btn, .collab-card, .project-card, .unique-logo-emblem, .loader-core-wrapper, .theme-toggle-btn, .spec-icon, .skill-pill, .interactive-logo, .avatar-photo-wrapper, .banner-avatar-group');
    const isTextInput = e.target.closest('input[type="text"], input[type="email"], textarea');

    if (isTextInput) {
      ring.classList.add('cursor-text');
      dot.classList.add('cursor-text');
      ring.classList.remove('cursor-hover');
      dot.classList.remove('cursor-hover');
    } else if (isClickable) {
      ring.classList.add('cursor-hover');
      dot.classList.add('cursor-hover');
      ring.classList.remove('cursor-text');
      dot.classList.remove('cursor-text');
    } else {
      ring.classList.remove('cursor-hover', 'cursor-text');
      dot.classList.remove('cursor-hover', 'cursor-text');
    }
  });

  // Tactical Mousedown & Click Micro-Ripple
  window.addEventListener('mousedown', () => {
    ring.classList.add('cursor-active');
    dot.classList.add('cursor-active');
    createClickRipple(mouseX, mouseY);
  });

  window.addEventListener('mouseup', () => {
    ring.classList.remove('cursor-active');
    dot.classList.remove('cursor-active');
  });

  function createClickRipple(x, y) {
    if (x <= 0 || y <= 0) return;
    const ripple = document.createElement('div');
    ripple.className = 'cursor-click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 450);
  }
}

/* ==========================================================================
   11. Lightbox Modals (Certificate & Reading Nook Bookshelf)
   ========================================================================== */
function initLightboxModals() {
  bindModal('cert-preview-trigger', 'cert-modal', 'cert-modal-close', 'cert-modal-backdrop');
  bindModal('books-photo-trigger', 'books-modal', 'books-modal-close', 'books-modal-backdrop');

  function bindModal(triggerId, modalId, closeBtnId, backdropId) {
    const trigger = document.getElementById(triggerId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeBtnId);
    const backdrop = document.getElementById(backdropId);

    if (!trigger || !modal) return;

    function openModal() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    trigger.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }
}

/* ==========================================================================
   12. Floating Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
