import React from 'react';

import DeleteBinIcon from '../../../../../components/icons/DeleteBinIcon';

import { Note } from '../../../../../helpers/types';

interface NoteItemProps {
    note: Note;
    onSelect: (note: Note) => void;
    onDelete: (note: Note) => void;
    onDragStart: (noteId: string) => void;
    onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (noteId: string) => void;
    untitledLabel: string;
}

const NoteItem: React.FC<NoteItemProps> = ({
    note,
    onSelect,
    onDelete,
    onDragStart,
    onDragOver,
    onDrop,
    untitledLabel
}) => {
    return (
        <div
            key={note._id}
            className='note-item'
            draggable
            onDragStart={() => onDragStart(note._id)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(note._id)}
            onClick={() => onSelect(note)}
        >
            {note.title || untitledLabel}
            <DeleteBinIcon
                className='delete-icon'
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(note);
                }}
            />
        </div>
    );
};

export default NoteItem;
