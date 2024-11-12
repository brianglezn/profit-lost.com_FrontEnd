import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import './Header.scss';

export default function Header() {
  const [logoSrc, setLogoSrc] = useState(
    'https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg'
  );

  useEffect(() => {
    const updateLogo = () => {
      if (window.innerWidth < 768) {
        setLogoSrc('https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL2.svg');
      } else {
        setLogoSrc('https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg');
      }
    };

    updateLogo();
    window.addEventListener('resize', updateLogo);

    return () => {
      window.removeEventListener('resize', updateLogo);
    };
  }, []);

  return (
    <header className='header'>
      <a href='/' className='header__logo no-select'>
        <img src={logoSrc} alt='logo' />
      </a>
      <div className='header__login no-select'>
        <Button
          label="Log In"
          raised
          onClick={() => window.location.href = '/login'}
        />
      </div>
    </header>
  );
}
