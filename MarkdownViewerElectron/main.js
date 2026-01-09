const { app, BrowserWindow, ipcMain, dialog, globalShortcut, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let pendingFilePath = null;
let recentFiles = [];
const MAX_RECENT_FILES = 10;
const RECENT_FILES_PATH = path.join(app.getPath('userData'), 'recent-files.json');
const ICON_FILENAME = 'markdownviewer.ico';
const APP_USER_MODEL_ID = 'net.elgibesolutions.markdownviewer';

// Ensure a stable AppUserModelId as early as possible on Windows.
// This improves taskbar icon consistency (especially when launched via file association).
if (process.platform === 'win32') {
  app.setAppUserModelId(APP_USER_MODEL_ID);
}

function resolveIconPath() {
  const candidates = [];
  if (app.isPackaged) {
    // Installed/packaged app: prefer an icon next to the EXE (used by some shortcuts)
    // and then fall back to the resources directory.
    try {
      candidates.push(path.join(path.dirname(process.execPath), ICON_FILENAME));
    } catch {
      // ignore
    }
    candidates.push(path.join(process.resourcesPath, ICON_FILENAME));
  }
  candidates.push(path.join(__dirname, ICON_FILENAME));

  return candidates.find(candidate => fs.existsSync(candidate)) || null;
}

// Load recent files from disk
function loadRecentFiles() {
  try {
    if (fs.existsSync(RECENT_FILES_PATH)) {
      const data = fs.readFileSync(RECENT_FILES_PATH, 'utf-8');
      recentFiles = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading recent files:', error);
    recentFiles = [];
  }
}

// Save recent files to disk
function saveRecentFiles() {
  try {
    fs.writeFileSync(RECENT_FILES_PATH, JSON.stringify(recentFiles, null, 2));
  } catch (error) {
    console.error('Error saving recent files:', error);
  }
}

// Add file to recent files list
function addToRecentFiles(filePath) {
  // Remove if already exists
  recentFiles = recentFiles.filter(f => f !== filePath);
  // Add to beginning
  recentFiles.unshift(filePath);
  // Keep only MAX_RECENT_FILES
  recentFiles = recentFiles.slice(0, MAX_RECENT_FILES);
  // Save to disk
  saveRecentFiles();
  // Notify renderer
  if (mainWindow) {
    mainWindow.webContents.send('recent-files-updated', recentFiles);
  }
}

function createWindow(filePath = null) {
  const iconPath = resolveIconPath();
  const iconImage = iconPath ? nativeImage.createFromPath(iconPath) : null;
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 600,
    minHeight: 400,
    autoHideMenuBar: true,
    icon: iconImage && !iconImage.isEmpty() ? iconImage : (iconPath || undefined),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.platform === 'win32' && iconPath) {
    // Explicitly apply taskbar/window icon on Windows.
    // `setAppDetails` influences the taskbar icon for this window.
    try {
      mainWindow.setAppDetails({
        appId: APP_USER_MODEL_ID,
        appIconPath: iconPath,
        appIconIndex: 0,
        relaunchDisplayName: app.getName(),
      });
    } catch {
      // Best-effort; older Windows versions or shells may ignore this.
    }

    try {
      if (iconImage && !iconImage.isEmpty()) {
        mainWindow.setIcon(iconImage);
      }
    } catch {
      // Best-effort; fall back to packaged executable icon.
    }
  }

  // Remove the menu bar completely
  mainWindow.setMenuBarVisibility(false);

  mainWindow.loadFile('index.html');

  // Open file if provided as argument
  if (filePath) {
    pendingFilePath = filePath;
  }

  // Wait for the window to be ready
  mainWindow.webContents.on('did-finish-load', () => {
    if (pendingFilePath) {
      mainWindow.webContents.send('open-file', pendingFilePath);
      addToRecentFiles(pendingFilePath);
      pendingFilePath = null;
    }
    // Send recent files to renderer
    mainWindow.webContents.send('recent-files-updated', recentFiles);
  });
}

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  // Forward file-open attempts to the primary instance (Windows/Linux).
  app.on('second-instance', (event, argv) => {
    const possibleFilePath = argv.find(arg => arg && arg.match(/\.(md|markdown|mdown|mkd)$/i));
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
      if (possibleFilePath) {
        mainWindow.webContents.send('open-file', possibleFilePath);
        addToRecentFiles(possibleFilePath);
      }
    } else {
      createWindow(possibleFilePath || null);
    }
  });

  app.whenReady().then(() => {
  // Load recent files on startup
  loadRecentFiles();
  
  // Check if file was passed as argument (skip the first argument which is electron executable)
  const args = process.argv.slice(app.isPackaged ? 1 : 2);
  const filePath = args.find(arg => arg.match(/\.(md|markdown|mdown|mkd)$/i));
  
  createWindow(filePath);
  
  // Register global keyboard shortcuts after window is created
  globalShortcut.register('CommandOrControl+O', () => {
    if (mainWindow) {
      mainWindow.webContents.send('trigger-open-file');
    }
  });
  
  globalShortcut.register('CommandOrControl+R', () => {
    if (mainWindow) {
      mainWindow.webContents.send('trigger-recent-files');
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  });
}

// Handle opening file when app is already running
app.on('open-file', (event, filePath) => {
  event.preventDefault();
  if (mainWindow) {
    mainWindow.webContents.send('open-file', filePath);
    addToRecentFiles(filePath);
  } else {
    createWindow(filePath);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
});

// Handle file open dialog
ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown Files', extensions: ['md', 'markdown', 'mdown', 'mkd'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const content = fs.readFileSync(filePath, 'utf-8');
    addToRecentFiles(filePath);
    return { filePath, content };
  }
  return null;
});

// Handle file read
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    addToRecentFiles(filePath);
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get recent files
ipcMain.handle('get-recent-files', async () => {
  return recentFiles;
});

// Clear recent files
ipcMain.handle('clear-recent-files', async () => {
  recentFiles = [];
  saveRecentFiles();
  if (mainWindow) {
    mainWindow.webContents.send('recent-files-updated', recentFiles);
  }
});

// Add to recent files
ipcMain.handle('add-to-recent', async (event, filePath) => {
  addToRecentFiles(filePath);
  return true;
});
