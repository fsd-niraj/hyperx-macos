// ─────────────────────────────────────────────────────────────────────────────
// LED index mapping sourced from OpenRGB RGBController_HyperXAlloyOriginsCore
// (ANSI QWERTY layout, TKL — 94 total LED slots, some unused in ANSI)
// ─────────────────────────────────────────────────────────────────────────────

// Each key: { label, led }   led = index passed to driver.setKey()
// { gap: u }                  visual spacer, u = width in key-units
// Key width u defaults to 1 unless specified with u: N

const U  = 44;   // pixels per key-unit (key width + gap)
const KH = 38;   // key height in px
const KG = 4;    // gap between keys in px

// width in px for a key or spacer of `u` units
const px = (u) => Math.round(u * U - KG);

const MAIN_ROWS = [
  // Row 0 — Esc + F1–F12
  // Esc↔F1 gap = 1u so total row = 1+1+4+0.5+4+0.5+4 = 15u (matches number row)
  [
    { label: 'Esc',  led: 0  },
    { gap: 1 },
    { label: 'F1',   led: 1  },
    { label: 'F2',   led: 2  },
    { label: 'F3',   led: 3  },
    { label: 'F4',   led: 4  },
    { gap: 0.5 },
    { label: 'F5',   led: 5  },
    { label: 'F6',   led: 6  },
    { label: 'F7',   led: 7  },
    { label: 'F8',   led: 48 },
    { gap: 0.5 },
    { label: 'F9',   led: 49 },
    { label: 'F10',  led: 50 },
    { label: 'F11',  led: 51 },
    { label: 'F12',  led: 52 },
  ],
  // Row 1 — Number row (15u)
  [
    { label: '`',    led: 8  },
    { label: '1',    led: 9  },
    { label: '2',    led: 10 },
    { label: '3',    led: 11 },
    { label: '4',    led: 12 },
    { label: '5',    led: 13 },
    { label: '6',    led: 14 },
    { label: '7',    led: 15 },
    { label: '8',    led: 16 },
    { label: '9',    led: 56 },
    { label: '0',    led: 57 },
    { label: '-',    led: 58 },
    { label: '=',    led: 59 },
    { label: 'Bksp', led: 60, u: 2 },
  ],
  // Row 2 — QWERTY  (1.5 + 12×1 + 1.5 = 15u)
  [
    { label: 'Tab',  led: 17, u: 1.5 },
    { label: 'Q',    led: 18 },
    { label: 'W',    led: 19 },
    { label: 'E',    led: 20 },
    { label: 'R',    led: 21 },
    { label: 'T',    led: 22 },
    { label: 'Y',    led: 23 },
    { label: 'U',    led: 24 },
    { label: 'I',    led: 64 },
    { label: 'O',    led: 65 },
    { label: 'P',    led: 66 },
    { label: '[',    led: 67 },
    { label: ']',    led: 68 },
    { label: '\\',   led: 69, u: 1.5 },
  ],
  // Row 3 — Home row  (1.75 + 11×1 + 2.25 = 15u)
  [
    { label: 'Caps', led: 25, u: 1.75 },
    { label: 'A',    led: 26 },
    { label: 'S',    led: 27 },
    { label: 'D',    led: 28 },
    { label: 'F',    led: 29 },
    { label: 'G',    led: 30 },
    { label: 'H',    led: 31 },
    { label: 'J',    led: 32 },
    { label: 'K',    led: 73 },
    { label: 'L',    led: 74 },
    { label: ';',    led: 75 },
    { label: "'",    led: 76 },
    { label: 'Enter',led: 77, u: 2.25 },
  ],
  // Row 4 — Shift row  (2.25 + 10×1 + 2.75 = 15u)
  [
    { label: 'Shift', led: 33, u: 2.25 },
    { label: 'Z',     led: 34 },
    { label: 'X',     led: 35 },
    { label: 'C',     led: 36 },
    { label: 'V',     led: 37 },
    { label: 'B',     led: 38 },
    { label: 'N',     led: 39 },
    { label: 'M',     led: 40 },
    { label: ',',     led: 79 },
    { label: '.',     led: 80 },
    { label: '/',     led: 81 },
    { label: 'Shift', led: 82, u: 2.75 },
  ],
  // Row 5 — Bottom row  (1.25×3 + 6.25 + 1.25×3 = 15u)
  [
    { label: 'Ctrl', led: 41, u: 1.25 },
    { label: '⊞',    led: 42, u: 1.25 },
    { label: 'Alt',  led: 43, u: 1.25 },
    { label: '',     led: 45, u: 6.25 },   // Space
    { label: 'Alt',  led: 86, u: 1.25 },
    { label: 'Fn',   led: 87, u: 1.25 },
    { label: 'Ctrl', led: 88, u: 1.25 },
  ],
];

const NAV_ROWS = [
  // Aligns with Row 0 — system keys
  [
    { label: 'PrtSc', led: 53 },
    { label: 'ScrLk', led: 54 },
    { label: 'Pause', led: 55 },
  ],
  // Aligns with Row 1
  [
    { label: 'Ins',  led: 61 },
    { label: 'Home', led: 62 },
    { label: 'PgUp', led: 63 },
  ],
  // Aligns with Row 2
  [
    { label: 'Del',  led: 70 },
    { label: 'End',  led: 71 },
    { label: 'PgDn', led: 72 },
  ],
  // Aligns with Row 3 — empty
  [],
  // Aligns with Row 4 — Up arrow (centre slot)
  [
    { gap: 1 },
    { label: '↑', led: 85 },
  ],
  // Aligns with Row 5 — arrow cluster
  [
    { label: '←', led: 90 },
    { label: '↓', led: 91 },
    { label: '→', led: 92 },
  ],
];

// ─────────────────────────────────────────────────────────────────────────────
// Build keyboard DOM
// ─────────────────────────────────────────────────────────────────────────────

function buildSection(rows) {
  const section = document.createElement('div');
  section.className = 'kb-section';

  for (const row of rows) {
    const rowEl = document.createElement('div');
    rowEl.className = 'kb-row';

    for (const item of row) {
      if (item.gap !== undefined) {
        // Visual spacer between key groups
        const sp = document.createElement('div');
        sp.className = 'kb-gap';
        sp.style.width = px(item.gap) + 'px';
        rowEl.appendChild(sp);
      } else {
        const u = item.u ?? 1;
        const key = document.createElement('div');
        key.className = 'key';
        key.style.width = px(u) + 'px';
        key.textContent = item.label;
        key.dataset.led = item.led;
        rowEl.appendChild(key);
      }
    }

    section.appendChild(rowEl);
  }

  return section;
}

const keyboard = document.getElementById('keyboard');
keyboard.appendChild(buildSection(MAIN_ROWS));
keyboard.appendChild(buildSection(NAV_ROWS));

// ─────────────────────────────────────────────────────────────────────────────
// Controls
// ─────────────────────────────────────────────────────────────────────────────

const statusEl = document.getElementById('status');

function setStatus(msg, type = '') {
  statusEl.textContent = msg;
  statusEl.className = type;
}

document.getElementById('btn-apply-all').onclick = async () => {
  const rgb = hexToRgb(document.getElementById('color-picker').value);
  const result = await window.hyperx.setAll(rgb);
  result.ok ? setStatus('Applied to all keys.', 'ok') : setStatus(result.error, 'error');
};

document.getElementById('btn-diagnose').onclick = async () => {
  setStatus('Running…');
  const result = await window.hyperx.diagnose();
  console.log('Diagnose:', result);
  setStatus(result.sendTest.ok ? 'Device OK' : result.sendTest.error,
            result.sendTest.ok ? 'ok' : 'error');
};

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}
