import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Dropdown } from 'primereact/dropdown';

import './FormMovements.scss';

interface Category {
    _id: string;
    name: string;
}

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

function FormMovementsEdit({ onEdit, onRemove, transaction }: FormMovementsEditProps) {
    const [dateTime, setDateTime] = useState<string>(new Date(transaction.date).toISOString().slice(0, 16));
    const [description, setDescription] = useState<string>(transaction.description);
    const [amount, setAmount] = useState<string>(Math.abs(transaction.amount).toString());
    const [category, setCategory] = useState<Category | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isIncome, setIsIncome] = useState<boolean>(transaction.amount >= 0);

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

                let fetchedCategories: Category[] = await response.json();
                fetchedCategories = fetchedCategories.sort((a, b) => a.name.localeCompare(b.name));
                setCategories(fetchedCategories);

                const currentCategory = fetchedCategories.find(cat => cat.name === transaction.category);
                setCategory(currentCategory || null);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Error fetching categories');
            }
        };

        fetchCategories();
    }, [transaction.category]);

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

        if (!/^-?\d+(\.\d{0,2})?$/.test(amount)) {
            toast.error('Amount must be a positive or negative number with up to two decimals.');
            return;
        }

        const formattedDate = new Date(dateTime).toISOString();

        try {
            const response = await fetch(`https://profit-lost-backend.onrender.com/movements/edit/${transaction._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    date: formattedDate,
                    description: description.trim() === '' ? '---' : description,
                    amount: Number(amount) * (isIncome ? 1 : -1),
                    category: category?._id,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }

            toast.success('Movement updated successfully');
            onEdit();
        } catch (error) {
            console.error('Error updating movement:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            toast.error(errorMessage);
        }
    };

    const handleRemove = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirmRemove = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error('No authentication token found. Please log in.');
            return;
        }

        try {
            const response = await fetch(`https://profit-lost-backend.onrender.com/movements/remove/${transaction._id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }

            toast.success('Transaction removed successfully.');
            setTimeout(() => {
                onRemove();
            }, 500);
        } catch (error) {
            console.error("Error removing the transaction:", error);
            toast.error('Failed to remove the transaction.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="formMovements">
            <h2>Edit movement</h2>
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
                className="formMovements-datetime custom-input"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
            />
            <input
                type="text"
                className='custom-input'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
            />
            <input
                type="number"
                className='custom-input'
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
                className="formMovements-dropdown"
                required
            />
            <div className="formMovements-buttons">
                <button type="submit" className="custom-btn">Update</button>
                <button type="button" className="custom-btn" onClick={handleRemove}>Delete</button>
            </div>
            {showConfirm && (
                <div className="form-confirmBtn">
                    <p>Are you sure you want to delete this transaction?</p>
                    <button type="button" className="custom-btn" onClick={handleConfirmRemove}>Confirm</button>
                </div>
            )}
        </form>
    );
}

export default FormMovementsEdit;
