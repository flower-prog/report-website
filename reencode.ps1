$ffmpeg = "C:\Users\zjren\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"
$videoDir = Join-Path $PSScriptRoot 'assets\video'

# Videos to re-encode: 5 (HEVC->H264), then 2-4 (re-encode with better keyframes)
$videos = @(5, 2, 3, 4)

foreach ($n in $videos) {
  $original = Join-Path $videoDir "$n-web.mp4"
  $temp = Join-Path $videoDir "$n-web-temp.mp4"

  if (-not (Test-Path $original)) {
    Write-Host "SKIP (not found): $original"
    continue
  }
  $origSize = (Get-Item $original).Length
  Write-Host "[$n] Converting ($([math]::Round($origSize/1MB,1))MB) with -g 30..."

  & $ffmpeg -hide_banner -y -i $original `
    -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p `
    -g 30 -bf 0 `
    -c:a aac -b:a 128k `
    -movflags +faststart `
    -threads 4 `
    $temp 2>&1

  if ($LASTEXITCODE -ne 0) {
    Write-Host "  [$n] FFMPEG FAILED (exit $LASTEXITCODE) - original kept safe"
    if (Test-Path $temp) { Remove-Item $temp -Force }
    continue
  }

  if (-not (Test-Path $temp)) {
    Write-Host "  [$n] Temp file missing - original kept safe"
    continue
  }
  $tempSize = (Get-Item $temp).Length
  if ($tempSize -lt 1000) {
    Write-Host "  [$n] Temp file too small ($tempSize bytes) - original kept safe"
    Remove-Item $temp -Force
    continue
  }

  # Safe to replace
  Remove-Item $original -Force
  Rename-Item $temp "$n-web.mp4"
  $newSize = (Get-Item (Join-Path $videoDir "$n-web.mp4")).Length
  Write-Host "  [$n] OK: $([math]::Round($origSize/1MB,1))MB -> $([math]::Round($newSize/1MB,1))MB"
}
Write-Host 'Done.'
