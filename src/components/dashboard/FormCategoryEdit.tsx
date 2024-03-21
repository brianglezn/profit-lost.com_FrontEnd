import { useRef, useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

interface FormCategoryEditProps {
    categoryId: string;
    categoryName: string;
    onUpdate: () => void;
    onClose: () => void;
}

const FormCategoryEdit: React.FC<FormCategoryEditProps> = ({ categoryId, categoryName, onUpdate, onClose }) => {
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

        const editUrl = `https://profit-lost-backend.onrender.com/categories/edit/${categoryId}`;

        try {
            const editResponse = await fetch(editUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });

            if (editResponse.ok) {
                const contentType = editResponse.headers.get("Content-Type");
                if (contentType && contentType.includes("application/json")) {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Category Edited',
                        detail: `The category has been successfully edited.`,
                        life: 3000,
                    });
                } else {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Category Edited',
                        detail: `The category has been successfully edited`,
                        life: 3000,
                    });
                }
            } else {
                const errorText = await editResponse.text();
                console.error('Error during category edition:', errorText);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error Editing Category',
                    detail: errorText,
                    life: 5000,
                });
            }

            setTimeout(() => {
                onClose();
                onUpdate();
            }, 2000);

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

    return (
        <>
            <Toast ref={toast} position="bottom-right" />
            <form className="formAccounts" onSubmit={handleEditCategory}>
                <input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                <button type="submit" className="form-button">Save</button>
            </form>
        </>
    );
};

export default FormCategoryEdit;

