$ErrorActionPreference = 'Stop'

$root = $PSScriptRoot
$release = Join-Path $root 'release'
$stage = Join-Path $root '_firefox_pack'
$manifest = Join-Path $root 'manifest.firefox.json'
$version = (Get-Content -LiteralPath $manifest -Raw | ConvertFrom-Json).version
$zipPath = Join-Path $release 'getYourIndex-firefox.zip'
$xpiPath = Join-Path $release "getYourIndex-firefox-v$version.xpi"

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

  if (Test-Path -LiteralPath $xpiPath) {
    Remove-Item -LiteralPath $xpiPath -Force
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
