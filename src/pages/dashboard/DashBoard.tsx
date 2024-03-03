import React, { Suspense, SetStateAction, useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import CircularProgress from '@mui/material/CircularProgress';

import "./Dashboard.css";

const DashHome = React.lazy(() => import('./DashHome'));
const Accounts = React.lazy(() => import('./Accounts'));
const AnnualReport = React.lazy(() => import('./AnnualReport'));
const Movements = React.lazy(() => import('./Movements'));
const Profile = React.lazy(() => import('./Profile'));
const Goals = React.lazy(() => import('./Goals'));

interface User {
  username: string;
  email: string;
  name: string;
  surname: string;
}

function getCurrentDate() {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const today = new Date().toLocaleDateString("en-EN", options);
  return today;
}

function Dashboard() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [user, setUser] = useState<User | null>(null);

  const handleMenuItemClick = (sectionName: SetStateAction<string>) => {
    setActiveSection(sectionName);
  };

  const currentDate = getCurrentDate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUser = async () => {
      try {
        const response = await fetch('https://profit-lost-backend.onrender.com/user/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <section className="dashboard">
        <div className="dashboard__container-header">
          <header className="dashboard__header">
            <p className="dashboard__header-date">{currentDate}</p>
            <Avatar
              onClick={() => handleMenuItemClick("Profile")}
              sx={{ bgcolor: "var(--color-orange)", width: 35, height: 35 }}
              variant="rounded"
            >
              {user?.name?.[0] ?? ''}
            </Avatar>
          </header>
        </div>

        {/* NAV PC */}
        <div className="dashboard__container-nav">
          <nav className="dashboard__nav no-select">
            <div className="dashboard__nav-img">
              <img
                src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1697122157/profit-lost.com/logo/logo_profit-lost2.svg"
                alt="logo"
              />
            </div>
            <div className="dashboard__nav-nav">
              <ul>
                <li
                  onClick={() => handleMenuItemClick("Dashboard")}
                  className={activeSection === "Dashboard" ? "active" : ""}
                >
                  <span className="material-symbols-rounded">home</span>
                  DashBoard
                </li>
                <li
                  onClick={() => handleMenuItemClick("AnnualReport")}
                  className={activeSection === "AnnualReport" ? "active" : ""}
                >
                  <span className="material-symbols-rounded">
                    bar_chart_4_bars
                  </span>
                  Annual Report
                </li>
                <li
                  onClick={() => handleMenuItemClick("Movements")}
                  className={activeSection === "Movements" ? "active" : ""}
                >
                  <span className="material-symbols-rounded">receipt_long</span>
                  Movements
                </li>
                <li
                  onClick={() => handleMenuItemClick("Accounts")}
                  className={activeSection === "Accounts" ? "active" : ""}
                >
                  <span className="material-symbols-rounded">credit_card</span>
                  Accounts
                </li>
                <li
                  onClick={() => handleMenuItemClick("Goals")}
                  className={activeSection === "Goals" ? "active" : ""}
                >
                  <span className="material-symbols-rounded">inventory</span>
                  Goals
                </li>
              </ul>
            </div>
          </nav>
        </div>
        {/* FIN NAV PC */}

        {/* NAV RESPONSIVE */}
        <div className="dashboard__container-nav2">
          <nav className="dashboard__nav2">
            <span
              onClick={() => handleMenuItemClick("Dashboard")}
              className={activeSection === "Dashboard" ? "active" : ""}
            >
              <span className="material-symbols-rounded">home</span>
            </span>
            <span
              onClick={() => handleMenuItemClick("AnnualReport")}
              className={activeSection === "AnnualReport" ? "active" : ""}
            >
              <span className="material-symbols-rounded">bar_chart_4_bars</span>
            </span>
            <span
              onClick={() => handleMenuItemClick("Movements")}
              className={activeSection === "Movements" ? "active" : ""}
            >
              <span className="material-symbols-rounded">receipt_long</span>
            </span>
            <span
              onClick={() => handleMenuItemClick("Accounts")}
              className={activeSection === "Accounts" ? "active" : ""}
            >
              <span className="material-symbols-rounded">credit_card</span>
            </span>
            <span
              onClick={() => handleMenuItemClick("Goals")}
              className={activeSection === "Goals" ? "active" : ""}
            >
              <span className="material-symbols-rounded">inventory</span>
            </span>
          </nav>
        </div>
        {/* FIN NAV RESPONSIVE */}

        <Suspense fallback={
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}>
            <CircularProgress />
          </div>}>
          <section className="dashboard__container">
            {activeSection === "Dashboard" && <DashHome />}
            {activeSection === "AnnualReport" && <AnnualReport />}
            {activeSection === "Movements" && <Movements />}
            {activeSection === "Accounts" && <Accounts />}
            {activeSection === "Profile" && <Profile />}
            {activeSection === "Goals" && <Goals />}
          </section>
        </Suspense>
      </section>
    </>
  );
}

export default Dashboard;
