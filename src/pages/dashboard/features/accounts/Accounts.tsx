import { useEffect, useState, useMemo, useCallback } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { ProgressBar } from 'primereact/progressbar';
import { Sidebar } from 'primereact/sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'primereact/skeleton';

import { getAllAccounts } from '../../../../api/accounts/getAllAccounts';
import updateAccountsOrder from '../../../../api/accounts/updateAccountsOrder';
import { getUserByToken } from '../../../../api/users/getUserByToken';
import { formatCurrency } from '../../../../helpers/functions';

import AccountItem from './components/AccountItem';
import FormAccountsAdd from './components/FormAccountsAdd';
import FormAccountsEdit from './components/FormAccountsEdit';
import CustomBarShape from '../../../../components/CustomBarShape';

import './Accounts.scss';

type AccountConfiguration = {
  backgroundColor: string;
  color: string;
};

type AccountRecord = {
  year: number;
  month: string;
  value: number;
};

type DataAccount = {
  accountName: string;
  records: AccountRecord[];
  configuration: AccountConfiguration;
  AccountId: string;
};

type MonthData = {
  name: string;
  [key: string]: number | string;
};

const monthNamesShort = [
  { name: 'Jan', value: 'Jan' },
  { name: 'Feb', value: 'Feb' },
  { name: 'Mar', value: 'Mar' },
  { name: 'Apr', value: 'Apr' },
  { name: 'May', value: 'May' },
  { name: 'Jun', value: 'Jun' },
  { name: 'Jul', value: 'Jul' },
  { name: 'Aug', value: 'Aug' },
  { name: 'Sep', value: 'Sep' },
  { name: 'Oct', value: 'Oct' },
  { name: 'Nov', value: 'Nov' },
  { name: 'Dec', value: 'Dec' }
];

export default function Accounts() {
  const currentDate = new Date();
  const currentYear: number = currentDate.getFullYear();
  const currentMonthName: string = monthNamesShort[currentDate.getMonth()].value;

  const { t, i18n } = useTranslation();

  // State variables to store the relevant data and manage sidebars
  const [uniqueYears, setUniqueYears] = useState<number[]>([]);
  const [year, setYear] = useState(currentYear.toString());
  const [dataAccounts, setDataAccounts] = useState<DataAccount[]>([]);
  const [addSidebarOpen, setAddSidebarOpen] = useState(false);
  const [editSidebarOpen, setEditSidebarOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<DataAccount | null>(null);
  const [draggedAccountId, setDraggedAccountId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch all data (accounts and user details)
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      console.error(t('common.error_token'));
      setIsLoading(false);
      return;
    }
    try {
      const allAccountsData = await getAllAccounts(token);
      const user = await getUserByToken(token);

      let orderedAccounts: DataAccount[] = [];
      let unOrderedAccounts: DataAccount[] = [];

      // Check if user has accountsOrder
      if (user.accountsOrder && user.accountsOrder.length > 0) {
        // Map through accountsOrder to filter and sort accounts
        orderedAccounts = user.accountsOrder.map((accountId: string) =>
          allAccountsData.find(account => account.AccountId === accountId)
        ).filter(Boolean) as DataAccount[];

        // Get accounts that are not included in accountsOrder
        unOrderedAccounts = allAccountsData.filter(account =>
          !user.accountsOrder.includes(account.AccountId)
        );
      } else {
        // If no accountsOrder, show all accounts without any order
        orderedAccounts = allAccountsData;
      }

      // Set state with the ordered accounts followed by unordered ones
      setDataAccounts([...orderedAccounts, ...unOrderedAccounts]);

      // Extract unique years from the accounts data
      const years = new Set<number>();
      allAccountsData.forEach((account: DataAccount) =>
        account.records.forEach((record: AccountRecord) => years.add(record.year))
      );
      setUniqueYears(Array.from(years).sort((a, b) => a - b));
    } catch (error) {
      console.error('Error fetching all accounts data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  // Fetch data when the component mounts or the year changes
  useEffect(() => {
    fetchAllData();
  }, [year, fetchAllData]);

  // Prepare data for the chart using useMemo to optimize performance
  const chartData = useMemo(() => {
    return monthNamesShort.map(month => {
      const monthData: MonthData = {
        name: i18n.language === 'es' ? t(`dashboard.common.months.${month.value.toLowerCase()}`) : month.name
      };

      // Calculate the total value for each month for each account
      dataAccounts.forEach((account: DataAccount) => {
        const totalForMonthAndAccount = account.records
          .filter((record: AccountRecord) => record.year === parseInt(year) && record.month === month.value)
          .reduce((sum, { value }) => sum + value, 0);

        if (totalForMonthAndAccount > 0) {
          monthData[account.accountName] = totalForMonthAndAccount;
        }
      });

      // Append the total for the month to the name
      const totalForMonth = Object.keys(monthData).reduce((acc, key) => {
        if (key !== 'name' && typeof monthData[key] === 'number') {
          acc += monthData[key] as number;
        }
        return acc;
      }, 0);

      monthData.name += `: ${formatCurrency(totalForMonth, i18n.language)}`;

      return monthData;
    });
  }, [dataAccounts, year, i18n.language, t]);

  // Determine if the chart data is empty
  const isChartDataEmpty = useMemo(() => {
    return chartData.every(data => Object.keys(data).length === 1);
  }, [chartData]);

  // Function to handle opening the edit sidebar
  const handleOpenEditSidebar = useCallback((accountId: string) => {
    const account = dataAccounts.find((acc) => acc.AccountId === accountId) || null;
    setSelectedAccount(account);
    setEditSidebarOpen(true);
  }, [dataAccounts]);

  // Prepare account items for display, using useMemo to optimize rendering
  const accountItems = useMemo(() => {
    return dataAccounts.map((account: DataAccount) => {
      const balanceForMonth = account.records
        .filter((record: AccountRecord) => record.year === parseInt(year) && record.month === currentMonthName)
        .reduce((sum, record) => sum + record.value, 0);

      // Handlers for drag-and-drop functionality
      const handleDragStart = () => {
        setDraggedAccountId(account.AccountId);
      };

      const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
      };

      const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (draggedAccountId !== null && draggedAccountId !== account.AccountId) {
          const draggedAccountIndex = dataAccounts.findIndex(acc => acc.AccountId === draggedAccountId);
          const targetAccountIndex = dataAccounts.findIndex(acc => acc.AccountId === account.AccountId);
          const updatedAccounts = [...dataAccounts];
          const [draggedAccount] = updatedAccounts.splice(draggedAccountIndex, 1);
          updatedAccounts.splice(targetAccountIndex, 0, draggedAccount);
          setDataAccounts(updatedAccounts);

          await updateAccountsOrder(updatedAccounts.map(acc => acc.AccountId));
        }
      };

      return (
        <AccountItem
          key={account.AccountId}
          accountName={account.accountName}
          balance={`${formatCurrency(balanceForMonth, i18n.language)}`}
          customBackgroundColor={account.configuration.backgroundColor}
          customColor={account.configuration.color}
          accountId={account.AccountId}
          onClick={handleOpenEditSidebar}
          draggable
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      );
    });
  }, [dataAccounts, year, currentMonthName, handleOpenEditSidebar, draggedAccountId, i18n.language]);

  // Handlers to open and close the add sidebar
  const handleOpenAddSidebar = () => setAddSidebarOpen(true);
  const handleCloseAddSidebar = () => setAddSidebarOpen(false);

  // Handlers to close the edit sidebar
  const handleCloseEditSidebar = () => setEditSidebarOpen(false);

  // Handlers for when an account is updated or removed
  const handleAccountUpdated = () => {
    fetchAllData();
    handleCloseEditSidebar();
  };
  const handleAccountRemoved = () => {
    fetchAllData();
    handleCloseEditSidebar();
  };

  return (
    <>
      <section className='accounts'>
        <div className='accounts__main'>
          <Dropdown
            value={year}
            options={uniqueYears.slice().reverse().map(year => ({ label: year.toString(), value: year }))}
            onChange={(e) => setYear(e.value)}
            placeholder={year}
          />
          <div className='accounts__main-chart'>
            {!isChartDataEmpty ? (
              <ResponsiveContainer width='100%' height={300}>
                <BarChart
                  width={500}
                  height={300}
                  data={chartData}
                  margin={{ top: 10, right: 50, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  {dataAccounts.map((account: DataAccount) => (
                    <Bar
                      key={account.accountName}
                      dataKey={account.accountName}
                      stackId='a'
                      fill={account.configuration.backgroundColor}
                      shape={<CustomBarShape />}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton width="100%" height="100%" borderRadius="8px" />
            )}
          </div>
        </div>
        <div className='accounts__container'>
          <div className='accounts__container-text'>
            <p>{t('dashboard.accounts.title')}</p>
            <Button label={t('dashboard.accounts.account_item.add')} size='small' onClick={handleOpenAddSidebar} />
            <Sidebar
              visible={addSidebarOpen}
              onHide={handleCloseAddSidebar}
              position='right'
              style={{ width: '500px' }}
              className='custom-sidebar'
            >
              <FormAccountsAdd onAccountAdded={() => { fetchAllData(); handleCloseAddSidebar(); }} />
            </Sidebar>
          </div>
          {isLoading || dataAccounts.length === 0 ? (
            <div className='accounts__container-progress'>
              <ProgressBar mode='indeterminate' style={{ height: '6px' }} />
            </div>
          ) : (
            <div className='accounts__container-items'>{accountItems}</div>
          )}

        </div>
      </section>
      <Sidebar
        visible={editSidebarOpen}
        onHide={handleCloseEditSidebar}
        position='right'
        style={{ width: '500px' }}
        className='custom-sidebar'
      >
        {selectedAccount && (
          <FormAccountsEdit
            account={selectedAccount}
            onUpdate={handleAccountUpdated}
            onClose={handleCloseEditSidebar}
            onRemove={handleAccountRemoved}
          />
        )}
      </Sidebar>
    </>
  );
}