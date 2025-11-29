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

```powershell
npm install
npm start
```

## 📦 Installation

### Install via Windows Package Manager (winget)

The easiest way to install Markdown Viewer is through winget:

```powershell
winget install ElgibeSolutions.MarkdownViewer
```

The app will be available soon via winget!

### Download Installer

Download the latest installer from [GitHub Releases](https://github.com/lucianbumb/MarkdownViewer/releases)

The app will automatically register for `.md` and `.markdown` file extensions.

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
