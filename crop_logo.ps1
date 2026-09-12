Add-Type -AssemblyName System.Drawing

$srcPath = "C:/Users/omen/.gemini/antigravity/brain/80603103-11c0-4c27-85dc-872360c7a84f/.user_uploaded/media_1789162185584.png"
$bmp = [System.Drawing.Bitmap]::new($srcPath)
$w = $bmp.Width
$h = $bmp.Height

$minX = $w; $maxX = 0; $minY = $h; $maxY = 0

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Check if non-white / non-transparent
        if ($c.A -gt 20 -and ($c.R -lt 245 -or $c.G -lt 245 -or $c.B -lt 245)) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Bounds: minX=$minX maxX=$maxX minY=$minY maxY=$maxY"

# Add padding
$pad = 12
$cropX = [Math]::Max(0, $minX - $pad)
$cropY = [Math]::Max(0, $minY - $pad)
$cropW = [Math]::Min($w - $cropX, ($maxX - $minX) + ($pad * 2))
$cropH = [Math]::Min($h - $cropY, ($maxY - $minY) + ($pad * 2))

Write-Host "Crop: X=$cropX Y=$cropY W=$cropW H=$cropH"

$rect = [System.Drawing.Rectangle]::new($cropX, $cropY, $cropW, $cropH)
$croppedBmp = $bmp.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Make white/off-white background transparent, and create cream-colored version for dark footer
$creamBmp = [System.Drawing.Bitmap]::new($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $cropH; $y++) {
    for ($x = 0; $x -lt $cropW; $x++) {
        $c = $croppedBmp.GetPixel($x, $y)
        # Brightness calculation
        $brightness = ($c.R * 0.299 + $c.G * 0.587 + $c.B * 0.114)
        if ($brightness -gt 235) {
            # Fully transparent
            $croppedBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            $creamBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # Retain opacity based on darkness
            $alpha = [int][Math]::Max(0, [Math]::Min(255, (255 - $brightness) * 1.5))
            if ($alpha -gt 255) { $alpha = 255 }
            
            # For croppedBmp, keep original dark brown color with clean alpha
            $croppedBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 61, 45, 37))
            
            # For creamBmp (footer on dark brown bg #2E221B), use cream color #F7EFE6
            $creamBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 247, 239, 230))
        }
    }
}

$destDir = "c:/Users/omen/Desktop/HADAB/client/public"
$croppedBmp.Save("$destDir/hadab-wordmark.png", [System.Drawing.Imaging.ImageFormat]::Png)
$creamBmp.Save("$destDir/hadab-wordmark-light.png", [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
$croppedBmp.Dispose()
$creamBmp.Dispose()

Write-Host "Saved successfully!"
