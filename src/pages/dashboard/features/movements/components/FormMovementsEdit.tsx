import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { getAllCategories } from '../../../../../api/categories/getAllCategories';
import { editMovement } from '../../../../../api/movements/editMovement';
import { removeMovement } from '../../../../../api/movements/removeMovement';
import type { Category } from '../../../../../helpers/types';

import './FormMovements.scss';

interface FormMovementsEditProps {
    onEdit: () => void;
    onRemove: () => void;
    transaction: {
        _id: string;
        date: string;
        description: string;
        amount: number;
        category: string;
    };
}

export default function FormMovementsEdit({ onEdit, onRemove, transaction }: FormMovementsEditProps) {
    const [dateTime, setDateTime] = useState<string>(new Date(transaction.date).toISOString().slice(0, 16));
    const [description, setDescription] = useState<string>(transaction.description);
    const [amount, setAmount] = useState<string>(Math.abs(transaction.amount).toString());
    const [category, setCategory] = useState<Category | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isIncome, setIsIncome] = useState<boolean>(transaction.amount >= 0);

    const { t } = useTranslation();

    // Fetch categories when the component is mounted
    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error(t('dashboard.common.error_token'));
                return;
            }
            try {
                const fetchedCategories = await getAllCategories(token);
                const sortedCategories = fetchedCategories.sort((a: Category, b: Category) => a.name.localeCompare(b.name));
                setCategories(sortedCategories);

                // Set the current category in the dropdown
                const currentCategory = sortedCategories.find((cat: Category) => cat.name === transaction.category);
                setCategory(currentCategory || null);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error(t('dashboard.common.error_movements_fetch'));
            }
        };

        fetchCategories();
    }, [transaction.category, t]);

    // Handle when user selects 'Income'
    const handleIncomeClick = () => {
        setIsIncome(true);
        setAmount(amount.replace('-', '')); // Remove negative sign from the amount
    };

    // Handle when user selects 'Expense'
    const handleExpenseClick = () => {
        setIsIncome(false);
    };

    // Update the amount input while ensuring the correct sign based on income/expense selection
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isIncome) {
            setAmount(value.replace('-', '')); // Ensure no negative sign for income
        } else {
            setAmount(value);
        }
    };

    // Handle form submission to edit movement
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error(t('dashboard.common.error_token'));
            return;
        }

        // Validate the amount format
        if (!/^-?\d+(\.\d{0,2})?$/.test(amount)) {
            toast.error(t('dashboard.movements.form_movements_add.error_message'));
            return;
        }

        // Format the date to ISO string format with local offset adjustment
        const localDate = new Date(dateTime);
        const offsetDate = new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000));
        const formattedDate = offsetDate.toISOString().slice(0, 19);

        // Create movement data to send for update
        const movementData = {
            date: formattedDate,
            description: description.trim() === '' ? '---' : description,
            amount: Number(amount) * (isIncome ? 1 : -1), // Set amount as negative for expenses
            category: category?._id || '',
        };

        try {
            await editMovement(token, transaction._id, movementData);
            toast.success(t('dashboard.movements.form_movements_edit.success_message_edit')); // Show success toast message
            onEdit(); // Call onEdit callback to refresh data
        } catch (error) {
            console.error('Error updating movement:', error);
            const errorMessage = error instanceof Error ? error.message : t('dashboard.common.error');
            toast.error(errorMessage);
        }
    };

    // Handle remove button click to confirm deletion
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

    // Handle confirmed remove action
    const handleConfirmRemove = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error(t('dashboard.common.error_token'));
            return;
        }

        try {
            await removeMovement(token, transaction._id);
            toast.success(t('dashboard.movements.form_movements_edit.success_message_delete'));
            setTimeout(() => {
                onRemove();
            }, 500);
        } catch (error) {
            console.error('Error removing the transaction:', error);
            toast.error(t('dashboard.movements.form_movements_edit.error_message'));
        }
    };

    return (
        <>
            <ConfirmDialog />
            <form onSubmit={handleSubmit} className='formMovements'>
                <h2>{t('dashboard.movements.form_movements_edit.header')}</h2>
                <div className='formMovements-toggle'>
                    <button
                        type='button'
                        className={`${isIncome ? 'active' : ''}`}
                        onClick={handleIncomeClick}
                    >
                        {t('dashboard.movements.form_movements_edit.income_button')}
                    </button>
                    <button
                        type='button'
                        className={`${!isIncome ? 'active' : ''}`}
                        onClick={handleExpenseClick}
                    >
                        {t('dashboard.movements.form_movements_edit.expense_button')}
                    </button>
                </div>
                <input
                    type='datetime-local'
                    className='formMovements-datetime custom-input'
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
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
                    required
                    className='custom-input'
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
                <div className='formMovements-buttons'>
                    <button type='button' className='custom-btn-sec' onClick={handleRemove}>
                        {t('dashboard.movements.form_movements_edit.delete_button')}
                    </button>
                    <button type='submit' className='custom-btn'>
                        {t('dashboard.movements.form_movements_edit.save_button')}
                    </button>
                </div>
            </form>
        </>
    );
}