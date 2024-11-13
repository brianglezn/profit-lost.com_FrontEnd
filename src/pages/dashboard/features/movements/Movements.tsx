import { useState, useEffect, useCallback } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';

import { getAllMovements } from '../../../../api/movements/getAllMovements';
import { getMovementsByYearAndMonth } from '../../../../api/movements/getMovementsByYearAndMonth';
import { getAllCategories } from '../../../../api/categories/getAllCategories';
import { formatCurrency, useMonthOptions } from '../../../../helpers/functions';
import type { Movements, Category } from '../../../../helpers/types';

import MovementsPie from './components/MovementsPie';
import MovementsChart from './components/MovementsChart';
import MovementsTable from './components/MovementsTable';
import FormMovementsAdd from './components/FormMovementsAdd';
import DownloadIcon from '../../../../components/icons/DownloadIcon';
import UploadIcon from '../../../../components/icons/UploadIcon';
import PigCoinIcon from '../../../../components/icons/PigCoinIcon';

import './Movements.scss';

export default function Movements() {
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [dataGraph, setDataGraph] = useState<Movements[]>([]);
  const [yearsWithData, setYearsWithData] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const { t, i18n } = useTranslation();

  // Function to fetch movements and category data
  const fetchMovementsData = useCallback(async (token: string) => {
    if (!token) return;
    try {
      setIsDataLoading(true);
      const [movementsData, categoriesData] = await Promise.all([
        getAllMovements(token),
        getAllCategories(token),
      ]);

      setCategories(categoriesData);

      const years = new Set<string>(movementsData.map((m: Movements) => new Date(m.date).getFullYear().toString()));
      setYearsWithData(Array.from(years).sort((a, b) => Number(b) - Number(a)));

      const movementsFiltered = await getMovementsByYearAndMonth(token, year, month);
      movementsFiltered.sort((a: Movements, b: Movements) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setDataGraph(movementsFiltered);
    } catch (error) {
      console.error('Error fetching movements data:', error);
    } finally {
      setIsDataLoading(false);
    }
  }, [year, month]);

  // Effect to fetch data when the component mounts or year/month changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchMovementsData(token);
    }
  }, [fetchMovementsData]);

  // Function to reload data manually
  const reloadData = async () => {
    const token = localStorage.getItem('token');
    if (token) await fetchMovementsData(token);
  };

  const isDataEmpty = dataGraph.length === 0;

  // Function to calculate income and expenses totals per category
  const calculateCategoryTotals = (movements: Movements[]) => {
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
  const formattedBalanceIncome = formatCurrency(totalIncome, i18n.language);
  const formattedBalanceExpenses = formatCurrency(totalExpenses, i18n.language);
  const formattedBalanceFinal = formatCurrency(totalIncome - totalExpenses, i18n.language);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const monthOptions = useMonthOptions();

  return (
    <section className='movements'>
      <div className='movements__main'>
        <div className='movements__main-selector'>
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
          />
        </div>
        <div className='movements__charts-container'>
          <div className='movements__pie-category'>
            <MovementsPie data={incomeData} categories={categories} isLoading={isDataLoading} />
          </div>
          <div className='movements__pie-category'>
            <MovementsPie data={expensesData} categories={categories} isLoading={isDataLoading} />
          </div>
          <div className='movements__chart'>
            <MovementsChart dataGraph={chartData} isDataEmpty={isDataEmpty} />
          </div>
        </div>
        <div className='movements__main-balance'>
          <div className='movements__balance income'>
            <DownloadIcon />
            <p>{formattedBalanceIncome}</p>
          </div>
          <div className='movements__balance expenses'>
            <UploadIcon />
            <p>-{formattedBalanceExpenses}</p>
          </div>
          <div className='movements__balance edbita'>
            <PigCoinIcon className={`no-select ${parseFloat(formattedBalanceFinal) < 0 ? 'negative' : 'positive'}`} />
            <p>{formattedBalanceFinal}</p>
          </div>
        </div>
      </div>

      <div className='movements__data'>
        <div className='movements__data-text'>
          <p>{t('dashboard.movements.header')}</p>
          <Button label={t('dashboard.movements.form_movements_add.header')} size='small' onClick={handleOpenModal} />
          <Sidebar
            visible={open}
            onHide={handleCloseModal}
            position='right'
            style={{ width: '500px' }}
            className='custom_sidebar'
            modal>
            <FormMovementsAdd onMovementAdded={reloadData} onClose={handleCloseModal} selectedYear={year} selectedMonth={month} />
          </Sidebar>
        </div>
        <MovementsTable
          data={dataGraph}
          isDataEmpty={isDataEmpty}
          reloadData={reloadData}
          categories={categories}
        />
      </div>
    </section>
  );
}
