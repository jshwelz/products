"use strict";
var mongoose = require('mongoose');
var Product = mongoose.model('Product');
const axios = require('axios');

const getExchangeRate = (to) => {
    return axios.get(`http://api.fixer.io/latest?base=USD`).then((response) => {
        return response.data.rates[to];
    });
}

module.exports = {
    one: (req, res) => {
        const productID = req.params.id;
        Product.findById(productID).then((product) => {
            if (!product) {
                return res.status(404).send();
            }
            res.send({ product });
        }).catch((e) => {
            if (e.errorCode) {
                return res.status(e.errorCode).json({
                    message: e.message
                });
            }
            return res.status(500).json({
                message: "An error ocurred on the server."
            });
        });
    },
    all: (req, res) => {
        Product.find().then((products) => {
            res.send({ products });
        }, (e) => {
            if (e.errorCode) {
                return res.status(e.errorCode).json({
                    message: e.message
                });
            }
            return res.status(500).json({
                message: "An error ocurred on the server"
            });
        })
    },
    update: (req, res) => {
        const productID = req.params.id;
        Product.findByIdAndUpdate(productID, req.body, { new: true }).then((prod) => {
            if (!prod) {
                return res.status(404).send();
            }
            res.send({ prod });
        }).catch((e) => {
            if (e.errorCode) {
                return res.status(e.errorCode).json({
                    message: e.message
                });
            }
            return res.status(500).json({
                message: "An error ocurred on the server"
            });

        })

    },
    save: (req, res) => {
        var newProduct = new Product({
            description: req.body.description,
            cost: req.body.cost,
            price: req.body.price,
            stock: req.body.stock,
            Currency: req.body.Currency
        });
        try {
            newProduct.save().then((doc) => {
                res.send(doc);
            }, (e) => {
                res.status(400).send(e);
            });
        } catch (ex) {
            if (ex.errorCode) {
                return res.status(ex.errorCode).json({
                    message: ex.message
                });
            }
            return res.status(500).json({
                message: "An error ocurred while trying to save the product"
            });
        }
    },
    delete: (req, res) => {
        const productID = req.params.id;
        Product.findByIdAndRemove(productID).then((prod) => {
            if (!prod) {
                return res.status(404).send();
            }
            res.status(200).send({ prod });
        }).catch((e) => {
            if (e.errorCode) {
                return res.status(e.errorCode).json({
                    message: e.message
                });
            }
            return res.status(500).json({
                message: "An error ocurred on the server"
            });
        });
    },
    cost: (req, res) => {
        const productID = req.params.id;
        Product.findById(productID).then((product) => {
            if (!product) {
                return res.status(404).send();
            }
            var costs = product.cost * product.stock;
            res.send(JSON.stringify({ "Cost": costs }));
        }).catch((e) => {
            if (e.errorCode) {
                return res.status(e.errorCode).json({
                    message: e.message
                });
            }
            return res.status(500).json({
                message: "An error ocurred on the server."
            });
        });
    },
    earnings: (req, res) => {
        const productID = req.params.id;

        Product.findById(productID).then((product) => {
            if (!product) {
                return res.status(404).send();
            }
            var cost = product.cost * product.stock;
            var earnings = product.price * product.stock;
            var total = earnings - cost;
            res.send(JSON.stringify({ "Earnings": earnings - cost }));
        }).catch((e) => {
            if (e.errorCode) {
                return res.status(e.errorCode).json({
                    message: e.message
                });
            }
            return res.status(500).json({
                message: "An error ocurred on the server."
            });
        });
    },
    totalcost: (req, res) => {
        Product.find().then((products) => {
            if (!products) {
                return res.status(404).send();
            }
            var totalCost = 0
            products.forEach(function (prod) {
                totalCost += prod.cost * prod.stock
            });
            res.send(JSON.stringify({ "Total Costs": totalCost }));
        }).catch((e) => {
            if (e.errorCode) {
                return res.status(e.errorCode).json({
                    message: e.message
                });
            }
            return res.status(500).json({
                message: "An error ocurred on the server."
            });
        });



    },
    totalearnings: (req, res) => {
        const productID = req.params.id;
        Product.find().then((products) => {
            if (!products) {
                return res.status(404).send();
            }
            var totalEarnings = 0;
            products.forEach(function (product) {
                var cost = product.cost * product.stock;
                var earnings = product.price * product.stock;
                var total = earnings - cost;
                totalEarnings += total;
            });
            res.send(JSON.stringify({ "Total Earnings": totalEarnings }));
        }).catch((e) => {
            if (e.errorCode) {
                return res.status(e.errorCode).json({
                    message: e.message
                });
            }
            return res.status(500).json({
                message: "An error ocurred on the server."
            });
        });
    },
    convertcurrency: async (req, res) => {
        var ctrl = require("../controllers/products-controller");
        const currency = req.params.cur;
        const productID = req.params.id;
        const findProd = await Product.findById(productID).then((product) => {
            if (!product) {
                return res.status(404);
            }
            return { product };
        }).catch((e) => {
            res.status(400).send();
        });
        const rate = await getExchangeRate(currency);
        var exchangedAmount = findProd.product.price * rate;
        res.send(JSON.stringify({ "Price": exchangedAmount, "Base Currency ": "USD" }));
    },
}