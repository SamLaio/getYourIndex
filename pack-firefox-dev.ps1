$ErrorActionPreference = 'Stop'

$root = $PSScriptRoot
$release = Join-Path $root 'release'
$stage = Join-Path $root '_firefox_dev_pack'
$manifest = Join-Path $root 'manifest.firefox.dev.json'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$zipPath = Join-Path $release "getYourIndex-firefox-dev-$stamp.zip"
$xpiPath = Join-Path $release "getYourIndex-firefox-dev-$stamp.xpi"

if (-not (Test-Path -LiteralPath $manifest)) {
  throw "Missing manifest: $manifest"
}

if (Test-Path -LiteralPath $stage) {
  Remove-Item -LiteralPath $stage -Recurse -Force
}

New-Item -ItemType Directory -Path $stage | Out-Null
New-Item -ItemType Directory -Path $release -Force | Out-Null

try {
  $files = @(
    'common.js',
    'background.js',
    'options.html',
    'options.css',
    'options.js',
    'icon16.png',
    'icon32.png',
    'icon48.png',
    'icon128.png'
  )

  Copy-Item -LiteralPath $manifest -Destination (Join-Path $stage 'manifest.json')

  foreach ($file in $files) {
    Copy-Item -LiteralPath (Join-Path $root $file) -Destination $stage
  }

  Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $zipPath
  Copy-Item -LiteralPath $zipPath -Destination $xpiPath -Force

  Get-Item -LiteralPath $zipPath, $xpiPath | Select-Object Name, Length
}
finally {
  if (Test-Path -LiteralPath $stage) {
    Remove-Item -LiteralPath $stage -Recurse -Force
  }
}
