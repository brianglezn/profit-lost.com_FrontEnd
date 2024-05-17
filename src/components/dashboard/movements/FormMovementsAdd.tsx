import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Dropdown } from 'primereact/dropdown';

import './FormMovements.scss';

interface Category {
    _id: string;
    name: string;
}

interface FormMovementsAddProps {
    onMovementAdded: () => void;
    onClose: () => void;
}

function FormMovementsAdd({ onMovementAdded, onClose }: FormMovementsAddProps) {
    const [date, setDate] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [category, setCategory] = useState<Category | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isIncome, setIsIncome] = useState<boolean>(true);

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('https://profit-lost-backend.onrender.com/categories/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                let data: Category[] = await response.json();
                data = data.sort((a, b) => a.name.localeCompare(b.name));
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Error fetching categories');
            }
        };

        fetchCategories();
    }, []);

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
            date: date ? new Date(date).toISOString() : null,
            description: description.trim() === '' ? '---' : description,
            amount: parseFloat(amount.replace(',', '.')) * (isIncome ? 1 : -1),
            category: category._id,
        };

        try {
            const response = await fetch('https://profit-lost-backend.onrender.com/movements/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(movementData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
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
                className="formMovements-datetime"
                placeholder=" "
                required
            />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
            />
            <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Amount"
                step="0.01"
                min={isIncome ? "0" : undefined}
                required
            />
            <Dropdown
                value={category}
                options={categories}
                onChange={(e) => setCategory(e.value)}
                optionLabel="name"
                placeholder="Select a category"
                className="formMovements-category"
                required
            />
            <button type="submit" className="custom-btn">Save</button>
        </form>
    );
}

export default FormMovementsAdd;
