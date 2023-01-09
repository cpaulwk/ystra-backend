const mongoose = require('mongoose');
const paymentSchema = mongoose.Schema({
    paymentType: String,
    fullName: String, 
    expirationDate: String, 
    isDefault: Boolean, 
});

module.exports = paymentSchema;