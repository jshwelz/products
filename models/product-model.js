var mongoose = require('mongoose');

var Product = mongoose.model('Product',{
	description : {type: String, required: true, minlength: 1, trim: true},
	cost : {type: Number,default: 0},
	price: {type: Number,default: 0},
	stock: {type: Number,default: 0},
	Currency: {type: String, required: false, minlength: 1, trim: true}	
});

module.exports = {Product};






