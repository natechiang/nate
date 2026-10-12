/* ═══════════════════════════════════════════════════════════
   THE WHALE MUSEUM — For Katy
   A museum of places she has been and things she has gathered.
   Curated with love by Nate, Lucas, and Dad.
   The whale is just the tour guide.
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── PHOTO PATH ────────────────────────────────────────── */
/* Relative path from WhaleMuseum/ to the photos folder     */
const PHOTO_BASE = '../assets/photos/';

/* ─── CORE EXHIBITS ─────────────────────────────────────── */
/* Each one is a real place, a real moment, a real memory.  */

const EXHIBITS = [
  {
    id: 'taiwan',
    number: 1,
    name: 'The Island at the Edge of the Pacific',
    icon: '🏯',
    rarity: 'legendary',
    photo: 'FF00ABAC-C8D1-49B2-970E-E9339B742895.JPEG',
    photoCaption: 'Taiwan',
    description:
      'An island of temples, night markets, and mountain mist. ' +
      'The kind of place that quietly rearranges something inside you.',
    tagline: 'Where the mountains meet the sea.',
    story: [
      'I have circled this island many times.',
      'The water here is warm.',
      'And the people are even warmer.',
      'This is where some of the best things in this family began.',
    ],
  },
  {
    id: 'redwoods',
    number: 2,
    name: 'The Trees That Were Here Before Everything',
    icon: '🌲',
    rarity: 'epic',
    photo: 'IMG_0424.jpeg',
    photoCaption: 'The Redwoods, California',
    description:
      'The coastal redwoods. Some of them were standing before anyone was keeping records. ' +
      'They make everything else feel appropriately small.',
    tagline: 'Very old. Very tall. Deeply unbothered.',
    story: [
      'I have no memory of a time before these trees.',
      'That is saying something.',
      'A family that stands in a redwood forest together has good taste.',
    ],
  },
  {
    id: 'alaska-kenai',
    number: 3,
    name: 'The Peninsula at the End of the Map',
    icon: '🦅',
    rarity: 'rare',
    photo: 'IMG_2587.jpeg',
    photoCaption: 'Kenai Peninsula, Alaska',
    description:
      'The Kenai Peninsula, where the rivers run cold and clear and the eagles are not impressed by anyone. ' +
      'The kind of wild that makes you feel both very small and very alive.',
    tagline: 'The eagles were watching. They always are.',
    story: [
      'I have swum off this peninsula.',
      'The water is very cold.',
      'I did not mention this to anyone at the time.',
      'Katy seemed unbothered.',
      'Katy is usually unbothered.',
    ],
  },
  {
    id: 'alaska-glacier',
    number: 4,
    name: 'A Glacier, Standing Very Still',
    icon: '🧊',
    rarity: 'epic',
    photo: 'IMG_2887.jpeg',
    photoCaption: 'Glacier, Alaska',
    description:
      'A glacier moves about a foot per day. It has been moving for ten thousand years. ' +
      'In that time, it has not been in a hurry, and it has been very impressive.',
    tagline: 'Moving slowly toward something wonderful.',
    story: [
      'I have seen many glaciers.',
      'This family stood on one.',
      'Most things cannot say that.',
    ],
  },
  {
    id: 'mom-glacier',
    number: 5,
    name: 'Katy, On a Glacier',
    icon: '✨',
    rarity: 'mythical',
    photo: 'IMG_3031.jpeg',
    photoCaption: 'Katy on a glacier, Alaska',
    description:
      'A photograph of remarkable things: ancient ice, Alaskan sky, and a person ' +
      'who said yes to the adventure. This is a good combination.',
    tagline: 'Some exhibits are more precious than others.',
    story: [
      'I have been alive for a very long time.',
      'I have seen a great many things.',
      'But I always notice when someone stands somewhere extraordinary.',
      'And looks completely at home.',
      'Happy birthday, Katy.',
    ],
  },
  {
    id: 'wendell-idaho',
    number: 6,
    name: 'The Place in Idaho Called Wendell',
    icon: '🌾',
    rarity: 'common',
    photo: 'IMG_4871.jpeg',
    photoCaption: 'Wendell, Idaho',
    description:
      'Wendell, Idaho. Population: quiet. The kind of town the highway passes through ' +
      'and most people keep driving. The ones who stop find something good.',
    tagline: 'Most people kept driving. This family stopped.',
    story: [
      'I cannot reach Wendell.',
      'It is landlocked.',
      'I have been told it is worth the trip.',
      'I believe it.',
    ],
  },
  {
    id: 'city-of-rocks',
    number: 7,
    name: 'The City That Was Made of Rocks',
    icon: '🪨',
    rarity: 'rare',
    photo: 'IMG_5063.jpeg',
    photoCaption: 'City of Rocks, Idaho',
    description:
      'City of Rocks, Idaho. Ancient granite spires rising from the sagebrush. ' +
      'Climbers come from everywhere. The rocks were not expecting them. ' +
      'The rocks were not expecting anyone. The rocks have been there for 2.5 billion years.',
    tagline: 'The rocks are not worried about anything.',
    story: [
      'I cannot explain rocks.',
      'But I respect them.',
      'They stay where they are.',
      'And the world arranges itself around them.',
      'There is a lesson there.',
    ],
  },
  {
    id: 'thames',
    number: 8,
    name: 'The Thames, On a Grey Morning',
    icon: '🌉',
    rarity: 'rare',
    photo: 'IMG_7356.jpeg',
    photoCaption: 'The River Thames, London',
    description:
      `The Thames has been London's river for two thousand years. ` +
      `It has seen kings and fires and fog and bridges and an extraordinary number of pigeons.`,
    tagline: `London always has a little fog. It suits the city.`,
    story: [
      'I have never been to London.',
      'The Thames is technically connected to the ocean.',
      'But I have been told the British are particular about these things.',
      'This family found their way to the river.',
      'The river was pleased.',
    ],
  },
  {
    id: 'cam',
    number: 9,
    name: 'The River Cam at Cambridge',
    icon: '🚣',
    rarity: 'epic',
    photo: 'IMG_7519.jpeg',
    photoCaption: 'River Cam, Cambridge',
    description:
      'Punting on the Cam. Willow trees leaning over the water. ' +
      'Eight hundred years of scholars arguing politely nearby. ' +
      'The kind of afternoon that makes time feel optional.',
    tagline: 'The water here has heard a great many lectures.',
    story: [
      'A river that runs through a university.',
      'It has heard more ideas than most oceans.',
      'I say this as an ocean.',
      'It is a very good river.',
    ],
  },
  {
    id: 'seine',
    number: 10,
    name: 'The Seine, Which Goes Through Paris',
    icon: '🗼',
    rarity: 'legendary',
    photo: 'IMG_7678.jpeg',
    photoCaption: 'River Seine, Paris',
    description:
      'The Seine. Paris on both banks. The light here is different — painters noticed it first, ' +
      'but everyone notices eventually. This is a place where families remember they are lucky.',
    tagline: 'Paris has a way of making ordinary moments feel important.',
    story: [
      'The Seine flows into the Atlantic.',
      'The Atlantic flows everywhere.',
      'Which means, technically, I have been to Paris.',
      'I choose to believe this.',
      'A family by the Seine on a birthday.',
      'The river approves.',
    ],
  },
];

/* ─── GENERATOR DATA ────────────────────────────────────── */
/* Extra whimsical exhibits for the "Discover Another" button */

const G_ADJ  = [
  'Extremely Patient', 'Quietly Famous', 'Officially Misplaced',
  'Gently Historic', 'Somewhat Legendary', 'Politely Mysterious',
  'Aggressively Cozy', 'Unexpectedly Important', 'Moderately Enchanted',
  'Practically Ancient', 'Briefly Illuminated', 'Pleasantly Waterlogged',
];

const G_NOUN = [
  ['Teacup', '🫖'], ['Map', '🗺️'], ['Compass', '🧭'], ['Lantern', '🏮'],
  ['Key', '🗝️'], ['Hat', '🎩'], ['Pebble', '🪨'], ['Feather', '🪶'],
  ['Clock', '🕰️'], ['Bottle', '🍾'], ['Candle', '🕯️'], ['Umbrella', '☂️'],
  ['Thimble', '🪡'], ['Ribbon', '🎀'], ['Coin', '🪙'], ['Notebook', '📔'],
  ['Telescope', '🔭'], ['Sock', '🧦'], ['Button', '🔵'],
];

const G_CTX = [
  'from a River in France', 'Left on a Glacier', 'Found Near the Redwoods',
  'from a Night Market in Taiwan', 'Belonging to a Very Polite Storm',
  'from Somewhere in Idaho', 'That Apologizes When Touched',
  'That Only Works on Rainy Afternoons', 'With Strong Opinions About Bridges',
  'Left Behind by a Favorable Current', 'That Smells Like Old Books',
  'from a Market by the Thames', 'That Thinks Paris Was a Good Idea',
  'That Has Been to More Places Than It Can Count',
  'Belonging to Someone Who Said Yes to the Adventure',
];

const G_RARITY = [
  { label: 'common', w: 38 }, { label: 'rare', w: 30 },
  { label: 'epic', w: 20 },   { label: 'legendary', w: 9 }, { label: 'mythical', w: 3 },
];

const G_STORIES = [
  ['It arrived without a note.', 'The best things often do.'],
  ['I found this near a river.', 'Rivers collect the most interesting things.', 'After oceans, of course.'],
  ['Someone left it on a reef.', 'I waited for them to return.', 'They sent a postcard instead.'],
  ['A very small fish brought this to me.', 'I still don\'t know why.', 'The fish doesn\'t remember either.'],
  ['I have carried this for three hundred years.', 'I still don\'t know what it does.', 'This is fine.'],
  ['It makes a sound at dawn.', 'I have never told anyone what the sound is.', 'It is very pleasant.'],
  ['This belongs to the ocean, really.', 'Most things do.', 'I keep it in trust.'],
  ['I found this between one journey and the next.', 'That is often when the best things appear.'],
  ['A passing current brought this my way.', 'I didn\'t ask where it had been.', 'It looked tired.'],
  ['It came from a family that travels well.', 'You can tell.', 'Things pick up something from good people.'],
];

const G_TAGLINES = [
  'Handle with appropriate wonder.',
  'From somewhere worth remembering.',
  'Origin: excellent.',
  'Still a little damp.',
  'The ocean recommends it.',
  'One of a kind, approximately.',
  'Best observed quietly.',
  'Technically harmless.',
  'Previously loved.',
  'Has been to more places than it looks.',
  'Arrives without instructions. Stays anyway.',
  'From a family that knows how to go places.',
];

const G_DESCS = [
  (a,n,c) => `A ${a.toLowerCase()} ${n.toLowerCase()} ${c.toLowerCase()}. There is more to it than it appears.`,
  (a,n,c) => `The ${n.toLowerCase()} ${c.toLowerCase()} — considered ${a.toLowerCase()} by those who know about these things.`,
  (a,n,c) => `A ${n.toLowerCase()} of ${a.toLowerCase()} character, acquired ${c.toLowerCase()}.`,
];

function weightedPick(arr) {
  const total = arr.reduce((s, x) => s + x.w, 0);
  let r = Math.random() * total;
  for (const x of arr) { r -= x.w; if (r <= 0) return x.label; }
  return arr[arr.length-1].label;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

let genCount = 0;

function generateExhibit() {
  genCount++;
  const adj  = pick(G_ADJ);
  const [noun, icon] = pick(G_NOUN);
  const ctx  = pick(G_CTX);
  const rarity = weightedPick(G_RARITY);
  const desc = pick(G_DESCS)(adj, noun, ctx);
  return {
    id: `gen-${genCount}`,
    number: `G${genCount}`,
    name: `The ${adj} ${noun} ${ctx}`,
    icon,
    rarity,
    description: desc.charAt(0).toUpperCase() + desc.slice(1),
    tagline: pick(G_TAGLINES),
    story: pick(G_STORIES),
    generated: true,
  };
}

/* ─── STATE ─────────────────────────────────────────────── */

const state = {
  seen: new Set(),
  exhibits: [...EXHIBITS],
  endingTriggered: false,
  pendingEnding: false,
};

/* ─── OCEAN CANVAS ──────────────────────────────────────── */

function initOcean(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;

  const waves = [
    { spd: 0.00045, amp: 32, y: 0.70, a: 0.10 },
    { spd: 0.00065, amp: 20, y: 0.76, a: 0.08 },
    { spd: 0.00090, amp: 13, y: 0.82, a: 0.06 },
    { spd: 0.00120, amp:  8, y: 0.87, a: 0.04 },
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function draw() {
    t++;
    ctx.clearRect(0, 0, W, H);

    // Sky-to-deep gradient
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0,    '#04090f');
    g.addColorStop(0.45, '#06111f');
    g.addColorStop(0.75, '#091a30');
    g.addColorStop(1,    '#0e2440');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Stars (tiny)
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    const seed = 42;
    for (let i = 0; i < 60; i++) {
      const sx = ((seed * (i * 37 + 11)) % W + W) % W;
      const sy = ((seed * (i * 53 + 7))  % (H * 0.55) + H * 0.55) % (H * 0.55);
      const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.008 + i));
      ctx.globalAlpha = twinkle * 0.6;
      ctx.fillRect(sx, sy, 1.2, 1.2);
    }
    ctx.globalAlpha = 1;

    // Wave layers
    waves.forEach(wave => {
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 3) {
        const y = wave.y * H
          + Math.sin(x * 0.007 + t * wave.spd * 300) * wave.amp
          + Math.sin(x * 0.011 - t * wave.spd * 200) * wave.amp * 0.55;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = `rgba(98,207,255,${wave.a})`;
      ctx.fill();
    });

    // Surface shimmer
    const surf = ctx.createLinearGradient(0, H * 0.67, 0, H * 0.83);
    surf.addColorStop(0, 'rgba(98,207,255,0.06)');
    surf.addColorStop(1, 'rgba(98,207,255,0)');
    ctx.fillStyle = surf;
    ctx.fillRect(0, H * 0.67, W, H * 0.33);
  }

  resize();
  window.addEventListener('resize', resize);
  (function loop() { draw(); requestAnimationFrame(loop); })();
}

/* ─── PARTICLES ─────────────────────────────────────────── */

function spawnParticles(id, count = 20) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size  = 1.5 + Math.random() * 4.5;
    const dur   = 12 + Math.random() * 14;
    const delay = Math.random() * 14;
    const left  = Math.random() * 100;
    const hue   = 190 + Math.random() * 30;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${left}%;
      background:hsla(${hue},80%,70%,0.3);
      animation-duration:${dur}s;
      animation-delay:${delay}s;
    `;
    el.appendChild(p);
  }
}

/* ─── THANK-YOU STARS ───────────────────────────────────── */

function spawnTyStars() {
  const el = document.getElementById('ty-stars');
  if (!el) return;
  el.innerHTML = '';
  const symbols = ['✦','✧','⭐','✨','★','·'];
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('div');
    s.className = 'ty-star';
    s.textContent = pick(symbols);
    const left = 10 + Math.random() * 80;
    const top  = 20 + Math.random() * 70;
    const dur  = 3 + Math.random() * 4;
    const delay = Math.random() * 4;
    s.style.cssText = `left:${left}%;top:${top}%;animation-duration:${dur}s;animation-delay:${delay}s;`;
    el.appendChild(s);
  }
}

/* ─── WHALE EXPRESSIONS ─────────────────────────────────── */

const WHALE_IMGS = {
  neutral:    '../assets/whale/whale_nuetral.png',
  curious:    '../assets/whale/whale_curious.png',
  happy:      '../assets/whale/whale_happy.png',
  wise:       '../assets/whale/whale_wise.png',
  moved:      '../assets/whale/whale_moved.png',
  thoughtful: '../assets/whale/whale_thoughtful.png',
};

function setWhaleExpression(imgId, expression) {
  const front = document.getElementById(imgId);
  const back  = document.getElementById('whale-img-back');
  if (!front) return;
  const src = WHALE_IMGS[expression] || WHALE_IMGS.neutral;
  if (front.src.endsWith(src.split('/').pop())) return; // already showing

  // Load new image on front layer, fade it in, then snap back layer and hide front
  front.src = src;
  front.style.transition = 'none';
  front.style.opacity = '0';

  front.onload = () => {
    // Fade front in
    requestAnimationFrame(() => {
      front.style.transition = 'opacity 0.45s ease';
      front.style.opacity = '1';
      // After fade, update back layer and hide front instantly
      setTimeout(() => {
        if (back) back.src = src;
        front.style.transition = 'none';
        front.style.opacity = '0';
      }, 480);
    });
  };
}



class Typewriter {
  constructor(textEl, nextBtn) {
    this.el   = textEl;
    this.btn  = nextBtn;
    this.q    = [];
    this.i    = 0;
    this._t   = null;
    this._done = null;
    this._onLine = null;
    this._spd = 36;

    if (this.btn) this.btn.addEventListener('click', () => this._advance());
  }

  speak(lines, { onComplete, onLine, speed = 36 } = {}) {
    this.q = lines; this.i = 0;
    this._done = onComplete || null;
    this._onLine = onLine || null;
    this._spd = speed;
    this._type(0);
  }

  _type(idx) {
    if (idx >= this.q.length) { this._finish(); return; }
    const line = this.q[idx];
    this.i = idx;
    if (this._onLine) this._onLine(idx, line);

    if (line === '—') {
      this.el.textContent = '';
      if (this.btn) this.btn.style.display = 'none';
      this._t = setTimeout(() => this._type(idx + 1), 950);
      return;
    }

    this.el.textContent = '';
    this.el.classList.add('typing');
    if (this.btn) this.btn.style.display = 'none';

    let c = 0;
    const isLast = idx === this.q.length - 1;

    const tick = () => {
      if (c < line.length) {
        this.el.textContent += line[c++];
        this._t = setTimeout(tick, this._spd);
      } else {
        this.el.classList.remove('typing');
        if (isLast) {
          this._t = setTimeout(() => this._finish(), 2200);
        } else {
          if (this.btn) this.btn.style.display = 'flex';
        }
      }
    };
    this._t = setTimeout(tick, 90);
  }

  _advance() {
    clearTimeout(this._t);
    const line = this.q[this.i];
    if (this.el.textContent.length < line.length) {
      this.el.textContent = line;
      this.el.classList.remove('typing');
      if (this.i === this.q.length - 1) {
        this._t = setTimeout(() => this._finish(), 1800);
      } else {
        if (this.btn) this.btn.style.display = 'flex';
      }
    } else {
      this._type(this.i + 1);
    }
  }

  _finish() {
    if (this.btn) this.btn.style.display = 'none';
    if (this._done) this._done();
  }

  clear() {
    clearTimeout(this._t);
    this.el.textContent = '';
    this.el.classList.remove('typing');
    if (this.btn) this.btn.style.display = 'none';
  }
}

/* ─── SCREEN TRANSITIONS ────────────────────────────────── */

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.toggle('active', s.id === id);
    s.classList.remove('fade-out');
  });
}

function crossFade(fromId, toId, delay = 0) {
  setTimeout(() => {
    const from = document.getElementById(fromId);
    const to   = document.getElementById(toId);
    // First start fading out (keep active so opacity transition fires)
    if (from) from.style.opacity = '0';
    setTimeout(() => {
      if (from) {
        from.classList.remove('active');
        from.style.opacity = '';
      }
      if (to) {
        to.classList.remove('fade-out');
        to.classList.add('active');
      }
    }, 700);
  }, delay);
}

/* ─── OCEAN AUDIO ───────────────────────────────────────── */

let audioCtx = null;

function startAudio() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const master = audioCtx.createGain();
    master.gain.value = 0;
    master.connect(audioCtx.destination);
    master.gain.linearRampToValueAtTime(0.11, audioCtx.currentTime + 5);

    function tone(freq, detune, amp, filterHz) {
      const osc = audioCtx.createOscillator();
      const g   = audioCtx.createGain();
      const f   = audioCtx.createBiquadFilter();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      osc.detune.value = detune;
      f.type = 'lowpass'; f.frequency.value = filterHz; f.Q.value = 0.4;
      g.gain.value = amp;
      osc.connect(f); f.connect(g); g.connect(master);
      const lfo = audioCtx.createOscillator();
      const lg  = audioCtx.createGain();
      lfo.frequency.value = 0.06 + Math.random() * 0.05;
      lg.gain.value = amp * 0.45;
      lfo.connect(lg); lg.connect(g.gain);
      osc.start(); lfo.start();
    }

    tone(55,  0,   0.14, 170);
    tone(82,  6,   0.08, 130);
    tone(110, -9,  0.05, 95);
    tone(41,  14,  0.11, 210);

    // Pink noise
    const rate = audioCtx.sampleRate;
    const buf  = audioCtx.createBuffer(1, rate * 4, rate);
    const d    = buf.getChannelData(0);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1;
      b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
      b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
      b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
      d[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)/6; b6=w*0.115926;
    }
    const ns = audioCtx.createBufferSource();
    ns.buffer = buf; ns.loop = true;
    const nf = audioCtx.createBiquadFilter();
    nf.type = 'lowpass'; nf.frequency.value = 280;
    const ng = audioCtx.createGain(); ng.gain.value = 0.035;
    ns.connect(nf); nf.connect(ng); ng.connect(master);
    ns.start();
  } catch(e) { /* audio optional */ }
}

/* ─── GALLERY ───────────────────────────────────────────── */

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';

  state.exhibits.forEach((ex, i) => {
    const card = document.createElement('div');
    card.className = 'exhibit-card' + (state.seen.has(ex.id) ? ' seen' : '') + (ex.generated ? ' generated' : '');
    card.dataset.r = ex.rarity;
    card.style.animationDelay = `${i * 0.055}s`;

    // Build thumbnail if there's a photo
    const thumbHTML = ex.photo ? `
      <div class="card-thumb">
        <img src="${PHOTO_BASE}${ex.photo}" alt="${ex.photoCaption || ex.name}" loading="lazy" />
      </div>` : '';

    card.innerHTML = `
      <div class="card-rarity" data-r="${ex.rarity}">${ex.rarity.toUpperCase()}</div>
      <div class="card-icon">${ex.icon}</div>
      ${thumbHTML}
      <div class="card-name">${ex.name}</div>
      <div class="card-tagline">${ex.tagline}</div>
      <div class="card-visited" title="Visited"></div>
    `;

    card.addEventListener('click', () => openExhibit(ex));
    grid.appendChild(card);
  });

  updateCounter();
}

function updateCounter() {
  const coreCount = EXHIBITS.length;
  const seenCore  = EXHIBITS.filter(e => state.seen.has(e.id)).length;
  const el = document.getElementById('seen-counter');
  if (seenCore === coreCount) {
    el.textContent = 'All exhibits visited ✦';
    el.style.color = 'var(--legendary)';
  } else {
    el.textContent = `${seenCore} of ${coreCount} exhibits visited`;
    el.style.color = '';
  }
}

/* ─── EXHIBIT DETAIL ────────────────────────────────────── */

function openExhibit(ex) {
  state.seen.add(ex.id);

  const caseEl = document.getElementById('exhibit-case');
  caseEl.dataset.r = ex.rarity;

  document.getElementById('exhibit-number').textContent =
    ex.generated ? `Generated Exhibit #${ex.number}` : `Exhibit #${ex.number}`;
  document.getElementById('exhibit-icon').textContent        = ex.icon;
  document.getElementById('exhibit-name').textContent        = ex.name;
  document.getElementById('exhibit-description').textContent = ex.description;
  document.getElementById('exhibit-rarity').textContent      = ex.rarity.toUpperCase();

  // Photo
  const frame   = document.getElementById('case-photo-frame');
  const photoEl = document.getElementById('case-photo');
  const capEl   = document.getElementById('photo-caption');
  if (ex.photo) {
    photoEl.src = PHOTO_BASE + ex.photo;
    photoEl.alt = ex.photoCaption || ex.name;
    capEl.textContent = ex.photoCaption || '';
    frame.classList.add('visible');
  } else {
    frame.classList.remove('visible');
    photoEl.src = '';
  }

  // Story
  document.getElementById('exhibit-story').innerHTML =
    ex.story.map(l => `<p>${l}</p>`).join('');

  crossFade('screen-gallery', 'screen-exhibit');

  // Check if all core exhibits have been seen
  if (!state.endingTriggered && EXHIBITS.every(e => state.seen.has(e.id))) {
    state.endingTriggered = true;
    state.pendingEnding   = true;
  }
}

/* ─── OPENING ───────────────────────────────────────────── */

function startOpening() {
  showScreen('screen-opening');
  spawnParticles('particles-opening', 22);
  initOcean('canvas-opening');

  const tw = new Typewriter(
    document.getElementById('text-opening'),
    document.getElementById('next-opening')
  );

  tw.speak([
    'Welcome.',
    '—',
    'I\'ve collected many things during my travels.',
    '—',
    'Most of them are completely useless.',
    '—',
    'But some of them are places.',
    '—',
    'And some of them are people.',
    '—',
    'Today the museum is open for Katy.',
    '—',
    'Would you like to see?',
  ], {
    speed: 38,
    onLine: (i) => {
      if (i === 0)  setWhaleExpression('whale-img-front', 'neutral');
      if (i === 2)  setWhaleExpression('whale-img-front', 'curious');
      if (i === 4)  setWhaleExpression('whale-img-front', 'thoughtful');
      if (i === 8)  setWhaleExpression('whale-img-front', 'wise');
      if (i === 10) setWhaleExpression('whale-img-front', 'happy');
      if (i === 12) setWhaleExpression('whale-img-front', 'curious');
    },
    onComplete: () => {
      setTimeout(() => {
        crossFade('screen-opening', 'screen-gallery');
        spawnParticles('particles-gallery', 24);
        initOcean('canvas-gallery');
        renderGallery();
      }, 350);
    },
  });

  // Whale spout
  fireSpout();
}

function fireSpout() {
  const spout = document.getElementById('spout-opening');
  if (!spout) return;
  const go = () => {
    spout.classList.remove('active');
    void spout.offsetWidth;
    spout.classList.add('active');
    setTimeout(go, 5500 + Math.random() * 7000);
  };
  setTimeout(go, 2800);
}

/* ─── ENDING ────────────────────────────────────────────── */

function triggerEnding() {
  crossFade('screen-gallery', 'screen-ending');
  spawnParticles('particles-ending', 30);
  initOcean('canvas-ending');

  const tw = new Typewriter(
    document.getElementById('text-ending'),
    document.getElementById('next-ending')
  );

  tw.speak([
    'I\'ve crossed many oceans.',
    '—',
    'I\'ve seen glaciers and rivers and forests.',
    '—',
    'I\'ve watched families stand at the edge of the world.',
    '—',
    'And look out at it.',
    '—',
    'Without fear.',
    '—',
    'My favorite thing in this museum…',
    '—',
    '…is not any of the exhibits.',
    '—',
    'It\'s that this family keeps going places.',
    '—',
    'Together.',
    '—',
    'Happy birthday, Katy.',
  ], {
    speed: 40,
    onComplete: () => {
      const dlg = document.getElementById('ending-dialogue');
      dlg.style.opacity = '0';
      dlg.style.pointerEvents = 'none';
      spawnTyStars();
      const card = document.getElementById('thankyou-card');
      setTimeout(() => card.classList.add('visible'), 900);
    },
  });
}

/* ─── INIT ──────────────────────────────────────────────── */

function init() {
  initOcean('canvas-loading');

  // Audio on first interaction
  document.addEventListener('click',      startAudio, { once: true });
  document.addEventListener('touchstart', startAudio, { once: true });

  setTimeout(() => {
    crossFade('screen-loading', 'screen-opening');
    setTimeout(startOpening, 500);
  }, 1900);

  // Back button
  document.getElementById('btn-back').addEventListener('click', () => {
    crossFade('screen-exhibit', 'screen-gallery');
    spawnParticles('particles-gallery', 24);
    renderGallery();

    if (state.pendingEnding) {
      state.pendingEnding = false;
      setTimeout(triggerEnding, 2000);
    }
  });

  // Generate button
  document.getElementById('btn-generate').addEventListener('click', () => {
    const ex = generateExhibit();
    state.exhibits.push(ex);
    renderGallery();

    // Scroll new card into view
    const footer = document.querySelector('.gallery-footer');
    if (footer) setTimeout(() => footer.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  });

  // Visit again
  document.getElementById('btn-visit-again').addEventListener('click', () => {
    state.seen.clear();
    state.exhibits = [...EXHIBITS];
    state.endingTriggered = false;
    state.pendingEnding   = false;
    genCount = 0;

    const card = document.getElementById('thankyou-card');
    card.classList.remove('visible');
    const dlg = document.getElementById('ending-dialogue');
    dlg.style.opacity = '';
    dlg.style.pointerEvents = '';

    crossFade('screen-ending', 'screen-opening');
    setTimeout(startOpening, 500);
  });
}

document.addEventListener('DOMContentLoaded', init);
