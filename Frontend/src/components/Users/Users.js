import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import UserForm from '../UserForm/UserForm';
import AdminDisplay from '../AdminDisplay/AdminDisplay';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Foot from '../../footer';
import '../../CSS/navi.css';
import logo from '../../images/logo.jpg';
import './Users.css';

const Users = () => {
  // Create useStates
  const [users, setUsers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [displayTable, setDisplayTable] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    getUsers();
  }, []);

  //Getting Product Details using url
  const getUsers = () => {
      const getAdminDetails = () => {
        Axios.get('http://localhost:3005/api/cloths')//http://localhost:3001/api/cloths  https://book-shop-dep.vercel.app/api/users
          .then((response) => {
            setUsers(response.data?.response || []);
          })
          .catch((error) => {
            console.error('Axios Error: ', error);
          });
      };
      getAdminDetails();
      const intervalId = setInterval(getAdminDetails, 1000);  //Update Getting Details every 1 second
      return () => clearInterval(intervalId);
  };


  // Add new Product Items in the online store
  const addUser = (data) => {
    setSubmitted(true);
    setIsEdit(false);

    // create Payload for the create new product record
    const payload = {
      id: data.id,
      name: data.name,
      imgId: data.imgId,
      price: data.price,
      sdes: data.sdes,
      des: data.des,
      item: data.item,
      stock: data.stock,
    };

    // Create new Product using url
    Axios.post('http://localhost:3005/api/createcloth', payload)//http://localhost:3001/api/createuser  https://book-shop-dep.vercel.app/api/createuserv
      .then((response) => {
        getUsers();
        setSubmitted(false);
        setDisplayTable(true);
      })
      .catch((error) => {
        console.error('Axios Error: ', error);
      });
  };


  // Add new Product Items in the online store
  const updateUser = (data) => {
    setSubmitted(true);
    setIsEdit(false);

    // create Payload for the Update new product record
    const payload = {
      id: data.id,
      name: data.name,
      imgId: data.imgId,
      price: data.price,
      sdes: data.sdes,
      des: data.des,
      item: data.item,
      stock: data.stock,
    };

    // Update existing product using this url
    Axios.post('http://localhost:3005/api/updatecloth', payload)//http://localhost:3001/api/updateuser  https://book-shop-dep.vercel.app/api/updateuser
      .then((response) => {
        getUsers();
        setSubmitted(false);
        setDisplayTable(true);
      })
      .catch((error) => {
        console.error('Axios Error: ', error);
      });
  };

  // Delete existing product using this url
  const deleteUser = (data) => {
    alert("Do you want to delete this product ..!")
    Axios.post('http://localhost:3005/api/deletecloth', data)//http://localhost:3001/api/deleteuser  https://book-shop-dep.vercel.app/api/deleteuser
      .then((response) => {
        getUsers();
      })
      .catch((error) => {
        console.error('Axios Error: ', error);
      });
  };

  // Display all product item button set
  const handleDisplayButtonClick = () => {
    setDisplayTable(true);
    setSelectedUser({});
    setIsEdit(false);
  };

  const handleLogout =()=>{
    const confirmLogout = window.confirm("Do you want to Logout?");
    if(confirmLogout){
      sessionStorage.setItem('userEmail', 'empty');
      sessionStorage.clear();
      navigate('/login');
    }
  }

  // Start return
  return (
    <div className="containerhome">

{/* Product Manager Navigation bar */}
    <div className="menu-body">
      <nav>
      <ul className='nav-bar'>
          <li className='logo'><a href='/users'><img src={logo}/></a></li>
          <input type='checkbox' id='check' />
          <span className="menu">
              <li><a href="/users" className="phone-logo"><img src={logo}/></a></li>
              <li><a href="/users">Add Product</a></li>
              <li><a href="#" onClick={handleDisplayButtonClick}>Display Product</a></li>
              <li><a href="/TailoringDisplay">Tailoring Orders <i className="fas fa-user"></i></a></li>
              <li><a href="/pmprofile">My Account <i className="fas fa-user"></i></a></li>
              <label for="check" className="close-menu"><i className="fas fa-times"></i></label>
              <li><a onClick={handleLogout}>Logout</a></li>
          </span>
          <label for="check" className="open-menu"><i className="fas fa-bars"></i></label>
      </ul>
      </nav>
    </div>
      
    <Box sx={{ width: 'calc(100% - 100px)', margin: 'auto', marginTop: '40px' }}>
      
      {displayTable ? (
        <AdminDisplay  // Call all product items display page
          rows={users} //Pass all product details getting in the api
          selectedUser={(user) => {  
            setSelectedUser(user);
            setIsEdit(true);
            setDisplayTable(false);
          }}
          deleteUser={deleteUser}
        />
      ) : (
        <div>
          <UserForm  // Call all Add or Update items form page
            addUser={addUser}
            updateUser={updateUser}
            submitted={submitted}
            data={selectedUser}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
          />
        </div>
      )}
    </Box>
{/* Call footer */}
    <div>
        <Foot/>
      </div>
    </div>
  );
};

export default Users;
