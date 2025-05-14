const Tailoring = require('../models/Tailoring');

//Get all product items Details
const getTailorings = (req, res, next) => {
    Tailoring.find()
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Create new Product item
const addTailoring = (req, res, next) => {
    const { tid, email, responseLink, gender, desiredOutfit, negativeOutfit, qty, price, status } = req.body;

    const cloth = new Tailoring({
        tid: tid,
        email: email,
        responseLink: responseLink,
        gender: gender,
        desiredOutfit: desiredOutfit,
        negativeOutfit: negativeOutfit,
        qty: qty,
        price: price,
        status: status,
    });

    cloth.save()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            console.error('Error adding cloth:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

//Update existing Product item
const updateTailoring = (req, res, next) => {
    const { tid, email, responseLink, gender, desiredOutfit, negativeOutfit, qty, price, status } = req.body;

    Tailoring.updateOne({ tid: tid }, { $set: { email: email, responseLink: responseLink, gender: gender, desiredOutfit: desiredOutfit, negativeOutfit: negativeOutfit, qty: qty, price: price, status: status } })
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Delete existing Product item
const deleteTailoring = (req, res, next) => {
    const tid = req.body.tid;
    Tailoring.deleteOne({ tid: tid })
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Getting Product max id for add next product items in the online store
const getMaxId = (req, res, next) => {
    Tailoring.find({}, { tid: 1 }).sort({ tid: -1 }).limit(1)
        .then(response => {
            const maxId = response.length > 0 ? response[0].tid : 0;
            res.json({ maxId });
        })
        .catch(error => {
            res.json({ error });
        });
};


//Export all
exports.getTailorings = getTailorings;
exports.addTailoring = addTailoring;
exports.updateTailoring = updateTailoring;
exports.deleteTailoring = deleteTailoring;
exports.getMaxId = getMaxId;