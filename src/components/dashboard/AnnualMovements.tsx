import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";

import dataMovementsFile from "../../data/dataMovements.json";

type MonthlyTransaction = {
    Category: string;
    Ammount: number;
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
interface AnnualMovementsProps {
    year: string;
}

// Función para formatear números a formato de moneda.
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

    // Estado para almacenar los datos del gráfico.
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    useEffect(() => {
        // Calculamos los datos para el gráfico cuando el año cambia.
        const selectedYearData = dataMovementsFile.find(
            (y) => Object.keys(y)[0] === year.toString()
        ) as DataMovement | undefined;

        // Si hay datos para el año seleccionado, los procesamos para el gráfico.
        if (selectedYearData && year.toString() in selectedYearData) {
            const monthlyDataArray = selectedYearData[year.toString()];

            if (Array.isArray(monthlyDataArray)) {
                const incomeExpensesByMonth = monthlyDataArray.map((monthEntry) => {
                    const [month, transactions] = Object.entries(monthEntry)[0];

                    let monthlyIncome = 0;
                    let monthlyExpenses = 0;
                    const hasData = transactions && transactions.length > 0;

                    // Sumamos los ingresos y restamos los gastos para cada mes.
                    if (Array.isArray(transactions)) {
                        transactions.forEach((transaction) => {
                            if (transaction.Ammount > 0) {
                                monthlyIncome += transaction.Ammount;
                            } else {
                                monthlyExpenses += Math.abs(transaction.Ammount);
                            }
                        });
                    }

                    // Hacemos que el resutado solo tenga 2 decimales
                    monthlyIncome = +monthlyIncome.toFixed(2);
                    monthlyExpenses = +monthlyExpenses.toFixed(2);

                    // Retornamos un objeto con los datos del mes para el gráfico.
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


    // Estados para las filas de una tabla y su inicialización.
    const [tableRows, setTableRows] = useState<GridRowsProp>([]);
    // useEffect se encarga de calcular las filas de la tabla de balances por categoría.
    useEffect(() => {
        if (year) {
            const selectedYearData = dataMovementsFile.find(
                (y) => Object.keys(y)[0] === year.toString()
            ) as DataMovement | unknown;

            // Si no encuentra datos para ese año, termina la ejecución del bloque aquí.
            if (!selectedYearData) return;

            if (selectedYearData) {
                // Recoge los datos del año seleccionado.
                const monthEntries = (selectedYearData as DataMovement)[year];
                // Aplana y transforma los datos para obtener el balance por categoría.
                const categoryBalances = monthEntries.flatMap((monthEntry) =>
                    Object.entries(monthEntry).flatMap(([month, transactions]) =>
                        transactions.map((transaction) => ({
                            ...transaction,
                            Month: month,
                        }))
                    )
                );

                // Reduce la lista de transacciones a un objeto que acumula los balances por categoría.
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
                            transaction: { Category: string; Ammount: number }
                        ) => {
                            const { Category, Ammount } = transaction;
                            // Inicializa la categoría si es la primera vez que aparece.
                            if (!acc[Category]) {
                                acc[Category] = { Category, Balance: 0, InOut: "" };
                            }
                            acc[Category].Balance += Ammount;
                            acc[Category].InOut = acc[Category].Balance >= 0 ? "IN" : "OUT";
                            return acc;
                        },
                        {}
                    );

                // Transforma los balances acumulados en filas para la tabla.
                const rows = Object.values(categoriesBalance).map((balance, index) => ({
                    id: index,
                    ...balance,
                    Balance: formatCurrency(balance.Balance),
                }));
                setTableRows(rows);
            }
        }
    }, [year]);
    // Configura las columnas de la tabla de datos utilizando `useMemo` para evitar cálculos innecesarios.
    const columns: GridColDef[] = useMemo(
        () => [
            { field: "Category", headerName: "Category", flex: 2 },
            { field: "Balance", headerName: "Balance", flex: 2 },
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
                    />) : (
                    <p>No data available for this year.</p>
                )}
            </div>
        </>
    );
}

export default AnnualMovements;
