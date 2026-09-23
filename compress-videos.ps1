$ErrorActionPreference = 'Stop'

# Compress the 8K *-web.mp4 videos back to web-friendly 1080p-level files.
# Output is written to *-web-new.mp4 first so the originals stay untouched.
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  throw 'ffmpeg was not found. Install FFmpeg and add its bin directory to PATH.'
}

$videoDir = Join-Path $PSScriptRoot 'assets\video'
$targets = 1..5

foreach ($n in $targets) {
  $input  = Join-Path $videoDir "$n-web.mp4"
  $output = Join-Path $videoDir "$n-web-new.mp4"

  if (-not (Test-Path -LiteralPath $input)) {
    Write-Warning "Missing input, skipping: $input"
    continue
  }
  if (Test-Path -LiteralPath $output) { Remove-Item $output -Force }

  Write-Host ("[{0}] compressing {1:N1} MB ..." -f $n, ((Get-Item $input).Length / 1MB))
  & ffmpeg -hide_banner -loglevel error -y `
    -i $input `
    -vf 'scale=1920:-2:flags=lanczos' `
    -c:v libx264 -profile:v high -preset medium -crf 27 -pix_fmt yuv420p `
    -c:a aac -b:a 128k `
    -movflags +faststart `
    $output

  if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $output)) {
    Write-Warning ("[{0}] conversion failed, original kept" -f $n)
    continue
  }

  $inSize  = (Get-Item $input).Length
  $outSize = (Get-Item $output).Length
  Write-Host ("[{0}] done: {1:N1} MB -> {2:N2} MB" -f $n, ($inSize / 1MB), ($outSize / 1MB))
}

Write-Host 'All done.'
