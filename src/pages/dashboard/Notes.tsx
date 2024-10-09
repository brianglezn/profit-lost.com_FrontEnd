import { useState } from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import './Notes.scss';
import DeleteBinIcon from '../../components/icons/DeleteBinIcon';

interface Note {
    id: string;
    title: string;
    content: string;
}

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);

    const { t } = useTranslation();

    const handleCreateNote = () => {
        const newNote: Note = {
            id: new Date().toISOString(),
            title: '',
            content: '',
        };
        setNotes([...notes, newNote]);
        setSelectedNote(newNote);
        setIsCreating(true);
    };

    const handleSaveNote = () => {
        if (selectedNote) {
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === selectedNote.id ? selectedNote : note
                )
            );
            // Show success toast when the note is saved
            toast.success(t('dashboard.notes.note_saved'), {
                duration: 3000,
                position: 'top-center',
            });
        }
        setIsCreating(false);
    };

    const handleDeleteNote = (noteToDelete: Note) => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteToDelete.id));
        setSelectedNote(null);
        setIsCreating(false);

        // Show the error toast when deleting with undo option
        toast.error((toastInstance) => (
            <div className="undo-delete-toast">
                <span>{t('dashboard.notes.note_deleted')}</span>
                <button
                    className="undo-button"
                    onClick={() => {
                        setNotes((prevNotes) => [...prevNotes, noteToDelete]);
                        toast.dismiss(toastInstance.id);
                        toast.success(t('dashboard.notes.note_restored'), {
                            duration: 4000,
                            position: 'top-center',
                        });
                    }}
                >
                    {t('dashboard.notes.undo')}
                </button>
            </div>
        ), {
            duration: 3000,
            position: 'top-center',
        });
    };

    const handleNoteChange = (key: keyof Note, value: string) => {
        if (selectedNote) {
            setSelectedNote({ ...selectedNote, [key]: value });
        }
    };

    const handleSelectNote = (note: Note) => {
        setIsCreating(false);
        setSelectedNote(note);
    };

    // Handlers for Drag and Drop
    const handleDragStart = (noteId: string) => {
        setDraggedNoteId(noteId);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Prevent default to allow drop
    };

    const handleDrop = (noteId: string) => {
        if (draggedNoteId && draggedNoteId !== noteId) {
            const draggedNoteIndex = notes.findIndex(note => note.id === draggedNoteId);
            const targetNoteIndex = notes.findIndex(note => note.id === noteId);
            const updatedNotes = [...notes];
            const [draggedNote] = updatedNotes.splice(draggedNoteIndex, 1);
            updatedNotes.splice(targetNoteIndex, 0, draggedNote);
            setNotes(updatedNotes);
            setDraggedNoteId(null);
        }
    };

    return (
        <section className='notes'>
            <div className='notes-sidebar'>
                <Button label={t('dashboard.notes.create_note')} icon='pi pi-plus' onClick={handleCreateNote} />
                <div className='notes-list'>
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            className='note-item'
                            draggable
                            onDragStart={() => handleDragStart(note.id)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(note.id)}
                            onClick={() => handleSelectNote(note)}
                        >
                            {note.title || t('dashboard.notes.untitled_note')}
                            <DeleteBinIcon className='delete-icon' onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNote(note);
                            }} />
                        </div>
                    ))}
                </div>
            </div>
            <div className='notes-editor'>
                {isCreating || selectedNote ? (
                    <div className='note-details'>
                        <InputText
                            type='text'
                            placeholder={t('dashboard.notes.note_title_placeholder')}
                            value={selectedNote?.title || ''}
                            onChange={(e) => handleNoteChange('title', e.target.value)}
                        />
                        <InputTextarea
                            placeholder={t('dashboard.notes.note_content_placeholder')}
                            value={selectedNote?.content || ''}
                            onChange={(e) => handleNoteChange('content', e.target.value)}
                            rows={5}
                            autoResize
                        />
                        <div className='note-actions'>
                            <Button
                                label={t('dashboard.notes.save_note')}
                                onClick={handleSaveNote}
                            />
                            <Button
                                label={t('dashboard.notes.delete_note')}
                                severity="danger" outlined
                                onClick={() => selectedNote && handleDeleteNote(selectedNote)}
                            />
                        </div>
                    </div>
                ) : (
                    <p className='no-note-selected'>{t('dashboard.notes.no_note_selected')}</p>
                )}
            </div>
        </section>
    );
}
