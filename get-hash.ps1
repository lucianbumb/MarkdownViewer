# Calculate SHA256 hash for Winget manifest

$installerPath = ".\dist\Markdown Viewer Setup 1.0.0.exe"

if (Test-Path $installerPath) {
    Write-Host "`n📦 Calculating SHA256 hash for Winget manifest...`n" -ForegroundColor Cyan
    
    $hash = Get-FileHash -Path $installerPath -Algorithm SHA256
    
    Write-Host "File: " -NoNewline
    Write-Host $installerPath -ForegroundColor Green
    Write-Host "`nSHA256: " -NoNewline
    Write-Host $hash.Hash -ForegroundColor Yellow
    
    Write-Host "`n✅ Copy this hash to:" -ForegroundColor Green
    Write-Host "   winget-manifest\ElgibeSolutions.MarkdownViewer.installer.yaml" -ForegroundColor Cyan
    Write-Host "   Replace: REPLACE_WITH_ACTUAL_SHA256_HASH`n" -ForegroundColor Gray
    
    # Copy to clipboard
    $hash.Hash | Set-Clipboard
    Write-Host "📋 Hash copied to clipboard!`n" -ForegroundColor Magenta
    
} else {
    Write-Host "❌ Installer not found. Run 'npm run build-win' first.`n" -ForegroundColor Red
}
