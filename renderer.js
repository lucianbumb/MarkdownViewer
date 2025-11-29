const { ipcRenderer } = require('electron');
const { marked } = require('marked');
const hljs = require('highlight.js');
const DOMPurify = require('dompurify');
const fs = require('fs');

// Configure marked
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.error('Highlight error:', err);
      }
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true,
});

let recentFiles = [];

async function renderMarkdown(filePath, content) {
  try {
    const htmlContent = marked.parse(content);
    const sanitized = DOMPurify.sanitize(htmlContent);
    
    const contentEl = document.getElementById('content');
    const fileNameEl = document.getElementById('file-name');
    
    if (contentEl && fileNameEl) {
      contentEl.innerHTML = sanitized;
      const fileName = filePath.split(/[\\/]/).pop() || filePath;
      fileNameEl.textContent = fileName;
      document.title = `${fileName} - Markdown Viewer`;
    }
  } catch (error) {
    console.error('Error rendering markdown:', error);
    const contentEl = document.getElementById('content');
    if (contentEl) {
      contentEl.innerHTML = `<div class="welcome"><h1>Error</h1><p>Failed to load file: ${error.message}</p></div>`;
    }
  }
}

function updateRecentFilesList() {
  const listEl = document.getElementById('recent-files-list');
  if (!listEl) return;

  if (recentFiles.length === 0) {
    listEl.innerHTML = '<div class="recent-files-empty">No recent files</div>';
    return;
  }

  listEl.innerHTML = recentFiles.map(filePath => {
    const fileName = filePath.split(/[\\/]/).pop();
    return `<div class="recent-file-item" data-path="${filePath}" title="${filePath}">${fileName}</div>`;
  }).join('');

  // Add click handlers
  document.querySelectorAll('.recent-file-item').forEach(item => {
    item.addEventListener('click', async () => {
      const path = item.getAttribute('data-path');
      if (fs.existsSync(path)) {
        const content = fs.readFileSync(path, 'utf-8');
        await renderMarkdown(path, content);
        toggleRecentFilesDropdown();
      } else {
        alert('File not found: ' + path);
      }
    });
  });
}

function toggleRecentFilesDropdown() {
  const dropdown = document.getElementById('recent-files-dropdown');
  dropdown.classList.toggle('show');
}

// Open file button
document.getElementById('open-file-btn').addEventListener('click', async () => {
  const result = await ipcRenderer.invoke('open-file-dialog');
  if (result) {
    await renderMarkdown(result.filePath, result.content);
  }
});

// Recent files button
document.getElementById('recent-files-btn').addEventListener('click', () => {
  toggleRecentFilesDropdown();
});

// Clear recent files
document.getElementById('clear-recent').addEventListener('click', async () => {
  if (confirm('Clear all recent files?')) {
    await ipcRenderer.invoke('clear-recent-files');
    toggleRecentFilesDropdown();
  }
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const container = document.getElementById('recent-files-container');
  const dropdown = document.getElementById('recent-files-dropdown');
  if (!container.contains(e.target) && dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
  }
});

// Handle file drop
document.addEventListener('drop', async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];
    if (file.path.match(/\.(md|markdown|mdown|mkd)$/i)) {
      const content = fs.readFileSync(file.path, 'utf-8');
      await renderMarkdown(file.path, content);
    }
  }
});

document.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});

// Listen for file open from main process
ipcRenderer.on('open-file', async (event, filePath) => {
  if (filePath) {
    const result = await ipcRenderer.invoke('read-file', filePath);
    if (result.success) {
      await renderMarkdown(filePath, result.content);
    }
  }
});

// Listen for recent files updates
ipcRenderer.on('recent-files-updated', (event, files) => {
  recentFiles = files;
  updateRecentFilesList();
});

// Keyboard shortcuts
document.addEventListener('keydown', async (e) => {
  // Ctrl + O - Open file
  if (e.ctrlKey && e.key === 'o') {
    e.preventDefault();
    document.getElementById('open-file-btn').click();
  }
  
  // Ctrl + + (or Ctrl + =) - Increase zoom
  if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
    e.preventDefault();
    const content = document.getElementById('content');
    const currentZoom = parseFloat(content.style.fontSize || '16px');
    content.style.fontSize = (currentZoom + 2) + 'px';
  }
  
  // Ctrl + - - Decrease zoom
  if (e.ctrlKey && e.key === '-') {
    e.preventDefault();
    const content = document.getElementById('content');
    const currentZoom = parseFloat(content.style.fontSize || '16px');
    content.style.fontSize = Math.max(10, currentZoom - 2) + 'px';
  }
  
  // Ctrl + 0 - Reset zoom
  if (e.ctrlKey && e.key === '0') {
    e.preventDefault();
    const content = document.getElementById('content');
    content.style.fontSize = '';
  }
});

// Load recent files on startup
(async () => {
  recentFiles = await ipcRenderer.invoke('get-recent-files');
  updateRecentFilesList();
})();
