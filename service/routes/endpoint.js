const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../dbmanager/dbmanager.js');

router.post('/authenticate', (req, res) => {
  console.log("authenticate");
  pool.getUserByUserName(req.body.username, req.body.password, function (err, data) {
    if (err) {
      res.json(err);
    } else {
      if (data.length == 0) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (data.password != req.body.password.toUpperCase()) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        var token = jwt.sign(data, 'ilovescotchyscotch', { expiresIn: 60 * 60 * 24 });
        res.json({
          success: true,
          user: data,
          token: token
        });
      }
    }
  });
});

router.use(function (req, res, next) {
  console.log("middleware : " + req.url);
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, 'ilovescotchyscotch', function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided....z'
    });
  }
});

/* GET api listing. */
router.get('/', (req, res) => {
  console.log("/.......");
  res.json({ message: 'Welcome to the coolest API on earth!' });
});


/* GET All Users. */
router.get('/users', (req, res) => {
  console.log("users");
  pool.getUsers(function (err, data) {
    if (err) {
      res.json(err);
    } else {
      res.json(data);
    }
  });

});

module.exports = router;