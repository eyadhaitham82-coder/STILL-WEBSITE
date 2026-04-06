# Deploy this folder to Netlify WITHOUT using the website upload (fixes "can't upload" in the browser).
# Needs Node.js: https://nodejs.org (LTS)
#
# First time only:
#   1) npx netlify-cli login          (opens browser to authorize)
#   2) npx netlify-cli link           (pick your existing site "stilleg", or create one)
#
# Every deploy:
#   powershell -ExecutionPolicy Bypass -File .\deploy-netlify-cli.ps1

$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js is not installed. Install LTS from https://nodejs.org then run this script again."
    exit 1
}

Write-Host "Deploying folder: $here"
Write-Host "If this is your first time, run: npx netlify-cli login"
Write-Host "Then link the site: npx netlify-cli link"
Write-Host ""

# --prod = production deploy (live site). Omit for a draft URL first.
npx --yes netlify-cli deploy --prod --dir "$here"
