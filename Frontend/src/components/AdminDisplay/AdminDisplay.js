import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from "@mui/material";
import { Paper } from "@mui/material";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import StockUpdate_C from '../../components/StockUpdate_C';
import logoImage from '../../images/logo.jpg';
import './AdminDisplay.css';

//PDF generation - Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  table: {
    width: '100%',
    border: '1px solid #000',
    borderCollapse: 'collapse',
    marginBottom: 20,
    fontSize: 12,
  },
  tableRow: {
    borderBottom: '1px solid #000',
  },
  tableCell: {
    padding: 8,
    borderRight: '1px solid #000',
  },

  topic: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    padding: 10,
    marginTop: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginRight: 50,
  },
  date: {
    fontSize: 12,
    marginBottom: 2,
    color: '#666',
  },
});

// Getting all details in the Users.js file
const AdminDisplay = ({ rows, selectedUser, deleteUser }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const [loadingcy, setLoadingcy] = useState(true); //Use loading spinner untill geting details in the mongodb
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBarFocused, setSearchBarFocused] = useState(false);
  const [stockup, setStockUp] = useState(0);


  // Getting product image in the firebase storage using imageId
  useEffect(() => {
    const fetchImageUrls = async () => {
      const urls = await Promise.all(rows.map(async (row) => {
        try {
          const url = await getDownloadURL(ref(storage, `images/${row.imgId}`));  // get image using saving path
          return { id: row.id, url };
        } catch (error) {
          console.error('Error fetching image URL:', error);
          return null;
        }
      }));
      setImageUrls(urls.filter(url => url !== null));
      setLoadingcy(false);  // finishing loading spinner
    };
    fetchImageUrls();
  }, [rows]);

  //handle update button click Function
  const handleUpdateButtonClick = (id) => {
    const selectedUserData = rows.find(row => row.id === id);
    selectedUser(selectedUserData);
  };

  //handle category button click Funtion
  const handleCategoryButtonClick = (category) => {
    setSelectedCategory(category);
  };

  const currentDate = new Date().toLocaleString();
  //Generating pdf file using 'data' parameter
  const MyDocument = ({ data }) => (

    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logoImage} style={styles.logo} />
          <View>
            <Text style={styles.date}>Generated Product pdf on: {currentDate}</Text>
            <Text style={styles.topic}>Available Item List on TryFit</Text>
          </View>
        </View>
        <View style={styles.table}>
          {data.map((row) => (
            <View key={row.id} style={styles.tableRow}>
              <Text style={styles.tableCell}> Product ID : {row.id}</Text>
              <Text style={styles.tableCell}> Product Name : {row.name}</Text>
              <Text style={styles.tableCell}> Available Stock : {row.stock}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  // Filtering rows based on selected category and search word
  const filteredRows = selectedCategory === 'All' ? rows :  // If category is 'All', show all rows
    selectedCategory === 'outstock' ? rows.filter(row => row.stock === 0) :  // If category is 'outstock', filter rows with stock equal to 0
      rows.filter(row => row.item === selectedCategory);  //filter rows based on Clicked category

  //filter visible rows based on search word
  const visibleRows = searchTerm.trim() === '' ? [] : filteredRows.filter(row => { // If search term is empty, show no rows
    const searchTermLowerCase = searchTerm.toLowerCase();  // Convert case-insensitive search
    return row.name.toLowerCase().includes(searchTermLowerCase) || row.id.toString().includes(searchTermLowerCase);   // Return rows given name or ID includes the search word or number
  });

  //handle Quik stock update button click Funtion
  const handleStockButtonClick = (id) => {
    StockUpdate_C({ productId: id, stk: stockup, type: "admin" });  //pass details in the stockupdate page for the update new stock
  };

  // Starting return function
  return (
    <div className="mb-8">
      {loadingcy ?   //Display CircularProgress until getting the details in the mongodb
        (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress size={150} />
          </div>
        ) : (
          <>
            {/* Category buttons */}
            <div className="mb-25">
              <button onClick={() => handleCategoryButtonClick('All')} className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mr-2 mb-2">All Items</button>
              <button onClick={() => handleCategoryButtonClick('trending')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2">Trending Items</button>
              <button onClick={() => handleCategoryButtonClick('menitem')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2">For Men Items</button>
              <button onClick={() => handleCategoryButtonClick('kidsitem')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2">For Women Items</button>
              <button onClick={() => handleCategoryButtonClick('womenitem')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2">For Kids Items</button>
              <button onClick={() => handleCategoryButtonClick('outstock')} className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mr-2 mb-2">Out Of Stock</button>

              {selectedCategory && (
                <PDFDownloadLink document={<MyDocument data={filteredRows} />} fileName={`${selectedCategory}Products.pdf`} className="bg-red-900 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2 ml-32">
                  {({ blob, url, loading, error }) => (loading ? 'Download PDF' : 'Download PDF')}
                </PDFDownloadLink>
              )}
            </div>

            {/* Search bar */}
            <input
              type="text"
              className="block flex-grow px-2 py-1 mb-8 mt-8 text-blue-900 bg-white border border-blue-900 rounded-full focus:border-blue-900 focus:ring-blue-900 focus:outline-none focus:ring focus:ring-opacity-40 sm:px-4 sm:py-2 sm:text-base"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}  //pass search data
              onFocus={() => setSearchBarFocused(true)}
              onBlur={() => setSearchBarFocused(false)}
            />

            {/* Table Titles */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Photo</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Short Description</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Stock Update</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>


                  {/* Display Product Data in relevent search word or id */}
                  {visibleRows.map((row) => {
                    const imageUrlObj = imageUrls.find(urlObj => urlObj.id === row.id); // Find the image URL for the current row
                    const imageUrl = imageUrlObj ? imageUrlObj.url : null;
                    return (
                      // Display a table row for each product

                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>
                          {imageUrl ? (
                            //Display relevent image 
                            <img src={imageUrl} alt={`Photo-${row.id}`} style={{ width: '50px', height: '50px' }} />
                          ) : (
                            <div>No Image</div> //Do not have image display No image 
                          )}
                        </TableCell>
                        {/* Display Other Product Details */}
                        <TableCell>{row.price}</TableCell>
                        <TableCell>{row.sdes}</TableCell>
                        <TableCell>{row.des}</TableCell>
                        <TableCell>{row.item}</TableCell>
                        <TableCell>{row.stock} </TableCell>

                        {/* stock update with input field and button */}
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              id="stockup"
                              name="stockup"
                              value={row.stockup}
                              defaultValue={0}
                              min={0}
                              onChange={(e) => setStockUp(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === '-' || e.key === 'e' || e.key === '.' || e.key === ',') { //Validate input data
                                  e.preventDefault();
                                }
                              }}

                              className="border border-blue-500 px-2 py-1 rounded w-24"
                            />
                            <button
                              onClick={handleStockButtonClick.bind(null, row.id)}
                              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                            >
                              Update Stock
                            </button>
                          </div>
                          {/* Buttons for updating and deleting the Selected product */}
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleUpdateButtonClick(row.id)}>Update</Button>
                          <Button onClick={() => deleteUser({ id: row.id })}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}


                  {/* Display Product Data based on Selectd category */}
                  {filteredRows.map((row) => {
                    const imageUrlObj = imageUrls.find(urlObj => urlObj.id === row.id);  // Find the image URL for the current row
                    const imageUrl = imageUrlObj ? imageUrlObj.url : null;
                    return (
                      // Display a table row for each product
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>
                          {imageUrl ? (//Display relevent image 
                            <img src={imageUrl} alt={`Photo-${row.id}`} style={{ width: '50px', height: '50px' }} />
                          ) : (
                            <div>No Image</div> //Do not have image display No image 
                          )}
                        </TableCell>
                        {/* Display Other Product Details */}
                        <TableCell>{row.price}</TableCell>
                        <TableCell>{row.sdes}</TableCell>
                        <TableCell>{row.des}</TableCell>
                        <TableCell>{row.item}</TableCell>
                        <TableCell>{row.stock}</TableCell>

                        {/* stock update with input field and button */}
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              id="stockup"
                              name="stockup"
                              value={row.stockup}
                              defaultValue={0}
                              min={0}
                              onChange={(e) => setStockUp(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === '-' || e.key === 'e' || e.key === '.' || e.key === ',') { //Validate input data
                                  e.preventDefault();
                                }
                              }}

                              className="border border-blue-500 px-2 py-1 rounded w-24"
                            />
                            <button
                              onClick={handleStockButtonClick.bind(null, row.id)}
                              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                            >
                              Update Stock
                            </button>
                          </div>
                        </TableCell>

                        {/* Buttons for updating and deleting the Selected product */}
                        <TableCell>
                          <button
                            onClick={() => handleUpdateButtonClick(row.id)}
                            className="admin-update-button">Update
                          </button>

                          <button
                            onClick={() => deleteUser({ id: row.id })}
                            className="admin-delete-button">Delete
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
    </div>
  );
};

export default AdminDisplay;