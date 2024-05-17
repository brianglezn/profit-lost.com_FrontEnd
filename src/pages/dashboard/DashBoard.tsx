import React, { Suspense, useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Avatar } from 'primereact/avatar';
import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { toast } from 'react-hot-toast';

import { getUserByToken } from "../../api/users/getUserByToken";

import "./Dashboard.scss";

const DashHome = React.lazy(() => import('./DashHome'));
const Accounts = React.lazy(() => import('./Accounts'));
const AnnualReport = React.lazy(() => import('./AnnualReport'));
const Movements = React.lazy(() => import('./Movements'));
const Goals = React.lazy(() => import('./Goals'));
const SplitEasy = React.lazy(() => import('./SplitEasy'));
const Notes = React.lazy(() => import('./Notes'));

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
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const menu = useRef<Menu>(null);

  const handleMenuItemClick = (sectionName: string) => {
    setActiveSection(sectionName);
    const params = sectionName === "Dashboard" ? {} : { section: sectionName };
    setSearchParams(params as Record<string, string>);
    window.scrollTo(0, 0);
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

  useEffect(() => {
    const section = searchParams.get("section");
    setActiveSection(section || "Dashboard");
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      const headerContainer = document.querySelector('.dashboard__header-container');
      if (window.scrollY > 0) {
        headerContainer?.classList.add('scrolled');
      } else {
        headerContainer?.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const wakeUpBackend = async () => {
    toast.promise(
      fetch('https://profit-lost-backend.onrender.com/ping'),
      {
        loading: 'Sending request to reconnect to backend...',
        success: 'OK response from backend',
        error: 'Could not connect to backend',
      },
      {
        success: {
          duration: 2000,
        },
        error: {
          duration: 2000,
        }
      }
    );
  };

  const handleLogout = () => {
    toast.success("Session closed successfully", { duration: 3000 });
    setTimeout(() => {
      localStorage.removeItem('token');
      navigate('/login');
    }, 1000);
  };

  const menuItems = [
    {
      label: 'Goals',
      icon: <span className="material-symbols-rounded">inventory</span>,
      command: () => handleMenuItemClick('Goals')
    },
    {
      label: 'SplitEasy',
      icon: <span className="material-symbols-rounded">climate_mini_split</span>,
      command: () => handleMenuItemClick('SplitEasy')
    },
    {
      label: 'Notes',
      icon: <span className="material-symbols-rounded">note_alt</span>,
      command: () => handleMenuItemClick('Notes')
    }
  ];

  return (
    <>
      <div className="dashboard">
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
                <li
                  onClick={() => handleMenuItemClick("SplitEasy")}
                  className={activeSection === "SplitEasy" ? "active" : ""}
                >
                  <span className="material-symbols-rounded">climate_mini_split</span>
                  SplitEasy
                </li>
                <li
                  onClick={() => handleMenuItemClick("Notes")}
                  className={activeSection === "Notes" ? "active" : ""}
                >
                  <span className="material-symbols-rounded">note_alt</span>
                  Notes
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
              onClick={(e) => menu.current?.toggle(e)}
              className={activeSection === "Goals" || activeSection === "SplitEasy" || activeSection === "Notes" ? "active" : ""}
            >
              <span className="material-symbols-rounded">menu</span>
            </span>
            <Menu model={menuItems} popup ref={menu} id="popup_menu" />
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
            {activeSection === "SplitEasy" && <SplitEasy />}
            {activeSection === "Notes" && <Notes />}
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
