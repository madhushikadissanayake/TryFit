import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Orders.css';
import Navi from '../../Navi';
import Footer from '../../footer';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { amount } = useParams();

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const response = await Axios.get('http://localhost:3005/api/deliveries');
      const userID = sessionStorage.getItem('userID');
      const userIDInteger = parseInt(userID, 10);
      
      // If userID is not available or not valid, handle appropriately
      if (!userID || isNaN(userIDInteger)) {
        console.warn('User ID not found or invalid');
        return;
      }
      
      const filteredOrders = response.data.response.filter(order => order.dCid === userIDInteger);
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Axios Error: ', error);
    }
  };

  const handleUpdate = (deliveryId, amount, deliveryName, deliveryAddress, zipCode, deliveryPhone) => {
    navigate(`/EditPlaceOrder/${amount}/${deliveryId}`, {
      state: {
        deliveryId,
        deliveryName,
        deliveryAddress,
        zipCode,
        deliveryPhone
      }
    });
  };

  const handleDelete = async (deliveryId) => {
    try {
      const payload = { deliveryId };
      await Axios.post('http://localhost:3005/api/delete-delivery', payload);
      setOrders(orders.filter(order => order.deliveryId !== deliveryId));
      alert('Order successfully Deleted!');
      navigate(`/Orders`);
    } catch (error) {
      console.error('Axios Error (deleteOrder): ', error);
    }
  };

  return (
    <>
      <Navi />
      <div className='header'>Order List</div>

      {/* Search Bar */}
      <div>
        <input
          type="search"
          placeholder="Search by ID, Name or Address"
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="searchBar"
        />
      </div>

      {/* Orders Table */}
      <table className="ordersTable">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Customer Address</th>
            <th>Zip Code</th>
            <th>Phone Number</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders
            .filter(order => {
              const query = searchQuery.toLowerCase();
              const deliveryName = order.deliveryName?.toLowerCase() || '';
              const deliveryAddress = order.deliveryAddress?.toLowerCase() || '';
              const deliveryId = String(order.deliveryId || '');

              return (
                deliveryName.includes(query) ||
                deliveryAddress.includes(query) ||
                deliveryId.includes(query)
              );
            })
            .map((order, index) => (
              <tr key={`order-${order.deliveryId}-${index}`}>
                <td>{order.deliveryId}</td>
                <td>{order.deliveryName}</td>
                <td>{order.deliveryAddress}</td>
                <td>{order.zipCode}</td>
                <td>{order.deliveryPhone}</td>
                <td>LKR {order.amount}</td>
                <td>
                  <button
                    type="button"
                    className="update-order-button"
                    onClick={() => handleUpdate(
                      order.deliveryId,
                      order.amount,
                      order.deliveryName,
                      order.deliveryAddress,
                      order.zipCode,
                      order.deliveryPhone
                    )}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="delete-order-button"
                    onClick={() => handleDelete(order.deliveryId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <Footer />
    </>
  );
};

export default Orders;