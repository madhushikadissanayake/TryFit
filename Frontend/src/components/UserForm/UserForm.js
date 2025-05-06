import React, { useEffect, useState } from "react";
import { Button, Grid, Input, Typography, LinearProgress, CircularProgress } from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";
import Axios from 'axios';
import { useMediaQuery } from '@mui/material';
import './UserForm_C.css';

// Component for adding or updating Product data
const UserForm = ({ addUser, updateUser, submitted, data, isEdit, setIsEdit }) => {
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [imgId, setImgId] = useState('');
  const [price, setPrice] = useState(0);
  const [sdes, setSdes] = useState('');
  const [des, setDes] = useState('');
  const [item, setItem] = useState('');
  const [stock, setStock] = useState(0);

  const [imageUpload, setImageUpload] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingcy, setLoadingcy] = useState(true);

  useEffect(() => {
    // Set initial data for Create new Product
    if (!submitted || isEdit) {
      setId(0);
      setName('');
      setImgId('');
      setPrice(0);
      setSdes('');
      setDes('');
      setItem('');
      setStock(0);
      setImagePreview(null);
      fetchMaxIdAndSetId();
    }
    if (isEdit) { // Set Existing data for Updating existing Product
      setId(data.id);
      setName(data.name);
      setImgId(data.imgId);
      setPrice(data.price);
      setSdes(data.sdes);
      setDes(data.des);
      setItem(data.item);
      setStock(data.stock);
      setImagePreview(data.imageUrl);
    }
  }, [submitted, isEdit, data]);

  // Get maximum ID from API and set ID for new Product
  const fetchMaxIdAndSetId = async () => {
    try {
      const response = await Axios.get('http://localhost:3005/api/getmaxid');
      const maxId = response.data?.maxId || 0;
      isEdit ? setId(data.id) : setId(maxId + 1);  // set next product id
      setLoadingcy(false);
    } catch (error) {
      console.error('Axios Error (getMaxId): ', error);
    }
  };

  // Upload image in firebase storage
  const uploadFile = async () => {
    if (imageUpload == null) return null;

    const imgX = v4(); // Generate a unique ID for the image
    const imageRef = ref(storage, `images/${imgX}`);  // Saving the image in the firebase path using the generated ID

    try {
      await uploadBytes(imageRef, imageUpload);  // Upload the file to storage
      const url = await getDownloadURL(imageRef); // Get URL of the uploaded image
      setImageUrls((prev) => [...prev, url]);
      return imgX;// Return the generated ID
    } catch (error) {
      console.error(error);
      return null;
    }
  };


  // Function to handle updating Product data
  const handleUserDataUpdate = async () => {
    setLoading(true); // Set loading until upload all data

    try {
      let uploadedImgId = imgId;
      if (imageUpload) {   // Check if there is a new image upload
        uploadedImgId = await uploadFile();  // Upload the new image using previous funtion and get the image ID
      }

      setImgId(uploadedImgId); // Update the image ID in state

      // If in Update product, update the existing Product data, otherwise add a new Product
      isEdit ? updateUser({ id, name, price, sdes, des, item, stock, imgId: uploadedImgId }) : addUser({ id, name, price, sdes, des, item, stock, imgId: uploadedImgId });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Cloase loading after saving data
    }
  };


  //Main Upload button
  const handleSaveButtonClick = async () => {
    await handleUserDataUpdate();
    setIsEdit(false); // Cloase loading after saving data
  };

  //drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setImageUpload(file); // If a picture is drag and drop generate a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Function to handle drag over event
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0]; // Get the selected file from the input
    if (file) {
      setImageUpload(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    < div style={{ color: "#000000" }}>




      {loadingcy ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress size={150} />
        </div>
      ) : (
        <>

          <div id="formStart">
            <h2 className='topicTitle'>{isEdit ? "Update Product Item" : "Add New Product Item"}</h2>
            <form>

              {/* Get Product ID */}
              <label htmlFor="id" className='itemRow'>Product ID: </label>
              <input
                type="number"
                id="id"
                name="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                readOnly
                className='GetItemDetails'
              />
              <br />

              {/* Get Product Name */}
              <label htmlFor="id" className='itemRow'>Product Name: </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='GetItemDetails'
              />
              <br />

              {/* Get Product Price */}
              <label htmlFor="id" className='itemRow'>Product Price: </label>
              <input
                type="number"
                id="price"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === ',') { //Validate entered data
                    e.preventDefault();
                  }
                }}
                className='GetItemDetails'
              />
              <br />

              {/* Get Product Short Description */}
              <label htmlFor="id" className='itemRow'>Short Description: </label>
              <input
                type="text"
                id="sdes"
                name="sdes"
                value={sdes}
                onChange={(e) => setSdes(e.target.value)}
                className='GetItemDetails'
              />
              <br />

              {/* Get Product Long Description */}
              <label htmlFor="id" className='itemRow'>Long Description: </label>
              <input
                type="text"
                id="des"
                name="des"
                value={des}
                onChange={(e) => setDes(e.target.value)}
                className='GetItemDetails'
              />
              <br />


              {/* Get Product Categoryn */}
              <label htmlFor="id" className='itemRow'>Product Category: </label>
              <table style={{ marginLeft: "50px", borderSpacing: "0" }}>
                <tr>
                  <td>
                    <label htmlFor="Trending" style={{ marginRight: "10px", display: "block" }}>
                      Trending
                    </label>
                  </td>
                  <td>
                    <input
                      type="radio"
                      id="Trending"
                      name="item"
                      value="trending"
                      onChange={(e) => setItem(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="formen" style={{ marginRight: "10px" }}>
                      For Men
                    </label>
                  </td>
                  <td>
                    <input
                      type="radio"
                      id="menitem"
                      name="item"
                      value="menitem"
                      onChange={(e) => setItem(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="forwomen" style={{ marginRight: "10px" }}>
                      For Women
                    </label>
                  </td>
                  <td>
                    <input
                      type="radio"
                      id="womenitem"
                      name="item"
                      value="womenitem"
                      onChange={(e) => setItem(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="kidsitem" style={{ marginRight: "10px" }}>
                      For Kids
                    </label>
                  </td>
                  <td>
                    <input
                      type="radio"
                      id="kidsitem"
                      name="item"
                      value="kidsitem"
                      onChange={(e) => setItem(e.target.value)}
                    />
                  </td>
                </tr>
              </table>
              <br />


              {isMobile && (
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <div
                    className="App"
                    style={{
                      width: "80%",
                      height: "250px",
                      border: "2px dashed #ccc",
                      borderRadius: "5px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#9B9B9B",
                    }}
                  >
                    <p>Drag & Drop</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      style={{ display: "none" }}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ width: "80%", height: "180px", marginTop: "10px" }}
                      />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    style={{
                      width: "80%",
                      marginTop: "10px",
                      backgroundColor: "#404040",
                      color: "white",
                      border: "1px solid darkblue",
                      borderRadius: "5px",
                      padding: "10px 15px",
                      cursor: "pointer",
                    }}
                  />
                </Grid>
              )}

              {!isMobile && (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "300px",
                    marginBottom: "20px",
                    marginLeft: "20px",
                  }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div
                    className="App"
                    style={{

                      width: "500px",
                      height: "250px",
                      border: "2px dashed #ccc",
                      borderRadius: "5px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#9B9B9B",
                    }}
                  >
                    <p>Drag & Drop</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      style={{ display: "none" }}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ width: "180px", height: "180px", marginTop: "10px" }}
                      />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    style={{
                      width: "500px",
                      marginTop: "10px",
                      backgroundColor: "#404040",
                      color: "white",
                      border: "1px solid darkblue",
                      borderRadius: "5px",
                      padding: "10px 15px",
                      cursor: "pointer",
                    }}
                  />


                </Grid>
              )}


              {/* Get Product Availabl Stock */}
              <label htmlFor="copies" className='itemRow'>Available Stock: </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={stock}
                defaultValue={0}
                onChange={(e) => setStock(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === '.' || e.key === ',') { //Validate Input data
                    e.preventDefault();
                  }
                }}
                className='GetItemDetails'
              />
              <br />

              <div style={{ color: "#000000" }}>
                {loading && <LinearProgress />}
              </div>

              {/* Add New Product and Update Existing Product Button */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
                <Button
                  sx={{
                    margin: "auto",
                    marginBottom: "20px",
                    backgroundColor: "#0047ab",
                    color: "#ffffff",
                    padding: "10px 50px",
                    "&:hover": {
                      opacity: "0.7",
                      backgroundColor: "#0047ab",
                    },
                  }}
                  onClick={handleSaveButtonClick}
                >
                  {isEdit ? "Update Product" : "Add Product"}
                </Button>

              </div>

            </form>

          </div>

        </>
      )}



    </div>
  );
};

export default UserForm;
