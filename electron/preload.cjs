const { contextBridge, ipcRenderer } = require('electron');

// 预留安全 API 通道，后续接入系统能力或数据库
contextBridge.exposeInMainWorld('towdo', {
  version: process.versions.electron,
  setAutoLaunch: (enabled) => ipcRenderer.send('twodo:set-auto-launch', !!enabled),
  setMinimizeToTray: (enabled) => ipcRenderer.send('twodo:set-minimize-to-tray', !!enabled),
  setGlobalHotkey: (enabled) => ipcRenderer.send('twodo:set-global-hotkey', !!enabled),
  setMiniMode: (enabled) => ipcRenderer.send('twodo:set-mini-mode', !!enabled),
  setMiniPinned: (enabled) => ipcRenderer.send('twodo:set-mini-pinned', !!enabled),
  setMiniWindowSize: (size) => ipcRenderer.send('twodo:set-mini-size', size),
  minimizeWindow: () => ipcRenderer.send('twodo:window-minimize'),
  toggleMaximize: () => ipcRenderer.send('twodo:window-toggle-maximize'),
  closeWindow: () => ipcRenderer.send('twodo:window-close'),
  onOpenQuickAdd: (callback) => ipcRenderer.on('twodo:open-quick-add', callback),
  offOpenQuickAdd: (callback) => ipcRenderer.removeListener('twodo:open-quick-add', callback),
});
