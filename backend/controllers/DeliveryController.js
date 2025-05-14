const Delivery = require('../models/Delivery');

//Get all Delivery
const getDeliverys = (req, res, next) => {
    Delivery.find()
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Get selected Delivery
const getSelectedDelivery = (req, res, next) => {
    const { deliveryId } = req.query;

    if (deliveryId) {
        Delivery.findOne({ deliveryId: deliveryId })
            .then(response => {
                if (response) {
                    res.json({ response });
                } else {
                    res.status(404).json({ message: 'Delivery not found' });
                }
            })
            .catch(error => {
                console.error('Error fetching Delivery data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    } else {
        Delivery.find()
            .then(response => {
                res.json({ response });
            })
            .catch(error => {
                console.error('Error fetching Delivery data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }
};


const getSelectedCustomer = (req, res, next) => {
    const { dCid } = req.query;

    if (dCid) {
        Delivery.findOne({ dCid: dCid })
            .then(response => {
                if (response) {
                    res.json({ response });
                } else {
                    res.status(404).json({ message: 'Delivery not found' });
                }
            })
            .catch(error => {
                console.error('Error fetching Delivery data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    } else {
        Delivery.find()
            .then(response => {
                res.json({ response });
            })
            .catch(error => {
                console.error('Error fetching Delivery data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }
};

//Create new Delivery
const addDelivery = (req, res, next) => {
    const { deliveryId, deliveryName, deliveryAddress, zipCode, deliveryPhone, deliveryEmail, amount, dCid } = req.body;

    const delivery = new Delivery({
        deliveryId: deliveryId,
        deliveryName: deliveryName,
        deliveryAddress: deliveryAddress,
        zipCode: zipCode,
        deliveryPhone: deliveryPhone,
        deliveryEmail: deliveryEmail,
        amount: amount,
        dCid: dCid
    });

    delivery.save()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            console.error('Error adding Delivery:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

//Update existing CustoDeliverymer
const updateDelivery = (req, res, next) => {
    const { deliveryId, deliveryName, deliveryAddress, zipCode, deliveryPhone, deliveryEmail, amount, dCid } = req.body;

    Delivery.updateOne({ deliveryId: deliveryId }, { $set: { deliveryName: deliveryName, deliveryAddress: deliveryAddress, zipCode: zipCode, deliveryPhone: deliveryPhone, deliveryEmail: deliveryEmail, amount: amount, dCid: dCid } })
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Delete existing Delivery
const deleteDelivery = (req, res, next) => {
    const deliveryId = req.body.deliveryId;
    Delivery.deleteOne({ deliveryId: deliveryId })
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Getting Delivery max id for add next product items in the online store
const getDeliveryMaxId = (req, res, next) => {
    Delivery.find({}, { deliveryId: 1 }).sort({ deliveryId: -1 }).limit(1)
        .then(response => {
            const maxId = response.length > 0 ? response[0].deliveryId : 0;
            res.json({ maxId });
        })
        .catch(error => {
            res.json({ error });
        });
};

//Export all
exports.getDeliverys = getDeliverys;
exports.getSelectedDelivery = getSelectedDelivery;
exports.addDelivery = addDelivery;
exports.updateDelivery = updateDelivery;
exports.deleteDelivery = deleteDelivery;
exports.getDeliveryMaxId = getDeliveryMaxId;
exports.getSelectedCustomer = getSelectedCustomer;