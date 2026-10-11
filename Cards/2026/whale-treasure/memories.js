/* ═══════════════════════════════════════════════════════════
   MEMORIES — The five treasures and their story data.
   Each memory has:
     - arucoId:    which ArUco marker ID triggers it (0–4)
     - code:       2-digit fallback code printed on the marker
     - rarity:     common / rare / epic / legendary / mythical
     - theme:      the emotional core
     - name:       memory name shown on badge
     - object:     real-world object the marker is attached to
     - icon:       badge emoji
     - clueTitle:  shown on hunt screen before scanning
     - clueText:   the hint/riddle pointing to the object
     - whaleLines: dialogue spoken BEFORE scanning (whale sets up the hunt)
     - revealLines:dialogue spoken AFTER scanning (whale reacts to finding it)
     - description: shown on the memory unlock card
═══════════════════════════════════════════════════════════ */

const MEMORIES = [
  {
    arucoId: 0,
    code: 47,
    rarity: 'common',
    theme: 'Curiosity',
    name: 'The First Question',
    object: 'Globe',
    icon: '🌍',
    clueTitle: 'Memory One',
    clueText: 'Find something that holds the whole world in one place. Something you can spin.',
    whaleLines: [
      'Every adventure begins with a question.',
      'Find something that shows how big the world really is.',
    ],
    revealLines: [
      'Yes.',
      'Every explorer I have ever known started here.',
      'Standing in one place, dreaming of everywhere else.',
    ],
    description: 'The memory of a world full of places still to discover. Curiosity is the first compass.'
  },
  {
    arucoId: 1,
    code: 83,
    rarity: 'rare',
    theme: 'Courage',
    name: 'The Deep Water',
    object: 'Swim Award',
    icon: '🏅',
    clueTitle: 'Memory Two',
    clueText: 'Find the place where someone kept proof that they were brave enough to try. Even when it was hard.',
    whaleLines: [
      'The ocean is always biggest before we enter it.',
      'Courage is beginning anyway.',
      'Find the place where that kind of bravery is remembered.',
    ],
    revealLines: [
      'I know this feeling.',
      'Standing at the edge of something enormous.',
      'And jumping in anyway.',
      'That is rare.',
    ],
    description: 'The memory of getting in the water when the water felt too big. That is where courage lives.'
  },
  {
    arucoId: 2,
    code: 61,
    rarity: 'epic',
    theme: 'Adventure',
    name: 'The Long Crossing',
    object: 'Souvenir Shelf',
    icon: '🌊',
    clueTitle: 'Memory Three',
    clueText: 'Find the little corner of the house where faraway places came home. Near the stairs.',
    whaleLines: [
      'I once crossed an entire ocean searching for treasure.',
      'The journey became more important than the treasure.',
      'This home has its own collection of journeys.',
      'Find where they are kept.',
    ],
    revealLines: [
      'Ah.',
      'Every one of these traveled to get here.',
      'Each one is a story.',
      'This family knows how to explore.',
    ],
    description: 'The memory of places visited and things carried home. Every souvenir is a journey that happened.'
  },
  {
    arucoId: 3,
    code: 29,
    rarity: 'legendary',
    theme: 'Love',
    name: 'The Quiet Treasure',
    object: 'LEGO & One Piece Collection',
    icon: '✨',
    clueTitle: 'Memory Four',
    clueText: 'Find something that belongs to someone who builds worlds for fun. Brick by brick. Piece by piece.',
    whaleLines: [
      'I once met someone who created things just for the joy of it.',
      'Not for anyone else.',
      'Just because building something beautiful matters.',
      'Some treasures do not know how rare they are.',
      'Find what they have built.',
    ],
    revealLines: [
      'There.',
      'Do you see it now?',
      'Someone who makes things.',
      'Someone who loves deeply.',
      'The treasure was never far away.',
    ],
    description: 'The memory of someone who builds worlds — in LEGO, in stories, in life. That kind of love is legendary.'
  },
  {
    arucoId: 4,
    code: 75,
    rarity: 'mythical',
    theme: 'Family',
    name: 'The Rarest Thing',
    object: 'Memory Shelf',
    icon: '🏠',
    clueTitle: 'Memory Five',
    clueText: 'Find the shelf under the TV. The one that holds what this family decided was worth keeping.',
    whaleLines: [
      'After crossing countless oceans...',
      'I finally know what I was searching for.',
      'Not gold.',
      'Not rare things.',
      'Something far harder to find.',
      'Look under the TV.',
    ],
    revealLines: [
      'Yes.',
      'I knew it was here.',
      'A home that remembers.',
      'I have been searching for this my whole life.',
    ],
    description: 'The memory of a family that kept things worth keeping. The rarest discovery in all the oceans of the world.'
  }
];

/* ─── FINAL REVEAL DIALOGUE ──────────────────────────── */

const FINAL_DIALOGUE = [
  'I know now.',
  'You followed the clues.',
  'You listened to the stories.',
  'You can be trusted.',
  '—',  // pause beat
  'For years I searched for treasure.',
  'I thought treasure meant gold.',
  'I thought treasure meant rare things.',
  'I was wrong.',
  '—',
  'The greatest treasures are the people who make our lives brighter.',
  'The people who guide us.',
  'The people who fill our memories with love.',
  '—',
  'This was the treasure I wanted to share.',
];

/* ─── STATE ──────────────────────────────────────────── */

const State = (() => {
  const STORAGE_KEY = 'whaleAdventure_v1';

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch { return {}; }
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  return {
    get() { return load(); },
    set(key, value) {
      const d = load();
      d[key] = value;
      save(d);
    },
    memoriesFound() {
      return load().memoriesFound || [];
    },
    addMemory(index) {
      const d = load();
      const found = d.memoriesFound || [];
      if (!found.includes(index)) found.push(index);
      d.memoriesFound = found;
      save(d);
    },
    nextMemoryIndex() {
      return (load().memoriesFound || []).length;
    },
    isComplete() {
      return !!(load().completed);
    },
    markComplete() {
      const d = load();
      d.completed = true;
      save(d);
    },
    reset() {
      localStorage.removeItem(STORAGE_KEY);
    }
  };
})();
