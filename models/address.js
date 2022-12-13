const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    addressName: String,
    street: String, 
    zipCode: String, 
    city: String, 
    state: String,
    country: String, 
    phoneNumber: String,
    isForBilling: Boolean,
    isForDelivery: Boolean,
    isDefault: Boolean,
    isDeleted: Boolean,
});

module.exports = addressSchema;

