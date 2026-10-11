/* ═══════════════════════════════════════════════════════════
   WHALE — Character controller.
   The whale is the emotional heart. Every animation choice
   asks: does this make the whale feel more real?
═══════════════════════════════════════════════════════════ */

class Whale {
  constructor(svgId, mouthId, browId, spoutId) {
    this.svg   = document.getElementById(svgId);
    this.mouth = document.getElementById(mouthId);
    this.brow  = document.getElementById(browId);
    this.spout = document.getElementById(spoutId);
    this.currentExpression = 'neutral';
  }

  /* ── EXPRESSIONS ─────────────────────────────────────── */

  setExpression(name) {
    if (!this.svg) return;
    this.currentExpression = name;

    const expressions = {
      neutral: {
        mouth: 'M 50 68 Q 58 74 66 68',
        brow:  'M 54 50 Q 60 47 66 50',
        class: '',
      },
      curious: {
        mouth: 'M 52 68 Q 58 72 64 68',
        brow:  'M 54 48 Q 60 45 66 49',
        class: '',
      },
      happy: {
        mouth: 'M 48 68 Q 58 76 68 68',
        brow:  'M 54 51 Q 60 48 66 51',
        class: 'happy',
      },
      wise: {
        mouth: 'M 50 69 Q 58 73 66 69',
        brow:  'M 54 49 Q 60 46 66 50',
        class: 'wise',
      },
      moved: {
        mouth: 'M 48 68 Q 58 76 68 68',
        brow:  'M 54 50 Q 60 48 66 50',
        class: 'happy',
      },
      thoughtful: {
        mouth: 'M 51 68 Q 58 72 65 68',
        brow:  'M 55 48 Q 60 46 65 49',
        class: '',
      },
    };

    const expr = expressions[name] || expressions.neutral;

    if (this.mouth) this.mouth.setAttribute('d', expr.mouth);
    if (this.brow)  this.brow.setAttribute('d', expr.brow);
    if (this.svg) {
      this.svg.classList.remove('happy', 'wise');
      if (expr.class) this.svg.classList.add(expr.class);
    }
  }

  /* ── SPOUT ───────────────────────────────────────────── */

  spoutWater() {
    if (!this.spout) return;
    this.spout.classList.remove('active');
    // Force reflow so animation restarts
    void this.spout.offsetWidth;
    this.spout.classList.add('active');
    setTimeout(() => this.spout.classList.remove('active'), 1400);
  }

  /* ── GENTLE BOB OVERRIDE ─────────────────────────────── */

  emphasize() {
    if (!this.svg) return;
    this.svg.style.transition = 'transform 0.3s ease';
    this.svg.style.transform  = 'scale(1.06)';
    setTimeout(() => {
      this.svg.style.transform = 'scale(1)';
    }, 400);
  }
}

/* ─── DIALOGUE ENGINE ────────────────────────────────────
   Handles typewriter effect, line queuing, callbacks.
─────────────────────────────────────────────────────────── */

class DialogueEngine {
  constructor(textEl, nextBtn) {
    this.textEl  = textEl;
    this.nextBtn = nextBtn;
    this.queue   = [];
    this.current = 0;
    this.typing  = false;
    this._typeTimer = null;
    this._onComplete = null;
    this._onEachLine  = null;

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this._advance());
    }
  }

  /* Start a new dialogue sequence.
     lines: string[]
     opts: { onComplete, onLine(index, line), pauseMs, speedMs }
  */
  speak(lines, opts = {}) {
    this.queue       = lines;
    this.current     = 0;
    this._onComplete = opts.onComplete || null;
    this._onEachLine = opts.onLine || null;
    this._pauseMs    = opts.pauseMs  || 600;
    this._speedMs    = opts.speedMs  || 38;
    this._dismissEl  = opts.dismissEl || null;  // element to fade out on complete
    this._typeLine(0);
  }

  _typeLine(index) {
    if (index >= this.queue.length) {
      this._finish();
      return;
    }

    const line = this.queue[index];
    this.current = index;

    if (this._onEachLine) this._onEachLine(index, line);

    // '—' is a pause beat — show nothing, wait, advance
    if (line === '—') {
      if (this.textEl) this.textEl.textContent = '';
      if (this.nextBtn) this.nextBtn.style.display = 'none';
      setTimeout(() => this._typeLine(index + 1), this._pauseMs * 2.5);
      return;
    }

    if (this.textEl) {
      this.textEl.classList.add('typing');
      this.textEl.textContent = '';
    }
    if (this.nextBtn) this.nextBtn.style.display = 'none';

    this.typing = true;
    let charIndex = 0;

    const tick = () => {
      if (charIndex < line.length) {
        if (this.textEl) this.textEl.textContent += line[charIndex];
        charIndex++;
        this._typeTimer = setTimeout(tick, this._speedMs);
      } else {
        this.typing = false;
        if (this.textEl) this.textEl.classList.remove('typing');
        // Last real line — no button, just finish after a pause
        if (index >= this.queue.length - 1 || this.queue.slice(index + 1).every(l => l === '—')) {
          setTimeout(() => this._finish(), this._pauseMs * 3);
        } else {
          if (this.nextBtn) this.nextBtn.style.display = 'flex';
        }
      }
    };

    this._typeTimer = setTimeout(tick, 80);
  }

  _advance() {
    if (this.typing) {
      clearTimeout(this._typeTimer);
      if (this.textEl) {
        this.textEl.textContent = this.queue[this.current];
        this.textEl.classList.remove('typing');
      }
      this.typing = false;
      if (this.nextBtn) this.nextBtn.style.display = 'flex';
    } else {
      const remaining = this.queue.slice(this.current + 1);
      const onlyPauses = remaining.every(l => l === '—');
      if (this.current >= this.queue.length - 1 || onlyPauses) {
        this._finish();
      } else {
        this._typeLine(this.current + 1);
      }
    }
  }

  _finish() {
    if (this.nextBtn) this.nextBtn.style.display = 'none';
    if (this._dismissEl) {
      this._dismissEl.style.transition = 'opacity 0.6s ease';
      this._dismissEl.style.opacity = '0';
      setTimeout(() => {
        if (this._dismissEl) this._dismissEl.style.display = 'none';
        if (this._onComplete) this._onComplete();
      }, 650);
    } else {
      if (this._onComplete) this._onComplete();
    }
  }

  clear() {
    clearTimeout(this._typeTimer);
    if (this.textEl) this.textEl.textContent = '';
    if (this.nextBtn) this.nextBtn.style.display = 'none';
    this.typing = false;
    this.queue = [];
  }
}

/* ─── Whale + dialogue instances (created in story.js) ── */
let whaleOpening, whaleFinal, whaleHunt;
let dialogueOpening, dialogueHunt, dialogueFinal;
