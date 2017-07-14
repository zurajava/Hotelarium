var Pool = require('pg-pool');
var dotenv = require('dotenv').config();
var url = require('url');

const params = process.env.DATABASE_URL;
const auth = params.split(':');

console.log(auth[2].split('@')[0]);
console.log(auth[1].split('/')[2]);
var pool = new Pool({
    host: auth[2].split('@')[1],
    port: auth[3].split('/')[0],
    database: auth[3].split('/')[1],
    user: auth[1].split('/')[2],
    password: auth[2].split('@')[0],
    max: 20,
    min: 4,
   // ssl: auth[4],
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 1000,
});


pool.getUserByUserName = function (username, password, callback) {
    console.log(username + " " + password);
    const query = {
        name: 'fetch-user',
        text: 'select * from "USERS" where user_name = $1',
        values: [username]
    }

    pool.connect((err, client, done) => {
        if (err) {
            console.log(err);
            return done(err);
        }
        client.query(query, (err, res) => {
            done();
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                console.log(res.rows[0]);
                callback(null, res.rows[0]);
            }
        })
    })
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