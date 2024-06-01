import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

import Footer from '../../components/landing/Footer';

import './authForms.scss';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const reiniciarTemporizadorExpiracionToken = () => {
    const temporizadorExistente = localStorage.getItem('temporizadorToken');
    if (temporizadorExistente) {
      clearTimeout(parseInt(temporizadorExistente, 10));
    }

    const temporizadorId = setTimeout(() => {
      localStorage.removeItem('token');
      alert('Your session has expired. Please log in again.');
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
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        login(data.token);
        reiniciarTemporizadorExpiracionToken();
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error('Incorrect username/email or password');
        console.error('Failed to login');
      }
    } catch (error) {
      toast.error('There was a problem trying to log in');
      console.error('There was an error logging in', error);
    }

    setIsLoading(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='authForms'>
      <header className="auth__header">
        <a href="/" className="no-select">
          <img
            src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1697122157/profit-lost.com/logo/logo_profit-lost2.svg"
            alt="logo"
          />
        </a>
      </header>

      <div className="container__form">
        <form onSubmit={handleSubmit}>
          <h2 className="form__title">Log in</h2>
          <input
            className="form__email auth-input"
            type="text"
            placeholder="Username or E-mail"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <div className="form__password-container">
            <input
              className="form__password auth-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={`password-toggle-btn ${showPassword ? 'active' : ''}`}
              onClick={toggleShowPassword}
            >
              <span className="material-symbols-rounded">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
          <a href="/forgot-password" className="form__forgot">Forgot password?</a>
          <button
            className="custom-btn"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <span className="custom-loader"></span> : "Let's go!"}
          </button>

          <p className="form__link">
            Don&apos;t have an account?
            <a href="/register" className="form__link--color">
              Sign up
            </a>
          </p>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default Login;
