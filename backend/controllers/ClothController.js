const Cloth = require('../models/Cloth');

//Get all product items Details
const getCloths = (req, res, next) => {
    Cloth.find()
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Create new Product item
const addCloth = (req, res, next) => {
    const { id, name, imgId, price, sdes, des, item, stock } = req.body;

    const cloth = new Cloth({
        id: id,
        name: name,
        imgId: imgId,
        price: price,
        sdes: sdes,
        des: des,
        item: item,
        stock: stock,
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
const updateCloth = (req, res, next) => {
    const { id, name, imgId, price, sdes, des, item, stock } = req.body;

    Cloth.updateOne({ id: id }, { $set: { name: name, imgId: imgId, price: price, sdes: sdes, des: des, item: item, stock: stock } })
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Delete existing Product item
const deleteCloth = (req, res, next) => {
    const id = req.body.id;
    Cloth.deleteOne({ id: id })
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Getting Product max id for add next product items in the online store
const getMaxId = (req, res, next) => {
    Cloth.find({}, { id: 1 }).sort({ id: -1 }).limit(1)
        .then(response => {
            const maxId = response.length > 0 ? response[0].id : 0;
            res.json({ maxId });
        })
        .catch(error => {
            res.json({ error });
        });
};

//Export all
exports.getCloths = getCloths;
exports.addCloth = addCloth;
exports.updateCloth = updateCloth;
exports.deleteCloth = deleteCloth;
exports.getMaxId = getMaxId;