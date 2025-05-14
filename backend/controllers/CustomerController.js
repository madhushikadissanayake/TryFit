const Customer = require('../models/Customer');

//Get all Customers
const getCustomers = (req, res, next) => {
    Customer.find()
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Get selected Customer
const getSelectedCustomer = (req, res, next) => {
    const { cusid } = req.query;

    if (cusid) {
        Customer.findOne({ cusid: cusid })
            .then(response => {
                if (response) {
                    res.json({ response });
                } else {
                    res.status(404).json({ message: 'Customer not found' });
                }
            })
            .catch(error => {
                console.error('Error fetching Customer data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    } else {
        Customer.find()
            .then(response => {
                res.json({ response });
            })
            .catch(error => {
                console.error('Error fetching Customer data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }
};

//Create new Customer
const addCustomer = (req, res, next) => {
    const { cusid, firstName, lastName, cusEmail, cusAddress, cusNumber, password } = req.body;

    const customer = new Customer({
        cusid: cusid,
        firstName: firstName,
        lastName: lastName,
        cusEmail: cusEmail,
        cusAddress: cusAddress,
        cusNumber: cusNumber,
        password: password,
    });

    customer.save()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            console.error('Error adding Customer:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

//Update existing Customer
const updateCustomer = (req, res, next) => {
    const { cusid, firstName, lastName, cusEmail, cusAddress, cusNumber, password } = req.body;
    
    Customer.updateOne({ cusid: cusid }, { $set: { firstName: firstName, lastName: lastName, cusEmail: cusEmail, cusAddress: cusAddress, cusNumber: cusNumber, password:password } })
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Delete existing Customer
const deleteCustomer = (req, res, next) => {
    const cusid = req.body.cusid;
    Customer.deleteOne({cusid: cusid})
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error })
        });
};

//Getting Customer max id for add next product items in the online store
const getCusMaxId = (req, res, next) => {
    Customer.find({}, { cusid: 1 }).sort({ cusid: -1 }).limit(1)
      .then(response => {
        const maxId = response.length > 0 ? response[0].cusid : 0;
        res.json({ maxId }); 
      })
      .catch(error => {
        res.json({ error });
      });
  };
  
//Export all
exports.getCustomers = getCustomers;
exports.getSelectedCustomer = getSelectedCustomer;
exports.addCustomer = addCustomer;
exports.updateCustomer = updateCustomer;
exports.deleteCustomer = deleteCustomer;
exports.getCusMaxId = getCusMaxId;