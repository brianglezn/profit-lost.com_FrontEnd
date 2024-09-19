import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';

import './authForms.scss';
import Footer from '../../components/landing/Footer';

function Register() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className='authForms'>
      <header className="auth__header">
        <a href="/" className="header__logo no-select">
          <img
            src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
            alt="logo"
          />
        </a>
      </header>

      <div className="container__form">
        <form className="form__box" onSubmit={handleSubmit}>
          <h2 className="form__title">Create an account</h2>

          <div className="form__input-container">
            <InputText
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="auth-input"
            />
          </div>

          <div className="form__input-container">
            <InputText
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
              className="auth-input"
            />
          </div>

          <div className="form__input-container">
            <InputText
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="Surname"
              required
              className="auth-input"
            />
          </div>

          <div className="form__input-container">
            <InputText
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              type="email"
              className="auth-input"
            />
          </div>

          <div className="form__password-container">
            <Password
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              toggleMask
              feedback={true}
              promptLabel="Enter your password"
              weakLabel="Weak"
              mediumLabel="Medium"
              strongLabel="Strong"
              className="auth-input"
              placeholder="Password"
            />
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
