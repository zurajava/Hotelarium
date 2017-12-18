const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
var url = require("url");
const pool = require('../dbmanager/dbmanager-mysql.js');
var q = require('q');

router.post('/authenticate', (req, res) => {
  console.log("Route, Authenticate");
  pool.getUserByUserName(req.body.username, req.body.password, function (err, data) {
    if (err) {
      res.json(err);
    } else {
      if (data.length == 0) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (data.password.toUpperCase() != req.body.password.toUpperCase()) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        var token = jwt.sign(data, 'ilovescotchyscotch', { expiresIn: "3d" });
        res.json({
          success: true,
          user: data,
          token: token
        });
      }
    }
  });
});

router.post('/changePassword', (req, res) => {
  console.log("Route, Authenticate");
  pool.getUserByUserName(req.body.username, req.body.password, function (err, data) {
    console.log(req.body.username + ' ' + req.body.password)
    if (err) {
      res.json(err);
    } else {
      console.log(data.password);

    }
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