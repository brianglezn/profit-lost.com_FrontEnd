import { Link } from 'react-router-dom';

import './Header.css';
import logo2 from '../../assets/logo/logo_profit-lost2.svg';

function Header() {
  return (
    <>
      <header className='header'>
        <div className='header__container'>
          <a href='/' className='header__logo'>
            <img src={logo2} alt='Profit&Lost' />
          </a>
          <nav className='header__nav'>
            <ul>
              <li>
                <a href='#features'>Features</a>
              </li>
              <li>
                <a href='#preview'>Preview</a>
              </li>
            </ul>
          </nav>
          <div className='header__login'>
            <Link to='/login' className='header__login-btn'>
              Log in
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
