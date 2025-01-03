import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ColorPicker } from 'primereact/colorpicker';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { addCategory } from '../../../../../api/categories/addCategory';
import { editCategory } from '../../../../../api/categories/editCategory';
import { removeCategory } from '../../../../../api/categories/removeCategory';
import { getAllMovements } from '../../../../../api/movements/getAllMovements';
import { formatCurrency, formatDateTime } from '../../../../../helpers/functions';
import { Movements } from '../../../../../helpers/types';
import { useUser } from '../../../../../context/useUser';

import './FormCategory.scss';

interface FormCategoryProps {
    onSubmit: () => void;
    onClose: () => void;
    onRemove?: () => void;
    category?: {
        id: string;
        name: string;
        color: string;
    };
}

export default function FormCategory({ category, onSubmit, onClose, onRemove }: FormCategoryProps) {
    const isEdit = !!category;
    const [name, setName] = useState(category?.name || '');
    const [color, setColor] = useState(category?.color || '#fe6f14');
    const [movementsByYear, setMovementsByYear] = useState<{ [key: string]: Movements[] }>({});
    
    const { user } = useUser();
    const { t } = useTranslation();

    useEffect(() => {
        if (isEdit) {
            const fetchMovements = async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error(t('dashboard.common.error_token'));
                    return;
                }

                try {
                    const movements: Movements[] = await getAllMovements(token);
                    const filteredMovements = movements.filter((movement) => movement.category === category.name);
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
        }
    }, [isEdit, category, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error(t('dashboard.common.error_token'), { duration: 3000 });
            return;
        }

        try {
            if (isEdit && category) {
                await editCategory(token, category.id, name, color);
                toast.success(t('dashboard.annual_report.form_cat_edit.success_message_edit'));
            } else {
                await addCategory(token, name, color);
                toast.success(t('dashboard.annual_report.form_cat_add.success_message'));
            }
            
            setTimeout(() => {
                onClose();
                onSubmit();
            }, 500);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : t('dashboard.common.error'));
        }
    };

    const handleRemoveCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEdit || !category) return;

        confirmDialog({
            message: t('dashboard.annual_report.form_cat_edit.confirm_delete', { category: name }),
            header: t('dashboard.annual_report.form_cat_edit.confirm_delete_header'),
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: t('dashboard.annual_report.form_cat_edit.confirm_delete_accept'),
            rejectLabel: t('dashboard.annual_report.form_cat_edit.confirm_delete_reject'),
            accept: handleConfirmRemove,
            position: 'bottom'
        });
    };

    const handleConfirmRemove = async () => {
        if (!isEdit || !category) return;
        
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error(t('landing.auth.common.error_token'), { duration: 3000 });
            return;
        }

        try {
            await removeCategory(token, category.id);
            toast.success(t('dashboard.annual_report.form_cat_edit.success_message_delete', { category: name }));
            setTimeout(() => {
                onClose();
                if (onRemove) onRemove();
            }, 500);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : t('common.error'));
        }
    };

    return (
        <>
            <ConfirmDialog />
            <form className='formCategories' onSubmit={handleSubmit}>
                <h2>
                    {isEdit 
                        ? t('dashboard.annual_report.form_cat_edit.header', { category: name })
                        : t('dashboard.annual_report.form_cat_add.header')
                    }
                </h2>
                <div className='formCategoriesContainer'>
                    <div className='formCategoriesContainer-colorPicker'>
                        <ColorPicker value={color} onChange={(e) => setColor(e.value as string)} />
                    </div>
                    <input
                        className='custom-input'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('dashboard.annual_report.form_cat_add.name_placeholder')}
                        autoFocus
                    />
                </div>
                <div className='formCategories-buttons'>
                    {isEdit && (
                        <button type='button' className='custom-btn-sec' onClick={handleRemoveCategory}>
                            {t('dashboard.annual_report.form_cat_edit.remove_button')}
                        </button>
                    )}
                    <button type='submit' className='custom-btn'>
                        {t('dashboard.annual_report.form_cat_edit.save_button')}
                    </button>
                </div>

                {isEdit && Object.keys(movementsByYear).length > 0 && (
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