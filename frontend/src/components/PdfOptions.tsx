import React from 'react';
import { FileText, Download } from 'lucide-react';

interface PdfOptionsProps {
    onGenerate: () => void;
    isGenerating: boolean;
    options: {
        size: string;
        orientation: string;
        fit: string;
    };
    setOptions: (options: any) => void;
}

export const PdfOptions: React.FC<PdfOptionsProps> = ({ onGenerate, isGenerating, options, setOptions }) => {
    const handleChange = (key: string, value: string) => {
        setOptions({ ...options, [key]: value });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200 space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-zinc-900">PDF 設定</h2>
            </div>

            <div className="flex flex-col space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">紙張大小 (Page Size)</label>
                    <select
                        className="w-full p-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={options.size}
                        onChange={(e) => handleChange('size', e.target.value)}
                    >
                        <option value="A4">A4</option>
                        <option value="Letter">Letter</option>
                    </select>
                    <p className="text-xs text-zinc-500">選擇輸出 PDF 的紙張規格。</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">方向 (Orientation)</label>
                    <select
                        className="w-full p-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={options.orientation}
                        onChange={(e) => handleChange('orientation', e.target.value)}
                    >
                        <option value="portrait">直向 (Portrait)</option>
                        <option value="landscape">橫向 (Landscape)</option>
                    </select>
                    <p className="text-xs text-zinc-500">設定頁面為直式或橫式閱讀。</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">圖片縮放 (Image Fit)</label>
                    <select
                        className="w-full p-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={options.fit}
                        onChange={(e) => handleChange('fit', e.target.value)}
                    >
                        <option value="contain">完整呈現 (Contain)</option>
                        <option value="cover">填滿版面 (Cover)</option>
                    </select>
                    <p className="text-xs text-zinc-500">
                        完整呈現：保留圖片完整內容，可能有白邊。<br />
                        填滿版面：裁切圖片以填滿整頁，無白邊。
                    </p>
                </div>
            </div>

            <button
                onClick={onGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGenerating ? (
                    <>產生中...</>
                ) : (
                    <>
                        <Download className="w-5 h-5" />
                        產生 PDF
                    </>
                )}
            </button>
        </div>
    );
};
