# 威馬康健品牌網站

威馬康健官方品牌網站的 Astro 靜態網站專案。最新消息由 TinaCMS 管理，聯絡表單預留 Formspree，程式碼推送至 GitHub 後由 GitHub Actions 建置並發布到 Cloudflare Pages。

## 技術架構

```text
內容編輯者 → TinaCMS / TinaCloud → GitHub main branch
           → GitHub Actions → Astro 靜態建置 → Cloudflare Pages → 網站訪客

聯絡表單 → Formspree → Email 通知
```

- 前端：Astro 7，輸出靜態 HTML、CSS 與少量原生 JavaScript。
- 內容：TinaCMS，最新消息保存在 `src/content/news/*.md`。
- 表單：Formspree；endpoint 由環境變數提供，不寫死於程式碼。
- 託管：Cloudflare Pages，建置產物為 `dist/`。
- CI/CD：GitHub Actions；Pull Request 驗證建置，`main` 更新後自動發布。
- SEO：每頁 metadata、canonical、Open Graph、sitemap、robots.txt。

原有 Vinext、React Server Components、OpenAI Sites、Cloudflare Worker、D1 與 Drizzle starter 已移除。本專案不需要執行期伺服器或資料庫。

## 本機開發

需求：Node.js 22 或 24（`>=22.13.0 <25`）。TinaCMS 尚未支援 Node.js 26；專案提供 `.nvmrc`，使用 nvm 時可先執行 `nvm use`。

```bash
npm install
cp .env.example .env
npm run dev
```

網站預設位於 `http://127.0.0.1:4323`，TinaCMS 管理介面位於 `http://127.0.0.1:4323/admin/index.html`。本專案固定使用 4323，避免與電腦上既有的 `demo-tinacms-project`（4321／4322）衝突。

`npm run dev` 會分別啟動 TinaCMS 本機 API（4001）與 Astro（4323）。本機後台應顯示「Enter into edit mode」及「You are in local mode」，不需要 TinaCloud 登入。

只啟動 Astro、不啟動 TinaCMS：

```bash
npm run dev:astro
```

## 環境變數

複製 `.env.example` 為 `.env`，不要提交 `.env`。

| 變數 | 用途 | 必要性 |
| --- | --- | --- |
| `SITE_URL` | 正式站網址，用於 canonical、OG 與 sitemap | 正式環境必要 |
| `PUBLIC_TINA_CLIENT_ID` | TinaCloud 專案 Client ID | CMS 正式環境必要 |
| `TINA_TOKEN` | TinaCloud 唯讀建置 Token | CMS 正式建置必要 |
| `TINA_BRANCH` | TinaCMS 讀寫分支，正式環境使用 `main` | 建議設定 |
| `PUBLIC_FORMSPREE_ENDPOINT` | 完整 Formspree endpoint | 啟用表單時必要 |

如果 `PUBLIC_FORMSPREE_ENDPOINT` 仍是 `your-form-id`，表單只會執行瀏覽器驗證，不會傳送資料。

## 使用 TinaCMS 更新消息

1. 在 TinaCloud 建立專案並連接這個 GitHub repository。
2. 將 TinaCloud 提供的 Client ID 與 Token 設為本機或 GitHub secrets。
3. 開啟 `/admin/index.html` 並登入。
4. 在「最新消息」新增或編輯內容。
5. 儲存後 TinaCMS 會更新 `src/content/news/` 的 Markdown 並提交 GitHub。
6. `main` branch 的新 commit 會觸發 GitHub Actions，自動建置及發布。

消息模型定義在 `tina/config.ts`，欄位包括：

- 標題、分類、發布時間與摘要
- 封面圖片
- 首頁精選與草稿狀態
- Markdown rich text 內文
- SEO 標題與描述

Astro 同步在 `src/content.config.ts` 驗證內容 schema；不合規的內容會使 CI 建置失敗，避免錯誤資料直接上線。

## Formspree 設定

1. 在 Formspree 建立表單。
2. 取得類似 `https://formspree.io/f/abcdwxyz` 的 endpoint。
3. 本機寫入 `.env`：

   ```env
   PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/abcdwxyz
   ```

4. GitHub repository 建立同名 secret `PUBLIC_FORMSPREE_ENDPOINT`。
5. 在 Formspree 後台設定收件人、垃圾訊息防護、資料保存政策與通知規則。

正式啟用前應由品牌方確認隱私權政策、個資保存期限與資料處理地區。

## GitHub Actions 與 Cloudflare Pages

工作流程位於 `.github/workflows/deploy.yml`。

### 1. 建立 Cloudflare Pages 專案

本專案採 GitHub Actions Direct Upload，不要再另外開啟 Cloudflare 的 Git 自動建置，以免每次 commit 重複發布。

```bash
npx wrangler pages project create wimacare-brand-site --production-branch main
```

如使用其他 Cloudflare 專案名稱，建立 GitHub repository variable `CLOUDFLARE_PAGES_PROJECT`。

### 2. GitHub repository secrets

在 GitHub `Settings → Secrets and variables → Actions` 設定：

- `CLOUDFLARE_API_TOKEN`：具有 Account / Cloudflare Pages / Edit 權限。
- `CLOUDFLARE_ACCOUNT_ID`
- `PUBLIC_TINA_CLIENT_ID`
- `TINA_TOKEN`
- `PUBLIC_FORMSPREE_ENDPOINT`

設定 repository variables：

- `SITE_URL`：例如 `https://www.wimacare.jp`
- `CLOUDFLARE_PAGES_PROJECT`：預設為 `wimacare-brand-site`

### 3. 發布規則

- Pull Request：安裝鎖定版本並執行 Astro 靜態建置，不發布。
- Push 到 `main`：完整建置 TinaCMS Admin 與 Astro 網站，然後上傳 `dist/` 至 Cloudflare Pages。
- TinaCMS 更新消息產生的 `main` commit，也會走相同流程。

## 常用指令

```bash
npm run dev          # TinaCMS + Astro 本機開發
npm run dev:tina     # 僅 TinaCMS 本機 API（4001）
npm run dev:astro    # 僅 Astro（127.0.0.1:4323）
npm run build        # 完整 TinaCMS + Astro 正式建置
npm run build:local  # 不使用 TinaCloud 憑證，驗證 CMS + Astro 完整產物
npm run build:astro  # 僅建置網站，適合未設定 TinaCloud時驗證
npm run check        # Astro 型別／內容檢查與 Tina schema audit
npm run preview      # 預覽 dist
npm run deploy       # 手動發布至預設 Cloudflare Pages 專案
```

### 本機後台顯示 TinaCloud「Log in」

這表示目前只有 Astro 在執行，或瀏覽器開到其他占用 4321／4322 的專案。請停止舊的開發程序後，在本專案根目錄執行 `nvm use && npm run dev`，並只使用 `http://127.0.0.1:4323/admin/index.html`。終端機必須同時顯示 Tina API `http://localhost:4001/graphql` 與 Astro 4323 網址。

## 目錄結構

```text
src/
  components/        共用導覽、頁尾、頁首與消息卡
  content/news/      TinaCMS 管理的最新消息 Markdown
  layouts/           SEO 與全站框架
  pages/             Astro 頁面與消息動態路由
  styles/            全站響應式樣式
tina/config.ts       TinaCMS collection、媒體與 Git branch 設定
public/              OG、favicon、Cloudflare headers、robots 與 CMS admin 產物
.github/workflows/   GitHub Actions CI/CD
```

## 上線前內容待辦

- 取得正式 Logo、品牌規範、字型授權與產品攝影。
- 確認公司名稱、地址、客服電話、Email、LINE OA 與社群連結。
- 確認購物網正式網址、會員條款與跨站提示。
- 以正式授權名單取代通路示意資料。
- 所有保健食品名稱、成分、規格、功效與注意事項須完成法規及來源審核。
- 由法律顧問確認隱私權政策、Cookie／分析工具與 Formspree 個資流程。
- 正式網域若不是 `www.wimacare.jp`，同步修改 `SITE_URL` 與 `public/robots.txt`。

## 參考文件

- [Astro 部署至 Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [TinaCMS 與 Astro](https://tina.io/docs/frameworks/astro)
- [TinaCMS 正式環境](https://tina.io/docs/tinacloud/overview)
- [Cloudflare Pages GitHub Actions Direct Upload](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/)
