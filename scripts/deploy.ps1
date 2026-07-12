# Deploy: build the static export and force-push ./out to gh-pages.
# GitHub Pages serves gh-pages as https://erezegzozim.com (CNAME inside out/).
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

npm run build
if ($LASTEXITCODE -ne 0) { throw "build failed" }
if (-not (Test-Path "out\CNAME")) { throw "out/CNAME missing - aborting" }
if (-not (Test-Path "out\.nojekyll")) { throw "out/.nojekyll missing - aborting" }

Set-Location "$root\out"
git init -q -b gh-pages
git config user.name "BarbossaAA"
git config user.email "168790392+BarbossaAA@users.noreply.github.com"
git config http.postBuffer 157286400
git add -A
git commit -q -m "deploy $(Get-Date -Format yyyy-MM-dd_HH-mm)"
git push -f https://github.com/BarbossaAA/erezegzozim.git gh-pages
Set-Location $root
Remove-Item "$root\out\.git" -Recurse -Force
Write-Output "DEPLOYED to gh-pages"
