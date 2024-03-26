import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';

interface Category {
  _id: string;
  name: string;
}

interface FormMovementsEditProps {
  onEdit: () => void;
  transaction: {
    _id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
  };
}

function FormMovementsEdit({ onEdit, transaction }: FormMovementsEditProps) {
  const [date, setDate] = useState<string>(transaction.date);
  const [description, setDescription] = useState<string>(transaction.description);
  const [amount, setAmount] = useState<string>(transaction.amount.toString());
  const [category, setCategory] = useState<string>(transaction.category);
  const [categories, setCategories] = useState<Category[]>([]);
  const toast = useRef<Toast>(null);

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
        setCategories(data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found. Please log in.');
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No authentication token found. Please log in.',
        life: 3000
      });
      return;
    }

    if (!/^\-?\d+(\.\d{0,2})?$/.test(amount)) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Amount must be a positive or negative number with up to two decimals.',
        life: 3000
      });
      return;
    }

    try {
      const response = await fetch(`https://profit-lost-backend.onrender.com/movements/edit/${transaction._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          date,
          description: description.trim() === '' ? '---' : description,
          amount: Number(amount),
          category,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Movement updated successfully',
        life: 3000
      });
      onEdit();
    } catch (error) {
      console.error('Error updating movement:', error);
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000
      });
    }
  };

  return (
    <>
      <Toast ref={toast} position="bottom-right" />
      <form onSubmit={handleSubmit} className="formMovements">
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" step="0.01" required />
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <div className="form-buttons">
          <button type="submit" className="form-button submit">Update Movement</button>
        </div>
      </form>
    </>
  );
};

export default FormMovementsEdit;
