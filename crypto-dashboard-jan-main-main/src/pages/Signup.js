import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import Button from '../components/Common/Button';
import './styles.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }

    try {
      setIsLoading(true);
      const data = await register(email, password);
      if (data.token) {
        login(data);
        toast.success('Registration successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className="login-heading">
          Sign Up to CryptoTracker<span style={{ color: "var(--blue)" }}>.</span>
        </h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="login-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            text={isLoading ? "Creating Account..." : "Sign Up"}
            onClick={handleSubmit}
            disabled={isLoading}
          />
          <Typography variant="body2" style={{ textAlign: 'center', marginTop: '1rem' }}>
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{ color: 'var(--blue)', cursor: 'pointer' }}
            >
              Login
            </span>
          </Typography>
        </form>
      </div>
    </div>
  );
}

export default Signup; 