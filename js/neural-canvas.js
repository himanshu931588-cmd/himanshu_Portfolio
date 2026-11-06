/**
 * Neural Network / Synaptic Constellation Canvas
 * Interactive, high-performance background visualization for AI Portfolio
 */

class NeuralCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 160 };
    this.isTabActive = true;
    this.animationFrameId = null;

    // Configuration
    this.maxDistance = 140;
    this.baseParticleCount = 65;

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return {
      particle: isDark ? 'rgba(129, 140, 248, 0.75)' : 'rgba(99, 102, 241, 0.65)',
      particleHighlight: isDark ? 'rgba(6, 182, 212, 0.9)' : 'rgba(6, 182, 212, 0.8)',
      line: isDark ? '99, 102, 241' : '129, 140, 248',
      mouseLine: isDark ? '6, 182, 212' : '99, 102, 241'
    };
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);

    // Adjust particle count for screen size
    const screenArea = (this.width * this.height) / (1920 * 1080);
    const count = Math.floor(this.baseParticleCount * Math.max(0.4, screenArea));
    
    if (this.particles.length === 0 || Math.abs(this.particles.length - count) > 15) {
      this.createParticles(count);
    }
  }

  createParticles(count = this.baseParticleCount) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1.2,
        isHub: Math.random() > 0.85 // Hub nodes are slightly larger and brighter
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => this.resize(), 150);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    document.addEventListener('visibilitychange', () => {
      this.isTabActive = !document.hidden;
      if (this.isTabActive && !this.animationFrameId) {
        this.animate();
      }
    });
  }

  animate() {
    if (!this.isTabActive) {
      this.animationFrameId = null;
      return;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);
    const colors = this.getThemeColors();

    const pLen = this.particles.length;
    for (let i = 0; i < pLen; i++) {
      const p = this.particles[i];

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off boundaries with soft padding
      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      // Mouse interactive repelling / attraction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          const force = (1 - dist / this.mouse.radius) * 0.04;
          p.x += dx * force;
          p.y += dy * force;

          // Connect to mouse pointer
          const alpha = (1 - dist / this.mouse.radius) * 0.35;
          this.ctx.strokeStyle = `rgba(${colors.mouseLine}, ${alpha})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.stroke();
        }
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.isHub ? p.radius * 1.5 : p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.isHub ? colors.particleHighlight : colors.particle;
      this.ctx.fill();

      // Connect with neighboring particles
      for (let j = i + 1; j < pLen; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.maxDistance) {
          const alpha = (1 - dist / this.maxDistance) * 0.22;
          this.ctx.strokeStyle = `rgba(${colors.line}, ${alpha})`;
          this.ctx.lineWidth = p.isHub && p2.isHub ? 1.4 : 0.8;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

// Instantiate on load
document.addEventListener('DOMContentLoaded', () => {
  window.neuralCanvasInstance = new NeuralCanvas('neural-canvas');
});

