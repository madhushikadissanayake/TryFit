import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import ProductItem_C from '../ProductItem/ProductItem_C';
import { Link } from 'react-router-dom'; 
import Navi from '../../Navi';
import Foot from '../../footer';
import Axios from 'axios';
import '../../CSS/ProductHomeCSS_C.css';

const Recommend = () => {
  const [users, setUsers] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    const intervalId = setInterval(fetchUsers, 1000); // Refresh every second
    return () => clearInterval(intervalId);
  }, []);

  // Filter items based on stock greater than 30 and search term
  const filteredItems = users
    .filter(user => user.stock > 30)
    .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Limit visible items to 8 if not showing all
  const visibleItems = showAll ? filteredItems : filteredItems.slice(0, 10);

  // Filter Products based on item category
  // Filter Products based on item category
  const visibleTrending = visibleItems.filter(user => user.item === 'trending');
  const visibleMen = visibleItems.filter(user => user.item === 'menitem');
  const visibleWomen = visibleItems.filter(user => user.item === 'womenitem');
  const visibleKids = visibleItems.filter(user => user.item === 'kidsitem');

  return (
    <div className="w-calc(100% - 100px) mx-auto mt-2 lg:ml-2 lg:mr-2" style={{ backgroundColor: "#EEEBEB" }}>
      <Navi />
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress size={150} />
        </div>
      ) : (
        <>
          <div className="sub-navi">
            <div className="search-container">
              <input
                type="text"
                className="search-bar"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
           
              />
            </div>

            {/* Navigation Links */}
            <Link to="/MenCloths"><div className="cloth-type">Men</div></Link>
            <Link to="/WomenCloths"><div className="cloth-type">Women</div></Link>
            <Link to="/KidsCloths"><div className="cloth-type">Kids</div></Link>
            <Link to="/Recommend"><div className="cloth-type">Suggestions</div></Link>
            <Link to="/TailoringUI"><div className="cloth-type">Custom Tailoring</div></Link>
          </div>

          {/* All Items Products Section */}
          <div className="other-section">
            <div id="book-items-section">
              <div className="section-header"><div>SHOP ALL ITEMS</div></div>
              <div className="product-grid">
                {visibleTrending.map(user => (
                  <div key={user.id} className="product-item">
                    <ProductItem_C rows={[user]} /> 
                  </div>
                ))}
                {visibleMen.map(user => (
                  <div key={user.id} className="product-item">
                    <ProductItem_C rows={[user]} /> 
                  </div>
                ))}
                {visibleWomen.map(user => (
                  <div key={user.id} className="product-item">
                    <ProductItem_C rows={[user]} /> 
                  </div>
                ))}
                {visibleKids.map(user => (
                  <div key={user.id} className="product-item">
                    <ProductItem_C rows={[user]} /> 
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Foot />
        </>
      )}
    </div>
  );
};

export default Recommend;
