var express = require('express');
var router = express.Router();
var request = require('sync-request');
var uid2 = require("uid2");

var userModel = require('../models/users');

var bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
