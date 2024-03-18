import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from 'primereact/dialog';

import "./Movements.css";

import MovementsChart from "../../components/dashboard/MovementsChart";
import MovementsPie from "../../components/dashboard/MovementsPie";
import MovementsTable from "../../components/dashboard/MovementsTable";
import FormMovementsAdd from "../../components/dashboard/FormMovementsAdd";

interface Movement {
  _id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

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
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [dataGraph, setDataGraph] = useState<Movement[]>([]);
  const [yearsWithData, setYearsWithData] = useState<string[]>([]);

  const fetchYearsWithData = async () => {
    const token = localStorage.getItem('token');
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

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://profit-lost-backend.onrender.com/movements/${year}/${month}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let transactions: Movement[] = await response.json();

      let completos = transactions.filter(a => a.date.length > 7);
      let parciales = transactions.filter(a => a.date.length === 7);

      completos.sort((a, b) => b.date.localeCompare(a.date));

      parciales.sort((a, b) => b.date.localeCompare(a.date));

      const ordenados = completos.concat(parciales);

      setDataGraph(ordenados);
    } catch (error) {
      console.error('Error fetching transactions data:', error);
    }
  };



  useEffect(() => {
    fetchYearsWithData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [year, month]);

  const reloadData = async () => {
    await fetchYearsWithData();
    await fetchData();
  };

  const isDataEmpty = dataGraph.length === 0;

  const chartData = [
    {
      month,
      year: parseInt(year),
      Income: parseFloat(dataGraph.reduce((acc, { amount }) => (amount > 0 ? acc + amount : acc), 0).toFixed(2)),
      Expenses: parseFloat(dataGraph.reduce((acc, { amount }) => (amount < 0 ? acc + Math.abs(amount) : acc), 0).toFixed(2)),
    },
  ];

  const totalIncome = chartData[0].Income;
  const totalExpenses = chartData[0].Expenses;
  const formattedBalanceIncome = formatCurrency(totalIncome);
  const formattedBalanceExpenses = formatCurrency(totalExpenses);
  const formattedBalanceFinal = formatCurrency(totalIncome - totalExpenses);

  const monthOptions = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const [open, setOpen] = React.useState(false);
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  return (
    <>
      <section className="movements">
        <div className="movements__containerMain">
          <div className="movements__containerMain-selector">
            <Dropdown
              value={year}
              options={yearsWithData.map(year => ({ label: year, value: year }))}
              onChange={(e) => setYear(e.value)}
              placeholder={year}
            />
            <Dropdown
              value={month}
              options={monthOptions}
              onChange={(e) => setMonth(e.value)}
              placeholder={month}
              style={{ maxHeight: 'none' }}
            />
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
              <span className="material-symbols-rounded no-select" onClick={handleOpenModal} >new_window</span>
              <Dialog
                visible={open}
                onHide={handleCloseModal}
                style={{ width: '40vw' }}
                header="New movement"
                modal
                draggable={false}>
                <FormMovementsAdd onMovementAdded={reloadData} onClose={handleCloseModal} />
              </Dialog>
            </div>

            <MovementsTable data={dataGraph} isDataEmpty={isDataEmpty} />

          </div>
        </div>
      </section>
    </>
  );
}

export default Movements;
