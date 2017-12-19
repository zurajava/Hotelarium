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

}
module.exports = Report;