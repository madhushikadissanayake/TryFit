import React, { useState } from 'react';
import './forgotPassword.css';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
   if(newPassword===confirmPassword){
    GetCustomerDetails();
   }
   else{
    alert('Password are not matched..!');
   }
  };

  const GetCustomerDetails = async () => {
    try {
      const response = await Axios.get('http://localhost:3005/api/customers');
      console.log(response)
      const users = response.data.response;
      const user = users.find((u) => u.cusEmail === email);

      if(user){
        const payload = {
          cusid: user.cusid,
          password: newPassword,
        };
        Axios.post('http://localhost:3005/api/update-customer', payload)
          .then((response) => {
            console.log('Done');
            alert('Successfully Forget your Password..');
            navigate('/login');
          })
          .catch((error) => {
            console.error('Axios Error: ', error);
          });
      }
      else{
        alert('User Not Found..!')
      }
      
    } catch (error) {
      console.error('Axios Error (getMaxId): ', error);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <h2>Forgot Password</h2>
          <p>Please enter your details to reset your password.</p>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="input-group">
            <label>Phone number</label>
            <input
              type="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="input-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
            />
          </div>

          <button className="reset-btn" type="submit">Reset Password</button>

          <p><a href="/login">Back to Login</a></p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;