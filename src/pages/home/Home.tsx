import { TabPanel, TabView } from "primereact/tabview";

import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";

import "./Home.scss";

function Home() {
  return (
    <div className="home">
      <Header />

      <section className="hero">
        <div className="hero__title">
          <h1>Manage All Your Personal Finances in One Place</h1>
        </div>
      </section>

      <div className="container__sections">
        <section className="section__description" id="features">
          <div className="section__description-container">
            <div>
              <h2>Transforming Personal Financial Management</h2>
              <p>With Profit&Lost, you can manage your personal finances with ease and efficiency. Our intuitive platform helps you to control income, expenses, and savings, all in one place. Start making smarter financial decisions today!</p>
            </div>

            <div className="no-select">
              <img
                src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1697122158/profit-lost.com/illustrations/money-dash.svg"
                alt="logo"
              />
            </div>
          </div>
        </section>

        <section className="section__features">
          <article>
            <figure>
              <span className="material-symbols-rounded no-select">devices</span>
            </figure>
            <div>
              <h3>Multidevice</h3>
            </div>
          </article>
          <article>
            <figure>
              <span className="material-symbols-rounded no-select">dashboard</span>
            </figure>
            <div>
              <h3>Friendly Dashboard</h3>
            </div>
          </article>
          <article>
            <figure>
              <span className="material-symbols-rounded no-select">sentiment_very_satisfied</span>
            </figure>
            <div>
              <h3>Easy to Use</h3>
            </div>
          </article>
        </section>

        <section className="section__preview no-select" id="demo">
          <TabView>
            <TabPanel header="ANNUAL REPORT">
              <div className="demo__img">
                <img src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1716719033/profit-lost.com/img/preview/Annual%20Report.png" alt="annual_report-img" />
              </div>
            </TabPanel>
            <TabPanel header="MOVEMENTS">
              <div className="demo__img">
                <img src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1716719033/profit-lost.com/img/preview/Movements.png" alt="movements-img" />
              </div>
            </TabPanel>
            <TabPanel header="ACCOUNTS">
              <div className="demo__img">
                <img src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1716719033/profit-lost.com/img/preview/Accounts.png" alt="accounts-img" />
              </div>
            </TabPanel>
          </TabView>
        </section>

      </div>

      <Footer />
    </div>
  );
}

export default Home;
