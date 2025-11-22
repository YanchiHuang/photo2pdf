# 圖片轉 PDF 工具 (Photo to PDF Tool)

這是一個簡單易用的網頁工具，讓您可以輕鬆將多張圖片合併成一個 PDF 檔案。

## ✨ 功能特色

- **拖曳上傳**：支援直接拖曳圖片進行上傳 (JPG, PNG, WebP)。
- **自由排序**：透過拖曳方式調整圖片順序。
- **PDF 設定**：
  - **紙張大小**：支援 A4 與 Letter。
  - **方向**：支援直向 (Portrait) 與橫向 (Landscape)。
  - **圖片縮放**：
    - **完整呈現 (Contain)**：保留圖片全貌，可能會留白。
    - **填滿版面 (Cover)**：自動裁切圖片以填滿整頁 (無白邊)。
- **中文介面**：直觀的中文操作介面與提示。

## 🛠️ 技術架構

本專案採用前後端分離架構：

- **前端**：React, Vite, Tailwind CSS, shadcn/ui
- **後端**：Node.js, Express, PDFKit, Sharp, Multer

## 🚀 如何使用

### 1. 環境準備

請確保您的電腦已安裝 [Node.js](https://nodejs.org/) (建議 v18 以上)。

### 2. 啟動後端 (Backend)

開啟終端機 (Terminal)，進入 `backend` 資料夾並執行：

```bash
cd backend
npm install
node src/server.js
```

後端伺服器將在 `http://localhost:3000` 啟動。

### 3. 啟動前端 (Frontend)

開啟另一個終端機，進入 `frontend` 資料夾並執行：

```bash
cd frontend
npm install
npm run dev
```

前端頁面將在 `http://localhost:5173` (或自動分配的 port) 啟動。

### 4. 操作步驟

1. 開啟瀏覽器前往前端頁面 (通常是 `http://localhost:5173`)。
2. 將圖片拖曳至上傳區，或點擊圖示選擇檔案。
3. 在列表中拖曳圖片可調整順序；點擊 `X` 可移除圖片。
4. 在右側「PDF 設定」面板調整選項：
   - **紙張大小**：A4 或 Letter。
   - **方向**：直向或橫向。
   - **圖片縮放**：選擇「填滿版面」可去除白邊。
5. 點擊「產生 PDF」按鈕。
6. 系統處理完成後，PDF 將自動在瀏覽器新分頁中開啟，您可進行預覽或下載。

## � 專案結構

```
.
├── backend/                 # 後端程式碼
│   ├── src/
│   │   ├── controllers/     # API 控制器
│   │   ├── services/        # 核心邏輯 (圖片處理、PDF 生成)
│   │   └── routes/          # API 路由
│   └── tmp/                 # 暫存檔案 (自動建立)
│
├── frontend/                # 前端程式碼
│   ├── src/
│   │   ├── components/      # React 元件 (Upload, SortableList, PdfOptions)
│   │   └── pages/           # 頁面邏輯
│   └── ...
│
└── README.md                # 產品說明文件
```

## ⚠️ 注意事項

- 上傳的圖片與生成的 PDF 會暫存在 `backend/tmp` 目錄中。
- 目前版本尚未包含自動清理機制，若硬碟空間不足請手動清理 `tmp` 資料夾。
