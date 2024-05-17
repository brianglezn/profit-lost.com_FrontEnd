import { Routes, Route } from "react-router-dom";
import { Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';

import Home from "./pages/home/Home";
import Login from "./pages/home/Login";
import Register from "./pages/home/Register";
import DashBoard from "./pages/dashboard/DashBoard";
import Cookies from "./pages/home/Cookies";
import ForgotPassword from "./pages/home/ForgotPassword";
import ForgotPasswordToken from "./pages/home/ForgotPasswordToken";

import './themes/App_Light.scss';

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
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
