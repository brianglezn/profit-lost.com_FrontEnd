import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getMovementsByYear } from '../../../../api/movements/getMovementsByYear';
import { Movements } from '../../../../helpers/types';

import HomeBalanceChart from './components/HomeBalanceChart';
import HomeMovementsHistory from './components/HomeMovementsHistory';
import HomeBalances from './components/HomeBalances';

import './DashHome.scss';

interface BalanceData {
  income: number;
  expenses: number;
  ebitda: number;
}

interface BalancePercentages {
  income: number;
  expenses: number;
  ebitda: number;
}

export default function DashHome() {
  const [movements, setMovements] = useState<Movements[]>([]);
  const [isDataEmpty, setIsDataEmpty] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [balances, setBalances] = useState<BalanceData>({
    income: 0,
    expenses: 0,
    ebitda: 0
  });
  const [percentages, setPercentages] = useState<BalancePercentages>({
    income: 0,
    expenses: 0,
    ebitda: 0
  });
  const { t } = useTranslation();

  // Function to obtain the movements of the last 6 months
  const getFilteredMovements = (allMovements: Movements[], currentDate: Date, endOfDay: Date) => {
    const sixMonthsAgo = new Date(currentDate);
    sixMonthsAgo.setMonth(currentDate.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    return allMovements
      .filter(mov => {
        const movDate = new Date(mov.date);
        return movDate >= sixMonthsAgo && movDate <= endOfDay;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Function for calculating monthly totals
  const calculateMonthlyTotals = (monthlyMovements: Movements[]): BalanceData => {
    const income = monthlyMovements
      .filter(mov => mov.amount > 0)
      .reduce((sum, mov) => sum + mov.amount, 0);

    const expenses = monthlyMovements
      .filter(mov => mov.amount < 0)
      .reduce((sum, mov) => sum + Math.abs(mov.amount), 0);

    return {
      income,
      expenses,
      ebitda: income - expenses
    };
  };

  // Function for calculating percentage changes
  const calculatePercentageChanges = (current: BalanceData, previous: BalanceData): BalancePercentages => {
    const calculateChange = (current: number, previous: number): number => {
      if (previous === 0) return current === 0 ? 0 : 100;
      return ((current - previous) / previous) * 100;
    };

    return {
      income: Number(calculateChange(current.income, previous.income).toFixed(2)),
      expenses: Number(calculateChange(current.expenses, previous.expenses).toFixed(2)),
      ebitda: Number(calculateChange(current.ebitda, previous.ebitda).toFixed(2))
    };
  };

  // Effect for loading initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token') || '';
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        // Determine if we need data from the previous year
        const needsPreviousYear = currentMonth <= 6;

        // Obtain movements for the current year
        const currentYearMovements = await getMovementsByYear(token, currentYear.toString());

        // Obtain previous year's transactions only if necessary
        const previousYearMovements = needsPreviousYear
          ? await getMovementsByYear(token, (currentYear - 1).toString())
          : [];

        const allMovements = [...currentYearMovements, ...previousYearMovements];

        if (allMovements.length === 0) {
          setIsDataEmpty(true);
          return;
        }

        const endOfDay = new Date(currentDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        setIsDataEmpty(false);
        setMovements(getFilteredMovements(allMovements, currentDate, endOfDay));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Effect for calculating balances and percentages
  useEffect(() => {
    if (movements.length === 0) return;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Filter transactions by month
    const currentMonthMovements = movements.filter(mov => {
      const movDate = new Date(mov.date);
      return movDate.getFullYear() === currentYear &&
        movDate.getMonth() + 1 === currentMonth;
    });

    const previousMonthMovements = movements.filter(mov => {
      const movDate = new Date(mov.date);
      return movDate.getFullYear() === previousYear &&
        movDate.getMonth() + 1 === previousMonth;
    });

    // Calculate totals
    const currentTotals = calculateMonthlyTotals(currentMonthMovements);
    const previousTotals = calculateMonthlyTotals(previousMonthMovements);

    // Update statuses
    setBalances(currentTotals);
    setPercentages(calculatePercentageChanges(currentTotals, previousTotals));
  }, [movements]);

  return (
    <section className='dashHome'>
      <div className='balances'>
        <HomeBalances
          type='income'
          amount={isLoading ? null : balances.income}
          percentage={isLoading ? null : percentages.income}
        />
        <HomeBalances
          type='expenses'
          amount={isLoading ? null : balances.expenses}
          percentage={isLoading ? null : percentages.expenses}
        />
        <HomeBalances
          type='ebitda'
          amount={isLoading ? null : balances.ebitda}
          percentage={isLoading ? null : percentages.ebitda}
        />
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
          <HomeMovementsHistory
            data={movements}
            isDataEmpty={isDataEmpty}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  );
}
