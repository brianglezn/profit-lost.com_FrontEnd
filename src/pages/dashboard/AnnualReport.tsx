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
import dataAnnualReportFile from "../../data/dataAnnualReport.json";
import dataMovementsFile from "../../data/dataMovements.json";

function AnnualReport() {
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
  // filtramos los datos de dataMovementsFile pasa sacar el ingreso y el gasto anual

  type DataMovement = {
    [key: string]: {
      Jan?: {
        Category: string;
        Ammount: number;
      }[];
      Feb?: {
        Category: string;
        Ammount: number;
      }[];
      Mar?: {
        Category: string;
        Ammount: number;
      }[];
      Apr?: {
        Category: string;
        Ammount: number;
      }[];
      May?: {
        Category: string;
        Ammount: number;
      }[];
      Jun?: {
        Category: string;
        Ammount: number;
      }[];
      Jul?: {
        Category: string;
        Ammount: number;
      }[];
      Ago?: {
        Category: string;
        Ammount: number;
      }[];
      Sep?: {
        Category: string;
        Ammount: number;
      }[];
      Oct?: {
        Category: string;
        Ammount: number;
      }[];
      Nov?: {
        Category: string;
        Ammount: number;
      }[];
      Dec?: {
        Category: string;
        Ammount: number;
      }[];
    }[];
  };

  useEffect(() => {
    const selectedYearData: DataMovement  = dataMovementsFile.find(
      (y) => Object.keys(y)[0] === year.toString()
    );
    if (!selectedYearData) return;
    const monthlyData = selectedYearData[year];

    let incomeSum = 0;
    let expensesSum = 0;

    for (const monthObj of monthlyData) {
      for (const month in monthObj) {
        for (const movement of monthObj[month]) {
          if (movement.Ammount > 0) {
            incomeSum += movement.Ammount;
          } else {
            expensesSum += Math.abs(movement.Ammount);
          }
        }
      }
    }

    setBalanceIncome(incomeSum);
    setBalanceExpenses(expensesSum);
  }, [year]);

  // // Crea un array con los años unicos dentro de dataAnnualReport
  const yearsWithData = [
    ...new Set(dataMovementsFile.map((item) => Object.keys(item)[0])),
  ].sort((a, b) => Number(b) - Number(a));

  // // Filtra los datos anual de dataAnnualReport para obtener solo los datos del año seleccionado
  const filteredData = dataAnnualReportFile.filter(
    (item) => item.year === parseInt(year, 10)
  );

  // Sacamos la diferencia entre balanceIncome y balanceExpenses;
  const balanceFinal: number = balanceIncome - balanceExpenses;
  // Formateamos los balances a €
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

  // Data Table Categories
  const [tableRows, setTableRows] = useState<GridRowsProp>([]);

  type CategoryBalance = {
    Category: string;
    Balance: number;
    InOut: string;
  };
  useEffect(() => {
    if (year) {
      const selectedYearData: DataMovement = dataMovementsFile.find(
        (y) => Object.keys(y)[0] === year.toString()
      );
      if (!selectedYearData) return;

      if (selectedYearData) {
        const monthEntries = selectedYearData[year];
        const categoryBalances = monthEntries.flatMap((monthEntry) =>
          Object.entries(monthEntry).flatMap(([month, transactions]) =>
            transactions.map((transaction) => ({
              ...transaction,
              Month: month,
            }))
          )
        );

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
              if (!acc[Category]) {
                acc[Category] = { Category, Balance: 0, InOut: "" };
              }
              acc[Category].Balance += Ammount;
              acc[Category].InOut = acc[Category].Balance >= 0 ? "IN" : "OUT";
              return acc;
            },
            {}
          );

        const rows = Object.values(categoriesBalance).map((balance, index) => ({
          id: index,
          ...balance,
          Balance: formatCurrency(balance.Balance), // Formateamos el Balance como moneda
        }));
        setTableRows(rows);
      }
    }
  }, [year]);

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
