var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'eu-cdbr-west-01.cleardb.com',
    user: 'bf0bc9f8df694d',
    password: '16306efb',
    database: 'heroku_8c0c9eba2ff6cfd',
    debug: false,
    port: '3306',
});

pool.getUserByUserName = function (username, password, callback) {

    pool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM users where user_name=?', [username], function (error, row, fields) {
            if (error) {
                throw error;
            } else {
                console.log(row[0]);
                callback(null, row[0]);
            }
            connection.release();
        });

    });
}


pool.getBranch = function (callback) {
    pool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM branch', function (error, row, fields) {
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
            connection.release();
        });

    });
}
pool.registerBranch = function (name, description, address, org_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('insert into branch(create_date,name,description,address,org_id) values(current_timestamp,?,?,?,?)',
            [name, description, address, org_id],
            function (error, row, fields) {
                if (error) {
                    throw error;
                } else {
                    callback(null, row);
                }
                connection.release();
            });

    });
}

pool.updateBranch = function (id, name, description, address, org_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('update branch set name=?, description=?, address=?, org_id=?, update_date=current_timestamp where id=?',
            [name, description, address, org_id, id],
            function (error, row, fields) { 
                if (error) {
                    throw error;
                } else {
                    callback(null, row);
                }
                connection.release();
            });

    });
}


pool.deleteBranch = function (id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('delete from branch where id=?', [id], function (error, row, fields) {
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
            connection.release();
        });

    });
}

module.exports = pool;