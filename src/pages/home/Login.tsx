import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAuth } from '../../context/AuthContext';

import Footer from '../../components/landing/Footer';

import './Login-Register.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const reiniciarTemporizadorExpiracionToken = () => {
    const temporizadorExistente = localStorage.getItem('temporizadorToken');
    if (temporizadorExistente) {
      clearTimeout(parseInt(temporizadorExistente, 10));
    }

    const temporizadorId = setTimeout(() => {
      localStorage.removeItem('token');
      alert('La sesión ha expirado. Por favor, inicie sesión de nuevo.');
      navigate('/login');
    }, 3600000);

    localStorage.setItem('temporizadorToken', temporizadorId.toString());
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://profit-lost-backend.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        login(data.token);
        reiniciarTemporizadorExpiracionToken();
        navigate('/dashboard');
      } else {
        console.error('Failed to login');
      }
    } catch (error) {
      console.error('There was an error logging in', error);
    }

    setIsLoading(false);
  };

  return (
    <>
      <header className="header">
        <div className="header__container_login">
          <Link to="/" className="header__logo no-select">
            <img
              src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1697122157/profit-lost.com/logo/logo_profit-lost2.svg"
              alt="logo"
            />
          </Link>
        </div>
      </header>

      <div className="container__form">
        <form className="form__box" onSubmit={handleSubmit}>
          <h2 className="form__title">Log in</h2>
          <input
            className="form__email"
            type="email"
            placeholder="E-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="form__password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link to="/forgot-password" className="form__forgot">
            Forgot password?
          </Link>
          <button
            className="form__submit"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <ProgressSpinner style={{ width: '30px', height: '30px' }} strokeWidth="6" animationDuration=".5s" className="custom-spinner-secondary" /> : "Let's go!"}
          </button>

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
