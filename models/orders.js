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
    orderItems:{ type: [Items.Schema], required: true },
    orderStatus: { type: [statusSchema], required: true }, 
    isCanceled: Boolean,
    cancelDate: Date,
    addressBilling:{ type: addressSchema, required: true } ,
    addressDelivery:{ type: addressSchema, required: true },   /*[id, street, zipCode, city, state, country, phoneNumber, isForBilling, isForDelivery, isDefault, isDeleted,]*/
    paymentType: { type: paymentTypeSchema, required: true } , /*[payment]*/
    isPaid: Boolean, 
    paidDate: Date, 
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;