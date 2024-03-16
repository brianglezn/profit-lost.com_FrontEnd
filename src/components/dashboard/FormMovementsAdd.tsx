import { useState, FormEvent, useEffect } from 'react';
import './FormMovements.css';

interface Movement {
    date: string;
    description: string;
    amount: number;
    category: string;
}

interface Category {
    _id: string;
    name: string;
}

function FormMovementsAdd() {
    const [date, setDate] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!/^\-?\d+(\.\d{0,2})?$/.test(amount)) {
            alert('Amount must be a positive or negative number with up to two decimals.');
            return;
        }

        const numericAmount = Number(amount);
        if (!description || isNaN(numericAmount)) {
            alert('Invalid data provided');
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
                    description,
                    amount: numericAmount,
                    category,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.error('Error adding new movement:', error);
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
        <form onSubmit={handleSubmit} className="formMovements">
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
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
            <button type="submit">Add Movement</button>
        </form>
    );
}

export default FormMovementsAdd;
