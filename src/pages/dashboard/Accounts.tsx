import { useEffect, useState, useMemo, useCallback } from "react";
import { Dropdown } from 'primereact/dropdown';
import { Sidebar } from 'primereact/sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import AccountItem from "../../components/dashboard/accounts/AccountItem";
import FormAccountsAdd from "../../components/dashboard/accounts/FormAccountsAdd";
import FormAccountsEdit from "../../components/dashboard/accounts/FormAccountsEdit";
import CustomBarShape from "../../components/CustomBarShape";
import { getAllAccounts } from '../../api/accounts/getAllAccounts';

import "./Accounts.scss";

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

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

  const fetchAllData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found. Please log in.');
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

      monthData.name += `: ${totalForMonth.toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        useGrouping: true,
      })}`;

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
          balance={`${balanceForMonth.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} €`}
          customBackgroundColor={account.configuration.backgroundColor}
          customColor={account.configuration.color}
          accountId={account.AccountId}
          onClick={handleOpenEditSidebar}
        />
      );
    });
    console.log('accountItems:', items);
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
            options={uniqueYears.map(year => ({ label: year.toString(), value: year }))}
            onChange={(e) => setYear(e.value)}
            placeholder={year}
          />
          <div className="accounts__main-chart">
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
          </div>
        </div>
        <div className="accounts__container">
          <div className="accounts__container-text">
            <p>Accounts</p>
            <span className="material-symbols-rounded no-select" onClick={handleOpenAddSidebar}>new_window</span>
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
          <div className="accounts__container-items">{accountItems}</div>
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
