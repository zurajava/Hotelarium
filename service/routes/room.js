const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
var url = require("url");
const pool = require('../dbmanager/dbmanager-mysql.js');
var q = require('q');

router.get('/:branch_id', (req, res) => {
    console.log("get room promise: " + req.params.branch_id + " " + req.query.category_id);
    pool.getRoom(req.params.branch_id, req.query.category_id).then(data => {
        res.json({ success: true, message: 'OK', room: data });
    }).catch(error => {
        res.json({
            success: false, message: 'Error while load room', error: error
        });
    });

});

router.post('/', (req, res) => {
    console.log("add room : " + req.body.name);
    pool.registerRoom(req.body.name, req.body.price, req.body.currency, req.body.room_no, req.body.description,
        req.body.branch_id, req.body.category_id,
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

router.delete('/:id', (req, res) => {
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

router.put('/:id', (req, res) => {
    console.log(req.body, req.body.category_name);
    pool.updateRoom(req.params.id, req.body.name, req.body.price, req.body.currency, req.body.room_no, req.body.description, req.body.branch_id, req.body.category_id, req.body.smoke, req.body.wifi, req.body.tag,
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

module.exports = router;