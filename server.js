var express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  docs = require("express-mongoose-docs");
// create instance of express
var app = express();
app.use(cors());
app.options('*', cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


docs(app, mongoose);
// [SH] Bring in the data model
require('./models/db');
// // require routes
var routesProducts = require('./routes/products-routes.js');

// // define middleware
app.use("/api/products", routesProducts);

const port =  3000;
app.listen(port);
console.log(`Listening on :${port}`);
module.exports = {app};
