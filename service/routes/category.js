const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
var url = require("url");
const Category = require('../model/category.js');
var pool = new Category(); 

router.get('/:branch_id', (req, res) => {
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


router.post('/', (req, res) => {
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


router.delete('/:id', (req, res) => {
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


router.put('/:id', (req, res) => {
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

module.exports = router;