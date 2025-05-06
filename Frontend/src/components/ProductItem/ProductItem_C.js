import React, { useState, useEffect } from 'react';
import { CircularProgress} from '@mui/material';
import { Link } from 'react-router-dom'; 
import '../../index.css';
import './ProductItemCSS_C.css';
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { FaShoppingCart } from 'react-icons/fa';
import StockUpdate_C from '../StockUpdate_C';
import createCart from '../createCart';

const ProductItem_C = ({ rows }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  // Getting loged email address using session
  useEffect(() => {
    const email = sessionStorage.getItem('userEmail');
    setUserEmail(email);
  }, []);

  useEffect(() => {
    
    //Getting Image in firebase storage using image id 
    const fetchImageUrls = async () => {
      const urls = await Promise.all(rows.map(async (row) => {
        try {
          const url = await getDownloadURL(ref(storage, `images/${row.imgId}.jpg`));
         
          return { id: row.id, url };
        } catch (error) {
          console.error('Error fetching image URL:', error);
          return null;
        }
      }));
      setImageUrls(urls.filter(url => url !== null));
      setLoading(false); 
    };
    fetchImageUrls();
  }, [rows]);

    
  return (
    <div>

      {/* Display Product Data in given data */}
      {rows.map((row) => {
        const imageUrlObj = imageUrls.find(urlObj => urlObj.id === row.id); // Find the image URL for the current block
        const imageUrl = imageUrlObj ? imageUrlObj.url : null;
        
        return (
          <div className="flex" key={row.id}> 
            <div className="product-container">

               {/* NAvigate to the ProductDetails_C.js page */}
                <Link to={`/ProductDetails_C`} state={{ row }}>
                <div className="image-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {loading ? (
                    <div>
                      <CircularProgress size={70} />
                    </div>
                  ) : (
                    <>
                      {imageUrl ? ( //Display current block image
                        <img src={imageUrl} alt={`Photo-${row.id}`} />
                      ) : (
                        <img src="https://t4.ftcdn.net/jpg/05/07/58/41/360_F_507584110_KNIfe7d3hUAEpraq10J7MCPmtny8EH7A.jpg" alt="Placeholder" />
                      )}
                    </>
                  )}
                </div>

              </Link>

               {/*Display other details */}
              <div className="product-details">
                <div className="product-name">
                  <div className="name-tag">{row.name}</div>
                </div>
                <div className="price">
                  <p className="price-text">LKR. {parseFloat(row.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="quantity">
                  <div className="quantity-controls">
                  <button className="decrement" onClick={handleDecrement} style={{ color: 'black' }}>-</button>
                    <input type="number" className="quantity-input" value={quantity} min="1" style={{ width: '40px' }} onChange={(e) => setQuantity(Number(e.target.value))}/>
                  <button className="increment" onClick={handleIncrement} style={{ color: 'black' }}>+</button>
                  </div>
                <button 
                    className={`add-to-cart ${row.stock === 0 ? 'disabled' : ''}`}
                    onClick={() => {
                      if (userEmail) {
                        if (row.stock === 0) {
                          alert("Stock is zero. Cannot add to cart.");
                        } else {
                          //pass data for update the product stock 
                          StockUpdate_C({ productId: row.id, qty: quantity, stk: row.stock, type: "add", name: row.name, sdes: row.sdes, price: row.price });
                          //pass data for Create cart
                          createCart({ productId: row.id, qty: quantity, stk: row.stock });
                        }
                      } else {
                        //Display loging message if user not login in the web page
                        const confirmLogin = window.confirm("Please login to add to cart. Do you want to login now?");
                        if (confirmLogin) {
                          window.location.href = "/login"; //Navigate to the login page
                        }
                      }
                    }}
                  >
                    <span className="add-text">Add</span>
                  </button>
                </div>

                 {/*Display Product stock or out of stock message */}
                <div className="stock-info">
                  <div className="stock-indicator"></div>
                  <div className={`stock-text-stock ${row.stock === 0 ? 'text-red-500' : ''}`}  style={{ fontSize: '13px' }}>
                    {row.stock === 0 ? 'Out of stock' : `${row.stock} pcs. in stock`}
                  </div>

                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductItem_C;
