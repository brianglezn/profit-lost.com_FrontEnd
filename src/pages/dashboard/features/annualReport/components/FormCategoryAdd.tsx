import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ColorPicker } from 'primereact/colorpicker';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';

import { addCategory } from '../../../../../api/categories/addCategory';

import './FormCategory.scss';

// Component for adding a new category
export default function FormCategoryAdd({ onCategoryAdded, onClose }: { onCategoryAdded: () => void, onClose: () => void }) {
    const [newCategory, setNewCategory] = useState('');
    const [color, setColor] = useState('#fe6f14');

    const { t } = useTranslation();

    // Handle changes to the new category input field
    const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory(e.target.value);
    };

    // Handle saving the new category when the form is submitted
    const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error(t('landing.auth.common.error_token'), { duration: 3000 });
            return;
        }

        try {
            // Add new category using API function
            await addCategory(token, newCategory, color);

            // Reset the form fields after saving the category
            setNewCategory('');
            setColor('#fe6f14');
            toast.success(t('dashboard.annual_report.form_cat_add.success_message'), { duration: 3000 });

            // Call callback to indicate that a new category has been added
            onCategoryAdded();

            // Close the form after a short delay
            setTimeout(() => {
                onClose();
            }, 500);

        } catch (error) {
            console.error('Failed to save the category:', error);
            const message = error instanceof Error ? error.message : t('dashboard.common.error');
            toast.error(message, { duration: 3000 });
        }
    };

    return (
        <form className='formCategories' onSubmit={handleSaveCategory}>
            <h2>{t('dashboard.annual_report.form_cat_add.header')}</h2>
            <div className='formCategoriesContainer'>
                {/* Color Picker for selecting category color */}
                <div className='formCategoriesContainer-colorPicker'>
                    <ColorPicker value={color} onChange={(e) => setColor(e.value as string)} />
                </div>
                {/* Input field for entering the category name */}
                <InputText
                    placeholder={t('dashboard.annual_report.form_cat_add.name_placeholder')}
                    value={newCategory}
                    onChange={handleNewCategoryChange}
                    className='custom-input'
                />
            </div>
            {/* Button to save the new category */}
            <button type='submit' className='custom-btn'>{t('dashboard.annual_report.form_cat_add.save_button')}</button>
        </form>
    );
}
