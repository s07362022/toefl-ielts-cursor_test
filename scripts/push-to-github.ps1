#Requires -Version 5.1
<#
.SYNOPSIS
  將 cursor製作 專案 push 到 GitHub（repo 名稱須含 cursor_test）。

.EXAMPLE
  cd "F:\代碼\英文學習\cursor製作"
  .\scripts\push-to-github.ps1 -Message "chore: update day 3 lessons"
#>

param(
    [string]$Message = "chore: update lesson data and site",
    [string]$RemoteUrl = "https://github.com/s07362022/toefl-ielts-cursor_test.git"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $root
Set-Location $repoRoot

if (-not (Test-Path ".git")) {
    git init
    git branch -M main
    git remote add origin $RemoteUrl
}

git add -A
$status = git status --porcelain
if (-not $status) {
    Write-Host "沒有變更可提交。"
    exit 0
}

git commit -m $Message
git push -u origin main
Write-Host "已推送至 $RemoteUrl"
Write-Host "GitHub Pages: https://s07362022.github.io/toefl-ielts-cursor_test/"
