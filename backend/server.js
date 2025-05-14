const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const ClothsRouter = require('./routes/ClothRouter');
const TailoringRouter = require('./routes/TailoringRouter');
const CartRouter = require('./routes/CartRouter');
const FeedbackRouter = require('./routes/FeedbackRouter');
const CustomerRouter = require('./routes/CustomerRouter');
const PaymentRouter = require('./routes/PaymentRouter');
const DeliveryRouter = require('./routes/DeliveryRouter');
const measurementRoutes = require('./routes/measurementRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

connectDB();

app.use('/api', ClothsRouter, TailoringRouter, CartRouter, CustomerRouter, PaymentRouter, DeliveryRouter, FeedbackRouter);
app.use('/api/measurements', measurementRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
