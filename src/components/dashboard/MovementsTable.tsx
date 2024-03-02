import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import LinearProgress from '@mui/material/LinearProgress';

type Transaction = {
    date: string;
    category: string;
    description: string;
    amount: number;
};

interface MovementsProps {
    year: string;
    month: string;
    isDataEmpty: boolean;
}

function MovementsTable({ year, month, isDataEmpty }: MovementsProps) {
    const [tableRows, setTableRows] = useState<GridRowsProp>([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`https://profit-lost-backend.onrender.com/movements/${year}/${month}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const transactions: Transaction[] = await response.json();

                const rows = transactions.map((transaction, index) => ({
                    id: index,
                    category: transaction.category,
                    description: transaction.description,
                    amount: transaction.amount
                }));

                setTableRows(rows);
            } catch (error) {
                console.error('Error fetching transactions data:', error);
            }
        };

        fetchData();
    }, [year, month]);

    const columns: GridColDef[] = [
        { field: "category", headerName: "Category", flex: 1 },
        { field: "description", headerName: "Description", flex: 1 },
        { field: "amount", headerName: "Amount", flex: 1, renderCell: (params) => params.value.toFixed(2) + " €" },
    ];

    return (
        <>
            <div className="movements__movements-table">
                {isDataEmpty ? (
                    <>
                        <p>No data available for this month.</p>
                        <LinearProgress />
                    </>
                ) : (
                    <DataGrid
                        rows={tableRows}
                        columns={columns.map((column) => {
                            if (column.field === "InOut") {
                                return {
                                    ...column,
                                    renderCell: (params) => (
                                        <div
                                            className={
                                                params.row.InOut === "IN" ? "positive" : "negative"
                                            }
                                        >
                                            {params.row.InOut}
                                        </div>
                                    ),
                                };
                            }
                            return column;
                        })}
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0 ? 'row-even' : 'row-odd'
                        }
                    />
                )}
            </div>
        </>
    );
}

export default MovementsTable;
