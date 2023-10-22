import { Link } from "react-router-dom";

import "./Login-Register.css";

import Footer from "../../components/landing/Footer";

function Login() {
  return (
    <>
      <header className="header">
        <div className="header__container">
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
          <h2 className="form__title">Log in</h2>
          <input
            className="form__email"
            type="email"
            name="email"
            id="email-login"
            placeholder="E-mail"
            required
          />
          <input
            className="form__password"
            type="password"
            name="password"
            id="password-login"
            placeholder="Password"
            required
          />
          <Link to="/forgot-password" className="form__forgot">
            Forgot password?
          </Link>
          <input className="form__submit" type="submit" value="Let's go!" />
          <p className="form__link">
            Don&apos;t have an account?
            <Link to="/register" className="form__link--color">
              Sign up
            </Link>
          </p>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default Login;
