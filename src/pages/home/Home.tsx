import { Link } from "react-router-dom";

import "./Home.css";

import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import Preview from "../../components/landing/Preview";

function Home() {
  return (
    <>
      <Header />

      {/* <!-- HERO --> */}
      <section className="hero">
        <div className="hero__title">
          <h1>Manage All Your Personal Finances in One Place</h1>
          <Link
            to="/dashboard"
            className="liveDemo"
          >
            Live Demo
          </Link>
        </div>
      </section>
      {/* <!-- FIN HERO --> */}

      <div className="container__sections">
        {/* <!-- SECTION 1 --> */}
        <section className="section1" id="features">
          <div className="section1__container">
            <div className="section1__div-text">
              <h2>Transforming Personal Financial Management</h2>
              <p>With Profit&Lost, you can manage your personal finances with ease and efficiency. Our intuitive platform helps you to control income, expenses, and savings, all in one place. Start making smarter financial decisions today!</p>
            </div>

            <div className="section1__div-img">
              <img
                src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1697122158/profit-lost.com/illustrations/money-dash.svg"
                alt="logo"
              />
            </div>
          </div>
        </section>
        {/* <!-- FIN SECTION 1 --> */}

        {/* <!-- SECTION FEATURES --> */}
        <section className="section__features">
          <article>
            <figure>
              <span className="material-symbols-rounded">devices</span>
            </figure>
            <div>
              <h3>Multidevice</h3>
            </div>
          </article>
          <article>
            <figure>
              <span className="material-symbols-rounded">dashboard</span>
            </figure>
            <div>
              <h3>Friendly Dashboard</h3>
            </div>
          </article>
          <article>
            <figure>
              <span className="material-symbols-rounded">sentiment_very_satisfied</span>
            </figure>
            <div>
              <h3>Easy to Use</h3>
            </div>
          </article>
        </section>
        {/* <!-- FIN SECTION FEATURES--> */}

        {/* <!-- SECTION PREVIEW--> */}
        <section className="section__preview">
          <Preview />
        </section>
        {/* <!-- FIN SECTION PREVIEW--> */}

      </div>

      <Footer />
    </>
  );
}

export default Home;
