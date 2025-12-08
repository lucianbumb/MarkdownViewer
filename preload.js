const { contextBridge, ipcRenderer } = require('electron');

// Expose a minimal, safe API to the renderer
contextBridge.exposeInMainWorld('api', {
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  getRecent: () => ipcRenderer.invoke('get-recent-files'),
  clearRecent: () => ipcRenderer.invoke('clear-recent-files'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // Events
  onRecentFilesUpdated: (callback) => {
    const handler = (_event, files) => callback(files);
    ipcRenderer.on('recent-files-updated', handler);
    return () => ipcRenderer.removeListener('recent-files-updated', handler);
  },
  onOpenFile: (callback) => {
    const handler = (_event, filePath) => callback(filePath);
    ipcRenderer.on('open-file', handler);
    return () => ipcRenderer.removeListener('open-file', handler);
  }
});
