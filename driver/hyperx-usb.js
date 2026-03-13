const HID = require('node-hid');

const VID = 0x03f0;          // HP / HyperX
const PID = 0x098f;          // Alloy Origins Core
const LED_USAGE_PAGE = 0xff13; // Vendor-specific LED interface (confirmed via diagnose)

const NUM_LEDS    = 94;
const BUF_SIZE    = 380;     // Full color buffer (94 LEDs × 48-byte segment layout)
const CHUNK_SIZE  = 60;      // Bytes of color data per HID output packet
const PACKET_SIZE = 65;      // Full HID packet: 1 report ID + 4 header + 60 data

/**
 * Build the 380-byte color buffer from an array of {r,g,b} per LED.
 *
 * Layout (from OpenRGB HyperXAlloyOriginsCoreController):
 *   segment  = floor(ledIdx / 12) * 48
 *   sector   = (floor(ledIdx / 6) & 1) * 8
 *   sequence = ledIdx % 6
 *   pos      = segment + sector + sequence
 *
 *   color_buf[pos]      = G
 *   color_buf[pos + 16] = R
 *   color_buf[pos + 32] = B
 */
function buildColorBuffer(leds) {
  const buf = Buffer.alloc(BUF_SIZE, 0);
  for (let i = 0; i < Math.min(leds.length, NUM_LEDS); i++) {
    const segment  = Math.floor(i / 12) * 48;
    const sector   = (Math.floor(i / 6) & 1) * 8;
    const sequence = i % 6;
    const pos      = segment + sector + sequence;
    buf[pos]      = leds[i].g;
    buf[pos + 16] = leds[i].r;
    buf[pos + 32] = leds[i].b;
  }
  return buf;
}

class HyperXUsbDriver {
  constructor({ dryRun = false } = {}) {
    this.vid            = VID;
    this.pid            = PID;
    this.dryRun         = dryRun;
    this.device         = null;
    this._keepAliveTimer = null;
    // Per-key state so setKey() doesn't black out other keys
    this.ledState = Array.from({ length: NUM_LEDS }, () => ({ r: 0, g: 0, b: 0 }));
  }

  /** Re-send the current ledState every intervalMs to prevent the keyboard reverting to its stored profile. */
  _startKeepAlive(intervalMs = 1000) {
    if (this._keepAliveTimer) return; // already running
    this._keepAliveTimer = setInterval(() => {
      try {
        this._sendColorBuffer(buildColorBuffer(this.ledState));
      } catch {
        this._stopKeepAlive(); // device disconnected — stop quietly
      }
    }, intervalMs);
  }

  _stopKeepAlive() {
    if (this._keepAliveTimer) {
      clearInterval(this._keepAliveTimer);
      this._keepAliveTimer = null;
    }
  }

  close() {
    this._stopKeepAlive();
    if (this.device) {
      try { this.device.close(); } catch {}
      this.device = null;
    }
  }

  _findLedInterface() {
    return HID.devices().find(
      (d) => d.vendorId === this.vid && d.productId === this.pid && d.usagePage === LED_USAGE_PAGE
    );
  }

  listDevices() {
    return HID.devices()
      .filter((d) => d.vendorId === this.vid)
      .map((d) => ({
        vendorId:      `0x${d.vendorId.toString(16).padStart(4, '0')}`,
        productId:     `0x${d.productId.toString(16).padStart(4, '0')}`,
        product:       d.product,
        interface:     d.interface,
        usagePage:     `0x${(d.usagePage || 0).toString(16)}`,
        isLedInterface: d.usagePage === LED_USAGE_PAGE,
      }));
  }

  open() {
    if (this.device) return;
    const info = this._findLedInterface();
    if (!info) {
      throw new Error(
        `HyperX LED interface not found (VID 0x${VID.toString(16)}, PID 0x${PID.toString(16)}, usagePage 0x${LED_USAGE_PAGE.toString(16)})`
      );
    }
    this.device = new HID.HID(info.path);
  }

  /**
   * Send the 380-byte color buffer to the device in 60-byte chunks.
   * Packet format (65 bytes, hid_write output report):
   *   [0x00, 0xA2, seq, 0x00, payloadSize, ...colorData]
   */
  _sendColorBuffer(colorBuf) {
    this.open();

    let seq = 0;
    let offset = 0;

    while (offset < colorBuf.length) {
      const payloadSize = Math.min(CHUNK_SIZE, colorBuf.length - offset);
      const packet = Buffer.alloc(PACKET_SIZE, 0);

      packet[0] = 0x00;         // report ID (raw output)
      packet[1] = 0xA2;         // command: set RGB
      packet[2] = seq++;
      packet[3] = 0x00;
      packet[4] = payloadSize;
      colorBuf.copy(packet, 5, offset, offset + payloadSize);

      if (this.dryRun) {
        console.log(`[DRY RUN] packet seq=${seq - 1} payloadSize=${payloadSize}`, [...packet]);
      } else {
        this.device.write([...packet]);
      }

      offset += payloadSize;
    }
  }

  /** Update any number of keys in one USB send */
  setKeys(updates) {
    // updates: [{ index, r, g, b }, ...]
    for (const { index, r, g, b } of updates) {
      if (index >= 0 && index < NUM_LEDS) {
        this.ledState[index] = { r, g, b };
      }
    }
    this._sendColorBuffer(buildColorBuffer(this.ledState));
    this._startKeepAlive();
  }

  /** Set all keys to one color */
  setAll({ r, g, b }) {
    const leds = Array.from({ length: NUM_LEDS }, () => ({ r, g, b }));
    this.ledState = leds;
    this._sendColorBuffer(buildColorBuffer(leds));
    this._startKeepAlive();
  }

  /** Set a single key by LED index (0–93) without changing other keys */
  setKey(index, { r, g, b }) {
    if (index < 0 || index >= NUM_LEDS) {
      throw new Error(`LED index ${index} out of range (0–${NUM_LEDS - 1})`);
    }
    this.ledState[index] = { r, g, b };
    this._sendColorBuffer(buildColorBuffer(this.ledState));
    this._startKeepAlive();
  }

  /** Enumerate devices and attempt a test send — for debugging */
  diagnose() {
    const result = { hidDevices: [], sendTest: null };

    result.hidDevices = HID.devices()
      .filter((d) => d.vendorId === VID)
      .map((d) => ({
        pid:            `0x${d.productId.toString(16).padStart(4, '0')}`,
        product:        d.product || '(no name)',
        interface:      d.interface,
        usagePage:      `0x${(d.usagePage || 0).toString(16).padStart(4, '0')}`,
        isLedInterface: d.usagePage === LED_USAGE_PAGE,
        path:           d.path,
      }));

    this.device = null;
    try {
      this.setAll({ r: 0, g: 0, b: 255 });
      result.sendTest = { ok: true };
    } catch (err) {
      result.sendTest = { ok: false, error: err.message };
    }

    return result;
  }
}

module.exports = HyperXUsbDriver;
