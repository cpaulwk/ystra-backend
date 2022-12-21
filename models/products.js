const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    nameProduct: String,
    typeProduct: String, 
    priceProduct: Number, 
    variationProduct: Number, 
    dateCreationProduct: Date,
    isDeleted: Date, 
    deleteDate: Date,
    stockQuantity: Number,
    dateOutOfStock: Date,
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;