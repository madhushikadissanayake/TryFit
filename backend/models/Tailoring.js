const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const tailoringSchema = new Schema({
    tid: Number,
    email: String,
    responseLink: String,
    gender: String,
    desiredOutfit: String,
    negativeOutfit: String,
    qty: Number,
    price: Number,
    status: String,
});

const Tailoring = mongoose.model('Tailoring',tailoringSchema);

module.exports = Tailoring;