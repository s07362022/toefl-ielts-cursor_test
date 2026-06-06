# TOEFL / IELTS 每日微課程（cursor_test）

GitHub Pages 線上版，repo 名稱含 **cursor_test**。

## 線上網址（推送並啟用 Pages 後）

https://s07362022.github.io/toefl-ielts-cursor_test/

## 首次上傳 GitHub

1. 到 GitHub 建立 **空 repo**（不要勾 README）  
   名稱：`toefl-ielts-cursor_test`

2. 在本機執行：

```powershell
cd "F:\代碼\英文學習\cursor製作"
.\scripts\push-to-github.ps1 -Message "init: TOEFL IELTS daily web"
```

3. GitHub repo → **Settings → Pages**  
   - Source：**GitHub Actions**（workflow 已含在 `.github/workflows/deploy-pages.yml`）

4. 等 Actions 跑完，即可用上方網址開啟。

## 每日更新（不跑本機網頁）

在 `F:\代碼\英文學習` 執行管線並推送 GitHub：

```bash
python automation/run_daily_pipeline.py --push-github
```

或對 Cursor 說 **「每日英文學習並推送 GitHub」**。

流程：產生課程 → 寄 Gmail → 複製 `public/data/` → `git push` → GitHub Actions 自動部署。

## 本機開發（選用，可略過）

```bash
npm install
npm run dev
```

GitHub Pages 建置：

```bash
npm run build:github
```

產出在 `out/` 目錄。
