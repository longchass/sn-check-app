const express = require('express');
const router = express.Router();
// const SerialNumber = require('../models/serialnumber');
const SerialNumber = require('../models').SerialNumber;
const Product = require('../models').Product;
const ProductBuilder = require('../util/productBuilder')
const request = require("request");
const pupperteer = require('../util/pupperteer')
const testMiddle = (req, res, next) => {
    res.status(200).end("something when wrong")
}


const database = require('../util/database')

/* GET users listing. */
router.get('/', async (req, res, next) => {
    // throw "err"
    let data = await database.exportAsFile()
    await res.send(data)
    // const username = process.env.SECRET_CISCO_USERNAME;
    // res.send(username);
});

module.exports = router;
