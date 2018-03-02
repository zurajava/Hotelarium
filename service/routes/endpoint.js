const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
var url = require("url");
const pool = require('../dbmanager/dbmanager-mysql.js');
const bcrypt = require('bcrypt');
var passwordHash = require('password-hash');
var q = require('q');

router.post('/authenticate', (req, res) => {
  console.log("Route, Authenticate");
  pool.getUserByUserName(req.body.username, req.body.password)
    .then(data => {
      if (data.length == 0) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (!bcrypt.compareSync(req.body.password.toLowerCase(), data[0].password)) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        delete data[0]['password'];
        delete data[0]['birthday'];
        var token = jwt.sign(data[0], 'ilovescotchyscotch', { expiresIn: "3d" });
        res.json({
          success: true,
          user: data[0],
          token: token
        });
      }
    }).catch(error => {
      res.json({ success: false, message: error });
    });
});

router.post('/changePassword', (req, res) => {
  console.log("Route, Change password", req.body.username, req.body.password);
  pool.changePassword(req.body.username, req.body.password).then(data => {
    if (data.affectedRows > 0) {
      res.json({ success: true, message: "Password change" });
    } else {
      res.json({ success: false, message: 'User not found' });
    }
  }).catch(error => {
    res.json({ success: false, message: error });
  });
});

router.post('/registerUser', (req, res) => {
  console.log("Route, Register User", req.body.username, req.body.password);
  pool.registerUser(req.body.username, req.body.first_name, req.body.last_name, req.body.email, req.body.password).then(data => {
    res.json({ success: true, message: data.affectedRows });
  }).catch(error => {
    res.json(error);
  });
});

router.get('/userInfo', (req, res) => {
  console.log("Route, Get User Info");
  pool.getUserInfo().then(data => {
    res.json({ success: true, users: data });
  }).catch(error => {
    res.json({ success: false, message: error });
  });
});
router.get('/getOrganisation', (req, res) => {
  console.log("Route, Get Organisation");
  pool.getOrganisation().then(data => {
    res.json({ success: true, organisation: data });
  }).catch(error => {
    res.json({ success: false, message: error });
  });
});

router.get('/getBranches', (req, res) => {
  console.log("Route, Get Branches");
  pool.getBranches().then(data => {
    res.json({ success: true, branches: data });
  }).catch(error => {
    res.json({ success: false, message: error });
  });
});

router.post('/addBrancheToUser', (req, res) => {
  console.log("Route, Add Branche To User", req.query.user_id, req.query.branch_id);
  pool.addBrancheToUser(req.query.user_id, req.query.branch_id).then(data => {
    res.json({ success: true, message: "OK" });
  }).catch(error => {
    res.json({ success: false, message: error });
  });
});

router.post('/addOrganisationToUser', (req, res) => {
  console.log("Route, Add Organisation To User", req.query.user_id, req.query.org_id);
  pool.addOrganisationToUser(req.query.user_id, req.query.org_id).then(data => {
    res.json({ success: true, message: "OK" });
  }).catch(error => {
    res.json({ success: false, message: error });
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