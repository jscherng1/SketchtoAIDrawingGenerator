# 草圖 AI 輔助繪製產生器

這是一個純前端草圖工具，搭配本機 Node server 連接 OpenAI Image API。預設仍可使用模擬模式；切到「真正 AI API」後，會把畫板草圖送到本機 `/api/generate-image`，再由 server 呼叫 OpenAI。

## 啟動方式

1. 複製 `.env.example` 成 `.env`
2. 在 `.env` 填入你的 OpenAI API Key

```text
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_IMAGE_MODEL=gpt-image-1.5
OPENAI_CREDIT_BUDGET_USD=5
OPENAI_CREDIT_START_DATE=2026-06-01
OPENAI_CREDIT_INITIAL_SPENT_USD=0
OPENAI_ESTIMATED_IMAGE_COST_USD=0.05
PORT=8765
```

3. 啟動本機預覽服務

```powershell
node .\preview-server.js
```

4. 打開瀏覽器

```text
http://127.0.0.1:8765/
```

## 使用真正 AI 繪圖

1. 在頁面右側「AI API 設定」展開設定
2. 選擇「真正 AI API」
3. 如果 `.env` 已設定 `OPENAI_API_KEY`，API Key 欄位可以留空
4. 繪製或上傳草圖
5. 按「開始 AI 修飾」

## API 設計

- `GET /api/status`：確認本機 server 是否讀到 OpenAI API Key
- `POST /api/generate-image`：把草圖與 prompt 送到 OpenAI Image API

目前使用 OpenAI Image API 的 image edits endpoint，預設模型是 `gpt-image-1.5`。

## Credit 預算顯示

右上角的 `Credit` 會用 `.env` 裡的 `OPENAI_CREDIT_BUDGET_USD` 當作總預算，再嘗試讀取 OpenAI Costs API 計算已花費金額與剩餘預算。

如果 OpenAI Costs API 因權限或網路問題無法讀取，App 會改用本機估算：

- `OPENAI_CREDIT_INITIAL_SPENT_USD`：你在啟用本 App 紀錄前已經花掉的金額
- `OPENAI_ESTIMATED_IMAGE_COST_USD`：每次成功產圖先估算扣掉的金額
- `.openai-credit-usage.json`：本機產圖次數與估算花費紀錄

如果你原本加值 5 美金，設定：

```text
OPENAI_CREDIT_BUDGET_USD=5
```

如果之後再加碼 10 美金，改成：

```text
OPENAI_CREDIT_BUDGET_USD=15
```

`OPENAI_CREDIT_START_DATE` 是開始計算成本的日期。這個顯示是預算估算；實際帳務仍以 OpenAI Usage Dashboard / Billing 頁面為準。

如果你一週前買了 5 美金，已經產了幾張圖，但 Costs API 讀不到，可以先用 OpenAI Usage Dashboard 看到的大約花費填入：

```text
OPENAI_CREDIT_INITIAL_SPENT_USD=0.60
```

之後 App 成功產生圖片時，會再用本機紀錄往下扣估算額。
