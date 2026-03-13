const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const HyperX = require('./driver/hyperx.js');
const HyperXUsbDriver = require('./driver/hyperx-usb.js');

let win;
const driver = new HyperXUsbDriver({ dryRun: false });

function createWindow() {
  console.log('WINDOW CREATED', driver);
  win = new BrowserWindow({
    width: 1100,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile('./index.html');
  win.webContents.openDevTools();
}

// IPC handlers
ipcMain.handle('list-devices', () => driver.listDevices());

ipcMain.handle('set-all', async (_, rgb) => {
  try {
    await driver.setAll(rgb);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('set-key', async (_, { index, rgb }) => {
  try {
    await driver.setKey(index, rgb);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('set-brightness', (_, level) => {
  try { driver.setBrightness(level); return { ok: true }; }
  catch (err) { return { ok: false, error: err.message }; }
});

ipcMain.handle('set-keys', (_, updates) => {
  try {
    driver.setKeys(updates);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('diagnose', () => driver.diagnose());

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  driver.close();
  app.quit();
});
