import React, { useState } from "react";

import "./FormMovements.css";

interface Transaction {
    _id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
}

interface FormMovementsEditProps {
    transaction: Transaction;
    onSave: () => void;
}

const FormMovementsEdit: React.FC<FormMovementsEditProps> = ({ transaction, onSave }) => {
    const [date, setDate] = useState(transaction.date);
    const [description, setDescription] = useState(transaction.description);
    const [amount, setAmount] = useState(transaction.amount);
    const [category, setCategory] = useState(transaction.category);

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        const updatedTransaction = { date, description, amount, category };
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
                throw new Error("Network response was not ok.");
            }
            onSave();
        } catch (error) {
            console.error("Error updating the transaction:", error);
        }
    };

    return (
        <div className="formMovements">
            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="YYYY-MM-DD" />
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} placeholder="Amount" />
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category ID" />
            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default FormMovementsEdit;
