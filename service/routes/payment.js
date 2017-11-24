const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
var url = require("url");
const pool = require('../dbmanager/dbmanager-mysql.js');
var q = require('q');

router.post('/', (req, res) => {
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