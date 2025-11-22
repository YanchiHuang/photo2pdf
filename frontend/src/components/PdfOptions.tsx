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
                <h2 className="text-lg font-semibold text-zinc-900">PDF Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Page Size</label>
                    <select
                        className="w-full p-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={options.size}
                        onChange={(e) => handleChange('size', e.target.value)}
                    >
                        <option value="A4">A4</option>
                        <option value="Letter">Letter</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Orientation</label>
                    <select
                        className="w-full p-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={options.orientation}
                        onChange={(e) => handleChange('orientation', e.target.value)}
                    >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Image Fit</label>
                    <select
                        className="w-full p-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={options.fit}
                        onChange={(e) => handleChange('fit', e.target.value)}
                    >
                        <option value="contain">Contain (Fit Page)</option>
                        <option value="cover">Cover (Fill Page)</option>
                    </select>
                </div>
            </div>

            <button
                onClick={onGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGenerating ? (
                    <>Generating...</>
                ) : (
                    <>
                        <Download className="w-5 h-5" />
                        Generate PDF
                    </>
                )}
            </button>
        </div>
    );
};
