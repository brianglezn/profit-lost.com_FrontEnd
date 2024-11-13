import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { getAllNotes } from '../../../../api/notes/getAllNotes';
import { createNote } from '../../../../api/notes/createNote';
import { editNote } from '../../../../api/notes/editNote';
import { deleteNote } from '../../../../api/notes/deleteNote';
import { Note } from '../../../../helpers/types';

import DeleteBinIcon from '../../../../components/icons/DeleteBinIcon';

import './Notes.scss';

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);

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

    // Handle saving (create or update) a note
    const handleSaveNote = async () => {
        if (selectedNote) {
            try {
                if (!selectedNote._id) {
                    // Create new note
                    const savedNote = await createNote({
                        title: selectedNote.title,
                        content: selectedNote.content,
                    });
                    setNotes((prevNotes) => [...prevNotes, savedNote]); // Add new note to list
                    setSelectedNote(savedNote);
                    toast.success(t('dashboard.notes.note_saved'), {
                        duration: 3000,
                        position: 'top-center',
                    });
                } else {
                    // Edit existing note
                    const updatedNote = await editNote(selectedNote._id, {
                        title: selectedNote.title,
                        content: selectedNote.content,
                    });
                    // Update note in the list
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

    // Handle deleting a note
    const handleDeleteNote = async (noteToDelete: Note) => {
        // Optimistically remove the note from the list
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteToDelete._id));

        try {
            await deleteNote(noteToDelete._id); // Delete the note from the backend
            toast.success(t('dashboard.notes.note_deleted'), {
                duration: 3000,
                position: 'top-center',
            });
        } catch (error) {
            console.error('Error deleting note from API:', error);
            toast.error(t('dashboard.notes.delete_error'));
        }
    };

    // Handle changes to the selected note (title or content)
    const handleNoteChange = (key: keyof Note, value: string) => {
        if (selectedNote) {
            setSelectedNote({ ...selectedNote, [key]: value });
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

    return (
        <section className='notes'>
            <div className='notes-sidebar'>
                {/* Button to create a new note */}
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
                    {/* List all notes */}
                    {notes.map((note) => (
                        <div
                            key={note._id}
                            className='note-item'
                            draggable
                            onDragStart={() => handleDragStart(note._id)} // Allow dragging
                            onDragOver={handleDragOver} // Allow drag over
                            onDrop={() => handleDrop(note._id)} // Handle dropping for reordering
                            onClick={() => handleSelectNote(note)} // Select note on click
                        >
                            {note.title || t('dashboard.notes.untitled_note')}
                            {/* Delete icon to remove the note */}
                            <DeleteBinIcon
                                className='delete-icon'
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering note selection on delete
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
                        {/* Input for the note title */}
                        <InputText
                            type='text'
                            placeholder={t('dashboard.notes.note_title_placeholder')}
                            value={selectedNote?.title || ''}
                            onChange={(e) => handleNoteChange('title', e.target.value)}
                        />
                        {/* Textarea for the note content */}
                        <InputTextarea
                            placeholder={t('dashboard.notes.note_content_placeholder')}
                            value={selectedNote?.content || ''}
                            onChange={(e) => handleNoteChange('content', e.target.value)}
                            rows={5}
                            autoResize
                        />
                        {/* Actions to save or delete the note */}
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
