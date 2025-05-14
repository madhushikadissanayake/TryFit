import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import './ProductDetailsCSS_C.css';
import 'tailwindcss/tailwind.css';
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { FaShoppingCart, FaCamera } from 'react-icons/fa';
import { updateStock } from '../StockUpdate_C';
import Navi from '../../Navi';
import Foot from '../../footer';
import createCart from '../createCart'; 
import AddFeedback from '../Feedback/addFeedback.js';

const ProductDetails_C = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { row } = location.state || {};
  const { addToCart } = location.state || {};
  
  const [quantity, setQuantity] = useState(1);
  const [imageUrl, setImageUrl] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // State variables for color and size
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  
  // Define available colors and sizes for the product
  const availableColors = ['Black', 'White', 'Green', 'Red', 'Violet'];
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Check if we returned from try-on with addToCart flag
  useEffect(() => {
    if (addToCart) {
      handleAddToCart();
    }
  }, [addToCart]);

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  // Handle color selection
  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  // Handle size selection
  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  // Getting Image in firebase storage using image id
  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const url = await getDownloadURL(ref(storage, `images/${row.imgId}.jpg`));
        setImageUrl(url);
      } catch (error) {
        console.error('Error fetching image URL:', error);
        // Set a default image URL if fetching fails
        setImageUrl('https://t4.ftcdn.net/jpg/05/07/58/41/360_F_507584110_KNIfe7d3hUAEpraq10J7MCPmtny8EH7A.jpg');
      }
    };

    fetchImageUrl();
    
    // Set default selections for color and size if available
    if (availableColors.length > 0) {
      setSelectedColor(availableColors[0]);
    }
    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    }
  }, [row]);

  // Handle try-on button click - navigate to the TryOn page
  const handleTryOn = () => {
    if (!selectedColor || !selectedSize) {
      alert("Please select a color and size before trying on");
      return;
    }
    
    // Navigate to the try-on page and pass product data
    navigate('/try-on', { 
      state: { 
        product: {
          ...row,
          selectedColor,
          selectedSize,
          imgId: row.imgId
        }
      }
    });
  };

  const handleAddToCart = async () => {
    if (row.stock === 0) {
      alert("Stock is zero. Cannot add to cart.");
      return;
    }
    
    // Validate that color and size are selected
    if (!selectedColor) {
      alert("Please select a color");
      return;
    }
    
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    
    setIsAdding(true);
    
    try {
      // First create the cart item with additional color and size properties
      await createCart({ 
        productId: row.id, 
        qty: quantity, 
        stk: row.stock,
        color: selectedColor,
        size: selectedSize
      });
      
      // Then update the stock
      await updateStock({ 
        productId: row.id, 
        qty: quantity, 
        stk: row.stock, 
        type: "add", 
        name: row.name, 
        sdes: row.sdes, 
        price: row.price 
      });
      
      // Show a success message
      alert(`Item added to cart: ${selectedColor}, Size: ${selectedSize}`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  // Function to render color swatches
  const renderColorOptions = () => {
    return (
      <div className="color-selection mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Color
        </label>
        <div className="flex flex-wrap gap-4 justify-center">
          {availableColors.map((color) => (
            <div 
              key={color} 
              className={`color-option ${selectedColor === color ? 'selected' : ''}`}
            >
              <label className="cursor-pointer flex items-center">
                <input
                  type="radio"
                  name="color"
                  value={color}
                  checked={selectedColor === color}
                  onChange={handleColorChange}
                  className="hidden"
                />
                <span 
                  className={`color-swatch w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-blue-500' : 'border-gray-300'}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                ></span>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Function to render size options
  const renderSizeOptions = () => {
    return (
      <div className="size-selection mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Size
        </label>
        <div className="flex flex-wrap gap-2 justify-center">
          {availableSizes.map((size) => (
            <div 
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`size-option cursor-pointer px-4 py-2 border rounded ${
                selectedSize === size ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
              }`}
            >
              {size}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navi/>
      
      <div className="product-container1 flex">
        {/* Display Product Image */}
        <div className="product-image">
          {imageUrl && <img className="product-size" src={imageUrl} alt={`Photo-${row.id}`} />}
        </div>
        <div className="product-detailss">
          {/* Display Other data in selected item */}
          <h2 className="product-name">{row.name}</h2>
          <p className="product-description">{row.sdes}</p>
          <p className="product-description">{row.des}</p>
          <p className="product-price">LKR. {row.price}</p>
          
          {/* Color Selection */}
          {renderColorOptions()}
          
          {/* Try-On Button - Updated to navigate to TryOn page */}
          <div className="try-on-section mt-6">
            <button 
              className="try-on-button" 
              onClick={handleTryOn}
            >
              <FaCamera className="camera-icon mr-2" />
              Virtual Try-On
            </button>
          </div>
          
          {/* Size Selection */}
          {renderSizeOptions()}
          
          <div className="product-controls mt-6">
            <div className="quantity-controls">
              <button className="decrement" onClick={handleDecrement} style={{ color: 'black' }}>-</button>
              <input 
                type="number"
                className="quantity-input"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
              />
              <button className="increment" onClick={handleIncrement} style={{ color: 'black' }}>+</button>
            </div>
            <button
              className={`add-to-cart ${row.stock === 0 || isAdding ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={row.stock === 0 || isAdding}
            >
              <span className="add-text">{isAdding ? 'Adding...' : 'Add'}</span>
            </button>
          </div>
          <div className="stock-info">
            <div className="stock-indicator"></div>
            <div className={`stock-text ${row.stock === 0 ? 'text-red-500' : ''}`}>
              {row.stock === 0 ? 'Out of stock' : `${row.stock} pcs. in stock`}
            </div>
          </div>
        </div>
      </div>
      <div>
        <AddFeedback productId={row.id}/>
      </div>
      <Foot/>
    </div>
  );
};

export default ProductDetails_C;