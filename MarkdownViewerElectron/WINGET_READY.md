# ✅ Markdown Viewer - Ready for Winget!

## 🎉 Build Complete with ElgibeSolutions Branding

Your Markdown Viewer app is now ready for Winget publication!

## 🏢 ElgibeSolutions Branding Added

### In the App
- ✅ **Company name in toolbar** (top-right corner, clickable)
- ✅ **Company link**: https://elgibesolutions.net/
- ✅ **Welcome screen**: Shows ElgibeSolutions branding
- ✅ **Copyright notice**: "Copyright © 2025 ElgibeSolutions"

### In package.json
- ✅ **Author**: ElgibeSolutions
- ✅ **Homepage**: https://elgibesolutions.net/
- ✅ **Publisher**: ElgibeSolutions
- ✅ **AppId**: net.elgibesolutions.markdownviewer
- ✅ **Copyright**: Copyright © 2025 ElgibeSolutions

## 📦 Build Artifacts

Located in: `d:\Kit\MarkDownViewer\MarkdownViewerElectron\dist\`

- **`Markdown Viewer Setup 1.0.0.exe`** - Signed installer for Winget
- **`Markdown Viewer 1.0.0.appx`** - Microsoft Store package (if needed later)

**SHA256 Hash** (for Winget manifest):
```
95B56CD0BEA6DC5165693DA6EB7632ACB5A3AB21DD555AB63E956EB52E19ED9F
```

## 🚀 Publishing to Winget - Quick Start

### Step 1: Host the Installer

Upload `Markdown Viewer Setup 1.0.0.exe` to a public URL. Options:

**Option A: GitHub Releases** (Recommended)
1. Create repo: https://github.com/elgibesolutions/markdown-viewer
2. Create release: Tag `v1.0.0`
3. Upload the installer
4. Copy the download URL

**Option B: Your Website**
Upload to: https://elgibesolutions.net/downloads/markdown-viewer/

### Step 2: Update Winget Manifest

Edit `winget-manifest\ElgibeSolutions.MarkdownViewer.installer.yaml`:

Replace:
```yaml
InstallerUrl: https://github.com/YOUR-USERNAME/markdown-viewer/releases/download/v1.0.0/Markdown.Viewer.Setup.1.0.0.exe
InstallerSha256: REPLACE_WITH_ACTUAL_SHA256_HASH
```

With:
```yaml
InstallerUrl: YOUR_ACTUAL_PUBLIC_URL
InstallerSha256: 95B56CD0BEA6DC5165693DA6EB7632ACB5A3AB21DD555AB63E956EB52E19ED9F
```

### Step 3: Submit to Winget

**Using wingetcreate (Easiest):**
```powershell
# Install tool (one time)
winget install wingetcreate

# Submit
cd winget-manifest
wingetcreate submit .
```

This will:
1. Fork microsoft/winget-pkgs
2. Create branch
3. Commit manifests
4. Open pull request

**Manual submission:**
1. Fork: https://github.com/microsoft/winget-pkgs
2. Create folder: `manifests/e/ElgibeSolutions/MarkdownViewer/1.0.0/`
3. Copy all 3 manifest files there
4. Create PR with title: `New Package: ElgibeSolutions.MarkdownViewer version 1.0.0`

### Step 4: Wait for Approval

Microsoft will review (1-3 days):
- ✅ Verify signature (you have this)
- ✅ Check manifest format
- ✅ Test installation
- Approve!

### Step 5: Users Install via Winget

After approval, users can:
```powershell
winget install ElgibeSolutions.MarkdownViewer
```

Or search:
```powershell
winget search "Markdown Viewer"
```

## 📋 Winget Manifest Files

All ready in `winget-manifest/` folder:

1. **ElgibeSolutions.MarkdownViewer.yaml** - Version info
2. **ElgibeSolutions.MarkdownViewer.locale.en-US.yaml** - Package details
3. **ElgibeSolutions.MarkdownViewer.installer.yaml** - Installer info (update URL!)

## ✨ Features Summary

- **Fast markdown rendering** with marked.js
- **Syntax highlighting** for code blocks
- **Recent files history** (last 10 files)
- **Dark mode support**
- **Drag & drop** support
- **File associations** (.md, .markdown)
- **Right-click integration**
- **No menu bar** (clean UI)
- **ElgibeSolutions branding**

## 🔧 Useful Commands

### Build
```powershell
npm run build-win        # Build installer
npm run postbuild        # Sign with company cert
```

### Get SHA256
```powershell
.\get-hash.ps1          # Calculate hash for Winget
```

### Test
```powershell
# Test installer
.\dist\Markdown Viewer Setup 1.0.0.exe

# Validate manifest
winget validate --manifest .\winget-manifest\
```

## 📝 Next Version Updates

When releasing v1.0.1+:

1. Update version in `package.json`
2. Build: `npm run build-win && npm run postbuild`
3. Get new hash: `.\get-hash.ps1`
4. Update manifest:
```powershell
wingetcreate update ElgibeSolutions.MarkdownViewer -u NEW_URL -v 1.0.1
```

## 📞 Support

- **Website**: https://elgibesolutions.net/
- **Company**: ElgibeSolutions

## ✅ Final Checklist

- [x] App built with all features
- [x] ElgibeSolutions branding added
- [x] Code signed with company certificate
- [x] Winget manifests created
- [x] SHA256 hash calculated
- [ ] Upload installer to public URL
- [ ] Update installer URL in manifest
- [ ] Submit to Winget repository

**You're ready to publish! Just upload the installer and submit the manifests! 🎉**
