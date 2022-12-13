const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    nameProduct: String,
    typeProduct: String, 
    priceProduct: Number, 
    variationProduct: Boolean, 
    dateCreationProduct: Date,
    isDeleted: Date, 
    deleteDate: Date,
    stockQuantity: Number,
    dateOutOfStock: Date,
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;