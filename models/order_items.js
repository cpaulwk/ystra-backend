const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({                 
    productID: { type: mongoose.Schema.Types.ObjectId, ref:'products'},
    name: String,
    price : Number,
    variation: Number 
});

const orderItemSchema = mongoose.Schema({
imageResult_id: String,
price: Number, 
product: {
            size: itemSchema,
            finish: itemSchema,
            frame :itemSchema,
        },  
quantity: Number,
});

const OrderItem = mongoose.model('orderItems', orderItemSchema);


module.exports = OrderItem;