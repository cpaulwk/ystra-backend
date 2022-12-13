const mongoose = require('mongoose');
const paymentSchema = mongoose.Schema({
    paymentType: String,
    fullName: String, 
    expirationDate: Date, 
    isDefault: Boolean, 
});
//const Payment = mongoose.model('payments', paymentSchema);

module.exports = paymentSchema;