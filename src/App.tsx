import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import './i18n';

const Home = React.lazy(() => import('./pages/landing/home/Home'));
const Login = React.lazy(() => import('./pages/landing/auth/Login'));
const Register = React.lazy(() => import('./pages/landing/auth/Register'));
const DashBoard = React.lazy(() => import('./pages/dashboard/DashBoard'));
const Cookies = React.lazy(() => import('./pages/landing/policy/Cookies'));
const Privacy = React.lazy(() => import('./pages/landing/policy/Privacy'));
const Faq = React.lazy(() => import('./pages/landing/faq/Faq'));
const ForgotPassword = React.lazy(() => import('./pages/landing/auth/ForgotPassword'));
const ForgotPasswordToken = React.lazy(() => import('./pages/landing/auth/ForgotPasswordToken'));

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function App() {
  const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to='/login' />;
  };

  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/forgot-password-token' element={<ForgotPasswordToken />} />
        <Route path='/dashboard' element={<PrivateRoute><DashBoard /></PrivateRoute>} />
        <Route path='/cookies' element={<Cookies />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/faq' element={<Faq />} />
      </Routes>
    </AuthProvider>
  );
}