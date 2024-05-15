import { useRef, useState } from "react";
import { Toast } from 'primereact/toast';

import { editCategory } from "../../../api/categories/editCategory";
import { removeCategory } from "../../../api/categories/removeCategory";

import './FormCategory.scss';

interface FormCategoryEditProps {
    categoryId: string;
    categoryName: string;
    onUpdate: () => void;
    onClose: () => void;
    onRemove: () => void;
}

const FormCategoryEdit: React.FC<FormCategoryEditProps> = ({ categoryId, categoryName, onUpdate, onClose, onRemove }) => {
    const [name, setName] = useState(categoryName);
    const toast = useRef<Toast>(null);

    const handleEditCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Authentication token not found');
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Authentication token not found. Please log in.',
                life: 3000
            });
            return;
        }

        try {
            await editCategory(token, categoryId, name);
            toast.current?.show({
                severity: 'success',
                summary: 'Category Edited',
                detail: `The category has been successfully edited.`,
                life: 3000,
            });
            setTimeout(() => {
                onClose();
                onUpdate();
            }, 500);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
            console.error('Catch block error during category edition:', errorMessage);
            toast.current?.show({
                severity: 'error',
                summary: 'Error Editing Category',
                detail: errorMessage,
                life: 5000,
            });
        }
    };

    const handleRemoveCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Authentication token not found');
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Authentication token not found. Please log in.',
                life: 3000
            });
            return;
        }

        try {
            await removeCategory(token, categoryId);
            toast.current?.show({
                severity: 'success',
                summary: 'Category Removed',
                detail: `The category "${categoryName}" has been successfully removed.`,
                life: 3000,
            });
            setTimeout(() => {
                onClose();
                onRemove();
            }, 500);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
            console.error('Error during category deletion:', errorMessage);
            toast.current?.show({
                severity: 'error',
                summary: 'Error Removing Category',
                detail: errorMessage,
                life: 5000,
            });
        }
    };

    return (
        <>
            <Toast ref={toast} position="bottom-right" />
            <form className="formCategories" onSubmit={handleEditCategory}>
                <h2>Edit Category</h2>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                />
                <div className="formCategories-buttons">
                    <button type="submit" className="custom-btn">Save</button>
                    <button type="submit" className="custom-btn" onClick={handleRemoveCategory}>Remove</button>
                </div>
            </form>
        </>
    );
};

export default FormCategoryEdit;
