import React, { useState, useEffect } from "react";
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
      }
    };

    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!date || !description || isNaN(Number(amount)) || !category) {
      alert("Please fill in all fields correctly.");
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
        throw new Error('Failed to update the transaction');
      }

      onSave();
    } catch (error) {
      console.error("Error updating the transaction:", error);
    }
  };

  return (
    <div className="formMovements">
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" step="0.01" required />
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>
      <button type="button" onClick={handleSave}>Save</button>
    </div>
  );
};

export default FormMovementsEdit;
