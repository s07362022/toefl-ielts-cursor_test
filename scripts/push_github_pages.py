#!/usr/bin/env python3
"""
一鍵推送英文學習網站到 GitHub Pages（對齊 stock-dashboard 的 push_dashboard.py 流程）。

用法:
    python scripts/push_github_pages.py
    python scripts/push_github_pages.py --message "update: Day 3 lesson"

Repo: https://github.com/s07362022/toefl-ielts-cursor_test
Live: https://s07362022.github.io/toefl-ielts-cursor_test/
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parents[1]
REPO_NAME = "toefl-ielts-cursor_test"
GITHUB_OWNER = "s07362022"
REMOTE_URL = f"https://github.com/{GITHUB_OWNER}/{REPO_NAME}.git"
LIVE_URL = f"https://{GITHUB_OWNER}.github.io/{REPO_NAME}/"
TW_TZ = timezone(timedelta(hours=8))


def run(cmd: list[str], cwd: Path = REPO_DIR, check: bool = True) -> subprocess.CompletedProcess[str]:
    """執行指令並輸出結果。"""
    print(f"  $ {' '.join(cmd)}")
    result = subprocess.run(
        cmd,
        cwd=str(cwd),
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    if result.stdout.strip():
        print(result.stdout.strip())
    if result.stderr.strip():
        print(result.stderr.strip())
    if check and result.returncode != 0:
        raise RuntimeError(f"Command failed ({result.returncode}): {' '.join(cmd)}")
    return result


def get_github_token() -> tuple[str, str]:
    """從 git credential helper 取得 GitHub 憑證（與 stock-dashboard 相同機制）。"""
    proc = subprocess.run(
        ["git", "credential", "fill"],
        input="protocol=https\nhost=github.com\n\n",
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=True,
    )
    username = "x-access-token"
    token = ""
    for line in proc.stdout.splitlines():
        if line.startswith("username="):
            username = line.split("=", 1)[1]
        elif line.startswith("password="):
            token = line.split("=", 1)[1]
    if not token:
        raise RuntimeError("無法從 git credential 取得 GitHub token，請先成功 push 過任一 repo。")
    return username, token


def ensure_remote_repo() -> None:
    """若遠端 repo 不存在，透過 GitHub API 建立（需本機 git 已登入）。"""
    _, token = get_github_token()
    api_url = "https://api.github.com/user/repos"
    payload = json.dumps(
        {
            "name": REPO_NAME,
            "description": "TOEFL/IELTS daily lesson web (cursor_test)",
            "private": False,
            "has_issues": True,
        }
    ).encode("utf-8")
    req = urllib.request.Request(
        api_url,
        data=payload,
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
            "User-Agent": "toefl-ielts-cursor-test-push",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            print(f"[OK] Created GitHub repo: {REPO_NAME} (HTTP {resp.status})")
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        if exc.code == 422 and "already exists" in body.lower():
            print(f"[OK] Remote repo already exists: {REPO_NAME}")
            return
        if exc.code == 401:
            raise RuntimeError("GitHub API 401：憑證失效，請重新登入 git/gh。") from exc
        raise RuntimeError(f"GitHub API failed ({exc.code}): {body}") from exc


def ensure_git_repo() -> None:
    """初始化 git 與 remote（若尚未設定）。"""
    if not (REPO_DIR / ".git").is_dir():
        run(["git", "init"], cwd=REPO_DIR)
        run(["git", "branch", "-M", "main"], cwd=REPO_DIR)

    remotes = run(["git", "remote"], cwd=REPO_DIR, check=False).stdout.strip().splitlines()
    if "origin" not in remotes:
        run(["git", "remote", "add", "origin", REMOTE_URL], cwd=REPO_DIR)
    else:
        run(["git", "remote", "set-url", "origin", REMOTE_URL], cwd=REPO_DIR)


def main() -> int:
    parser = argparse.ArgumentParser(description="Push toefl-ielts-cursor_test to GitHub Pages")
    parser.add_argument("--message", help="Custom commit message")
    parser.add_argument("--skip-create", action="store_true", help="Skip GitHub API repo create check")
    args = parser.parse_args()

    if not REPO_DIR.is_dir():
        print(f"[ERROR] Repo dir not found: {REPO_DIR}")
        return 1

    now = datetime.now(TW_TZ)
    date_str = now.strftime("%Y-%m-%d")
    time_str = now.strftime("%H:%M")
    commit_msg = args.message or f"Daily update {date_str} {time_str}"

    print(f"\n[1/4] Ensure GitHub repo exists ({REPO_NAME})...")
    if not args.skip_create:
        ensure_remote_repo()

    print(f"\n[2/4] Ensure local git repo...")
    ensure_git_repo()

    print(f"\n[3/4] Stage changes...")
    run(["git", "add", "-A"], cwd=REPO_DIR)
    status = run(["git", "status", "--porcelain"], cwd=REPO_DIR, check=False)
    if not status.stdout.strip():
        print("\n[DONE] No changes to commit.")
        print(f"  Live: {LIVE_URL}")
        return 0

    print(f"\n[4/4] Commit & push: {commit_msg}")
    run(["git", "commit", "-m", commit_msg], cwd=REPO_DIR)
    result = run(["git", "push", "-u", "origin", "main"], cwd=REPO_DIR, check=False)

    if result.returncode != 0:
        print("\n[WARN] Push failed. Try manually:")
        print(f'  cd "{REPO_DIR}"')
        print("  git push -u origin main")
        return result.returncode

    print("\n[DONE] GitHub updated!")
    print(f"  Repo: {REMOTE_URL}")
    print(f"  Live: {LIVE_URL}")
    print("  GitHub Actions 部署約 1–3 分鐘後生效。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
