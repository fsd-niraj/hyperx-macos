const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('hyperx', {
  listDevices: () => ipcRenderer.invoke('list-devices'),
  setAll: (rgb) => ipcRenderer.invoke('set-all', rgb),
  setKey: (index, rgb) => ipcRenderer.invoke('set-key', { index, rgb }),
  setKeys: (updates) => ipcRenderer.invoke('set-keys', updates),
  diagnose: () => ipcRenderer.invoke('diagnose'),
});

console.log('PRELOAD SUCCESS');
