const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const paymentSchema = new Schema({
    payid: Number,
    amount: Number,
    cardNumber: Number,
    expDate: String,
    holderName: String,
    cvv: Number,
    payDate: Date,
});

const Payments = mongoose.model('Payments',paymentSchema);

module.exports = Payments;