import { useEffect, useMemo, useState } from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";

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
    const [tableRows, setTableRows] = useState<GridRowsProp>([]);

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

            const categoryBalances = dataMovements.reduce((acc: { [category: string]: CategoryBalance }, transaction, index) => {
                const { category, amount } = transaction;
                if (!acc[category]) {
                    acc[category] = { id: index, Category: category, Balance: 0, InOut: amount >= 0 ? "IN" : "OUT" };
                }
                acc[category].Balance += amount;
                return acc;
            }, {});

            setTableRows(Object.values(categoryBalances));
        };

        fetchData().catch(console.error);
    }, [year]);

    const columns: GridColDef[] = useMemo(() => [
        { field: "Category", headerName: "Category", flex: 2 },
        {
            field: "Balance",
            headerName: "Balance",
            flex: 2,
            renderCell: (params) => formatCurrency(params.row.Balance),
        },
        {
            field: "InOut",
            headerName: "InOut",
            flex: 0.5,
            renderCell: (params) => (
                <div className={params.row.InOut === "IN" ? "positive" : "negative"}>
                    {params.row.InOut}
                </div>
            ),
        },
    ], []);

    return (
        <div className="annualReport__category-table">
            {tableRows.length > 0 ? (
                <DataGrid
                    rows={tableRows}
                    columns={columns}
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? "row-even" : "row-odd"
                    }
                    autoHeight
                />
            ) : (
                <LinearProgress />
            )}
        </div>
    );
}

export default AnnualMovements;
