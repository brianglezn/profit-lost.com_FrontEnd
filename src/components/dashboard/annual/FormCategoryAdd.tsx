import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import { ColorPicker } from "primereact/colorpicker";

import { addCategory } from "../../../api/categories/addCategory";

import './FormCategory.scss';

function FormCategoryAdd({ onCategoryAdded, onClose }: { onCategoryAdded: () => void, onClose: () => void }) {
    const [newCategory, setNewCategory] = useState('');
    const [color, setColor] = useState('#c84f03');

    const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory(e.target.value);
    };

    const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found. Please log in.');
            toast.error('No authentication token found. Please log in.', { duration: 3000 });
            return;
        }

        try {
            await addCategory(token, newCategory, color);

            setNewCategory('');
            setColor('#c84f03');
            toast.success('Category added successfully', { duration: 3000 });

            onCategoryAdded();

            setTimeout(() => {
                onClose();
            }, 500);

        } catch (error) {
            console.error('Failed to save the category:', error);
            const message = error instanceof Error ? error.message : 'An error occurred';
            toast.error(message, { duration: 3000 });
        }
    };

    return (
        <form className="formCategories" onSubmit={handleSaveCategory}>
            <h2>New category</h2>
            <div className="formCategoriesContainer">
                <div className="formCategoriesContainer-colorPicker">
                    <ColorPicker value={color} onChange={(e) => setColor(e.value as string)} />
                </div>
                <input
                    placeholder="Name"
                    value={newCategory}
                    onChange={handleNewCategoryChange}
                    className="custom-input"
                />
            </div>
            <button type="submit" className="custom-btn">Save</button>
        </form>
    );
}

export default FormCategoryAdd;