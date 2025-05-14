const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const cartSchema = new Schema({
    id: Number,
    email: String,
    quantity: Number,
});

const Cart = mongoose.model('Cart',cartSchema);

module.exports = Cart;