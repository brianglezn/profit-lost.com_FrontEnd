import React from 'react';
import { Note } from '../../../../../helpers/types';
import NoteItem from './NoteItem';

interface NoteListProps {
    notes: Note[];
    onSelect: (note: Note) => void;
    onDelete: (note: Note) => void;
    onDragStart: (noteId: string) => void;
    onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (noteId: string) => void;
    untitledLabel: string;
}

const NoteList: React.FC<NoteListProps> = ({ 
    notes, 
    onSelect, 
    onDelete, 
    onDragStart, 
    onDragOver, 
    onDrop, 
    untitledLabel 
}) => {
    return (
        <div className='notes-list'>
            {notes.map((note) => (
                <NoteItem
                    key={note._id}
                    note={note}
                    onSelect={onSelect}
                    onDelete={onDelete}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    untitledLabel={untitledLabel}
                />
            ))}
        </div>
    );
};

export default NoteList;
