const pool = require('../dbmanager/dbmanager.js');
var q = require('q');

class Service {
    getService(branch_id, callback) {
        console.log("Model, GetService", branch_id);
        pool.getConnection(function (err, connection) {
            connection.query('SELECT c.*, b.name as branch_name FROM service c inner join branch b on c.branch_id=b.id  where c.branch_id=?', [branch_id], function (error, row, fields) {
                connection.release();
                if (error) {
                    throw error;
                } else {
                    callback(null, row);
                }
            });
        });
    }

    registerService(name, price, currency, description, branch_id, type, callback) {
        console.log("Service, registerService  ", name);
        pool.getConnection(function (err, connection) {
            connection.query('insert into service(create_date,name,price, currency,description,branch_id,type) values(current_timestamp,?,?,?,?,?,?)',
                [name, price, currency, description, branch_id, type],
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
            connection.query('delete from service where id=?', [id], function (error, row, fields) {
                connection.release();
                if (error) {
                    throw error;
                } else {
                    callback(null, row);
                }
            });
        });
    }
    updateService(id, name, price, currency, description, branch_id, type, callback) {
        console.log("Service, deleteService  ", id);
        pool.getConnection(function (err, connection) {
            connection.query('update service set name=?,price=?, currency=?, description=?,  branch_id=?, update_date=current_timestamp,type=? where id=?',
                [name, price, currency, description, branch_id, type, id],
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