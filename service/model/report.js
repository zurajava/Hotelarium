const pool = require('../dbmanager/dbmanager.js');
var q = require('q');

class Report {
    getPaymentReport(branch_id, date_from, date_to) {
        console.log("Model, GetPaymentReport", branch_id, date_from, date_to);
        var sql = 'SELECT p.id,p.reservation_id,p.amount,p.create_date,p.type,p.source,p.ticket,p.additional_comment,p.additional_bad_price,p.extra_person_price,p.service_id,' +
            ' (SELECT s.name FROM service s WHERE s.id = p.service_id) AS service_name,r.room_id,m.room_no FROM payment p' +
            ' INNER JOIN reservation_detail r ON p.reservation_id = r.id INNER JOIN room m ON r.room_id = m.id' +
            ' WHERE m.branch_id = ? and p.create_date>=? and p.create_date<=? order by p.create_date ';
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                connection.query(sql, [branch_id, date_from, date_to], function (error, row, fields) {
                    connection.release();
                    if (error) {
                        reject(error)
                    } else {
                        resolve(row);
                    }
                });
            });
        });
    }
    getSalesReport(branch_id, date_from, date_to) {
        console.log("Model, GetSalesReport", branch_id, date_from, date_to);
        var sql = 'SELECT MONTHNAME(r.create_date) as month,c.name as category,m.room_no as room,s.name as action,COUNT(1) as count FROM reservation_detail r INNER JOIN room m ON r.room_id = m.id INNER JOIN' +
            ' category c ON m.category_id = c.id INNER JOIN reservation_status s ON r.status_id = s.id WHERE' +
            ' m.branch_id = ?  AND r.create_date >= ? AND r.create_date <= ? GROUP BY MONTHNAME(r.create_date) , c.name , m.room_no , s.name';
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                connection.query(sql, [branch_id, date_from, date_to], function (error, row, fields) {
                    connection.release();
                    if (error) {
                        reject(error)
                    } else {
                        resolve(row);
                    }
                });
            });
        });
    }

}
module.exports = Report;