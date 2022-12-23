const mongoose = require('mongoose');
const addressSchema = require('./address');
const  paymentTypeSchema= require('./payments');

const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String, 
    username: String, 
    password: String, 
    token: String,
    email: String, 
    registerDate: Date,
    lastConnexion: Date,
    confirmationRegister: Boolean,
    address: { type: [addressSchema], required: true },/*[address]*/
    phoneNumber: Number,
    key: String, 
    accountType: String, /*[account Type]*/
    profileImage: String, 
    paymentType: { type: [paymentTypeSchema.schema], required: true } , /*[payment]*/
    nbRequest: Number, 
    wallet: String
});


const User = mongoose.model('users', userSchema);

module.exports = User;