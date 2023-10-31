import React from "react";
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

import AccountItem from "../../components/dashboard/AccountItem.tsx";

function Accounts() {
  // dataAccounts
  type AccountData = {
    accountName: string;
    data: {
      [year: number]: {
        [month: string]: number;
      };
    };
    customBackgroundColor: string;
    customColor: string;
  };
  const dataAccounts: AccountData[] = [
    {
      accountName: "ImaginBank",
      data: {
        2023: {
          Jan: 2171.04,
          Feb: 1926.91,
          Mar: 2160.19,
          Apr: 1551.73,
          May: 1723.36,
          Jun: 1799.18,
          Jul: 1442.65,
          Aug: 1811.17,
          Sep: 2632.97,
          Oct: 3311.64,
          Nov: 0,
          Dec: 0,
        },
        2022: {
          Jan: 1000,
          Feb: 1000,
          Mar: 1000,
          Apr: 1000,
          May: 1000,
          Jun: 1000,
          Jul: 1000,
          Aug: 1000,
          Sep: 1000,
          Oct: 1000,
          Nov: 1000,
          Dec: 1000,
        },
      },
      customBackgroundColor: "var(--color-orange-800)",
      customColor: "var(--color-white)",
    },
    {
      accountName: "Abanca",
      data: {
        2023: {
          Jan: 300,
          Feb: 300,
          Mar: 300,
          Apr: 300,
          May: 300,
          Jun: 300,
          Jul: 300,
          Aug: 300,
          Sep: 300,
          Oct: 300,
          Nov: 0,
          Dec: 0,
        },
        2022: {
          Jan: 1000,
          Feb: 1000,
          Mar: 1000,
          Apr: 1000,
          May: 1000,
          Jun: 1000,
          Jul: 1000,
          Aug: 1000,
          Sep: 1000,
          Oct: 1000,
          Nov: 1000,
          Dec: 1000,
        },
      },
      customBackgroundColor: "var(--color-orange-500)",
      customColor: "var(--color-white)",
    },
    {
      accountName: "Savings",
      data: {
        2023: {
          Jan: 100,
          Feb: 200,
          Mar: 300,
          Apr: 400,
          May: 500,
          Jun: 600,
          Jul: 700,
          Aug: 800,
          Sep: 900,
          Oct: 1000,
          Nov: 0,
          Dec: 0,
        },
      },
      customBackgroundColor: "var(--color-orange-400)",
      customColor: "var(--color-white)",
    },
  ];

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
      balance={`${account.data[currentYear][currentMonthName].toLocaleString(
        "es-ES",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )} €`}
      customBackgroundColor={account.customBackgroundColor}
      customColor={account.customColor}
    />
  ));

  // Calcula el saldo todal de todas las cuentas segun año y mes actual, y se formatea a €
  const totalBalance = dataAccounts.reduce((acc, account) => {
    const balance = account.data[currentYear][currentMonthName];
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

  // Se utiliza dataChart para almacenar el objeto que representa el conjunto de datos del gráfico, con el nombre del mes y los datos de todas las cuentas por cada mes
  const dataChart = monthNames.map((month) => {
    const data: Record<string, number> = {};

    dataAccounts.forEach((account) => {
      if (
        account.data[parseInt(year)] &&
        account.data[parseInt(year)][month] !== undefined
      ) {
        data[account.accountName] = account.data[parseInt(year)][month];
      } else {
        data[account.accountName] = 0;
      }
    });

    return {
      name: month,
      ...data,
    };
  });

  // Se transforma dataChart a chartData para poder usarlo en el <BarChart>
  const chartData = dataChart.map((item) => {
    const balance = dataAccounts.reduce((acc, account) => {
      const value =
        account.data[parseInt(year)] &&
        account.data[parseInt(year)][item.name] !== undefined
          ? account.data[parseInt(year)][item.name]
          : 0;
      return acc + (typeof value === "number" ? value : 0);
    }, 0);
    return { ...item, balance };
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
