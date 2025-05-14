import { useEffect, useState } from 'react';
import Axios from 'axios';

const createCart = ({ productId, qty, stk}) => { // Function to create a new cart item
    // Retrieve the email session from sessionStorage
    const userEmail = sessionStorage.getItem('userEmail');

    if(stk>=qty){ // Check if there is enough stock to add the specified quantity
        const payload = {
            id: productId,
            quantity: qty,
            email: userEmail, // Include the userEmail in the payload
        };
    
         // Log information for debugging purposes
        console.log('p ID', productId);
        console.log('q', qty);
        console.log('e', userEmail);
    
        Axios.post('http://localhost:3005/api/createcart', payload) // Send a POST request to the server to create a new cart item
            .then((response) => {
                // Handle response if needed
            })
            .catch((error) => {
                console.error('Axios Error: ', error);
            });
    }
    else{
        alert("Stock Exceeded. Cannot add to cart!.."); // Alert the user if the stock is insufficient to add to the cart
    }
    
};

export default createCart;