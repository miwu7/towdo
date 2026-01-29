const { app, BrowserWindow, shell, Tray, Menu, nativeImage, globalShortcut, ipcMain } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;
let mainWindow = null;
let widgetWindow = null;
let tray = null;
let minimizeToTrayEnabled = false;
let globalHotkeyEnabled = false;
let widgetsEnabled = false;

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
    backgroundColor: '#f7f1f8',
    show: false,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
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

const createWidgetWindow = () => {
  if (widgetWindow) return widgetWindow;
  widgetWindow = new BrowserWindow({
    width: 320,
    height: 180,
    minWidth: 280,
    minHeight: 160,
    resizable: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    frame: false,
    transparent: false,
    backgroundColor: '#f7f1f8',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const rendererUrl = process.env.ELECTRON_RENDERER_URL;
  if (rendererUrl) {
    widgetWindow.loadURL(`${rendererUrl}?widget=1`);
  } else {
    widgetWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'), { query: { widget: '1' } });
  }

  widgetWindow.on('closed', () => {
    widgetWindow = null;
  });

  if (process.platform === 'darwin') {
    widgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  }

  return widgetWindow;
};

const setWidgetsEnabled = (enabled) => {
  widgetsEnabled = !!enabled;
  if (widgetsEnabled) {
    const win = createWidgetWindow();
    win.show();
  } else if (widgetWindow) {
    widgetWindow.close();
    widgetWindow = null;
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

ipcMain.on('twodo:set-widgets', (_event, enabled) => {
  setWidgetsEnabled(enabled);
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
