import React, { useEffect, useState, useMemo } from "react";
import { FormControl, Select, MenuItem, SelectChangeEvent, InputLabel, Modal, Box, } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from "recharts";

import "./Accounts.css";
import AccountItem from "../../components/dashboard/AccountItem.tsx";
import FormAccounts from "../../components/dashboard/FormAccounts.tsx";

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

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


function Accounts() {
  const currentDate = new Date();
  const currentYear: number = currentDate.getFullYear();
  const currentMonthName: string = monthNames[currentDate.getMonth()];
  const currentFullMonthName: string = fullMonthNames[currentDate.getMonth()];
  const [uniqueYears, setUniqueYears] = useState<number[]>([]);
  const [year, setYear] = React.useState(currentYear.toString());
  const [dataAccounts, setDataAccounts] = useState<DataAccount[]>([]);

  const handleChange = (event: SelectChangeEvent) => {
    setYear(event.target.value as string);
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchAllData = async () => {
        try {
            const response = await fetch(`https://profit-lost-backend.onrender.com/accounts/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const allAccountsData: DataAccount[] = await response.json();

            setDataAccounts(allAccountsData);

            const years = new Set<number>();
            allAccountsData.forEach(account => account.records.forEach(record => years.add(record.year)));
            setUniqueYears(Array.from(years).sort((a, b) => a - b));
        } catch (error) {
            console.error('Error fetching all accounts data:', error);
        }
    };

    fetchAllData();
}, [year]);

  const chartData = useMemo(() => {
    return monthNames.map(month => {
      const monthData: { name: string;[key: string]: any } = {
        name: month,
      };

      dataAccounts.forEach(account => {
        const totalForMonthAndAccount = account.records
          .filter(record => record.year === parseInt(year) && record.month === month)
          .reduce((sum, { value }) => sum + value, 0);

        if (totalForMonthAndAccount > 0) {
          monthData[account.accountName] = totalForMonthAndAccount;
        }
      });

      const totalForMonth = Object.keys(monthData).reduce((acc, key) => {
        if (key !== 'name') acc += monthData[key];
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

  const accountItems = useMemo(() => {
    return dataAccounts.map((account, index) => {
      const balanceForMonth = account.records
        .filter(record => record.year === parseInt(year) && record.month === currentMonthName)
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
        />
      );
    });
  }, [dataAccounts, year, currentMonthName]);

  // Modal
  const styleBox = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "var(--color-bg)",
    boxShadow: 15,
    p: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px"
  };

  const [open, setOpen] = React.useState(false);
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const backdropStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(4px)',
  };

  return (
    <>
      <section className="accounts">
        <div className="movements__containerMain">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Year</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={year}
              label="Year"
              onChange={handleChange}
            >
              {uniqueYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="accounts__main">
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
                {dataAccounts.map((account) => (
                  <Bar
                    key={account.accountName}
                    dataKey={account.accountName}
                    stackId="a"
                    fill={account.configuration.backgroundColor}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
        <div className="accounts__containerAccounts">
          <div className="accounts__accounts-text">
            <p>Accounts</p>
            <span className="material-symbols-rounded no-select" onClick={handleOpenModal}>new_window</span>
            <Modal
              open={open}
              onClose={handleCloseModal}
              componentsProps={{
                backdrop: {
                  style: backdropStyle,
                },
              }}>
              <Box sx={styleBox}>
                <FormAccounts onClose={handleCloseModal} />
              </Box>
            </Modal>
          </div>
          <div className="accounts__accounts-container">{accountItems}</div>
        </div>
      </section>
    </>
  );
}

export default Accounts;
