# Publishing to Winget

## Prerequisites

1. **GitHub Account**: You'll need a GitHub account to submit to winget
2. **Signed Installer**: Your installer must be code-signed (already done ✅)
3. **Public URL**: Host the installer somewhere publicly accessible

## Steps to Publish

### 1. Upload Your Installer

Upload `Markdown Viewer Setup 1.0.0.exe` to a publicly accessible location:
- GitHub Releases (recommended)
- Your website (https://elgibesolutions.net/)
- Azure Blob Storage
- Any CDN

**Example using GitHub Releases:**
1. Create a GitHub repository for the app
2. Go to Releases → Create new release
3. Tag: `v1.0.0`
4. Upload: `Markdown Viewer Setup 1.0.0.exe`
5. Publish release
6. Copy the download URL

### 2. Generate Winget Manifest

Use the winget manifest creator tool:

```powershell
# Install winget-create if you don't have it
winget install wingetcreate

# Create manifest (replace URL with your actual download URL)
wingetcreate new https://your-url.com/Markdown-Viewer-Setup-1.0.0.exe
```

This will prompt you for:
- Package Identifier: `ElgibeSolutions.MarkdownViewer`
- Publisher: `ElgibeSolutions`
- Package Name: `Markdown Viewer`
- Version: `1.0.0`
- License: `MIT`
- Description: (use the one from package.json)
- Homepage: `https://elgibesolutions.net/`

### 3. Submit to Winget

The tool will automatically:
1. Fork the winget-pkgs repository
2. Create a branch with your manifest
3. Open a pull request

Or manually:
1. Fork https://github.com/microsoft/winget-pkgs
2. Add manifests to: `manifests/e/ElgibeSolutions/MarkdownViewer/1.0.0/`
3. Create PR with title: `New Package: ElgibeSolutions.MarkdownViewer version 1.0.0`

### 4. Wait for Review

Microsoft team will review (usually 1-3 days):
- Verify installer hash
- Check code signature
- Test installation
- Approve or request changes

### 5. After Approval

Users can install via:
```powershell
winget install ElgibeSolutions.MarkdownViewer
```

## Manifest Files Created

Three manifest files will be generated in `manifests/elgibesolutions/markdownviewer/1.0.0/`:

### ElgibeSolutions.MarkdownViewer.yaml
```yaml
PackageIdentifier: ElgibeSolutions.MarkdownViewer
PackageVersion: 1.0.0
DefaultLocale: en-US
ManifestType: version
ManifestVersion: 1.6.0
```

### ElgibeSolutions.MarkdownViewer.locale.en-US.yaml
```yaml
PackageIdentifier: ElgibeSolutions.MarkdownViewer
PackageVersion: 1.0.0
PackageLocale: en-US
Publisher: ElgibeSolutions
PublisherUrl: https://elgibesolutions.net/
PackageName: Markdown Viewer
PackageUrl: https://elgibesolutions.net/
License: MIT
ShortDescription: Quick and easy Markdown file viewer
Description: Quick and easy Markdown file viewer. In the world of AI, countless .md files are created daily. This tool provides instant viewing of markdown files with beautiful rendering, syntax highlighting, and seamless integration with Windows Explorer. Set it as your default .md viewer for effortless access.
Tags:
- markdown
- viewer
- md
- file-viewer
- ai
- documentation
ManifestType: defaultLocale
ManifestVersion: 1.6.0
```

### ElgibeSolutions.MarkdownViewer.installer.yaml
```yaml
PackageIdentifier: ElgibeSolutions.MarkdownViewer
PackageVersion: 1.0.0
Platform:
- Windows.Desktop
MinimumOSVersion: 10.0.0.0
InstallerType: nullsoft
Scope: user
InstallModes:
- interactive
- silent
UpgradeBehavior: install
FileExtensions:
- md
- markdown
Installers:
- Architecture: x64
  InstallerUrl: https://your-url.com/Markdown-Viewer-Setup-1.0.0.exe
  InstallerSha256: [AUTO-GENERATED]
ManifestType: installer
ManifestVersion: 1.6.0
```

## Quick Start Script

I've included a template in `winget-manifest/` folder. Update the installer URL and run:

```powershell
cd winget-manifest
wingetcreate update ElgibeSolutions.MarkdownViewer -u https://your-url.com/Markdown-Viewer-Setup-1.0.0.exe -v 1.0.0
```

## Update Process (Future Versions)

For version 1.0.1+:

```powershell
wingetcreate update ElgibeSolutions.MarkdownViewer -u https://your-url.com/new-installer-url.exe -v 1.0.1
```

This will:
1. Update the manifest
2. Calculate new hash
3. Create PR automatically

## Testing Before Submission

Test the manifest locally:

```powershell
# Validate manifest
winget validate --manifest .\manifests\e\ElgibeSolutions\MarkdownViewer\1.0.0\

# Test installation
winget install --manifest .\manifests\e\ElgibeSolutions\MarkdownViewer\1.0.0\ElgibeSolutions.MarkdownViewer.yaml
```

## Resources

- Winget Packages Repo: https://github.com/microsoft/winget-pkgs
- Manifest Documentation: https://github.com/microsoft/winget-pkgs/tree/master/doc
- Winget Create Tool: https://github.com/microsoft/winget-create

## Company Branding

Your app now includes:
- ✅ ElgibeSolutions in package.json author
- ✅ https://elgibesolutions.net/ as homepage
- ✅ Company name in toolbar (top-right)
- ✅ Company info on welcome screen
- ✅ Copyright notice in build
- ✅ AppId: net.elgibesolutions.markdownviewer
