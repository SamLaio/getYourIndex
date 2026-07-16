$source = Join-Path $PSScriptRoot 'manifest.firefox.json'
$target = Join-Path $PSScriptRoot 'manifest.json'
Copy-Item -LiteralPath $source -Destination $target -Force
Write-Host "Switched to Firefox manifest: $target"
Get-Item -LiteralPath $target | Select-Object Name, Length, LastWriteTime
