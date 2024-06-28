import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/register', {
        username,
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        phoneNumber,
        address,
      });

      if (response.data.message === 'User registered successfully') {
        navigate('/login'); // Redirect to login page after signup
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    }
  };

  const handleReturnToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label>Username:<span className="required">*</span></label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:<span className="required">*</span></label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:<span className="required">*</span></label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>First Name:<span className="required">*</span></label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name:<span className="required">*</span></label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Date of Birth:<span className="required">*</span></label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button className="signup-button" type="submit">Sign Up</button>
        <button type="button" className="return-button" onClick={handleReturnToLogin}>Return to Login</button>
      </form>
    </div>
  );
}

export default Signup;
