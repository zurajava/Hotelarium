const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
var url = require("url");
const pool = require('../dbmanager/dbmanager-mysql.js');
const bcrypt = require('bcrypt');
var q = require('q');

router.post('/authenticate', (req, res) => {
  console.log("Route, Authenticate");
  pool.getUserByUserName(req.body.username, req.body.password)
    .then(data => {
      if (data.length == 0) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (!bcrypt.compare(data[0].password, req.body.password)) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        var token = jwt.sign(data[0], 'ilovescotchyscotch', { expiresIn: "3d" });
        res.json({
          success: true,
          user: data[0],
          token: token
        });
      }
    }).catch(error => {
      console.log("Error", error);
      res.json({ success: false, message: error });
    });
});

router.post('/changePassword', (req, res) => {
  console.log("Route, Change password", req.body.username, req.body.password);
  pool.changePassword(req.body.username, req.body.password).then(data => {
    res.json({ success: true, message: data.affectedRows });
  }).catch(error => {
    res.json(error);
  });
});

router.post('/registerUser', (req, res) => {
  console.log("Route, Register User", req.body.username, req.body.password);
  pool.registerUser(req.body.username, req.body.first_name, req.body.last_name, req.body.email, req.body.password).then(data => {
    console.log(data);
    res.json({ success: true, message: data.affectedRows });
  }).catch(error => {
    res.json(error);
  });
});

router.use(function (req, res, next) {
  console.log("Route, Middleware : ", req.url);
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, 'ilovescotchyscotch', function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Authentication expire, please sing-in again' });
      } else {
        var pathname = url.parse(req.url).pathname.split("/")[1];
        req.decoded = decoded;
        if (pathname != 'userBranch' && pathname != 'userOrganisation' && pathname != 'branch' && pathname != 'report') {
          var branchId = req.body.branch_id || req.query.branch_id || req.headers['branch_id'];
          pool.getUserPermission(decoded.id, pathname, req.method, branchId).then(data => {
            if (data.length === 0) {
              return res.status(200).send({
                success: false,
                message: 'Perrmission denid'
              });
            } else {
              next();
            }
          }).catch(error => {
            return res.status(200).send({
              success: false,
              message: 'Perrmission denid for resource = ' + pathname + ', action = ' + req.method
            });
          });
        } else {
          next();
        }
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided....'
    });
  }
});

router.get('/userBranch/:id', (req, res) => {
  console.log("Route, UserBranch");
  pool.getUserBranch(req.params.id, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while load user branch', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', branch: data });
    }
  });
});

router.get('/userOrganisation/:id', (req, res) => {
  console.log("Route, UserOrganisation");
  pool.getUserOrganisation(req.params.id, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while load user organisation', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', organisation: data });
    }
  });
});
module.exports = router;