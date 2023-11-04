import { useEffect, useState, useMemo } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

import "./Movements.css";
import dataMovementsFile from "../../data/dataMovements.json";

// Definición de tipo para las entradas de transacciones mensuales con categoría y monto
type MonthlyTransactionEntry = {
  Category: string;
  Ammount: number;
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
// Definición de tipo para las transacciones mensuales, que es un objeto con claves de tipo Months y valores que son un arreglo de MonthlyTransactionEntry
type MonthlyTransaction = {
  [key in Months]?: MonthlyTransactionEntry[];
};
// Definición de tipo para el movimiento de datos, que es un objeto que tiene una clave de tipo string y un valor que es un arreglo de objetos MonthlyTransaction indexados por los meses
type DataMovement = {
  [key: string]: {
    [month in Months]?: MonthlyTransaction;
  }[];
};
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

// Función para formatear números a formato de moneda local
function formatCurrency(value: number) {
  return value.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    useGrouping: true,
  });
}

function Movements() {
  // Estado para el año actual y mes actual
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Estados para el año y mes seleccionados
  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState(currentMonth.toString());

  // Manejadores de cambio para el año y mes
  const handleChangeYear = (event: SelectChangeEvent) =>
    setYear(event.target.value as string);
  const handleChangeMonth = (event: SelectChangeEvent) =>
    setMonth(event.target.value as string);

  // useMemo para obtener años con datos
  const yearsWithData = useMemo(() => {
    // Extracción de años de dataMovementsFile
    const years = dataMovementsFile.map((item) => Object.keys(item)[0]);
    // Eliminación de duplicados y ordenamiento
    return [...new Set(years)].sort((a, b) => Number(b) - Number(a));
  }, []);

  // Estado para los datos del gráfico
  const [dataGraph, setDataGraph] = useState<
    {
      month: string;
      year: number;
      Income: number;
      Expenses: number;
    }[]
  >([]);
  // Estado para verificar si los datos han sido procesados
  const [dataProcessed, setDataProcessed] = useState(false);

  // Efecto para procesar datos cuando el año y mes han sido seleccionados
  useEffect(() => {
    // Verifica si los datos no han sido procesados y si año y mes están definidos
    if (!dataProcessed && year && month) {
      // Encuentra los datos del año seleccionado
      const selectedYearData = dataMovementsFile.find(
        (y) => Object.keys(y)[0] === year.toString()
      ) as DataMovement | unknown;

      // Si se encuentran datos para el año seleccionado
      if (selectedYearData) {
        // Obtención del índice y nombre del mes seleccionado
        const monthIndex = parseInt(month, 10) - 1;
        const monthName: Months = monthMapping[parseInt(month, 10)];
        // Obtención de las transacciones para el mes seleccionado
        const transactionsObject = (selectedYearData as DataMovement)[year][
          monthIndex
        ];
        const transactionsArray = transactionsObject[monthName];
        // Si existen transacciones para ese mes
        if (transactionsArray) {
          // Procesamiento de ingresos y gastos totales
          const transactionsArray = (transactionsObject as MonthlyTransaction)[
            monthName
          ];
          // Cálculo del ingreso total
          const totalIncome = (transactionsArray || []).reduce(
            (acc: number, current: { Ammount: number }) => {
              return current.Ammount > 0 ? acc + current.Ammount : acc;
            },
            0
          );
          // Cálculo del gasto total
          const totalExpenses = (transactionsArray || []).reduce(
            (acc: number, current: { Ammount: number }) => {
              return current.Ammount < 0
                ? acc + Math.abs(current.Ammount)
                : acc;
            },
            0
          );

          // Configuración de datos para el gráfico
          setDataGraph(() => [
            {
              month: monthName,
              year: parseInt(year, 10),
              Income: +totalIncome.toFixed(2),
              Expenses: +totalExpenses.toFixed(2),
            },
          ]);

          // Marcar los datos como procesados
          setDataProcessed(true);
        } else {
          // Registrar un error si al objeto de transacciones le falta la propiedad del mes
          console.error(
            "Transactions object does not have the expected month property:",
            transactionsObject
          );
        }
      }
    }
  }, [year, month, dataProcessed]);

  // Restablecer dataProcessed a falso cuando cambian el año o el mes
  useEffect(() => {
    setDataProcessed(false);
  }, [year, month]);

  // Inicializar los saldos de ingresos y gastos
  let balanceIncome = 0;
  let balanceExpenses = 0;
  // Calcular el ingreso total y los gastos a partir de los datos del gráfico
  for (const data of dataGraph) {
    balanceIncome += data.Income;
    balanceExpenses += data.Expenses;
  }

  // Formatear el ingreso total y los gastos a moneda
  const formattedBalanceIncome = formatCurrency(balanceIncome);
  const formattedBalanceExpenses = formatCurrency(balanceExpenses);
  const formattedBalanceFinal = formatCurrency(balanceIncome - balanceExpenses);

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
              (item: { Category: string; Ammount: number }, index: number) => ({
                id: index + 1,
                Category: item.Category,
                Balance: formatCurrency(item.Ammount),
                InOut: item.Ammount >= 0 ? "IN" : "OUT",
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
      <section className="movements">
        <div className="movements__containerMain">
          <div className="movements__containerMain-selector">
            <FormControl fullWidth style={{ flex: 1 }}>
              <InputLabel id="demo-simple-select-label">Year</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={year}
                label="Year"
                onChange={handleChangeYear}
              >
                {yearsWithData.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth style={{ flex: 1 }}>
              <InputLabel id="demo-simple-select-label">Month</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={month || currentMonth.toString()}
                label="Month"
                onChange={handleChangeMonth}
              >
                {[
                  { value: 1, label: "January" },
                  { value: 2, label: "February" },
                  { value: 3, label: "March" },
                  { value: 4, label: "April" },
                  { value: 5, label: "May" },
                  { value: 6, label: "June" },
                  { value: 7, label: "July" },
                  { value: 8, label: "August" },
                  { value: 9, label: "September" },
                  { value: 10, label: "October" },
                  { value: 11, label: "November" },
                  { value: 12, label: "December" },
                ].map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="movements__containerMain-chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                width={500}
                height={300}
                data={dataGraph}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Income" fill="var(--color-orange-400)" />
                <Bar dataKey="Expenses" fill="var(--color-orange-800)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="movements__containerMain-balance">
            <div className="movements__balance income">
              <span className="material-symbols-rounded">download</span>
              <p>{formattedBalanceIncome}</p>
            </div>
            <div className="movements__balance expenses">
              <span className="material-symbols-rounded">upload</span>
              <p>{formattedBalanceExpenses}</p>
            </div>
            <div className="movements__balance edbita">
              <span
                className={`material-symbols-rounded ${
                  parseFloat(formattedBalanceFinal) < 0
                    ? "negative"
                    : "positive"
                }`}
              >
                savings
              </span>
              <p>{formattedBalanceFinal}</p>
            </div>
          </div>
          <div className="movements__containerMain-movements">
            <div className="movements__movements-text">
              <p>Movements</p>
              <span className="material-symbols-rounded">new_window</span>
            </div>
            <div className="movements__movements-table">
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Movements;
