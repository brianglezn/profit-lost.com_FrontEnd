import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import LinearProgress from '@mui/material/LinearProgress';

import dataMovementsJson from "../../data/dataMovements.json";

// Type definition for monthly transaction entries with category and amount
type MonthlyTransactionEntry = {
    Category: string;
    Description: string;
    Amount: number;
};
// Type definition for the months of the year
type Months =
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
// Object to map the number of the month to its corresponding name
const monthMapping: Record<number, Months> = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
};
// Type definition for the monthly transactions, which is an object with keys of type Months and values that are an array of MonthlyTransactionEntry
type MonthlyTransactions = {
    [key in Months]?: MonthlyTransactionEntry[];
};
// Type definition for the annual data object, where each year is a key pointing to an array of MonthlyTransactions
type YearData = {
    [year: string]: MonthlyTransactions[];
};
// The data file is an array of YearData
type DataMovementsFile = YearData[];
const dataMovementsFile: DataMovementsFile =
    dataMovementsJson as unknown as DataMovementsFile;
// Component properties
interface MovementsProps {
    year: string;
    month: string;
    isDataEmpty: boolean;
}

// Function for formatting numbers to local currency format
function formatCurrency(value: number) {
    return value.toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        useGrouping: true,
    });
}

function MovementsTable(props: MovementsProps) {

    // Destructuring of properties for easier access
    const { year, month, isDataEmpty } = props;

    // State for storing the rows of the table component
    const [tableRows, setTableRows] = useState<GridRowsProp>([]);

    // Effect to update the table rows based on the selected year and month.
    useEffect(() => {
        if (year && month) {
            // Buscar los datos para el año seleccionado
            const selectedYearData = dataMovementsFile.find(
                (entry) => entry[year as keyof typeof entry]
            );
            if (selectedYearData) {
                // Search data for the selected month within the selected year
                const monthData =
                    selectedYearData[year as keyof typeof selectedYearData];
                if (monthData) {
                    // Get the correct key for the month from month mapping
                    const parameter = monthMapping[Number(month)];
                    // Search the data for the specified month
                    const selectedMonthData = monthData.find((entry) => {
                        return entry[parameter];
                    });
                    if (selectedMonthData) {
                        // Map the data to the row format required by the table component
                        const rows = selectedMonthData[parameter]?.map(
                            (item: {
                                Description: string; Category: string; Amount: number
                            }, index: number) => ({
                                id: index + 1,
                                Category: item.Category,
                                Balance: item.Amount,
                                InOut: item.Amount >= 0 ? "IN" : "OUT",
                                Description: item.Description,
                            })
                        );

                        setTableRows(rows || []);
                    }
                }
            }
        }
    }, [year, month]);

    // Column definitions for the table component
    const columns: GridColDef[] = [
        { field: "Category", headerName: "Category", flex: 2 },
        { field: "Description", headerName: "Description", flex: 2 },
        { field: "Balance", headerName: "Balance", flex: 2, renderCell: (params) => formatCurrency(params.row.Balance), },
        { field: "InOut", headerName: "InOut", flex: 0.5 },
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
