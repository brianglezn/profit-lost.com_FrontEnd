import React, { Suspense, SetStateAction, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Avatar } from 'primereact/avatar';
import { Toast } from 'primereact/toast';
import { Sidebar } from 'primereact/sidebar';

import { getUserByToken } from "../../api/users/getUserByToken";

import "./Dashboard.scss";

const DashHome = React.lazy(() => import('./DashHome'));
const Accounts = React.lazy(() => import('./Accounts'));
const AnnualReport = React.lazy(() => import('./AnnualReport'));
const Movements = React.lazy(() => import('./Movements'));
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

  const today = new Date().toLocaleDateString("es-ES", options);
  return today;
}

function Dashboard() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [user, setUser] = useState<User | null>(null);
  const toast = useRef<Toast>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  const handleMenuItemClick = (sectionName: SetStateAction<string>) => {
    setActiveSection(sectionName);
  };

  const currentDate = getCurrentDate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await getUserByToken(token);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const wakeUpBackend = async () => {
    toast.current?.show({
      severity: 'info',
      summary: 'Waiting for response from backend',
      detail: 'Sending request to reconnect to backend'
    });
    try {
      await fetch('https://profit-lost-backend.onrender.com/ping');
      toast.current?.show({
        severity: 'success',
        summary: 'Backend response',
        detail: 'OK response'
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Connection error',
        detail: 'Could not connect to backend'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <div className="dashboard">
        <Toast ref={toast} position="bottom-right" />
        <div className="dashboard__header">
          <header className="dashboard__header-container">
            <span className="spiner material-symbols-rounded" onClick={wakeUpBackend}>
              sync
            </span>
            <p className="dashboard__header-date">{currentDate}</p>
            <Avatar
              onClick={() => setSidebarVisible(true)}
              label={user?.name?.[0] ?? ''}
              size="xlarge"
              className="dashboard__header-avatar"
            />
          </header>
        </div>

        <div className="dashboard__nav">
          <nav className="dashboard__nav-container no-select">
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

        <section className="dashboard__content">
          <Suspense fallback={
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}>
              <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" className="custom-spinner" />
            </div>}>
            {activeSection === "Dashboard" && <DashHome />}
            {activeSection === "AnnualReport" && <AnnualReport />}
            {activeSection === "Movements" && <Movements />}
            {activeSection === "Accounts" && <Accounts />}
            {activeSection === "Goals" && <Goals />}
          </Suspense>
        </section>
      </div>
      <Sidebar visible={sidebarVisible} position="right" onHide={() => setSidebarVisible(false)}>
        <div className="profile__header">
          <Avatar
            label={user?.name?.[0] ?? ''}
            icon="pi pi-user"
            size="xlarge"
            className="profile__header-avatar"
          />
          <div className="profile__header-name">
            <h3>{user?.name ?? ''} {user?.surname ?? ''}</h3>
            <p>{user?.email ?? ''}</p>
          </div>
        </div>
        <div className="profile__dashboard">
          <button onClick={handleLogout} className="profile__dashboard-logout">
            Logout
          </button>
        </div>
      </Sidebar>
    </>
  );
}

export default Dashboard;
