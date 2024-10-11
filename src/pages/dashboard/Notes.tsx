import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { getAllNotes } from '../../api/notes/getAllNotes';
import { createNote } from '../../api/notes/createNote';
import { editNote } from '../../api/notes/editNote';
import { deleteNote } from '../../api/notes/deleteNote';

import Note from '../../helpers/types';

import './Notes.scss';
import DeleteBinIcon from '../../components/icons/DeleteBinIcon';

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);
    const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);

    const { t } = useTranslation();

    useEffect(() => {
        async function fetchNotes() {
            try {
                const fetchedNotes = await getAllNotes();
                console.log('Fetched notes:', fetchedNotes);
                setNotes(fetchedNotes);
            } catch (error) {
                console.error('Error fetching notes:', error);
                toast.error(t('dashboard.notes.fetch_error'));
            }
        }
        fetchNotes();
    }, [t]);

    const handleSaveNote = async () => {
        if (selectedNote) {
            try {
                if (!selectedNote._id) {
                    console.log('Creating new note:', selectedNote);
                    const savedNote = await createNote({
                        title: selectedNote.title,
                        content: selectedNote.content,
                    });
                    console.log('Note created:', savedNote);
                    setNotes((prevNotes) => [...prevNotes, savedNote]);
                    setSelectedNote(savedNote);
                    toast.success(t('dashboard.notes.note_saved'), {
                        duration: 3000,
                        position: 'top-center',
                    });
                } else {
                    console.log('Editing note:', selectedNote);
                    const updatedNote = await editNote(selectedNote._id, {
                        title: selectedNote.title,
                        content: selectedNote.content,
                    });
                    console.log('Note updated:', updatedNote);
                    setNotes((prevNotes) =>
                        prevNotes.map((note) =>
                            note._id === updatedNote._id ? updatedNote : note
                        )
                    );
                    setSelectedNote(updatedNote);
                    toast.success(t('dashboard.notes.note_updated'), {
                        duration: 3000,
                        position: 'top-center',
                    });
                }
                setIsCreating(false);
            } catch (error) {
                console.error('Error saving note:', error);
                toast.error(t('dashboard.notes.save_error'));
            }
        }
    };

    const handleDeleteNote = async (noteToDelete: Note) => {
        try {
            console.log('Deleting note:', noteToDelete);
            if (noteToDelete._id) {
                const updatedNote = notes.find(note => note._id === noteToDelete._id);
                if (updatedNote) {
                    const latestVersion = { ...updatedNote };
                    setDeletedNotes((prevDeleted) => [
                        ...prevDeleted,
                        latestVersion
                    ]);
                    console.log('Deleted notes updated:', latestVersion);
                }

                await deleteNote(noteToDelete._id);
                setNotes((prevNotes) =>
                    prevNotes.filter((note) => note._id !== noteToDelete._id)
                );
                setSelectedNote(null);
                setIsCreating(false);

                toast.error(
                    (toastInstance) => (
                        <div className="undo-delete-toast">
                            <span>{t('dashboard.notes.note_deleted')}</span>
                            <button
                                className="undo-button"
                                onClick={() => handleRestoreNote(toastInstance.id)}
                            >
                                {t('dashboard.notes.undo')}
                            </button>
                        </div>
                    ),
                    {
                        duration: 3000,
                        position: 'top-center',
                    }
                );
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            toast.error(t('dashboard.notes.delete_error'));
        }
    };

    const handleRestoreNote = async (toastId: string) => {
        if (deletedNotes.length > 0) {
            const noteToRestore = deletedNotes[deletedNotes.length - 1];
            console.log('Restoring note:', noteToRestore);

            try {
                const restoredNote = await createNote({
                    title: noteToRestore.title,
                    content: noteToRestore.content,
                });
                console.log('Note restored:', restoredNote);
                setNotes((prevNotes) => [...prevNotes, restoredNote]);
                setDeletedNotes((prevDeleted) => prevDeleted.filter(note => note._id !== noteToRestore._id));
                toast.dismiss(toastId);
                toast.success(t('dashboard.notes.note_restored'), {
                    duration: 4000,
                    position: 'top-center',
                });
            } catch (error) {
                console.error('Error restoring note:', error);
                toast.error(t('dashboard.notes.save_error'));
            }
        } else {
            console.log('No deleted note to restore');
        }
    };

    const handleNoteChange = (key: keyof Note, value: string) => {
        if (selectedNote) {
            console.log(`Changing note ${key}:`, value);
            setSelectedNote({ ...selectedNote, [key]: value });
        }
    };

    const handleSelectNote = (note: Note) => {
        console.log('Selected note:', note);
        setIsCreating(false);
        setSelectedNote(note);
    };

    const handleDragStart = (noteId: string) => {
        console.log('Dragging note:', noteId);
        setDraggedNoteId(noteId);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (noteId: string) => {
        if (draggedNoteId && draggedNoteId !== noteId) {
            const draggedNoteIndex = notes.findIndex(
                (note) => note._id === draggedNoteId
            );
            const targetNoteIndex = notes.findIndex((note) => note._id === noteId);
            const updatedNotes = [...notes];
            const [draggedNote] = updatedNotes.splice(draggedNoteIndex, 1);
            updatedNotes.splice(targetNoteIndex, 0, draggedNote);
            console.log('Note dropped:', draggedNote);
            setNotes(updatedNotes);
            setDraggedNoteId(null);
        }
    };

    return (
        <section className='notes'>
            <div className='notes-sidebar'>
                <Button label={t('dashboard.notes.create_note')} icon='' onClick={() => {
                    setSelectedNote({
                        _id: '',
                        title: '',
                        content: '',
                        user_id: '',
                        created_at: '',
                        updated_at: ''
                    });
                    setIsCreating(true);
                }} />
                <div className='notes-list'>
                    {notes.map((note) => (
                        <div
                            key={note._id}
                            className='note-item'
                            draggable
                            onDragStart={() => handleDragStart(note._id)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(note._id)}
                            onClick={() => handleSelectNote(note)}
                        >
                            {note.title || t('dashboard.notes.untitled_note')}
                            <DeleteBinIcon
                                className='delete-icon'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteNote(note);
                                }}
                            />
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
                                severity="danger"
                                outlined
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
