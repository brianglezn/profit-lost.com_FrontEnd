import React, { useRef } from "react";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

function FormCategoryRemove({ categoryId, categoryName, onRemove, onClose }: { categoryId: string, categoryName: string, onRemove: () => void, onClose: () => void }) {
    const toast = useRef<Toast>(null);

    const handleRemoveCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const checkUrl = `https://profit-lost-backend.onrender.com/movements/category/${categoryId}`;
        const deleteUrl = `https://profit-lost-backend.onrender.com/categories/delete/${categoryId}`;

        try {
            const checkResponse = await fetch(checkUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!checkResponse.ok) {
                throw new Error('Failed to check category movements.');
            }

            const { hasMovements } = await checkResponse.json();

            console.log('Category movements:', hasMovements);

            if (hasMovements) {
                console.log('Category has associated movements. Cannot remove.');
                return;
            }

            const deleteResponse = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!deleteResponse.ok) {
                if (deleteResponse.status === 404) {
                    throw new Error('Category not found or does not belong to the user');
                }
                throw new Error('Failed to delete the category.');
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Category Removed',
                detail: `The category "${categoryName}" has been successfully removed.`,
                life: 3000,
            });

            onClose();
            onRemove();
        } catch (error) {
            console.error('Error during category deletion:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred while trying to remove the category.';
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
            <form className="annualReport__containerCategory-formCategory" onSubmit={handleRemoveCategory}>
                <p>Are you sure you want to remove "{categoryName}"?</p>
                <Button
                    type="submit"
                    label="Remove"
                    className="p-button-outlined p-button-warning"
                    style={{
                        borderColor: 'var(--color-orange-400)',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        width: '6rem',
                        margin: '1rem 0 0 0',
                    }}
                />
            </form>
        </>
    );
}

export default FormCategoryRemove;
