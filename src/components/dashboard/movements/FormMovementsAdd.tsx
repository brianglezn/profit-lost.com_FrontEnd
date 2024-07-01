import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Dropdown } from 'primereact/dropdown';

import { getAllCategories } from '../../../api/categories/getAllCategories';
import { addMovement } from '../../../api/movements/addMovement';

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

function FormMovementsAdd({ onMovementAdded, onClose, selectedYear, selectedMonth }: FormMovementsAddProps) {
    const [date, setDate] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [category, setCategory] = useState<Category | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isIncome, setIsIncome] = useState<boolean>(false);
    const [isRecurring, setIsRecurring] = useState<boolean>(false);
    const [recurrenceFrequency, setRecurrenceFrequency] = useState<string>('monthly');
    const [recurrenceEnd, setRecurrenceEnd] = useState<string>('');

    // useEffect to load categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('No authentication token found. Please log in.');
                return;
            }
            try {
                const categories = await getAllCategories(token);
                const sortedCategories = categories.sort((a: Category, b: Category) => a.name.localeCompare(b.name));
                setCategories(sortedCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Error fetching categories');
            }
        };

        fetchCategories();
    }, []);

    // useEffect to set the initial date when loading the form
    useEffect(() => {
        const currentDate = new Date();

        if (selectedMonth !== (currentDate.getMonth() + 1).toString().padStart(2, '0') || selectedYear !== currentDate.getFullYear().toString()) {
            const initialDate = `${selectedYear}-${selectedMonth}-01T00:00`;
            setDate(initialDate);
        } else {
            const localDateTime = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
            setDate(localDateTime);
        }
    }, [selectedYear, selectedMonth]);

    // Manages the click on the enter button
    const handleIncomeClick = () => {
        setIsIncome(true);
        setAmount(amount.replace('-', ''));
    };

    // Manages the click on the spend button
    const handleExpenseClick = () => {
        setIsIncome(false);
    };

    // Handles change in the quantity field
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isIncome) {
            setAmount(value.replace('-', ''));
        } else {
            setAmount(value);
        }
    };

    // Manages the recurrent movement
    const createRecurringMovements = (movementData: { date: string; description: string; amount: number; category: string }) => {
        const movements = [];
        const currentDate = new Date(movementData.date);
        const endDate = new Date(recurrenceEnd);

        while (currentDate <= endDate) {
            movements.push({
                ...movementData,
                date: currentDate.toISOString(),
            });

            if (recurrenceFrequency === 'monthly') {
                currentDate.setMonth(currentDate.getMonth() + 1);
            } else if (recurrenceFrequency === 'yearly') {
                currentDate.setFullYear(currentDate.getFullYear() + 1);
            }
        }

        return movements;
    };

    // Manages form submission addMovement
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('No authentication token found. Please log in.');
            return;
        }

        if (!/^\d+(\.\d{0,2})?$/.test(amount)) {
            toast.error('Amount must be a positive number with up to two decimals.');
            return;
        }

        if (!category) {
            toast.error('Please select a category.');
            return;
        }

        const movementData = {
            date: date,
            description: description.trim() === '' ? category.name : description,
            amount: parseFloat(amount.replace(',', '.')) * (isIncome ? 1 : -1),
            category: category._id,
        };

        try {
            const movements = isRecurring ? createRecurringMovements(movementData) : [movementData];
            for (const movement of movements) {
                await addMovement(token, movement);
            }

            toast.success('Movement added successfully');

            onMovementAdded();
            onClose();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            console.error('Error adding new movement:', errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="formMovements">
            <h2>New movement</h2>
            <div className="formMovements-toggle">
                <button
                    type="button"
                    className={`${isIncome ? 'active' : ''}`}
                    onClick={handleIncomeClick}
                >
                    Income
                </button>
                <button
                    type="button"
                    className={`${!isIncome ? 'active' : ''}`}
                    onClick={handleExpenseClick}
                >
                    Expense
                </button>
            </div>
            <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="formMovements-datetime custom-input"
                placeholder=" "
                required
            />
            <Dropdown
                value={category}
                options={categories}
                onChange={(e) => setCategory(e.value)}
                optionLabel="name"
                placeholder="Select a category"
                className="formDropdown"
                filter
                showClear
                filterBy="name"
                required
            />
            <input
                className="custom-input"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
            />
            <input
                className="custom-input"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Amount"
                step="0.01"
                min={isIncome ? "0" : undefined}
                required
            />
            <div className="formMovements-recurring">
                <label>
                    <input
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                    />
                    Recurring expense
                </label>
                {isRecurring && (
                    <div className="formMovements-recurring-options">
                        <Dropdown
                            value={recurrenceFrequency}
                            options={[
                                { label: 'Every month', value: 'monthly' },
                                { label: 'Every year', value: 'yearly' },
                            ]}
                            onChange={(e) => setRecurrenceFrequency(e.value)}
                            placeholder="Select frequency"
                            className="formDropdown"
                        />
                        {recurrenceFrequency === 'monthly' ? (
                            <input
                                type="month"
                                value={recurrenceEnd}
                                onChange={(e) => setRecurrenceEnd(e.target.value)}
                                className="custom-input"
                                placeholder="End month"
                                required
                            />
                        ) : (
                            <input
                                type="number"
                                value={recurrenceEnd}
                                onChange={(e) => setRecurrenceEnd(e.target.value)}
                                className="custom-input"
                                placeholder="End year"
                                min={new Date().getFullYear()}
                                required
                            />
                        )}
                    </div>
                )}
            </div>
            <button type="submit" className="custom-btn">Save</button>
        </form>
    );
}

export default FormMovementsAdd;
