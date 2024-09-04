import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Forget from "./pages/Forget";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import './App.css';
import React from "react";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;
