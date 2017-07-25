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


pool.getUsers = function (callback) {

    pool.getConnection(function (err, connection) {

        connection.query('SELECT * FROM `cms-app`.users', function (error, row, fields) {
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