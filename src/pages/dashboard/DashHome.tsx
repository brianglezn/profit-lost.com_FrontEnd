import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

import { formatCurrency } from '../../helpers/functions';
import { getMovementsByYear } from "../../api/movements/getMovementsByYear";

import "./DashHome.scss";
import HomeBalanceChart from "../../components/dashboard/dashhome/HomeBalanceChart";
import MovementsHistoryHome from "../../components/dashboard/dashhome/HomeMovementsHistory";

interface Transaction {
  _id: string;
  description: string;
  date: string;
  category: string;
  amount: number;
}

export default function DashHome() {
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [ebitda, setEbitda] = useState<number>(0);
  const [incomePercentage, setIncomePercentage] = useState<number>(0);
  const [expensesPercentage, setExpensesPercentage] = useState<number>(0);
  const [ebitdaPercentage, setEbitdaPercentage] = useState<number>(0);
  const [movements, setMovements] = useState<Transaction[]>([]);
  const [isDataEmpty, setIsDataEmpty] = useState<boolean>(true);
  
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the authentication token from local storage
        const token = localStorage.getItem("token") || "";
        const currentDate = new Date();
        // Set the end of the current day (23:59:59)
        const endOfDay = new Date(currentDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Get the current year as a string
        const currentYear = currentDate.getFullYear().toString();

        // Fetch movements for the current year
        const movements: Transaction[] = await getMovementsByYear(token, currentYear);

        // If no movements are found, set the data as empty and return
        if (movements.length === 0) {
          setIsDataEmpty(true);
          return;
        }
        setIsDataEmpty(false);

        // Filter movements to include only those up to the end of the current day
        const filteredMovements = movements.filter((mov) => new Date(mov.date) <= endOfDay);

        // Sort movements by date in descending order (most recent first)
        const sortedMovements = filteredMovements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setMovements(sortedMovements);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (movements.length === 0) return;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;

    // Filter movements for the current month
    const movementsCurrentMonth = movements.filter((mov) => {
      const movDate = new Date(mov.date);
      return movDate.getFullYear() === currentDate.getFullYear() && movDate.getMonth() + 1 === currentMonth;
    });

    // Calculate total income for the current month
    const totalIncomeCurrent = movementsCurrentMonth
      .filter((mov) => mov.amount > 0)
      .reduce((sum, mov) => sum + mov.amount, 0);

    // Calculate total expenses for the current month
    const totalExpensesCurrent = movementsCurrentMonth
      .filter((mov) => mov.amount < 0)
      .reduce((sum, mov) => sum + Math.abs(mov.amount), 0);

    // Calculate EBITDA for the current month
    const ebitdaCurrent = totalIncomeCurrent - totalExpensesCurrent;

    // Filter movements for the previous month
    const movementsPreviousMonth = movements.filter((mov) => {
      const movDate = new Date(mov.date);
      return (
        movDate.getFullYear() === currentDate.getFullYear() &&
        movDate.getMonth() + 1 === (currentMonth === 1 ? 12 : currentMonth - 1)
      );
    });

    // Calculate total income for the previous month
    const totalIncomePrevious = movementsPreviousMonth
      .filter((mov) => mov.amount > 0)
      .reduce((sum, mov) => sum + mov.amount, 0);

    // Calculate total expenses for the previous month
    const totalExpensesPrevious = movementsPreviousMonth
      .filter((mov) => mov.amount < 0)
      .reduce((sum, mov) => sum + Math.abs(mov.amount), 0);

    // Calculate EBITDA for the previous month
    const ebitdaPrevious = totalIncomePrevious - totalExpensesPrevious;

    // Function to calculate percentage change between current and previous values
    const calculatePercentageChange = (current: number, previous: number): number => {
      if (previous === 0) return current === 0 ? 0 : 100;
      return ((current - previous) / previous) * 100;
    };

    // Calculate percentage changes for income, expenses, and EBITDA
    const incomeChange = calculatePercentageChange(totalIncomeCurrent, totalIncomePrevious);
    const expensesChange = calculatePercentageChange(totalExpensesCurrent, totalExpensesPrevious);
    const ebitdaChange = calculatePercentageChange(ebitdaCurrent, ebitdaPrevious);

    // Update state with calculated values
    setIncome(Number(totalIncomeCurrent.toFixed(2)));
    setExpenses(Number(totalExpensesCurrent.toFixed(2)));
    setEbitda(Number(ebitdaCurrent.toFixed(2)));

    setIncomePercentage(Number(incomeChange.toFixed(2)));
    setExpensesPercentage(Number(expensesChange.toFixed(2)));
    setEbitdaPercentage(Number(ebitdaChange.toFixed(2)));

  }, [movements]);

  return (
    <section className="dashHome">
      <div className="balances">
        <div>
          <div className="balances-container income">
            <div className="header-container">
              <span>{t('dashboard.dashhome.balances.earnings')}</span>
            </div>
            <div className="amount">
              <span className="value">{formatCurrency(income, i18n.language)}</span>
            </div>
            <div className="comparison">
              <span className={`percentage ${incomePercentage >= 0 ? 'positive' : 'negative'}`}>
                {incomePercentage.toFixed(1)}%
              </span> {t('dashboard.dashhome.balances.comparison')}
            </div>
          </div>
        </div>
        <div>
          <div className="balances-container expenses">
            <div className="header-container">
              <span>{t('dashboard.dashhome.balances.spendings')}</span>
            </div>
            <div className="amount">
              <span className="value">{formatCurrency(expenses, i18n.language)}</span>
            </div>
            <div className="comparison">
              <span className={`percentage ${expensesPercentage >= 0 ? 'negative' : 'positive'}`}>
                {expensesPercentage.toFixed(1)}%
              </span> {t('dashboard.dashhome.balances.comparison')}
            </div>
          </div>
        </div>
        <div>
          <div className="balances-container ebitda">
            <div className="header-container">
              <span>{t('dashboard.dashhome.balances.savings')}</span>
            </div>
            <div className="amount">
              <span className="value">{formatCurrency(ebitda, i18n.language)}</span>
            </div>
            <div className="comparison">
              <span className={`percentage ${ebitdaPercentage >= 0 ? 'positive' : 'negative'}`}>
                {ebitdaPercentage.toFixed(1)}%
              </span> {t('dashboard.dashhome.balances.comparison')}
            </div>
          </div>
        </div>
      </div>

      <div className="chart">
        <div className="chart-container">
          <div className="header-container">
            <span>{t('dashboard.dashhome.home_balance_chart.header')}</span>
          </div>
          <HomeBalanceChart />
        </div>
      </div>

      <div className="history">
        <div className="history-container">
          <div className="header-container">
            <span>{t('dashboard.dashhome.home_movements_history.header')}</span>
          </div>
          <MovementsHistoryHome data={movements} isDataEmpty={isDataEmpty} />
        </div>
      </div>

      {/* <div className="first">
  <div className="first-container">
    <div className="header-container">
      <span>Category + gastos</span>
    </div>
  </div>
</div>

<div className="second">
  <div className="second-container">
    <div className="header-container">
      <span>Category + ingresos</span>
    </div>
  </div>
</div>

<div className="categories">
  <div className="categories-container">
    <div className="header-container">
      <span>Notes</span>
    </div>
  </div>
</div> */}
    </section>
  );
}