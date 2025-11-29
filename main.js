const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let pendingFilePath = null;
let recentFiles = [];
const MAX_RECENT_FILES = 10;
const RECENT_FILES_PATH = path.join(app.getPath('userData'), 'recent-files.json');

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
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 600,
    minHeight: 400,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, 'markdownviewer.png'),
  });

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

app.whenReady().then(() => {
  // Load recent files on startup
  loadRecentFiles();
  
  // Check if file was passed as argument (skip the first argument which is electron executable)
  const args = process.argv.slice(app.isPackaged ? 1 : 2);
  const filePath = args.find(arg => arg.match(/\.(md|markdown|mdown|mkd)$/i));
  
  createWindow(filePath);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

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
