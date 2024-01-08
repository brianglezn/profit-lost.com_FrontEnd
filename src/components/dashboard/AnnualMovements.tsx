import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import LinearProgress from '@mui/material/LinearProgress';

import dataMovementsFile from "../../data/dataMovements.json";

// Definition of types for transactions and data structures
type MonthlyTransaction = {
    Category: string;
    Amount: number;
}[];
type Month =
    | "Jan"
    | "Feb"
    | "Mar"
    | "Apr"
    | "May"
    | "Jun"
    | "Jul"
    | "Aug"
    | "Sep"
    | "Oct"
    | "Nov"
    | "Dec";

type DataMovement = {
    [key: string]: {
        [month in Month]?: MonthlyTransaction;
    }[];
};
type ChartDataItem = {
    month: string;
    Income: number;
    Expenses: number;
    hasData: boolean;
};
type CategoryBalance = {
    Category: string;
    Balance: number;
    InOut: string;
};

// Component properties
interface AnnualMovementsProps {
    year: string;
}

// Function to format numbers to currency format.
function formatCurrency(value: number) {
    return value.toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        useGrouping: true,
    });
}

function AnnualMovements(props: AnnualMovementsProps) {
    const { year } = props;

    // State to store the chart data.
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    useEffect(() => {
        // We calculate the data for the graph when the year changes.
        const selectedYearData = dataMovementsFile.find(
            (y) => Object.keys(y)[0] === year.toString()
        ) as DataMovement | undefined;

        // If there is data for the selected year, we process it for the chart.
        if (selectedYearData && year.toString() in selectedYearData) {
            const monthlyDataArray = selectedYearData[year.toString()];

            if (Array.isArray(monthlyDataArray)) {
                const incomeExpensesByMonth = monthlyDataArray.map((monthEntry) => {
                    const [month, transactions] = Object.entries(monthEntry)[0];

                    let monthlyIncome = 0;
                    let monthlyExpenses = 0;
                    const hasData = transactions && transactions.length > 0;

                    // We add the income and subtract the expenses for each month.
                    if (Array.isArray(transactions)) {
                        transactions.forEach((transaction) => {
                            if (transaction.Amount > 0) {
                                monthlyIncome += transaction.Amount;
                            } else {
                                monthlyExpenses += Math.abs(transaction.Amount);
                            }
                        });
                    }

                    // We make the result only have 2 decimal places
                    monthlyIncome = +monthlyIncome.toFixed(2);
                    monthlyExpenses = +monthlyExpenses.toFixed(2);

                    // We return an object with the month's data for the chart.
                    return {
                        month,
                        Income: monthlyIncome,
                        Expenses: monthlyExpenses,
                        hasData,
                    };
                });
                setChartData(incomeExpensesByMonth);
            }
        }
    }, [year]);


    // States for the rows of a table and their initialization.
    const [tableRows, setTableRows] = useState<GridRowsProp>([]);
    // useEffect is responsible for calculating the rows of the balance table by category.
    useEffect(() => {
        if (year) {
            const selectedYearData = dataMovementsFile.find(
                (y) => Object.keys(y)[0] === year.toString()
            ) as DataMovement | unknown;

            // If no data is found for that year, terminate the execution of the block here.
            if (!selectedYearData) return;

            if (selectedYearData) {
                // Collects data for the selected year.
                const monthEntries = (selectedYearData as DataMovement)[year];
                // Flatten and transform the data to obtain the balance by category.
                const categoryBalances = monthEntries.flatMap((monthEntry) =>
                    Object.entries(monthEntry).flatMap(([month, transactions]) =>
                        transactions.map((transaction) => ({
                            ...transaction,
                            Month: month,
                        }))
                    )
                );

                // Reduces the list of transactions to an object that accumulates the balances by category.
                const categoriesBalance: { [key: string]: CategoryBalance } =
                    categoryBalances.reduce(
                        (
                            acc: {
                                [x: string]: {
                                    Category: string;
                                    InOut: string;
                                    Balance: number;
                                };
                            },
                            transaction: { Category: string; Amount: number }
                        ) => {
                            const { Category, Amount } = transaction;
                            // Initializes the category if this is the first time it appears.
                            if (!acc[Category]) {
                                acc[Category] = { Category, Balance: 0, InOut: "" };
                            }
                            acc[Category].Balance += Amount;
                            acc[Category].InOut = acc[Category].Balance >= 0 ? "IN" : "OUT";
                            return acc;
                        },
                        {}
                    );

                // Transforms the accumulated balances into rows for the table.
                const rows = Object.values(categoriesBalance).map((balance, index) => ({
                    id: index,
                    ...balance,
                    Balance: balance.Balance,
                }));
                setTableRows(rows);
            }
        }
    }, [year]);
    // Configure the columns of the data table using `useMemo` to avoid unnecessary calculations.
    const columns: GridColDef[] = useMemo(
        () => [
            { field: "Category", headerName: "Category", flex: 2 },
            {
                field: "Balance",
                headerName: "Balance",
                flex: 2,
                renderCell: (params) => formatCurrency(params.row.Balance),
            },
            { field: "InOut", headerName: "InOut", flex: 0.5 },
        ],
        []
    );

    return (
        <>
            <div className="annualReport__category-table">
                {chartData.some((data) => data.hasData) ? (
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
                    />) : (
                    <>
                        <p>No data available for this year.</p>
                        <LinearProgress />
                    </>
                )}
            </div>
        </>
    );
}

export default AnnualMovements;
