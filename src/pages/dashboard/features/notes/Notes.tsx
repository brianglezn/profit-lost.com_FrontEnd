import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { getAllNotes } from '../../../../api/notes/getAllNotes';
import { createNote } from '../../../../api/notes/createNote';
import { editNote } from '../../../../api/notes/editNote';
import { deleteNote } from '../../../../api/notes/deleteNote';
import { Note } from '../../../../helpers/types';

import './Notes.scss';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);
    const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isAutosaving, setIsAutosaving] = useState<boolean>(false);

    const { t } = useTranslation();

    // Fetch all notes when the component mounts
    useEffect(() => {
        async function fetchNotes() {
            try {
                const fetchedNotes = await getAllNotes();
                setNotes(fetchedNotes);
            } catch (error) {
                console.error('Error fetching notes:', error);
                toast.error(t('dashboard.notes.fetch_error'));
            }
        }
        fetchNotes();
    }, [t]);

    // Función de autoguardado separada
    const autoSaveNote = async (noteToSave: Note) => {
        try {
            setIsAutosaving(true);
            if (!noteToSave._id) {
                // Create new note
                const savedNote = await createNote({
                    title: noteToSave.title,
                    content: noteToSave.content,
                });
                setNotes((prevNotes) => [...prevNotes, savedNote]);
                setSelectedNote(savedNote);
            } else {
                // Edit existing note
                const updatedNote = await editNote(noteToSave._id, {
                    title: noteToSave.title,
                    content: noteToSave.content,
                });
                setNotes((prevNotes) =>
                    prevNotes.map((note) =>
                        note._id === updatedNote._id ? updatedNote : note
                    )
                );
                setSelectedNote(updatedNote);
            }
            setIsCreating(false);
        } catch (error) {
            console.error('Error autosaving note:', error);
            // Mostrar un toast de error solo si el error es crítico
            if (error instanceof Error && error.message !== 'AbortError') {
                toast.error(t('dashboard.notes.autosave_error'));
            }
        } finally {
            setIsAutosaving(false);
        }
    };

    // Mejorar handleNoteChange con debounce más robusto
    const handleNoteChange = (key: keyof Note, value: string) => {
        if (selectedNote) {
            const updatedNote = { ...selectedNote, [key]: value };
            setSelectedNote(updatedNote);

            // Cancelar el temporizador anterior
            if (autoSaveTimeout) {
                clearTimeout(autoSaveTimeout);
            }

            // Solo iniciar autoguardado si hay cambios significativos
            if (value.trim() !== '') {
                const timeout = setTimeout(() => {
                    if (!isAutosaving) {
                        autoSaveNote(updatedNote);
                    }
                }, 2000); // Aumentamos el tiempo a 2 segundos para mejor rendimiento

                setAutoSaveTimeout(timeout);
            }
        }
    };

    // Modificar handleSaveNote para manejar guardado manual
    const handleSaveNote = async () => {
        if (selectedNote) {
            try {
                // Cancelar cualquier autoguardado pendiente
                if (autoSaveTimeout) {
                    clearTimeout(autoSaveTimeout);
                    setAutoSaveTimeout(null);
                }

                if (!selectedNote._id) {
                    const savedNote = await createNote({
                        title: selectedNote.title,
                        content: selectedNote.content,
                    });
                    setNotes((prevNotes) => [...prevNotes, savedNote]);
                    setSelectedNote(savedNote);
                    toast.success(t('dashboard.notes.note_saved'));
                } else {
                    const updatedNote = await editNote(selectedNote._id, {
                        title: selectedNote.title,
                        content: selectedNote.content,
                    });
                    setNotes((prevNotes) =>
                        prevNotes.map((note) =>
                            note._id === updatedNote._id ? updatedNote : note
                        )
                    );
                    setSelectedNote(updatedNote);
                    toast.success(t('dashboard.notes.note_updated'));
                }
                setIsCreating(false);
            } catch (error) {
                console.error('Error saving note:', error);
                toast.error(t('dashboard.notes.save_error'));
            }
        }
    };

    // Handle deleting a note
    const handleDeleteNote = (noteToDelete: Note) => {
        confirmDialog({
            message: t('dashboard.notes.confirm_delete', { title: noteToDelete.title || t('dashboard.notes.untitled_note') }),
            header: t('dashboard.notes.delete_note'),
            accept: () => handleConfirmDelete(noteToDelete),
            reject: () => {},
            position: 'bottom'
        });
    };

    // Handle confirming and deleting the note
    const handleConfirmDelete = async (noteToDelete: Note) => {
        // Limpiar el editor si la nota borrada es la seleccionada
        if (selectedNote?._id === noteToDelete._id) {
            setSelectedNote(null);
            setIsCreating(false);
        }

        // Optimistically remove the note from the list
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteToDelete._id));

        try {
            await deleteNote(noteToDelete._id);
            toast.success(t('dashboard.notes.note_deleted'), {
                duration: 3000,
                position: 'top-center',
            });
        } catch (error) {
            console.error('Error deleting note from API:', error);
            toast.error(t('dashboard.notes.delete_error'));
        }
    };

    // Handle selecting a note to view/edit
    const handleSelectNote = (note: Note) => {
        setIsCreating(false);
        setSelectedNote(note);
    };

    // Handle starting a drag action for reordering notes
    const handleDragStart = (noteId: string) => {
        setDraggedNoteId(noteId);
    };

    // Handle dragging over another note (allows for reordering)
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    // Handle dropping a dragged note into a new position
    const handleDrop = (noteId: string) => {
        if (draggedNoteId && draggedNoteId !== noteId) {
            const draggedNoteIndex = notes.findIndex(
                (note) => note._id === draggedNoteId
            );
            const targetNoteIndex = notes.findIndex((note) => note._id === noteId);
            const updatedNotes = [...notes];
            const [draggedNote] = updatedNotes.splice(draggedNoteIndex, 1); // Remove dragged note
            updatedNotes.splice(targetNoteIndex, 0, draggedNote); // Insert it into the new position
            setNotes(updatedNotes); // Update notes state with reordered notes
            setDraggedNoteId(null);
        }
    };

    // Limpiar temporizadores y estados al desmontar
    useEffect(() => {
        return () => {
            if (autoSaveTimeout) {
                clearTimeout(autoSaveTimeout);
            }
            setIsAutosaving(false);
        };
    }, [autoSaveTimeout]);

    return (
        <>
            <ConfirmDialog />
            <section className='notes'>
                <div className='notes-sidebar'>
                    <Button 
                        label={t('dashboard.notes.create_note')} 
                        icon='' 
                        onClick={() => {
                            setSelectedNote({
                                _id: '',
                                title: '',
                                content: '',
                                user_id: '',
                                created_at: '',
                                updated_at: ''
                            });
                            setIsCreating(true);
                        }} 
                    />
                    
                    <NoteList
                        notes={notes}
                        onSelect={handleSelectNote}
                        onDelete={handleDeleteNote}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        untitledLabel={t('dashboard.notes.untitled_note')}
                    />
                </div>
                
                <div className='notes-editor'>
                    {isCreating || selectedNote ? (
                        <NoteEditor
                            selectedNote={selectedNote}
                            isCreating={isCreating}
                            onChange={handleNoteChange}
                            onSave={handleSaveNote}
                            onDelete={() => selectedNote && handleDeleteNote(selectedNote)}
                            titlePlaceholder={t('dashboard.notes.note_title_placeholder')}
                            contentPlaceholder={t('dashboard.notes.note_content_placeholder')}
                            saveLabel={t('dashboard.notes.save_note')}
                            deleteLabel={t('dashboard.notes.delete_note')}
                        />
                    ) : (
                        <p className='no-note-selected'>{t('dashboard.notes.no_note_selected')}</p>
                    )}
                </div>
            </section>
        </>
    );
}
