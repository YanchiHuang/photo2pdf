import React, { useCallback } from 'react';
import { Upload, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadAreaProps {
    onFilesSelected: (files: File[]) => void;
    className?: string;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFilesSelected, className }) => {
    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const files = Array.from(e.dataTransfer.files).filter(file =>
                    file.type.startsWith('image/')
                );
                onFilesSelected(files);
            }
        },
        [onFilesSelected]
    );

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files).filter(file =>
                file.type.startsWith('image/')
            );
            onFilesSelected(files);
        }
    };

    return (
        <div
            className={cn(
                "border-2 border-dashed border-zinc-300 rounded-lg p-12 text-center hover:bg-zinc-50 transition-colors cursor-pointer",
                className
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('file-upload')?.click()}
        >
            <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
            <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-zinc-100 rounded-full">
                    <Upload className="w-8 h-8 text-zinc-500" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900">
                        Click or drag images here
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">
                        Supports JPG, PNG, WebP
                    </p>
                </div>
            </div>
        </div>
    );
};
