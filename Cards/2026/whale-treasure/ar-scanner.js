/* ═══════════════════════════════════════════════════════════
   SCANNER — Code entry for marker identification.
   Shows a simple 2-digit code input. No camera required.
═══════════════════════════════════════════════════════════ */

class ARScanner {
  constructor() {
    this.closeBtn  = document.getElementById('scanner-close');
    this._targetId = null;
    this._onDetect = null;
    this.closeBtn.addEventListener('click', () => this.stop());
  }

  open(targetId, onDetect) {
    this._targetId = targetId;
    this._onDetect = onDetect;
    Story.showScreen('screen-scanner');
    this._showInput();
  }

  stop() {
    const screen = document.getElementById('screen-scanner');
    const existing = screen.querySelector('.manual-fallback');
    if (existing) screen.removeChild(existing);
    Story.showScreen('screen-hunt');
  }

  _showInput() {
    const screen = document.getElementById('screen-scanner');
    const existing = screen.querySelector('.manual-fallback');
    if (existing) screen.removeChild(existing);

    const memory = MEMORIES.find(m => m.arucoId === this._targetId);
    const expectedCode = memory ? memory.code : null;

    const fallback = document.createElement('div');
    fallback.className = 'manual-fallback';
    fallback.innerHTML = `
      <div style="position:absolute;inset:0;background:rgba(6,16,32,0.97);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.2rem;padding:2rem;text-align:center;z-index:50;">
        <p style="color:#c8e6f5;font-size:1rem;max-width:300px;line-height:1.6;">Enter the 2-digit code on the marker.</p>
        <input type="number" placeholder="_ _"
          style="width:110px;font-size:2.5rem;text-align:center;background:rgba(255,255,255,0.08);border:1.5px solid rgba(74,184,232,0.4);border-radius:8px;color:white;padding:0.5rem;letter-spacing:0.2em;" />
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
        errMsg.textContent = "That code doesn't match. Check the marker.";
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
    setTimeout(() => input.focus(), 100);
  }
}
