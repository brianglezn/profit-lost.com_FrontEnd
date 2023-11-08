import { useEffect, useState, useMemo } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

import "./Movements.css";
import dataMovementsJson from "../../data/dataMovements.json";

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

// Definir un tipo para el objeto que almacena los ingresos y gastos acumulados
type IncomeExpenses = {
  [category: string]: number;
};
// Definir un tipo para los pares de categoría y cantidad para los estados de ingresos y gastos
type CategoryAmountPair = {
  name: string;
  value: number;
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

  // CATEGORIAS PIE ------------------------------------------------------------------
  // Estados para las categorías de ingresos y gastos con tipos específicos
  const [dataCategoryIncome, setDataCategoryIncome] = useState<CategoryAmountPair[]>([]);
  const [dataCategoryExpenses, setDataCategoryExpenses] = useState<CategoryAmountPair[]>([]);

  useEffect(() => {
    if (year && month) {
      // Buscar en dataMovementsFile el objeto que corresponde al año seleccionado.
      const yearDataWrapper = dataMovementsFile.find(
        (yearData) => Object.keys(yearData)[0] === year
      );

      if (yearDataWrapper) {
        // Acceder al arreglo de MonthlyTransactions para el año seleccionado.
        const monthlyTransactionsArray = yearDataWrapper[year];

        // Suponiendo que hay un solo objeto MonthlyTransactions por mes en el arreglo
        const transactionsForMonth = monthlyTransactionsArray.find(
          (monthlyTransactions) => monthMapping[Number(month)] in monthlyTransactions
        );

        if (transactionsForMonth) {
          // Acceder a las transacciones para el mes seleccionado
          const transactions = transactionsForMonth[monthMapping[Number(month)]];

          if (transactions) {
            const income: IncomeExpenses = {}; // Inicializar aquí
            const expenses: IncomeExpenses = {}; // Inicializar aquí

            // Recorrer las transacciones y clasificar entre ingresos y gastos
            transactions.forEach((transaction) => {
              const category = transaction.Category;
              const amount = transaction.Ammount;

              if (amount >= 0) {
                income[category] = (income[category] || 0) + amount;
              } else {
                expenses[category] = (expenses[category] || 0) + Math.abs(amount);
              }
            });

            // Transformar los objetos acumulados en arrays para los gráficos
            setDataCategoryIncome(
              Object.entries(income).map(([name, value]) => ({ name, value }))
            );
            setDataCategoryExpenses(
              Object.entries(expenses).map(([name, value]) => ({ name, value }))
            );
          }
        }
      }
    }
  }, [year, month]);

  const Colors = [
    "var(--color-orange-300)",
    "var(--color-orange)",
    "var(--color-orange-200)",
    "var(--color-orange-700)",
    "var(--color-orange-800)",
    "var(--color-orange-400)",
    "var(--color-orange-100)",
  ];

  interface LabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    name: string;
  }
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }: LabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="none"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {name} ({(percent * 100).toFixed(0)}%)
      </text>
    );
  };
  // FIN CATEGORIAS PIE ------------------------------------------------------------------

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
    if (!dataProcessed && year && month) {
      const selectedYearData = dataMovementsFile.find(
        (data) => Object.prototype.hasOwnProperty.call(data, year)
      );

      if (selectedYearData) {
        const monthName: Months = monthMapping[parseInt(month, 10)];
        const transactionsForMonth = selectedYearData[year].find((monthlyTransactions) =>
          Object.prototype.hasOwnProperty.call(monthlyTransactions, monthName)
        );

        if (transactionsForMonth && transactionsForMonth[monthName]) {
          const transactionsArray = transactionsForMonth[monthName];

          if (transactionsArray && transactionsArray.length > 0) {
            const totalIncome = transactionsArray.reduce((acc, transaction) => {
              return transaction.Ammount > 0 ? acc + transaction.Ammount : acc;
            }, 0);

            const totalExpenses = transactionsArray.reduce((acc, transaction) => {
              return transaction.Ammount < 0 ? acc + Math.abs(transaction.Ammount) : acc;
            }, 0);

            setDataGraph([
              {
                month: monthName,
                year: parseInt(year, 10),
                Income: totalIncome,
                Expenses: totalExpenses,
              },
            ]);
          } else {
            // Establecer un estado que indica que no hay datos para mostrar
            setDataGraph([
              {
                month: monthName,
                year: parseInt(year, 10),
                Income: 0,
                Expenses: 0,
              },
            ]);
          }
          setDataProcessed(true);
        } else {
          console.error("No transactions found for the selected month:", monthName);
          // Podrías también establecer un estado para manejar este caso y mostrar un mensaje en la interfaz de usuario
        }
      }
    }
  }, [year, month, dataProcessed]);

  const isDataEmpty = dataGraph.every((data) => data.Income === 0 && data.Expenses === 0);




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
          <div className="movements__containerMain-category">
            {isDataEmpty ? (
              <p>No data available for this month.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={400}>
                  <Pie
                    data={dataCategoryIncome}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius="80%"
                    dataKey="value"
                  >
                    {dataCategoryIncome.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={Colors[index % Colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>)}
          </div>
          <div className="movements__containerMain-category">
            {isDataEmpty ? (
              <p>No data available for this month.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={400}>
                  <Pie
                    data={dataCategoryExpenses}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius="80%"
                    dataKey="value"
                  >
                    {dataCategoryExpenses.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={Colors[index % Colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>)}
          </div>
          <div className="movements__containerMain-chart">
            {isDataEmpty ? (
              <p>No data available for this month.</p>
            ) : (
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
              </ResponsiveContainer>)}
          </div>
          <div className="movements__containerMain-balance">
            <div className="movements__balance income">
              <span className="material-symbols-rounded">download</span>
              <p>{formattedBalanceIncome}</p>
            </div>
            <div className="movements__balance expenses">
              <span className="material-symbols-rounded">upload</span>
              <p>-{formattedBalanceExpenses}</p>
            </div>
            <div className="movements__balance edbita">
              <span
                className={`material-symbols-rounded ${parseFloat(formattedBalanceFinal) < 0
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
                />)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Movements;
