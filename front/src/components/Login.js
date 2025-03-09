import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://backend-lyqe.onrender.com/api/users/login', {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store the token in localStorage
        console.log('User logged in:', response.data.token);
        navigate('/profile');
      } else {
        console.error('Token not found in response');
      }
    } catch (error) {
      console.error('Error logging in:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="tinder-login">
      <form onSubmit={handleSubmit} className="tinder-login__form">
        <h1 className="tinder-login__title">DateApp</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="tinder-login__input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="tinder-login__input"
        />
        <button type="submit" className="tinder-login__button">Sign in</button>
      </form>
    </div>
  );
}

export default Login;