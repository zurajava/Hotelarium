const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
var url = require("url");
const Report = require('../model/report.js');
var pool = new Report();

router.get('/payment/:branch_id', (req, res) => {
    console.log("Route, GetPayment");
    pool.getPaymentReport(req.params.branch_id, req.query.datefrom, req.query.dateto).then(data => {
        res.json({ success: true, message: 'OK', payments: data });
    }).catch(error => {
        res.json({
            success: false, message: 'Error while load payment report', error: error
        });
    });

});
router.get('/sales/:branch_id', (req, res) => {
    console.log("Route, GetPayment");
    pool.getSalesReport(req.params.branch_id, req.query.datefrom, req.query.dateto).then(data => {
        res.json({ success: true, message: 'OK', sales: data });
    }).catch(error => {
        res.json({
            success: false, message: 'Error while load sales report', error: error
        });
    });

});

router.get('/paymentOverall/:branch_id', (req, res) => {
    console.log("Route, PaymentOverall");
    pool.getPaymentOverall(req.params.branch_id, req.query.datefrom, req.query.dateto).then(data => {
        res.json({ success: true, message: 'OK', data: data });
    }).catch(error => {
        res.json({
            success: false, message: 'Error while load sales report', error: error
        });
    });

});

router.get('/paymentDetailed/:branch_id', (req, res) => {
    console.log("Route, GetPaymentDetailed");
    pool.getPaymentDetailed(req.params.branch_id, req.query.datefrom, req.query.dateto).then(data => {
        res.json({ success: true, message: 'OK', data: data });
    }).catch(error => {
        res.json({
            success: false, message: 'Error while load sales report', error: error
        });
    });

});

module.exports = router;