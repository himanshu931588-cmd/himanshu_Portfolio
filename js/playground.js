/**
 * Vero Digital Content Authenticity Analyzer Simulation
 * Inspired by Himanshu Mishra's flagship project 'Vero' (@himanshu931588-cmd)
 * Provides real-time in-browser tokenization, forensic attention scoring, and synthetic/authentic classification.
 */

class AIPlayground {
  constructor() {
    this.inputArea = document.getElementById('demo-input');
    this.runBtn = document.getElementById('run-inference-btn');
    this.tokensDisplay = document.getElementById('tokens-display');
    this.presetChips = document.querySelectorAll('.chip-btn');

    this.sentimentResultCard = document.getElementById('sentiment-result-card');
    this.sentimentIcon = document.getElementById('sentiment-icon');
    this.sentimentLabel = document.getElementById('sentiment-label');
    this.sentimentConfidence = document.getElementById('sentiment-confidence');

    this.barPositive = document.getElementById('bar-positive');
    this.barNeutral = document.getElementById('bar-neutral');
    this.barNegative = document.getElementById('bar-negative');

    this.scorePositive = document.getElementById('score-positive');
    this.scoreNeutral = document.getElementById('score-neutral');
    this.scoreNegative = document.getElementById('score-negative');

    this.entitiesTags = document.getElementById('entities-tags');
    this.timeBadge = document.getElementById('inference-time-badge');

    // Forensic Authenticity Dictionaries
    this.authenticMarkers = new Set([
      'confirmed', 'official', 'verified', 'authentic', 'valid', 'satellite', 'sensors', 
      'krishialert', 'equipment', 'dispatch', 'audit', 'genuine', 'human', 'session', 
      'reduction', 'secure', 'ground', 'precision', 'balance', 'approved'
    ]);

    this.syntheticMarkers = new Set([
      'fake', 'synthetic', 'leak', 'deepfake', 'generated', 'urgent', 'crashed', 
      'artifacts', 'manipulated', 'hallucination', 'anomaly', 'spoofed', 'altered', 
      'tampered', 'glitch', 'bot', 'unauthorized', 'clone'
    ]);

    this.forensicEntities = [
      'krishialert', 'vero', 'satellite', 'sensors', 'atm', 'python', 'deepfake', 
      'authenticity', 'synthetic', 'forensics', 'tensorflow', 'firebase', 'dispatch'
    ];

    this.init();
  }

  init() {
    if (!this.inputArea || !this.runBtn) return;

    // Set initial text from active chip
    const activeChip = document.querySelector('.chip-btn.active');
    if (activeChip) {
      this.inputArea.value = activeChip.getAttribute('data-sample');
    }

    // Bind Run Button
    this.runBtn.addEventListener('click', () => this.analyzeText());

    // Bind Preset Chips
    this.presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.presetChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.inputArea.value = chip.getAttribute('data-sample');
        this.analyzeText();
      });
    });

    // Run initial inference
    this.analyzeText();
  }

  analyzeText() {
    const rawText = this.inputArea.value.trim();
    if (!rawText) return;

    // Simulate fast edge/cloud inference duration (9 - 18 ms)
    const inferenceDuration = (Math.random() * 7 + 9.2).toFixed(1);
    this.timeBadge.innerHTML = `<i class="fa-solid fa-stopwatch"></i> ${inferenceDuration} ms`;

    // 1. Tokenize & simulate attention
    this.renderTokens(rawText);

    // 2. Score Authenticity & Anomaly distribution
    const scores = this.calculateAuthenticity(rawText);
    this.renderScores(scores);

    // 3. Extract Technical Entities
    this.extractEntities(rawText);
  }

  calculateAuthenticity(text) {
    const words = text.toLowerCase().match(/\b[a-z0-9_-]+\b/g) || [];
    let authScore = 0;
    let synthScore = 0;

    words.forEach(w => {
      if (this.authenticMarkers.has(w)) authScore += 2.2;
      if (this.syntheticMarkers.has(w)) synthScore += 2.4;
    });

    if (text.toLowerCase().includes('krishialert') || text.toLowerCase().includes('satellite')) authScore += 2.0;
    if (text.toLowerCase().includes('deepfake') || text.toLowerCase().includes('fake synthetic')) synthScore += 3.0;

    // Base probabilities
    let rawAuth = 0.2 + authScore;
    let rawSynth = 0.2 + synthScore;
    let rawNeu = 0.5;

    if (authScore === 0 && synthScore === 0) {
      rawNeu = 2.5;
    }

    // Softmax normalization
    const expAuth = Math.exp(rawAuth);
    const expSynth = Math.exp(rawSynth);
    const expNeu = Math.exp(rawNeu);
    const sumExp = expAuth + expSynth + expNeu;

    let pAuth = (expAuth / sumExp) * 100;
    let pSynth = (expSynth / sumExp) * 100;
    let pNeu = (expNeu / sumExp) * 100;

    return {
      authentic: Math.min(99.6, Math.max(0.4, pAuth)).toFixed(1),
      synthetic: Math.min(99.6, Math.max(0.4, pSynth)).toFixed(1),
      neutral: Math.min(99.6, Math.max(0.4, pNeu)).toFixed(1)
    };
  }

  renderScores(scores) {
    const auth = parseFloat(scores.authentic);
    const synth = parseFloat(scores.synthetic);
    const neu = parseFloat(scores.neutral);

    this.scorePositive.textContent = `${auth}%`;
    this.scoreNeutral.textContent = `${neu}%`;
    this.scoreNegative.textContent = `${synth}%`;

    this.barPositive.style.width = `${auth}%`;
    this.barNeutral.style.width = `${neu}%`;
    this.barNegative.style.width = `${synth}%`;

    // Determine verdict
    if (auth >= synth && auth >= neu) {
      this.sentimentLabel.textContent = 'Authentic & Verified Content';
      this.sentimentConfidence.textContent = `${auth}%`;
      this.sentimentIcon.innerHTML = '<i class="fa-solid fa-shield-check"></i>';
      this.sentimentIcon.style.color = '#ffffff';
      this.sentimentIcon.style.background = 'rgba(255, 255, 255, 0.15)';
    } else if (synth > auth && synth >= neu) {
      this.sentimentLabel.textContent = 'Synthetic / Deepfake Media Detected';
      this.sentimentConfidence.textContent = `${synth}%`;
      this.sentimentIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
      this.sentimentIcon.style.color = '#e4e4e7';
      this.sentimentIcon.style.background = 'rgba(255, 255, 255, 0.12)';
    } else {
      this.sentimentLabel.textContent = 'Unverified / Neutral Digital Context';
      this.sentimentConfidence.textContent = `${neu}%`;
      this.sentimentIcon.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
      this.sentimentIcon.style.color = '#a1a1aa';
      this.sentimentIcon.style.background = 'rgba(255, 255, 255, 0.08)';
    }
  }

  renderTokens(text) {
    this.tokensDisplay.innerHTML = '';
    const words = text.split(/\s+/).slice(0, 18);
    
    // Always start with [CLS] token
    const clsPill = document.createElement('span');
    clsPill.className = 'token-pill';
    clsPill.innerHTML = `[CLS] <span class="attn-weight">0.94</span>`;
    this.tokensDisplay.appendChild(clsPill);

    words.forEach((word) => {
      if (!word) return;
      const cleanWord = word.replace(/[^a-zA-Z0-9%_-]/g, '');
      const isImportant = this.authenticMarkers.has(cleanWord.toLowerCase()) || 
                          this.syntheticMarkers.has(cleanWord.toLowerCase()) ||
                          this.forensicEntities.includes(cleanWord.toLowerCase());

      const weight = isImportant ? (Math.random() * 0.22 + 0.76).toFixed(2) : (Math.random() * 0.3 + 0.15).toFixed(2);
      
      const pill = document.createElement('span');
      pill.className = 'token-pill';
      if (isImportant) {
        pill.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        pill.style.background = 'rgba(255, 255, 255, 0.15)';
      }
      pill.innerHTML = `${word} <span class="attn-weight">${weight}</span>`;
      this.tokensDisplay.appendChild(pill);
    });

    const sepPill = document.createElement('span');
    sepPill.className = 'token-pill';
    sepPill.innerHTML = `[SEP] <span class="attn-weight">0.89</span>`;
    this.tokensDisplay.appendChild(sepPill);
  }

  extractEntities(text) {
    this.entitiesTags.innerHTML = '';
    const found = new Set();
    const lower = text.toLowerCase();

    this.forensicEntities.forEach(ent => {
      if (lower.includes(ent)) {
        found.add({ text: ent, type: 'entity-ai' });
      }
    });

    const metricMatches = text.match(/(\d+(\.\d+)?(%|ms|fps|gb|x|k))/gi);
    if (metricMatches) {
      metricMatches.slice(0, 3).forEach(m => {
        found.add({ text: m, type: 'entity-metric' });
      });
    }

    if (found.size === 0) {
      found.add({ text: 'forensic-stream', type: 'entity-sys' });
    }

    found.forEach(item => {
      const tag = document.createElement('span');
      tag.className = `entity-tag ${item.type}`;
      tag.textContent = item.text;
      this.entitiesTags.appendChild(tag);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.playgroundInstance = new AIPlayground();
});
