import { useEffect, useState } from "react";
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
import dataAnnualReportFile from "../../data/dataAnnualReport.json";
import dataMovementsFile from "../../data/dataMovements.json";

function Movements() {
  // Pillamos el año y mes actual (number)
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Inicializa las variables de year y month con los valores de mes y año actual
  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState(currentMonth.toString());

  // Actualiza el año y mes según la seleccion en el Selector
  const handleChangeYear = (event: SelectChangeEvent) => {
    setYear(event.target.value as string);
  };
  const handleChangeMonth = (event: SelectChangeEvent) => {
    setMonth(event.target.value as string);
  };

  // Pilla los años dentro de dataAnnualReport y hace un array con los años únicos para despues mostrarlos en el selector
  const uniqueYears = [
    ...new Set(dataAnnualReportFile.map((item) => item.year)),
  ];

  // Nombre de los meses
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Filtra los datos de dataMovements de tal manera que solo se muestren los del mes y año seleccionado
  const [dataGraph, setDataGraph] = useState<
    {
      month: string;
      year: number;
      Income: number;
      Expenses: number;
    }[]
  >([]);
  const [dataProcessed, setDataProcessed] = useState(false);

  type MonthlyTransactionEntry = {
    Category: string;
    Ammount: number;
  };
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
  type MonthlyTransaction = {
    [key in Months]?: MonthlyTransactionEntry[];
  };
  type DataMovement = {
    [key: string]: {
      [month in Months]?: MonthlyTransaction;
    }[];
  };

  useEffect(() => {
    if (!dataProcessed && year && month) {
      const selectedYearData = dataMovementsFile.find(
        (y) => Object.keys(y)[0] === year.toString()
      ) as DataMovement | unknown;

      if (selectedYearData) {
        const monthIndex = parseInt(month, 10) - 1;
        const monthName: Months = monthMapping[parseInt(month, 10)];
        const transactionsObject = (selectedYearData as DataMovement)[year][
          monthIndex
        ];
        const transactionsArray = transactionsObject[monthName];
        if (transactionsArray) {
          const transactionsArray = (transactionsObject as MonthlyTransaction)[
            monthName
          ];

          const totalIncome = (transactionsArray || []).reduce(
            (acc: number, current: { Ammount: number }) => {
              return current.Ammount > 0 ? acc + current.Ammount : acc;
            },
            0
          );

          const totalExpenses = (transactionsArray || []).reduce(
            (acc: number, current: { Ammount: number }) => {
              return current.Ammount < 0
                ? acc + Math.abs(current.Ammount)
                : acc;
            },
            0
          );

          setDataGraph(() => [
            {
              month: monthName,
              year: parseInt(year, 10),
              Income: totalIncome,
              Expenses: totalExpenses,
            },
          ]);

          setDataProcessed(true);
        } else {
          console.error(
            "Transactions object does not have the expected month property:",
            transactionsObject
          );
        }
      }
    }
  }, [year, month, monthMapping, dataProcessed]);

  useEffect(() => {
    setDataProcessed(false);
  }, [year, month]);

  // Inicializamos las variables y despues recorremos filteredData y le asignamos a esas variables los datos ya filtrados, después se calcula el balanceFinal
  let balanceIncome = 0;
  let balanceExpenses = 0;
  for (const data of dataGraph) {
    balanceIncome += data.Income;
    balanceExpenses += data.Expenses;
  }
  const balanceFinal: number = balanceIncome - balanceExpenses;

  // Formateamos a € los balances

  function formatCurrency(value: number) {
    return value.toLocaleString("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      useGrouping: true,
    });
  }

  const formattedBalanceIncome = formatCurrency(balanceIncome);
  const formattedBalanceExpenses = formatCurrency(balanceExpenses);
  const formattedBalanceFinal = formatCurrency(balanceFinal);

  // Data Table Movements
  const [tableRows, setTableRows] = useState<GridRowsProp>([]);

  useEffect(() => {
    if (year && month) {
      const selectedYearData = dataMovementsFile.find(
        (entry) => entry[year as keyof typeof entry]
      );
      if (selectedYearData) {
        const monthData =
          selectedYearData[year as keyof typeof selectedYearData];
        if (monthData) {
          const selectedMonthData = monthData.find(
            (entry) => entry[monthMapping[month]]
          );
          if (selectedMonthData) {
            const rows = selectedMonthData[monthMapping[month]].map(
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
  }, [year, month, monthMapping]);
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
                value={year || currentYear.toString()}
                label="Year"
                onChange={handleChangeYear}
              >
                {uniqueYears.map((year) => (
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
