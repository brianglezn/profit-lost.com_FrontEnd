import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
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
  const [amount, setAmount] = useState<string>(transaction.amount.toString());
  const [category, setCategory] = useState<Category | null>(null);
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

        let fetchedCategories: Category[] = await response.json();
        fetchedCategories = fetchedCategories.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(fetchedCategories);

        const currentCategory = fetchedCategories.find(cat => cat.name === transaction.category);
        setCategory(currentCategory || null);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [transaction.category]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No authentication token found. Please log in.',
        life: 3000,
      });
      return;
    }

    if (!/^-?\d+(\.\d{0,2})?$/.test(amount)) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Amount must be a positive or negative number with up to two decimals.',
        life: 3000,
      });
      return;
    }

    const formattedDate = dateTime.replace('T', ' ') + ":00";

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
          amount: Number(amount),
          category: category?._id,
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
        life: 3000,
      });

      onEdit();
    } catch (error) {
      console.error('Error updating movement:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000,
      });
    }
  };

  const handleRemove = async () => {
    const token = localStorage.getItem("token");
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

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Transaction removed successfully.',
        life: 3000
      });
      onRemove();
    } catch (error) {
      console.error("Error removing the transaction:", error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to remove the transaction.',
        life: 3000
      });
    }
  };

  return (
    <>
      <Toast ref={toast} position="bottom-right" />
      <form onSubmit={handleSubmit} className="formMovements">
        <h2>Edit movement</h2>
        <input
          type="datetime-local"
          className="formMovements-datetime"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
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
        <Dropdown
          className="formMovements-category"
          value={category}
          options={categories}
          onChange={(e) => setCategory(e.value)}
          optionLabel="name"
          placeholder="Select a category"
          required
        />
        <div className="formMovements-buttons">
          <button type="submit" className="custom-btn">Update Movement</button>
          <button type="button" className="custom-btn" onClick={handleRemove}>Delete Movement</button>
        </div>
      </form>
    </>
  );
}

export default FormMovementsEdit;
