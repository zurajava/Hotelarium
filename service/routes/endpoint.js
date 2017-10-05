const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
var url = require("url");
const pool = require('../dbmanager/dbmanager-mysql.js');
var q = require('q');

router.post('/authenticate', (req, res) => {
  console.log("authenticate");
  pool.getUserByUserName(req.body.username, req.body.password, function (err, data) {
    console.log(req.body.username + ' ' + req.body.password)
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
  console.log("authenticate :", req.body.username, req.body.password, req.body.newPassword);
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
  console.log("middleware : " + req.url + " : " + req.method);
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, 'ilovescotchyscotch', function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Authentication expire, please sing-in again' });
      } else {
        var pathname = url.parse(req.url).pathname.split("/")[1];
        console.log(decoded.id + " " + decoded.user_name + " " + decoded.role + " " + pathname);
        req.decoded = decoded;
        if (pathname != 'userBranch' && pathname != 'userOrganisation') {
          console.log("Restcrictec path", decoded.id + " " + decoded.user_name + " " + decoded.role + " " + pathname);
          pool.getUserPermission(decoded.id, pathname, req.method).then(data => {
            if (data.length = 0) {
              return res.status(403).send({
                success: false,
                message: 'Perrmission denid'
              });
            } else {
              next();
            }
          }).catch(error => {
            return res.status(403).send({
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
  pool.registerBranch(req.body.name, req.body.description, req.body.address, req.body.org_id, req.body.mail, req.body.phone, function (err, data) {
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
  pool.updateBranch(req.params.id, req.body.name, req.body.description, req.body.address, req.body.org_id, req.body.mail, req.body.phone, function (err, data) {
    if (err) {
      res.json({
        success: false, message: 'Error while delete branch', error: err
      });
    } else {
      res.json({ success: true, message: 'OK', branch_id: data.insertId });
    }
  });
});


router.get('/userBranch/:id', (req, res) => {
  console.log("userBranch : " + req.params.id);
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
  console.log("add category : " + req.body.name + ' ' + req.body.parking);
  pool.registerCategory(req.body.name, req.body.price, req.body.currency, req.body.description, req.body.branch_id, req.body.parking, function (err, data) {
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
  console.log("update category : " + req.params.id + ' ' + req.body.parking);
  pool.updateCategory(req.params.id, req.body.name, req.body.price, req.body.currency, req.body.description, req.body.branch_id, req.body.parking, function (err, data) {
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
  pool.registerService(req.body.name, req.body.price, req.body.currency, req.body.description, req.body.branch_id, req.body.type, function (err, data) {
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
  pool.updateService(req.params.id, req.body.name, req.body.price, req.body.currency, req.body.description, req.body.branch_id, req.body.type, function (err, data) {
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
  console.log("get room promise: " + req.params.branch_id + " " + req.query.category_id);
  pool.getRoom(req.params.branch_id, req.query.category_id).then(data => {
    res.json({ success: true, message: 'OK', room: data });
  }).catch(error => {
    res.json({
      success: false, message: 'Error while load room', error: error
    });
  });

});

router.post('/room', (req, res) => {
  console.log("add room : " + req.body.name);
  pool.registerRoom(req.body.name, req.body.price, req.body.currency, req.body.room_no, req.body.description,
    req.body.branch_id, req.body.category_name,
    req.body.smoke, req.body.wifi, req.body.tag,
    req.body.additional_bad, req.body.additional_bad_price, req.body.extra_person, req.body.extra_person_price, function (err, data) {
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
  console.log(req.body);
  pool.updateRoom(req.params.id, req.body.name, req.body.price, req.body.currency, req.body.room_no, req.body.description, req.body.branch_id, req.body.category_name, req.body.smoke, req.body.wifi, req.body.tag,
    req.body.additional_bad, req.body.additional_bad_price, req.body.extra_person, req.body.extra_person_price, function (err, data) {
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
  var reservationDetail = reserv.reservation.reservationDetail;
  Promise.all(reservationDetail.map(data => {
    console.log("map", data);
    return pool.checkReservation(data).then(data => {
      return data;
    })
  })).then(data => {
    console.log("registerReservation", data);
    pool.registerReservation(reserv).then(data => {
      return res.json({ success: true, message: 'OK', data: data });
    })
  }).catch(error => {
    console.log("error", error);
    return res.json({
      success: false, message: 'Error while register reservation', error: error
    });
  });
});

router.post('/reservation/:id', (req, res) => {
  console.log("add reservation one : " + req.params.id, req.query.type);
  var reserv = req.body;
  if (req.params.id == null || reserv == null) {
    return res.json({
      success: false, message: 'reservation is not present', error: null
    });
  }
  //1 = all,2 - Person, 3 - service
  if (req.query.type == 1) {
    pool.checkReservation(reserv).then(data => {
      pool.registerReservationOne(req.params.id, reserv).then(data => {
        return res.json({ success: true, message: 'OK', data: data });
      })
    }).catch(error => {
      console.log("error", error);
      return res.json({
        success: false, message: 'Error while register reservation', error: error
      });
    });
  } else if (req.query.type == 2) {
    pool.registerReservationPerson(req.params.id, reserv).then(data => {
      return res.json({ success: true, message: 'OK', data: data });
    }).catch(error => {
      return res.json({
        success: false, message: 'Error while register reservation person'
      });
    });
  } else if (req.query.type == 3) {
    pool.registerReservationService(req.params.id, reserv).then(data => {
      return res.json({ success: true, message: 'OK', data: data });
    }).catch(error => {
      return res.json({
        success: false, message: 'Error while register reservation service'
      });
    });
  } else {
    return res.json({
      success: false, message: 'Error while register reservation params, invalid service type'
    });
  }
});

router.delete('/reservation/:id', (req, res) => {
  console.log("delete reservation : " + req.params.id, req.query.type);
  var reserv = req.body;
  if (req.params.id == null) {
    return res.json({
      success: false, message: 'reservation is not present', error: null
    });
  }
  //delete reservation 1 - reservation, 2- person 3 - service
  if (req.query.type == 1) {
    pool.deleteReservation(req.params.id).then(data => {
      return res.json({ success: true, message: 'OK', data: data });
    }).catch(error => {
      console.log("error", error);
      return res.json({
        success: false, message: 'Error while delete reservation', error: error
      });
    });
  } else if (req.query.type == 2) {
    pool.deleteReservationPersonLocal(req.params.id, req.query.person_no).then(data => {
      return res.json({ success: true, message: 'OK', data: data });
    }).catch(error => {
      console.log("error", error);
      return res.json({
        success: false, message: 'Error while delete reservation person', error: error
      });
    });
  } else if (req.query.type == 3) {
    pool.deleteReservationServiceLocal(req.params.id, req.query.service_id).then(data => {
      return res.json({ success: true, message: 'OK', data: data });
    }).catch(error => {
      console.log("error", error);
      return res.json({
        success: false, message: 'Error while delete reservation service', error: error
      });
    });

  }
});


router.put('/reservation/:id', (req, res) => {
  console.log("update reservation : " + req.params.id, req.query.type);
  var reserv = req.body;
  if (req.params.id == null) {
    return res.json({
      success: false, message: 'reservation is not present', error: null
    });
  }
  //delete reservation 2 - ckeck in, 3- Check out
  if (req.query.type == 2) {
    pool.updateReservation(req.params.id, req.query.type).then(data => {
      return res.json({ success: true, message: 'OK', data: data });
    }).catch(error => {
      console.log("error", error);
      return res.json({
        success: false, message: 'Error while update reservation', error: error
      });
    });
  } else if (req.query.type == 3) {
    pool.updateReservation(req.params.id, req.query.type).then(data => {
      return res.json({ success: true, message: 'OK', data: data });
    }).catch(error => {
      console.log("error", error);
      return res.json({
        success: false, message: 'Error while update reservation', error: error
      });
    });
  } else {
    return res.json({
      success: false, message: 'Error while update reservation', error: error
    });
  }
});

router.get('/reservation', (req, res) => {
  console.log("get reservation : " + req.query.start_date + " " + req.query.end_date + " " + req.query.branch_id);
  var reserv = req.body;

  pool.getReservation(req.query.branch_id, req.query.start_date, req.query.end_date).then(data => {
    return res.json({ success: true, message: 'OK', data: data });
  }).catch(function (error) {
    return res.json({
      success: false, message: 'Error while get reservation', error: err
    });
  });
});

router.get('/reservation/:id', (req, res) => {
  console.log("get reservation by id: " + req.params.id);
  var reserv = req.body;

  pool.getReservationById(req.params.id).then(data => {
    return res.json({ success: true, message: 'OK', data: data });
  }).catch(function (error) {
    return res.json({
      success: false, message: 'Error while get reservation', error: err
    });
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

router.post('/payment', (req, res) => {
  console.log("payment :", req.query.type);
  if (req.query.type == 1) {
    pool.registerPayment(req.body).then(data => {
      return res.json({ success: true, message: 'OK', data: data });
    }).catch(error => {
      return res.json({
        success: false, message: 'Error while load person', error: error
      });
    });
  } else if (req.query.type == 2) {
    pool.registerServicePayment(req.body).then(data => {
      return res.json({ success: true, message: 'OK', data: data });
    }).catch(error => {
      return res.json({
        success: false, message: 'Error while load person', error: error
      });
    });
  }


});

module.exports = router;