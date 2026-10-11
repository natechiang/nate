/* ═══════════════════════════════════════════════════════════
   AR SCANNER — ArUco marker detection via js-aruco.
   Uses the device camera + canvas to detect markers.
   Reports detected marker IDs to story.js via callback.
═══════════════════════════════════════════════════════════ */

class ARScanner {
  constructor() {
    this.video       = document.getElementById('camera-feed');
    this.canvas      = document.getElementById('ar-canvas');
    this.ctx         = this.canvas.getContext('2d');
    this.hint        = document.getElementById('scanner-hint');
    this.closeBtn    = document.getElementById('scanner-close');

    this.running     = false;
    this.stream      = null;
    this.detector    = null;
    this._raf        = null;
    this._onDetect   = null;   // callback(markerId)
    this._targetId   = null;   // which ID we're waiting for
    this._cooldown   = false;  // prevent rapid re-fires

    // Init aruco detector when library is available
    if (typeof AR !== 'undefined') {
      this.detector = new AR.Detector();
    }

    this.closeBtn.addEventListener('click', () => this.stop());
  }

  /* Open scanner and wait for a specific marker ID.
     onDetect(id) fires once when the correct marker is seen. */
  open(targetId, onDetect) {
    this._targetId = targetId;
    this._onDetect = onDetect;
    this._cooldown = false;
    this._start();
  }

  async _start() {
    const screen = document.getElementById('screen-scanner');

    // Request camera
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width:  { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      this._showCameraError();
      return;
    }

    this.video.srcObject = this.stream;
    await this.video.play();

    this.canvas.width  = this.video.videoWidth  || 640;
    this.canvas.height = this.video.videoHeight || 480;

    // Show scanner screen
    Story.showScreen('screen-scanner');

    this.running = true;
    this._tick();

    // After 10 seconds with no detection, slide up the fallback
    this._fallbackTimer = setTimeout(() => {
      if (this.running && !this._cooldown) {
        this._setHint('Having trouble? Enter the code below.');
        this._showFallback();
      }
    }, 10000);
  }

  _tick() {
    if (!this.running) return;
    this._raf = requestAnimationFrame(() => this._tick());

    if (!this.video.readyState || this.video.readyState < 2) return;
    if (this._cooldown) return;

    // Draw current frame to canvas for processing
    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    if (!this.detector) {
      // Library not loaded — show manual fallback
      this._showFallback();
      return;
    }

    try {
      const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const markers   = this.detector.detect(imageData);

      if (markers.length > 0) {
        const found = markers.find(m => m.id === this._targetId);
        if (found) {
          this._onMarkerFound(found.id);
        } else {
          // Wrong marker — let the player know
          this._setHint(`That's not the right marker. Keep looking.`);
        }
      } else {
        this._setHint('Point at the marker on the object');
      }
    } catch (e) {
      // Silent fail — keep scanning
    }
  }

  _onMarkerFound(id) {
    this._cooldown = true;
    this.running   = false;
    cancelAnimationFrame(this._raf);
    clearTimeout(this._fallbackTimer);

    this._setHint('Found it!');

    setTimeout(() => {
      this.stop();
      if (this._onDetect) this._onDetect(id);
    }, 700);
  }

  stop() {
    this.running = false;
    clearTimeout(this._fallbackTimer);
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.video) {
      this.video.srcObject = null;
    }
    Story.showScreen('screen-hunt');
  }

  _setHint(text) {
    if (this.hint) this.hint.textContent = text;
  }

  // Fallback: manual code entry if camera/aruco unavailable
  _showFallback() {
    this.running = false;
    cancelAnimationFrame(this._raf);

    this._setHint('');
    const screen = document.getElementById('screen-scanner');
    const existing = screen.querySelector('.manual-fallback');
    if (existing) return;    // Find the code for the target memory
    const memory = MEMORIES.find(m => m.arucoId === this._targetId);
    const expectedCode = memory ? memory.code : null;

    const fallback = document.createElement('div');
    fallback.className = 'manual-fallback';
    fallback.innerHTML = `
      <div style="position:absolute;inset:0;background:rgba(0,0,0,0.88);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.2rem;padding:2rem;text-align:center;z-index:50;">
        <p style="color:#c8e6f5;font-size:1rem;max-width:300px;line-height:1.6;">Camera scanning isn't available.<br>Enter the 2-digit code from the back of the marker.</p>
        <input type="number" placeholder="_ _"
          style="width:100px;font-size:2.5rem;text-align:center;background:rgba(255,255,255,0.08);border:1.5px solid rgba(74,184,232,0.4);border-radius:8px;color:white;padding:0.5rem;letter-spacing:0.2em;" />
        <p class="fallback-error" style="color:#e85080;font-size:0.85rem;min-height:1.2em;opacity:0;transition:opacity 0.2s;"></p>
        <button style="padding:0.65rem 2.2rem;background:rgba(74,184,232,0.15);border:1px solid rgba(74,184,232,0.45);border-radius:50px;color:#a8d8f0;font-size:1rem;cursor:pointer;letter-spacing:0.05em;">
          Confirm
        </button>
      </div>
    `;

    const input  = fallback.querySelector('input');
    const btn    = fallback.querySelector('button');
    const errMsg = fallback.querySelector('.fallback-error');

    const attempt = () => {
      const val = parseInt(input.value, 10);
      if (!isNaN(val) && val === expectedCode) {
        screen.removeChild(fallback);
        this.stop();
        if (this._onDetect) this._onDetect(this._targetId);
      } else {
        // Show error message
        errMsg.textContent = 'That code doesn\'t match. Check the marker.';
        errMsg.style.opacity = '1';
        input.style.borderColor = '#e85080';
        input.value = '';
        setTimeout(() => {
          errMsg.style.opacity = '0';
          input.style.borderColor = 'rgba(74,184,232,0.4)';
        }, 2500);
      }
    };

    btn.addEventListener('click', attempt);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });

    screen.appendChild(fallback);
  }

  _showCameraError() {
    this._showFallback();
    Story.showScreen('screen-scanner');
  }
}
