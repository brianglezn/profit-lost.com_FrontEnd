import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getMovementsByYear } from '../../../../api/movements/getMovementsByYear';
import { Movements } from '../../../../helpers/types';

import HomeBalanceChart from './components/HomeBalanceChart';
import HomeMovementsHistory from './components/HomeMovementsHistory';
import HomeBalances from './components/HomeBalances';

import './DashHome.scss';

export default function DashHome() {
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [ebitda, setEbitda] = useState<number>(0);
  const [incomePercentage, setIncomePercentage] = useState<number>(0);
  const [expensesPercentage, setExpensesPercentage] = useState<number>(0);
  const [ebitdaPercentage, setEbitdaPercentage] = useState<number>(0);
  const [movements, setMovements] = useState<Movements[]>([]);
  const [isDataEmpty, setIsDataEmpty] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token') || '';
        const currentDate = new Date();
        const endOfDay = new Date(currentDate);
        endOfDay.setHours(23, 59, 59, 999);

        const currentYear = currentDate.getFullYear().toString();
        const previousYear = (currentDate.getFullYear() - 1).toString();

        // Obtener movimientos de ambos años
        const [currentYearMovements, previousYearMovements] = await Promise.all([
          getMovementsByYear(token, currentYear),
          getMovementsByYear(token, previousYear)
        ]);

        // Combinar los movimientos de ambos años
        const allMovements = [...currentYearMovements, ...previousYearMovements];

        if (allMovements.length === 0) {
          setIsDataEmpty(true);
          setIsLoading(false);
          return;
        }
        setIsDataEmpty(false);

        // Calcular la fecha límite de 6 meses atrás
        const sixMonthsAgo = new Date(currentDate);
        sixMonthsAgo.setMonth(currentDate.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        // Filtrar movimientos para incluir solo los últimos 6 meses
        const filteredMovements = allMovements.filter(mov => {
          const movDate = new Date(mov.date);
          return movDate >= sixMonthsAgo && movDate <= endOfDay;
        });

        // Ordenar movimientos por fecha
        const sortedMovements = filteredMovements.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setMovements(sortedMovements);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (movements.length === 0) return;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Determinar el año y mes anterior
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Filter movements for the current month
    const movementsCurrentMonth = movements.filter((mov) => {
        const movDate = new Date(mov.date);
        return movDate.getFullYear() === currentYear && 
               movDate.getMonth() + 1 === currentMonth;
    });

    // Filter movements for the previous month, considering year change
    const movementsPreviousMonth = movements.filter((mov) => {
        const movDate = new Date(mov.date);
        return movDate.getFullYear() === previousYear && 
               movDate.getMonth() + 1 === previousMonth;
    });

    // Calculate totals for current month
    const totalIncomeCurrent = movementsCurrentMonth
        .filter((mov) => mov.amount > 0)
        .reduce((sum, mov) => sum + mov.amount, 0);

    // Calculate total expenses for the current month
    const totalExpensesCurrent = movementsCurrentMonth
        .filter((mov) => mov.amount < 0)
        .reduce((sum, mov) => sum + Math.abs(mov.amount), 0);

    // Calculate EBITDA for the current month
    const ebitdaCurrent = totalIncomeCurrent - totalExpensesCurrent;

    // Calculate totals for previous month
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

    // Calculate percentage changes
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
    <section className='dashHome'>
      <div className='balances'>
        <HomeBalances type='income' amount={isLoading ? null : income} percentage={isLoading ? null : incomePercentage} />
        <HomeBalances type='expenses' amount={isLoading ? null : expenses} percentage={isLoading ? null : expensesPercentage} />
        <HomeBalances type='ebitda' amount={isLoading ? null : ebitda} percentage={isLoading ? null : ebitdaPercentage} />
      </div>

      <div className='chart'>
        <div className='chart-container'>
          <div className='header-container'>
            <span>{t('dashboard.dashhome.home_balance_chart.header')}</span>
          </div>
          <HomeBalanceChart 
            movements={movements} 
            isLoading={isLoading} 
          />
        </div>
      </div>

      <div className='history'>
        <div className='history-container'>
          <div className='header-container'>
            <span>{t('dashboard.dashhome.home_movements_history.header')}</span>
          </div>
          <HomeMovementsHistory data={movements} isDataEmpty={isDataEmpty} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
}
