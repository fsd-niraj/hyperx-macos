// ─────────────────────────────────────────────────────────────────────────────
// LED index mapping sourced from OpenRGB RGBController_HyperXAlloyOriginsCore
// (ANSI QWERTY layout, TKL — 94 total LED slots, some unused in ANSI)
// ─────────────────────────────────────────────────────────────────────────────

// Each key: { label, led }   led = index passed to driver.setKey()
// { gap: u }                  visual spacer, u = width in key-units
// Key width u defaults to 1 unless specified with u: N

const U = 44; // pixels per key-unit (key width + gap)
const KH = 38; // key height in px
const KG = 4; // gap between keys in px

// width in px for a key or spacer of `u` units
const px = (u) => Math.round(u * U - KG);

const MAIN_ROWS = [
  // Row 0 — Esc + F1–F12
  // Esc↔F1 gap = 1u so total row = 1+1+4+0.5+4+0.5+4 = 15u (matches number row)
  [
    { label: 'Esc', led: 0 },
    { gap: 1 },
    { label: 'F1', led: 1 },
    { label: 'F2', led: 2 },
    { label: 'F3', led: 3 },
    { label: 'F4', led: 4 },
    { gap: 0.5 },
    { label: 'F5', led: 5 },
    { label: 'F6', led: 6 },
    { label: 'F7', led: 7 },
    { label: 'F8', led: 48 },
    { gap: 0.5 },
    { label: 'F9', led: 49 },
    { label: 'F10', led: 50 },
    { label: 'F11', led: 51 },
    { label: 'F12', led: 52 },
  ],
  // Row 1 — Number row (15u)
  [
    { label: '`', led: 8 },
    { label: '1', led: 9 },
    { label: '2', led: 10 },
    { label: '3', led: 11 },
    { label: '4', led: 12 },
    { label: '5', led: 13 },
    { label: '6', led: 14 },
    { label: '7', led: 15 },
    { label: '8', led: 16 },
    { label: '9', led: 56 },
    { label: '0', led: 57 },
    { label: '-', led: 58 },
    { label: '=', led: 59 },
    { label: 'Bksp', led: 60, u: 2 },
  ],
  // Row 2 — QWERTY  (1.5 + 12×1 + 1.5 = 15u)
  [
    { label: 'Tab', led: 17, u: 1.5 },
    { label: 'Q', led: 18 },
    { label: 'W', led: 19 },
    { label: 'E', led: 20 },
    { label: 'R', led: 21 },
    { label: 'T', led: 22 },
    { label: 'Y', led: 23 },
    { label: 'U', led: 24 },
    { label: 'I', led: 64 },
    { label: 'O', led: 65 },
    { label: 'P', led: 66 },
    { label: '[', led: 67 },
    { label: ']', led: 68 },
    { label: '\\', led: 69, u: 1.5 },
  ],
  // Row 3 — Home row  (1.75 + 11×1 + 2.25 = 15u)
  [
    { label: 'Caps', led: 25, u: 1.75 },
    { label: 'A', led: 26 },
    { label: 'S', led: 27 },
    { label: 'D', led: 28 },
    { label: 'F', led: 29 },
    { label: 'G', led: 30 },
    { label: 'H', led: 31 },
    { label: 'J', led: 32 },
    { label: 'K', led: 73 },
    { label: 'L', led: 74 },
    { label: ';', led: 75 },
    { label: "'", led: 76 },
    { label: 'Enter', led: 77, u: 2.25 },
  ],
  // Row 4 — Shift row  (2.25 + 10×1 + 2.75 = 15u)
  [
    { label: 'Shift', led: 33, u: 2.25 },
    { label: 'Z', led: 34 },
    { label: 'X', led: 35 },
    { label: 'C', led: 36 },
    { label: 'V', led: 37 },
    { label: 'B', led: 38 },
    { label: 'N', led: 39 },
    { label: 'M', led: 40 },
    { label: ',', led: 79 },
    { label: '.', led: 80 },
    { label: '/', led: 81 },
    { label: 'Shift', led: 82, u: 2.75 },
  ],
  // Row 5 — Bottom row  (1.25×3 + 6.25 + 1.25×3 = 15u)
  [
    { label: 'Ctrl', led: 41, u: 1.25 },
    { label: '⊞', led: 42, u: 1.25 },
    { label: 'Alt', led: 43, u: 1.25 },
    { label: '', led: 45, u: 6.25 }, // Space
    { label: 'Alt', led: 86, u: 1.25 },
    { label: 'Fn', led: 87, u: 1.25 },
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
    { label: 'Ins', led: 61 },
    { label: 'Home', led: 62 },
    { label: 'PgUp', led: 63 },
  ],
  // Aligns with Row 2
  [
    { label: 'Del', led: 70 },
    { label: 'End', led: 71 },
    { label: 'PgDn', led: 72 },
  ],
  // Aligns with Row 3 — empty
  [],
  // Aligns with Row 4 — Up arrow (centre slot)
  [{ gap: 1 }, { label: '↑', led: 85 }],
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
// Color utilities
// ─────────────────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
  );
}

function hsvToHex(h, s, v) {
  const c = v * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = v - c;
  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

function hexToHsv(hex) {
  const { r, g, b } = hexToRgb(hex);
  const r1 = r / 255,
    g1 = g / 255,
    b1 = b / 255;
  const max = Math.max(r1, g1, b1),
    min = Math.min(r1, g1, b1),
    d = max - min;
  let h = 0;
  if (d) {
    if (max === r1) h = ((((g1 - b1) / d) % 6) + 6) % 6;
    else if (max === g1) h = (b1 - r1) / d + 2;
    else h = (r1 - g1) / d + 4;
    h *= 60;
  }
  return { h, s: max ? d / max : 0, v: max };
}

// ─────────────────────────────────────────────────────────────────────────────
// Color Wheel
// ─────────────────────────────────────────────────────────────────────────────

const CW = {
  H: 0,
  S: 1,
  V: 1,
  SIZE: 160,
  RING_W: 15,
  SQ: 70, // SV square side length
  _drag: null,

  get cx() {
    return this.SIZE / 2;
  },
  get cy() {
    return this.SIZE / 2;
  },
  get outerR() {
    return this.SIZE / 2 - 3;
  },
  get innerR() {
    return this.outerR - this.RING_W;
  },
  get sqX() {
    return this.cx - this.SQ / 2;
  },
  get sqY() {
    return this.cy - this.SQ / 2;
  },

  init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.draw();
    canvas.addEventListener('mousedown', (e) => this._down(e));
    document.addEventListener('mousemove', (e) => this._move(e));
    document.addEventListener('mouseup', () => {
      this._drag = null;
    });
  },

  draw() {
    const { ctx, cx, cy, outerR, innerR, RING_W, H, S, V, sqX, sqY, SQ, SIZE } =
      this;
    ctx.clearRect(0, 0, SIZE, SIZE);

    // Hue ring
    for (let deg = 0; deg < 360; deg++) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(
        cx,
        cy,
        outerR,
        ((deg - 0.5) * Math.PI) / 180,
        ((deg + 1.5) * Math.PI) / 180,
      );
      ctx.closePath();
      ctx.fillStyle = `hsl(${deg},100%,50%)`;
      ctx.fill();
    }
    // Cut centre hole
    ctx.beginPath();
    ctx.arc(cx, cy, innerR - 1, 0, 2 * Math.PI);
    ctx.fillStyle = '#1c1c1c';
    ctx.fill();

    // SV square — hue base + white overlay + black overlay
    ctx.fillStyle = `hsl(${H},100%,50%)`;
    ctx.fillRect(sqX, sqY, SQ, SQ);
    const gW = ctx.createLinearGradient(sqX, 0, sqX + SQ, 0);
    gW.addColorStop(0, '#fff');
    gW.addColorStop(1, 'transparent');
    ctx.fillStyle = gW;
    ctx.fillRect(sqX, sqY, SQ, SQ);
    const gB = ctx.createLinearGradient(0, sqY, 0, sqY + SQ);
    gB.addColorStop(0, 'transparent');
    gB.addColorStop(1, '#000');
    ctx.fillStyle = gB;
    ctx.fillRect(sqX, sqY, SQ, SQ);

    // Ring handle
    const ha = ((H - 90) * Math.PI) / 180;
    const hr = innerR + RING_W / 2;
    const hx = cx + Math.cos(ha) * hr,
      hy = cy + Math.sin(ha) * hr;
    ctx.beginPath();
    ctx.arc(hx, hy, 7, 0, 2 * Math.PI);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = `hsl(${H},100%,50%)`;
    ctx.fill();

    // SV handle
    const svx = sqX + S * SQ,
      svy = sqY + (1 - V) * SQ;
    ctx.beginPath();
    ctx.arc(svx, svy, 6, 0, 2 * Math.PI);
    ctx.strokeStyle = V > 0.4 ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
  },

  getHex() {
    return hsvToHex(this.H, this.S, this.V);
  },

  setHex(hex) {
    const { h, s, v } = hexToHsv(hex);
    this.H = h;
    this.S = s;
    this.V = v;
    this.draw();
  },

  _pos(e) {
    const r = this.canvas.getBoundingClientRect();
    const scale = this.SIZE / r.width;
    return { x: (e.clientX - r.left) * scale, y: (e.clientY - r.top) * scale };
  },

  _down(e) {
    const { x, y } = this._pos(e);
    const { cx, cy, innerR, outerR, sqX, sqY, SQ } = this;
    const dist = Math.hypot(x - cx, y - cy);
    if (dist >= innerR && dist <= outerR) {
      this._drag = 'ring';
      this._updateH(x, y);
    } else if (x >= sqX && x <= sqX + SQ && y >= sqY && y <= sqY + SQ) {
      this._drag = 'sv';
      this._updateSV(x, y);
    }
  },

  _move(e) {
    if (!this._drag) return;
    const { x, y } = this._pos(e);
    if (this._drag === 'ring') this._updateH(x, y);
    else this._updateSV(x, y);
  },

  _updateH(x, y) {
    const a = (Math.atan2(y - this.cy, x - this.cx) * 180) / Math.PI + 90;
    this.H = ((a % 360) + 360) % 360;
    this.draw();
    onWheelChange();
  },

  _updateSV(x, y) {
    const { sqX, sqY, SQ } = this;
    this.S = Math.max(0, Math.min(1, (x - sqX) / SQ));
    this.V = Math.max(0, Math.min(1, 1 - (y - sqY) / SQ));
    this.draw();
    onWheelChange();
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Selection + key painting
// ─────────────────────────────────────────────────────────────────────────────

const selectedLeds = new Set();
const keyColorMap = new Map();

function getKeyEl(led) {
  return document.querySelector(`.key[data-led="${led}"]`);
}

function paintKey(led, hex) {
  keyColorMap.set(led, hex);
  const el = getKeyEl(led);
  if (!el) return;
  el.style.background = hex;
  el.style.borderColor = hex;
  const { r, g, b } = hexToRgb(hex);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  el.style.color = lum > 0.45 ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.45)';
}

function selectKey(led, el) {
  selectedLeds.add(led);
  el.classList.add('selected');
}

function deselectAll() {
  selectedLeds.clear();
  document
    .querySelectorAll('.key.selected')
    .forEach((k) => k.classList.remove('selected'));
}

// ─────────────────────────────────────────────────────────────────────────────
// Key click / keydown — toggle selection
// ─────────────────────────────────────────────────────────────────────────────

document.querySelectorAll('.key').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    const led = parseInt(el.dataset.led);
    if (selectedLeds.has(led)) {
      selectedLeds.delete(led);
      el.classList.remove('selected');
    } else {
      selectKey(led, el);
      CW.setHex(keyColorMap.get(led) || '#000000');
      syncHexUI(CW.getHex());
    }
  });
});

keyboard.addEventListener('click', () => deselectAll());

const CODE_TO_LED = {
  Escape: 0,
  F1: 1,
  F2: 2,
  F3: 3,
  F4: 4,
  F5: 5,
  F6: 6,
  F7: 7,
  F8: 48,
  F9: 49,
  F10: 50,
  F11: 51,
  F12: 52,
  PrintScreen: 53,
  ScrollLock: 54,
  Pause: 55,
  Backquote: 8,
  Digit1: 9,
  Digit2: 10,
  Digit3: 11,
  Digit4: 12,
  Digit5: 13,
  Digit6: 14,
  Digit7: 15,
  Digit8: 16,
  Digit9: 56,
  Digit0: 57,
  Minus: 58,
  Equal: 59,
  Backspace: 60,
  Insert: 61,
  Home: 62,
  PageUp: 63,
  Tab: 17,
  KeyQ: 18,
  KeyW: 19,
  KeyE: 20,
  KeyR: 21,
  KeyT: 22,
  KeyY: 23,
  KeyU: 24,
  KeyI: 64,
  KeyO: 65,
  KeyP: 66,
  BracketLeft: 67,
  BracketRight: 68,
  Backslash: 69,
  Delete: 70,
  End: 71,
  PageDown: 72,
  CapsLock: 25,
  KeyA: 26,
  KeyS: 27,
  KeyD: 28,
  KeyF: 29,
  KeyG: 30,
  KeyH: 31,
  KeyJ: 32,
  KeyK: 73,
  KeyL: 74,
  Semicolon: 75,
  Quote: 76,
  Enter: 77,
  ShiftLeft: 33,
  KeyZ: 34,
  KeyX: 35,
  KeyC: 36,
  KeyV: 37,
  KeyB: 38,
  KeyN: 39,
  KeyM: 40,
  Comma: 79,
  Period: 80,
  Slash: 81,
  ShiftRight: 82,
  ArrowUp: 85,
  ControlLeft: 41,
  MetaLeft: 42,
  AltLeft: 43,
  Space: 45,
  AltRight: 86,
  ControlRight: 88,
  ArrowLeft: 90,
  ArrowDown: 91,
  ArrowRight: 92,
};

document.addEventListener('keydown', (e) => {
  const led = CODE_TO_LED[e.code];
  if (led === undefined) return;
  e.preventDefault();
  const el = getKeyEl(led);
  if (!el) return;
  if (selectedLeds.has(led)) {
    selectedLeds.delete(led);
    el.classList.remove('selected');
  } else {
    selectKey(led, el);
    CW.setHex(keyColorMap.get(led) || '#000000');
    syncHexUI(CW.getHex());
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Color wheel → live preview + debounced send + clear on send
// ─────────────────────────────────────────────────────────────────────────────

let sendDebounce = null;

function onWheelChange() {
  const hex = CW.getHex();
  syncHexUI(hex);
  if (selectedLeds.size === 0) return;
  for (const led of selectedLeds) paintKey(led, hex);
  clearTimeout(sendDebounce);
  sendDebounce = setTimeout(() => sendAndClear(hex), 80);
}

async function sendAndClear(hex) {
  if (selectedLeds.size === 0) return;
  const { r, g, b } = hexToRgb(hex);
  const updates = [...selectedLeds].map((index) => ({ index, r, g, b }));
  deselectAll(); // ← #1: clear selection
  const result = await window.hyperx.setKeys(updates);
  if (!result.ok) setStatus(result.error, 'error');
}

// ─────────────────────────────────────────────────────────────────────────────
// Hex input + color preview
// ─────────────────────────────────────────────────────────────────────────────

const hexInput = document.getElementById('hex-input');
const colorPreview = document.getElementById('color-preview');

function syncHexUI(hex) {
  hexInput.value = hex;
  colorPreview.style.background = hex;
}

hexInput.addEventListener('change', () => {
  let v = hexInput.value.trim();
  if (!v.startsWith('#')) v = '#' + v;
  if (!/^#[0-9a-fA-F]{6}$/.test(v)) return;
  CW.setHex(v);
  syncHexUI(v);
  onWheelChange();
});

// ─────────────────────────────────────────────────────────────────────────────
// Preset swatches
// ─────────────────────────────────────────────────────────────────────────────

const PRESETS = [
  '#FF0000',
  '#FF6600',
  '#FFFF00',
  '#00FF00',
  '#00FFFF',
  '#0055FF',
  '#8800FF',
  '#FF00FF',
];

const presetsEl = document.getElementById('presets');
PRESETS.forEach((color) => {
  const sw = document.createElement('div');
  sw.className = 'swatch';
  sw.style.background = color;
  sw.title = color;
  sw.addEventListener('click', () => {
    CW.setHex(color);
    syncHexUI(color);
    onWheelChange();
  });
  presetsEl.appendChild(sw);
});

// ─────────────────────────────────────────────────────────────────────────────
// Buttons + brightness
// ─────────────────────────────────────────────────────────────────────────────

const statusEl = document.getElementById('status');
function setStatus(msg, type = '') {
  statusEl.textContent = msg;
  statusEl.className = type;
}

// #2: Apply to Selected — explicit button
document.getElementById('btn-apply-selected').onclick = async () => {
  if (selectedLeds.size === 0) {
    setStatus('No keys selected.');
    return;
  }
  await sendAndClear(CW.getHex());
  setStatus('Applied to selected keys.', 'ok');
};

document.getElementById('btn-apply-all').onclick = async () => {
  const hex = CW.getHex();
  document
    .querySelectorAll('.key')
    .forEach((el) => paintKey(parseInt(el.dataset.led), hex));
  const result = await window.hyperx.setAll(hexToRgb(hex));
  result.ok
    ? setStatus('Applied to all keys.', 'ok')
    : setStatus(result.error, 'error');
};

document.getElementById('btn-diagnose').onclick = async () => {
  setStatus('Running…');
  const result = await window.hyperx.diagnose();
  console.log('Diagnose:', result);
  setStatus(
    result.sendTest.ok ? 'Device OK' : result.sendTest.error,
    result.sendTest.ok ? 'ok' : 'error',
  );
};

document.getElementById('brightness').addEventListener('input', (e) => {
  window.hyperx.setBrightness
    ? window.hyperx.setBrightness(Number(e.target.value))
    : null;
});

// ─────────────────────────────────────────────────────────────────────────────
// LED position map (normalized x/y 0–1) for directional effects
// ─────────────────────────────────────────────────────────────────────────────

const LED_POS = (() => {
  const map = {};
  const TOTAL_W = 18.5; // total keyboard width in key-units
  const NAV_X = 15.5; // navigation block x offset in key-units

  function processRows(rows, xOffset) {
    rows.forEach((row, rowIdx) => {
      let cumX = xOffset;
      for (const item of row) {
        if (item.gap !== undefined) {
          cumX += item.gap;
        } else {
          const u = item.u ?? 1;
          map[item.led] = { x: (cumX + u / 2) / TOTAL_W, y: rowIdx / 5 };
          cumX += u;
        }
      }
    });
  }

  processRows(MAIN_ROWS, 0);
  processRows(NAV_ROWS, NAV_X);
  return map;
})();

const ALL_LEDS = Object.keys(LED_POS).map(Number);

// ─────────────────────────────────────────────────────────────────────────────
// Effect functions  fn(t, speed, hex) → [{index, r, g, b}, …]
// ─────────────────────────────────────────────────────────────────────────────

const FX = {
  solid(t, speed, hex) {
    const { r, g, b } = hexToRgb(hex);
    return ALL_LEDS.map((i) => ({ index: i, r, g, b }));
  },

  breathing(t, speed, hex) {
    const brightness = (Math.sin(t * 0.04 * speed) + 1) / 2;
    const { r, g, b } = hexToRgb(hex);
    return ALL_LEDS.map((i) => ({
      index: i,
      r: Math.round(r * brightness),
      g: Math.round(g * brightness),
      b: Math.round(b * brightness),
    }));
  },

  wave(t, speed, hex) {
    const { h, s, v } = hexToHsv(hex);
    return ALL_LEDS.map((i) => {
      const pos = LED_POS[i];
      const hue = (((h + pos.x * 180 - t * speed * 1.5) % 360) + 360) % 360;
      const { r, g, b } = hexToRgb(hsvToHex(hue, s, v));
      return { index: i, r, g, b };
    });
  },

  swipe(t, speed, hex) {
    const { r, g, b } = hexToRgb(hex);
    const bandX = (((t * speed * 0.008) % 1) + 1) % 1;
    return ALL_LEDS.map((i) => {
      const pos = LED_POS[i];
      const brightness = Math.max(0, 1 - Math.abs(pos.x - bandX) * 10);
      return {
        index: i,
        r: Math.round(r * brightness),
        g: Math.round(g * brightness),
        b: Math.round(b * brightness),
      };
    });
  },

  confetti(t, speed, hex) {
    const frame = Math.floor(t * speed * 0.08);
    return ALL_LEDS.map((i) => {
      const s1 = Math.sin(i * 127.1 + frame * 321.7) * 43758.5453;
      const hue = (s1 - Math.floor(s1)) * 360;
      const s2 = Math.sin(i * 43.1 + frame * 234.5) * 17453.1;
      const on = s2 - Math.floor(s2) > 0.35;
      if (!on) return { index: i, r: 0, g: 0, b: 0 };
      const { r, g, b } = hexToRgb(hsvToHex(hue, 1, 1));
      return { index: i, r, g, b };
    });
  },

  hourglass(t, speed, hex) {
    const { r, g, b } = hexToRgb(hex);
    const phase = (((t * speed * 0.015) % 2) + 2) % 2; // 0 → 2 cycling
    const fill = phase < 1 ? phase : 2 - phase; // 0 → 1 → 0
    return ALL_LEDS.map((i) => {
      const pos = LED_POS[i];
      const lit = pos.y >= 1 - fill - 0.05;
      return { index: i, r: lit ? r : 0, g: lit ? g : 0, b: lit ? b : 0 };
    });
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Effect animation loop
// ─────────────────────────────────────────────────────────────────────────────

let fxName = null;
let fxRafId = null;
let fxStartTime = null;
let fxLastSend = 0;
let fxSpeed = 5;

const FX_SEND_MS = 50; // throttle USB sends to ~20fps

function applyFxFrame(updates) {
  for (const { index, r, g, b } of updates) {
    const el = getKeyEl(index);
    if (!el) continue;
    const hex = rgbToHex(r, g, b);
    el.style.background = hex;
    el.style.borderColor = hex;
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    el.style.color = lum > 0.45 ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.45)';
  }
}

function stopFx() {
  if (fxRafId) {
    cancelAnimationFrame(fxRafId);
    fxRafId = null;
  }
  fxName = null;
  document
    .querySelectorAll('.fx-btn')
    .forEach((b) => b.classList.remove('active'));
}

function tickFx(now) {
  if (!fxName) return;
  // Normalize elapsed time to original tick units (1 tick = 50ms) so
  // effect math is unchanged while rendering at 60fps.
  const fxT = (now - fxStartTime) / 50;
  const updates = FX[fxName](fxT, fxSpeed, CW.getHex());
  applyFxFrame(updates);
  if (now - fxLastSend >= FX_SEND_MS) {
    fxLastSend = now;
    window.hyperx.setKeys(updates).catch(() => {});
  }
  fxRafId = requestAnimationFrame(tickFx);
}

function startFx(name) {
  stopFx();
  fxName = name;
  document
    .querySelectorAll('.fx-btn')
    .forEach((b) => b.classList.toggle('active', b.dataset.fx === name));

  if (name === 'solid') {
    const updates = FX.solid(0, fxSpeed, CW.getHex());
    applyFxFrame(updates);
    window.hyperx.setKeys(updates);
    return;
  }
  fxStartTime = performance.now();
  fxLastSend = 0;
  fxRafId = requestAnimationFrame(tickFx);
}

document.querySelectorAll('.fx-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (fxName === btn.dataset.fx && btn.dataset.fx !== 'solid') {
      stopFx(); // click active effect to stop it
    } else {
      startFx(btn.dataset.fx);
    }
  });
});

document.getElementById('fx-speed').addEventListener('input', (e) => {
  fxSpeed = Number(e.target.value);
});

// ─────────────────────────────────────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────────────────────────────────────

CW.init(document.getElementById('color-wheel'));
syncHexUI(CW.getHex());
