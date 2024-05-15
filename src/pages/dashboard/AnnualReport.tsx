import { useState, useEffect, useCallback } from "react";
import { Dropdown } from 'primereact/dropdown';
import { Sidebar } from 'primereact/sidebar';

import AnnualChart from "../../components/dashboard/annual/AnnualChart";
import AnnualMovements from "../../components/dashboard/annual/AnnualMovements";
import FormCategoryAdd from "../../components/dashboard/annual/FormCategoryAdd";

import "./AnnualReport.scss";

interface Movement {
  date: string;
  description: string;
  amount: number;
  category: string;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    useGrouping: true,
  });
}

function AnnualReport() {
  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState(currentYear);
  const [yearsWithData, setYearsWithData] = useState<string[]>([]);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [balanceIncome, setBalanceIncome] = useState(0);
  const [balanceExpenses, setBalanceExpenses] = useState(0);
  const [open, setOpen] = useState(false);

  const reloadCategories = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found. Please log in.');
      return;
    }

    try {
      const response = await fetch(`https://profit-lost-backend.onrender.com/movements/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch');

      const dataMovements: Movement[] = await response.json() as Movement[];
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
      try {
        const response = await fetch(`https://profit-lost-backend.onrender.com/movements/${year}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const dataMovements: Movement[] = await response.json();

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

  const formattedBalanceIncome = formatCurrency(balanceIncome);
  const formattedBalanceExpenses = formatCurrency(balanceExpenses);
  const formattedBalanceFinal = formatCurrency(balanceIncome - balanceExpenses);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  return (
    <section className="annualReport">

      <div className="annualReport__main">
        <div className="annualReport__main-year">
          <Dropdown
            value={year}
            options={yearsWithData.map(year => ({ label: year, value: year }))}
            onChange={(e) => setYear(e.value)}
            placeholder={year}
            className="w-full"
          />
        </div>
        <AnnualChart year={year} />
        <div className="annualReport__main-balance">
          <div className="annualReport__balance income">
            <span className="material-symbols-rounded no-select">download</span>
            <p>{formattedBalanceIncome}</p>
          </div>
          <div className="annualReport__balance expenses">
            <span className="material-symbols-rounded no-select">upload</span>
            <p>-{formattedBalanceExpenses}</p>
          </div>
          <div className="annualReport__balance edbita">
            <span
              className={`material-symbols-rounded no-select ${parseFloat(formattedBalanceFinal) < 0
                ? "negative"
                : "positive"
                }`}
            >
              savings
            </span>
            <p>{formattedBalanceFinal}</p>
          </div>
        </div>
      </div >

      <div className="annualReport__categories">
        <div className="annualReport__categories-text">
          <p>Categories</p>
          <span className="material-symbols-rounded button-action no-select" onClick={handleOpenModal}>new_window</span>
          <Sidebar
            visible={open}
            position="right"
            onHide={handleCloseModal}
            style={{ width: '450px' }}
            className="custom_sidebar"
          >
            <FormCategoryAdd onCategoryAdded={reloadCategories} onClose={handleCloseModal} />
          </Sidebar>
        </div>
        <AnnualMovements year={year} reloadFlag={reloadFlag} />
      </div>
    </section>
  );
}

export default AnnualReport;
