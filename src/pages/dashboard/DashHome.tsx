import { useEffect, useState } from "react";
import { getMovementsByYear } from "../../api/movements/getMovementsByYear";
import "./DashHome.scss";
import HomeBalanceChart from "../../components/dashboard/dashhome/HomeBalanceChart";
import MovementsHistoryHome from "../../components/dashboard/dashhome/MovementsHistoryHome";

interface Transaction {
  _id: string;
  description: string;
  date: string;
  category: string;
  amount: number;
}

function DashHome() {
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [ebitda, setEbitda] = useState<number>(0);

  const [incomePercentage, setIncomePercentage] = useState<number>(0);
  const [expensesPercentage, setExpensesPercentage] = useState<number>(0);
  const [ebitdaPercentage, setEbitdaPercentage] = useState<number>(0);

  const [movements, setMovements] = useState<Transaction[]>([]);
  const [isDataEmpty, setIsDataEmpty] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear().toString();
        const currentMonth = currentDate.getMonth() + 1;

        // Obtener movimientos del año actual
        const movements: Transaction[] = await getMovementsByYear(token, currentYear);

        if (movements.length === 0) {
          setIsDataEmpty(true);
          return;
        }
        setIsDataEmpty(false);

        // Filtrar movimientos hasta la fecha actual
        const filteredMovements = movements.filter((mov) => new Date(mov.date) <= currentDate);

        // Ordenar movimientos por fecha descendente
        const sortedMovements = filteredMovements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setMovements(sortedMovements.slice(0, 10)); // Mostrar los últimos 10 movimientos

        // Calcular balance actual
        const movementsCurrentMonth = sortedMovements.filter((mov) => {
          const movDate = new Date(mov.date);
          return movDate.getFullYear() === currentDate.getFullYear() && movDate.getMonth() + 1 === currentMonth;
        });

        const movementsPreviousMonth = sortedMovements.filter((mov) => {
          const movDate = new Date(mov.date);
          return (
            movDate.getFullYear() === currentDate.getFullYear() &&
            movDate.getMonth() + 1 === (currentMonth === 1 ? 12 : currentMonth - 1)
          );
        });

        const totalIncomeCurrent = movementsCurrentMonth
          .filter((mov) => mov.amount > 0)
          .reduce((sum, mov) => sum + mov.amount, 0);
        const totalExpensesCurrent = movementsCurrentMonth
          .filter((mov) => mov.amount < 0)
          .reduce((sum, mov) => sum + Math.abs(mov.amount), 0);
        const ebitdaCurrent = totalIncomeCurrent - totalExpensesCurrent;

        const totalIncomePrevious = movementsPreviousMonth
          .filter((mov) => mov.amount > 0)
          .reduce((sum, mov) => sum + mov.amount, 0);
        const totalExpensesPrevious = movementsPreviousMonth
          .filter((mov) => mov.amount < 0)
          .reduce((sum, mov) => sum + Math.abs(mov.amount), 0);
        const ebitdaPrevious = totalIncomePrevious - totalExpensesPrevious;

        const calculatePercentageChange = (current: number, previous: number): number => {
          if (previous === 0) return current === 0 ? 0 : 100;
          return ((current - previous) / previous) * 100;
        };

        const incomeChange = calculatePercentageChange(totalIncomeCurrent, totalIncomePrevious);
        const expensesChange = calculatePercentageChange(totalExpensesCurrent, totalExpensesPrevious);
        const ebitdaChange = calculatePercentageChange(ebitdaCurrent, ebitdaPrevious);

        setIncome(totalIncomeCurrent);
        setExpenses(totalExpensesCurrent);
        setEbitda(ebitdaCurrent);

        setIncomePercentage(incomeChange);
        setExpensesPercentage(expensesChange);
        setEbitdaPercentage(ebitdaChange);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="dashHome">
      <div className="balances">
        <div>
          <div className="balances-container income">
            <div className="header-container">
              <span>Earnings</span>
            </div>
            <div className="amount">
              <span className="value">{income.toFixed(2)}</span>
              <span className="currency">€</span>
            </div>
            <div className="comparison">
              <span className={`percentage ${incomePercentage >= 0 ? 'positive' : 'negative'}`}>
                {incomePercentage.toFixed(1)}%
              </span> than last month
            </div>
          </div>
        </div>
        <div>
          <div className="balances-container expenses">
            <div className="header-container">
              <span>Spendings</span>
            </div>
            <div className="amount">
              <span className="value">{expenses.toFixed(2)}</span>
              <span className="currency">€</span>
            </div>
            <div className="comparison">
              <span className={`percentage ${expensesPercentage >= 0 ? 'negative' : 'positive'}`}>
                {expensesPercentage.toFixed(1)}%
              </span> than last month
            </div>
          </div>
        </div>
        <div>
          <div className="balances-container ebitda">
            <div className="header-container">
              <span>Savings</span>
            </div>
            <div className="amount">
              <span className="value">{ebitda.toFixed(2)}</span>
              <span className="currency">€</span>
            </div>
            <div className="comparison">
              <span className={`percentage ${ebitdaPercentage >= 0 ? 'positive' : 'negative'}`}>
                {ebitdaPercentage.toFixed(1)}%
              </span> than last month
            </div>
          </div>
        </div>
      </div>

      <div className="history">
        <div className="history-container">
          <div className="header-container">
            <span>Last movements</span>
          </div>
          <MovementsHistoryHome data={movements} isDataEmpty={isDataEmpty} />
        </div>
      </div>

      <div className="chart">
        <div className="chart-container">
          <div className="header-container">
            <span>Last 6 months balances</span>
          </div>
          <HomeBalanceChart />
        </div>
      </div>

      <div className="first">
        <div className="first-container">
          <div className="header-container">
            <span>First</span>
          </div>
        </div>
      </div>

      <div className="second">
        <div className="second-container">
          <div className="header-container">
            <span>Second</span>
          </div>
        </div>
      </div>

      <div className="categories">
        <div className="categories-container">
          <div className="header-container">
            <span>Categories</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashHome;
