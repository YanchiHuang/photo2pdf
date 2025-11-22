import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ImageItem } from './ImageItem';

interface Image {
    id: string;
    previewUrl: string;
    file: File;
}

interface SortableListProps {
    items: Image[];
    onItemsChange: (items: Image[]) => void;
    onRemoveItem: (id: string) => void;
}

export const SortableList: React.FC<SortableListProps> = ({ items, onItemsChange, onRemoveItem }) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            onItemsChange(arrayMove(items, oldIndex, newIndex));
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map(i => i.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-2">
                    {items.map((item) => (
                        <ImageItem
                            key={item.id}
                            id={item.id}
                            previewUrl={item.previewUrl}
                            name={item.file.name}
                            onRemove={onRemoveItem}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};
