# 專案名稱：草圖 AI 輔助繪製產生器

# Sketch-to-AI Drawing Generator

## 一、專案目標

請建立一個網頁版的「草圖 AI 輔助繪製產生器」。

這是一個可以在PC、平板、手機瀏覽器上執行的網頁工具。使用者可以上傳草圖，或直接在畫面上繪製草圖，並可使用黑白線條或彩色筆刷進行繪製。完成草圖後，系統可以根據使用者輸入的作品名稱、草圖內容、是否保留顏色，以及 AI 修飾程度，產生一張經過 AI 輔助修飾的圖案。

第一版先完成前端功能與介面流程，可以先不串接真正 AI API，但程式架構需預留 AI API 串接位置。

---

## 二、使用情境

使用者想畫一個角色或物件，例如「毛後狗」。

使用者可以：

1. 輸入作品名稱：毛後狗
2. 上傳一張草圖圖片，或直接在畫板上繪製
3. 草圖可以是黑白線稿，也可以使用彩色筆刷
4. 選擇是否輸出：

   * 黑白草圖
   * 彩色草圖
5. 選擇 AI 修飾程度
6. 按下「開始 AI 修飾」
7. 產生一張保留原始構圖，但更完整、更美觀的圖案

---

## 三、主要功能需求

### 1. 作品名稱輸入

提供文字輸入欄位：

* Label：作品名稱
* Placeholder：例如：毛後狗
* 使用者輸入的名稱會成為 AI prompt 的重要關鍵字

---

### 2. 草圖來源選擇

提供兩種草圖來源：

#### A. 上傳圖片

使用者可以上傳圖片檔：

* PNG
* JPG
* JPEG
* WEBP

上傳後需顯示在「原始草圖區」。

#### B. 直接繪製草圖

提供 HTML Canvas 畫板，使用者可直接繪製草圖。

畫板需支援：

* 滑鼠繪圖
* 觸控繪圖
* 平板觸控筆
* 手機手指繪圖

---

## 四、畫板工具需求

畫板需包含以下工具：

### 1. 筆刷工具

使用者可以直接畫線。

功能：

* 選擇筆刷顏色
* 調整筆刷粗細
* 支援黑色線稿
* 支援彩色繪製

---

### 2. 顏色選擇

提供色彩選擇器：

* 黑色
* 白色
* 紅色
* 藍色
* 綠色
* 黃色
* 橘色
* 紫色
* 自訂顏色

也可以使用 `<input type="color">`。

---

### 3. 筆刷大小

提供滑桿調整筆刷大小：

* 最小：1px
* 最大：50px
* 預設：5px

---

### 4. 橡皮擦

提供橡皮擦工具。

功能：

* 可擦除草圖線條
* 可調整橡皮擦大小

---

### 5. 清除畫布

提供「清除畫布」按鈕。

點擊後清空目前畫板內容。

---

### 6. 復原功能

提供「復原」按鈕。

至少支援返回上一筆繪圖狀態。

---

### 7. 儲存草圖

提供「儲存草圖」按鈕。

可以將目前畫布輸出成 PNG 圖片。

---

## 五、草圖輸出模式

使用者可以選擇草圖輸出模式：

1. 黑白草圖
2. 彩色草圖

### 黑白草圖模式

AI 修飾時，盡量將草圖視為線稿。

Prompt 方向：

* 保留原始構圖
* 根據線稿補強造型
* 可重新上色或不上色

### 彩色草圖模式

AI 修飾時，盡量保留使用者畫出的顏色概念。

Prompt 方向：

* 保留草圖顏色
* 強化色彩層次
* 增加陰影與細節

---

## 六、AI 修飾程度

提供下拉選單或按鈕群組。

### 程度 1：草圖清理

說明：

* 清除雜線
* 保留原始手繪感
* 不大幅修改造型

Prompt：

```text
Clean up the sketch lines while keeping the original composition and hand-drawn feeling.
```

---

### 程度 2：線稿優化

說明：

* 強化輪廓
* 修正比例
* 讓線條更乾淨

Prompt：

```text
Refine the sketch into clean line art, improve proportions slightly, and keep the original design.
```

---

### 程度 3：彩色插畫

說明：

* 加入基本顏色
* 加入簡單光影
* 保留草圖造型

Prompt：

```text
Turn the sketch into a colored illustration with simple shading, while preserving the original pose and composition.
```

---

### 程度 4：精緻插畫

說明：

* 強化細節
* 增加材質
* 加入完整光影

Prompt：

```text
Transform the sketch into a polished digital illustration with refined details, lighting, and texture.
```

---

### 程度 5：動漫角色完成圖

說明：

* 將草圖轉成動漫風格
* 適合角色設計
* 畫面精緻完整

Prompt：

```text
Convert the sketch into a high-quality anime-style character design, keeping the original concept, pose, and main features.
```

---

## 七、Prompt 產生規則

系統需根據使用者輸入自動組合 prompt。

Prompt 組合內容包括：

1. 作品名稱
2. 草圖輸出模式
3. AI 修飾程度
4. 是否保留原始構圖
5. 是否保留原始顏色
6. 目標風格

範例：

```text
Artwork name: 毛後狗.
Use the uploaded or drawn sketch as the main reference.
Preserve the original composition and main shape.
The sketch is a colored sketch, so keep the main color ideas.
Enhancement level: polished digital illustration.
Create a refined and cute character illustration based on the sketch.
```

---

## 八、畫面版面設計

請使用響應式網頁設計，支援：

* PC
* 平板
* 手機

### PC 版配置

左右分欄：

```text
左側：輸入與畫板工具
右側：原始草圖與 AI 生成結果
```

### 平板版配置

上下或左右自動調整。

### 手機版配置

垂直排列：

```text
作品名稱
上傳圖片
畫板工具
Canvas 畫板
AI 修飾設定
開始生成按鈕
原始草圖
生成結果
```

---

## 九、主要頁面區塊

### 1. 標題區

標題：

```text
草圖 AI 輔助繪製產生器
```

副標題：

```text
上傳或繪製草圖，選擇修飾程度，產生更完整的 AI 輔助圖像
```

---

### 2. 作品設定區

包含：

* 作品名稱輸入欄
* 草圖模式選擇
* AI 修飾程度選擇

---

### 3. 草圖輸入區

包含：

* 上傳圖片
* Canvas 畫板
* 筆刷工具
* 顏色選擇
* 筆刷大小
* 橡皮擦
* 復原
* 清除
* 儲存草圖

---

### 4. AI 生成區

包含：

* 開始 AI 修飾按鈕
* 生成中狀態
* 生成結果圖片
* 下載結果圖片按鈕

---

### 5. Prompt 預覽區

顯示目前系統產生的 prompt。

讓使用者知道 AI 會如何理解這張草圖。

---

## 十、技術需求

### 前端建議

請使用：

* HTML
* CSS
* JavaScript

或使用：

* React
* Vite
* TypeScript

若使用 React，請建立清楚的 Component 架構。

---

## 十一、建議 Component 架構

```text
App
├── Header
├── ProjectNameInput
├── SketchSourceSelector
├── DrawingCanvas
├── ToolPanel
│   ├── BrushTool
│   ├── ColorPicker
│   ├── BrushSizeSlider
│   ├── EraserTool
│   ├── UndoButton
│   └── ClearButton
├── ImageUploader
├── EnhancementSettings
├── PromptPreview
├── GenerateButton
└── ResultPreview
```

---

## 十二、AI API 預留架構

第一版可先不串接真正 AI。

請建立一個假的 AI 生成函式：

```javascript
async function generateAIImage(input) {
  console.log("AI input:", input);

  // 第一版先回傳 placeholder image
  return {
    imageUrl: "/placeholder-result.png",
    prompt: input.prompt
  };
}
```

之後可以替換成真正 API。

---

## 十三、AI 輸入資料格式

請設計成以下格式：

```javascript
{
  projectName: "毛後狗",
  sketchMode: "colored",
  enhancementLevel: 4,
  prompt: "...",
  sketchImageBase64: "data:image/png;base64,..."
}
```

---

## 十四、使用者操作流程

1. 開啟網頁
2. 輸入作品名稱
3. 選擇上傳草圖或直接繪製
4. 若直接繪製，可選擇筆刷顏色與粗細
5. 繪製黑白或彩色草圖
6. 選擇草圖輸出模式
7. 選擇 AI 修飾程度
8. 按下「開始 AI 修飾」
9. 系統顯示 prompt
10. 系統產生 AI 修飾結果
11. 使用者可下載結果圖片

---

## 十五、介面風格

請使用簡潔、教學展示友善的風格。

建議：

* 背景：淺灰或白色
* 主色：藍色或紫色
* 按鈕圓角
* 工具列清楚
* 適合學生操作
* 手機畫面不要太擁擠

---

## 十六、RWD 響應式需求

請確保：

* PC 瀏覽器可以完整操作
* 平板可以使用觸控筆繪圖
* 手機可以用手指繪圖
* Canvas 不會超出畫面
* 按鈕大小適合觸控
* 工具列在手機上自動換行

---

## 十七、重要注意事項

1. Canvas 必須支援 mouse event 與 touch event。
2. 手機繪圖時需避免頁面跟著滑動。
3. 使用者上傳圖片後，可以顯示在 Canvas 或預覽區。
4. 草圖需能轉成 base64，方便之後送到 AI API。
5. Prompt 產生邏輯要獨立成函式，方便後續修改。
6. 第一版不需要登入系統。
7. 第一版不需要資料庫。
8. 第一版以單頁式網頁工具為主。

---

## 十八、第一版完成標準

完成後應具備：

* 可以輸入作品名稱
* 可以上傳草圖
* 可以直接畫草圖
* 可以用彩色筆刷繪製
* 可以選擇黑白草圖或彩色草圖
* 可以選擇 AI 修飾程度
* 可以產生 prompt
* 可以顯示假 AI 結果
* 可以下載草圖
* 可以下載結果圖
* 可以在 PC、平板、手機瀏覽器正常使用

---

## 十九、未來擴充功能

之後可以加入：

1. 真正 AI Image-to-Image API
2. 多種風格選擇

   * 動漫風
   * 水彩風
   * 童書風
   * 3D 公仔風
   * 像素風
3. 學生作品儲存
4. 作品展示牆
5. 批次生成
6. AI prompt 手動編輯
7. 生成歷史紀錄
8. 登入與雲端儲存
9. 教師後台管理
10. 匯出 PDF 作品集

---

## 二十、請 Codex 執行方式

請先完成第一版前端原型。

不要一開始就串接真正 AI API。

請優先確保：

1. 畫板可以正常繪圖
2. 手機與平板可以觸控繪圖
3. 彩色筆刷可以使用
4. Prompt 可以正確產生
5. 介面在不同裝置上都能正常顯示

完成後，請提供完整可執行的專案檔案結構與程式碼。
