Add-Type -AssemblyName System.Drawing

$src = "c:/Users/omen/Desktop/HADAB/client/public/PNG-HADAB.png"
$bmp = [System.Drawing.Bitmap]::new($src)
$w = $bmp.Width
$h = $bmp.Height

Write-Host "Total image dimensions: $w x $h"

$minX = $w; $maxX = 0; $minY = $h; $maxY = 0

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.A -gt 15) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Content bounds: minX=$minX maxX=$maxX minY=$minY maxY=$maxY"
$cw = $maxX - $minX
$ch = $maxY - $minY
Write-Host "Content size: $cw x $ch"

# Now tightly crop PNG-HADAB so there is zero empty space around the letters!
$rect = [System.Drawing.Rectangle]::new($minX, $minY, $cw, $ch)
$tightBmp = $bmp.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$tightBmp.Save("c:/Users/omen/Desktop/HADAB/client/public/PNG-HADAB-TIGHT.png", [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
$tightBmp.Dispose()
Write-Host "Saved PNG-HADAB-TIGHT.png!"
