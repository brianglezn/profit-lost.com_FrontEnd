import React, { useState, useRef } from "react";
import { Toast } from 'primereact/toast';

import { addCategory } from "../../../api/categories/addCategory";

import './FormCategory.scss';

function FormCategoryAdd({ onCategoryAdded, onClose }: { onCategoryAdded: () => void, onClose: () => void }) {
    const [newCategory, setNewCategory] = useState('');
    const toast = useRef<Toast>(null);

    const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory(e.target.value);
    };

    const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found. Please log in.');
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No authentication token found. Please log in.', life: 3000 });
            return;
        }

        try {
            await addCategory(token, newCategory);

            setNewCategory('');
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Category added successfully',
                life: 3000,
            });

            onCategoryAdded();

            setTimeout(() => {
                onClose();
            }, 500);

        } catch (error) {
            console.error('Failed to save the category:', error);
            const message = error instanceof Error ? error.message : 'An error occurred';
            toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
        }
    };

    return (
        <>
            <Toast ref={toast} position="bottom-right" />
            <form className="formCategories" onSubmit={handleSaveCategory}>
                <h2>New Category</h2>
                <input
                    placeholder="name"
                    value={newCategory}
                    onChange={handleNewCategoryChange}
                    className="w-full"
                />
                <button type="submit" className="custom-btn">Save</button>
            </form>
        </>
    );
}

export default FormCategoryAdd;
