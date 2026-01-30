const { app, BrowserWindow, shell, Tray, Menu, nativeImage, globalShortcut, ipcMain } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;
let mainWindow = null;
let tray = null;
let minimizeToTrayEnabled = false;
let globalHotkeyEnabled = false;
let miniModeEnabled = false;
let miniRestoreBounds = null;
let miniRestoreMinSize = null;
let miniRestoreMaxSize = null;
let miniRestoreResizable = null;

const createTray = () => {
  if (tray) return tray;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <rect x="8" y="8" width="48" height="48" rx="14" fill="#7C3AED" />
      <path d="M20 34c6 6 18 6 24 0" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" />
      <circle cx="26" cy="26" r="3" fill="#fff" />
      <circle cx="38" cy="26" r="3" fill="#fff" />
    </svg>
  `;
  const image = nativeImage.createFromDataURL(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`);
  tray = new Tray(image);
  const menu = Menu.buildFromTemplate([
    {
      label: '打开 TwoDo',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    { type: 'separator' },
    { label: '退出', click: () => app.quit() },
  ]);
  tray.setToolTip('TwoDo');
  tray.setContextMenu(menu);
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
  return tray;
};

const registerGlobalHotkey = () => {
  globalShortcut.unregisterAll();
  if (!globalHotkeyEnabled) return;
  globalShortcut.register('Alt+Space', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
    mainWindow.webContents.send('twodo:open-quick-add');
  });
};

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#00000000',
    show: false,
    frame: false,
    transparent: true,
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 隐藏顶部菜单栏（Windows/Linux）
  mainWindow.setMenuBarVisibility(false);

  const rendererUrl = process.env.ELECTRON_RENDERER_URL;
  if (rendererUrl) {
    mainWindow.loadURL(rendererUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('close', (event) => {
    if (minimizeToTrayEnabled) {
      event.preventDefault();
      mainWindow.hide();
      createTray();
    }
  });

  return mainWindow;
};

const setMiniMode = (enabled) => {
  if (!mainWindow) return;
  if (enabled) {
    if (miniModeEnabled) return;
    miniModeEnabled = true;
    mainWindow.setBackgroundColor('#00000000');
    miniRestoreBounds = mainWindow.getBounds();
    miniRestoreMinSize = mainWindow.getMinimumSize();
    miniRestoreMaxSize = mainWindow.getMaximumSize();
    miniRestoreResizable = mainWindow.isResizable();
    mainWindow.setMinimumSize(280, 200);
    mainWindow.setMaximumSize(380, 1200);
    mainWindow.setResizable(false);
    mainWindow.setContentSize(340, 420, true);
  } else {
    if (!miniModeEnabled) return;
    miniModeEnabled = false;
    if (miniRestoreBounds) mainWindow.setBounds(miniRestoreBounds);
    if (miniRestoreMinSize) mainWindow.setMinimumSize(...miniRestoreMinSize);
    if (miniRestoreMaxSize) mainWindow.setMaximumSize(...miniRestoreMaxSize);
    if (typeof miniRestoreResizable === 'boolean') mainWindow.setResizable(miniRestoreResizable);
    mainWindow.setAlwaysOnTop(false);
    mainWindow.setBackgroundColor('#f7f1f8');
  }
};


ipcMain.on('twodo:set-auto-launch', (_event, enabled) => {
  app.setLoginItemSettings({ openAtLogin: !!enabled });
});

ipcMain.on('twodo:set-minimize-to-tray', (_event, enabled) => {
  minimizeToTrayEnabled = !!enabled;
  if (!minimizeToTrayEnabled && tray) {
    tray.destroy();
    tray = null;
  }
});

ipcMain.on('twodo:set-global-hotkey', (_event, enabled) => {
  globalHotkeyEnabled = !!enabled;
  registerGlobalHotkey();
});

ipcMain.on('twodo:set-mini-mode', (_event, enabled) => {
  setMiniMode(enabled);
});

ipcMain.on('twodo:set-mini-pinned', (_event, enabled) => {
  if (!mainWindow || !miniModeEnabled) return;
  mainWindow.setAlwaysOnTop(!!enabled, 'screen-saver');
});

ipcMain.on('twodo:set-mini-size', (_event, size) => {
  if (!mainWindow || !miniModeEnabled || !size) return;
  const width = Math.max(260, Math.round(size.width || 0));
  const height = Math.max(200, Math.round(size.height || 0));
  if (!width || !height) return;
  mainWindow.setContentSize(width, height, true);
});

ipcMain.on('twodo:window-minimize', () => {
  if (!mainWindow) return;
  mainWindow.minimize();
});

ipcMain.on('twodo:window-toggle-maximize', () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('twodo:window-close', () => {
  if (!mainWindow) return;
  mainWindow.close();
});

app.whenReady().then(() => {
  createMainWindow();
  registerGlobalHotkey();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
