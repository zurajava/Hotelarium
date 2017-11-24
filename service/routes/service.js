const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
var url = require("url");
const pool = require('../dbmanager/dbmanager-mysql.js');
var q = require('q');

router.get('/:branch_id', (req, res) => {
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

router.post('/', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

router.put('/:id', (req, res) => {
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


module.exports = router;