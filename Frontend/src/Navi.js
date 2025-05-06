import React, { useState, useEffect } from 'react';
import './CSS/navi.css';
import logo from './images/logo.jpg';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const NaviBar = () => {

  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    const email = sessionStorage.getItem('userEmail');
    setUserEmail(email);
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Do you want to Logout?");
    if (confirmLogout) {
      sessionStorage.setItem('userEmail', 'empty');
      sessionStorage.clear();
      navigate('/login');
    }
  }

  return (
    <div className="menu-body">
      <nav>
        <ul className='nav-bar'>
          <li className='logo'><a href='/'><img src={logo} alt="Logo" /></a></li>
          <input type='checkbox' id='check' />
          <span className="menu">
            <li><a href="/UserHome_C" className="phone-logo"><img src={logo} alt="Logo" /></a></li>
            <li><a href="/UserHome_C">Home</a></li>
            <li><a href="/Orders">My orders</a></li>

            {userEmail && (
              <li><a href="/ShoppingCart"> Cart <i className="fa-solid fa-cart-shopping"></i></a></li>
            )}

            {userEmail && (
              <li><a href="/PlaceOrder"> Delivery <i className="fa-solid fa-cart-shopping"></i></a></li>
            )}

            {userEmail && (
              <li><a href="/bodymeasurement">Body Measurement</a></li>
            )}
          </span>
          <label htmlFor="check" className="open-menu"><i className="fas fa-bars"></i></label>
          <div className="user-links">
            {!userEmail && (
              <>
                <li><a href="/login">Login</a></li>
                <li><a href="/signUp">Sign Up</a></li>
              </>
            )}
            {userEmail && (
              <>
                <li><a href="/profile">My Account <i className="fas fa-user"></i></a></li>
                <label htmlFor="check" className="close-menu"><i className="fas fa-times"></i></label>
                <li><a href="#" onClick={handleLogout}>Logout</a></li>
              </>
            )}
          </div>
        </ul>
      </nav>
    </div>

  );
};

export default NaviBar;
