import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import { ColorPicker } from "primereact/colorpicker";
import { useTranslation } from 'react-i18next';

import { addCategory } from "../../../api/categories/addCategory";

import './FormCategory.scss';

function FormCategoryAdd({ onCategoryAdded, onClose }: { onCategoryAdded: () => void, onClose: () => void }) {
    const { t } = useTranslation();
    const [newCategory, setNewCategory] = useState('');
    const [color, setColor] = useState('#fe6f14');

    const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory(e.target.value);
    };

    const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error(t('landing.auth.common.error_token'), { duration: 3000 });
            return;
        }

        try {
            await addCategory(token, newCategory, color);

            setNewCategory('');
            setColor('#fe6f14');
            toast.success(t('dashboard.annual_report.form_cat_add.success_message'), { duration: 3000 });

            onCategoryAdded();

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
        <form className="formCategories" onSubmit={handleSaveCategory}>
            <h2>{t('dashboard.annual_report.form_cat_add.header')}</h2>
            <div className="formCategoriesContainer">
                <div className="formCategoriesContainer-colorPicker">
                    <ColorPicker value={color} onChange={(e) => setColor(e.value as string)} />
                </div>
                <input
                    placeholder={t('dashboard.annual_report.form_cat_add.name_placeholder')}
                    value={newCategory}
                    onChange={handleNewCategoryChange}
                    className="custom-input"
                />
            </div>
            <button type="submit" className="custom-btn">{t('dashboard.annual_report.form_cat_add.save_button')}</button>
        </form>
    );
}

export default FormCategoryAdd;
