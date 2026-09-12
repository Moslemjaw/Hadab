Add-Type -AssemblyName System.Drawing

$src = "c:/Users/omen/Desktop/HADAB/client/public/PNG-HADAB-TIGHT.png"
$bmp = [System.Drawing.Bitmap]::new($src)
$w = $bmp.Width
$h = $bmp.Height

# Cream color from design palette: Cream-100 / Cream-200 (#F7EFE6 / #F2E8DD) -> RGB(247, 239, 230)
$creamBmp = [System.Drawing.Bitmap]::new($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.A -gt 0) {
            # Apply exact luxury warm cream color with the original pixel's anti-aliased alpha
            $creamBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($c.A, 247, 239, 230))
        } else {
            $creamBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$dest = "c:/Users/omen/Desktop/HADAB/client/public/PNG-HADAB-CREAM.png"
$creamBmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
$creamBmp.Dispose()
Write-Host "Successfully generated PNG-HADAB-CREAM.png with pure warm cream color!"
