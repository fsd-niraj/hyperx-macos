const HID = require('node-hid');

const HYPERX_VENDOR = 1008;
const devicesCache = new Map();

class HyperXDriver {
  constructor() {
    this.device = null;
    this.productId = null;
    this.dryRun = false; // safe by default
  }

  listDevices() {
    console.table({
      vendorId: HYPERX_VENDOR,
      vendorIdHex: parseInt(HYPERX_VENDOR, 16),
    });
    return HID.devices().filter((d) => {
      if (d.vendorId === HYPERX_VENDOR) {
        return d;
      }
    });
  }

  open() {
    if (this.device) return;

    const dev = HID.devices().find((d) => d.vendorId === HYPERX_VENDOR);
    if (!dev) throw new Error('No HyperX keyboard found.');

    this.productId = dev.productId;
    this.device = new HID.HID(HYPERX_VENDOR, this.productId);
  }

  setAll({ r, g, b }) {
    this.open();

    const REPORT_ID = 0x04;
    const data = Buffer.alloc(64);
    data[0] = 0x01; // command
    data[1] = r;
    data[2] = g;
    data[3] = b;

    if (this.dryRun) {
      console.log('DRY RUN → setAll:', { REPORT_ID, bytes: [...data] });
      return;
    }

    return this.device.sendFeatureReport([REPORT_ID, ...data]);
  }

  setKey(index, { r, g, b }) {
    this.open();

    const REPORT_ID = 0x04;
    const data = Buffer.alloc(64);
    data[0] = 0x02; // command
    data[1] = index & 0xff;
    data[2] = (index >> 8) & 0xff;
    data[3] = r;
    data[4] = g;
    data[5] = b;

    if (this.dryRun) {
      console.log('DRY RUN → setKey:', { REPORT_ID, bytes: [...data] });
      return;
    }

    return this.device.sendFeatureReport([REPORT_ID, ...data]);
  }
}

module.exports = HyperXDriver;
