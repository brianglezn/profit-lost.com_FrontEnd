import { useState, useEffect, useCallback } from "react";
import { Dropdown } from "primereact/dropdown";
import { Sidebar } from 'primereact/sidebar';

import { getAllMovements } from '../../api/movements/getAllMovements';
import { getMovementsByYearAndMonth } from '../../api/movements/getMovementsByYearAndMonth';

import { formatCurrency } from "../../helpers/functions";
import { monthOptions } from "../../helpers/constants";

import "./Movements.scss";
import MovementsPie from "../../components/dashboard/movements/MovementsPie";
import MovementsChart from "../../components/dashboard/movements/MovementsChart";
import MovementsTable from "../../components/dashboard/movements/MovementsTable";
import FormMovementsAdd from "../../components/dashboard/movements/FormMovementsAdd";
import DownloadIcon from "../../components/icons/DownloadIcon";
import UploadIcon from "../../components/icons/UploadIcon";
import PigCoinIcon from "../../components/icons/PigCoinIcon";
import PlusIcon from "../../components/icons/PlusIcon";

interface Movement {
  _id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

function Movements() {
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [dataGraph, setDataGraph] = useState<Movement[]>([]);
  const [yearsWithData, setYearsWithData] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const fetchMovementsData = useCallback(async (token: string) => {
    if (!token) return;
    try {
      const movementsData = await getAllMovements(token);
      const years = new Set<string>(movementsData.map((m: Movement) => new Date(m.date).getFullYear().toString()));
      setYearsWithData(Array.from(years).sort((a, b) => Number(b) - Number(a)));

      const movementsFiltered = await getMovementsByYearAndMonth(token, year, month);
      movementsFiltered.sort((a: Movement, b: Movement) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setDataGraph(movementsFiltered);
    } catch (error) {
      console.error('Error fetching movements data:', error);
    }
  }, [year, month]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchMovementsData(token);
    }
  }, [fetchMovementsData]);

  const reloadData = async () => {
    const token = localStorage.getItem('token');
    if (token) await fetchMovementsData(token);
  };

  const isDataEmpty = dataGraph.length === 0;

  const calculateCategoryTotals = (movements: Movement[]) => {
    const income: { [key: string]: number } = {};
    const expenses: { [key: string]: number } = {};

    movements.forEach(({ category, amount }) => {
      if (amount > 0) {
        income[category] = (income[category] || 0) + amount;
      } else {
        expenses[category] = (expenses[category] || 0) + Math.abs(amount);
      }
    });

    const incomeData = Object.entries(income).map(([name, value]) => ({ name, value }));
    const expensesData = Object.entries(expenses).map(([name, value]) => ({ name, value }));

    return { incomeData, expensesData };
  };

  const { incomeData, expensesData } = calculateCategoryTotals(dataGraph);

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

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  return (
    <section className="movements">
      <div className="movements__main">
        <div className="movements__main-selector">
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
            // style={{ maxHeight: 'none' }}
          />
        </div>
        <div className="movements__charts-container">
          <MovementsPie data={incomeData} />
          <MovementsPie data={expensesData} />
          <MovementsChart dataGraph={chartData} isDataEmpty={isDataEmpty} />
        </div>
        <div className="movements__main-balance">
          <div className="movements__balance income">
            <DownloadIcon />
            <p>{formattedBalanceIncome}</p>
          </div>
          <div className="movements__balance expenses">
            <UploadIcon />
            <p>-{formattedBalanceExpenses}</p>
          </div>
          <div className="movements__balance edbita">
            <PigCoinIcon className={`no-select ${parseFloat(formattedBalanceFinal) < 0
              ? "negative"
              : "positive"
              }`} />
            <p>{formattedBalanceFinal}</p>
          </div>
        </div>
      </div>

      <div className="movements__data">
        <div className="movements__data-text">
          <p>Movements</p>
          <PlusIcon onClick={handleOpenModal} />
          <Sidebar
            visible={open}
            onHide={handleCloseModal}
            position="right"
            style={{ width: '450px' }}
            className="custom_sidebar"
            modal>
            <FormMovementsAdd onMovementAdded={reloadData} onClose={handleCloseModal} selectedYear={year} selectedMonth={month} />
          </Sidebar>
        </div>
        <MovementsTable data={dataGraph} isDataEmpty={isDataEmpty} reloadData={reloadData} />
      </div>
    </section>
  );
}

export default Movements;
