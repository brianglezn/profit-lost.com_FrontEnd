import { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';

import "./Header.scss";
import BarsIcon from '../icons/BarsIcon';

function Header() {
  const [visible, setVisible] = useState(false);

  const handleNavigation = (url: string) => {
    window.location.href = url;
  };

  return (
    <>
      <header className="header">
        <a href="/" className="header__logo no-select">
          <img
            src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1697122157/profit-lost.com/logo/logo_profit-lost2.svg"
            alt="logo"
          />
        </a>
        <nav className="header__nav">
          <ul>
            <li>
              <a href="#features">FEATURES</a>
            </li>
            <li>
              <a href="#demo">DEMO</a>
            </li>
          </ul>
        </nav>
        <div className="header__login no-select">
          <a href="/login" className="header__login-btn">Log in</a>
          <button onClick={() => setVisible(true)} className="header__login-sidebar">
            <BarsIcon />
          </button>
        </div>
      </header>
      <Sidebar visible={visible} position="right" onHide={() => setVisible(false)}>
        <nav className="sidebar__nav">
          <div className="sidebar-img">
            <img
              src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1697122157/profit-lost.com/logo/logo_profit-lost2.svg"
              alt="logo"
            />
          </div>
          <button onClick={() => handleNavigation('/login')} className='sidebar__login-btn custom-btn'>Log in</button>
          <button onClick={() => handleNavigation('/register')} className='sidebar__login-btn custom-btn'>Register</button>
        </nav>
      </Sidebar>
    </>
  );
}

export default Header;
