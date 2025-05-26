import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles.css";
import Button from "../components/Common/Button";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { login as loginApi } from "../services/api.js";
import { Typography } from "@mui/material";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setIsLoading(true);
      const data = await loginApi(email, password);
      if (data.token) {
        login(data);
        toast.success("Login successful!");
        
        // Redirect to the page they tried to visit or dashboard
        const from = location.state?.from || "/dashboard";
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(error.message || "Invalid credentials. Try demo@example.com / demo123 or your registered email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className="login-heading">
          Login to CryptoTracker<span style={{ color: "var(--blue)" }}>.</span>
        </h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <Button 
            text={isLoading ? "Logging in..." : "Login"} 
            onClick={handleSubmit}
            disabled={isLoading}
          />
          <Typography variant="body2" style={{ textAlign: 'center', marginTop: '1rem' }}>
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/signup')}
              style={{ color: 'var(--blue)', cursor: 'pointer' }}
            >
              Sign Up
            </span>
          </Typography>
        </form>
      </div>
    </div>
  );
}

export default Login; 