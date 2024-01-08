import React, { useEffect, useState, useMemo } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  Modal,
  Box,
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
import FormAccounts from "../../components/dashboard/FormAccounts.tsx";

// We create a type for the account data elements.
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

// Array of month names
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
// Function to get the name of the previous month.
function getPreviousMonth() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  return monthNames[previousMonth];
}

function Accounts() {
  // Extracts the current date, the current year and the current month's name
  const currentDate = new Date();
  const currentYear: number = currentDate.getFullYear();
  const currentMonthName: string = monthNames[currentDate.getMonth()];

  // Status hook and handler function for the selected year change in the user interface
  const [year, setYear] = React.useState(currentYear.toString());
  const handleChange = (event: SelectChangeEvent) => {
    setYear(event.target.value as string);
  };

  // Status hook for managing account data
  const [dataAccounts, setDataAccounts] = useState<DataAccountItem[]>([]);
  // Hook effect for formatting and setting account data from a data file
  useEffect(() => {
    const formattedData = dataAccountsFile.map((item: DataAccountItem) => {
      // Initializes the formatted data object for one year
      const formattedData: Record<string, Record<string, number>> = {};

      // Iterate over each year in the account data.
      for (const year in item.data) {
        if (item.data[year]) {
          // Initializes the monthly data object for a specific year
          const monthlyData: Record<string, number> = {};
          // Iterate over each month in the year's data.
          for (const month in item.data[year]) {
            const value = item.data[year]?.[month];
            if (typeof value === "number") {
              // If the value is a number, adds it to the monthly data object
              monthlyData[month] = value;
            }
          }
          // Add the formatted monthly data to the year data object
          formattedData[year] = monthlyData;
        }
      }

      // Returns a new object with the formatted data and style properties
      return {
        accountName: item.accountName,
        data: formattedData,
        customBackgroundColor: item.customBackgroundColor,
        customColor: item.customColor,
      };
    });

    setDataAccounts(formattedData);
  }, [year]);

  // Hook useMemo to calculate the current total balance based on account data and the current month.
  const totalBalance = useMemo(() => {
    const balance = dataAccounts.reduce((acc, account) => {
      const monthBalance = account.data[currentYear]?.[currentMonthName] || 0;
      return acc + monthBalance;
    }, 0);
    return balance;
  }, [dataAccounts, currentYear, currentMonthName]);

  const uniqueYears = useMemo(() => {
    // Creates a set of years to remove duplicates and then converts it to a sorted array
    return Array.from(
      new Set(dataAccounts.flatMap((account) => Object.keys(account.data)))
    ).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
  }, [dataAccounts]);

  // Generates the data for the chart from the selected year and account data
  const chartData = monthNames.map((month) => {
    const data: Record<string, number | string> = {};

    dataAccounts.forEach((account) => {
      // Gets the value for the selected month and year, or 0 if not defined.
      const value = account.data[parseInt(year)]?.[month] ?? 0;
      // Assigns the value to the corresponding account name in the data object
      data[account.accountName] = value;
    });

    // Concatenates the total to the month name
    const monthWithTotal = `${month}: ${Object.values(data).reduce((acc, val) => {
      // Make sure that both values are numbers before adding them together.
      const numAcc = typeof acc === 'number' ? acc : parseFloat(acc);
      const numVal = typeof val === 'number' ? val : parseFloat(val);
      return numAcc + numVal;
    }, 0).toLocaleString("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      useGrouping: true,
    })}`;

    // Returns an object with the name of the month and the accumulated data of all accounts
    return {
      name: monthWithTotal,
      ...data,
    };
  });

  // Format the total balance to display it in local currency format.
  const formattedTotalBalance = totalBalance.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Gets the name of the previous month to calculate the difference in balance
  const previousMonth = getPreviousMonth();

  // Hook useMemo to calculate the balance difference between the current month and the previous month.
  const balanceDifference = useMemo(() => {
    // Calculates the current month's balance by adding up the balances of all accounts
    const currentMonthBalance = dataAccounts.reduce((total, account) => {
      return total + (account.data[currentYear]?.[currentMonthName] || 0);
    }, 0);
    // Calculates the previous month's balance by adding up the balances of all accounts
    const previousMonthBalance = dataAccounts.reduce((total, account) => {
      return total + (account.data[currentYear]?.[previousMonth] || 0);
    }, 0);
    // Returns the difference between the current balance and the previous balance
    return currentMonthBalance - previousMonthBalance;
  }, [dataAccounts, currentYear, currentMonthName, previousMonth]);
  const isPositive = balanceDifference > 0;

  // Hook useMemo to generate account elements for the UI
  const accountItems = useMemo(() => {
    // Map the account data to create an account element for each one.
    return dataAccounts.map((account, index) => (
      <AccountItem
        key={index}
        accountName={account.accountName}
        balance={`${account.data[currentYear]?.[currentMonthName]?.toLocaleString(
          "es-ES",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ) ?? "N/A"
          } €`}
        customBackgroundColor={account.customBackgroundColor}
        customColor={account.customColor}
      />
    ));
  }, [dataAccounts, currentYear, currentMonthName]);

  // Modal
  const styleBox = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "var(--color-bg)",
    boxShadow: 15,
    p: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px"
  };

  const [open, setOpen] = React.useState(false);
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const backdropStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(4px)',
  };

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
            <span className="material-symbols-rounded no-select" onClick={handleOpenModal}>new_window</span>
            <Modal
              open={open}
              onClose={handleCloseModal}
              componentsProps={{
                backdrop: {
                  style: backdropStyle,
                },
              }}>
              <Box sx={styleBox}>
                <FormAccounts onClose={handleCloseModal} />
              </Box>
            </Modal>
          </div>
          <div className="accounts__accounts-container">{accountItems}</div>
        </div>
      </section>
    </>
  );
}

export default Accounts;
