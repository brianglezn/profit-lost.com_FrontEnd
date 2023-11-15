import { Link } from "react-router-dom";

import "./Home.css";

import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";

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

      {/* <!-- SECTION 1 --> */}
      <section className="section1" id="features">
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
            <span className="material-symbols-rounded">dashboard</span>
          </figure>
          <div>
            <h1>friendly dashboard</h1>
          </div>
        </article>

        <article>
          <figure>
            <span className="material-symbols-rounded">cloud</span>
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
