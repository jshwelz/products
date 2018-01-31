const databaseUri = 'mongodb://productstask:asdf123@ds221148.mlab.com:21148/productstask';
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(databaseUri);


mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + databaseUri);
  });
  mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
  });
  mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
  });

  // BRING IN YOUR SCHEMAS & MODELS
require('./product-model');