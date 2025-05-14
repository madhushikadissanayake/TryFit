import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TailoringDisplay.css'; // Import the CSS file for styling
import Navi from '../../Navi';
import Foot from '../../footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/logo.jpg';
import { useNavigate } from 'react-router-dom';


const TailoringDisplay = () => {
  const [tailorings, setTailorings] = useState([]);
  const [priceEdits, setPriceEdits] = useState({});
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTailorings = async () => {
      axios.get('http://localhost:3005/api/tailorings')
        .then((response) => {
          setTailorings(response.data?.response || []);
        })
        .catch((error) => {
          console.error('Axios Error: ', error);
        });
    };

    fetchTailorings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.post('http://localhost:3005/api/updatetailoring', {
        tid: id,
        status: status
      });
      setTailorings(prevState =>
        prevState.map(t => t.tid === id ? { ...t, status } : t)
      );
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error);
    }
  };

  const deleteOrder = async (id) => {
    console.log(id);
    try {
      await axios.post('http://localhost:3005/api/deletetailoring', {
        tid:id
        
      });
      console.log("sucess");
      setTailorings(prevState => prevState.filter(t => t.tid !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handlePriceChange = (id, value) => {
    setPriceEdits({ ...priceEdits, [id]: value });
  };

  const updatePrice = async (id) => {
    const newPrice = priceEdits[id];
    if (newPrice && !isNaN(newPrice)) {
      try {
        await axios.post('http://localhost:3005/api/updatetailoring', {
          tid: id,
          price: newPrice
        });
        setTailorings(prevState =>
          prevState.map(t => t.tid === id ? { ...t, price: newPrice } : t)
        );
      } catch (error) {
        console.error('Error updating price:', error);
      }
    } else {
      console.error('Invalid price input');
    }
  };

  const handleLogout =()=>{
    const confirmLogout = window.confirm("Do you want to Logout?");
    if(confirmLogout){
      sessionStorage.setItem('userEmail', 'empty');
      sessionStorage.clear();
      navigate('/login');
    }
  }

  return (
    <div className="containerhome">

    <div className="menu-body">
      <nav>
      <ul className='nav-bar'>
          <li className='logo'><a href='/users'><img src={logo}/></a></li>
          <input type='checkbox' id='check' />
          <span className="menu">
              <li><a href="/users" className="phone-logo"><img src={logo}/></a></li>
              <li><a href="/users">Add Product</a></li>
              <li><a href="/users">Display Product</a></li>
              <li><a href="/TailoringDisplay">Tailoring Orders <i className="fas fa-user"></i></a></li>
              <li><a href="/pmprofile">My Account <i className="fas fa-user"></i></a></li>
              <label for="check" class="close-menu"><i class="fas fa-times"></i></label>
              <li><a onClick={handleLogout}>Logout</a></li>
          </span>
          <label for="check" class="open-menu"><i class="fas fa-bars"></i></label>
      </ul>
      </nav>
    </div>

      
      <div className="tailoring-display-container">
        <h1 className="display-title">Tailoring Orders</h1>
        <div className="tailoring-grid">
          {Array.isArray(tailorings) && tailorings.length > 0 ? (
            tailorings.map((tailoring) => (
              <div key={tailoring.tid} className="tailoring-card">
                <h2 className="tailoring-id">Order ID: {tailoring.tid}</h2>
                <p><strong>Email:</strong> {tailoring.email}</p>
                <p><strong>Gender:</strong> {tailoring.gender}</p>
                <p><strong>Desired Outfit:</strong> {tailoring.desiredOutfit}</p>
                <p><strong>Negative Outfit:</strong> {tailoring.negativeOutfit}</p>
                <p><strong>Quantity:</strong> {tailoring.qty}</p>
                <p><strong>Price:</strong> LKR.{tailoring.price}</p>
                <div className="price-edit-container">
                  <input
                    type="number"
                    placeholder="Enter new price"
                    value={priceEdits[tailoring.tid] || ''}
                    onChange={(e) => handlePriceChange(tailoring.tid, e.target.value)}
                    className="price-input"
                  />
                  <button 
                    className="update-price-btn" 
                    onClick={() => updatePrice(tailoring.tid)}>
                    Update Price
                  </button>
                </div>
                <p><strong>Status:</strong> <span className={`status ${tailoring.status}`}>{tailoring.status}</span></p>
                <div className="image-container">
                  <img src={tailoring.responseLink} alt="Generated Outfit" className="outfit-image" />
                </div>
                <div className="button-group">
                  <button 
                    className="complete-btn" 
                    onClick={() => updateStatus(tailoring.tid, 'completed')}>
                    Complete
                  </button>
                  <button 
                    className="reject-btn" 
                    onClick={() => updateStatus(tailoring.tid, 'rejected')}>
                    Reject
                  </button>
                  <button 
                    className="pending-btn" 
                    onClick={() => updateStatus(tailoring.tid, 'pending')}>
                    Pending
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => deleteOrder(tailoring.tid)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No tailoring orders available.</p>
          )}
        </div>
      </div>
      <Foot />
    </div>
  );
};

export default TailoringDisplay;
