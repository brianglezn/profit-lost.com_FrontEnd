import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { getAllCategories } from '../../../../../api/categories/getAllCategories';
import { addMovement } from '../../../../../api/movements/addMovement';
import { editMovement } from '../../../../../api/movements/editMovement';
import { removeMovement } from '../../../../../api/movements/removeMovement';
import type { Category } from '../../../../../helpers/types';

import './FormMovements.scss';

interface FormMovementsProps {
    onSubmit: () => void;
    onClose: () => void;
    selectedYear?: string;
    selectedMonth?: string;
    transaction?: {
        _id: string;
        date: string;
        description: string;
        amount: number;
        category: string;
    };
    onRemove?: () => void;
}

export default function FormMovements({ 
    onSubmit, 
    onClose, 
    selectedYear, 
    selectedMonth, 
    transaction,
    onRemove 
}: FormMovementsProps) {
    const isEdit = !!transaction;
    const [date, setDate] = useState<string>(
        isEdit 
            ? new Date(transaction.date).toISOString().slice(0, 16)
            : ''
    );
    const [description, setDescription] = useState<string>(transaction?.description || '');
    const [amount, setAmount] = useState<string>(transaction ? Math.abs(transaction.amount).toString() : '');
    const [category, setCategory] = useState<Category | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isIncome, setIsIncome] = useState<boolean>(transaction ? transaction.amount >= 0 : false);
    const [isRecurring, setIsRecurring] = useState<boolean>(false);
    const [recurrenceFrequency, setRecurrenceFrequency] = useState<string>('monthly');
    const [recurrenceEnd, setRecurrenceEnd] = useState<string>('');

    const { t } = useTranslation();

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error(t('dashboard.common.error_token'));
                return;
            }
            try {
                const fetchedCategories = await getAllCategories(token);
                const sortedCategories = fetchedCategories.sort((a: Category, b: Category) => 
                    a.name.localeCompare(b.name)
                );
                setCategories(sortedCategories);

                if (isEdit) {
                    const currentCategory = sortedCategories.find(
                        (cat: Category) => cat.name === transaction.category
                    );
                    setCategory(currentCategory || null);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error(t('dashboard.common.error_movements_fetch'));
            }
        };

        fetchCategories();
    }, [t, isEdit, transaction?.category]);

    // Set initial date for new movements
    useEffect(() => {
        if (!isEdit && selectedYear && selectedMonth) {
            const currentDate = new Date();
            if (selectedMonth !== (currentDate.getMonth() + 1).toString().padStart(2, '0') || 
                selectedYear !== currentDate.getFullYear().toString()) {
                const initialDate = `${selectedYear}-${selectedMonth}-01T00:00`;
                setDate(initialDate);
            } else {
                const localDateTime = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000))
                    .toISOString()
                    .slice(0, 16);
                setDate(localDateTime);
            }
        }
    }, [selectedYear, selectedMonth, isEdit]);

    const handleIncomeClick = () => {
        setIsIncome(true);
        setAmount(amount.replace('-', ''));
    };

    const handleExpenseClick = () => {
        setIsIncome(false);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isIncome) {
            setAmount(value.replace('-', ''));
        } else {
            setAmount(value);
        }
    };

    const createRecurringMovements = (movementData: { 
        date: string; 
        description: string; 
        amount: number; 
        category: string 
    }) => {
        const movements = [];
        const currentDate = new Date(movementData.date);
        const endDate = new Date(new Date(recurrenceEnd).setDate(new Date(recurrenceEnd).getDate() + 1));

        if (recurrenceFrequency === 'monthly') {
            let isFirstMovement = true;
            while (currentDate <= endDate) {
                if (isFirstMovement) {
                    movements.push({
                        ...movementData,
                        date: currentDate.toISOString(),
                    });
                    isFirstMovement = false;
                } else {
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    currentDate.setDate(1);
                    currentDate.setHours(10, 0, 0, 0);
                    if (currentDate > endDate) break;
                    movements.push({
                        ...movementData,
                        date: currentDate.toISOString(),
                    });
                }
            }
        } else if (recurrenceFrequency === 'yearly') {
            while (currentDate.getFullYear() <= endDate.getFullYear()) {
                movements.push({
                    ...movementData,
                    date: currentDate.toISOString(),
                });
                currentDate.setFullYear(currentDate.getFullYear() + 1);
            }
        }

        return movements;
    };

    const handleConfirmRemove = async () => {
        if (!isEdit || !transaction) return;

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error(t('dashboard.common.error_token'));
            return;
        }

        try {
            await removeMovement(token, transaction._id);
            toast.success(t('dashboard.movements.form_movements_edit.success_message_delete'));
            setTimeout(() => {
                onRemove?.();
            }, 500);
        } catch (error) {
            console.error('Error removing the transaction:', error);
            toast.error(t('dashboard.movements.form_movements_edit.error_message'));
        }
    };

    const handleRemove = (e: React.FormEvent) => {
        e.preventDefault();
        confirmDialog({
            message: t('dashboard.movements.form_movements_edit.confirm_delete'),
            header: t('dashboard.movements.form_movements_edit.delete_button'),
            accept: handleConfirmRemove,
            reject: () => {},
            position: 'bottom'
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error(t('dashboard.common.error_token'));
            return;
        }

        if (!/^\d+(\.\d{0,2})?$/.test(amount)) {
            toast.error(t('dashboard.movements.form_movements_add.error_message'));
            return;
        }

        if (!category) {
            toast.error(t('dashboard.movements.form_movements_add.category_placeholder'));
            return;
        }

        if (!isEdit && isRecurring) {
            const currentDate = new Date();
            const recurrenceEndDate = new Date(recurrenceEnd);

            if (recurrenceEndDate <= currentDate) {
                toast.error(t('dashboard.movements.form_movements_add.recurrence_end_error'));
                return;
            }
        }

        const localDate = new Date(date);
        const offsetDate = new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000));
        const formattedDate = offsetDate.toISOString();

        const movementData = {
            date: formattedDate,
            description: description.trim() === '' ? (isEdit ? '---' : category.name) : description,
            amount: Number(amount) * (isIncome ? 1 : -1),
            category: category._id,
        };

        try {
            if (isEdit && transaction) {
                await editMovement(token, transaction._id, movementData);
                toast.success(t('dashboard.movements.form_movements_edit.success_message_edit'));
            } else {
                const movements = isRecurring ? createRecurringMovements(movementData) : [movementData];
                for (const movement of movements) {
                    await addMovement(token, movement);
                }
                toast.success(t('dashboard.movements.form_movements_add.success_message'));
            }

            onSubmit();
            onClose();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('dashboard.common.error');
            toast.error(errorMessage);
        }
    };

    return (
        <>
            {isEdit && <ConfirmDialog />}
            <form onSubmit={handleSubmit} className='formMovements'>
                <h2>
                    {isEdit 
                        ? t('dashboard.movements.form_movements_edit.header')
                        : t('dashboard.movements.form_movements_add.header')
                    }
                </h2>
                <div className='formMovements-toggle'>
                    <button
                        type='button'
                        className={`${isIncome ? 'active' : ''}`}
                        onClick={handleIncomeClick}
                    >
                        {t('dashboard.movements.form_movements_add.income_button')}
                    </button>
                    <button
                        type='button'
                        className={`${!isIncome ? 'active' : ''}`}
                        onClick={handleExpenseClick}
                    >
                        {t('dashboard.movements.form_movements_add.expense_button')}
                    </button>
                </div>
                <input
                    type='datetime-local'
                    className='formMovements-datetime custom-input'
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <Dropdown
                    value={category}
                    options={categories}
                    onChange={(e) => setCategory(e.value)}
                    optionLabel='name'
                    placeholder={t('dashboard.movements.form_movements_add.category_placeholder')}
                    className='formDropdown'
                    filter
                    showClear
                    filterBy='name'
                    required
                />
                <InputText
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('dashboard.movements.form_movements_add.description_placeholder')}
                    className='custom-input'
                    required={isEdit}
                />
                <InputText
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder={t('dashboard.movements.form_movements_add.amount_placeholder')}
                    type='number'
                    step='0.01'
                    min={isIncome ? '0' : undefined}
                    required
                    className='custom-input'
                />
                {!isEdit && (
                    <div className='formMovements-recurring'>
                        <label>
                            <input
                                type='checkbox'
                                checked={isRecurring}
                                onChange={(e) => setIsRecurring(e.target.checked)}
                            />
                            {t('dashboard.movements.form_movements_add.recurring_label')}
                        </label>
                        {isRecurring && (
                            <div className='formMovements-recurring-options'>
                                <Dropdown
                                    value={recurrenceFrequency}
                                    options={[
                                        { label: t('dashboard.movements.form_movements_add.monthly'), value: 'monthly' },
                                        { label: t('dashboard.movements.form_movements_add.yearly'), value: 'yearly' }
                                    ]}
                                    onChange={(e) => setRecurrenceFrequency(e.value)}
                                    placeholder={t('dashboard.movements.form_movements_add.recurring_frequency')}
                                    className='formDropdown'
                                />
                                {recurrenceFrequency === 'monthly' ? (
                                    <input
                                        type='month'
                                        value={recurrenceEnd}
                                        onChange={(e) => setRecurrenceEnd(e.target.value)}
                                        className='custom-input'
                                        placeholder={t('dashboard.movements.form_movements_add.end_date')}
                                        required
                                    />
                                ) : (
                                    <input
                                        type='number'
                                        value={recurrenceEnd}
                                        onChange={(e) => setRecurrenceEnd(e.target.value)}
                                        className='custom-input'
                                        placeholder={t('dashboard.movements.form_movements_add.end_date')}
                                        min={new Date().getFullYear()}
                                        required
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )}
                <div className='formMovements-buttons'>
                    {isEdit && (
                        <button type='button' className='custom-btn-sec' onClick={handleRemove}>
                            {t('dashboard.movements.form_movements_edit.delete_button')}
                        </button>
                    )}
                    <button type='submit' className='custom-btn'>
                        {t('dashboard.movements.form_movements_edit.save_button')}
                    </button>
                </div>
            </form>
        </>
    );
} 