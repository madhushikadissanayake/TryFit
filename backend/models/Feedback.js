const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    cusid: Number,
    id: String,
    comment: String,
    rating: { type: Number, required: true }
});

const Feedback = mongoose.model('Feedback',feedbackSchema);

module.exports = Feedback;