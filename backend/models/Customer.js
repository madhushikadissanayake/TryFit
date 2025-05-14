const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const customerSchema = new Schema({
    cusid: Number,
    firstName: String,
    lastName: String,
    cusEmail: String,
    cusAddress: String,
    cusNumber: String,
    password: String,
    
});

const Customer = mongoose.model('Customer',customerSchema);

module.exports = Customer;