# Markdown Viewer - Microsoft Store Edition

## 🎯 What's New

### Features Added
- ✅ **No Menu Bar**: Clean interface with hidden menu bar
- ✅ **Recent Files History**: Quick access to last 10 opened files
- ✅ **Modern Icons**: Using custom markdownviewer.png/svg icons
- ✅ **Microsoft Store Ready**: Configured for Windows Store submission
- ✅ **Code Signed**: Integrated with your company certificate

### Recent Files Feature
- Automatically tracks the last 10 opened markdown files
- Click the "🕒 Recent" button to see history
- Click any file to instantly reopen it
- "Clear History" option to reset the list
- Files are remembered across app restarts

## 🏗️ Building the App

### For Regular Windows Installation (NSIS)

```powershell
npm run build-win
```

This creates:
- `dist/Markdown Viewer Setup 1.0.0.exe` - Standard Windows installer
- Automatically signed with your company certificate (via post-build script)

### For Microsoft Store (APPX)

```powershell
npm run build-store
```

This creates:
- `dist/Markdown Viewer 1.0.0.appx` - Microsoft Store package
- Automatically signed with your company certificate

## 🔐 Code Signing Process

The app is configured to automatically sign all build artifacts using your `sign-files` command.

After running either build command, the post-build script (`post-build.js`) will:
1. Navigate to the `dist` folder
2. Run `sign-files sign all`
3. Sign all executables and installers

### Manual Signing

If automatic signing fails, you can manually sign:

```powershell
cd dist
sign-files sign all
```

## 📦 Microsoft Store Submission

### Step 1: Update Publisher Information

Before building for the Store, update `package.json` with your actual company details:

```json
"appx": {
  "publisher": "CN=Your Actual Company Name",
  "publisherDisplayName": "Your Company Display Name",
  "identityName": "YourCompanyID.MarkdownViewer"
}
```

### Step 2: Build the APPX Package

```powershell
npm run build-store
```

### Step 3: Test the Package

Install locally to test:

```powershell
Add-AppxPackage "dist\Markdown Viewer 1.0.0.appx"
```

### Step 4: Submit to Microsoft Store

1. Go to [Microsoft Partner Center](https://partner.microsoft.com/dashboard)
2. Create a new app submission
3. Upload the signed `.appx` file from `dist/`
4. Fill in the app details:
   - **Name**: Markdown Viewer
   - **Description**: (Use the description from package.json)
   - **Screenshots**: Take screenshots of the app in action
   - **Category**: Productivity
   - **Age rating**: Everyone

5. Submit for certification

## 📋 App Description for Store Listing

**Short Description:**
Quick and easy Markdown file viewer optimized for the AI era.

**Full Description:**
In the world of AI, countless .md files are created daily. Markdown Viewer provides instant, beautiful viewing of markdown files with:

✨ Features:
• Fast, lightweight markdown rendering
• Syntax highlighting for code blocks
• GitHub-style formatting
• Dark mode support
• Recent files history
• Drag & drop support
• Right-click context menu integration
• Set as default .md viewer

Perfect for developers, technical writers, and anyone working with markdown documentation. View README files, technical docs, AI-generated content, and more with just a click!

## 🎨 Store Assets Needed

Before submission, prepare:

1. **App Icon** (already included):
   - `markdownviewer.png` - Used for the app icon
   - `markdownviewer.svg` - Vector source

2. **Screenshots** (you need to create):
   - At least 1 screenshot (1366x768 or larger)
   - Show the app with a markdown file open
   - Show the recent files feature
   - Show both light and dark modes (optional)

3. **Store Logos** (create from markdownviewer.png):
   - 50x50px icon
   - 150x150px icon
   - 300x300px icon (recommended)

## 🔧 Configuration Files

### package.json
- Updated with Microsoft Store configuration
- APPX target added
- Publisher information (update before building)
- Enhanced description for AI era

### main.js
- Menu bar hidden and removed
- Recent files tracking (stored in userData)
- Automatic file history management

### renderer.js
- Recent files dropdown UI
- Click handlers for file history
- Clear history functionality

### styles.css
- Recent files dropdown styling
- Dark mode support for history UI

## ⚙️ File Association

The app automatically registers for:
- `.md` files
- `.markdown` files

After installation, users can:
- Right-click any .md file → Open with Markdown Viewer
- Set Markdown Viewer as the default app for .md files

## 🐛 Troubleshooting

### Build fails with signing error:
- Ensure `sign-files` command is in your PATH
- Check that your certificate is properly configured
- Try manual signing: `cd dist && sign-files sign all`

### APPX package doesn't install:
- Make sure publisher name matches your certificate
- Enable Developer Mode in Windows Settings
- Check that the certificate is trusted

### Recent files not showing:
- Files are stored in: `%APPDATA%/markdown-viewer/recent-files.json`
- Delete this file to reset history

## 📝 Version History

### v1.0.0
- Initial Microsoft Store release
- Added recent files history
- Removed menu bar for cleaner UI
- Microsoft Store packaging
- Code signing integration
- Enhanced description for AI/documentation use case

## 📞 Support

For issues or questions, contact your IT department or the development team.
