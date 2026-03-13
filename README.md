# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Electron-based macOS desktop app for RGB lighting control of HyperX/HP gaming keyboards (specifically the Alloy Origins Core, VID: 0x03f0, PID: 0x098f) via USB HID protocols.

## Commands

```bash
npm start        # Run in development (opens DevTools automatically)
npm run build    # Package as macOS app via electron-builder
```

No test or lint scripts are configured.

## Architecture

The app follows a standard three-process Electron architecture with a driver layer for hardware communication:

**Main Process (`main.js`)** — Creates the BrowserWindow, instantiates `HyperXUsbDriver`, and registers three IPC handlers:

- `list-devices` → `driver.listDevices()`
- `set-all` → `driver.setAll(rgb)`
- `set-key` → `driver.setKey(index, rgb)`

**Preload (`preload.js`)** — Exposes IPC methods to the renderer via `contextBridge` as `window.hyperx`. This is the security boundary (contextIsolation enabled, nodeIntegration disabled).

**Renderer (`renderer.js` + `index.html`)** — UI with color picker, key index input, and three buttons (Refresh, Apply All, Apply Key). Calls `window.hyperx.*` methods only.

**Driver Layer (`driver/`):**

- `hyperx-usb.js` — **Active driver.** Uses the `usb` library for low-level USB control transfers. Targets interface 2 (LED HID interface), sends 64-byte feature reports (Report ID: 0x04).
- `hyperx.js` — Legacy HID driver using `node-hid`. Not used by `main.js` but kept as reference.

## USB Protocol

All payloads are 64 bytes, zero-padded, sent as HID SET_REPORT (feature report type 0x03):

| Command       | Byte Layout                                     |
| ------------- | ----------------------------------------------- |
| SetAll (0x01) | `[0x01, R, G, B, 0x00×60]`                      |
| SetKey (0x02) | `[0x02, indexLow, indexHigh, R, G, B, 0x00×58]` |

Key index is 16-bit little-endian: `indexLow = index & 0xff`, `indexHigh = index >> 8`.

Both drivers support a `dryRun` flag that skips actual USB writes (useful for testing without hardware).

## macOS Build Notes

- **App ID:** `com.niraj.hyperxrgb`
- **Signing:** Ad-hoc (no certificate required)
- **Hardened Runtime:** enabled — requires entitlements for USB (`com.apple.security.device.usb`) and HID (`com.apple.security.device.hid`) access
- Entitlements are defined in `entitlements.plist` and `entitlements-inherit.plist`

## Key Files

| File                   | Role                                                       |
| ---------------------- | ---------------------------------------------------------- |
| `main.js`              | Electron main process, IPC handlers, driver initialization |
| `preload.js`           | contextBridge API exposed to renderer                      |
| `renderer.js`          | UI logic and IPC calls                                     |
| `driver/hyperx-usb.js` | Active USB driver                                          |
| `driver/hyperx.js`     | Legacy HID driver (reference only)                         |
| `electron-builder.yml` | macOS packaging config                                     |
| `entitlements.plist`   | macOS security entitlements                                |
