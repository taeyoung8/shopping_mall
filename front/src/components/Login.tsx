import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Username:', username, 'Password:', password);
    navigate('/mypage'); // Redirect to My Page after login
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
