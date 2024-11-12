import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { toast } from 'react-hot-toast';

import { register } from '../../../api/auth/register';
import Footer from '../../../components/layout/Footer';

import './authForms.scss';

export default function Register() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validatePassword(password)) {
      toast.error("Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    setIsLoading(true);
    const { success, error } = await register({ username, name, surname, email, password });

    if (success) {
      toast.success("Registration successful! Please log in.");
      navigate('/login');
    } else {
      if (error?.includes('email already exists')) {
        toast.error("This email is already registered.");
      } else if (error?.includes('username already exists')) {
        toast.error("This username is already taken.");
      } else if (error?.includes("Password must be")) {
        toast.error(error);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
    setIsLoading(false);
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
              promptLabel="Enter a password"
              weakLabel="Weak"
              mediumLabel="Medium"
              strongLabel="Strong"
              className="auth-input"
              placeholder="Password"
              tooltip="Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character."
            />
          </div>

          <button className="custom-btn" type="submit" disabled={isLoading}>
            {isLoading ? <span className="custom-loader"></span> : "Let's go!"}
          </button>

          <p className="form__link">
            Already have an account?
            <a href="/login" className="form__link--color">
              Log in
            </a>
          </p>
        </form>
      </div>

      <Footer />
    </div>
  );
}
