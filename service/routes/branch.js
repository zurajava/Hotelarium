const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
var url = require("url");
const pool = require('../dbmanager/dbmanager-mysql.js');
var q = require('q');

router.get('/:org_id', (req, res) => {
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

router.post('/', (req, res) => {
    console.log("add branch : " + req.body.name);

    pool.registerBranch(req.body.name, req.body.description, req.body.address, req.body.org_id, req.body.mail, req.body.phone).then(data => {
        res.json({ success: true, message: 'OK', room: data });
    }).catch(error => {
        res.json({
            success: true, message: 'OK', branch_id: data.insertId
        });
    });
});

router.delete('/:id', (req, res) => {
    console.log("delete branch : " + req.params.id);
    pool.deleteBranch(req.params.id).then(data => {
        res.json({ success: true, message: 'OK', branch_id: data });
    }).catch(error => {
        res.json({
            success: false, message: 'Error while delete branch', error: error
        });
    });
});

router.put('/:id', (req, res) => {
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

module.exports = router;