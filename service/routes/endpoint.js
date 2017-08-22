const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../dbmanager/dbmanager-mysql.js');
var Q = require('q');

router.post('/authenticate', (req, res) => {
  console.log("authenticate");
  pool.getUserByUserName(req.body.username, req.body.password, function (err, data) {
    console.log(req.body.username + ' ' + req.body.password)
    if (err) {
      res.json(err);
    } else {
      console.log(data.password);
      if (data.length == 0) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (data.password.toUpperCase() != req.body.password.toUpperCase()) {
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
  console.log("middleware : " + req.url + " : " + req.method);
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


router.get('/branch/:org_id', (req, res) => {
  console.log("branch " + req.params.org_id);
  pool.getBranch(req.params.org_id, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while load branch', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', branch: data });
    }
  });

});

router.post('/branch', (req, res) => {
  console.log("add branch : " + req.body.name);
  pool.registerBranch(req.body.name, req.body.description, req.body.address, req.body.org_id, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while register branch', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', branch_id: data.insertId });
    }
  });
});

router.delete('/branch/:id', (req, res) => {
  console.log("delete branch : " + req.params.id);
  pool.deleteBranch(req.params.id, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while delete branch', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', branch_id: data.insertId });
    }
  });
});

router.put('/branch/:id', (req, res) => {
  pool.updateBranch(req.params.id, req.body.name, req.body.description, req.body.address, req.body.org_id, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while delete branch', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', branch_id: data.insertId });
    }
  });
});


router.get('/userBranch/:id/:org_id', (req, res) => {
  console.log("userBranch : " + req.params.id + " : " + req.params.org_id);
  pool.getUserBranch(req.params.id, req.params.org_id, function (err, data) {
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
  console.log("userOrganisation");
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

router.get('/category/:branch_id', (req, res) => {
  console.log("category " + req.params.branch_id);
  pool.getCategory(req.params.branch_id, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while load category', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', category: data });
    }
  });

});


router.post('/category', (req, res) => {
  console.log("add category : " + req.body.name);
  pool.registerCategory(req.body.name, req.body.price, req.body.currency, req.body.description, req.body.branch_id, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while register category', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', category: data.insertId });
    }
  });
});


router.delete('/category/:id', (req, res) => {
  console.log("delete category : " + req.params.id);
  pool.deleteCategory(req.params.id, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while delete category', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', category: data.insertId });
    }
  });
});


router.put('/category/:id', (req, res) => {
  pool.updateCategory(req.params.id, req.body.name, req.body.price, req.body.currency, req.body.description, req.body.branch_id, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while update category', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', category: data.insertId });
    }
  });
});

router.get('/service/:branch_id', (req, res) => {
  console.log("service " + req.params.branch_id);
  pool.getService(req.params.branch_id, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while load service', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', service: data });
    }
  });

});

router.post('/service', (req, res) => {
  console.log("add service : " + req.body.name);
  pool.registerService(req.body.name, req.body.price, req.body.currency, req.body.description, req.body.branch_id, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while register service', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', service: data.insertId });
    }
  });
});

router.delete('/service/:id', (req, res) => {
  console.log("delete service : " + req.params.id);
  pool.deleteService(req.params.id, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while delete service', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', service: data.insertId });
    }
  });
});

router.put('/service/:id', (req, res) => {
  pool.updateService(req.params.id, req.body.name, req.body.price, req.body.currency, req.body.description, req.body.branch_id, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while update service', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', service: data.insertId });
    }
  });
});






router.get('/room/:branch_id', (req, res) => {
  console.log("room " + req.params.branch_id);
  pool.getRoom(req.params.branch_id, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while load room', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', room: data });
    }
  });

});

router.post('/room', (req, res) => {
  console.log("add room : " + req.body.name);
  pool.registerRoom(req.body.name, req.body.price, req.body.currency, req.body.room_no, req.body.description, req.body.branch_id, req.body.category_name, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while register room', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', room: data.insertId });
    }
  });
});

router.delete('/room/:id', (req, res) => {
  console.log("delete room : " + req.params.id);
  pool.deleteRoom(req.params.id, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while delete room', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', room: data.insertId });
    }
  });
});

router.put('/room/:id', (req, res) => {
  pool.updateRoom(req.params.id, req.body.name, req.body.price, req.body.currency, req.body.room_no, req.body.description, req.body.branch_id, req.body.category_name, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while update room', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', room: data.insertId });
    }
  });
});


router.post('/reservation', (req, res) => {
  console.log("add reservation : " + req.body);
  var reserv = req.body;

  if (reserv == null || reserv.person == null || reserv.reservation == null || reserv.reservation.reservationDetail == null || reserv.reservation.reservationDetail.length == 0) {
    return res.json({
      success: false, message: 'Person is not present', error: null
    });
  }

  pool.registerReservation(reserv, function (err, data) {
    if (err) {
      console.log("registerReservation : ", err);
      return res.json({
        success: false, message: 'Error while register reservation', error: err
      });
    } else {
      return res.json({ success: true, message: 'OK', data: data });
    }
  });
});

router.get('/reservation', (req, res) => {
  console.log("get reservation : " + req.query.start_date + " " + req.query.end_date + " " + req.query.branch_id);
  var reserv = req.body;

  pool.getReservation(req.query.branch_id, req.query.start_date, req.query.end_date, function (err, data) {
    if (err) {
      console.log("get reservation : ", err);
      return res.json({
        success: false, message: 'Error while get reservation', error: err
      });
    } else {
      return res.json({ success: true, message: 'OK', data: data });
    }
  });
});



router.get('/person', (req, res) => {
  console.log("person :" + req.query.person_no);
  pool.getPerson(req.query.person_no, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while load person', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', person: data });
    }
  });

});

module.exports = router;