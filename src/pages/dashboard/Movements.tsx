import React, { useState, useMemo } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import "./Movements.css";
import dataMovementsJson from "../../data/dataMovements.json";
import useDataMovements from "../../components/dashboard/useDataMovements";

import MovementsChart from "../../components/dashboard/MovementsChart";
import MovementsPie from "../../components/dashboard/MovementsPie";
import MovementsTable from "../../components/dashboard/MovementsTable";
import FormMovements from "../../components/dashboard/FormMovements";

// Type definition for monthly transaction entries with category and amount
type MonthlyTransactionEntry = {
  Category: string;
  Description: string;
  Amount: number;
};
// Type definition for the months of the year
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
// Type definition for the monthly transactions, which is an object with keys of type Months and values that are an array of MonthlyTransactionEntry
type MonthlyTransactions = {
  [key in Months]?: MonthlyTransactionEntry[];
};
// Type definition for the annual data object, where each year is a key pointing to an array of MonthlyTransactions
type YearData = {
  [year: string]: MonthlyTransactions[];
};
// The data file is an array of YearData
type DataMovementsFile = YearData[];
const dataMovementsFile: DataMovementsFile =
  dataMovementsJson as unknown as DataMovementsFile;

// Function for formatting numbers to local currency format
function formatCurrency(value: number) {
  return value.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    useGrouping: true,
  });
}

function Movements() {
  // Status for current year and current month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // States for the year and month selected by the user initialized with the current one
  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState(currentMonth.toString());

  // Movement data
  const { dataGraph } = useDataMovements(year, month);

  // Change handles for year and month
  const handleChangeYear = (event: SelectChangeEvent) =>
    setYear(event.target.value as string);
  const handleChangeMonth = (event: SelectChangeEvent) =>
    setMonth(event.target.value as string);

  // useMemo to get years with data
  // Avoid recalculating available years unless dataMovementsFile changes
  const yearsWithData = useMemo(() => {
    // Extraction of years from dataMovementsFile
    const years = dataMovementsFile.map((item) => Object.keys(item)[0]);
    // Duplicate elimination and sorting
    return [...new Set(years)].sort((a, b) => Number(b) - Number(a));
  }, []);

  // We check if there is data in dataGraph
  const isDataEmpty = dataGraph.every((data) => data.Income === 0 && data.Expenses === 0);

  // Initialize income and expense balances
  let balanceIncome = 0;
  let balanceExpenses = 0;
  // Calculate total income and expenses from the data in the graph
  for (const data of dataGraph) {
    balanceIncome += data.Income;
    balanceExpenses += data.Expenses;
  }

  // Format total income and expenses to currency
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

          <MovementsPie year={year} month={month} isDataEmpty={isDataEmpty} />

          <MovementsChart dataGraph={dataGraph} isDataEmpty={isDataEmpty} />

          <div className="movements__containerMain-balance">
            <div className="movements__balance income">
              <span className="material-symbols-rounded no-select">download</span>
              <p>{formattedBalanceIncome}</p>
            </div>
            <div className="movements__balance expenses">
              <span className="material-symbols-rounded no-select">upload</span>
              <p>-{formattedBalanceExpenses}</p>
            </div>
            <div className="movements__balance edbita">
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
          <div className="movements__containerMain-movements">
            <div className="movements__movements-text">
              <p>Movements</p>
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
                  <FormMovements onClose={handleCloseModal} />
                </Box>
              </Modal>
            </div>

            <MovementsTable year={year} month={month} isDataEmpty={isDataEmpty} />

          </div>
        </div>
      </section>
    </>
  );
}

export default Movements;
