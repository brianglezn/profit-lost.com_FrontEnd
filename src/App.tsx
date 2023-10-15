import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashBoard from "./pages/DashBoard";
import Cookies from "./pages/Cookies";
import ForgotPassword from "./pages/ForgotPassword";

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

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
          <Route path="/dashboard" element={<DashBoard />}></Route>
          <Route path="/cookies" element={<Cookies />}></Route>
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
