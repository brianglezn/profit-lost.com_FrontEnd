import React from "react";

import "./FormMovements.css";

interface FormMovementsRemoveProps {
    transactionId: string;
    onRemove: () => void;
}

const FormMovementsRemove: React.FC<FormMovementsRemoveProps> = ({ transactionId, onRemove }) => {
    const handleRemove = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`https://profit-lost-backend.onrender.com/movements/remove/${transactionId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            onRemove();
        } catch (error) {
            console.error("Error removing the transaction:", error);
        }
    };

    return (
        <div>
            <p>Are you sure you want to delete this transaction?</p>
            <button onClick={handleRemove}>Yes, delete it</button>
        </div>
    );
};

export default FormMovementsRemove;
