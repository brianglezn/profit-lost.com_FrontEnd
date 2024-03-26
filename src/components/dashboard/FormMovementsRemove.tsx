import React, { useRef } from "react";
import { Toast } from "primereact/toast";

import "./FormMovements.css";

interface FormMovementsRemoveProps {
    transactionId: string;
    onRemove: () => void;
}

const FormMovementsRemove: React.FC<FormMovementsRemoveProps> = ({ transactionId, onRemove }) => {
    const toast = useRef<Toast>(null);

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

            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Transaction removed successfully.', life: 3000 });
            onRemove();
        } catch (error) {
            console.error("Error removing the transaction:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to remove the transaction.', life: 3000 });
        }
    };

    return (
        <div className="formMovements">
            <Toast ref={toast} position="bottom-right" />
            <p>Are you sure you want to delete this transaction?</p>
            <button type="submit" onClick={handleRemove} className="form-button">Yes, delete it</button>
        </div>
    );
};

export default FormMovementsRemove;