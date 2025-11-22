import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageItemProps {
    id: string;
    previewUrl: string;
    name: string;
    onRemove: (id: string) => void;
}

export const ImageItem: React.FC<ImageItemProps> = ({ id, previewUrl, name, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "relative group flex items-center gap-4 p-3 bg-white border border-zinc-200 rounded-lg shadow-sm hover:shadow-md transition-shadow",
                isDragging && "shadow-lg ring-2 ring-blue-500"
            )}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-zinc-100 rounded"
            >
                <GripVertical className="w-5 h-5 text-zinc-400" />
            </div>

            <div className="w-16 h-16 bg-zinc-100 rounded overflow-hidden flex-shrink-0">
                <img src={previewUrl} alt={name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 truncate">{name}</p>
            </div>

            <button
                onClick={() => onRemove(id)}
                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};
