var Pool = require('pg-pool');
var dotenv = require('dotenv').config();
var url = require('url');

const params = process.env.DATABASE_URL;
const auth = params.split(':');

/*
var pool = new Pool({
    host: auth[2].split('@')[1],
    port: auth[3].split('/')[0],
    database: auth[3].split('/')[1],
    user: auth[1].split('/')[2],
    password: auth[2].split('@')[0],
    max: 20,
    min: 4,
    ssl: auth[4],
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 1000,
}); */


var pool = new Pool({
    host: 'ec2-54-75-239-190.eu-west-1.compute.amazonaws.com',
    port: '5432',
    database: 'dbaui3el13df4',
    user: 'oyrekqyjnlzajf',
    password: 'Zz1234567',
    max: 20,
    min: 4,
 //   ssl: true,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 1000,
});


pool.getUserByUserName = function (username, password, callback) {
    console.log(username + " " + password);
    const query = {
        name: 'fetch-user',
        text: 'select * from "USERS" where user_name = $1',
        values: [username.toUpperCase()]
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

    console.log("getUsers");
    const query = {
        name: 'fetch-user',
        text: 'select * from "USERS"'
    }

    pool.connect((err, client, done) => {
        if (err) {
            console.log(err);
            return done(err);
        }
        client.query(query, (err, res) => {
            done();
            if (err) {
                callback(err, null);
            } else {
                callback(null, res.rows);
            }
        })
    })
}

module.exports = pool;