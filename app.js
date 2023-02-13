require("dotenv").config();
require("./models/connection");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var renderImagesRouter = require("./routes/renderImages");
var ordersRouter = require("./routes/orders");
var userGalleryRouter= require("./routes/userGallery");
var productsRouter= require("./routes/products");
var walletRouter= require("./routes/wallet");
var payementRouter= require ("./routes/payement.js");
var app = express();


const cors = require("cors");
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/renderimages",renderImagesRouter);
app.use("/orders", ordersRouter);
app.use("/gallery",userGalleryRouter);
app.use("/products", productsRouter);
app.use("/wallet",walletRouter);
app.use("/payement", payementRouter);
module.exports = app;
