import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
// import { Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import { useAuth } from './context/useAuth';

import Home from "./pages/home/Home";
import Login from "./pages/home/Login";
import Register from "./pages/home/Register";
import DashBoard from "./pages/dashboard/DashBoard";
import Cookies from "./pages/home/Cookies";
import ForgotPassword from "./pages/home/ForgotPassword";

// interface PrivateRouteProps {
//   children: React.ReactNode;
// }

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#fe6f14",
      },
      secondary: {
        main: "#c84f03",
      },
      background: {
        default: "#f7f7f7",
      },
      text: {
        primary: "#383d46",
      },
    },
    typography: {
      fontFamily: "Rubik, sans-serif",
    },
  });

  // const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  //   const { authToken } = useAuth();
  //   return authToken ? <>{children}</> : <Navigate to="/login" />;
  // };

  return (
    <>
      {/* <AuthProvider> */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/forgot-password" element={<ForgotPassword />}></Route>
            <Route path="/dashboard" element={
              // <PrivateRoute>
                <DashBoard />
              /* </PrivateRoute> */
            }>
            </Route>
            <Route path="/cookies" element={<Cookies />}></Route>
          </Routes>
        </ThemeProvider>
      {/* </AuthProvider> */}
    </>
  );
}

export default App;
