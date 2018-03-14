const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
var url = require("url");
const Service = require('../model/service.js');
var pool = new Service();

router.get('/:branch_id', (req, res) => {
    console.log("Route, GetService");
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
    pool.registerService(req.body.name, req.body.price, req.body.description, req.body.branch_id, req.body.type, req.body.durationall_type, req.body.durationall_count, function (err, data) {
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
    pool.updateService(req.params.id, req.body.name, req.body.price, req.body.description, req.body.branch_id, req.body.type, req.body.durationall_type, req.body.durationall_count, function (err, data) {
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