const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
var url = require("url");
const Report = require('../model/report.js');
var pool = new Report();

router.get('/payment/:branch_id', (req, res) => {
    console.log("Route, GetPayment");
    pool.getPaymentReport(req.params.branch_id).then(data => {
        res.json({ success: true, message: 'OK', payments: data });
    }).catch(error => {
        res.json({
            success: false, message: 'Error while load payment report', error: error
        });
    });

});

module.exports = router;