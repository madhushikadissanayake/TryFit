import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaCheck, FaVideo, FaVideoSlash } from 'react-icons/fa';
import './TryOn.css'; // We'll create this next

const TryOn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};
  
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState('Mens'); // Default to Mens
  const [availableItems, setAvailableItems] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:5000');
  
  // Create a session when component mounts
  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/create_session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const data = await response.json();
        setSessionId(data.session_id);
        
        // Set category based on product data if available
        if (product && product.category) {
          // Determine category logic
          let categoryToUse = 'Mens'; // Default
          
          const productNameLower = (product.name || '').toLowerCase();
          if (product.category) {
            // Use the specified category if it's one of our valid categories
            const validCategory = ['Mens', 'Womens', 'Kids'].find(
              cat => cat.toLowerCase() === product.category.toLowerCase()
            );
            if (validCategory) {
              categoryToUse = validCategory;
            }
          } else if (productNameLower.includes('women') || productNameLower.includes('ladies')) {
            categoryToUse = 'Womens';
          } else if (productNameLower.includes('kid') || productNameLower.includes('child')) {
            categoryToUse = 'Kids';
          }
          
          setCategory(categoryToUse);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error creating session:', error);
        setIsLoading(false);
      }
    };
    
    createSession();
    
    // Cleanup when unmounting
    return () => {
      // Any cleanup code if needed
    };
  }, [product]);
  
  // Fetch available items when category changes
  useEffect(() => {
    if (category && !isLoading && sessionId) {
      fetchItems(category);
    }
  }, [category, isLoading, sessionId]);
  
  // Fetch items for the selected category
  const fetchItems = async (selectedCategory) => {
    try {
      const response = await fetch(`${apiBaseUrl}/get_items/${selectedCategory}`);
      const data = await response.json();
      
      if (data.items) {
        setAvailableItems(data.items);
        
        // Auto-select first item
        if (data.items.length > 0) {
          selectItem(data.items[0].name);
        } else {
          // Clear selection if no items available
          setSelectedItemName(null);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${selectedCategory} items:`, error);
      setAvailableItems([]);
    }
  };
  
  // Select an item to try on
  const selectItem = async (itemName) => {
    try {
      const response = await fetch(`${apiBaseUrl}/select_item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          category: category,
          item_name: itemName
        })
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setSelectedItemName(itemName);
      }
    } catch (error) {
      console.error('Error selecting item:', error);
    }
  };
  
  // Toggle debug mode
  const toggleDebug = async () => {
    const newDebugState = !showDebug;
    try {
      await fetch(`${apiBaseUrl}/toggle_debug`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          show_debug: newDebugState
        })
      });
      
      setShowDebug(newDebugState);
    } catch (error) {
      console.error('Error toggling debug mode:', error);
    }
  };
  
  // Handle back button click - fixed functionality
  const handleBackButton = () => {
    navigate(-1);
  };
  
  // Toggle camera on/off
  const toggleCamera = () => {
    setCameraOn(!cameraOn);
  };
  
  // Change category
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };
  
  // Render category tabs
  const renderCategoryTabs = () => {
    const categories = ['Mens', 'Womens', 'Kids'];
    
    return (
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${category === cat ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    );
  };
  
  // Render loading state
  if (isLoading || !sessionId) {
    return (
      <div className="try-on-container loading">
        <div className="loading-message">
          <div className="spinner"></div>
          <p>Loading Virtual Try-On...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="try-on-container">
      <div className="try-on-header">
        <button className="back-button" onClick={handleBackButton}>
          <FaChevronLeft /> Back
        </button>
        <h1>Virtual Try-On</h1>
        <div className="header-right">
          <button 
            className={`debug-toggle ${showDebug ? 'active' : ''}`}
            onClick={toggleDebug}
          >
            Show Pose Detection
          </button>
        </div>
      </div>
      
      <div className="try-on-content">
        <div className="video-container">
          {sessionId && cameraOn ? (
            <img 
              src={`${apiBaseUrl}/video_feed/${sessionId}`} 
              alt="Virtual Try-On" 
              className="video-feed"
            />
          ) : (
            <div className="camera-off-message">
              <p>Camera is turned off</p>
              <p>Turn on the camera to try on items</p>
            </div>
          )}
        </div>
        
        <div className="controls-sidebar">
          {renderCategoryTabs()}
          
          <div className="items-container">
            <h3>Select an Item</h3>
            {availableItems.length > 0 ? (
              <div className="items-grid">
                {availableItems.map((item) => (
                  <div 
                    key={item.name}
                    className={`item-thumbnail ${selectedItemName === item.name ? 'selected' : ''}`}
                    onClick={() => selectItem(item.name)}
                  >
                    <img src={item.thumbnail} alt={item.name} />
                    <span className="item-name">{item.name.split('.')[0]}</span>
                    {selectedItemName === item.name && (
                      <div className="selected-indicator"><FaCheck /></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-items-message">No items available in this category</p>
            )}
          </div>
          
          <div className="action-buttons">
            <button 
              className={`toggle-camera-button ${cameraOn ? 'camera-on' : 'camera-off'}`} 
              onClick={toggleCamera}
            >
              {cameraOn ? (
                <>
                  <FaVideoSlash /> Turn Camera Off
                </>
              ) : (
                <>
                  <FaVideo /> Turn Camera On
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryOn;