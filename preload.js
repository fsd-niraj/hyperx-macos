const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('hyperx', {
  listDevices: () => ipcRenderer.invoke('list-devices'),
  setAll: (rgb) => ipcRenderer.invoke('set-all', rgb),
  setKey: (index, rgb) => ipcRenderer.invoke('set-key', { index, rgb }),
  setKeys: (updates) => ipcRenderer.invoke('set-keys', updates),
  setBrightness: (level) => ipcRenderer.invoke('set-brightness', level),
  diagnose: () => ipcRenderer.invoke('diagnose'),
});

console.log('PRELOAD SUCCESS');
