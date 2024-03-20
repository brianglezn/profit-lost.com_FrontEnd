import { useRef } from "react";
import { Toast } from 'primereact/toast';

interface FormCategoryRemoveProps {
    categoryId: string;
    categoryName: string;
    onRemove: () => void;
    onClose: () => void;
}

const FormCategoryRemove: React.FC<FormCategoryRemoveProps> = ({ categoryId, categoryName, onRemove, onClose }) => {
    const toast = useRef<Toast>(null);

    const handleRemoveCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Authentication token not found');
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Authentication token not found. Please log in.', life: 3000 });
            return;
        }

        const deleteUrl = `https://profit-lost-backend.onrender.com/categories/remove/${categoryId}`;

        try {
            const deleteResponse = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!deleteResponse.ok) {
                let errorMessage;
                const contentType = deleteResponse.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await deleteResponse.json();
                    errorMessage = errorData.message || 'Failed to delete the category.';
                } else {
                    errorMessage = await deleteResponse.text();
                }
                throw new Error(errorMessage);
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Category Removed',
                detail: `The category "${categoryName}" has been successfully removed.`,
                life: 3000,
            });

            setTimeout(() => {
                onClose();
                onRemove();
            }, 2000);

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
            <form className="annualReport__containerCategory-formCategoryRemove" onSubmit={handleRemoveCategory} >
                <p>Are you sure you want to remove the category "<strong>{categoryName}</strong>"?</p>
                <button
                    type="submit"
                    className="form-button"
                >
                    Remove
                </button>
            </form>
        </>
    );
}

export default FormCategoryRemove;
