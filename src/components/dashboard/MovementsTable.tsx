import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import LinearProgress from '@mui/material/LinearProgress';

import dataMovementsJson from "../../data/dataMovements.json";

type Transaction = {
    date: string;
    category: string;
    description: string;
    amount: number;
    transactionId: string;
};

const dataMovements: Transaction[] = dataMovementsJson;

interface MovementsProps {
    year: string;
    month: string;
    isDataEmpty: boolean;
}

function MovementsTable({ year, month, isDataEmpty }: MovementsProps) {
    const [tableRows, setTableRows] = useState<GridRowsProp>([]);

    useEffect(() => {
        const filteredTransactions = dataMovements.filter(transaction => {
            const [transactionYear, transactionMonth] = transaction.date.split("-");
            return transactionYear === year && transactionMonth.padStart(2, '0') === month.padStart(2, '0');
        });

        const rows = filteredTransactions.map((transaction, index) => ({
            id: index,
            category: transaction.category,
            description: transaction.description,
            amount: transaction.amount,
            transactionId: transaction.transactionId
        }));

        setTableRows(rows);
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
