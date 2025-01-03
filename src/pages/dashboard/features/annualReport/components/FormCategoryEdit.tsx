import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ColorPicker } from 'primereact/colorpicker';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { editCategory } from '../../../../../api/categories/editCategory';
import { removeCategory } from '../../../../../api/categories/removeCategory';
import { getAllMovements } from '../../../../../api/movements/getAllMovements';
import { formatCurrency, formatDateTime } from '../../../../../helpers/functions';
import { Movements } from '../../../../../helpers/types';
import { useUser } from '../../../../../context/useUser';

import './FormCategory.scss';

interface FormCategoryEditProps {
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    onUpdate: () => void;
    onClose: () => void;
    onRemove: () => void;
}

export default function FormCategoryEdit({ categoryId, categoryName, categoryColor, onUpdate, onClose, onRemove }: FormCategoryEditProps) {
    const [name, setName] = useState(categoryName);
    const [color, setColor] = useState(categoryColor);
    const [movementsByYear, setMovementsByYear] = useState<{ [key: string]: Movements[] }>({});
    const { user } = useUser();
    const { t } = useTranslation();

    // Fetch all movements related to the category
    useEffect(() => {
        const fetchMovements = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error(t('dashboard.common.error_token'));
                return;
            }

            try {
                const movements: Movements[] = await getAllMovements(token);
                
                // Filter movements to only include those for the given category
                const filteredMovements = movements.filter((movement) => movement.category === categoryName);

                // Group movements by year
                const groupedMovements = filteredMovements.reduce<{ [key: string]: Movements[] }>((acc, movement) => {
                    const year = new Date(movement.date).getFullYear().toString();
                    if (!acc[year]) acc[year] = [];
                    acc[year].push(movement);
                    return acc;
                }, {});

                setMovementsByYear(groupedMovements);
            } catch (error) {
                toast.error(t('dashboard.common.error_movements_fetch'));
            }
        };

        fetchMovements();
    }, [categoryId, categoryName, t]);

    // Handle category edit form submission
    const handleEditCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error(t('dashboard.common.error_token'), { duration: 3000 });
            return;
        }

        try {
            // Send request to edit the category
            await editCategory(token, categoryId, name, color);
            toast.success(t('dashboard.annual_report.form_cat_edit.success_message_edit'), { duration: 3000 });
            setTimeout(() => {
                onClose();
                onUpdate();
            }, 500);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : t('dashboard.common.error'));
        }
    };

    // Show confirmation dialog before deleting the category
    const handleRemoveCategory = (e: React.FormEvent) => {
        e.preventDefault();
        confirmDialog({
            message: t('dashboard.annual_report.form_cat_edit.confirm_delete', { category: name }),
            header: t('dashboard.annual_report.form_cat_edit.remove_button'),
            accept: handleConfirmRemove,
            reject: () => { },
            position: 'bottom'
        });
    };

    // Confirm deletion of the category and remove it
    const handleConfirmRemove = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error(t('landing.auth.common.error_token'), { duration: 3000 });
            return;
        }

        try {
            // Send request to remove the category
            await removeCategory(token, categoryId);
            toast.success(t('dashboard.annual_report.form_cat_edit.success_message_delete', { category: name }), { duration: 3000 });
            setTimeout(() => {
                onClose();
                onRemove();
            }, 500);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : t('common.error'));
        }
    };

    return (
        <>
            <ConfirmDialog />
            <form className='formCategories' onSubmit={handleEditCategory}>
                <h2>{t('dashboard.annual_report.form_cat_edit.header', { category: name })}</h2>
                <div className='formCategoriesContainer'>
                    <div className='formCategoriesContainer-colorPicker'>
                        <ColorPicker value={color} onChange={(e) => setColor(e.value as string)} />
                    </div>
                    <input
                        className='custom-input'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('dashboard.annual_report.form_cat_edit.name_placeholder')}
                        autoFocus
                    />
                </div>
                <div className='formCategories-buttons'>
                    <button type='button' className='custom-btn-sec' onClick={handleRemoveCategory}>
                        {t('dashboard.annual_report.form_cat_edit.remove_button')}
                    </button>
                    <button type='submit' className='custom-btn'>
                        {t('dashboard.annual_report.form_cat_edit.save_button')}
                    </button>
                </div>

                {Object.keys(movementsByYear).length > 0 && (
                    <div className='movementsByCategory'>
                        <Accordion multiple className='movementsByCategory-container'>
                            {Object.keys(movementsByYear)
                                .sort((a, b) => Number(b) - Number(a))
                                .map((year) => (
                                    <AccordionTab key={year} header={year}>
                                        <div className='movementsByCategory-list'>
                                            {movementsByYear[year]
                                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                                .map((movement) => (
                                                    <div key={movement._id} className='movementsByCategory-item'>
                                                        <div className='movementsByCategory-date'>
                                                            {formatDateTime(
                                                                movement.date,
                                                                user?.language || 'en',
                                                                user?.dateFormat || 'MM/DD/YYYY',
                                                                user?.timeFormat || '12h'
                                                            )}
                                                        </div>
                                                        <div className='movementsByCategory-description'>
                                                            {movement.description}
                                                        </div>
                                                        <div className={`movementsByCategory-amount ${movement.amount >= 0 ? 'positive' : 'negative'}`}>
                                                            {formatCurrency(movement.amount, user?.currency || 'USD')}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </AccordionTab>
                                ))}
                        </Accordion>
                    </div>
                )}
            </form>
        </>
    );
}
