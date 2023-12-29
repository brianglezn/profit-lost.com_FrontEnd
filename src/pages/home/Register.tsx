import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import './Login-Register.css';
import Footer from '../../components/landing/Footer';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      // Registro exitoso
      console.log('User registered successfully');
      navigate('/login'); // Redirige al usuario a la página de inicio de sesión
    } else {
      // Manejar errores
      console.error('Failed to register');
    }
  };

  return (
    <>
      <header className="header">
        <div className="header__container_register">
          <Link to="/" className="header__logo">
            <img
              src="https://res.cloudinary.com/dz0mwxb0v/image/upload/v1697122157/profit-lost.com/logo/logo_profit-lost2.svg"
              alt="logo"
            />
          </Link>
        </div>
      </header>

      <div className="container__form">
        <form className="form__box" onSubmit={handleSubmit}>
          <h2 className="form__title">Create an account</h2>
          <input
            className="form__name"
            type="text"
            id="username-register"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="form__email"
            type="email"
            id="email-register"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="form__password"
            type="password"
            id="password-register"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input className="form__submit" type="submit" value="Let's go!" />
          <p className="form__link">
            Already have an account?
            <Link to="/login" className="form__link--color">
              Sign in
            </Link>
          </p>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default Register;
