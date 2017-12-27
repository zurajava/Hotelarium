const pool = require('../dbmanager/dbmanager.js');
var q = require('q');

class Category {
    getCategory(branch_id, callback) {
        console.log("Model, GetCategory ", branch_id);
        pool.getConnection(function (err, connection) {
            connection.query('SELECT c.*, b.name as branch_name FROM category c inner join branch b on c.branch_id=b.id  where c.branch_id=? and c.status=1', [branch_id], function (error, row, fields) {
                connection.release();
                if (error) {
                    throw error;
                } else {
                    callback(null, row);
                }
            });
        });
    }
    registerCategory(name, price, currency, description, branch_id, parking, callback) {
        console.log("Category, registerCategory ", name);
        var parkingValue;
        if (parking === true) {
            parkingValue = 'YES';
        } else {
            parkingValue = 'NO';
        }
        pool.getConnection(function (err, connection) {
            connection.query('insert into category(create_date,name,price, currency,description,branch_id,parking) values(current_timestamp,?,?,?,?,?,?)',
                [name, price, currency, description, branch_id, parkingValue],
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

    deleteCategory(id, callback) {
        console.log("Category, deleteCategory ", id);
        pool.getConnection(function (err, connection) {
            connection.query('update category set status=0 where id=?', [id], function (error, row, fields) {
                connection.release();
                if (error) {
                    throw error;
                } else {
                    callback(null, row);
                }
            });
        });
    }

    updateCategory(id, name, price, currency, description, branch_id, parking, callback) {
        console.log("Category, updateCategory ", id);
        pool.getConnection(function (err, connection) {
            connection.query('update category set name=?,price=?, currency=?, description=?,  branch_id=?, update_date=current_timestamp ,parking =? where id=?',
                [name, price, currency, description, branch_id, parking, id],
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
module.exports = Category;