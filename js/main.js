/**
 * HIMANSHU MISHRA — CINEMATIC PORTFOLIO ENGINE
 * Architecture:
 * 0. Minimalist Boot & Texture Preloader
 * 1. Hero Atmospheric Embers & Volumetric Light Canvas
 * 2. Web Audio API Cinematic Synthesizer
 * 3. Scene 02: 3D Perspective Tilt on Tech Monoliths
 * 4. Scene 03: Chrono Time Machine Engine (2024–2029)
 * 5. Scene 04 & 05: Modals, Vero Simulator & Lightbox
 * 6. Mobile Drawer & Navigation Smooth Anchor
 */

// --- 0. Minimalist Boot & Asset Preloader ---
function initBootSequence() {
  const bootVeil = document.getElementById('bootVeil');
  const bootFill = document.getElementById('bootFill');
  const bootPercent = document.getElementById('bootPercent');

  if (!bootVeil || !bootFill) return;

  let progress = 0;
  const targetDuration = 450; // ms
  const interval = 25;
  const step = 100 / (targetDuration / interval);

  const timer = setInterval(() => {
    progress += step;
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
      bootFill.style.width = '100%';
      if (bootPercent) bootPercent.textContent = '100%';

      setTimeout(() => {
        bootVeil.classList.add('boot-hidden');
        document.body.classList.add('is-ready');
        // Animate SVG rule in header
        const rule = document.getElementById('hdrRulePath');
        if (rule) rule.style.strokeDashoffset = '0';
      }, 200);
    } else {
      bootFill.style.width = `${Math.floor(progress)}%`;
      if (bootPercent) bootPercent.textContent = `${Math.floor(progress)}%`;
    }
  }, interval);
}

// --- 1. Hero Atmospheric Embers & Light Canvas ---
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 75;

  const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    tx: window.innerWidth / 2,
    ty: window.innerHeight / 2
  };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.tx = e.clientX;
    mouse.ty = e.clientY;
  });

  // Particle Class
  class Ember {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedY = Math.random() * 0.7 + 0.25;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.7 + 0.2;
      this.hue = Math.random() > 0.4 ? 0 : 35; // Red or Warm Amber
      this.life = Math.random() * 200 + 100;
      this.age = 0;
    }

    update() {
      this.age++;
      this.y -= this.speedY;
      this.x += this.speedX;

      // React subtly to mouse pointer
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        this.x += (dx / dist) * 0.6;
        this.y += (dy / dist) * 0.6;
      }

      if (this.y < -20 || this.age > this.life) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.hue === 0 
        ? `rgba(222, 27, 28, ${this.opacity})` 
        : `rgba(255, 160, 60, ${this.opacity * 0.9})`;
      ctx.shadowBlur = this.size * 5;
      ctx.shadowColor = this.hue === 0 ? 'rgba(255, 42, 43, 0.8)' : 'rgba(255, 160, 60, 0.7)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Ember());
  }

  function render() {
    // Smooth mouse damping
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    ctx.clearRect(0, 0, width, height);

    // Dynamic volumetric gradient centered near subject
    const grad = ctx.createRadialGradient(
      width * 0.5, height * 0.48, 20,
      width * 0.5, height * 0.48, width * 0.45
    );
    grad.addColorStop(0, 'rgba(222, 27, 28, 0.16)');
    grad.addColorStop(0.5, 'rgba(10, 10, 14, 0.5)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Render embers
    for (let p of particles) {
      p.update();
      p.draw();
    }

    requestAnimationFrame(render);
  }

  render();
}

// --- 2. Web Audio API Cinematic Synthesizer ---
class CinematicSoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.droneGain = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
  }

  toggle() {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.enabled = !this.enabled;

    if (this.enabled) {
      this.startAmbientDrone();
      this.playChime(440, 0.1, 0.2);
    } else {
      this.stopAmbientDrone();
    }

    return this.enabled;
  }

  startAmbientDrone() {
    if (!this.ctx || this.droneGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      this.droneGain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55.5, this.ctx.currentTime); // Slight detune for slow beat

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.droneGain.gain.linearRampToValueAtTime(0.045, this.ctx.currentTime + 3);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      osc.start();
      osc2.start();
      this.droneOsc = [osc, osc2];
    } catch (e) {
      console.warn('Audio drone error', e);
    }
  }

  stopAmbientDrone() {
    if (this.droneGain && this.ctx) {
      this.droneGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8);
      setTimeout(() => {
        if (this.droneOsc) {
          this.droneOsc.forEach(o => { try { o.stop(); } catch(e){} });
          this.droneOsc = null;
        }
        this.droneGain = null;
      }, 850);
    }
  }

  playClick() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch(e){}
  }

  playChime(freq = 660, vol = 0.04, duration = 0.4) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e){}
  }
}

const audio = new CinematicSoundEngine();

function setupAudioControls() {
  const soundBtn = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  if (!soundBtn || !soundIcon) return;

  soundBtn.addEventListener('click', () => {
    const isOn = audio.toggle();
    if (isOn) {
      soundBtn.classList.add('is-active');
      soundIcon.className = 'fa-solid fa-volume-high';
    } else {
      soundBtn.classList.remove('is-active');
      soundIcon.className = 'fa-solid fa-volume-xmark';
    }
  });

  // Attach hover sounds to buttons and nav
  document.querySelectorAll('a, button, .chrono-node, .tech-monolith-card').forEach(el => {
    el.addEventListener('mouseenter', () => audio.playClick());
  });
}

// --- 3. Scene 02: 3D Perspective Tilt on Tech Monoliths ---
function init3DTilt() {
  const cards = document.querySelectorAll('.tech-monolith-card[data-tilt]');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotX = ((y - cy) / cy) * -9;
      const rotY = ((x - cx) / cx) * 9;

      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.025, 1.025, 1.025)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// --- 4. Scene 03: Chrono Time Machine Engine ---
const CHRONO_DATA = {
  '2024': {
    badge: 'FOUNDATIONAL ARCHITECTURE // 2024',
    title: 'Algorithmic Foundations & Low-Level Systems',
    body: 'Commenced intensive deep dive into computational systems, mastery of Python algorithmic paradigms, data structures, Linux system internals, and clean architectural design patterns. Laid the rigorous foundation for scalable cloud and AI systems.',
    chips: ['Python 3', 'Data Structures', 'Linux Internals', 'OOP Design']
  },
  '2025': {
    badge: 'CLOUD & SECURITY ADVANCEMENT // 2025',
    title: 'Cloud Infrastructure & BaseGuard Defense',
    body: 'Expanded focus into distributed cloud architecture and automated policy enforcement. Architected BaseGuard to vet IAM privileges and prevent security drift across containerized Docker workflows; actively contributed to open-source software.',
    chips: ['Cloud Architecture', 'BaseGuard', 'Docker Containers', 'IAM Governance']
  },
  '2026': {
    badge: 'NATIONAL RECOGNITION & APPLIED AI // 2026',
    title: 'National Science Award & Real-World AI Systems',
    body: 'Secured 2nd Position at National Science Day 2026 (Tech Sci Nova) with project Digital Rakshak alongside team members Vaidehi Gupta and Shubham Kumar Singh. Engineered the Vero real-time digital content authenticity analyzer and satellite-guided KrishiAlert.',
    chips: ['National Award Winner', 'Vero AI Forensics', 'KrishiAlert Telemetry', 'PyTorch / OpenCV']
  },
  '2027': {
    badge: 'DISTRIBUTED INTELLIGENCE // 2027',
    title: 'Distributed Cloud Scale & Intelligent Systems',
    body: 'Expanding architectures toward high-throughput distributed microservices, multi-cloud resilience, and autonomous AI verification pipelines. Actively participating in national hackathons and developer summits.',
    chips: ['Distributed Computing', 'Autonomous Agents', 'Kubernetes Clusters', 'System Resilience']
  },
  '2028': {
    badge: 'ENTERPRISE ARCHITECTURE // 2028',
    title: 'Enterprise Systems & Research Innovation',
    body: 'Spearheading advanced cloud research and deep-tech prototypes with measurable societal and enterprise impact. Focusing on robust security pipelines and applied ML deployment across heterogeneous clouds.',
    chips: ['Enterprise Cloud', 'Research Papers', 'Security Audits', 'Scale Engineering']
  },
  '2029': {
    badge: 'GRADUATION & LEADERSHIP // 2029',
    title: 'B.Tech CSE Graduation & Future Trajectory',
    body: 'Completing B.Tech Computer Science & Engineering degree (2025–2029). Stepping into industry leadership as a seasoned Cloud Architect and AI/ML Engineer dedicated to building transformative digital products.',
    chips: ['B.Tech CSE Graduate', 'Cloud Leadership', 'Global Innovation', 'Production AI']
  }
};

function initChronoEngine() {
  const rail = document.getElementById('chronoRail');
  const card = document.getElementById('chronoCard');
  const badgeEl = document.getElementById('chronoBadge');
  const titleEl = document.getElementById('chronoCardTitle');
  const bodyEl = document.getElementById('chronoCardBody');
  const metaEl = document.getElementById('chronoCardMeta');

  if (!rail || !card) return;

  const nodes = rail.querySelectorAll('.chrono-node');

  function setYear(year) {
    const data = CHRONO_DATA[year];
    if (!data) return;

    nodes.forEach(n => {
      if (n.dataset.year === year) {
        n.classList.add('is-active');
      } else {
        n.classList.remove('is-active');
      }
    });

    audio.playChime(750, 0.05, 0.35);

    // Smooth card transition
    card.style.opacity = '0.35';
    card.style.transform = 'translateY(8px)';

    setTimeout(() => {
      badgeEl.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> <span>${data.badge}</span>`;
      titleEl.textContent = data.title;
      bodyEl.textContent = data.body;
      metaEl.innerHTML = data.chips.map(c => `<span class="chrono-chip">${c}</span>`).join('');

      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 150);
  }

  nodes.forEach(n => {
    n.addEventListener('click', () => {
      setYear(n.dataset.year);
    });
  });
}

// --- 5. Modals & Lightbox ---
function initModals() {
  // Certificate Modal
  const certModal = document.getElementById('certModal');
  const viewCertBtn = document.getElementById('viewCertBtn');
  const closeCertBtn = document.getElementById('closeCertBtn');
  const certModalBackdrop = document.getElementById('certModalBackdrop');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    audio.playChime(520, 0.04, 0.3);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (viewCertBtn) viewCertBtn.addEventListener('click', () => openModal(certModal));
  if (closeCertBtn) closeCertBtn.addEventListener('click', () => closeModal(certModal));
  if (certModalBackdrop) certModalBackdrop.addEventListener('click', () => closeModal(certModal));

  // Vero Simulator Modal
  const veroModal = document.getElementById('veroModal');
  const openVeroDemo = document.getElementById('openVeroDemo');
  const closeVeroBtn = document.getElementById('closeVeroBtn');
  const veroModalBackdrop = document.getElementById('veroModalBackdrop');
  const runVeroScanBtn = document.getElementById('runVeroScanBtn');
  const veroInput = document.getElementById('veroInput');
  const veroVerdict = document.getElementById('veroVerdict');
  const veroConfidence = document.getElementById('veroConfidence');

  if (openVeroDemo) openVeroDemo.addEventListener('click', () => openModal(veroModal));
  if (closeVeroBtn) closeVeroBtn.addEventListener('click', () => closeModal(veroModal));
  if (veroModalBackdrop) veroModalBackdrop.addEventListener('click', () => closeModal(veroModal));

  if (runVeroScanBtn && veroInput) {
    runVeroScanBtn.addEventListener('click', () => {
      audio.playChime(880, 0.05, 0.2);
      runVeroScanBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing Latent Tokens...';

      setTimeout(() => {
        runVeroScanBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> Run Forensic Scan';
        const text = veroInput.value.toLowerCase();
        if (text.includes('urgent leak') || text.includes('synthetic') || text.includes('fake')) {
          veroVerdict.textContent = 'SYNTHETIC ARTIFACT DETECTED';
          veroVerdict.style.color = 'var(--ink-hot)';
          veroConfidence.textContent = '96.2%';
        } else {
          veroVerdict.textContent = 'AUTHENTIC & VERIFIED';
          veroVerdict.style.color = '#22c55e';
          veroConfidence.textContent = '98.8%';
        }
      }, 550);
    });
  }

  // Bookshelf trigger modal / click
  const bookshelfTrigger = document.getElementById('bookshelfModalTrigger');
  if (bookshelfTrigger) {
    bookshelfTrigger.addEventListener('click', () => {
      audio.playChime(640, 0.04, 0.3);
    });
  }

  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(certModal);
      closeModal(veroModal);
    }
  });
}

// --- 6. Mobile Drawer & Navigation Smooth Anchor ---
function initNavigation() {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (burgerBtn && mobileDrawer) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      burgerBtn.setAttribute('aria-expanded', isOpen);
      audio.playClick();
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        burgerBtn.setAttribute('aria-expanded', false);
      });
    });
  }

  // Update active navigation link on scroll
  const sections = document.querySelectorAll('.scene-section, .fin-section, #heroStage');
  const navLinks = document.querySelectorAll('.hdr__nav a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(a => {
      a.classList.remove('is-active');
      if (a.getAttribute('href') === `#${current}`) {
        a.classList.add('is-active');
      }
    });
  }, { passive: true });
}

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
  initBootSequence();
  initHeroCanvas();
  setupAudioControls();
  init3DTilt();
  initChronoEngine();
  initModals();
  initNavigation();
});
