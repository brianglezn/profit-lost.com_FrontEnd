import { SetStateAction, useState } from "react";

import "./Dashboard.css";
import logo2 from "../assets/logo/logo_profit-lost2.svg";

import DashHome from "../components/dashboard/DashHome";
import Accounts from "../components/dashboard/Accounts";
import AnnualReport from "../components/dashboard/AnnualReport";
import Movements from "../components/dashboard/Movements";
import Profile from "../components/dashboard/Profile";
import Settings from "../components/dashboard/Settings";

function Dashboard() {
  const [activeSection, setActiveSection] = useState("Dashboard");

  const handleMenuItemClick = (sectionName: SetStateAction<string>) => {
    setActiveSection(sectionName);
  };

  function getCurrentDate() {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    const today = new Date().toLocaleDateString("en-US", options);
    return today;
  }

  const currentDate = getCurrentDate();

  return (
    <>
      <section className="dashboard">
        <header className="dashboard__header">
          <p className="dashboard__header-date">{currentDate}</p>
          <span
            className={`material-symbols-rounded ${
              activeSection === "Settings" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("Settings")}
            style={{ cursor: "pointer" }}
          >
            settings
          </span>
          {/* avatar */}
        </header>
        <nav className="dashboard__nav">
          <div className="dashboard__nav-img">
            <img src={logo2} alt="Profit&Lost" />
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
            </ul>
          </div>
        </nav>
        <section className="dashboard_container">
          {activeSection === "Dashboard" && <DashHome />}
          {activeSection === "AnnualReport" && <AnnualReport />}
          {activeSection === "Movements" && <Movements />}
          {activeSection === "Accounts" && <Accounts />}
          {activeSection === "Profile" && <Profile />}
          {activeSection === "Settings" && <Settings />}
        </section>
      </section>
    </>
  );
}

export default Dashboard;
