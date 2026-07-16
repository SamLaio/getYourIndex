$source = Join-Path $PSScriptRoot 'manifest.chrome.json'
$target = Join-Path $PSScriptRoot 'manifest.json'
Copy-Item -LiteralPath $source -Destination $target -Force
Write-Host "Switched to Chrome manifest: $target"
Get-Item -LiteralPath $target | Select-Object Name, Length, LastWriteTime
