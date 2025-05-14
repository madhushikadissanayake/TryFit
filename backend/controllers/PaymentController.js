const Payment = require('../models/Payment');

//Get all Payments
const getPayments = (req, res, next) => {
    Payment.find()
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Get selected Payment
const getSelectedPayment = (req, res, next) => {
    const { payid } = req.query;

    if (payid) {
        Payment.findOne({ payid: payid })
            .then(response => {
                if (response) {
                    res.json({ response });
                } else {
                    res.status(404).json({ message: 'Payment not found' });
                }
            })
            .catch(error => {
                console.error('Error fetching Payment data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    } else {
        Payment.find()
            .then(response => {
                res.json({ response });
            })
            .catch(error => {
                console.error('Error fetching Payment data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }
};

//Create new Payment
const addPayment = (req, res, next) => {
    const { payid, amount, cardNumber, expDate, holderName, cvv, payDate } = req.body;

    const payment = new Payment({
        payid: payid,
        amount: amount,
        cardNumber: cardNumber,
        expDate: expDate,
        holderName: holderName,
        cvv: cvv,
        payDate: payDate,
    });

    payment.save()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            console.error('Error adding Payment:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

//Update existing Payment
const updatePayment = (req, res, next) => {
    const { payid, amount, cardNumber, expDate, holderName, cvv, payDate } = req.body;

    Payment.updateOne({ payid: payid }, { $set: { amount: amount, cardNumber: cardNumber, expDate: expDate, holderName: holderName, cvv: cvv, payDate: payDate } })
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Delete existing Payment
const deletePayment = (req, res, next) => {
    const payid = req.body.payid;
    Payment.deleteOne({ payid: payid })
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Getting Payment max id for add next product items in the online store
const getPayMaxId = (req, res, next) => {
    Payment.find({}, { payid: 1 }).sort({ payid: -1 }).limit(1)
        .then(response => {
            const maxId = response.length > 0 ? response[0].payid : 0;
            res.json({ maxId });
        })
        .catch(error => {
            res.json({ error });
        });
};


//Export all
exports.getPayments = getPayments;
exports.getSelectedPayment = getSelectedPayment;
exports.addPayment = addPayment;
exports.updatePayment = updatePayment;
exports.deletePayment = deletePayment;
exports.getPayMaxId = getPayMaxId;