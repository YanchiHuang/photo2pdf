# 🚀 圖片轉 PDF 工具 — 開發計畫書

## 一、專案目標

建立一個可上傳圖片、進行排序編輯，並生成 PDF 的工具。使用者可透過網頁介面完成以下流程：

1. 上傳多張圖片。
2. 預覽圖片清單。
3. 以拖曳方式重新排序圖片。
4. 生成 PDF。
5. 下載 PDF 或直接於網頁預覽。

---

# 二、技術架構

## 2.1 前端技術

- **React (Vite)**：主 UI 框架
- **Tailwind CSS**：快速 UI 樣式設計
- **shadcn/ui**：常用 UI 元件（按鈕、拖曳排序列表、對話框等）
- **React Beautiful DnD / DndKit**：圖片排序拖曳
- **React Query**：處理檔案上傳與 PDF 生成 API 請求
- **FileReader + URL.createObjectURL**：產生本地預覽圖片
- **PDF 生成後預覽**：使用 `<embed>` 或 PDF.js

## 2.2 後端技術

- **Node.js + Express**：API Server
- **multer**：圖片上傳處理
- **sharp**：圖片處理（調整大小、旋轉）
- **pdf-lib 或 pdfkit**：生成 PDF
- **Temporary File Folder (/tmp)**：暫存上傳與輸出
- **UUID**：管理任務或輸出檔案名稱

---

# 三、系統功能概要

## 3.1 前端功能

- 上傳多張圖片（可拖拉）
- 顯示圖片縮圖列表
- 支援拖曳排序
- 刪除單張圖片
- 圖片清單重新命名排序：`001_xxx.jpg`, `002_xxx.jpg`（可選）
- 設定 PDF 輸出參數

  - A4 / Letter
  - 直式 / 橫式
  - 圖片自動置中或縮放填滿

- 產生 PDF 按鈕
- PDF 預覽 -下載 PDF

## 3.2 後端 API

| Method | Path            | 功能                                   |
| ------ | --------------- | -------------------------------------- |
| POST   | `/upload`       | 上傳多張圖片，回傳檔案的 server path   |
| POST   | `/generate-pdf` | 接收圖片排序資訊 + 選項，回傳 PDF 路徑 |
| GET    | `/pdf/:id`      | 提供 PDF 下載                          |
| DELETE | `/cleanup/:id`  | 移除暫存檔（選用）                     |

---

# 四、前端 UI 設計

## 4.1 頁面結構

### A. 首頁：圖片上傳區

- Upload Card（shadcn/ui）
- 支援拖曳圖片放入
- 上傳後顯示圖片列表（grid）
- 每張圖片顯示：

  - 縮圖
  - 刪除按鈕
  - 拖曳 handle（由 DnD kit）

### B. 圖片排序區

- 以 shadcn/ui + DndKit 作為清單 UI
- 提供拖曳排序
- 支援圖片點擊放大預覽（Dialog）

### C. PDF 設定面板

- Select（紙張大小）
- Select（方向）
- Checkbox（是否自動縮放填滿）
- Button（生成 PDF）

### D. PDF 產出區

- PDF 預覽（<embed> 或 PDF.js）
- 下載按鈕（shadcn/ui Button）

---

# 五、資料流流程設計

## 5.1 使用流程

```
[前端] 選擇圖片 → local preview
   ↓
[前端] 排序完成 → 傳送 sorted list & 原始 server path
   ↓
[後端] 合併圖片為 PDF
   ↓
[前端] 顯示 PDF 預覽 / 下載
```

## 5.2 資料結構

### 前端（圖片項目）

```ts
type ImageItem = {
  id: string; // uuid
  file: File; // 原始檔案
  previewUrl: string; // createObjectURL
  serverPath?: string; // 上傳後後端位置
};
```

### 後端（PDF 輸入）

```json
{
  "images": ["uploads/xxx.png", "uploads/yyy.jpg"],
  "options": {
    "size": "A4",
    "orientation": "portrait",
    "fit": "contain"
  }
}
```

---

# 六、後端實作計畫（Node.js）

## 6.1 `/upload`

### 功能

- 接收多張圖片
- 保存到 `/uploads/`
- 回傳檔案路徑陣列

### 工具

- multer（multi file upload）

## 6.2 `/generate-pdf`

### 功能

- 接收排序好的圖片路徑
- 逐張插入 PDF 頁面
- 使用 pdf-lib 或 pdfkit
- 回傳 PDF 檔案 ID

## 6.3 PDF 檔案儲存

- `/generated/{uuid}.pdf`
- 產出後存在 server 約 30 分鐘（可加 cron job 清除）

---

# 七、前端實作計畫（React）

## 7.1 主要元件規劃

```
/components
    UploadArea.tsx
    ImageList.tsx
    ImageItem.tsx
    PdfOptionsPanel.tsx
    PdfPreview.tsx

/pages
    Home.tsx
```

## 7.2 功能實作步驟

### 步驟 1：上傳 UI

- 使用 `<input type="file" multiple>`
- 接受 jpg/png/webp
- 建立 ImageItem 狀態

### 步驟 2：拖曳排序

- 使用 DndKit
- 提供移動、刪除

### 步驟 3：呼叫 `/upload`

- 送出 FormData
- backend 回傳存檔路徑

### 步驟 4：呼叫 `/generate-pdf`

- 傳遞排序好的圖片路徑
- 接收 pdfId

### 步驟 5：PDF 預覽 & 下載

- `<embed src="/pdf/{id}" />`
- 提供 shadcn/ui Button 下載

---

# 九、風險與考量

### 1. 大量圖片上傳

需設定 multer 與 Express 的 body 限制。

### 2. 大圖轉 PDF 效能

可採用 sharp 預先壓縮。

### 3. PDF 預覽相容性

部分行動裝置不支援 `<embed>` → 使用 PDF.js fallback。

---

# 🔟 假設列表（依需求可調整）

- 圖片數量約 1–200 張。
- 不需要帳號系統。
- 所有 PDF 與圖片皆使用 server 本地暫存方式儲存。
- PDF 預設採 A4 直式輸出。

以下提供兩部分內容：

1. **PDF 生成最佳化策略（完整技術說明與程式建議）**
2. **專案目錄結構 Template（Node.js + React + Tailwind + shadcn/ui）**

內容皆依照開發實務標準撰寫，方便你直接套用。

---

# ✔ PDF 生成最佳化策略（Node.js 後端）

以下策略針對大量圖片（20 ～ 200 張）、高解析度圖片（4000px+），確保 server 不當機、不爆 RAM，同時讓 PDF 生成時間維持合理。

---

## **一、圖片預處理（必要）**

### 1. 使用 sharp 進行圖片壓縮

大圖直接塞進 PDF 會爆記憶體，因此需在生成 PDF 之前縮成 PDF 大小的解析度。

建議：

- A4 總像素約：**2480 × 3508**
- 若圖片比這大 → 縮到「最長邊」等於 PDF 寬或高

```js
const processed = await sharp(filePath)
  .resize({ width: 2000, withoutEnlargement: true })
  .jpeg({ quality: 80 })
  .toBuffer();
```

### 2. 全部圖片轉成 JPEG 格式

- PDF 對 JPEG 最友好（不需重新壓縮）
- PNG → JPEG 減少 PDF 檔案大小 50%～ 80%

---

## **二、採用串流式 PDF 生成（建議使用 pdfkit）**

理由：

- pdf-lib 必須一次把 PDF 全部載入記憶體 → 大量圖片很容易爆 RAM
- pdfkit 允許**邊生成邊寫檔案（stream）**，非常適合大量圖片

### PDFKit 生成範例

```js
import PDFDocument from "pdfkit";
import fs from "fs";

function createPdf(imagePaths, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ autoFirstPage: false });
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    imagePaths.forEach((img) => {
      doc.addPage({ size: "A4", layout: "portrait" });
      doc.image(img, {
        fit: [550, 780],
        align: "center",
        valign: "center",
      });
    });

    doc.end();
    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });
}
```

---

## **三、圖片讀取最佳化**

### 1. 使用 local path（不要用 base64）

base64 會增大 30% 容量並增加處理成本。

### 2. 避免一次把所有圖片讀進 RAM

處理流程應該是：

1. 一張一張拿來 → sharp 處理 → 暫存 → 加進 PDF
2. 處理完立即 free buffer
3. 最後刪除暫存檔

---

## **四、暫存與清理策略**

### 1. `/tmp/uploads` 只存原始圖片

### 2. `/tmp/processed` 存 sharp 壓縮後的圖片

### 3. `/tmp/pdf` 存輸出 PDF

使用 `setTimeout` 或 cron job 排程清除：

- 暫存圖片：30 分鐘刪除
- PDF 輸出：1–2 小時刪除

避免 server 堆積大量圖片佔空間。

---

## **五、避免併發阻塞的 Queue 設計（可選）**

若同時有 10 位用戶上傳 100 張圖片 → server 會被 sharp 與 PDFKit 壓爆 CPU。

解法：

- 使用 p-queue 設限制
- 單次最多 3 個 PDF 任務併行

```js
import PQueue from 'p-queue';
const queue = new PQueue({ concurrency: 3 });
queue.add(() => createPdf(...));
```

---

## **六、PDF 影像自動旋轉修正（可選）**

使用 Sharp 的 metadata 自動旋轉：

```js
sharp(imgPath).rotate().toBuffer();
```

避免照片是旋轉 90 度、在 PDF 裡卻是直的。

---

# ✔ 專案目錄結構 Template

以下提供一份可直接 Clone 與實作的專案結構（全棧專案 Monorepo 架構）。

---

# 📁 專案目錄結構

```
image-to-pdf-tool/
│
├── backend/                 # Node.js + Express
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── upload.js
│   │   │   ├── pdf.js
│   │   │   └── cleanup.js
│   │   ├── middlewares/
│   │   │   └── uploadHandler.js    # multer 設定
│   │   ├── services/
│   │   │   ├── imageProcessor.js   # sharp 處理
│   │   │   └── pdfGenerator.js     # pdfkit 生成 PDF
│   │   ├── routes/
│   │   │   ├── uploadRoute.js
│   │   │   ├── pdfRoute.js
│   │   │   └── cleanupRoute.js
│   │   ├── utils/
│   │   │   ├── fileManager.js      # 刪除檔案、temp path
│   │   │   └── uuid.js
│   │   ├── app.js
│   │   └── server.js
│   ├── tmp/
│   │   ├── uploads/    # 原始圖片
│   │   ├── processed/  # sharp 處理後圖片
│   │   └── pdf/        # 輸出 PDF
│   ├── package.json
│   └── README.md
│
├── frontend/                # React + Tailwind + shadcn/ui
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadArea.tsx
│   │   │   ├── ImagePreview.tsx
│   │   │   ├── SortableList.tsx
│   │   │   ├── PdfOptions.tsx
│   │   │   └── PdfViewer.tsx
│   │   ├── pages/
│   │   │   └── Home.tsx
│   │   ├── hooks/
│   │   │   ├── useUpload.ts
│   │   │   └── usePdf.ts
│   │   ├── lib/
│   │   │   └── api.ts            # axios 封裝
│   │   ├── styles/
│   │   ├── main.tsx
│   │   └── App.tsx
│   ├── tailwind.config.js
│   ├── shadcn.json
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md
```

---

# 📌 補充：後端檔案職責說明（方便後續維護）

### `/services/imageProcessor.js`

- sharp 處理圖片（resize / rotate / 過濾 PNG → JPEG）
- 回傳新的 processed path

### `/services/pdfGenerator.js`

- 接收多張圖片 path（processed）
- 使用 PDFKit 生成 PDF
- 以 stream pipe 寫入 temp/pdf/**id.pdf**

### `/controllers/upload.js`

- 使用 multer 上傳圖片
- 回傳 filename + server path 陣列

### `/controllers/pdf.js`

- 呼叫 imageProcessor → pdfGenerator
- 回傳 pdfId

---
