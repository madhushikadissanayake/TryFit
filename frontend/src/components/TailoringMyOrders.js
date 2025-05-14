import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TailoringDisplay/TailoringDisplay.css'; // Import the CSS file for styling
import Navi from '../Navi';
import Foot from '../footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; 

const TailoringDisplay = () => {
  const [tailorings, setTailorings] = useState([]);
  const [priceEdits, setPriceEdits] = useState({});
  const [loggedInEmail, setLoggedInEmail] = useState('');

  useEffect(() => {
    // Get logged-in email from sessionStorage
    const email = sessionStorage.getItem('userEmail');
    setLoggedInEmail(email);
    // setLoggedInEmail("abc@gmail.com");

    const fetchTailorings = async () => {
      try {
        const response = await axios.get('http://localhost:3005/api/tailorings');
        const orders = response.data?.response || [];
        // Filter orders based on logged-in email
        const filteredOrders = orders.filter(order => order.email === loggedInEmail);
        setTailorings(filteredOrders);
      } catch (error) {
        console.error('Axios Error: ', error);
      }
    };

    fetchTailorings();
  }, [loggedInEmail]);

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
    try {
      await axios.post('http://localhost:3005/api/deletetailoring', {
        tid: id 
      });
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

  return (
    <div>
      <Navi />

      <div className="sub-navi">
        <div className="search-container">
          
          <div className="search-bar-wrapper">

            {/* Search bar input section */}
            <input
              type="text"
              className="search-bar"
              placeholder="Search items..."
            />
          </div>
        </div>

        <Link to={`/MenCloths`}>
          <div className="cloth-type">Men</div>
        </Link>

        <Link to={`/WomenCloths`}>
          <div className="cloth-type">Women</div>
        </Link>

        <Link to={`/KidsCloths`}>
          <div className="cloth-type">Kids</div>
        </Link>
          
          <div className="cloth-type cloth-suggesions">Suggesions</div>

        <Link to={`/TailoringUI`}>
          <div className="cloth-type">Custom Tailoring</div>
        </Link>
      </div>


      <div className="tailoring-display-container">
        <h1 className="display-title">Tailoring Orders</h1>
        <div className="tailoring-grid">
          { tailorings.map((tailoring) => (
              <div key={tailoring.tid} className="tailoring-card">
                <h2 className="tailoring-id">Order ID: {tailoring.tid}</h2>
                <p><strong>Email:</strong> {tailoring.email}</p>
                <p><strong>Gender:</strong> {tailoring.gender}</p>
                <p><strong>Desired Outfit:</strong> {tailoring.desiredOutfit}</p>
                <p><strong>Negative Outfit:</strong> {tailoring.negativeOutfit}</p>
                <p><strong>Quantity:</strong> {tailoring.qty}</p>
                <p><strong>Price:</strong> LKR.{tailoring.price}</p>
                <p><strong>Status:</strong> <span className={`status ${tailoring.status}`}>{tailoring.status}</span></p>
                <div className="image-container">
                  <img src={tailoring.responseLink} alt="Generated Outfit" className="outfit-image" />
                </div>
                <div className="button-group">
                  <button 
                    className="complete-btn">
                    Checkout
                  </button>
                  
                  <button 
                    className="delete-btn" 
                    onClick={() => deleteOrder(tailoring.tid)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))
         }
        </div>
      </div>
      <Foot />
    </div>
  );
};

export default TailoringDisplay;
