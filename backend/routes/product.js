const express = require('express');
const router = express.Router();
const pupperteer = require('../util/pupperteer')
const request = require("request");
const SerialNumber = require('../models').SerialNumber;
const Product = require('../models').Product;