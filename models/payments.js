const mongoose = require('mongoose');
const paymentSchema = mongoose.Schema({
    paymentType: String,
    fullName: String, 
    expirationDate: String, 
    isDefault: Boolean, 
});
//const Payment = mongoose.model('payments', paymentSchema);

module.exports = paymentSchema;