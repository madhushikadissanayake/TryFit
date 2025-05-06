import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './PlaceOrder/PlaceOrder.css';
import Navi from '../Navi';
import Foot from '../footer';

const EditPlaceOrder = () => {
  const { amount, deliveryId } = useParams();
  const location = useLocation();
  
  // Extracting values passed via state with default values
  const { 
    deliveryName: initialDeliveryName = '',
    deliveryAddress: initialDeliveryAddress = '', 
    zipCode: initialZipCode = '', 
    deliveryPhone: initialDeliveryPhone = '' 
  } = location.state || {};

  const [deliveryName, setDeliveryName] = useState(initialDeliveryName);
  const [deliveryAddress, setDeliveryAddress] = useState(initialDeliveryAddress);
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [deliveryPhone, setDeliveryPhone] = useState(initialDeliveryPhone);
  const [userEmail, setUserEmail] = useState('');
  const [currentAmount, setCurrentAmount] = useState(amount || '');

  const [deliveryNameError, setDeliveryNameError] = useState('');
  const [deliveryAddressError, setDeliveryAddressError] = useState('');
  const [zipCodeError, setZipCodeError] = useState('');
  const [deliveryPhoneError, setDeliveryPhoneError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const email = sessionStorage.getItem('userEmail');
    setUserEmail(email);
    
    // Only fetch delivery details if we don't have the data from location.state
    if (!initialDeliveryName || !initialDeliveryAddress) {
      fetchDeliveryDetails();
    }
  }, [initialDeliveryName, initialDeliveryAddress, userEmail]);

  const fetchDeliveryDetails = async () => {
    try {
      // Check if your API supports fetching by ID
      // If not, we'll use the existing API and filter by ID
      const response = await Axios.get('http://localhost:3005/api/deliveries');
      
      if (response.data && response.data.response) {
        const deliveries = response.data.response;
        const delivery = deliveries.find(d => d.deliveryId.toString() === deliveryId.toString());
        
        if (delivery) {
          setDeliveryName(delivery.deliveryName);
          setDeliveryAddress(delivery.deliveryAddress);
          setZipCode(delivery.zipCode);
          setDeliveryPhone(delivery.deliveryPhone);
          setCurrentAmount(delivery.amount || amount);
        } else {
          console.error('No delivery found with ID:', deliveryId);
        }
      } else {
        console.error('No delivery data found');
      }
    } catch (error) {
      console.error('Error fetching delivery details:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const payload = {
        deliveryId: deliveryId,
        deliveryName: deliveryName,
        deliveryAddress: deliveryAddress,
        zipCode: zipCode,
        deliveryPhone: deliveryPhone,
        amount: currentAmount,
        deliveryEmail: userEmail
      };
      
      try {
        console.log('Sending update payload:', payload);
        const response = await Axios.post('http://localhost:3005/api/update-delivery', payload);
        
        console.log('Update response:', response.data);
        
        // Assume the update is successful if we get a response and no error
        alert('Successfully Updated Delivery Details');
        navigate('/Orders');
      } catch (error) {
        console.error('Update Error:', error);
        
        // More detailed error handling
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error('Error response:', error.response.data);
          alert(`Update failed: ${error.response.data.message || 'Server error'}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
          alert('Update failed: No response from server. Please check your connection.');
        } else {
          // Something happened in setting up the request
          alert(`Update failed: ${error.message}`);
        }
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
  
    // Validate delivery name
    if (!deliveryName?.trim()) {
      setDeliveryNameError('Name is required');
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(deliveryName.trim())) {
      setDeliveryNameError('Delivery Name must contain only letters');
      isValid = false;
    } else {
      setDeliveryNameError('');
    }
  
    // Validate delivery address
    if (!deliveryAddress?.trim()) {
      setDeliveryAddressError('Delivery Address is required');
      isValid = false;
    } else if (deliveryAddress.trim().length < 5) {
      setDeliveryAddressError('Please enter a valid Delivery Address');
      isValid = false;
    } else {
      setDeliveryAddressError('');
    }
  
    // Validate zip code
    if (!zipCode?.toString().trim()) {
      setZipCodeError('Zip Code is required');
      isValid = false;
    } else if (!/^\d{5}$/.test(zipCode.toString().trim())) {
      setZipCodeError('Zip Code should be 5 digits');
      isValid = false;
    } else {
      setZipCodeError('');
    }
  
    // Validate delivery phone
    if (!deliveryPhone?.trim()) {
      setDeliveryPhoneError('Phone Number is required');
      isValid = false;
    } else if (!/^[0]\d{9}$/.test(deliveryPhone.trim())) {
      setDeliveryPhoneError('Phone Number should be 10 digits and start with 0');
      isValid = false;
    } else {
      setDeliveryPhoneError('');
    }
  
    return isValid;
  };
  
  const handleDeliveryNameChange = (e) => {
    setDeliveryName(e.target.value);
    setDeliveryNameError('');
  };
  
  const handleDeliveryAddressChange = (e) => {
    setDeliveryAddress(e.target.value);
    setDeliveryAddressError(''); 
  };
  
  const handleZipCodeChange = (e) => {
    setZipCode(e.target.value);
    setZipCodeError(''); 
  };
  
  const handleDeliveryPhoneChange = (e) => {
    setDeliveryPhone(e.target.value);
    setDeliveryPhoneError(''); 
  };
  
  const handleAmountChange = (e) => {
    setCurrentAmount(e.target.value);
  };

  return (
    <div>
      <Navi />
  
      <div className='orderForm'>
        <form onSubmit={handleUpdate}>
          <div className='title'>Update Delivery Details</div>
          
          <div className="mb-3">
            <label htmlFor="userName" className="form-label">Enter Your Name</label>
            <input 
              type="text" 
              name="userName" 
              value={deliveryName || ''} 
              className="form-control form-control-lg"  
              onChange={handleDeliveryNameChange} 
              required
            />
            {deliveryNameError && <span className="error">{deliveryNameError}</span>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="userAddress" className="form-label">Enter Your Address</label>
            <input 
              type="text" 
              value={deliveryAddress || ''} 
              className="form-control form-control-lg" 
              name="userAddress" 
              onChange={handleDeliveryAddressChange}
              required
            />
            {deliveryAddressError && <span className="error">{deliveryAddressError}</span>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="zipcode" className="form-label">Enter zipcode</label>
            <input 
              type="number" 
              value={zipCode || ''} 
              className="form-control form-control-lg" 
              name="zipcode" 
              onChange={handleZipCodeChange}
              required
            />
            {zipCodeError && <span className="error">{zipCodeError}</span>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">Enter Your Phone Number</label>
            <input 
              type="text" 
              value={deliveryPhone || ''} 
              className="form-control form-control-lg" 
              name="phoneNumber" 
              onChange={handleDeliveryPhoneChange}
              required
            />
            {deliveryPhoneError && <span className="error">{deliveryPhoneError}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="userAmount" className="form-label">Enter Payment Amount</label>
            <input 
              type="text" 
              name="userAmount" 
              value={currentAmount || ''} 
              className="form-control form-control-lg"
              onChange={handleAmountChange}  
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-lg">Update</button>
        </form>
      </div>

      <Foot />
    </div>
  );
};

export default EditPlaceOrder;