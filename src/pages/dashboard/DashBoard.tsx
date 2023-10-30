import { SetStateAction, useState } from "react";
import Avatar from "@mui/material/Avatar";

import "./Dashboard.css";

import DashHome from "./DashHome";
import Accounts from "./Accounts";
import AnnualReport from "./AnnualReport";
import Movements from "./Movements";
import Profile from "./Profile";
import Goals from "./Goals";

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
        <div className="dashboard__container-header">
          <header className="dashboard__header">
            <p className="dashboard__header-date">{currentDate}</p>
            <Avatar
              onClick={() => handleMenuItemClick("Profile")}
              sx={{ bgcolor: "var(--color-orange)", width: 35, height: 35 }}
              variant="rounded"
            >
              B
            </Avatar>
          </header>
        </div>

        {/* NAV PC */}
        <div className="dashboard__container-nav">
          <nav className="dashboard__nav">
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

        <section className="dashboard__container">
          {activeSection === "Dashboard" && <DashHome />}
          {activeSection === "AnnualReport" && <AnnualReport />}
          {activeSection === "Movements" && <Movements />}
          {activeSection === "Accounts" && <Accounts />}
          {activeSection === "Profile" && <Profile />}
          {activeSection === "Goals" && <Goals />}
        </section>
      </section>
    </>
  );
}

export default Dashboard;
