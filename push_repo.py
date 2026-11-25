#!/usr/bin/env python3
"""
Skrip otomatisasi pembaruan dan push repositori Git untuk Wadiweb CAT Platform.
Mendeteksi binary git otomatis, menangani dubious ownership, staging, commit,
pull rebase otomatis, dan push ke GitHub origin.
"""

import os
import sys
import shutil
import subprocess
from datetime import datetime

# Daftar lokasi umum git.exe di Windows jika belum masuk PATH
GIT_CANDIDATES = [
    r"C:\Program Files\Git\cmd\git.exe",
    r"C:\Program Files\Git\bin\git.exe",
    r"C:\Program Files (x86)\Git\cmd\git.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Programs\Git\cmd\git.exe"),
]

def find_git():
    path_git = shutil.which("git")
    if path_git:
        return path_git
    for candidate in GIT_CANDIDATES:
        if os.path.isfile(candidate):
            return candidate
    return None

def run_git(git_path, args, capture=False, check=True):
    # -c safe.directory=* mengatasi issue dubious ownership di Windows
    cmd = [git_path, "-c", "safe.directory=*"] + args
    if capture:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding="utf-8", errors="replace")
        if check and res.returncode != 0:
            raise RuntimeError(f"Gagal menjalankan git {' '.join(args)}: {res.stderr.strip()}")
        return res
    else:
        res = subprocess.run(cmd)
        if check and res.returncode != 0:
            raise RuntimeError(f"Gagal menjalankan git {' '.join(args)} (exit code {res.returncode})")
        return res

def main():
    print("=" * 60)
    print("  WADIWEB CAT - REPOSITORY AUTO UPDATE & PUSH SCRIPT")
    print("=" * 60)

    git_path = find_git()
    if not git_path:
        print("[ERROR] Git tidak ditemukan di PATH maupun lokasi instalasi standar.")
        print("Harap instal Git for Windows dari https://git-scm.com/")
        sys.exit(1)

    print(f"[1/6] Binary Git terdeteksi: {git_path}")

    # 1. Cek apakah ada proses rebase yang tertunda/berkonflik
    res_status = run_git(git_path, ["status"], capture=True, check=False)
    if "rebase in progress" in res_status.stdout:
        print("\n[PERINGATAN] Terdeteksi proses rebase yang belum selesai.")
        print("Menyelesaikan commit rebase...")
        run_git(git_path, ["add", "."], capture=False, check=False)
        # GIT_EDITOR=true mencegah git membuka editor interaktif yang memblokir terminal
        env = os.environ.copy()
        env["GIT_EDITOR"] = "true"
        subprocess.run([git_path, "-c", "safe.directory=*", "rebase", "--continue"], env=env)

    # 2. Cek branch aktif
    res_branch = run_git(git_path, ["rev-parse", "--abbrev-ref", "HEAD"], capture=True)
    branch = res_branch.stdout.strip()
    print(f"[2/6] Branch aktif: {branch}")

    # 3. Cek perubahan di working tree
    res_porcelain = run_git(git_path, ["status", "--porcelain"], capture=True)
    changes = res_porcelain.stdout.strip()

    if changes:
        print(f"[3/6] Perubahan terdeteksi:\n{changes}")
        print("\nMenambahkan seluruh perubahan ke staging (git add .)...")
        run_git(git_path, ["add", "."])

        # Pesan commit
        msg = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else ""
        if not msg:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            msg = f"chore(update): sinkronisasi berkas repositori ({timestamp})"

        print(f"[4/6] Membuat commit: '{msg}'...")
        run_git(git_path, ["commit", "-m", msg], capture=False, check=False)
    else:
        print("[3/6] Working tree bersih (tidak ada perubahan berkas baru untuk di-stage).")

    # 4. Sinkronisasi dengan remote (Pull Rebase)
    print(f"[5/6] Sinkronisasi pembaruan dari remote (pull --rebase origin {branch})...")
    res_pull = run_git(git_path, ["pull", "--rebase", "origin", branch], capture=True, check=False)
    if res_pull.returncode != 0:
        print(f"Catatan pull: {res_pull.stderr.strip()}")
        if "CONFLICT" in res_pull.stdout or "CONFLICT" in res_pull.stderr:
            print("[INFO] Menyelesaikan konflik otomatis untuk README.md/berkas lokal...")
            run_git(git_path, ["add", "."], capture=False, check=False)
            run_git(git_path, ["rebase", "--continue"], capture=False, check=False)

    # 5. Push ke GitHub
    print(f"[6/6] Melakukan push ke origin {branch}...")
    try:
        run_git(git_path, ["push", "origin", branch])
        print("\n" + "=" * 60)
        print("  [SUKSES] Seluruh perubahan berhasil di-push ke GitHub!")
        print("  Repositori: https://github.com/RaihanPrnwd/wadiweb-cat-platform")
        print("=" * 60)
    except Exception as e:
        print(f"\n[GAGAL] Push ke remote gagal: {e}")
        print("Pastikan koneksi internet aktif dan kredensial GitHub sudah terautentikasi.")
        sys.exit(1)

if __name__ == "__main__":
    main()
