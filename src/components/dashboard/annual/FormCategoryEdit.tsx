import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import { ColorPicker } from "primereact/colorpicker";

import { editCategory } from "../../../api/categories/editCategory";
import { removeCategory } from "../../../api/categories/removeCategory";

import './FormCategory.scss';

interface FormCategoryEditProps {
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    onUpdate: () => void;
    onClose: () => void;
    onRemove: () => void;
}

const FormCategoryEdit: React.FC<FormCategoryEditProps> = ({ categoryId, categoryName, categoryColor, onUpdate, onClose, onRemove }) => {
    const [name, setName] = useState(categoryName);
    const [color, setColor] = useState(categoryColor);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleEditCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Authentication token not found');
            toast.error('Authentication token not found. Please log in.', { duration: 3000 });
            return;
        }

        try {
            await editCategory(token, categoryId, name, color);
            toast.success('Category edited successfully', { duration: 3000 });
            setTimeout(() => {
                onClose();
                onUpdate();
            }, 500);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
            console.error('Error during category edition:', errorMessage);
            toast.error(errorMessage, { duration: 5000 });
        }
    };

    const handleRemoveCategory = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirmRemove = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Authentication token not found');
            toast.error('Authentication token not found. Please log in.', { duration: 3000 });
            return;
        }

        try {
            await removeCategory(token, categoryId);
            toast.success(`The category "${name}" has been successfully removed.`, { duration: 3000 });
            setTimeout(() => {
                onClose();
                onRemove();
            }, 500);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
            console.error('Error during category deletion:', errorMessage);
            toast.error(errorMessage, { duration: 5000 });
        }
    };

    return (
        <form className="formCategories" onSubmit={handleEditCategory}>
            <h2>Edit category</h2>
            <div className="formCategoriesContainer">
                <div className="formCategoriesContainer-colorPicker">
                    <ColorPicker value={color} onChange={(e) => setColor(e.value as string)} />
                </div>
                <input
                    className="custom-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                />
            </div>
            <div className="formCategories-buttons">
                <button type="button" className="custom-btn" onClick={handleRemoveCategory}>Remove</button>
                <button type="submit" className="custom-btn">Save</button>
            </div>

            {showConfirm && (
                <div className="form-confirmBtn">
                    <p>Are you sure you want to delete <b>"{name}"</b>?</p>
                    <button type="button" className="custom-btn" onClick={handleConfirmRemove}>Confirm</button>
                </div>
            )}
        </form>
    );
};

export default FormCategoryEdit;