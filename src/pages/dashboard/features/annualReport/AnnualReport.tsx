import { useState, useEffect, useCallback } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { useTranslation } from 'react-i18next';

import { getAllMovements } from '../../../../api/movements/getAllMovements';
import { getMovementsByYear } from '../../../../api/movements/getMovementsByYear';
import { getUserByToken } from '../../../../api/users/getUserByToken';
import { formatCurrency } from '../../../../helpers/functions';
import { Movements, User } from '../../../../helpers/types';

import AnnualChart from './components/AnnualChart';
import AnnualCategories from './components/AnnualCategories';
import FormCategoryAdd from './components/FormCategoryAdd';
import DownloadIcon from '../../../../components/icons/DownloadIcon';
import UploadIcon from '../../../../components/icons/UploadIcon';
import PigCoinIcon from '../../../../components/icons/PigCoinIcon';

import './AnnualReport.scss';

interface BalanceDisplayProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value: string;
  className: string;
}

export default function AnnualReport() {
  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState(currentYear);
  const [yearsWithData, setYearsWithData] = useState<string[]>([]);
  const [balanceIncome, setBalanceIncome] = useState(0);
  const [balanceExpenses, setBalanceExpenses] = useState(0);
  const [open, setOpen] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [userCurrency, setUserCurrency] = useState<string>('USD');

  const { t } = useTranslation();

  const reloadCategories = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found. Please log in.');
      return;
    }

    try {
      const dataMovements: Movements[] = await getAllMovements(token);
      const user: User = await getUserByToken(token);
      setUserCurrency(user.currency || 'USD');
      
      const years = new Set(dataMovements.map(item => new Date(item.date).getFullYear().toString()));
      setYearsWithData([...years].sort((a, b) => Number(b) - Number(a)));
    } catch (error) {
      console.error('Error fetching years data:', error);
    }

    setReloadFlag(prevFlag => !prevFlag);
  }, []);

  useEffect(() => {
    reloadCategories();
  }, [reloadCategories]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      if (!token) {
        console.error('No authentication token found. Please log in.');
        return;
      }

      try {
        const dataMovements: Movements[] = await getMovementsByYear(token, year);
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

  const formattedBalanceIncome = formatCurrency(balanceIncome, userCurrency);
  const formattedBalanceExpenses = formatCurrency(balanceExpenses, userCurrency);
  const formattedBalanceFinal = formatCurrency(balanceIncome - balanceExpenses, userCurrency);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ icon: Icon, value, className }) => (
    <div className={`annualReport__balance ${className}`}>
      <Icon className={parseFloat(value.replace(/[^\d.-]/g, '')) < 0 ? 'negative' : 'positive'} />
      <p>{value}</p>
    </div>
  );

  return (
    <section className='annualReport'>
      <div className='annualReport__main'>
        <div className='annualReport__main-year'>
          <Dropdown
            value={year}
            options={yearsWithData.map(year => ({ label: year, value: year }))}
            onChange={(e) => {
              setYear(e.value);
            }}
            placeholder={year}
            className='w-full'
          />
        </div>
        <div className='annual__chart'>
          <AnnualChart year={year} />
        </div>
        <div className='annualReport__main-balance'>
          <BalanceDisplay icon={DownloadIcon} value={formattedBalanceIncome} className='income' />
          <BalanceDisplay icon={UploadIcon} value={formattedBalanceExpenses} className='expenses' />
          <BalanceDisplay icon={PigCoinIcon} value={formattedBalanceFinal} className='edbita' />
        </div>
      </div>

      <div className='annualReport__categories'>
        <div className='annualReport__categories-text'>
          <p>{t('dashboard.annual_report.categories')}</p>
          <Button label={t('dashboard.annual_report.add_category')} size='small' onClick={handleOpenModal} />

          <Sidebar
            visible={open}
            position='right'
            onHide={handleCloseModal}
            style={{ width: '500px' }}
            className='custom_sidebar'
          >
            <FormCategoryAdd onCategoryAdded={reloadCategories} onClose={handleCloseModal} />
          </Sidebar>
        </div>

        <AnnualCategories year={year} reloadFlag={reloadFlag} />
      </div>
    </section>
  );
}
