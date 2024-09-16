import "./Home.scss";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import MobileScreenIcon from "../../components/icons/MobileScreenIcon";
import NewspaperIcon from "../../components/icons/NewspaperIcon";
import FaceGrinBeamIcon from "../../components/icons/FaceGrinBeamIcon";
import UnderConstruction from "../../components/landing/UnderConstruction";

function Home() {
  return (
    <div className="home">
      <UnderConstruction />
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
              <MobileScreenIcon />
            </figure>
            <div>
              <h3>Multidevice</h3>
            </div>
          </article>
          <article>
            <figure>
              <NewspaperIcon />
            </figure>
            <div>
              <h3>Friendly Dashboard</h3>
            </div>
          </article>
          <article>
            <figure>
              <FaceGrinBeamIcon />
            </figure>
            <div>
              <h3>Easy to Use</h3>
            </div>
          </article>
        </section>

      </div>

      <Footer />
    </div>
  );
}

export default Home;
