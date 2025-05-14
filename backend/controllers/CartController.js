const Cart = require('../models/Cart');

const createCart = (req, res, next) => {  // Function to create a new cart item
    const { id, email, quantity } = req.body; // Extract data from the request body
 
    const cart = new Cart({ // Create a new cart instance
        id: id,
        email: email,
        quantity:quantity,
    });

    cart.save()  // Save the new cart item to the database
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            console.error('Error adding user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};


const getCart = (req, res, next) => { // Function to retrieve all cart items
    Cart.find()   // Find all cart items in the database
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};


const updateCart = (req, res, next) => { // Function to update a cart item
    const { id, email, quantity } = req.body;
    
    Cart.updateOne({ id: id }, { $set: { quantity: quantity} })  // Update the quantity of the specified cart item
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};


const deleteCart = (req, res, next) => { 
    const id = req.body.id; 

    Cart.deleteOne({ id: id }) 
        .then(response => {
            if (response.deletedCount > 0) {
                res.json({ success: true, message: "Cart item deleted successfully", data: response });
            } else {
                res.status(404).json({ success: false, message: "Cart item not found" });
            }
        })
        .catch(error => {
            next(error); // Pass the error to the next middleware for centralized error handling
        });
};




exports.createCart = createCart;
exports.updateCart = updateCart;
exports.deleteCart = deleteCart;
exports.getCart = getCart;