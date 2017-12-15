const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
var url = require("url");
//const pool = require('../dbmanager/dbmanager-mysql.js');
//var q = require('q');

const Reservation = require('../model/reservation.js');
var pool = new Reservation();

router.post('/', (req, res) => {
    console.log("Route, RegistertReservation");
    var reserv = req.body;
    if (reserv == null || reserv.person == null || reserv.reservation == null || reserv.reservation.reservationDetail == null || reserv.reservation.reservationDetail.length == 0) {
        return res.json({
            success: false, message: 'Person is not present', error: null
        });
    }
    var reservationDetail = reserv.reservation.reservationDetail;
    Promise.all(reservationDetail.map(data => {
        return pool.checkReservation(data).then(data => {
            return data;
        })
    })).then(data => {
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

router.post('/:id', (req, res) => {
    console.log("Route, AddReservationOne");
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

router.delete('/:id', (req, res) => {
    console.log("Route, DeleteReservation", req.query.type);
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
        pool.deleteReservationService(req.params.id, req.query.service_id).then(data => {
            return res.json({ success: true, message: 'OK', data: data });
        }).catch(error => {
            console.log("error", error);
            return res.json({
                success: false, message: 'Error while delete reservation service', error: error
            });
        });

    }
});


router.put('/:id', (req, res) => {
    console.log("Route, UpdateReservation");
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
        pool.updateReservation(req.params.id, 4).then(data => {
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

router.get('/', (req, res) => {
    console.log("Route, GetReservation");
    var reserv = req.body;
    pool.getReservation(req.query.branch_id, req.query.start_date, req.query.end_date, req.query.state, req.query.person_no).then(data => {
        return res.json({ success: true, message: 'OK', data: data });
    }).catch(function (error) {
        return res.json({
            success: false, message: 'Error while get reservation', error: err
        });
    });
});

router.get('/:id', (req, res) => {
    console.log("Route, GetReservationById");
    var reserv = req.body;

    pool.getReservationById(req.params.id).then(data => {
        return res.json({ success: true, message: 'OK', data: data });
    }).catch(function (error) {
        return res.json({
            success: false, message: 'Error while get reservation', error: err
        });
    });
});

router.get('/statistic/:branch_id', (req, res) => {
    console.log("Route, GetReservationStatistic");
    pool.getReservationStatistic(req.params.branch_id).then(data => {
        return res.json({ success: true, message: 'OK', data: data });
    }).catch(function (error) {
        return res.json({
            success: false, message: 'Error while get reservation statistic', error: err
        });
    });
});

module.exports = router;