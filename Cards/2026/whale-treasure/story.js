/* ═══════════════════════════════════════════════════════════
   STORY — Scene manager. Orchestrates the full experience.
   Every transition asks: does this make the whale feel real?
═══════════════════════════════════════════════════════════ */

/* ─── PHOTOS ──────────────────────────────────────────────
   Drop family photos into assets/photos/ then list them here.
   Any common image format works: jpg, png, webp, heic.
─────────────────────────────────────────────────────────── */
const PHOTOS = [
  'assets/photos/FF00ABAC-C8D1-49B2-970E-E9339B742895.JPEG',
  'assets/photos/IMG_0424.jpeg',
  'assets/photos/IMG_2587.jpeg',
  'assets/photos/IMG_2887.jpeg',
  'assets/photos/IMG_3031.jpeg',
  'assets/photos/IMG_4871.jpeg',
  'assets/photos/IMG_5063.jpeg',
  'assets/photos/IMG_7356.jpeg',
  'assets/photos/IMG_7519.jpeg',
  'assets/photos/IMG_7678.jpeg',
];

/* ─── SOUNDS ──────────────────────────────────────────────
   Drop audio files into assets/sounds/ then uncomment below.
   whale_ambient.mp3  — gentle ocean loop, plays throughout
   memory_unlock.mp3  — plays when a memory is found
   chest_open.mp3     — plays when treasure chest opens
   final_music.mp3    — plays during the final reveal
─────────────────────────────────────────────────────────── */
const SOUNDS = {
  ambient:  'assets/sounds/waves.mp3',
  unlock:   'assets/sounds/waves.mp3',
  chest:    'assets/sounds/waves.mp3',
  finale:   'assets/sounds/waves.mp3',
};

/* ─── WHALE ART ───────────────────────────────────────────
   If you have a custom whale image, drop it in assets/whale/
   and set WHALE_IMAGE below. It will replace the SVG whale.
   Leave as null to use the built-in SVG whale.
   Recommended size: at least 400×240px, transparent PNG.
─────────────────────────────────────────────────────────── */
/* ─── WHALE EXPRESSION IMAGES ────────────────────────────
   Mapped by expression name to filename in assets/whale/.
   If any file is missing the SVG fallback is used instead.
─────────────────────────────────────────────────────────── */
const WHALE_EXPRESSIONS = {
  neutral:    'assets/whale/whale_nuetral.png',
  curious:    'assets/whale/whale_curious.png',
  wise:       'assets/whale/whale_wise.png',
  thoughtful: 'assets/whale/whale_thoughtful.png',
  happy:      'assets/whale/whale_happy.png',
  moved:      'assets/whale/whale_moved.png',
};

/* ─── OPENING DIALOGUE ──────────────────────────────────── */
const OPENING_LINES = [
  'Hello again.',
  'You found my card.',
  'I\'ve traveled across many oceans.',
  'Along the way I discovered many treasures.',
  'But the greatest treasure is not easy to share.',
  'Let\'s see if you\'re worthy.',
];

const OPENING_EXPRESSIONS = {
  0: 'neutral',
  1: 'curious',
  2: 'wise',
  3: 'thoughtful',
  4: 'thoughtful',
  5: 'curious',
};

/* ─── AUDIO ──────────────────────────────────────────────── */

const Audio = (() => {
  const nodes = {};
  let enabled = true;

  function load(key, src) {
    if (!src) return;
    try {
      const a = new window.Audio(src);
      a.preload = 'auto';
      nodes[key] = a;
    } catch(e) { /* silent */ }
  }

  function play(key, { loop = false, volume = 0.6 } = {}) {
    if (!enabled || !nodes[key]) return;
    try {
      const a = nodes[key];
      a.loop   = loop;
      a.volume = volume;
      a.currentTime = 0;
      a.play().catch(() => {});
    } catch(e) {}
  }

  function stop(key, fadeMs = 800) {
    if (!nodes[key]) return;
    const a = nodes[key];
    const start  = a.volume;
    const step   = start / (fadeMs / 50);
    const t = setInterval(() => {
      a.volume = Math.max(0, a.volume - step);
      if (a.volume <= 0) { a.pause(); a.volume = start; clearInterval(t); }
    }, 50);
  }

  function init() {
    load('ambient', SOUNDS.ambient);
    load('unlock',  SOUNDS.unlock);
    load('chest',   SOUNDS.chest);
    load('finale',  SOUNDS.finale);
  }

  return { init, play, stop };
})();

/* ─── STORY CONTROLLER ───────────────────────────────────── */

const Story = (() => {
  let currentScreen = null;
  let scanner       = null;
  let confettiLoop  = null;
  let confettiParticles = [];

  /* ── INIT ─────────────────────────────────────────────── */
  function init() {
    Oceans.init();
    Audio.init();
    setupWhales();
    setupButtons();

    // Swap SVG whales for expression images
    applyWhaleImages();

    // Loading → Opening after a beat
    setTimeout(() => {
      showScreen('screen-opening');
      startOpening();
    }, 1800);
  }

  /* ── WHALE IMAGE SWAP ────────────────────────────────── */
  // Called once on init — replaces all SVGs with a crossfade pair of image elements
  function applyWhaleImages() {
    document.querySelectorAll('.whale-art').forEach(art => {
      const svg = art.querySelector('svg');
      if (!svg) return;

      // Wrapper holds two stacked images for crossfading
      const wrapper = document.createElement('div');
      wrapper.className = 'whale-img-wrap';
      wrapper.style.cssText = 'position:relative;width:100%;';

      // Bottom layer — outgoing expression
      const imgBack = document.createElement('img');
      imgBack.src       = WHALE_EXPRESSIONS.neutral;
      imgBack.alt       = '';
      imgBack.className = 'whale-img whale-img-back';

      // Top layer — incoming expression
      const imgFront = document.createElement('img');
      imgFront.src       = WHALE_EXPRESSIONS.neutral;
      imgFront.alt       = 'The whale';
      imgFront.className = 'whale-img whale-img-front';

      wrapper.appendChild(imgBack);
      wrapper.appendChild(imgFront);
      svg.replaceWith(wrapper);

      // Hide spout — SVG-only feature
      const spout = art.querySelector('.whale-spout');
      if (spout) spout.style.display = 'none';
    });
  }

  // Crossfade all whale image wrappers to a new expression
  function setWhaleExpression(name) {
    const src = WHALE_EXPRESSIONS[name] || WHALE_EXPRESSIONS.neutral;

    document.querySelectorAll('.whale-img-wrap').forEach(wrap => {
      const front = wrap.querySelector('.whale-img-front');
      const back  = wrap.querySelector('.whale-img-back');
      if (!front || !back) return;

      // Already showing this expression — skip
      if (front.src.endsWith(src.split('/').pop())) return;

      // Copy current front to back, load new image into front
      back.src = front.src;
      back.style.opacity  = '1';
      front.style.opacity = '0';
      front.src = src;

      // Once new image is loaded, fade front in (back fades out simultaneously)
      front.onload = () => {
        front.style.opacity = '1';
        back.style.opacity  = '0';
      };

      // Fallback if already cached
      if (front.complete) {
        front.style.opacity = '1';
        back.style.opacity  = '0';
      }
    });
  }

  /* ── SCREEN TRANSITIONS ──────────────────────────────── */
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
    });
    const next = document.getElementById(id);
    if (next) {
      next.classList.add('active');
      currentScreen = id;
      // After CSS transition, re-size any ocean canvases on this screen
      setTimeout(() => {
        next.querySelectorAll('canvas').forEach(c => {
          if (c.width === 0 || c.height === 0) {
            c.width  = c.parentElement ? c.parentElement.offsetWidth  : window.innerWidth;
            c.height = c.parentElement ? c.parentElement.offsetHeight : window.innerHeight;
          }
        });
        // Trigger ocean resize for all running instances
        [Oceans.opening, Oceans.hunt, Oceans.final, Oceans.credits].forEach(o => {
          if (o && o.running) o.resize();
        });
      }, 50);
    }
  }

  /* ── SETUP WHALE INSTANCES ───────────────────────────── */
  function setupWhales() {
    whaleOpening = new Whale('whale-svg', 'whale-mouth', 'whale-brow', 'whale-spout');
    whaleFinal   = new Whale('whale-svg-final', 'whale-mouth-final', 'whale-brow-final', 'whale-spout-final');
    whaleHunt    = new Whale('whale-svg-hunt', 'whale-mouth-hunt', 'whale-brow-hunt', 'whale-spout-hunt');

    dialogueOpening = new DialogueEngine(
      document.getElementById('dialogue-text'),
      document.getElementById('dialogue-next')
    );
    dialogueHunt = new DialogueEngine(
      document.getElementById('hunt-dialogue-text'),
      document.getElementById('hunt-dialogue-next')
    );
    dialogueFinal = new DialogueEngine(
      document.getElementById('final-dialogue-text'),
      document.getElementById('final-dialogue-next')
    );
  }

  /* ── SETUP BUTTON HANDLERS ───────────────────────────── */
  function setupButtons() {
    // Begin hunt — first user gesture, safe to start audio here
    document.getElementById('begin-btn').addEventListener('click', () => {
      Audio.play('ambient', { loop: true, volume: 0.3 });
      beginHunt();
    });

    // Scan button
    document.getElementById('scan-btn').addEventListener('click', () => {
      openScanner();
    });

    // Memory continue
    document.getElementById('memory-continue').addEventListener('click', () => {
      onMemoryContinue();
    });

    // Credits → album
    document.getElementById('album-btn').addEventListener('click', () => {
      showAlbum();
    });

    // Credits → card (replay final scene without dialogue)
    document.getElementById('card-btn').addEventListener('click', () => {
      replayFinalScene();
    });

    // Album back
    document.getElementById('album-back').addEventListener('click', () => {
      showScreen('screen-credits');
    });

    // Restart — now on credits screen
    document.getElementById('restart-btn').addEventListener('click', () => {
      if (confirm('Start the adventure from the beginning?')) {
        State.reset();
        location.reload();
      }
    });

    // Credits button (from discovery card)
    document.getElementById('credits-btn').addEventListener('click', () => {
      showCredits();
    });
  }

  /* ══════════════════════════════════════════════════════
     OPENING SEQUENCE
  ══════════════════════════════════════════════════════ */

  function startOpening() {
    // Check if already completed → go straight to credits
    if (State.isComplete()) {
      Oceans.credits.start();
      Oceans.credits.progress = 5;
      showScreen('screen-credits');
      updateProgress();
      return;
    }

    // Fresh start or mid-adventure — start the opening ocean
    Oceans.opening.start();

    // Check if mid-adventure → resume
    const found = State.memoriesFound();
    if (found.length > 0) {
      // Show brief "welcome back" then go to hunt
      dialogueOpening.speak(
        ['Welcome back.', 'The adventure continues.'],
        {
          onComplete() { beginHunt(); },
          onLine(i) {
            setWhaleExpression(i === 0 ? 'curious' : 'wise');
          }
        }
      );
      return;
    }

    // Fresh start — full opening
    setWhaleExpression('neutral');

    dialogueOpening.speak(OPENING_LINES, {
      speedMs: 35,
      onComplete() {
        const btn = document.getElementById('begin-btn');
        btn.style.display = 'block';
        btn.style.animation = 'badge-appear 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards';
        setWhaleExpression('happy');
      },
      onLine(i, line) {
        const expr = OPENING_EXPRESSIONS[i] || 'neutral';
        setWhaleExpression(expr);
      }
    });
  }

  /* ══════════════════════════════════════════════════════
     HUNT SEQUENCE
  ══════════════════════════════════════════════════════ */

  function beginHunt() {
    Oceans.hunt.start();
    showScreen('screen-hunt');    updateProgress();
    presentCurrentMemory();
  }

  function presentCurrentMemory() {
    const nextIndex = State.nextMemoryIndex();

    if (nextIndex >= MEMORIES.length) {
      // All found — go to final
      startFinalReveal();
      return;
    }

    const memory = MEMORIES[nextIndex];

    // Update clue card
    const rarityEl = document.getElementById('clue-rarity');
    const titleEl  = document.getElementById('clue-title');
    const textEl   = document.getElementById('clue-text');
    const cardEl   = document.getElementById('clue-card');

    rarityEl.textContent     = memory.rarity.toUpperCase();
    rarityEl.dataset.rarity  = memory.rarity;
    titleEl.textContent      = memory.clueTitle;
    textEl.textContent       = memory.clueText;
    cardEl.dataset.rarity    = memory.rarity;

    // Restore hunt dialogue box for next clue
    const box = document.getElementById('hunt-dialogue-box');
    box.style.display = '';
    box.style.opacity = '1';

    // Whale speaks the hunt lines
    setTimeout(() => {
      dialogueHunt.speak(memory.whaleLines, {
        speedMs: 38,
        onLine(i) {
          if (i === 0) setWhaleExpression('wise');
          if (i === 1) setWhaleExpression('thoughtful');
          if (i >= 2)  setWhaleExpression('curious');
        }
      });
    }, 400);
  }

  /* ── SCANNER ─────────────────────────────────────────── */
  function openScanner() {
    const nextIndex = State.nextMemoryIndex();
    if (nextIndex >= MEMORIES.length) return;

    const memory = MEMORIES[nextIndex];

    if (!scanner) scanner = new ARScanner();

    scanner.open(memory.arucoId, (foundId) => {
      onMarkerFound(foundId);
    });
  }

  function onMarkerFound(markerId) {
    // Find which memory this marker belongs to
    const memory = MEMORIES.find(m => m.arucoId === markerId);
    if (!memory) return;

    const expectedIndex = State.nextMemoryIndex();
    const memoryIndex   = MEMORIES.indexOf(memory);

    // Enforce order
    if (memoryIndex !== expectedIndex) {
      showHuntMessage('The whale shakes their head. "Not yet. Follow the order."');
      return;
    }

    // Save state
    State.addMemory(memoryIndex);
    updateProgress();

    // Play unlock sound
    Audio.play('unlock', { volume: 0.7 });

    // Show found state on clue card immediately
    showMemoryFoundCard(memory, memoryIndex);

    // Reveal reaction dialogue then show memory card
    showScreen('screen-hunt');

    dialogueHunt.speak(memory.revealLines, {
      speedMs: 38,
      dismissEl: document.getElementById('hunt-dialogue-box'),
      onComplete() {
        showMemoryUnlock(memory);
      },
      onLine(i, line) {
        if (i === 0) setWhaleExpression('moved');
        if (i === 1) setWhaleExpression('happy');
        if (i >= 2)  setWhaleExpression('wise');
      }
    });
  }

  function showHuntMessage(msg) {
    dialogueHunt.speak([msg]);
  }

  /* ── SHOW MEMORY FOUND ON CLUE CARD ─────────────────── */
  function showMemoryFoundCard(memory, index) {
    const card   = document.getElementById('clue-card');
    const panel  = document.getElementById('memory-found-panel');

    // Hide clue content, show found panel
    document.getElementById('clue-rarity').style.display = 'none';
    document.getElementById('clue-title').style.display  = 'none';
    document.getElementById('clue-text').style.display   = 'none';
    document.getElementById('scan-btn').style.display    = 'none';

    // Fill found panel
    document.getElementById('mf-number').textContent = `Memory ${index + 1} of ${MEMORIES.length}`;
    document.getElementById('mf-icon').textContent   = memory.icon;
    document.getElementById('mf-name').textContent   = memory.theme;
    document.getElementById('mf-rarity').textContent = memory.rarity.toUpperCase();
    document.getElementById('mf-object').textContent = memory.object;

    const rarityEl = document.getElementById('mf-rarity');
    rarityEl.dataset.rarity = memory.rarity;
    card.dataset.rarity     = memory.rarity;

    panel.style.display = 'flex';
    panel.style.animation = 'badge-appear 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards';
  }

  /* ── RESET CLUE CARD for next memory ────────────────── */
  function resetClueCard() {
    document.getElementById('clue-rarity').style.display = '';
    document.getElementById('clue-title').style.display  = '';
    document.getElementById('clue-text').style.display   = '';
    document.getElementById('scan-btn').style.display    = '';
    document.getElementById('memory-found-panel').style.display = 'none';
  }
  function showMemoryUnlock(memory, fromAlbum = false) {
    const screen = document.getElementById('screen-memory');
    screen.dataset.rarity    = memory.rarity;
    screen.dataset.fromAlbum = fromAlbum ? 'true' : '';

    document.getElementById('badge-rarity').textContent      = memory.rarity.toUpperCase();
    document.getElementById('badge-icon').textContent        = memory.icon;
    document.getElementById('badge-name').textContent        = memory.name;
    document.getElementById('memory-description').textContent = memory.description;

    // Button text changes depending on context
    document.getElementById('memory-continue').textContent =
      fromAlbum ? '← Back to Album' : 'Continue';

    showScreen('screen-memory');
  }

  function onMemoryContinue() {
    const screen = document.getElementById('screen-memory');

    // If opened from album, go back to album
    if (screen.dataset.fromAlbum === 'true') {
      showAlbum();
      return;
    }
    const found = State.memoriesFound();
    const nextIndex = found.length;

    // Update world warmth
    document.body.dataset.progress = found.length;
    Oceans.setProgress(found.length);

    if (nextIndex >= MEMORIES.length) {
      // All memories found
      startFinalReveal();
    } else {
      // Back to hunt with next clue
      showScreen('screen-hunt');
      Oceans.hunt.start();
      updateProgress();
      resetClueCard();
      setTimeout(() => presentCurrentMemory(), 600);
    }
  }

  /* ── PROGRESS ORBS ───────────────────────────────────── */
  function updateProgress() {
    const found = State.memoriesFound();
    document.querySelectorAll('.orb').forEach((orb, i) => {
      if (i < found.length) {
        orb.classList.add('found');
        orb.dataset.rarity = MEMORIES[i].rarity;
      }
    });
  }

  /* ══════════════════════════════════════════════════════
     FINAL REVEAL
  ══════════════════════════════════════════════════════ */

  function startFinalReveal() {
    State.markComplete();
    Oceans.final.start();
    Oceans.final.progress = 5;
    showScreen('screen-final');

    // Restore dialogue box in case of replay
    const dialogueEl = document.getElementById('final-dialogue');
    dialogueEl.style.display = '';
    dialogueEl.style.opacity = '1';

    setWhaleExpression('neutral');

    // Swell into finale — fade ambient down, don't stop it
    Audio.stop('ambient', 3000);

    // Whale moves to center, then speaks
    setTimeout(() => {
      runFinalDialogue();
    }, 800);
  }

  function runFinalDialogue() {
    dialogueFinal.speak(FINAL_DIALOGUE, {
      speedMs: 40,
      pauseMs: 700,
      dismissEl: document.getElementById('final-dialogue'),
      onLine(i, line) {
        if (i < 4)            setWhaleExpression('wise');
        if (i === 4)          setWhaleExpression('thoughtful');
        if (i >= 5 && i < 9) setWhaleExpression('wise');
        if (i >= 9)           setWhaleExpression('moved');
        if (i === 12)         setWhaleExpression('happy');
      },
      onComplete() {
        // dismissEl already faded the dialogue — now do the reveal
        openTreasureChest();
        Audio.play('chest', { volume: 0.8 });

        setTimeout(() => {
          startConfetti();
          setTimeout(() => {
            showPhotoGallery(() => {
              setTimeout(() => showDiscoveryCard(), 800);
            });
          }, 1200);
        }, 800);
      }
    });
  }

  /* ── REPLAY FINAL SCENE (no dialogue) ───────────────── */
  function replayFinalScene() {
    // Reset final screen state
    const dialogueEl  = document.getElementById('final-dialogue');
    const discoveryEl = document.getElementById('discovery-card');
    const gallery     = document.getElementById('photo-gallery');
    const lid         = document.getElementById('chest-lid');
    const light       = document.getElementById('chest-light');
    const container   = document.getElementById('chest-container');

    dialogueEl.style.display  = 'none';
    discoveryEl.style.display = 'none';
    gallery.style.display     = 'none';
    lid.classList.remove('open');
    light.classList.remove('open');
    container.classList.remove('visible');

    // Stop old confetti
    if (confettiLoop) { cancelAnimationFrame(confettiLoop); confettiLoop = null; }

    Oceans.final.start();
    Oceans.final.progress = 5;
    showScreen('screen-final');
    setWhaleExpression('happy');

    // Chest → confetti → photos → discovery card
    setTimeout(() => {
      openTreasureChest();
      Audio.play('chest', { volume: 0.8 });
      setTimeout(() => {
        startConfetti();
        setTimeout(() => {
          showPhotoGallery(() => {
            setTimeout(() => showDiscoveryCard(), 800);
          });
        }, 1200);
      }, 800);
    }, 600);
  }

  function openTreasureChest() {
    const container = document.getElementById('chest-container');
    const lid   = document.getElementById('chest-lid');
    const light = document.getElementById('chest-light');

    container.classList.add('visible');
    setTimeout(() => {
      lid.classList.add('open');
      light.classList.add('open');
    }, 600);
  }

  /* ── PHOTO GALLERY ───────────────────────────────────── */
  function showPhotoGallery(onDone) {
    const gallery = document.getElementById('photo-gallery');
    const inner   = document.getElementById('gallery-inner');
    inner.innerHTML = '';

    if (PHOTOS.length === 0) {
      // Placeholders
      const placeholderEmojis = ['📸', '🌊', '✨', '❤️', '🐋'];
      placeholderEmojis.forEach((emoji, i) => {
        const frame = document.createElement('div');
        frame.className = 'photo-frame placeholder';
        frame.style.animationDelay = `${i * 0.15}s`;
        frame.textContent = emoji;
        inner.appendChild(frame);
      });
    } else {
      PHOTOS.forEach((src, i) => {
        const frame = document.createElement('div');
        frame.className = 'photo-frame';
        frame.style.animationDelay = `${i * 0.15}s`;
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'A treasured memory';
        frame.appendChild(img);
        inner.appendChild(frame);
      });
    }

    gallery.style.display = 'flex';

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      gallery.style.display = 'none';
      if (onDone) onDone();
    }, 4000);
  }

  /* ── DISCOVERY CARD ──────────────────────────────────── */
  function showDiscoveryCard() {
    const card = document.getElementById('discovery-card');
    card.style.display = 'flex';

    // Stop confetti gradually
    setTimeout(() => {
      if (confettiLoop) {
        cancelAnimationFrame(confettiLoop);
        confettiLoop = null;
      }
    }, 3000);
  }

  /* ── CREDITS ─────────────────────────────────────────── */
  function showCredits() {
    Oceans.credits.start();
    Oceans.credits.progress = 5;
    showScreen('screen-credits');
  }

  /* ── ALBUM ───────────────────────────────────────────── */
  function showAlbum() {
    const grid = document.getElementById('album-grid');
    grid.innerHTML = '';

    // Mom's special card — always at the top
    const momCard = document.createElement('div');
    momCard.className = 'album-card album-card-mom';
    momCard.innerHTML = `
      <div class="album-card-icon">❤️</div>
      <div class="album-card-rarity" style="color:var(--mythical)">ONE OF A KIND</div>
      <div class="album-card-name">Mom</div>
      <div class="album-card-quote">After crossing oceans... the whale discovered the rarest thing in the world. Someone who fills every adventure with love.</div>
    `;
    momCard.addEventListener('click', () => {
      // Show the same memory unlock style card as the other memories
      const screen = document.getElementById('screen-memory');
      screen.dataset.rarity    = 'mythical';
      screen.dataset.fromAlbum = 'true';
      document.getElementById('badge-rarity').textContent      = 'ONE OF A KIND';
      document.getElementById('badge-icon').textContent        = '❤️';
      document.getElementById('badge-name').textContent        = 'Mom';
      document.getElementById('memory-description').textContent =
        'After crossing oceans... the whale discovered the rarest thing in the world. Someone who fills every adventure with love. Someone who makes ordinary moments special. Someone who turned a house into a home.';
      document.getElementById('memory-continue').textContent   = '← Back to Album';
      showScreen('screen-memory');
    });
    grid.appendChild(momCard);

    // The five memories
    MEMORIES.forEach((memory, i) => {
      const found = State.memoriesFound().includes(i);
      const card  = document.createElement('div');
      card.className = 'album-card';

      card.innerHTML = `
        <div class="album-card-icon">${found ? memory.icon : '❓'}</div>
        <div class="album-card-rarity" style="color:var(--${memory.rarity})">${memory.rarity.toUpperCase()}</div>
        <div class="album-card-name">${found ? memory.name : '???'}</div>
        ${found ? `<div class="album-card-quote">${memory.description}</div>` : ''}
      `;

      if (found) {
        card.addEventListener('click', () => {
          showMemoryUnlock(memory, true);
        });
      }

      grid.appendChild(card);
    });

    showScreen('screen-album');
  }

  /* ══════════════════════════════════════════════════════
     CONFETTI
  ══════════════════════════════════════════════════════ */

  function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx    = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    // Warm ocean-themed colors
    const colors = ['#f0c040', '#60c8e8', '#e8a020', '#a8d8f0', '#e85080', '#c8e6f5', '#ffe680'];

    confettiParticles = Array.from({ length: 120 }, () => ({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height - canvas.height,
      r:    4 + Math.random() * 5,
      d:    2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltSpeed: 0.05 + Math.random() * 0.05,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiParticles.forEach(p => {
        p.tiltAngle += p.tiltSpeed;
        p.y += p.d;
        p.tilt = Math.sin(p.tiltAngle) * 12;

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });
      confettiLoop = requestAnimationFrame(draw);
    }

    draw();
  }

  /* ── PUBLIC API ──────────────────────────────────────── */
  return { init, showScreen };
})();

/* ─── Bootstrap ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Story.init();
});
