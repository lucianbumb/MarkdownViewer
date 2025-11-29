# Markdown Viewer - Electron Edition

A fast, lightweight Markdown viewer for Windows 11 built with Electron.

## ✨ Features

- **Fast Rendering**: Optimized markdown parsing with marked.js
- **Syntax Highlighting**: Beautiful code blocks with highlight.js
- **Dark Mode**: Automatic dark mode support
- **Drag & Drop**: Drop markdown files directly onto the window
- **File Associations**: Open .md files from Windows Explorer
- **GitHub-Style**: Clean, familiar markdown rendering
- **Secure**: Sanitized HTML output with DOMPurify

## 🚀 Quick Start

### Development

```powershell
npm start
```

### Build Installer

```powershell
npm run build-win
```

This creates a Windows installer in `dist/` folder:
- `Markdown Viewer Setup 1.0.0.exe`

## 📦 Installation

1. Run `npm run build-win` to create the installer
2. Navigate to `dist/` folder
3. Run the `Markdown Viewer Setup 1.0.0.exe` installer
4. Follow the installation wizard
5. After installation, right-click any `.md` file
6. Select "Open with" → "Markdown Viewer"

The app will automatically register for `.md` and `.markdown` file extensions!

## 💻 Usage

- Click "📂 Open File" button to browse for markdown files
- Drag and drop `.md` files onto the window
- Right-click `.md` files in Windows Explorer and open with Markdown Viewer
- Double-click `.md` files after setting as default app

## 🎨 Supported Features

- Headers (H1-H6)
- Bold, italic, strikethrough
- Lists (ordered & unordered)
- Code blocks with syntax highlighting
- Inline code
- Tables
- Blockquotes
- Links
- Images
- Horizontal rules
- Task lists

## 📄 Supported File Extensions

- `.md`
- `.markdown`
- `.mdown`
- `.mkd`

## 🔧 Technologies

- **Electron**: Cross-platform desktop framework
- **Marked.js**: Fast markdown parser
- **Highlight.js**: Syntax highlighting
- **DOMPurify**: XSS protection
- **GitHub CSS**: Clean, professional styling

## 📦 Package Size

The installed app is approximately **80-120 MB** (includes Electron runtime).

## 🐛 Troubleshooting

If the app doesn't start:
1. Make sure Node.js is installed
2. Run `npm install` to reinstall dependencies
3. Try `npm start` to see any error messages

If file associations don't work:
1. Right-click a `.md` file
2. Choose "Open with" → "Choose another app"
3. Select "Markdown Viewer" and check "Always use this app"

## 📝 License

MIT
