// Using globals provided by included scripts in index.html
const marked = window.marked;
const hljs = window.hljs;
const DOMPurify = window.DOMPurify;

// Configure DOMPurify for safer sanitization
const purifyConfig = {
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  ADD_ATTR: ['target', 'rel'],
  FORBID_TAGS: ['style'],
  FORBID_ATTR: ['style']
};

// Custom renderer for marked to handle links safely
const renderer = new marked.Renderer();
const originalLinkRenderer = renderer.link.bind(renderer);

renderer.link = function(href, title, text) {
  // Call original renderer
  const html = originalLinkRenderer(href, title, text);
  
  // Add rel="noopener noreferrer" and target="_blank" for external links
  if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
    return html.replace('<a ', '<a rel="noopener noreferrer" target="_blank" ');
  }
  return html;
};

// Configure marked with security improvements
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.error('Highlight error:', err);
      }
    }
    // Limit languages for performance
    try {
      return hljs.highlightAuto(code, [
        'javascript', 'python', 'java', 'c', 'cpp', 'csharp', 
        'html', 'css', 'xml', 'json', 'sql', 'bash', 'shell',
        'typescript', 'markdown', 'yaml', 'dockerfile'
      ]).value;
    } catch (err) {
      console.error('Auto-highlight error:', err);
      return code;
    }
  },
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false,
  renderer: renderer
});

let recentFiles = [];

async function renderMarkdown(filePath, content) {
  try {
    const htmlContent = marked.parse(content);
    const sanitized = DOMPurify.sanitize(htmlContent, purifyConfig);
    
    const contentEl = document.getElementById('content');
    const fileNameEl = document.getElementById('file-name');
    
    if (contentEl && fileNameEl) {
      contentEl.innerHTML = sanitized;
      const fileName = filePath.split(/[\\/]/).pop() || filePath;
      fileNameEl.textContent = fileName;
      fileNameEl.title = filePath; // Show full path on hover
      document.title = `${fileName} - Markdown Viewer`;
      
      // Intercept clicks on external links to open them safely
      interceptExternalLinks();
    }
  } catch (error) {
    console.error('Error rendering markdown:', error);
    showError('Failed to render markdown', error.message);
  }
}

function showError(title, message) {
  const contentEl = document.getElementById('content');
  if (contentEl) {
    contentEl.innerHTML = `
      <div class="welcome error-message">
        <h1>⚠️ ${DOMPurify.sanitize(title)}</h1>
        <p>${DOMPurify.sanitize(message)}</p>
        <button onclick="document.getElementById('open-file-btn').click()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">
          Try Another File
        </button>
      </div>
    `;
  }
}

// Intercept clicks on external links to open them via the main process
function interceptExternalLinks() {
  const contentEl = document.getElementById('content');
  if (!contentEl) return;
  
  const links = contentEl.querySelectorAll('a[href^="http://"], a[href^="https://"]');
  links.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href) {
        const result = await window.api.openExternal(href);
        if (!result || !result.success) {
          console.error('Failed to open external link:', href, result?.error);
        }
      }
    });
  });
}

function updateRecentFilesList() {
  const listEl = document.getElementById('recent-files-list');
  if (!listEl) return;

  if (recentFiles.length === 0) {
    listEl.innerHTML = '<div class="recent-files-empty">No recent files</div>';
    return;
  }

  listEl.innerHTML = recentFiles.map((filePath, index) => {
    const fileName = filePath.split(/[\\/]/).pop();
    return `<div class="recent-file-item" 
                 data-path="${filePath}" 
                 title="${filePath}" 
                 role="menuitem" 
                 tabindex="${index === 0 ? '0' : '-1'}"
                 data-index="${index}">
              ${fileName}
            </div>`;
  }).join('');

  // Add click handlers
  document.querySelectorAll('.recent-file-item').forEach(item => {
    item.addEventListener('click', async () => {
      const path = item.getAttribute('data-path');
      const result = await window.api.readFile(path);
      if (result && result.success) {
        await renderMarkdown(path, result.content);
        toggleRecentFilesDropdown();
      } else {
        toggleRecentFilesDropdown();
        showError('File Not Found', `Cannot open file: ${path}\n\n${result?.error || 'File may have been moved or deleted.'}`);
      }
    });
    
    // Keyboard navigation
    item.addEventListener('keydown', (e) => {
      const items = Array.from(document.querySelectorAll('.recent-file-item'));
      const currentIndex = parseInt(item.getAttribute('data-index'));
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextItem = items[currentIndex + 1];
        if (nextItem) {
          nextItem.focus();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevItem = items[currentIndex - 1];
        if (prevItem) {
          prevItem.focus();
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        toggleRecentFilesDropdown();
        document.getElementById('recent-files-btn').focus();
      }
    });
  });
}

function toggleRecentFilesDropdown() {
  const dropdown = document.getElementById('recent-files-dropdown');
  const isShowing = dropdown.classList.toggle('show');
  
  // Set ARIA attributes
  const button = document.getElementById('recent-files-btn');
  button.setAttribute('aria-expanded', isShowing);
  
  if (isShowing) {
    // Focus first item when opened
    const firstItem = dropdown.querySelector('.recent-file-item');
    if (firstItem) {
      setTimeout(() => firstItem.focus(), 100);
    }
  }
}

// Open file button
document.getElementById('open-file-btn').addEventListener('click', async () => {
  const result = await window.api.openFileDialog();
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
    await window.api.clearRecent();
    toggleRecentFilesDropdown();
  }
});

// Add keyboard support for clear recent button
document.getElementById('clear-recent').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    document.getElementById('clear-recent').click();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    toggleRecentFilesDropdown();
    document.getElementById('recent-files-btn').focus();
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
      const result = await window.api.readFile(file.path);
      if (result && result.success) {
        await renderMarkdown(file.path, result.content);
      } else {
        showError('Failed to Read File', result?.error || 'Unable to read the dropped file.');
      }
    } else {
      showError('Invalid File Type', 'Please drop a Markdown file (.md, .markdown, .mdown, or .mkd)');
    }
  }
});

document.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});

// Listen for file open from main process
window.api.onOpenFile(async (filePath) => {
  if (filePath) {
    const result = await window.api.readFile(filePath);
    if (result && result.success) {
      await renderMarkdown(filePath, result.content);
    }
  }
});

// Listen for recent files updates
window.api.onRecentFilesUpdated((files) => {
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
  recentFiles = await window.api.getRecent();
  updateRecentFilesList();
})();

// Handle external links via main process
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a');
  if (!anchor) return;
  const href = anchor.getAttribute('href');
  if (href && /^(https?:)\/\//i.test(href)) {
    e.preventDefault();
    window.api.openExternal(href);
  }
});
