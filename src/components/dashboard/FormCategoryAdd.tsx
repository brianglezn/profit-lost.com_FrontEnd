import React, { useState, useRef } from "react";
import { Toast } from 'primereact/toast';

import './FormCategory.css';

function FormCategoryAdd({ onCategoryAdded }: { onCategoryAdded: () => void }) {
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
            const response = await fetch('https://profit-lost-backend.onrender.com/categories/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newCategory })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Error: ${response.status}`);
            }

            setNewCategory('');
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Category added successfully',
                life: 3000,
            });

            onCategoryAdded();

        } catch (error) {
            console.error('Failed to save the category:', error);
            const message = error instanceof Error ? error.message : 'An error occurred';
            toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
        }
    };

    return (
        <>
            <Toast ref={toast} position="bottom-right" />
            <form className="formAccounts" onSubmit={handleSaveCategory}>
                <input
                    placeholder="name"
                    value={newCategory}
                    onChange={handleNewCategoryChange}
                    className="w-full"
                />
                <button
                    type="submit"
                    className="form-button"
                >
                    Save
                </button>
            </form>
        </>
    );
}

export default FormCategoryAdd;
