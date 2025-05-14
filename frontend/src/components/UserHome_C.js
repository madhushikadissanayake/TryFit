import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, TextField,  Dialog, DialogContent } from '@mui/material';
import ProductItem_C from './ProductItem/ProductItem_C';
import { Link } from 'react-router-dom'; 
import Navi from '../Navi';
import Footer from '../footer';
import Axios from 'axios';
import { AiOutlinePlus ,AiOutlineSearch } from 'react-icons/ai';
import '../CSS/ProductHomeCSS_C.css';
import image1 from '../images/banner1.png';
import image2 from '../images/banner2.png';
import image3 from '../images/banner3.png';

const UserHome_C = () => {
  const [users, setUsers] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showAllBook, setShowAllBook] = useState(false);
  const [showAllSchool, setShowAllSchool] = useState(false);
  const [showAllTech, setShowAllTech] = useState(false);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBarFocused, setSearchBarFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [category, setCategory] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

   //Getting Product Details using url
    const getUsers = () => {
      const fetchUsers = () => {
        Axios.get('http://localhost:3005/api/cloths')
          .then((response) => {
            setUsers(response.data?.response || []);
            setLoading(false); 
          })
          .catch((error) => {
            console.error('Axios Error: ', error);
          });
      };

      fetchUsers();
      const intervalId = setInterval(fetchUsers, 1000); //Update Getting Details every 1 second
      return () => clearInterval(intervalId);
    };

   // Filtering rows based on search word
   const filteredUsers = users.filter(user => {
    if (searchTerm.trim() === '') {
      return false; // If search word is empty, hide all items
    } else {
      return user.name.toLowerCase().includes(searchTerm.toLowerCase()); // Return rows given search
    }
  });

 
  let visibleUsers;
  if (searchBarFocused) {
    visibleUsers = filteredUsers;
  } else {
    visibleUsers = showAll ? users : filteredUsers.slice(0, 8);
  }

// Filter Products based on item category
  const trendingItems = users.filter(user => user.item === 'trending');
  const visibleTrending = showAllBook ? trendingItems : trendingItems.slice(0, 8);

  const menItems = users.filter(user => user.item === 'menitem');
  const visibleMen = showAll ? menItems : menItems.slice(0, 8);

  const womenItem = users.filter(user => user.item === 'womenitem');
  const visibleWomen = showAll ? womenItem : womenItem.slice(0, 8);

  const kidsItem  = users.filter(user => user.item === 'kidsitem');
  const visibleKids = showAll ? kidsItem : kidsItem.slice(0, 8);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };


  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      toggleDropdown(); // Close the dropdown after navigation
    }
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };


//Filter Function
  const handleOkButtonClick = () => {
 
    const filtered = users.filter(user => {
      const isInPriceRange = (user.price >= minPrice && user.price <= maxPrice); //Check min price and max price
      const isMatchingCategory = (user.item === category); //check category
      return isInPriceRange && isMatchingCategory; // return matched products
    });
    // Update the state variable with filtered items
    setFilteredItems(filtered);
    console.log(filteredItems);
    // Close the form
    setShowForm(false);
  };

  //clear filtered and searched item history
  const clearFilteredItems = () => {
    setFilteredItems([]);
    setSearchTerm('');
  };

  const images = [image1, image2, image3];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  useEffect(() => {
    const intervalId = setInterval(nextSlide, 10000); // Change slide every 10 seconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  return (
    
    <div className="w-calc(100% - 100px) mx-auto mt-2 lg:ml-2 lg:mr-2" style={{ backgroundColor: "#EEEBEB" }}>
      <div>
        <Navi/>
      </div>
      
      {loading ? (
           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
           <CircularProgress size={150} />
         </div>
      ) : (
        <>
      
      <div className="sub-navi">
        <div className="search-container">
          
          <div className="search-bar-wrapper">

            {/* Search bar input section */}
            <input
              type="text"
              className="search-bar"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchBarFocused(true)}
              onBlur={() => setSearchBarFocused(false)}
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
          
        <Link to={`/Recommend`}>
          <div className="cloth-type">Suggesions</div>
        </Link>

        <Link to={`/TailoringUI`}>
          <div className="cloth-type">Custom Tailoring</div>
        </Link>
      </div>

    <div className="slideshow-container">
      <div className="slideshow-slide fade">
        <img
          src={images[currentIndex]}
          className="slideshow-image"
          alt={`Image ${currentIndex + 1}`}
        />
      </div>

      <a className="prev" onClick={prevSlide}>
        &#10094;
      </a>
      <a className="next" onClick={nextSlide}>
        &#10095;
      </a>
    </div>


 {/* Trending Items Products Section */}
 <div className="trending-section">
    <div id="book-items-section">
      <div className="section-header-trending">
        <div>Trending</div>
        <div className="shop-now-btn">
        <Link to={`../Recommend`}>
          <button> Shop Now</button>
        </Link>
        </div>
      </div>
      <div className="product-grid">
        {visibleTrending.map((user) => (   //Display all Trending items product
          <div key={user.id} className="product-item">
            <ProductItem_C rows={[user]} /> 
          </div>
        ))}
      </div>
    </div>
  </div>

 {/* Men Items Products Section */}
  <div className="other-section">
    <div id="book-items-section">
      <div className="section-header">
        <div>SHOP FOR MEN</div>
        <div className="shop-now-btn">
        <Link to={`/MenCloths`}>
          <button> Shop Now</button>
        </Link>
        </div>
      </div>
      <div className="product-grid">
        {visibleMen.map((user) => (   //Display all Men items product
          <div key={user.id} className="product-item">
            <ProductItem_C rows={[user]} /> 
          </div>
        ))}
      </div>
    </div>
  </div>
 
 {/* Women Items Products Section */}
 <div className="other-section">
    <div id="book-items-section">
      <div className="section-header">
        <div>SHOP FOR WOMEN</div>
        <div className="shop-now-btn">
        <Link to={`/WomenCloths`}>
          <button> Shop Now</button>
        </Link>
        </div>
      </div>
      <div className="product-grid">
        {visibleWomen.map((user) => (   //Display all Women items product
          <div key={user.id} className="product-item">
            <ProductItem_C rows={[user]} /> 
          </div>
        ))}
      </div>
    </div>
  </div>

 
  <div className="other-section">
    <div id="book-items-section">
      <div className="section-header">
        <div>SHOP FOR KIDS</div>
        <div className="shop-now-btn">
        <Link to={`/KidsCloths`}>
          <button> Shop Now</button>
        </Link>
        </div>
      </div>
      <div className="product-grid">
        {visibleKids.map((user) => (   //Display all kids and baby items product
          <div key={user.id} className="product-item">
            <ProductItem_C rows={[user]} /> 
          </div>
        ))}
      </div>
    </div>
  </div>

 {/* Call footer section */}
      <div>
        <Footer/>
      </div>
      </>
      )}
    </div>
      
  );
};

export default UserHome_C;
