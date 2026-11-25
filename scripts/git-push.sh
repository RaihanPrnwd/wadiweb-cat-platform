#!/usr/bin/env bash
# ==============================================================================
# Skrip otomatisasi Git commit & push untuk repositori Wadiweb CAT Platform
# Kompatibel: Linux / macOS / Git Bash / WSL
# ==============================================================================

set -euo pipefail

COMMIT_MSG="${1:-}"
PATHSPEC="${2:-.}"
ALLOW_MAIN="${ALLOW_MAIN:-0}"

# Deteksi git
if ! command -v git &>/dev/null; then
  echo "Error: Git tidak terpasang atau tidak ada di PATH." >&2
  exit 1
fi

GIT_CMD="git -c safe.directory=*"

echo "==> [1/5] Memeriksa status repositori..."
CURRENT_BRANCH=$($GIT_CMD rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")

if [ -z "$CURRENT_BRANCH" ]; then
  echo "Error: Gagal mendeteksi branch aktif." >&2
  exit 1
fi

echo "    Branch aktif: $CURRENT_BRANCH"

# Safety Guard: Branch utama
if { [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; } && [ "$ALLOW_MAIN" != "1" ]; then
  echo ""
  echo -n "[PERINGATAN] Anda berada di branch utama ($CURRENT_BRANCH). Lanjutkan push? (y/N): "
  read -r CONFIRM
  if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "Operasi dibatalkan."
    exit 0
  fi
fi

# Cek apakah ada perubahan
if [ -z "$($GIT_CMD status --porcelain)" ]; then
  echo "[INFO] Working tree clean. Tidak ada perubahan untuk di-commit."
  exit 0
fi

# Staging
echo "==> [2/5] Staging perubahan (target: $PATHSPEC)..."
$GIT_CMD add "$PATHSPEC"

# Cek staged
if [ -z "$($GIT_CMD diff --cached --name-only)" ]; then
  echo "[INFO] Tidak ada berkas yang masuk ke index staging."
  exit 0
fi

# Commit message
if [ -z "$COMMIT_MSG" ]; then
  TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
  COMMIT_MSG="chore(update): sinkronisasi berkas ($TIMESTAMP)"
fi

echo "==> [3/5] Membuat commit: '$COMMIT_MSG'..."
$GIT_CMD commit -m "$COMMIT_MSG"

# Pull rebase jika remote ada
if $GIT_CMD remote &>/dev/null; then
  echo "==> [4/5] Memeriksa remote (pull --rebase origin $CURRENT_BRANCH)..."
  $GIT_CMD pull --rebase origin "$CURRENT_BRANCH" || {
    echo "Peringatan: Gagal melakukan rebase otomatis. Periksa konflik yang terjadi." >&2
    exit 1
  }

  echo "==> [5/5] Push ke origin/$CURRENT_BRANCH..."
  $GIT_CMD push origin "$CURRENT_BRANCH"
  echo ""
  echo "[SUKSES] Perubahan berhasil di-push ke $CURRENT_BRANCH!"
else
  echo "[INFO] Remote belum dikonfigurasi. Commit tersimpan di lokal."
fi
