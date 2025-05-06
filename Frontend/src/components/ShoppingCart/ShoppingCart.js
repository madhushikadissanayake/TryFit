import React, { useEffect, useState } from 'react';
import Navi from '../../Navi';
import Axios from 'axios';
import '../../CSS/ProductHomeCSS_C.css';
import './ShoppingCart.css';
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { updateStock } from '../StockUpdate_C'; // Import the function, not the component
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Foot from '../../footer';
import { useNavigate } from 'react-router-dom';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#def0f0',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    textDecoration: 'underline',
  },
  item: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDetail: {
    fontSize: 14,
    marginBottom: 3,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
});

const BillGenerator = ({ items, total, carts }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>TRYFIT CART BILL</Text>
        {items.map(item => {
          const filteredCart = carts.find(c => c.id === item.id);
          return (
            <View key={item.id} style={styles.item}>
              <Text>Name : {filteredCart ? filteredCart.name : 'Name not available'}</Text>
              <Text>Quantity : {item.quantity} qty.</Text>
              <Text>Price per one item : {filteredCart ? filteredCart.price  : 'Price not available'} /=</Text>
              <Text>sub total : {filteredCart ? filteredCart.price * item.quantity : 'Price not available'} /=</Text>
            </View>
          );
        })}
        <Text style={styles.total}>Total Amount :  LKR. {total} /=</Text>
      </View>
    </Page>
  </Document>
);

const ShoppingCart = () => {
  const [carts, setCarts] = useState([]); 
  const [carts2, setCarts2] = useState([]); 
  const [total, setTotal] = useState(0);     
  const [imageUrls, setImageUrls] = useState([]);  
  const [searchQuery, setSearchQuery] = useState('');  
  const [billVisible, setBillVisible] = useState(false);
  const [stockUpdating, setStockUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {    
    getCartDetails();   
    getCart();          
  }, []);

  useEffect(() => {      
    const fetchImageUrls = async () => {      
      const urls = await Promise.all(carts.map(async (cart) => {   
        try {
          const filteredCart = carts.find(c => c.id === cart.id); 
          if (!filteredCart || !filteredCart.imgId) {               
            return null;
          }
          const url = await getDownloadURL(ref(storage, `images/${filteredCart.imgId}.jpg`));  
          return { id: cart.id, url };        
        } catch (error) {
          console.error('Error fetching image URL:', error);   
          return null;
        }
      }));
      setImageUrls(urls.filter(url => url !== null));  
    };
    fetchImageUrls();   
  }, [carts]);

  useEffect(() => {       
    let calculatedTotal = 0;  
    carts2
      .filter(cart => cart.email === userEmail)   
      .forEach(cart => {             
        const filteredCart = carts.find(c => c.id === cart.id);  
        if (filteredCart) {      
          calculatedTotal += filteredCart.price * cart.quantity;
        }
      });
    
    setTotal(calculatedTotal);  
  }, [carts, carts2]);

  // Modified to use the updateStock function (not component)
  const handleButtonClick = async (id, stock, quantity, name, sdes, price) => { 
    setStockUpdating(true);
    await updateStock({ 
      productId: id, 
      qty: quantity, 
      stk: stock, 
      type: "remove", 
      name: name, 
      sdes: sdes, 
      price: price 
    });
    setStockUpdating(false);
    window.location.reload(); 
  };

  const getCartDetails = () => { 
    const FetchDetails = () => { 
      Axios.get('http://localhost:3005/api/cloths')
        .then((response) => {
          setCarts(response.data?.response || []); 
        })
        .catch((error) => {
          console.error('Axios Error: ', error); 
        });
    };

    FetchDetails(); 
    const intervalId = setInterval(FetchDetails, 1000); 
    return () => clearInterval(intervalId); 
  };

  const deleteCart = (id) => { 
    Axios.post('http://localhost:3005/api/deletecart', { id: id }) 
      .then((response) => {
        setCarts(prevCarts => prevCarts.filter(cart => cart.id !== id));  
      })
      .catch((error) => {
        console.error('Axios Error: ', error);
      });
  };

  const getCart = () => {  
    Axios.get(`http://localhost:3005/api/getcart`) 
      .then((response) => {
        setCarts2(response.data?.response || []);
      })
      .catch((error) => {
        console.error('Axios Error: ', error);
      });
  };

  const userEmail = sessionStorage.getItem('userEmail');  
  const filteredCarts = carts.filter(cart => cart.email === userEmail);  
  const filteredCartItems = carts2.filter(cart => cart.email === userEmail && 
    (carts.find(c => c.id === cart.id)?.name.toLowerCase().includes(searchQuery.toLowerCase())));  

  const updateCart = (id, quantity) => { 
    Axios.post('http://localhost:3005/api/updateCart', { id: id, quantity: quantity })  
      .then((response) => {
        setCarts2((prevCarts) =>
          prevCarts.map((cart) => (cart.id === id ? { ...cart, quantity: quantity } : cart))
        );
      })
      .catch((error) => {
        console.error('Axios Error: ', error);
      });
  };
  
  // Modified to use the updateStock function (not component)
  const handleIncrement = async (id, stock, name, sdes, price) => { 
    const cartItem = filteredCartItems.find((cart) => cart.id === id); 

    if (cartItem) {
      const newQuantity = cartItem.quantity + 1;   
      if (stock >= 1) {
        setStockUpdating(true);
        updateCart(id, newQuantity); 
        await updateStock({ 
          productId: id, 
          qty: 1, 
          stk: stock, 
          type: "add", 
          name: name, 
          sdes: sdes, 
          price: price 
        });
        setStockUpdating(false);
      } else {
        alert("Stock is zero. Cannot add to cart."); 
      }
    }
  };

  // Modified to use the updateStock function (not component)
  const handleDecrement = async (id, stock, name, sdes, price) => { 
    const cartItem = filteredCartItems.find((cart) => cart.id === id);
    if (cartItem && cartItem.quantity > 1) {
      const newQuantity = cartItem.quantity - 1;
      setStockUpdating(true);
      updateCart(id, newQuantity);
      await updateStock({ 
        productId: id, 
        qty: 1, 
        stk: stock, 
        type: "remove", 
        name: name, 
        sdes: sdes, 
        price: price 
      });
      setStockUpdating(false);
    }
  };
  
  const handlePayNow = (total) => {
    navigate(`/Payment/${total}`);
  };

  return (
    <div>
      <div>
        <Navi />
      </div>
      <div className='shopping-cart'>
        <h2 className='cart-title'>My Cart</h2>
        <div>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}  
            className="search-input"
            aria-label="Search products"
          />
        </div>

        {stockUpdating && (
          <div className="stock-update-message">
            <p>Updating stock...</p>
          </div>
        )}

        {filteredCartItems.map((cart) => {
          const imageUrlObj = imageUrls.find(urlObj => urlObj.id === cart.id); 
          const imageUrl = imageUrlObj ? imageUrlObj.url : null;  
          const filteredCart = carts.find(c => c.id === cart.id); 
          
          if (!filteredCart) return null; // Skip if no matching product found
          
          return (
            <div className="cart-item" key={cart.id}>
              <div className="item-photo">
                {imageUrl ? (
                  <img src={imageUrl} alt={`Photo-${cart.id}`} />
                ) : (
                  <img src="https://t4.ftcdn.net/jpg/05/07/58/41/360_F_507584110_KNIfe7d3hUAEpraq10J7MCPmtny8EH7A.jpg" alt="Placeholder" />
                )}
              </div>
              <div className="item-details">
                <h3 className="item-name">Name : {filteredCart.name}</h3>
                <h3 className="item-price">Quantity : {cart.quantity}</h3>
                <p className="item-price">Price : LKR. {filteredCart.price * cart.quantity}/=</p>
                <div className={`stock-text ${filteredCart.stock === 0 ? 'text-red-500' : ''}`}>
                  <p className="item-price">Remaining stock : {filteredCart.stock === 0 ? 'The stock is over' : filteredCart.stock}</p>
                </div>
              </div>
              <div className="item-actions">
                <button 
                  className="action-button" 
                  onClick={() => handleDecrement(cart.id, filteredCart.stock, filteredCart.name, filteredCart.sdes, filteredCart.price)}
                  disabled={stockUpdating || cart.quantity <= 1}
                >
                  -
                </button>
                <span className="item-quantity">{cart.quantity}</span>
                <button 
                  className="action-button" 
                  onClick={() => handleIncrement(cart.id, filteredCart.stock, filteredCart.name, filteredCart.sdes, filteredCart.price)}
                  disabled={stockUpdating || filteredCart.stock <= 0}
                >
                  +
                </button>
                <button 
                  className="action-button delete-button" 
                  onClick={() => {
                    deleteCart(cart.id); 
                    handleButtonClick(cart.id, filteredCart.stock, cart.quantity, filteredCart.name, filteredCart.sdes, filteredCart.price);
                  }}
                  disabled={stockUpdating}
                >
                  Delete
                </button>
              </div>
            </div>   
          );
        })}
        
        <div className="pdf-download-button">
          <PDFDownloadLink document={<BillGenerator items={filteredCartItems} total={total} carts={carts} />} fileName="bill.pdf">
            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download Bill')}
          </PDFDownloadLink>
        </div>
        
        <div className="total-amount">Total : LKR.{total}</div>

        <div className="pay-now-button-container">
          <button 
            className="pay-now-button" 
            onClick={() => handlePayNow(total)}
            disabled={stockUpdating || total <= 0}
          >
            Pay Now
          </button>
        </div>
      </div>
      
      <div>
        <Foot/>
      </div>
    </div>
  );
};

export default ShoppingCart;