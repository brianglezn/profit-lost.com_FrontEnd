import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import dataMovementsJson from "../../data/dataMovements.json";
import { useEffect, useState } from "react";


// Definición de tipo para las entradas de transacciones mensuales con categoría y monto
type MonthlyTransactionEntry = {
    Category: string;
    Amount: number;
};
// Definición de tipo para los meses del año
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
// Objeto para mapear el número del mes a su correspondiente nombre
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
// Definición de tipo para las transacciones mensuales, que es un objeto con claves de tipo Months y valores que son un arreglo de MonthlyTransactionEntry
type MonthlyTransactions = {
    [key in Months]?: MonthlyTransactionEntry[];
};
// Definición de tipo para el objeto de datos anuales, donde cada año es una clave que apunta a un arreglo de MonthlyTransactions
type YearData = {
    [year: string]: MonthlyTransactions[];
};
// El archivo de datos es un arreglo de YearData
type DataMovementsFile = YearData[];
const dataMovementsFile: DataMovementsFile =
    dataMovementsJson as unknown as DataMovementsFile;

// Propiedades del componente
interface MovementsProps {
    year: string;
    month: string;
    isDataEmpty: boolean;
}

// Función para formatear números a formato de moneda local
function formatCurrency(value: number) {
    return value.toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        useGrouping: true,
    });
}

function MovementsTable(props: MovementsProps) {

    // Desestructuración de las propiedades para un acceso más fácil
    const { year, month, isDataEmpty } = props;

    // Estado para almacenar las filas del componente de tabla
    const [tableRows, setTableRows] = useState<GridRowsProp>([]);

    // Efecto para actualizar las filas de la tabla basado en el año y mes seleccionados
    useEffect(() => {
        if (year && month) {
            // Buscar los datos para el año seleccionado
            const selectedYearData = dataMovementsFile.find(
                (entry) => entry[year as keyof typeof entry]
            );
            if (selectedYearData) {
                // Buscar los datos para el mes seleccionado dentro del año seleccionado
                const monthData =
                    selectedYearData[year as keyof typeof selectedYearData];
                if (monthData) {
                    // Obtener la clave correcta para el mes del mapeo de meses
                    const parameter = monthMapping[Number(month)];
                    // Buscar los datos para el mes especificado
                    const selectedMonthData = monthData.find((entry) => {
                        return entry[parameter];
                    });
                    if (selectedMonthData) {
                        // Mapear los datos al formato de fila requerido por el componente de tabla
                        const rows = selectedMonthData[parameter]?.map(
                            (item: { Category: string; Amount: number }, index: number) => ({
                                id: index + 1,
                                Category: item.Category,
                                Balance: formatCurrency(item.Amount),
                                InOut: item.Amount >= 0 ? "IN" : "OUT",
                            })
                        );

                        setTableRows(rows || []);
                    }
                }
            }
        }
    }, [year, month]);

    // Definiciones de columnas para el componente de la tabla
    const columns: GridColDef[] = [
        { field: "Category", headerName: "Category", flex: 2 },
        { field: "Balance", headerName: "Balance", flex: 2 },
        { field: "InOut", headerName: "InOut", flex: 0.5 },
    ];

    return (
        <>
            <div className="movements__movements-table">
                {isDataEmpty ? (
                    <p>No data available for this month.</p>
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
                    />
                )}
            </div>
        </>
    );
}

export default MovementsTable;
