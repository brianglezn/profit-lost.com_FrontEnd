import { useState } from 'react';
import './Notes.scss';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import DeleteBinIcon from '../../components/icons/DeleteBinIcon';
import { toast } from 'react-hot-toast';

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
            // Mostrar toast de éxito al guardar la nota
            toast.success('Note saved successfully', {
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

        // Mostrar el toast de error al eliminar con opción de deshacer
        toast.error((t) => (
            <div className="undo-delete-toast">
                <span>Note deleted.</span>
                <button
                    className="undo-button"
                    onClick={() => {
                        setNotes((prevNotes) => [...prevNotes, noteToDelete]);
                        toast.dismiss(t.id);
                        toast.success('Note restored to the board', {
                            duration: 4000,
                            position: 'top-center',
                        });
                    }}
                >
                    Undo
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
                <Button label='Create Note' icon='pi pi-plus' onClick={handleCreateNote} />
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
                            {note.title || 'Untitled Note'}
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
                        <input
                            type='text'
                            placeholder='Note Title'
                            value={selectedNote?.title || ''}
                            onChange={(e) => handleNoteChange('title', e.target.value)}
                        />
                        <InputTextarea
                            placeholder='Write your note here...'
                            value={selectedNote?.content || ''}
                            onChange={(e) => handleNoteChange('content', e.target.value)}
                            rows={5}
                            autoResize
                        />
                        <div className='note-actions'>
                            <Button
                                label='Save Note'
                                onClick={handleSaveNote}
                            />
                            <Button
                                label='Delete Note'
                                severity="danger" outlined
                                onClick={() => selectedNote && handleDeleteNote(selectedNote)}
                            />
                        </div>
                    </div>
                ) : (
                    <p className='no-note-selected'>No note selected</p>
                )}
            </div>
        </section>
    );
}
