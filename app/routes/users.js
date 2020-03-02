var express = require('express');
var router = express.Router();

/* User sign-in */
router.post('/sign-in', async function(req, res, next) {

  res.json('sign-in');
});

/* User sign-up */
router.post('/sign-up', async function(req, res, next) {
  
  res.json('sign-up');
});

module.exports = router;
