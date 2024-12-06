import { Routes, Route } from "react-router-dom";
import HomeLayout from "./pages/Home/HomeLayout";
import Home from "./pages/Home/home";
import AuthLayout from "./pages/auth/AuthLayout";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";

export default function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Home />} />
    </Routes>
  );
}
