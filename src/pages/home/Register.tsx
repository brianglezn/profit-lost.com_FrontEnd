import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import Footer from '../../components/landing/Footer';
import EyeSlashIcon from '../../components/icons/EyeSlashIcon';
import EyeIcon from '../../components/icons/EyeIcon';
import './authForms.scss';

function Register() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://profit-lost-backend.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, name, surname, email, password }),
      });

      if (response.ok) {
        toast.success('User registered successfully');
        navigate('/login');
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to register');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Registration error: ${error.message}`);
        console.error('Registration error:', error);
      } else {
        toast.error('An unexpected error occurred');
        console.error('Registration error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPass = e.target.value;
    setPassword(newPass);
  };

  return (
    <div className='authForms'>
      <header className="auth__header">
        <a href="/" className="header__logo no-select">
          <img
            src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1697122157/profit-lost.com/logo/logo_profit-lost2.svg"
            alt="logo"
          />
        </a>
      </header>

      <div className="container__form">
        <form className="form__box" onSubmit={handleSubmit}>
          <h2 className="form__title">Create an account</h2>
          <input
            className="form__username auth-input"
            type="text"
            id="username-register"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="form__name auth-input"
            type="text"
            id="name-register"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="form__surnaname auth-input"
            type="text"
            id="surname-register"
            placeholder="Surname"
            required
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
          <input
            className="form__email auth-input"
            type="email"
            id="email-register"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="form__password-container">
            <input
              className="form__password auth-input"
              type={showPassword ? "text" : "password"}
              id="password-register"
              placeholder="Password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className={`password-toggle-btn ${showPassword ? 'active' : ''}`}
              onClick={toggleShowPassword}
            >
             {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>

          <button className="custom-btn" type="submit" disabled={isLoading}>
            {isLoading ? <span className="custom-loader"></span> : "Let's go!"}
          </button>

          <p className="form__link">
            Already have an account?
            <a href="/login" className="form__link--color">
              Sign in
            </a>
          </p>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default Register;
