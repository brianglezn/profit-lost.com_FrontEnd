import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";

import "./AnnualReport.css";
import dataMovementsFile from "../../data/dataMovements.json";

// Definimos los tipos para las transacciones mensuales y la estructura de los datos.
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
};
type CategoryBalance = {
  Category: string;
  Balance: number;
  InOut: string;
};

// Función para formatear números a formato de moneda.
function formatCurrency(value: number) {
  return value.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    useGrouping: true,
  });
}

function AnnualReport() {
  // Estado para el año actual y la función para actualizarlo.
  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState(currentYear);

  // useMemo para calcular los años con datos disponibles, para evitar recálculos innecesarios.
  const yearsWithData = useMemo(() => {
    return [
      ...new Set(dataMovementsFile.map((item) => Object.keys(item)[0])),
    ].sort((a, b) => Number(b) - Number(a));
  }, []);

  // Función para manejar el cambio de año seleccionado en el menú desplegable.
  const handleChange = (event: SelectChangeEvent<string>) => {
    setYear(event.target.value);
  };

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
          };
        });
        setChartData(incomeExpensesByMonth);
      }
    }
  }, [year]);

  // Estados para los totales de ingresos y gastos.
  const [balanceIncome, setBalanceIncome] = useState(0);
  const [balanceExpenses, setBalanceExpenses] = useState(0);

  // Calculamos el balance de ingresos y gastos al cargar los datos o cambiar el año.
  useEffect(() => {
    const selectedYearData = dataMovementsFile.find(
      (y) => Object.keys(y)[0] === year.toString()
    ) as DataMovement | unknown;

    // Si no encuentra datos para ese año, termina la ejecución del bloque aquí.
    if (!selectedYearData) return;

    const monthlyData = (selectedYearData as DataMovement)[year];
    let incomeSum = 0;
    let expensesSum = 0;

    // Recorre los objetos mensuales de los datos financieros.
    for (const monthObj of monthlyData) {
      for (const month in monthObj) {
        const transactions = monthObj[month as Month];
        // Si hay transacciones, suma los montos a los acumuladores respectivos.
        if (transactions) {
          for (const movement of transactions) {
            if (movement.Ammount > 0) {
              // Si el monto es positivo, lo suma a los ingresos.
              incomeSum += movement.Ammount;
            } else {
              // Si el monto es negativo, lo suma a los gastos (después de convertirlo a positivo).
              expensesSum += Math.abs(movement.Ammount);
            }
          }
        }
      }
    }

    setBalanceIncome(incomeSum);
    setBalanceExpenses(expensesSum);
  }, [year]);

  // Formatea los balances de ingresos y gastos totales a formato de moneda.
  const formattedBalanceIncome = formatCurrency(balanceIncome);
  const formattedBalanceExpenses = formatCurrency(balanceExpenses);
  const formattedBalanceFinal = formatCurrency(balanceIncome - balanceExpenses);

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
      <section className="annualReport">
        <div className="annualReport__containerMain">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Year</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={year}
              label="Year"
              onChange={handleChange}
            >
              {yearsWithData.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="annualReport__containerMain-chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Income" fill="var(--color-orange-400)" />
                <Bar dataKey="Expenses" fill="var(--color-orange-800)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="annualReport__containerMain-balance">
            <div className="annualReport__balance income">
              <span className="material-symbols-rounded">download</span>
              <p>{formattedBalanceIncome}</p>
            </div>
            <div className="annualReport__balance expenses">
              <span className="material-symbols-rounded">upload</span>
              <p>{formattedBalanceExpenses}</p>
            </div>
            <div className="annualReport__balance edbita">
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
        </div>
        <div className="annualReport__containerCategory">
          <div className="annualReport__category-text">
            <p>Categories</p>
            <span className="material-symbols-rounded">new_window</span>
          </div>
          <div className="annualReport__category-table">
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
      </section>
    </>
  );
}

export default AnnualReport;
