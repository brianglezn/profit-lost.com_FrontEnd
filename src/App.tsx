import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashBoard from "./pages/DashBoard";
import Cookies from "./pages/Cookies";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/app" element={<DashBoard />}></Route>
        <Route path="/cookies" element={<Cookies />}></Route>
      </Routes>
    </>
  );
}

export default App;
