import { Link } from "react-router-dom";

import "./Home.css";
import money_dash from "../assets/illustrations/money-dash.svg";

import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";

function Home() {
  return (
    <>
      <Header />

      {/* <!-- HERO --> */}
      <section className="hero">
        <div className="hero__title">
          <h1>Manage all your personal finances from one place</h1>
        </div>
        <Link to="/login" className="header__login-btn header__login-btn2">
          Log in
        </Link>
      </section>
      {/* <!-- FIN HERO --> */}

      {/* <!-- SECTION 1 --> */}
      <section className="section1">
        <div className="section1__container">
          <div className="section1__div-text">
            <h1>Este es el título de la sección</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis
              totam dolore quis ab nam nemo adipisci voluptatum repellendus
              facilis reiciendis mollitia asperiores sed recusandae, quaerat
              minima repudiandae deserunt, excepturi neque.
            </p>
          </div>
          <div className="section1__div-img">
            <img src={money_dash} alt="Imagen de ejemplo" />
          </div>
        </div>
      </section>
      {/* <!-- FIN SECTION 1 --> */}

      {/* <!-- SECTION FEATURES --> */}
      <section className="section__features" id="features">
        <article>
          <figure>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
              />
            </svg>
          </figure>
          <div>
            <h1>friendly dashboard</h1>
          </div>
        </article>

        <article>
          <figure>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
              />
            </svg>
          </figure>
          <div>
            <h1>Cloud storage</h1>
          </div>
        </article>
      </section>
      {/* <!-- FIN SECTION FEATURES--> */}

      {/* <!-- SECTION PREVIEW--> */}
      <section className="section__preview" id="preview">
        <div>preview</div>
      </section>
      {/* <!-- FIN SECTION PREVIEW--> */}

      <Footer />
    </>
  );
}

export default Home;
