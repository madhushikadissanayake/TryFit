// src/components/Signup.js
import React, { useState, useEffect } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cusid, setCusid] = useState(0);

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaxIdAndSetId();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const payload = {
        cusid: cusid,
        firstName: firstName,
        lastName: lastName,
        cusEmail: email,
        cusAddress: address,
        cusNumber: phone,
        password: password,
      };

      Axios.post('http://localhost:3005/api/create-customer', payload)
        .then((response) => {
          console.log('Done');
          alert('Successfully created account..!');
          navigate('/login');
        })
        .catch((error) => {
          console.error('Axios Error: ', error);
        });
    }
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!firstName) {
      formErrors.firstName = "First Name is required.";
      isValid = false;
    }

    if (!lastName) {
      formErrors.lastName = "Last Name is required.";
      isValid = false;
    }

    if (!email) {
      formErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Email address is invalid.";
      isValid = false;
    }

    if (!address) {
      formErrors.address = "Address is required.";
      isValid = false;
    }

    if (!phone) {
      formErrors.phone = "Phone number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(phone)) {
      formErrors.phone = "Phone number must be exactly 10 digits.";
      isValid = false;
    }

    if (!password) {
      formErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const fetchMaxIdAndSetId = async () => {
    try {
      const response = await Axios.get('http://localhost:3005/api/getcus-maxid');
      const maxId = response.data?.maxId || 0;
      setCusid(maxId + 1);
    } catch (error) {
      console.error('Axios Error (getMaxId): ', error);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>

          <div className="input-group-register">
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
          </div>

          <div className="input-group-register">
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
          </div>

          <div className="input-group-register">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="input-group-register">
            <label>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              required
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="input-group-register">
            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="input-group-register">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password"
              required
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button className="signup-btn" type="submit">Sign Up</button>

          <p>Already have an account? <a href="/login">Login here</a></p>
        </form>
      </div>
    </div>
  );
};

export default Register;
