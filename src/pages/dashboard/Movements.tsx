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

  // dataAnnualReport
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dataAnnualReport = [
    {
      month: "Jan",
      year: 2023,
      Income: 1575.02,
      Expenses: 1402.58,
    },
    {
      month: "Feb",
      year: 2023,
      Income: 1505.67,
      Expenses: 1054.03,
    },
    {
      month: "Mar",
      year: 2023,
      Income: 1341.6,
      Expenses: 1547.36,
    },
    {
      month: "Apr",
      year: 2023,
      Income: 1757.31,
      Expenses: 1482.13,
    },
    {
      month: "May",
      year: 2023,
      Income: 1606.85,
      Expenses: 1445.96,
    },
    {
      month: "Jun",
      year: 2023,
      Income: 1650.61,
      Expenses: 1906.09,
    },
    {
      month: "Jul",
      year: 2023,
      Income: 1687.14,
      Expenses: 1231.87,
    },
    {
      month: "Aug",
      year: 2023,
      Income: 1708.57,
      Expenses: 633.6,
    },
    {
      month: "Sep",
      year: 2023,
      Income: 1893.27,
      Expenses: 1086.58,
    },
    {
      month: "Oct",
      year: 2023,
      Income: 1496.18,
      Expenses: 1638.35,
    },
    {
      month: "Nov",
      year: 2023,
      Income: 0,
      Expenses: 0,
    },
    {
      month: "Dec",
      year: 2023,
      Income: 0,
      Expenses: 0,
    },
    {
      month: "Jan",
      year: 2022,
      Income: 1333.08,
      Expenses: 940.72,
    },
    {
      month: "Feb",
      year: 2022,
      Income: 1290.46,
      Expenses: 1088.64,
    },
    {
      month: "Mar",
      year: 2022,
      Income: 1869.88,
      Expenses: 1426.53,
    },
    {
      month: "Apr",
      year: 2022,
      Income: 2025.48,
      Expenses: 1420.56,
    },
    {
      month: "May",
      year: 2022,
      Income: 1065.76,
      Expenses: 923.4,
    },
    {
      month: "Jun",
      year: 2022,
      Income: 1046.82,
      Expenses: 982.95,
    },
    {
      month: "Jul",
      year: 2022,
      Income: 1840.19,
      Expenses: 1661.52,
    },
    {
      month: "Aug",
      year: 2022,
      Income: 1830.11,
      Expenses: 591.55,
    },
    {
      month: "Sep",
      year: 2022,
      Income: 1361.44,
      Expenses: 2161.2,
    },
    {
      month: "Oct",
      year: 2022,
      Income: 1392.82,
      Expenses: 1559.95,
    },
    {
      month: "Nov",
      year: 2022,
      Income: 1251.68,
      Expenses: 1332.67,
    },
    {
      month: "Dec",
      year: 2022,
      Income: 2352.13,
      Expenses: 1727.75,
    },
  ];
  
  // Pilla los años dentro de dataAnnualReport y hace un array con los años únicos para despues mostrarlos en el selector
  const uniqueYears = [...new Set(dataAnnualReport.map((item) => item.year))];

  // Nombre de los meses
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Filtra los datos de dataAnnualReport de tal manera que solo se muestren los del mes y año seleccionado
  const [dataGraph, setDataGraph] = useState<
    {
      month: string;
      year: number;
      Income: number;
      Expenses: number;
    }[]
  >([]);
  useEffect(() => {
    const dataFilter = dataAnnualReport.filter((item) => {
      return item.year === +year && item.month === monthNames[+month - 1];
    });
    setDataGraph(dataFilter);
  }, [year, month, dataAnnualReport, monthNames]);

  // Inicializamos las variables y despues recorremos filteredData y le asignamos a esas variables los datos, después se calcular el balanceFinal
  let balanceIncome = 0;
  let balanceExpenses = 0;
  for (const data of dataGraph) {
    balanceIncome += data.Income;
    balanceExpenses += data.Expenses;
  }
  const balanceFinal: number = balanceIncome - balanceExpenses;

  // Formateamos a € los balances
  const formattedBalanceIncome = balanceIncome.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
  const formattedBalanceExpenses = balanceExpenses.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
  const formattedBalanceFinal = balanceFinal.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    useGrouping: true,
  });

  // Data Table Movements
  const rows: GridRowsProp = [
    {
      id: 1,
      Category: "Work",
      Balance: 1489.58,
      InOut: "IN",
    },
    {
      id: 2,
      Category: "Home",
      Balance: -359.58,
      InOut: "OUT",
    },
  ];
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
              <DataGrid rows={rows} columns={columns} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Movements;
