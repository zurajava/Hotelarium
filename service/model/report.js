const pool = require('../dbmanager/dbmanager.js');
var q = require('q');

class Report {
    getPaymentReport(branch_id) {
        console.log("Model, GetPaymentReport", branch_id);
        var sql = 'SELECT p.id,p.reservation_id,p.amount,p.create_date,p.type,p.source,p.ticket,p.additional_comment,p.additional_bad_price,p.extra_person_price,p.service_id,' +
            '(SELECT s.name FROM heroku_8c0c9eba2ff6cfd.service s WHERE s.id = p.service_id) AS service_name,r.room_id,m.room_no FROM heroku_8c0c9eba2ff6cfd.payment p' +
            'INNER JOIN heroku_8c0c9eba2ff6cfd.reservation_detail r ON p.reservation_id = r.id INNER JOIN heroku_8c0c9eba2ff6cfd.room m ON r.room_id = m.id' +
            'WHERE m.branch_id = ?'
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                connection.query(sql, [branch_id], function (error, row, fields) {
                    connection.release();
                    if (err) {
                        reject(err)
                    } else {
                        console.log(row);
                        resolve(row);
                    }
                });
            });
        });
    }

}
module.exports = Report;