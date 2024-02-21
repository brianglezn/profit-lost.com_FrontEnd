import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import "./Movements.css";
import dataMovementsJson from "../../data/dataMovements2.json";

import MovementsChart from "../../components/dashboard/MovementsChart";
import MovementsPie from "../../components/dashboard/MovementsPie";
import MovementsTable from "../../components/dashboard/MovementsTable";
import FormMovements from "../../components/dashboard/FormMovements";

// Define el tipo de datos para las transacciones
type TransactionData = {
  date: string;
  category: string;
  description: string;
  amount: number;
  transactionId: string;
};

// Función para formatear moneda
function formatCurrency(value: number) {
  return value.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    useGrouping: true,
  });
}

function Movements() {
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = (new Date().getMonth() + 1).toString();

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [dataGraph, setDataGraph] = useState<TransactionData[]>([]);
  const [yearsWithData, setYearsWithData] = useState<string[]>([]);

  useEffect(() => {
    const years = new Set(dataMovementsJson.map(({ date }) => date.split("-")[0]));
    setYearsWithData(Array.from(years).sort((a, b) => Number(b) - Number(a)));
  }, []);

  useEffect(() => {
    const filteredData = dataMovementsJson.filter(({ date }) => {
      const [y, m] = date.split("-");
      return y === year && m.padStart(2, '0') === month.padStart(2, '0');
    });
    setDataGraph(filteredData);
  }, [year, month]);

  // Calcular si los datos están vacíos después del filtrado
  const isDataEmpty = dataGraph.length === 0;

  // Funciones para manejar la selección de año y mes
  const handleChangeYear = (event: SelectChangeEvent) => setYear(event.target.value);
  const handleChangeMonth = (event: SelectChangeEvent) => setMonth(event.target.value);;

  const chartData = [
    {
      month,
      year: parseInt(year),
      Income: dataGraph.reduce((acc, { amount }) => (amount > 0 ? acc + amount : acc), 0),
      Expenses: dataGraph.reduce((acc, { amount }) => (amount < 0 ? acc + Math.abs(amount) : acc), 0),
    },
  ];

  const totalIncome = chartData[0].Income;
  const totalExpenses = chartData[0].Expenses;
  const formattedBalanceIncome = formatCurrency(totalIncome);
  const formattedBalanceExpenses = formatCurrency(totalExpenses);
  const formattedBalanceFinal = formatCurrency(totalIncome - totalExpenses);

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
                id="demo-simple-select-month"
                value={month}
                label="Month"
                onChange={handleChangeMonth}
              >
                {[
                  { value: "1", label: "January" },
                  { value: "2", label: "February" },
                  { value: "3", label: "March" },
                  { value: "4", label: "April" },
                  { value: "5", label: "May" },
                  { value: "6", label: "June" },
                  { value: "7", label: "July" },
                  { value: "8", label: "August" },
                  { value: "9", label: "September" },
                  { value: "10", label: "October" },
                  { value: "11", label: "November" },
                  { value: "12", label: "December" },
                ].map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <MovementsPie year={year} month={month} isDataEmpty={isDataEmpty} />

          <MovementsChart dataGraph={chartData} isDataEmpty={isDataEmpty} />

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
