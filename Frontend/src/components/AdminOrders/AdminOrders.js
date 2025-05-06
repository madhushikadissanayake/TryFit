import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import './AdminOrders.css';
import Navi from '../../Navi';
import Footer from '../../footer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    border: '2px solid #ddd',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  delivery: {
    marginBottom: 10,
    padding: 10,
    borderBottom: '1px solid #ddd',
  },
  deliveryID: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#444444',
  },
  deliveryName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  deliveryAddress: {
    fontSize: 12,
    color: '#555555',
  },
  deliveryPhone: {
    fontSize: 12,
    color: '#555555',
  },
  amount: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#000000',
  },
});

const GenerateReceipt = ({ orders, amount }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Your Orders Receipt</Text>
        {orders.map(order => (
          <View key={order.id} style={styles.delivery}>
            <Text style={styles.deliveryName}>Name: {order.deliveryName}</Text>
            <Text style={styles.deliveryAddress}>Address: {order.deliveryAddress}</Text>
            <Text style={styles.deliveryPhone}>Phone Number: {order.deliveryPhone}</Text>
            <Text style={styles.amount}>Total Amount: LKR. {order.amount} /=</Text>
          </View>
        ))}

      </View>
    </Page>
  </Document>
);
const AdminOrders = () => {
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
      setOrders(response.data.response); // Assuming response.data.response contains the delivery data
    } catch (error) {
      console.error('Axios Error: ', error);
    }
  };

  const handleDelete = async (deliveryId) => {
    console.log('Delete order with deliveryId:', deliveryId);
    try {

      const payload = {
        deliveryId: deliveryId
      }
      await Axios.post('http://localhost:3005/api/delete-delivery', payload);
      setOrders(orders.filter((order) => order.deliveryId !== deliveryId));  // Update state

      console.log("sucess");
      alert('Order successfully Deleted!');
      navigate(`/AdminOrders`)
    } catch (error) {
      console.error('Axios Error (deleteOrder): ', error);
    }
  };

  return (
    <>
      <div>
        <Navi />
      </div>
      <div className='header' >Order List</div>
      {/* Search by name..."  */}
      <div>
        <input type="search" placeholder="Search by ID, Name or Address" aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} className="searchBar" />

      </div>
      <button type='button' className="pdfButton">
        <PDFDownloadLink document={<GenerateReceipt orders={orders} amount={orders.amount} />} fileName="receipt.pdf">
          {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download Bill')}
        </PDFDownloadLink>
      </button>
      <table className="ordersTable">
        <thead>
          <tr>
            <th scope="col">Order ID</th>
            <th scope="col">Customer Name</th>
            <th scope="col">Customer Address</th>
            <th scope="col">Zip Code</th>
            <th scope="col">Phone Number</th>
            <th scope="col">Total Amount</th>

            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.filter((order) => {
            const query = searchQuery.toLowerCase();
            // Handle undefined fields by converting to strings
            const deliveryName = order.deliveryName?.toLowerCase() || '';
            const deliveryAddress = order.deliveryAddress?.toLowerCase() || '';
            const deliveryId = order.deliveryId?.toString() || '';

            return (
              deliveryName.includes(query) || // Search by name
              deliveryAddress.includes(query) || // Search by Address
              deliveryId.includes(query) // Search by ID
            );

          })
            .map((order) => (
              <tr key={order.deliveryId}>
                <td>{order.deliveryId}</td>
                <td>{order.deliveryName}</td>
                <td>{order.deliveryAddress}</td>
                <td>{order.zipCode}</td>
                <td>{order.deliveryPhone}</td>
                <td>LKR {order.amount}</td>

                <td>

                  <button type="button" class="delete-order-button" onClick={() => handleDelete(order.deliveryId)}>Delete</button>

                </td>
              </tr>
            ))}

        </tbody>
      </table>

      <Footer />

    </>

  );
};
export default AdminOrders;