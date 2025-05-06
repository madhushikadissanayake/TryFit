// src/components/Login.js
import React, { useState } from 'react';
import './login.css';
import { useNavigate } from "react-router-dom";
import clothingImage from '../../images/clothing.jpg';
import Axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the page from refreshing

    Axios.get('http://localhost:3005/api/customers')
      .then((response) => {
        console.log(response.data);
        const users = response.data.response;

        const user = users.find((u) => u.cusEmail === email);
        console.log(user);

        if (user) {
          if (user.password === password) {
            console.log('Login successful!');

            sessionStorage.setItem('userID', user.cusid);
            sessionStorage.setItem('userEmail', email);
            navigate('/UserHome_C');
            
            
          } else {
            alert('Incorrect password');
          }
        } else {
          if(email === 'admin@gmail.com' && password === 'Admin2024@@'){
            // Save admin email and position in localStorage
            //sessionStorage.setItem('userEmail', email);
            navigate('/Dashboard');
          }
          else{
            alert('User not found');
          }
        }
      })
      .catch((error) => {
        console.error('Failed to fetch users:', error);
      });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <p>Doesn’t have an account yet? <a href="/signUp">Sign Up</a></p>
          
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="input-group">
            <label>Password <a href="/forgotPassword" className="forgot-link">Forgot Password?</a></label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter 6 characters or more"
              required
            />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
          </div>

          <button className="login-btn" type="submit">LOGIN</button>
        </form>

        <div className="login-image">
          <img src={clothingImage} alt="Shopping" />
        </div>
      </div>
    </div>
  );
};

export default Login;