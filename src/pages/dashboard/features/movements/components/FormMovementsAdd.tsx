import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';

import { getAllCategories } from '../../../../../api/categories/getAllCategories';
import { addMovement } from '../../../../../api/movements/addMovement';

import './FormMovements.scss';

interface Category {
    _id: string;
    name: string;
}

interface FormMovementsAddProps {
    onMovementAdded: () => void;
    onClose: () => void;
    selectedYear: string;
    selectedMonth: string;
}

export default function FormMovementsAdd({ onMovementAdded, onClose, selectedYear, selectedMonth }: FormMovementsAddProps) {
    const [date, setDate] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [category, setCategory] = useState<Category | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isIncome, setIsIncome] = useState<boolean>(false);
    const [isRecurring, setIsRecurring] = useState<boolean>(false);
    const [recurrenceFrequency, setRecurrenceFrequency] = useState<string>('monthly');
    const [recurrenceEnd, setRecurrenceEnd] = useState<string>('');

    const { t } = useTranslation();

    // Fetch categories from the server on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error(t('dashboard.common.error_token'));
                return;
            }
            try {
                const categories = await getAllCategories(token);
                // Sort categories alphabetically by name
                const sortedCategories = categories.sort((a: Category, b: Category) => a.name.localeCompare(b.name));
                setCategories(sortedCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error(t('dashboard.common.error_movements_fetch'));
            }
        };

        fetchCategories();
    }, [t]);

    // Set the initial date depending on the selected month and year
    useEffect(() => {
        const currentDate = new Date();

        // If the selected year/month is different from the current date, set to the first day of that month
        if (selectedMonth !== (currentDate.getMonth() + 1).toString().padStart(2, '0') || selectedYear !== currentDate.getFullYear().toString()) {
            const initialDate = `${selectedYear}-${selectedMonth}-01T00:00`;
            setDate(initialDate);
        } else {
            // Otherwise, set to the current date
            const localDateTime = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
            setDate(localDateTime);
        }
    }, [selectedYear, selectedMonth]);

    // Handle the click to mark the movement as income
    const handleIncomeClick = () => {
        setIsIncome(true);
        setAmount(amount.replace('-', '')); // Remove negative sign if present
    };

    // Handle the click to mark the movement as expense
    const handleExpenseClick = () => {
        setIsIncome(false);
    };

    // Handle amount change, ensuring that income is always positive
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isIncome) {
            setAmount(value.replace('-', '')); // Prevent negative value if it is income
        } else {
            setAmount(value);
        }
    };

    // Create recurring movements if the user selects recurrence
    const createRecurringMovements = (movementData: { date: string; description: string; amount: number; category: string }) => {
        const movements = [];
        const currentDate = new Date(movementData.date);
        const endDate = new Date(new Date(recurrenceEnd).setDate(new Date(recurrenceEnd).getDate() + 1));

        if (recurrenceFrequency === 'monthly') {
            let isFirstMovement = true;
            // Generate monthly movements until the end date
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
            // Generate yearly movements until the end year
            while (currentDate.getFullYear() <= endDate.getFullYear()) {
                movements.push({
                    ...movementData,
                    date: currentDate.toISOString(),
                });
                currentDate.setFullYear(currentDate.getFullYear() + 1);
            }
            if (currentDate.getFullYear() === endDate.getFullYear()) {
                movements.push({
                    ...movementData,
                    date: currentDate.toISOString(),
                });
            }
        }

        return movements;
    };

    // Handle form submission to add a new movement
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error(t('dashboard.common.error_token'));
            return;
        }

        // Validate amount format
        if (!/^\d+(\.\d{0,2})?$/.test(amount)) {
            toast.error(t('dashboard.movements.form_movements_add.error_message'));
            return;
        }

        if (!category) {
            toast.error(t('dashboard.movements.form_movements_add.category_placeholder'));
            return;
        }

        // Create the movement data object
        const movementData = {
            date: date,
            description: description.trim() === '' ? category.name : description, // Default description to category name if empty
            amount: parseFloat(amount.replace(',', '.')) * (isIncome ? 1 : -1),
            category: category._id,
        };

        try {
            const movements = isRecurring ? createRecurringMovements(movementData) : [movementData];
            for (const movement of movements) {
                await addMovement(token, movement);
            }

            toast.success(t('dashboard.movements.form_movements_add.success_message'));

            onMovementAdded(); // Notify parent component that a movement was added
            onClose(); 
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('dashboard.common.error');
            toast.error(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='formMovements'>
            <h2>{t('dashboard.movements.form_movements_add.header')}</h2>
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className='formMovements-datetime custom-input'
                placeholder=' '
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
            />
            <InputText
                value={amount}
                onChange={handleAmountChange}
                placeholder={t('dashboard.movements.form_movements_add.amount_placeholder')}
                step={0.01}
                min={isIncome ? 0 : undefined}
                type='number'
                className='custom-input'
                required
            />
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
            <button type='submit' className='custom-btn'>{t('dashboard.movements.form_movements_add.save_button')}</button>
        </form>
    );
}
