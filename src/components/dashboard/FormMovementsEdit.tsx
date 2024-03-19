import React, { useState, useEffect, useRef } from "react";
import { Toast } from 'primereact/toast';

import "./FormMovements.css";

interface Transaction {
  _id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

interface Category {
  _id: string;
  name: string;
}

interface FormMovementsEditProps {
  transaction: Transaction;
  onSave: () => void;
}

const FormMovementsEdit: React.FC<FormMovementsEditProps> = ({ transaction, onSave }) => {
  const toast = useRef<Toast>(null);
  const [date, setDate] = useState<string>(transaction.date);
  const [description, setDescription] = useState<string>(transaction.description);
  const [amount, setAmount] = useState<string>(transaction.amount.toString());
  const [category, setCategory] = useState<string>(transaction.category);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch('https://profit-lost-backend.onrender.com/categories/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch categories', life: 3000 });
      }
    };
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!date || !description || isNaN(Number(amount)) || !category) {
      toast.current?.show({ severity: 'warn', summary: 'Validation Failed', detail: 'Please fill in all fields correctly.', life: 3000 });
      return;
    }

    const token = localStorage.getItem("token");
    const updatedTransaction = { date, description, amount: Number(amount), category };

    try {
      const response = await fetch(`https://profit-lost-backend.onrender.com/movements/edit/${transaction._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTransaction),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.current?.show({ severity: 'error', summary: 'Update Failed', detail: `Failed to update the transaction: ${errorData.message}`, life: 3000 });
        console.error("Error updating the transaction:", errorData.message);
        return;
      }

      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Transaction updated successfully', life: 3000 });
      console.log("Transaction updated successfully");
      onSave();
    } catch (error) {
      console.error("Error updating the transaction:", error);
      toast.current?.show({ severity: 'error', summary: 'Unexpected Error', detail: 'An error occurred while updating the transaction', life: 3000 });
    }
  };

  return (
    <div className="formMovements">
      <Toast ref={toast} position="bottom-right" />
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
        placeholder="Description" required
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
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleSave}>Save
      </button>
    </div>
  );
};

export default FormMovementsEdit;
