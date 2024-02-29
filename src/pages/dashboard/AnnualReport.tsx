import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box, Modal } from "@mui/material";

import "./AnnualReport.css";

import AnnualChart from "../../components/dashboard/AnnualChart";
import AnnualMovements from "../../components/dashboard/AnnualMovements";
import FormCategory from "../../components/dashboard/FormCategory";

interface Movement {
  date: string;
  description: string;
  amount: number;
  category: string;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    useGrouping: true,
  });
}

function AnnualReport() {
  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState(currentYear);
  const [yearsWithData, setYearsWithData] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchYearsWithData = async () => {
      try {
        const response = await fetch(`https://profit-lost-backend.onrender.com/movements/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const dataMovements: Movement[] = await response.json();

        const years = new Set(dataMovements.map((item: Movement) => {
          return new Date(item.date).getFullYear().toString();
        }));

        setYearsWithData([...years].sort((a, b) => Number(b) - Number(a)));
      } catch (error) {
        console.error('Error fetching years data:', error);
      }
    };

    fetchYearsWithData();
  }, []);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setYear(event.target.value);
  };

  const [balanceIncome, setBalanceIncome] = useState(0);
  const [balanceExpenses, setBalanceExpenses] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    const fetchData = async () => {
      try {
        const response = await fetch(`https://profit-lost-backend.onrender.com/movements/${year}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const dataMovements: Movement[] = await response.json();
  
        const { income, expenses } = dataMovements.reduce((acc, transaction) => {
          if (transaction.amount > 0) acc.income += transaction.amount;
          else acc.expenses += transaction.amount;
          return acc;
        }, { income: 0, expenses: 0 });
  
        setBalanceIncome(income);
        setBalanceExpenses(Math.abs(expenses));
      } catch (error) {
        console.error('Error fetching transactions data:', error);
      }
    };
  
    fetchData();
  }, [year]);
  

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
        </div >
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
