const mongoose = require('mongoose');

const imageResultSchema = mongoose.Schema({
    url: String,
    isHide: Boolean, 
    hideDate: Date, 
    isDownload: Boolean, 
    isFavorite: Boolean,
    isHighDefinition: Boolean,
});

const ImageResult = mongoose.model('imageresults', imageResultSchema);

module.exports = ImageResult;
