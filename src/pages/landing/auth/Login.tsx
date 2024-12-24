import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { toast } from 'react-hot-toast';

import { login as loginUser } from '../../../api/auth/login';
import Footer from '../../../components/layout/Footer';
import { useAuth } from '../../../context/AuthContext';
import { useUser } from '../../../context/useUser';

import './authForms.scss';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { refreshUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { token, error } = await loginUser(identifier, password);
      if (token) {
        localStorage.setItem('token', token);
        await login(token);
        await refreshUser();
        toast.success("Login successful!");
        navigate('/dashboard');
      } else {
        toast.error(error || "Incorrect username/email or password");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='authForms'>
      <header className="auth__header">
        <a href="/" className="no-select">
          <img
            src="https://res.cloudinary.com/dnhlagojg/image/upload/v1726670794/AppPhotos/Brand/logoPL3.svg"
            alt="logo"
          />
        </a>
      </header>

      <div className="container__form">
        <form onSubmit={handleSubmit}>
          <h2 className="form__title">Log in</h2>

          <InputText
            placeholder="Username or E-mail"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className='auth-input'
          />

          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            toggleMask
            placeholder="Password"
            feedback={false}
            required
            className='auth-input'
          />

          <a href="/forgot-password" className="form__forgot">Forgot password?</a>

          <button
            className="custom-btn"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <span className="custom-loader"></span> : "Let's go!"}
          </button>

          <p className="form__link">
            Don't have an account?
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
