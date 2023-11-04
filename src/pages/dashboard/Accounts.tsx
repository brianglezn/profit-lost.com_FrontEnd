import React, { useEffect, useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
} from "@mui/material";
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

import "./Accounts.css";
import dataAccountsFile from "../../data/dataAccounts.json";
import AccountItem from "../../components/dashboard/AccountItem.tsx";

function Accounts() {
  // dataAccountsFile
  type DataAccountItem = {
    accountName: string;
    data: {
      [year: string]:
        | {
            [month: string]: number | undefined;
          }
        | undefined;
    };
    customBackgroundColor: string;
    customColor: string;
  };

  const [dataAccounts, setDataAccounts] = useState<DataAccountItem[]>([]);
  useEffect(() => {
    const formattedData = dataAccountsFile.map((item: DataAccountItem) => {
      const formattedData: Record<string, Record<string, number>> = {};

      for (const year in item.data) {
        if (item.data[year]) {
          const monthlyData: Record<string, number> = {};

          for (const month in item.data[year]) {
            const value = item.data[year]?.[month];
            if (typeof value === "number") {
              monthlyData[month] = value;
            }
          }
          formattedData[year] = monthlyData;
        }
      }

      return {
        accountName: item.accountName,
        data: formattedData,
        customBackgroundColor: item.customBackgroundColor,
        customColor: item.customColor,
      };
    });

    setDataAccounts(formattedData);
  }, []);

  // Sacamos una variable de currentDate, currentYear y currentMonth(name)
  const currentDate = new Date();
  const currentYear: number = currentDate.getFullYear();
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
  const currentMonthName: string = monthNames[currentDate.getMonth()];

  // Se crea una lista de Cuentas con los datos de dataAccounts
  const accountItems = dataAccounts.map((account, index) => (
    <AccountItem
      key={index}
      accountName={account.accountName}
      balance={`${
        account.data[currentYear]?.[currentMonthName]?.toLocaleString("es-ES", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) ?? "N/A"
      } €`}
      customBackgroundColor={account.customBackgroundColor}
      customColor={account.customColor}
    />
  ));

  // Calcula el saldo todal de todas las cuentas segun año y mes actual, y se formatea a €
  const totalBalance = dataAccounts.reduce((acc, account) => {
    const balance = account.data[currentYear]?.[currentMonthName] || 0;

    return acc + balance;
  }, 0);
  const formattedTotalBalance = totalBalance.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Se crea una variable que contiene los años unicos que tienen datos en dataAccounts para despues mostrarlo en el selector
  const uniqueYears = Array.from(
    new Set(dataAccounts.flatMap((account) => Object.keys(account.data)))
  ).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
  // Establece el año actual como valor inicial para el selector
  const [year, setYear] = React.useState(currentYear.toString());
  // Actualiza el año según la seleccion en el Selector
  const handleChange = (event: SelectChangeEvent) => {
    setYear(event.target.value as string);
  };

  // Usamos chartData para añadirlo a <BarChart>
  const chartData = monthNames.map((month) => {
    const data: Record<string, number> = {};

    dataAccounts.forEach((account) => {
      const value = account.data[parseInt(year)]?.[month] ?? 0;
      data[account.accountName] = value;
    });

    return {
      name: month,
      ...data,
    };
  });

  // Creamos getPreviousMonth() para obtener el nombre del mes anterior al mes actual.
  function getPreviousMonth() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    return monthNames[previousMonth];
  }
  const previousMonth = getPreviousMonth();

  // Se suma el balance en las cuentas en el mes actual
  const currentMonthBalance = dataAccounts.reduce((total, account) => {
    return total + (account.data[currentYear]?.[currentMonthName] || 0);
  }, 0);
  // Se suma el balance en las cuentas en el mes anterior
  const previousMonthBalance = dataAccounts.reduce((total, account) => {
    return total + (account.data[currentYear]?.[previousMonth] || 0);
  }, 0);
  // Calcula la diferencia entre el balance del mes actual y el del mes anterior
  const balanceDifference = currentMonthBalance - previousMonthBalance;
  // Determina si balanceDifference es positivo o negativo
  const isPositive = balanceDifference > 0;

  return (
    <>
      <section className="accounts">
        <div className="movements__containerMain">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Year</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={year}
              label="Year"
              onChange={handleChange}
            >
              {uniqueYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="accounts__main">
            <h2>{formattedTotalBalance} €</h2>
            <p className={isPositive ? "positive-balance" : "negative-balance"}>
              {balanceDifference > 0
                ? `+${balanceDifference.toFixed(2)}`
                : balanceDifference.toFixed(2)}{" "}
              € <span>{previousMonth}</span>
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                width={500}
                height={300}
                data={chartData}
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
                {dataAccounts.map((account) => (
                  <Bar
                    key={account.accountName}
                    dataKey={account.accountName}
                    stackId="a"
                    fill={account.customBackgroundColor}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="accounts__containerAccounts">
          <div className="accounts__accounts-text">
            <p>Accounts</p>
            <span className="material-symbols-rounded">new_window</span>
          </div>
          <div className="accounts__accounts-container">{accountItems}</div>
        </div>
      </section>
    </>
  );
}

export default Accounts;
