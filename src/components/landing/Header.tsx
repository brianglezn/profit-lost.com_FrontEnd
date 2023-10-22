import { Link } from "react-router-dom";

import "./Header.css";

function Header() {
  return (
    <>
      <header className="header">
        <div className="header__container">
          <a href="/" className="header__logo">
            <img
              src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1697122157/profit-lost.com/logo/logo_profit-lost2.svg"
              alt="logo"
            />
          </a>
          <nav className="header__nav">
            <ul>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#preview">Preview</a>
              </li>
            </ul>
          </nav>
          <div className="header__login">
            <Link to="/login" className="header__login-btn">
              Log in
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
