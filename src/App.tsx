import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { UserProvider } from './context/UserContext';
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

function App() {

  const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { authToken } = useAuth();
    return authToken ? <>{children}</> : <Navigate to='/login' />;
  };

  return (
    <AuthProvider>
      <UserProvider>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/forgot-password' element={<ForgotPassword />}></Route>
          <Route path='/forgot-password-token' element={<ForgotPasswordToken />}></Route>
          <Route path='/dashboard' element={
            <PrivateRoute>
              <DashBoard />
            </PrivateRoute>
          }>
          </Route>
          <Route path='/cookies' element={<Cookies />}></Route>
          <Route path='/privacy' element={<Privacy />}></Route>
          <Route path='/faq' element={<Faq />}></Route>
        </Routes>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
