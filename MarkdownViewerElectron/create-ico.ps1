# Generate multi-resolution ICO file from PNG
Add-Type -AssemblyName System.Drawing

$pngPath = "markdownviewer.png"
$icoPath = "build/icons/icon.ico"

# Load the source PNG
$sourcePng = [System.Drawing.Image]::FromFile((Resolve-Path $pngPath).Path)

# Create bitmaps for each required size
$sizes = @(16, 32, 48, 64, 128, 256)
$bitmaps = @()

foreach ($size in $sizes) {
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($sourcePng, 0, 0, $size, $size)
    $graphics.Dispose()
    $bitmaps += $bitmap
}

# Save as ICO
$stream = [System.IO.FileStream]::new($icoPath, [System.IO.FileMode]::Create)

# ICO header
$writer = [System.IO.BinaryWriter]::new($stream)
$writer.Write([uint16]0)  # Reserved
$writer.Write([uint16]1)  # Type (1 = ICO)
$writer.Write([uint16]$bitmaps.Count)  # Number of images

$offset = 6 + ($bitmaps.Count * 16)

# Write directory entries
foreach ($bitmap in $bitmaps) {
    $ms = New-Object System.IO.MemoryStream
    $bitmap.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $imageData = $ms.ToArray()
    $ms.Dispose()
    
    $width = if ($bitmap.Width -eq 256) { 0 } else { $bitmap.Width }
    $height = if ($bitmap.Height -eq 256) { 0 } else { $bitmap.Height }
    
    $writer.Write([byte]$width)
    $writer.Write([byte]$height)
    $writer.Write([byte]0)  # Color palette
    $writer.Write([byte]0)  # Reserved
    $writer.Write([uint16]1)  # Color planes
    $writer.Write([uint16]32)  # Bits per pixel
    $writer.Write([uint32]$imageData.Length)
    $writer.Write([uint32]$offset)
    
    $offset += $imageData.Length
}

# Write image data
foreach ($bitmap in $bitmaps) {
    $ms = New-Object System.IO.MemoryStream
    $bitmap.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $imageData = $ms.ToArray()
    $writer.Write($imageData)
    $ms.Dispose()
    $bitmap.Dispose()
}

$writer.Close()
$stream.Close()
$sourcePng.Dispose()

Write-Host "✓ Multi-resolution ICO created successfully!" -ForegroundColor Green
Write-Host "  Sizes included: $($sizes -join ', ')" -ForegroundColor Cyan
