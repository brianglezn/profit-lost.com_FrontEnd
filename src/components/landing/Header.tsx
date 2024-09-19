import { Button } from 'primereact/button';

import "./Header.scss";

function Header() {


  return (
    <>
      <header className="header">
        <a href="/" className="header__logo no-select">
          <img
            src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
            alt="logo"
          />
        </a>
        <nav className="header__nav">
          <ul>
            <li>
              <a href="#features">FEATURES</a>
            </li>
            <li>
              <a href="#preview">PREVIEW</a>
            </li>
          </ul>
        </nav>
        <div className="header__login no-select">
          <Button label="Log in" raised onClick={() => window.location.href = '/login'} />
        </div>
      </header>
    </>
  );
}

export default Header;
