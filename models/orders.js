const mongoose = require('mongoose');
const Items = require('./order_items');
const addressSchema = require('./address');
const  paymentTypeSchema= require('./payments');

const statusSchema = new mongoose.Schema({                 
    status: String,
    statusDate : Date,
});

const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref:'users'},
    orderNumber: String, 
    purchaseDate: Date, 
    orderItems:{ type: [Items.Schema], required: false },
    orderStatus: { type: [statusSchema], required: false }, 
    isCanceled: Boolean,
    cancelDate: Date,
    addressBilling:{ type: addressSchema, required: false } ,
    addressDelivery:{ type: addressSchema, required: false },   /*[id, street, zipCode, city, state, country, phoneNumber, isForBilling, isForDelivery, isDefault, isDeleted,]*/
    paymentType: { type: paymentTypeSchema, required: false } , /*[payment]*/
    isPaid: Boolean, 
    paidDate: Date, 
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;