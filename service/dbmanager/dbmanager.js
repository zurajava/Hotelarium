// Load module
var mysql = require('mysql');
// Initialize pool
var pool = mysql.createPool({
    connectionLimit: 100,
    host: '127.0.0.1',
    user: 'zura',
    password: 'Zz1234567',
    database: 'cms-app',
    debug: false,
    port: '3306',
    //port     :  '8889' 
});

pool.getUserByUserName = function (username, password, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM `cms-app`.users where user_name=?', [username.toLowerCase()], function (error, row, fields) {
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
            connection.release();
        });

    });
}


pool.registerUser = function (user_name, password, first_name, last_name, email, birthdate, gender, image_url, callback) {
   
    console.log((new Date()));
    pool.getConnection(function (err, connection) {
        connection.query('INSERT INTO `cms-app`.`users` (`user_name`, `password`, `first_name`, `last_name`, `email`, `birthdate`, `gender`,`image_url`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [user_name, password, first_name, last_name, email, birthdate.split("T")[0], gender, image_url], function (error, result) {
            if (error) {
                console.log(error.message);
                callback(error.message, null);
            } else {
                callback(null, result);
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

pool.getNews = function (title, description, callback) {

    pool.getConnection(function (err, connection) {

        connection.query('select * from news where title like ? and description like ?', ['%' + title + '%', '%' + description + '%'], function (error, row, fields) {
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