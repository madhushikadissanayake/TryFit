import React from 'react';
import Axios from 'axios';

// This is a utility function that manages stock updates
// It's not a React component, so it doesn't use hooks
const updateStock = ({ productId, qty, stk, type, name, sdes, price }) => {
  if (type === "add") {  // Add new product items in the cart then Decrease Product stock
    if (stk > qty) { 
      const newStk = stk - qty;

      // Create payload for update stock
      const payload = {
        id: productId,
        stock: newStk,
      };

      // Update Product stock using this url
      return Axios.post('http://localhost:3005/api/updatecloth', payload)
        .then((response) => {
          alert(`The product cart successfully updated! Remaining stock: ${newStk}`);
          return newStk;
        })
        .catch((error) => {
          console.error('Axios Error: ', error);
          return null;
        });
    } 
    else if (stk === qty) { // Stock is 0
      const newStk = stk - qty;

      // Create payload for update stock
      const payload = {
        id: productId,
        stock: newStk,
      };

      // Update Product stock using this url
      return Axios.post('http://localhost:3005/api/updatecloth', payload)
        .then((response) => {
          // Send email in product manager
          const emailPayload = {
            email: 'madhushikad8@gmail.com',
            subject: `${name} is Out of stock..!`,
            body: `This Product is out of stock..!, If there is new stock, please update it.

__________Product Details__________

Product id : ${productId}
Product Name : ${name}
Product Price : ${price}
Product Description : ${sdes}

___________________________________
Thank you..!`,
          };

          // Send email in Product manager using this url
          return Axios.post('http://localhost:3005/api/send-email', emailPayload)
            .then((response) => {
              console.log('Email sent!');
              alert('The product was successfully added to the cart..!');
              return newStk;
            })
            .catch((error) => {
              console.error('Axios Error: ', error);
              return newStk;
            });
        })
        .catch((error) => {
          console.error('Axios Error: ', error);
          return null;
        });
    } else {
      alert('Not enough stock available!');
      return null;
    }
  }
  else if (type === "remove") {  // Remove product items in the cart then Increase Product stock
    const newStk = stk + qty;

    // Create payload for update stock
    const payload = {
      id: productId,
      stock: newStk,
    };

    // Update Product stock using this url
    return Axios.post('http://localhost:3005/api/updatecloth', payload)
      .then((response) => {
        alert(`The product cart successfully updated! Current stock: ${newStk}`);
        return newStk;
      })
      .catch((error) => {
        console.error('Axios Error: ', error);
        return null;
      });
  }
  else if (type === "admin") { // Admin Update only stock
    // Create payload for update stock
    const payload = {
      id: productId,
      stock: stk,
    };

    // Update Product stock using this url
    return Axios.post('http://localhost:3005/api/updatecloth', payload)
      .then((response) => {
        alert('Product Stock successfully updated..!');
        return stk;
      })
      .catch((error) => {
        console.error('Axios Error: ', error);
        return null;
      });
  }
};

// This is a React component that can be used to display stock status
// It's separate from the updateStock function
const StockDisplay = ({ stock }) => {
  return (
    <div className="stock-display">
      <p>Current Stock: {stock}</p>
    </div>
  );
};

export { updateStock, StockDisplay };
export default updateStock;