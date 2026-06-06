# UPDATE_LOG — toefl-ielts-cursor_test

## 2026-06-06 — 首次推送 GitHub Pages

**Commit**: `init: TOEFL IELTS daily web cursor_test`  
**Live**: https://s07362022.github.io/toefl-ielts-cursor_test/

### 變更

- 建立 repo `toefl-ielts-cursor_test`（名稱含 cursor_test）
- 推送 Next.js 靜態站 + `public/data/`（Day 1–3）
- 啟用 GitHub Actions Pages 部署
- 新增 `scripts/push_github_pages.py`（對齊 stock `push_dashboard.py`）

### 推送指令

```powershell
$env:PYTHONIOENCODING='utf-8'
python F:\代碼\英文學習\cursor製作\scripts\push_github_pages.py
```
