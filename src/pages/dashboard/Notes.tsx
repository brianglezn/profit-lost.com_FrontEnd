import { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';

import "./Notes.scss";
import PlusIcon from '../../components/icons/PlusIcon';

interface Note {
    id: number;
    title: string;
    content: string;
    color: string;
}

function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [color, setColor] = useState<string>('#ffffff');
    const [visible, setVisible] = useState<boolean>(false);
    const [editNoteId, setEditNoteId] = useState<number | null>(null);

    const handleAddNote = () => {
        if (title.trim() === '' && content.trim() === '') {
            return;
        }
        const newNote = {
            id: Date.now(),
            title: title,
            content: content,
            color: color
        };
        setNotes([...notes, newNote]);
        setTitle('');
        setContent('');
        setColor('#ffffff');
        setVisible(false);
    };

    const handleDeleteNote = () => {
        if (editNoteId !== null) {
            setNotes(notes.filter(note => note.id !== editNoteId));
            setVisible(false);
            setEditNoteId(null);
            setTitle('');
            setContent('');
            setColor('#ffffff');
        }
    };

    const handleEditNote = (id: number) => {
        const noteToEdit = notes.find(note => note.id === id);
        if (noteToEdit) {
            setTitle(noteToEdit.title);
            setContent(noteToEdit.content);
            setColor(noteToEdit.color);
            setEditNoteId(id);
            setVisible(true);
        }
    };

    const handleSaveEditNote = () => {
        if (editNoteId !== null) {
            const updatedNotes = notes.map(note =>
                note.id === editNoteId ? { ...note, title, content, color } : note
            );
            setNotes(updatedNotes);
            setTitle('');
            setContent('');
            setColor('#ffffff');
            setVisible(false);
            setEditNoteId(null);
        }
    };

    const getExcerpt = (content: string) => {
        const maxLength = 200;
        if (content.length > maxLength) {
            return content.substring(0, maxLength) + '...';
        }
        return content;
    };

    return (
        <section className="notes">
            <button className="notes__add-button" onClick={() => setVisible(true)}>
                <PlusIcon />
            </button>
            <div className="notes__list">
                {notes.map(note => (
                    <div key={note.id} className="note" style={{ backgroundColor: note.color }} onClick={() => handleEditNote(note.id)}>
                        <h3>{note.title}</h3>
                        <p>{getExcerpt(note.content)}</p>
                    </div>
                ))}
            </div>
            <Sidebar
                visible={visible}
                position="right"
                onHide={() => setVisible(false)}
                style={{ width: '450px' }}
                className='sidebar__notes'
            >
                <h2>{editNoteId !== null ? 'Edit Note' : 'Create Note'}</h2>
                <div className="notes__form">
                    <InputText
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <InputTextarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={15}
                        cols={30}
                    />
                    <div className="notes__form-footer">
                        <button onClick={editNoteId !== null ? handleSaveEditNote : handleAddNote} className="custom-btn">
                            {editNoteId !== null ? 'Save' : 'Add Note'}
                        </button>
                        {editNoteId !== null && (
                            <button className="custom-btn" onClick={handleDeleteNote}>
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </Sidebar>
        </section>
    );
}

export default Notes;