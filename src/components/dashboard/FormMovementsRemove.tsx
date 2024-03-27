import React, { useRef } from "react";
import { Toast } from "primereact/toast";

import "./FormMovements.css";

type Transaction = {
    _id: string;
    date: string;
    category: string;
    description: string;
    amount: number;
};

interface FormMovementsRemoveProps {
    transaction: Transaction; // Ahora pasamos el objeto completo
    onRemove: () => void;
}

function formatCurrency(value: number): string {
    return value.toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        useGrouping: true,
    });
}

function formatDateTime(value: string): string {
    const date = new Date(value);
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

const FormMovementsRemove: React.FC<FormMovementsRemoveProps> = ({ transaction, onRemove }) => {
    const toast = useRef<Toast>(null);

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
        <div className="formMovements">
            <Toast ref={toast} position="bottom-right" />
            <p>Are you sure you want to delete this transaction?</p>
            <div>
                <p><strong>Date:</strong> {formatDateTime(transaction.date)}</p>
                <p><strong>Description:</strong> {transaction.description}</p>
                <p><strong>Category:</strong> {transaction.category}</p>
                <p><strong>Amount:</strong> {formatCurrency(transaction.amount)}</p>
            </div>
            <button type="submit" onClick={handleRemove} className="form-button">Yes, delete it</button>
        </div>
    );
};

export default FormMovementsRemove;