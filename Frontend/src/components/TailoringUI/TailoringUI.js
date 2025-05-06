import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TailoringUI.css';
import Navi from '../../Navi';
import Foot from '../../footer';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faUser, faCamera  } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import logo from '../../images/logo.jpg';
import { LinearProgress } from "@mui/material";
import ColorDetectionModal from '../ColorDetectionModel/ColorDetectionModel';

const CustomTailoringForm = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');
  const [desiredOutfit, setDesiredOutfit] = useState('');
  const [negativeOutfit, setNegativeOutfit] = useState('');
  const [responseLink, setResponseLink] = useState('');
  const [qty, setQty] = useState(1);
  const [email, setEmail] = useState('abc@gmail.com');
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState('pending');
  const [tid, setTid] = useState(10000);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);
  const [detectedColor, setDetectedColor] = useState("");
  const Useremail = sessionStorage.getItem('userEmail');

  const navigate = useNavigate();

  useEffect(() => {
    setEmail(Useremail);
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countryList = response.data.map((country) => ({
          name: country.name.common,
        }));
        // Sort countries alphabetically by name
        countryList.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryList);
      } catch (error) {
        console.error('Error fetching countries', error);
      }
    };

    fetchCountries();
    fetchMaxIdAndSetId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(desiredOutfit,gender,country, negativeOutfit);
    const colorMessage = ` My Skin Color is ${detectedColor}. I want to make model using this color`;

    const fullOutFit = desiredOutfit + colorMessage;

    console.log('Full message',fullOutFit);

    try {
      const formData = new FormData();
      formData.append('outfit', desiredOutfit);
      formData.append('gender', gender);
      formData.append('country', country);
      formData.append('negative', negativeOutfit);
      formData.append('email', 'madhushikad8@gmail.com');
      formData.append('password', 'abc1234');

      const response = await axios.post('https://thenewblack.ai/api/1.1/wf/clothing', formData);


      const link = response.data; // Adjust according to actual API response
      setResponseLink(link);

      // Log the response link to the console
      console.log('Generated Outfit Link:', link);
      setLoading(false);
      
    } catch (error) {
      console.error('Error submitting form data', error);
    }
  };

  const handleRegenerate = () => {
    // Reload the page
    window.location.reload();
  };

  const fetchMaxIdAndSetId = async () => {
    try {
      const response = await Axios.get('http://localhost:3005/api/getmaxidt');
      const maxId = response.data?.maxId || 10000
      setTid(maxId + 1);

    } catch (error) {
      console.error('Axios Error (getmaxidt): ', error);
    }
  };

  const handleRequestOutfit = async () => {
    const payload = {
      tid: tid,
      email: email,
      responseLink: responseLink,
      gender: gender,
      desiredOutfit: desiredOutfit,
      negativeOutfit: negativeOutfit,
      qty: qty,
      price: price,
      status: status,
    };
    console.log(payload)
    Axios.post('http://localhost:3005/api/createtailoring', payload)
      .then((response) => {
        console.log('Done');
        alert('Successfully Generated Outfit..!')
      })
      .catch((error) => {
        console.error('Axios Error: ', error);
      });
  };
  const handleViewOrders = () => {
    navigate('/TailoringMyOrders');
  };


  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleColorSubmit = (color) => {
    setDetectedColor(color);
    closeModal();
  };

 return (
    <div>
      <div>
        <Navi/>
      </div>

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
      
      <div className="tailoring-container">
          <div className="my-orders-box">
            <div className="box-content">
              <FontAwesomeIcon icon={faUser} className="user-icon" />
              <h2 className="box-title">My Orders</h2>
              <p className="box-description">View and manage your tailoring orders with ease. Check your order status, make changes, and more.</p>
              <div className="button-container">
                <button className="view-orders-btn" onClick={handleViewOrders}>
                  <FontAwesomeIcon icon={faBox} className="box-icon" />
                  View Orders
                </button>
              </div>
            </div>
          </div>
        <div className="form-container1">
          <h1 className="form-title">Custom Tailoring</h1>
          <form onSubmit={handleSubmit} className="custom-tailoring-form">

            <label htmlFor="country">Custom Tailoring Order ID:</label>
            <input
              type="number"
              id="tid"
              value={tid}
              onChange={(e) => setTid(e.target.value)}
              className="form-input"
              readOnly
            />

            <label htmlFor="country">Select Your Country:</label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="form-input"
              placeholder="Select a country"
            >
              <option value="">Select a country</option>
              {countries.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <fieldset className="gender-group">
              <legend>Select Your Gender:</legend>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="man"
                  checked={gender === 'man'}
                  onChange={(e) => setGender(e.target.value)}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="woman"
                  checked={gender === 'woman'}
                  onChange={(e) => setGender(e.target.value)}
                />
                Female
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={gender === 'other'}
                  onChange={(e) => setGender(e.target.value)}
                />
                Other
              </label>
            </fieldset>

            <label htmlFor="desiredOutfit">Describe Your Desired Outfit:</label>
            <textarea
              id="desiredOutfit"
              value={desiredOutfit}
              onChange={(e) => setDesiredOutfit(e.target.value)}
              className="form-input"
              placeholder="Describe the outfit you want"
            />

            <label htmlFor="negativeOutfit">Describe Your Negative Outfit:</label>
            <textarea
              id="negativeOutfit"
              value={negativeOutfit}
              onChange={(e) => setNegativeOutfit(e.target.value)}
              className="form-input"
              placeholder="Describe what you do not want"
            />

            <label htmlFor="qty">Enter Quantity:</label>
            <input
              type="number"
              id="qty"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="form-input"
              placeholder="Enter Quantity"
            />

            <button type="submit" className="submit-button">Generate Outfit</button>
          </form>

          <div style={{ color: "#000000" }}>
                {loading && <LinearProgress />}
          </div>

          {/* Picture Box */}
          <div className="picture-box">
              {responseLink ? (
                <div className="picture-container">
                  <img src={responseLink} alt="Generated Outfit" className="outfit-images" />
                  
                </div>
              ) : (
                <div className="empty-message">
                  <p>No image generated yet. Please submit the form to see the result.</p>
                </div>
              )}
          </div>
            
          <div className="button-container">
            <button onClick={handleRequestOutfit} className="request-button">Request Outfit</button>
            <button onClick={handleRegenerate} className="regenerate-button">Regenerate</button>
          </div>
            
        </div>

        <div className="my-orders-box">
            <div className="box-content">
              <FontAwesomeIcon icon={faCamera} className="user-icon" />
              <h2 className="box-title">Scan Skin Colour</h2>
              <p className="box-description">Capture your skin tone for personalized recommendations. Good lighting enhances accuracy!</p>
              <div className="button-container">
                <div>
                  <button className="view-orders-btn" onClick={openModal}>
                    Scan Body Color
                  </button>
                  <ColorDetectionModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleColorSubmit}
                    hexColor={detectedColor}
                  />
                  {detectedColor && <p>Submitted Color: {detectedColor}</p>}
                </div>
              </div>
            </div>
          </div>

        </div>
      <div>
        <Foot/>
      </div>
    </div>
  );
};

export default CustomTailoringForm;