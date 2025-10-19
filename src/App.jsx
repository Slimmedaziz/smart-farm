import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (authResult) => {
    // authResult: { token, user }
    if (authResult && authResult.user) {
      setUser(authResult.user);
      navigate("/dashboard");
    }
  };

  const handleRegister = (authResult) => {
    if (authResult && authResult.user) {
      setUser(authResult.user);
      navigate("/dashboard");
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register onRegister={handleRegister} />} />
      <Route
        path="/dashboard"
        element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
