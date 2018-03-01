var mysql = require('mysql');
var bcrypt = require('bcrypt');
var passwordHash = require('password-hash');
var SALT_WORK_FACTOR = 10;
var q = require('q');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'eu-cdbr-west-01.cleardb.com',
    user: 'bf0bc9f8df694d',
    password: '16306efb',
    database: 'heroku_8c0c9eba2ff6cfd',
    debug: false,
    port: '3306',
    multipleStatements: true
});

getConnection = function () {
    console.log("Model, GetConnection");
    var deferred = q.defer();
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("Model, GetConnection", err);
            deferred.reject(err);
        } else {
            deferred.resolve(connection);
        }
    });
    return deferred.promise;
}
pool.getUserByUserName = function (username, password) {
    console.log("Model, GetUserName", username);
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM users where user_name=?',
                [username],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
        });
    })
}

pool.changePassword = function (username, password) {
    console.log("Model, Change Password", username);
    let pass = bcrypt.hashSync(password.toLowerCase(), 10);
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('update users set password=? where user_name=?',
                [pass, username],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
        });
    })
}

pool.registerUser = function (user_name, first_name, last_name, email, password) {
    console.log("Model, Register User", user_name);
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('insert into users(user_name,first_name,last_name,email,password,role,change_password)values(?,?,?,?,?,\'RESIDENT\',0)',
                [user_name, first_name, last_name, email, bcrypt.hashSync(password.toLowerCase(), 10)],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
        });
    })
}
pool.getUserOrganisation = function (user_id, callback) {
    console.log("Model, GetUserOrganisation", user_id);
    pool.getConnection(function (err, connection) {
        connection.query('SELECT u.user_id, o.name ,o.id FROM user_organisation u inner join organisation o on u.org_id=o.id where u.user_id=?', [user_id], function (error, row, fields) {
            connection.release();
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
        });
    });
}
pool.getUserBranch = function (user_id, callback) {
    console.log("Model, GetUserBranch", user_id);
    pool.getConnection(function (err, connection) {
        connection.query('SELECT u.user_id, b.name ,b.id FROM user_branch u inner join branch b  on u.branch_id=b.id inner join organisation o on b.org_id=o.id where u.user_id=?', [user_id],
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

pool.getUserPermission = function (user_id, permission, action, branch_id) {
    console.log("Model, GetUserPermission", user_id, permission, action, branch_id);
    var deferred = q.defer();
    pool.getConnection(function (err, connection) {
        connection.query('SELECT a.*' +
            'FROM user_group u ' +
            'inner join permission_group p on u.group_id=p.group_id ' +
            'inner join  permission a on p.permission_id=a.id ' +
            'inner join user_branch b on a.branch_id=b.branch_id  and b.user_id=u.user_id ' +
            'where u.user_id=?  and a.name=? and a.action=? and a.branch_id=?', [user_id, permission, action, branch_id], function (error, row, fields) {
                connection.release();
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(row);
                }
            });
    });
    return deferred.promise;
}

getUserInfoLocal = function (connection) {
    console.log("Model, Get User Info Local");
    var deferred = q.defer();
    connection.query('SELECT u.id,u.user_name,u.first_name,u.last_name,u.email,u.role FROM heroku_8c0c9eba2ff6cfd.users u',
        function (error, results, fields) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(results);
            }
        });
    return deferred.promise;
}
getUserBranchLocal = function (connection, user_id) {
    console.log("Model, Get User Branch Local");
    var deferred = q.defer();
    connection.query('SELECT u.user_id, u.branch_id, b.name FROM user_branch u INNER JOIN branch b ON u.branch_id = b.id where u.user_id=?', [user_id],
        function (error, results, fields) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(results);
            }
        });
    return deferred.promise;
}

getUserOrganisationLocal = function (connection, user_id) {
    console.log("Model, Get User Organisation Local");
    var deferred = q.defer();
    connection.query('SELECT u.user_id, u.org_id, o.name FROM user_organisation u INNER JOIN organisation o ON u.org_id = o.id where u.user_id=4', [user_id],
        function (error, results, fields) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(results);
            }
        });
    return deferred.promise;
}

pool.getUserInfo = function () {
    console.log("Model, Get User Info");
    var deferred = q.defer();
    getConnection().then(connection => {
        getUserInfoLocal(connection).then(data => {
            let branchpromise = data.map(user => {
                return getUserBranchLocal(connection, user.id).then(branch => {

                    return Object.assign({}, user, { branch });
                })
            });
            return Promise.all(branchpromise);
        }).then(data => {
            let orgpromise = data.map(user => {
                return getUserOrganisationLocal(connection, user.id).then(organisation => {

                    return Object.assign({}, user, { organisation });
                })
            });
            return Promise.all(orgpromise);
        }).then(data => {
            connection.release();
            deferred.resolve(data);
        }).catch(error => {
            connection.release();
            deferred.reject(err);
        })
    }).catch(err => {
        connection.release();
        deferred.reject(err);
    });
    return deferred.promise;
}
module.exports = pool;