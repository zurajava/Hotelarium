const pool = require('../dbmanager/dbmanager.js');
var q = require('q');

class Service {
    getService(branch_id, callback) {
        console.log("Model, GetService", branch_id);
        pool.getConnection(function (err, connection) {
            connection.query('SELECT c.*, b.name as branch_name FROM service c inner join branch b on c.branch_id=b.id  where c.branch_id=? and c.status=1', [branch_id], function (error, row, fields) {
                connection.release();
                if (error) {
                    throw error;
                } else {
                    callback(null, row);
                }
            });
        });
    }

    registerService(name, price, description, branch_id, type, durationall_type, durationall_count, callback) {
        console.log("Service, registerService  ", name);
        pool.getConnection(function (err, connection) {
            connection.query('insert into service(create_date,name,price,description,branch_id,type,durationall_type,durationall_count) values(current_timestamp,?,?,?,?,?,?,?)',
                [name, price, description, branch_id, type, durationall_type, durationall_count],
                function (error, row, fields) {
                    connection.release();
                    if (error) {
                        throw error;
                    } else {
                        callback(null, row);
                    }
                });
        });
    }

    deleteService(id, callback) {
        console.log("Service, deleteService  ", id);
        pool.getConnection(function (err, connection) {
            connection.query('update service set status=0 where id=?', [id], function (error, row, fields) {
                connection.release();
                if (error) {
                    throw error;
                } else {
                    callback(null, row);
                }
            });
        });
    }
    updateService(id, name, price, description, branch_id, type, durationall_type, durationall_count, callback) {
        console.log("Service, deleteService  ", id);
        pool.getConnection(function (err, connection) {
            connection.query('update service set name=?,price=?, description=?,  branch_id=?, update_date=current_timestamp,type=?,durationall_type=?, durationall_count=? where id=?',
                [name, price, description, branch_id, type, durationall_type, durationall_count, id],
                function (error, row, fields) {
                    connection.release();
                    if (error) {
                        throw error;
                    } else {
                        callback(null, row);
                    }
                });
        });
    }

}
module.exports = Service;