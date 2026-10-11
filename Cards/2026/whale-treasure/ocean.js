/* ═══════════════════════════════════════════════════════════
   OCEAN — Animated canvas background.
   Draws layered parallax waves that respond to world progress.
   Called by story.js after screens activate.
═══════════════════════════════════════════════════════════ */

class Ocean {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.time = 0;
    this.progress = 0;   // 0–5, set externally
    this.running = false;
    this._raf = null;

    // Wave layers: [amplitude, frequency, speed, alpha, yOffset]
    this.layers = [
      { amp: 18, freq: 0.012, speed: 0.4, alpha: 0.18, yFrac: 0.82 },
      { amp: 12, freq: 0.018, speed: 0.6, alpha: 0.14, yFrac: 0.88 },
      { amp:  8, freq: 0.025, speed: 0.9, alpha: 0.10, yFrac: 0.93 },
    ];

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const w = (parent && parent.offsetWidth  > 0) ? parent.offsetWidth  : window.innerWidth;
    const h = (parent && parent.offsetHeight > 0) ? parent.offsetHeight : window.innerHeight;
    this.canvas.width  = w;
    this.canvas.height = h;
  }

  start() {
    if (this.running) return;
    this.resize(); // Size canvas now, when the screen is actually visible
    this.running = true;
    this._tick();
  }

  stop() {
    this.running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
  }

  _tick() {
    if (!this.running) return;
    this._raf = requestAnimationFrame(() => this._tick());
    this.time += 0.016;
    this._draw();
  }

  _draw() {
    const { ctx, canvas, time, progress } = this;
    const w = canvas.width;
    const h = canvas.height;

    // Sky gradient — warms as progress increases
    const warmth = progress / 5;
    const skyTop    = this._lerpColor([10, 22, 40],  [15, 30, 50],   warmth);
    const skyBottom = this._lerpColor([13, 43, 78],  [22, 55, 80],   warmth);
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0,   `rgb(${skyTop})`);
    grad.addColorStop(1,   `rgb(${skyBottom})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Stars (fade in as progress increases, then fade to warmth)
    this._drawStars(w, h, time, Math.min(1, progress * 0.25));

    // Moon / soft light source
    this._drawMoon(w, h, time, progress);

    // Wave layers
    this.layers.forEach((layer, i) => {
      this._drawWave(
        layer,
        w, h, time,
        this._lerpColor([26, 74, 122], [42, 120, 160], warmth),
        layer.alpha + warmth * 0.05,
        i
      );
    });

    // Surface shimmer
    this._drawShimmer(w, h, time, warmth);
  }

  _drawStars(w, h, time, alpha) {
    if (alpha < 0.05) return;
    const ctx = this.ctx;
    // Use seeded pseudo-random for consistent star positions
    const count = 60;
    ctx.save();
    for (let i = 0; i < count; i++) {
      const x = this._hash(i * 7)  * w;
      const y = this._hash(i * 13) * h * 0.5;
      const r = 0.5 + this._hash(i * 3) * 1.2;
      const twinkle = 0.5 + 0.5 * Math.sin(time * (1 + this._hash(i) * 2) + i);
      ctx.globalAlpha = alpha * twinkle * 0.6;
      ctx.fillStyle = '#c8e6ff';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  _drawMoon(w, h, time, progress) {
    // Moon removed — text readability more important
  }

  _drawWave(layer, w, h, time, colorRgb, alpha, idx) {
    const ctx = this.ctx;
    const y0 = h * layer.yFrac;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = `rgb(${colorRgb})`;
    ctx.beginPath();
    ctx.moveTo(0, h);

    const steps = Math.ceil(w / 4);
    for (let x = 0; x <= w; x += steps) {
      const offset = (idx % 2 === 0 ? 1 : -1) * layer.amp;
      const y = y0
        + Math.sin(x * layer.freq + time * layer.speed) * layer.amp
        + Math.sin(x * layer.freq * 1.7 + time * layer.speed * 1.3 + idx) * (layer.amp * 0.4)
        + offset * 0.3;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  _drawShimmer(w, h, time, warmth) {
    const ctx = this.ctx;
    const y = h * 0.88;
    const count = 6;
    ctx.save();
    for (let i = 0; i < count; i++) {
      const x = (w * (i / count) + time * 20 * (i % 2 === 0 ? 1 : -1)) % w;
      const shimmerAlpha = (0.03 + warmth * 0.04) * (0.5 + 0.5 * Math.sin(time * 2 + i * 1.3));
      const gradient = ctx.createLinearGradient(x - 30, y, x + 30, y);
      gradient.addColorStop(0, 'rgba(255,255,255,0)');
      gradient.addColorStop(0.5, `rgba(255,255,255,${shimmerAlpha})`);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(x - 30, y - 3, 60, 6);
    }
    ctx.restore();
  }

  // Seeded pseudo-random (0–1) from integer seed
  _hash(n) {
    n = ((n >> 16) ^ n) * 0x45d9f3b;
    n = ((n >> 16) ^ n) * 0x45d9f3b;
    n = (n >> 16) ^ n;
    return Math.abs(n % 1000) / 1000;
  }

  // Lerp between two RGB arrays
  _lerpColor(a, b, t) {
    return [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t),
    ].join(',');
  }
}

/* Create all ocean instances — they're activated by story.js */
const Oceans = {
  opening: null,
  hunt:    null,
  final:   null,
  credits: null,

  init() {
    this.opening = new Ocean('ocean-canvas');
    this.hunt    = new Ocean('ocean-canvas-hunt');
    this.final   = new Ocean('ocean-canvas-final');
    this.credits = new Ocean('ocean-canvas-credits');
  },

  setProgress(n) {
    [this.opening, this.hunt, this.final, this.credits].forEach(o => {
      if (o) o.progress = n;
    });
  }
};
