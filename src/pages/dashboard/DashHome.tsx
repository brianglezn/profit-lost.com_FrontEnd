import "./DashHome.scss";
import HomeBalanceChart from "../../components/dashboard/dashhome/HomeBalanceChart";

function DashHome() {
  return (
    <section className="dashHome">
      <div className="balances">
        <div>
          <div className="balances-container">
            .
          </div>
        </div>
        <div>
          <div className="balances-container">
            .
          </div>
        </div>
        <div>
          <div className="balances-container">
            .
          </div>
        </div>
      </div>
      <div className="history">
        <div className="history-container">
          .
        </div>
      </div>
      <div className="chart">
        <div className="chart-container">
          <HomeBalanceChart />
        </div>
      </div>
      <div className="first">
        <div className="first-container">
          .
        </div>
      </div>
      <div className="second">
        <div className="second-container">
          .
        </div>
      </div>
      <div className="categories">
        <div className="categories-container">
          .
        </div>
      </div>
    </section>
  );
}

export default DashHome;
