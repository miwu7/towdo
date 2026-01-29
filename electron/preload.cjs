const { contextBridge, ipcRenderer } = require('electron');

// 预留安全 API 通道，后续接入系统能力或数据库
contextBridge.exposeInMainWorld('towdo', {
  version: process.versions.electron,
  setAutoLaunch: (enabled) => ipcRenderer.send('twodo:set-auto-launch', !!enabled),
  setMinimizeToTray: (enabled) => ipcRenderer.send('twodo:set-minimize-to-tray', !!enabled),
  setGlobalHotkey: (enabled) => ipcRenderer.send('twodo:set-global-hotkey', !!enabled),
  setWidgets: (enabled) => ipcRenderer.send('twodo:set-widgets', !!enabled),
  onOpenQuickAdd: (callback) => ipcRenderer.on('twodo:open-quick-add', callback),
  offOpenQuickAdd: (callback) => ipcRenderer.removeListener('twodo:open-quick-add', callback),
});
