import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';

const Home = React.lazy(() => import('./pages/landing/Home'));
const Login = React.lazy(() => import('./pages/landing/Login'));
const Register = React.lazy(() => import('./pages/landing/Register'));
const DashBoard = React.lazy(() => import('./pages/dashboard/DashBoard'));
const Cookies = React.lazy(() => import('./pages/landing/Cookies'));
const Faq = React.lazy(() => import('./pages/landing/Faq'));
const ForgotPassword = React.lazy(() => import('./pages/landing/ForgotPassword'));
const ForgotPasswordToken = React.lazy(() => import('./pages/landing/ForgotPasswordToken'));

interface PrivateRouteProps {
  children: React.ReactNode;
}

function App() {

  const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { authToken } = useAuth();
    return authToken ? <>{children}</> : <Navigate to="/login" />;
  };

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
          <Route path="/forgot-password-token" element={<ForgotPasswordToken />}></Route>
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashBoard />
            </PrivateRoute>
          }>
          </Route>
          <Route path="/cookies" element={<Cookies />}></Route>
          <Route path="/faq" element={<Faq />}></Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
