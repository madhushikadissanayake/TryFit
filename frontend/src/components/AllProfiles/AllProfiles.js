import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import './AllProfiles.css';
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
  cusid: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  firstName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  cusEmail: {
    fontSize: 12,
    color: '#555555',
  },
  cusAddress: {
    fontSize: 12,
    color: '#555555',
  },
  cusNumber: {
    fontSize: 12,
    color: '#555555',
  },
  password: {
    fontSize: 12,
    color: '#555555',
  },
});

const GenerateReceipt = ({ orders, amount }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>All Customers Details</Text>
        {orders.map(order => (
          <View key={order.cusid} style={styles.delivery}>
            <Text style={styles.firstName}>Customer Name: {order.firstName} {order.lastName}</Text>
            <Text style={styles.cusid}>Customer ID: {order.cusid}</Text>
            <Text style={styles.cusEmail}>Customer Email Address: {order.cusEmail}</Text>
            <Text style={styles.cusAddress}>Customer Address: {order.cusAddress}</Text>
            <Text style={styles.cusNumber}>Customer Phone Number: {order.cusNumber}</Text>
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
      const response = await Axios.get('http://localhost:3005/api/customers');
      setOrders(response.data.response); // Assuming response.data.response contains the delivery data
    } catch (error) {
      console.error('Axios Error: ', error);
    }
  };

  const handleDelete = async (cusid) => {
    console.log('Delete order with cusid:', cusid);
    try {

      const payload = {
        cusid: cusid
      }
      await Axios.post('http://localhost:3005/api/delete-customer', payload);
      setOrders(orders.filter((order) => order.cusid !== cusid));  // Update state

      console.log("sucess");
      alert('Customer successfully Deleted!');
      navigate(`/AllProfiles`)
    } catch (error) {
      console.error('Axios Error (cusid): ', error);
    }
  };

  return (
    <>
      <div>
        <Navi />
      </div>
      <div className='header' >Active User List</div>
      {/* Search by name..."  */}
      <div>
        <input type="search" placeholder="Search by ID, Name or Address" aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} className="searchBar" />

      </div>
      <button type='button' className="pdfButton">
        <PDFDownloadLink document={<GenerateReceipt orders={orders} />} fileName="All User List.pdf">
          {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download Report')}
        </PDFDownloadLink>
      </button>
      <table className="ordersTable">
        <thead>
          <tr>
            <th scope="col">Customer ID</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Email Address</th>
            <th scope="col">Customer Address</th>
            <th scope="col">Phone Number</th>
            <th scope='col'>Password</th>

            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.filter((order) => {
            const query = searchQuery.toLowerCase();

            // Convert fields to strings safely, use empty string if undefined or null
            const cusid = (order.cusid || '').toString().toLowerCase();
            const firstName = (order.firstName || '').toLowerCase();
            const cusEmail = (order.cusEmail || '').toLowerCase();

            return (
              cusid.includes(query) || // Search by ID
              firstName.includes(query) || // Search by first name
              cusEmail.includes(query) // Search by email
            );
          })
            .map((order) => (
              <tr key={order.cusid}>
                <td>{order.cusid}</td>
                <td>{order.firstName}</td>
                <td>{order.lastName}</td>
                <td>{order.cusEmail}</td>
                <td>{order.cusAddress}</td>
                <td>{order.cusNumber}</td>
                <td>{order.password}</td>
                <td>
                  <button type="button" class="delete-order-button" onClick={() => handleDelete(order.cusid)}>Delete</button>
                </td>
              </tr>
            ))
          }
        </tbody>

      </table>

      <Footer />

    </>

  );
};
export default AdminOrders;