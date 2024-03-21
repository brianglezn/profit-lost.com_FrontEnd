import { useState, FormEvent, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';

import './FormMovements.css';

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
    const [category, setCategory] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);
    const toast = useRef<Toast>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!/^\-?\d+(\.\d{0,2})?$/.test(amount)) {
            toast.current?.show({ severity: 'warn', summary: 'Validation Error', detail: 'Amount must be a positive or negative number with up to two decimals.', life: 3000 });
            return;
        }

        const finalDescription = description.trim() === '' ? '---' : description;

        const numericAmount = Number(amount);
        if (isNaN(numericAmount)) {
            console.error('Invalid data provided');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://profit-lost-backend.onrender.com/movements/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    date,
                    description: finalDescription,
                    amount: numericAmount,
                    category,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Movement added successfully', life: 3000 });
            onMovementAdded();
            onClose();
        } catch (error) {
            console.error('Error adding new movement:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error adding new movement', life: 3000 });
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://profit-lost-backend.onrender.com/categories/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data: Category[] = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <>
            <Toast ref={toast} position="bottom-right" />
            <form onSubmit={handleSubmit} className="formMovements">
                <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
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
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    step="0.01"
                    required
                />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <button type="submit" className="form-button">Add Movement</button>
            </form>
        </>

    );
}

export default FormMovementsAdd;
