import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUserFirstName: (firstName: string | null) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated, setUserFirstName }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/login', { username, password });
      if (response.data.success) {
        setIsAuthenticated(true);
        setUserFirstName(response.data.firstName);
        localStorage.setItem('token', response.data.token); // 토큰을 localStorage에 저장
        navigate('/mypage'); // Redirect to My Page after login
      } else {
        // Handle login error
        console.error('Login failed:', response.data.message);
      }
    } catch (err) {
      // Handle error
      console.error('Error logging in:', err);
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    // Add your forgot password logic here
    console.log('Forgot Password clicked');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <div className="additional-buttons">
        <button type="button" onClick={handleSignUp}>Sign Up</button>
        <button type="button" onClick={handleForgotPassword}>Forgot Username/Password?</button>
      </div>
    </div>
  );
}

export default Login;
