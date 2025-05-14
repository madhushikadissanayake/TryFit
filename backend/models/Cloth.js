const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const clothSchema = new Schema({
    id: Number,
    name: String,
    imgId: String,
    price: Number,
    sdes: String,
    des: String,
    item: String,
    stock: Number,
    email: String,
    quantity: Number,
});

const Cloths = mongoose.model('Cloths',clothSchema);

module.exports = Cloths;