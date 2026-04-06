# Builds still-netlify-upload.zip with index.html at the ROOT of the archive.
# Use this zip in Netlify: Deploys -> Add deploys -> Deploy manually (drag & drop).
# Do NOT zip the whole project folder with File Explorer if it includes .git — that often fails or is huge.

$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

$files = @(
    "index.html", "cart.html", "checkout.html",
    "styles.css", "script.js",
    "sitemap.xml", "robots.txt",
    "urban-chic.jpg",
    "netlify.toml"
)

$missing = @()
foreach ($f in $files) {
    if (-not (Test-Path (Join-Path $here $f))) { $missing += $f }
}
if ($missing.Count -gt 0) {
    Write-Warning "Missing files: $($missing -join ', ')"
}

$temp = Join-Path $here "_netlify_zip_staging"
if (Test-Path $temp) { Remove-Item -Recurse -Force $temp }
New-Item -ItemType Directory -Path $temp | Out-Null

foreach ($f in $files) {
    $src = Join-Path $here $f
    if (Test-Path $src) {
        Copy-Item $src (Join-Path $temp $f)
    }
}

$zipName = "still-netlify-upload.zip"
$zipPath = Join-Path $here $zipName
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }

Compress-Archive -Path (Join-Path $temp "*") -DestinationPath $zipPath -Force
Remove-Item -Recurse -Force $temp

Write-Host "OK: Created $zipPath"
Write-Host "In Netlify: Site -> Deploys -> Deploy manually -> upload this zip (not the whole project folder)."
Write-Host ""
Write-Host "If the website will NOT accept the upload, use the CLI instead (no browser upload):"
Write-Host "  See NETLIFY-UPLOAD-HELP.txt  and  deploy-netlify-cli.ps1"
