import React, { useState } from 'react';
import { UploadArea } from '@/components/UploadArea';
import { SortableList } from '@/components/SortableList';
import { PdfOptions } from '@/components/PdfOptions';
import { uploadImages, generatePdf } from '@/lib/api';
import { v4 as uuidv4 } from 'uuid';

interface Image {
    id: string;
    previewUrl: string;
    file: File;
    serverPath?: string;
}

export const Home: React.FC = () => {
    const [images, setImages] = useState<Image[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfOptions, setPdfOptions] = useState({
        size: 'A4',
        orientation: 'portrait',
        fit: 'contain',
    });

    const handleFilesSelected = async (files: File[]) => {
        setIsUploading(true);
        try {
            const newImages = files.map(file => ({
                id: uuidv4(),
                previewUrl: URL.createObjectURL(file),
                file,
            }));

            setImages(prev => [...prev, ...newImages]);

            const uploadedFiles = await uploadImages(files);

            setImages(currentImages => {
                const updatedImages = [...currentImages];
                const startIndex = updatedImages.length - files.length;
                uploadedFiles.forEach((uploadedFile: any, index: number) => {
                    if (updatedImages[startIndex + index]) {
                        updatedImages[startIndex + index].serverPath = uploadedFile.serverPath;
                    }
                });
                return updatedImages;
            });

        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveItem = (id: string) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    const handleGenerate = async () => {
        if (images.length === 0) return;
        setIsGenerating(true);
        try {
            const readyImages = images.filter(img => img.serverPath).map(img => img.serverPath!);

            if (readyImages.length !== images.length) {
                alert('Some images are still uploading, please wait.');
                return;
            }

            const { downloadUrl } = await generatePdf(readyImages, pdfOptions);

            window.open(`http://localhost:3000${downloadUrl}`, '_blank');

        } catch (error) {
            console.error('Generation failed', error);
            alert('Failed to generate PDF');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <header className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-zinc-900">Image to PDF Converter</h1>
                    <p className="text-zinc-500">Upload images, reorder them, and create your PDF.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <UploadArea onFilesSelected={handleFilesSelected} />

                        {images.length > 0 && (
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                                <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                                    Images ({images.length})
                                </h2>
                                <SortableList
                                    items={images}
                                    onItemsChange={setImages}
                                    onRemoveItem={handleRemoveItem}
                                />
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <PdfOptions
                            options={pdfOptions}
                            setOptions={setPdfOptions}
                            onGenerate={handleGenerate}
                            isGenerating={isGenerating}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
