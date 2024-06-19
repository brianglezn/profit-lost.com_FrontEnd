import React, { Suspense, useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Avatar } from 'primereact/avatar';
import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { toast } from 'react-hot-toast';

import { getUserByToken } from "../../api/users/getUserByToken";

import { getCurrentDate } from "../../helpers/functions";

import "./Dashboard.scss";
import BackupManager from "../../components/BackupManager";
const DashHome = React.lazy(() => import('./DashHome'));
const Accounts = React.lazy(() => import('./Accounts'));
const AnnualReport = React.lazy(() => import('./AnnualReport'));
const Movements = React.lazy(() => import('./Movements'));
const Goals = React.lazy(() => import('./Goals'));
const Notes = React.lazy(() => import('./Notes'));
import RefreshIcon from "../../components/icons/RefreshIcon";
import HomeIcon from "../../components/icons/HomeIcon";
import ChartColumnIcon from "../../components/icons/ChartColumnIcon";
import ChartBarIcon from "../../components/icons/ChartBarIcon";
import CreditCardIcon from "../../components/icons/CreditCardIcon";
import NotesIcon from "../../components/icons/NotesIcon";
import ListCheckIcon from "../../components/icons/ListCheckIcon";
import BarsIcon from "../../components/icons/BarsIcon";
import UserIcon from "../../components/icons/UserIcon";
import InfoIcon from "../../components/icons/InfoIcon";
import HelpIcon from "../../components/icons/HelpIcon";
import ShielIcon from "../../components/icons/ShielIcon";
import BackupIcon from "../../components/icons/BackupIcon";

const authorizedUserId = "65df4dfae27f115e23b1a1c2";

interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  surname: string;
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
        if (userData && userData._id) {
          setUser(userData);
        } else {
          console.error('User data does not include _id:', userData);
        }
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
        loading: 'Sending request to reconnect...',
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
      icon: <ListCheckIcon />,
      command: () => handleMenuItemClick('Goals')
    },
    {
      label: 'Notes',
      icon: <NotesIcon />,
      command: () => handleMenuItemClick('Notes')
    }
  ];

  return (
    <>
      <div className="dashboard">
        <div className="dashboard__header">
          <header className="dashboard__header-container">
            <RefreshIcon onClick={wakeUpBackend} />
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
                  <HomeIcon />
                  <p>DashBoard</p>
                </li>
                <li
                  onClick={() => handleMenuItemClick("AnnualReport")}
                  className={activeSection === "AnnualReport" ? "active" : ""}
                >
                  <ChartColumnIcon />
                  <p>Annual Report</p>
                </li>
                <li
                  onClick={() => handleMenuItemClick("Movements")}
                  className={activeSection === "Movements" ? "active" : ""}
                >
                  <ChartBarIcon />
                  <p>Movements</p>
                </li>
                <li
                  onClick={() => handleMenuItemClick("Accounts")}
                  className={activeSection === "Accounts" ? "active" : ""}
                >
                  <CreditCardIcon />
                  <p>Accounts</p>
                </li>
                <li
                  onClick={() => handleMenuItemClick("Goals")}
                  className={activeSection === "Goals" ? "active" : ""}
                >
                  <ListCheckIcon />
                  <p>Goals</p>
                </li>
                <li
                  onClick={() => handleMenuItemClick("Notes")}
                  className={activeSection === "Notes" ? "active" : ""}
                >
                  <NotesIcon />
                  <p>Notes</p>
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
              <HomeIcon />
              <span className="tooltip">Dashboard</span>
            </span>
            <span
              onClick={() => handleMenuItemClick("AnnualReport")}
              className={activeSection === "AnnualReport" ? "active" : ""}
            >
              <ChartColumnIcon />
              <span className="tooltip">Annual Report</span>
            </span>
            <span
              onClick={() => handleMenuItemClick("Movements")}
              className={activeSection === "Movements" ? "active" : ""}
            >
              <ChartBarIcon />
              <span className="tooltip">Movements</span>
            </span>
            <span
              onClick={() => handleMenuItemClick("Accounts")}
              className={activeSection === "Accounts" ? "active" : ""}
            >
              <CreditCardIcon />
              <span className="tooltip">Accounts</span>
            </span>
            <span
              onClick={(e) => menu.current?.toggle(e)}
              className={activeSection === "Goals" || activeSection === "Notes" ? "active" : ""}
            >
              <BarsIcon />
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
              height: '100%',
              color: '#fe6f14'
            }}>
              <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" className="custom-spinner" />
            </div>}>
            {activeSection === "Dashboard" && <DashHome />}
            {activeSection === "AnnualReport" && <AnnualReport />}
            {activeSection === "Movements" && <Movements />}
            {activeSection === "Accounts" && <Accounts />}
            {activeSection === "Goals" && <Goals />}
            {activeSection === "Notes" && <Notes />}
            {activeSection === "Backups" && <BackupManager />}
          </Suspense>
        </section>
      </div>
      <Sidebar
        visible={sidebarVisible}
        position="right"
        onHide={() => setSidebarVisible(false)}
        style={{ width: '450px' }}
      >
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

        <div className="profile__header-account">
          <a href="#">
            <UserIcon />
            <p>Account</p>
          </a>
          <a href="#">
            <ShielIcon />
            <p>Security and Privacy</p>
          </a>
          {user && user._id === authorizedUserId && (
            <a onClick={() => handleMenuItemClick("Backups")}>
              <BackupIcon />
              <p>Backups MongoDB</p>
            </a>
          )}
        </div>

        <div className="profile__header-help">
          <a href="#">
            <HelpIcon />
            <p>Help</p>
          </a>
          <a href="#">
            <InfoIcon />
            <p>About Us</p>
          </a>
        </div>

        <div className="profile__dashboard">
          <button onClick={handleLogout} className="custom-btn">
            Log out
          </button>
        </div>
      </Sidebar>
    </>
  );
}

export default Dashboard;
