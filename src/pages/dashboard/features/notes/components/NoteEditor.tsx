import React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Note } from '../../../../../helpers/types';

interface NoteEditorProps {
    selectedNote: Note | null;
    isCreating: boolean;
    onChange: (key: keyof Note, value: string) => void;
    onSave: () => void;
    onDelete: () => void;
    titlePlaceholder: string;
    contentPlaceholder: string;
    saveLabel: string;
    deleteLabel: string;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
    selectedNote,
    isCreating,
    onChange,
    onSave,
    onDelete,
    titlePlaceholder,
    contentPlaceholder,
    saveLabel,
    deleteLabel
}) => {
    return (
        <div className='note-details'>
            <InputText
                type='text'
                placeholder={titlePlaceholder}
                value={selectedNote?.title || ''}
                onChange={(e) => onChange('title', e.target.value)}
            />
            <InputTextarea
                placeholder={contentPlaceholder}
                value={selectedNote?.content || ''}
                onChange={(e) => onChange('content', e.target.value)}
                rows={5}
                autoResize
            />
            <div className='note-actions'>
                <Button label={saveLabel} onClick={onSave} />
                {!isCreating && (
                    <Button label={deleteLabel} severity="danger" outlined onClick={onDelete} />
                )}
            </div>
        </div>
    );
};

export default NoteEditor;
