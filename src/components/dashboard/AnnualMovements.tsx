import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressBar } from 'primereact/progressbar';

type Transaction = {
    date: string;
    category: string;
    description: string;
    amount: number;
};

type CategoryBalance = {
    id: number;
    Category: string;
    Balance: number;
    InOut: string;
};

interface AnnualMovementsProps {
    year: string;
}

function formatCurrency(value: number) {
    return value.toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        useGrouping: true,
    });
}

function AnnualMovements({ year }: AnnualMovementsProps) {
    const [transactions, setTransactions] = useState<CategoryBalance[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        const fetchData = async () => {
            const response = await fetch(`https://profit-lost-backend.onrender.com/movements/${year}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const dataMovements: Transaction[] = await response.json();
    
            const categoryBalances = dataMovements.reduce((acc: { [key: string]: CategoryBalance }, transaction, index) => {
                const { category, amount } = transaction;
                if (!acc[category]) {
                    acc[category] = { id: index, Category: category, Balance: 0, InOut: "" };
                }
                acc[category].Balance += amount;
                return acc;
            }, {});
    
            Object.values(categoryBalances).forEach(balance => {
                balance.InOut = balance.Balance >= 0 ? "IN" : "OUT";
            });
    
            setTransactions(Object.values(categoryBalances));
        };
    
        fetchData().catch(console.error);
    }, [year]);
    

    const inOutTemplate = (rowData: CategoryBalance) => {
        return (
            <span className={rowData.InOut === "IN" ? "positive" : "negative"}>
                {rowData.InOut}
            </span>
        );
    };

    const balanceTemplate = (rowData: CategoryBalance) => {
        return formatCurrency(rowData.Balance);
    };


    return (
        <div className="annualReport__category-table">
            {transactions.length > 0 ? (
                <DataTable value={transactions} className="p-datatable-gridlines">
                    <Column field="Category" header="Category" sortable></Column>
                    <Column field="Balance" header="Balance" body={balanceTemplate} sortable></Column>
                    <Column field="InOut" header="InOut" body={inOutTemplate}></Column>
                </DataTable>
            ) : (
                <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
            )}
        </div>
    );
}

export default AnnualMovements;