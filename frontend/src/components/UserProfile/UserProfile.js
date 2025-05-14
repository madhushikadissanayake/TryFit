import React, { useEffect, useState } from 'react';
import './userProfile.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Axios from 'axios';
import Navi from '../../Navi';
import Foot from '../../footer';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
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

  const handleLogout = () => {
    alert('Logged out');
    navigate('/login');
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSaveClick = () => {

    console.log(user.firstName);

    const payload = {
      cusid : userID,
      firstName : user.firstName,
      lastName : user.lastName,
      cusNumber : user.cusNumber,
      cusAddress : user.cusAddress
    }
    Axios.post('http://localhost:3005/api/update-customer', payload)
      .then((response) => {
        alert('Profile updated successfully!');
        setIsEditing(false);
        getUsers(); // Fetch the updated data
      })
      .catch((error) => {
        console.error('Error updating profile: ', error);
      });
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div>
      <Navi/>
    <div className="profile-dashboard">
      <div className="sidebar">
        <div className="profile-overview">
          <img className="profile-pic" src={selectedImage ? URL.createObjectURL(selectedImage) : user.profilePic} alt="Profile" />
          {!isEditing && <h3>{user.firstName} {user.lastName}</h3>}
          {isEditing && (
            <div>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
          )}
        </div>
        <ul className="nav-list">
          <li className={isActive('/profile')} onClick={() => navigate('/profile')}>Profile Info</li>
          <li className={isActive('/ShoppingCart')} onClick={() => navigate('/ShoppingCart')}>Wishlist</li>
          <li className={isActive('/reset-password')} onClick={() => navigate('/reset-password')}>Reset Password</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      <div className="profile-details-section">
        <h2>Profile Information</h2>
        {!isEditing ? (
          <div className="profile-details">
            <div className="info-group">
              <label>First Name:</label>
              <p>{user.firstName}</p>
            </div>
            <div className="info-group">
              <label>Last Name:</label>
              <p>{user.lastName}</p>
            </div>
            <div className="info-group">
              <label>Email:</label>
              <p>{user.cusEmail}</p>
            </div>
            <div className="info-group">
              <label>Phone:</label>
              <p>{user.cusNumber}</p>
            </div>
            <div className="info-group">
              <label>Address:</label>
              <p>{user.cusAddress}</p>
            </div>
            <button className="edit-btn" onClick={handleEditClick}>Edit Profile</button>
          </div>
        ) : (
          <div className="profile-details">
            <div className="info-group">
              <label>Email:</label>
              <input
                type="email"
                value={user.cusEmail || ''}
                onChange={(e) => setUser({ ...user, cusEmail: e.target.value })}
                readOnly
              />
            </div>
            <div className="info-group">
              <label>First Name:</label>
              <input
                type="text"
                value={user.firstName || ''}
                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              />
            </div>
            <div className="info-group">
              <label>Last Name:</label>
              <input
                type="text"
                value={user.lastName || ''}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              />
            </div>
            <div className="info-group">
              <label>Phone:</label>
              <input
                type="text"
                value={user.cusNumber || ''}
                onChange={(e) => setUser({ ...user, cusNumber: e.target.value })}
              />
            </div>
            <div className="info-group">
              <label>Address:</label>
              <input
                type="text"
                value={user.cusAddress || ''}
                onChange={(e) => setUser({ ...user, cusAddress: e.target.value })}
              />
            </div>
            <button className="save-btn" onClick={handleSaveClick}>Save Changes</button>
          </div>
        )}
      </div>
    </div>
    <Foot/>
    </div>
  );
};

export default UserProfile;
