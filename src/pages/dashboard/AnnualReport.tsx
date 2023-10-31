import React, { useState, useEffect } from "react";
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

function AnnualReport() {
  // dataAnnualReport
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dataAnnualReport = [
    // ------ 2023
    {
      name: "Jan",
      year: 2023,
      Income: 1575.02,
      Expenses: 1402.58,
    },
    {
      name: "Feb",
      year: 2023,
      Income: 1505.67,
      Expenses: 1054.03,
    },
    {
      name: "Mar",
      year: 2023,
      Income: 1341.68,
      Expenses: 1547.36,
    },
    {
      name: "Apr",
      year: 2023,
      Income: 1757.31,
      Expenses: 1482.13,
    },
    {
      name: "May",
      year: 2023,
      Income: 1606.85,
      Expenses: 1445.96,
    },
    {
      name: "Jun",
      year: 2023,
      Income: 1650.61,
      Expenses: 1906.09,
    },
    {
      name: "Jul",
      year: 2023,
      Income: 1687.14,
      Expenses: 1231.87,
    },
    {
      name: "Aug",
      year: 2023,
      Income: 1708.57,
      Expenses: 633.6,
    },
    {
      name: "Sep",
      year: 2023,
      Income: 1893.27,
      Expenses: 1086.58,
    },
    {
      name: "Oct",
      year: 2023,
      Income: 1500,
      Expenses: 1294.67,
    },
    {
      name: "Nov",
      year: 2023,
      Income: 1300,
      Expenses: 1201,
    },
    {
      name: "Dec",
      year: 2023,
      Income: 1700,
      Expenses: 1365,
    },

    // ------ 2022
    {
      name: "Jan",
      year: 2022,
      Income: 1000,
      Expenses: 900,
    },
    {
      name: "Feb",
      year: 2022,
      Income: 1000,
      Expenses: 900,
    },
    {
      name: "Mar",
      year: 2022,
      Income: 1000,
      Expenses: 900,
    },
    {
      name: "Apr",
      year: 2022,
      Income: 1000,
      Expenses: 900,
    },
    {
      name: "May",
      year: 2022,
      Income: 1000,
      Expenses: 900,
    },
    {
      name: "Jun",
      year: 2022,
      Income: 1000,
      Expenses: 900,
    },
    {
      name: "Jul",
      year: 2022,
      Income: 1000,
      Expenses: 900,
    },
    {
      name: "Aug",
      year: 2022,
      Income: 1000,
      Expenses: 900,
    },
    {
      name: "Sep",
      year: 2022,
      Income: 1000,
      Expenses: 900,
    },
    {
      name: "Oct",
      year: 2022,
      Income: 1000,
      Expenses: 900,
    },
    {
      name: "Nov",
      year: 2022,
      Income: 1000,
      Expenses: 900,
    },
    {
      name: "Dec",
      year: 2022,
      Income: 1000,
      Expenses: 900,
    },
  ];

  // Sacamos el currentYear e inicializamos la variable year con el año actual
  // handleChange es el evento que cambiará el año en el <Select>
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [year, setYear] = React.useState(currentYear.toString());
  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedYear = event.target.value;
    setYear(selectedYear);
  };

  // Incializamos las variables
  const [balanceIncome, setBalanceIncome] = useState(0);
  const [balanceExpenses, setBalanceExpenses] = useState(0);
  // useEffect recalcula el balance de ingresos y gastos cada vez que cambia el año seleccionado
  useEffect(() => {
    const selectedYearData = dataAnnualReport.filter(
      (item) => item.year === parseInt(year, 10)
    );
    const incomeSum = selectedYearData.reduce(
      (sum, item) => sum + item.Income,
      0
    );
    const expensesSum = selectedYearData.reduce(
      (sum, item) => sum + item.Expenses,
      0
    );
    setBalanceIncome(incomeSum);
    setBalanceExpenses(expensesSum);
  }, [year, dataAnnualReport]);

  // Crea un array con los años unicos dentro de dataAnnualReport
  const yearsWithData = [...new Set(dataAnnualReport.map((item) => item.year))];
  // Filtra los datos anual de dataAnnualReport para obtener solo los datos del año seleccionado
  const filteredData = dataAnnualReport.filter(
    (item) => item.year === parseInt(year, 10)
  );

  // Sacamos la diferencia entre balanceIncome y balanceExpenses;
  const balanceFinal: number = balanceIncome - balanceExpenses;
  // Formateamos los balances a €
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

  // Data Table Categories
  const rows: GridRowsProp = [
    { id: 1, Category: "Work", Balance: "15711,18", InOut: "IN" },
    { id: 2, Category: "House", Balance: "-581,75", InOut: "OUT" },
  ];
  const columns: GridColDef[] = [
    { field: "Category", headerName: "Category", flex: 2 },
    { field: "Balance", headerName: "Balance", flex: 2 },
    { field: "InOut", headerName: "InOut", flex: 0.5 },
  ];

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
                data={filteredData}
                margin={{
                  top: 5,
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
            <DataGrid rows={rows} columns={columns} />
          </div>
        </div>
      </section>
    </>
  );
}

export default AnnualReport;
