import React, { useState, useEffect, useMemo } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box, Modal } from "@mui/material";

import "./AnnualReport.css";
import dataMovementsFile from "../../data/dataMovements.json";

import AnnualChart from "../../components/dashboard/AnnualChart";
import AnnualMovements from "../../components/dashboard/AnnualMovements";
import FormCategory from "../../components/dashboard/FormCategory";

// We define the types for the monthly transactions and the data structure.
type MonthlyTransaction = {
  Category: string;
  Amount: number;
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

// Function to format numbers to currency format.
function formatCurrency(value: number) {
  return value.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    useGrouping: true,
  });
}

function AnnualReport() {
  // Status for the current year and the function to update it.
  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState(currentYear);

  // useMemo to calculate the years with available data, to avoid unnecessary recalculations.
  const yearsWithData = useMemo(() => {
    return [
      ...new Set(dataMovementsFile.map((item) => Object.keys(item)[0])),
    ].sort((a, b) => Number(b) - Number(a));
  }, []);

  // Function to handle the change of year selected in the drop-down menu.
  const handleChange = (event: SelectChangeEvent<string>) => {
    setYear(event.target.value);
  };

  // Statements for income and expense totals.
  const [balanceIncome, setBalanceIncome] = useState(0);
  const [balanceExpenses, setBalanceExpenses] = useState(0);

  // We calculate the balance of income and expenses when loading data or changing the year.
  useEffect(() => {
    const selectedYearData = dataMovementsFile.find(
      (y) => Object.keys(y)[0] === year.toString()
    ) as DataMovement | unknown;

    // If no data is found for that year, terminate the execution of the block here.
    if (!selectedYearData) return;

    const monthlyData = (selectedYearData as DataMovement)[year];
    let incomeSum = 0;
    let expensesSum = 0;

    // Scroll through the monthly financial data objects.
    for (const monthObj of monthlyData) {
      for (const month in monthObj) {
        const transactions = monthObj[month as Month];
        // If there are transactions, add the amounts to the respective accumulators.
        if (transactions) {
          for (const movement of transactions) {
            if (movement.Amount > 0) {
              // If the amount is positive, add it to income.
              incomeSum += movement.Amount;
            } else {
              // If the amount is negative, add it to expenses (after converting it to positive).
              expensesSum += Math.abs(movement.Amount);
            }
          }
        }
      }
    }

    setBalanceIncome(incomeSum);
    setBalanceExpenses(expensesSum);
  }, [year]);

  // Format the total income and expense balances to currency format.
  const formattedBalanceIncome = formatCurrency(balanceIncome);
  const formattedBalanceExpenses = formatCurrency(balanceExpenses);
  const formattedBalanceFinal = formatCurrency(balanceIncome - balanceExpenses);

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
          <AnnualChart year={year} />
          <div className="annualReport__containerMain-balance">
            <div className="annualReport__balance income">
              <span className="material-symbols-rounded no-select">download</span>
              <p>{formattedBalanceIncome}</p>
            </div>
            <div className="annualReport__balance expenses">
              <span className="material-symbols-rounded no-select">upload</span>
              <p>-{formattedBalanceExpenses}</p>
            </div>
            <div className="annualReport__balance edbita">
              <span
                className={`material-symbols-rounded no-select ${parseFloat(formattedBalanceFinal) < 0
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
                <FormCategory onClose={handleCloseModal} />
              </Box>
            </Modal>
          </div>
          <AnnualMovements year={year} />
        </div>
      </section>
    </>
  );
}

export default AnnualReport;
