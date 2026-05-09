const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  createPlaceholder: (gameName) => ipcRenderer.invoke('create-placeholder', gameName),
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  updateRPC: (data) => ipcRenderer.send('update-rpc', data),
  onRPCStatus: (callback) => ipcRenderer.on('rpc-status', (event, ...args) => callback(...args)),
  searchGame: (query) => ipcRenderer.invoke('search-steam-game', query),
  getGameDetails: (appId) => ipcRenderer.invoke('get-game-details', appId),
  generateLua: (data) => ipcRenderer.invoke('generate-lua', data),
  checkLuaExists: (appId) => ipcRenderer.invoke('check-lua-exists', appId),
  removeLua: (appId) => ipcRenderer.invoke('remove-lua', appId),
  restartSteam: () => ipcRenderer.invoke('restart-steam'),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  getMyGames: () => ipcRenderer.invoke('get-my-games'),
  getResourcePath: (relativePath) => ipcRenderer.invoke('get-resource-path', relativePath),
  // License Key System
  generateKey: () => ipcRenderer.invoke('generate-key'),
  validateKey: (key) => ipcRenderer.invoke('validate-key', key),
  markKeyUsed: (key, deviceId) => ipcRenderer.invoke('mark-key-used', { key, deviceId }),
  getAllKeys: () => ipcRenderer.invoke('get-all-keys'),
});