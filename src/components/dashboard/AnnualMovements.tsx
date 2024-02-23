import { useEffect, useMemo, useState } from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";

import dataMovementsFile from "../../data/dataMovements.json";

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
        const filteredTransactions = dataMovementsFile.filter(
            (transaction: Transaction) => new Date(transaction.date).getFullYear().toString() === year
        );

        const categoryBalances = filteredTransactions.reduce((acc: { [category: string]: CategoryBalance }, transaction, index) => {
            const { category, amount } = transaction;
            if (!acc[category]) {
                acc[category] = { id: index, Category: category, Balance: 0, InOut: "" };
            }
            acc[category].Balance += amount;
            acc[category].InOut = acc[category].Balance >= 0 ? "IN" : "OUT";
            return acc;
        }, {});

        setTableRows(Object.values(categoryBalances));
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

