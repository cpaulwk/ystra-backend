const mongoose = require('mongoose');

const searchSchema = mongoose.Schema({
    user_id: String,
    textSearch: String, 
    dateSearch: Date,
    imageSearch: String, 
    imageResult: [{ type: mongoose.Schema.Types.ObjectId, ref:'imageresults'}], 
});


const Search = mongoose.model('searchs', searchSchema);

module.exports = Search;