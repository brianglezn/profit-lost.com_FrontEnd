import { Link } from "react-router-dom";

import "./Login-Register.css";

import Footer from "../../components/landing/Footer";

function Register() {
  return (
    <>
      <header className="header">
        <div className="header__container_register">
          <Link to="/" className="header__logo">
            <img
              src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1697122157/profit-lost.com/logo/logo_profit-lost2.svg"
              alt="logo"
            />
          </Link>
        </div>
      </header>

      <div className="container__form">
        <form className="form__box" method="post">
          <h2 className="form__title">Create an account</h2>
          <input
            className="form__name"
            type="text"
            id="username-register"
            placeholder="Username"
            required
          />
          <input
            className="form__email"
            type="email"
            name="email"
            id="email-register"
            placeholder="Email"
            required
          />

          <input
            className="form__password"
            type="password"
            name="password"
            id="password-register"
            placeholder="Password"
            required
          />
          <input className="form__submit" type="submit" value="Let's go!" />
          <p className="form__link">
            Already have an account?
            <Link to="/login" className="form__link--color">
              Sign in
            </Link>
          </p>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default Register;
