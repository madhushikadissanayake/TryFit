// src/components/ResetPassword.js
import React, { useEffect, useState } from 'react';
import './resetPassword.css'; // Ensure you have this CSS file
import { useNavigate, useLocation } from 'react-router-dom';
import Axios from 'axios';
import Navi from '../../Navi';
import Foot from '../../footer';

const ResetPassword = () => {
  const [user, setUser] = useState({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const userID = sessionStorage.getItem('userID');

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    Axios.get(`http://localhost:3005/api/selected-customer?cusid=${userID}`)
      .then((response) => {
        setUser(response.data.response); // Set the fetched user data
        console.log(response.data); // Log the API response
      })
      .catch((error) => {
        console.error('Axios Error: ', error);
      });
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    if(user.password == currentPassword){
      try {
        const payload = {
          cusid : userID,
          password: newPassword
        }
  
        console.log(payload)
  
        const response = await Axios.post('http://localhost:3005/api/update-customer', payload);
        console.log(response);
        alert('Successfully updated password..')
        navigate('/profile')
  
      } catch (error) {
        console.log(console.error);
      }
    }
    else{
      alert('Current password not correct')
    }
    
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div>
      <Navi/>
    <div className="reset-password-dashboard">
      <div className="sidebar">
        <div className="profile-overview">
          <h3>Account Navigation</h3>
        </div>
        <ul className="nav-list">
          <li className={isActive('/profile')} onClick={() => navigate('/profile')}>Profile Info</li>
          <li className={isActive('/ShoppingCart')} onClick={() => navigate('/ShoppingCart')}>Wishlist</li>
          <li className={isActive('/reset-password')} onClick={() => navigate('/reset-password')}>Reset Password</li>
          <li onClick={() => { alert('Logged out'); navigate('/login'); }}>Logout</li>
        </ul>
      </div>

      <div className="reset-password-container">
        <h2>Reset Password</h2>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <div className="error">{errorMessage}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
        <button onClick={handleResetPassword} className='Reset-Button'>Reset Password</button>
      </div>
    </div>
    <Foot/>
    </div>
  );
};

export default ResetPassword;
