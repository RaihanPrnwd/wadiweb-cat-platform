<#
.SYNOPSIS
  Skrip otomatisasi Git commit dan push untuk repositori Wadiweb CAT Platform.

.DESCRIPTION
  Melakukan staging, commit dengan pesan kustom/otomatis, penarikan (rebase),
  dan push ke branch aktif di origin dengan berbagai safety guard.

.PARAMETER Message
  Pesan commit. Jika kosong, akan menggunakan pesan terstruktur berbasis timestamp.

.PARAMETER PathSpec
  Target berkas spesifik yang ingin di-stage (default: '.' sesuai .gitignore).

.PARAMETER AllowMain
  Flag konfirmasi untuk mengizinkan push langsung ke branch utama (main/master).

.PARAMETER NoPull
  Lewati proses git pull --rebase sebelum push.

.EXAMPLE
  .\scripts\git-push.ps1 -Message "docs: perbarui panduan README"
  .\scripts\git-push.ps1 -AllowMain
#>

[CmdletBinding()]
param(
  [Parameter(Position = 0)]
  [string]$Message,

  [Parameter(Position = 1)]
  [string]$PathSpec = ".",

  [switch]$AllowMain,
  [switch]$NoPull
)

$ErrorActionPreference = "Stop"

# 1. Deteksi binary git
$gitCmd = "git"
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  $candidates = @(
    "C:\Program Files\Git\cmd\git.exe",
    "C:\Program Files\Git\bin\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe"
  )
  $found = $false
  foreach ($c in $candidates) {
    if (Test-Path $c) {
      $gitCmd = $c
      $found = $true
      break
    }
  }
  if (-not $found) {
    Write-Error "Git tidak ditemukan di PATH maupun lokasi instalasi standar. Pasang Git terlebih dahulu."
    exit 1
  }
}

function Invoke-Git {
  param([string[]]$Arguments)
  # -c safe.directory=* menangani proteksi dubious ownership di Windows
  & $gitCmd -c safe.directory="*" @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Gagal menjalankan: git $($Arguments -join ' ')"
  }
}

function Get-GitOutput {
  param([string[]]$Arguments)
  $out = & $gitCmd -c safe.directory="*" @Arguments
  return ($out -join "`n").Trim()
}

Write-Host "==> [1/5] Memeriksa status repositori..." -ForegroundColor Cyan

# 2. Cek branch aktif
$currentBranch = Get-GitOutput @("rev-parse", "--abbrev-ref", "HEAD")
if (-not $currentBranch) {
  Write-Error "Tidak dapat mendeteksi branch aktif."
  exit 1
}
Write-Host "    Branch aktif: $currentBranch" -ForegroundColor Gray

# 3. Safety Guard: Proteksi Branch Utama
if (($currentBranch -eq "main" -or $currentBranch -eq "master") -and -not $AllowMain) {
  Write-Host ""
  Write-Host "[PERINGATAN] Anda berada di branch produksi utama ($currentBranch)." -ForegroundColor Yellow
  $confirm = Read-Host "Apakah Anda yakin ingin push ke $currentBranch? (Ketik 'y' untuk lanjut)"
  if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Warning "Operasi push dibatalkan oleh pengguna."
    exit 0
  }
}

# 4. Cek perubahan
$statusOutput = Get-GitOutput @("status", "--porcelain")
if (-not $statusOutput) {
  Write-Host "[INFO] Tidak ada perubahan berkas untuk di-commit (working tree clean)." -ForegroundColor Green
  exit 0
}

# 5. Staging berkas
Write-Host "==> [2/5] Menambahkan perubahan ke staging (target: $PathSpec)..." -ForegroundColor Cyan
Invoke-Git @("add", $PathSpec)

# Cek kembali apakah ada yang masuk staged
$stagedOutput = Get-GitOutput @("diff", "--cached", "--name-only")
if (-not $stagedOutput) {
  Write-Host "[INFO] Tidak ada berkas yang masuk ke index staging." -ForegroundColor Yellow
  exit 0
}

# 6. Menentukan Commit Message
if (-not $Message -or $Message.Trim() -eq "") {
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $changedFiles = ($stagedOutput -split "`n").Count
  $Message = "chore(update): sinkronisasi $changedFiles berkas ($timestamp)"
}

Write-Host "==> [3/5] Membuat commit: '$Message'..." -ForegroundColor Cyan
Invoke-Git @("commit", "-m", $Message)

# 7. Sinkronisasi (Pull Rebase) jika remote terkonfigurasi
$remotes = Get-GitOutput @("remote")
if ($remotes -and -not $NoPull) {
  Write-Host "==> [4/5] Memeriksa pembaruan dari remote (pull --rebase)..." -ForegroundColor Cyan
  try {
    Invoke-Git @("pull", "--rebase", "origin", $currentBranch)
  } catch {
    Write-Warning "Konflik atau gagal pull otomatis. Harap selesaikan konflik atau jalankan 'git rebase --abort'."
    exit 1
  }
} else {
  Write-Host "==> [4/5] Melewati pull remote..." -ForegroundColor Gray
}

# 8. Push ke origin
if ($remotes) {
  Write-Host "==> [5/5] Melakukan push ke origin/$currentBranch..." -ForegroundColor Cyan
  Invoke-Git @("push", "origin", $currentBranch)
  Write-Host ""
  Write-Host "[SUKSES] Seluruh perubahan berhasil di-push ke https://github.com/RaihanPrnwd/wadiweb-cat-platform ($currentBranch)!" -ForegroundColor Green
} else {
  Write-Host "[INFO] Tidak ada remote terkonfigurasi. Commit tersimpan di lokal." -ForegroundColor Yellow
}
