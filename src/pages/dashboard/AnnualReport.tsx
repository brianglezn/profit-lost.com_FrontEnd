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

// Definimos los tipos para las transacciones mensuales y la estructura de los datos.
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

// Función para formatear números a formato de moneda.
function formatCurrency(value: number) {
  return value.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    useGrouping: true,
  });
}

function AnnualReport() {
  // Estado para el año actual y la función para actualizarlo.
  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState(currentYear);

  // useMemo para calcular los años con datos disponibles, para evitar recálculos innecesarios.
  const yearsWithData = useMemo(() => {
    return [
      ...new Set(dataMovementsFile.map((item) => Object.keys(item)[0])),
    ].sort((a, b) => Number(b) - Number(a));
  }, []);

  // Función para manejar el cambio de año seleccionado en el menú desplegable.
  const handleChange = (event: SelectChangeEvent<string>) => {
    setYear(event.target.value);
  };

  // Estados para los totales de ingresos y gastos.
  const [balanceIncome, setBalanceIncome] = useState(0);
  const [balanceExpenses, setBalanceExpenses] = useState(0);

  // Calculamos el balance de ingresos y gastos al cargar los datos o cambiar el año.
  useEffect(() => {
    const selectedYearData = dataMovementsFile.find(
      (y) => Object.keys(y)[0] === year.toString()
    ) as DataMovement | unknown;

    // Si no encuentra datos para ese año, termina la ejecución del bloque aquí.
    if (!selectedYearData) return;

    const monthlyData = (selectedYearData as DataMovement)[year];
    let incomeSum = 0;
    let expensesSum = 0;

    // Recorre los objetos mensuales de los datos financieros.
    for (const monthObj of monthlyData) {
      for (const month in monthObj) {
        const transactions = monthObj[month as Month];
        // Si hay transacciones, suma los montos a los acumuladores respectivos.
        if (transactions) {
          for (const movement of transactions) {
            if (movement.Amount > 0) {
              // Si el monto es positivo, lo suma a los ingresos.
              incomeSum += movement.Amount;
            } else {
              // Si el monto es negativo, lo suma a los gastos (después de convertirlo a positivo).
              expensesSum += Math.abs(movement.Amount);
            }
          }
        }
      }
    }

    setBalanceIncome(incomeSum);
    setBalanceExpenses(expensesSum);
  }, [year]);

  // Formatea los balances de ingresos y gastos totales a formato de moneda.
  const formattedBalanceIncome = formatCurrency(balanceIncome);
  const formattedBalanceExpenses = formatCurrency(balanceExpenses);
  const formattedBalanceFinal = formatCurrency(balanceIncome - balanceExpenses);

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
              <span className="material-symbols-rounded">download</span>
              <p>{formattedBalanceIncome}</p>
            </div>
            <div className="annualReport__balance expenses">
              <span className="material-symbols-rounded">upload</span>
              <p>-{formattedBalanceExpenses}</p>
            </div>
            <div className="annualReport__balance edbita">
              <span
                className={`material-symbols-rounded ${parseFloat(formattedBalanceFinal) < 0
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
            <span className="material-symbols-rounded" onClick={handleOpenModal}>new_window</span>
            <Modal open={open} onClose={handleCloseModal}>
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
