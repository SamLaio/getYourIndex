$ErrorActionPreference = 'Stop'

$root = $PSScriptRoot
$release = Join-Path $root 'release'
$stage = Join-Path $root '_chrome_pack'
$manifest = Join-Path $root 'manifest.chrome.json'
$zipPath = Join-Path $release 'getYourIndex-chrome.zip'

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
    'background.js',
    'common.js',
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

  if (Test-Path -LiteralPath $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
  }

  Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $zipPath

  Get-Item -LiteralPath $zipPath | Select-Object Name, Length
}
finally {
  if (Test-Path -LiteralPath $stage) {
    Remove-Item -LiteralPath $stage -Recurse -Force
  }
}
