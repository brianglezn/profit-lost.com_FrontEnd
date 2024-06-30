import { useEffect, useState, useMemo, useCallback } from "react";
import { Dropdown } from 'primereact/dropdown';
import { ProgressBar } from "primereact/progressbar";
import { Sidebar } from 'primereact/sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { getAllAccounts } from '../../api/accounts/getAllAccounts';
import { formatCurrency } from '../../helpers/functions';
import { monthNames as monthNamesWithNames } from '../../helpers/constants';

import "./Accounts.scss";
import AccountItem from "../../components/dashboard/accounts/AccountItem";
import FormAccountsAdd from "../../components/dashboard/accounts/FormAccountsAdd";
import FormAccountsEdit from "../../components/dashboard/accounts/FormAccountsEdit";
import CustomBarShape from "../../components/CustomBarShape";
import PlusIcon from "../../components/icons/PlusIcon";
import ChartLineIcon from "../../components/icons/CharLineIcon";

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

const monthNames = monthNamesWithNames.map(month => month.value);

function Accounts() {
  const currentDate = new Date();
  const currentYear: number = currentDate.getFullYear();
  const currentMonthName: string = monthNames[currentDate.getMonth()];
  const [uniqueYears, setUniqueYears] = useState<number[]>([]);
  const [year, setYear] = useState(currentYear.toString());
  const [dataAccounts, setDataAccounts] = useState<DataAccount[]>([]);
  const [addSidebarOpen, setAddSidebarOpen] = useState(false);
  const [editSidebarOpen, setEditSidebarOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<DataAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found. Please log in.');
      setIsLoading(false);
      return;
    }
    try {
      const allAccountsData = await getAllAccounts(token);
      setDataAccounts(allAccountsData);

      const years = new Set<number>();
      allAccountsData.forEach((account: DataAccount) => account.records.forEach((record: AccountRecord) => years.add(record.year)));
      setUniqueYears(Array.from(years).sort((a, b) => a - b));
    } catch (error) {
      console.error('Error fetching all accounts data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [year]);

  const chartData = useMemo(() => {
    return monthNames.map(month => {
      const monthData: MonthData = { name: month };

      dataAccounts.forEach((account: DataAccount) => {
        const totalForMonthAndAccount = account.records
          .filter((record: AccountRecord) => record.year === parseInt(year) && record.month === month)
          .reduce((sum, { value }) => sum + value, 0);

        if (totalForMonthAndAccount > 0) {
          monthData[account.accountName] = totalForMonthAndAccount;
        }
      });

      const totalForMonth = Object.keys(monthData).reduce((acc, key) => {
        if (key !== 'name' && typeof monthData[key] === 'number') {
          acc += monthData[key] as number;
        }
        return acc;
      }, 0);

      monthData.name += `: ${formatCurrency(totalForMonth)}`;

      return monthData;
    });
  }, [dataAccounts, year]);

  const handleOpenEditSidebar = useCallback((accountId: string) => {
    const account = dataAccounts.find((acc) => acc.AccountId === accountId) || null;
    setSelectedAccount(account);
    setEditSidebarOpen(true);
  }, [dataAccounts]);

  const accountItems = useMemo(() => {
    const items = dataAccounts.map((account: DataAccount, index: number) => {
      const balanceForMonth = account.records
        .filter((record: AccountRecord) => record.year === parseInt(year) && record.month === currentMonthName)
        .reduce((sum, record) => sum + record.value, 0);

      return (
        <AccountItem
          key={index}
          accountName={account.accountName}
          balance={`${formatCurrency(balanceForMonth)}`}
          customBackgroundColor={account.configuration.backgroundColor}
          customColor={account.configuration.color}
          accountId={account.AccountId}
          onClick={handleOpenEditSidebar}
        />
      );
    });
    return items;
  }, [dataAccounts, year, currentMonthName, handleOpenEditSidebar]);


  const handleOpenAddSidebar = () => setAddSidebarOpen(true);
  const handleCloseAddSidebar = () => setAddSidebarOpen(false);

  const handleCloseEditSidebar = () => setEditSidebarOpen(false);

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
      <section className="accounts">
        <div className="accounts__main">
          <Dropdown
            value={year}
            options={uniqueYears.slice().reverse().map(year => ({ label: year.toString(), value: year }))}
            onChange={(e) => setYear(e.value)}
            placeholder={year}
          />
          <div className="accounts__main-chart">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width={500}
                  height={300}
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {dataAccounts.map((account: DataAccount) => (
                    <Bar
                      key={account.accountName}
                      dataKey={account.accountName}
                      stackId="a"
                      fill={account.configuration.backgroundColor}
                      shape={<CustomBarShape />}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ChartLineIcon className="custom-icon" />
            )}
          </div>
        </div>
        <div className="accounts__container">
          <div className="accounts__container-text">
            <p>Accounts</p>
            <PlusIcon onClick={handleOpenAddSidebar} />
            <Sidebar
              visible={addSidebarOpen}
              onHide={handleCloseAddSidebar}
              position="right"
              style={{ width: '500px' }}
              className="custom-sidebar"
            >
              <FormAccountsAdd onAccountAdded={() => { fetchAllData(); handleCloseAddSidebar(); }} />
            </Sidebar>
          </div>
          {isLoading ? (
            <div className="accounts__container-progress">
              <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
            </div>
          ) : (
            <div className="accounts__container-items">{accountItems}</div>
          )}

        </div>
      </section>
      <Sidebar
        visible={editSidebarOpen}
        onHide={handleCloseEditSidebar}
        position="right"
        style={{ width: '500px' }}
        className="custom-sidebar"
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

export default Accounts;
