const pool = require('../dbmanager/dbmanager.js');
var q = require('q');

class Branch {
    getBranch(org_id, callback) {
        console.log("Branch, GetBranch", org_id);
        pool.getConnection(function (err, connection) {
            connection.query('SELECT b.*,o.name as org_name FROM branch b inner join organisation o on b.org_id=o.id where b.org_id=? and b.status=1', [org_id], function (error, row, fields) {
                connection.release();
                if (error) {
                    throw error;
                } else {
                    callback(null, row);
                }
            });

        });
    }

    registerBranch(name, description, address, org_id, mail, phone) {
        console.log("Branch, RegisterBranch", name, description, address, org_id, mail, phone);
        var deferred = q.defer();
        this.registerBranchLocal(name, description, address, org_id, mail, phone).then(data => {
            this.registerBranchPermisstion(data).then(result => {
                console.log("result", result);
            }).catch(err => {
                deferred.reject(err);
            })
        }).then(data => {
            deferred.resolve(data);
        }).catch(function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }
    deleteBranch(id) {
        console.log("Branch, DeleteBranch", id);
        var deferred = q.defer();
        this.deleteBranchLocal(id)
            .then(data => {
                this.deleteBranchPermission(id).then(data => {
                    return data;
                });
            }).then(data => {
                deferred.resolve("OK");
            }).catch(function (err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    updateBranch(id, name, description, address, org_id, mail, phone, callback) {
        console.log("Branch, UpdateBranch", id, name, description, address, org_id, mail, phone);
        pool.getConnection(function (err, connection) {
            connection.query('update branch set name=?, description=?, address=?, org_id=?, update_date=current_timestamp,mail=?, phone=? where id=?',
                [name, description, address, org_id, mail, phone, id],
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

    registerBranchLocal(name, description, address, org_id, mail, phone) {
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                connection.query('insert into branch(create_date,name,description,address,org_id,mail,phone) values(current_timestamp,?,?,?,?,?,?)',
                    [name, description, address, org_id, mail, phone],
                    function (error, results, fields) {
                        connection.release();
                        if (error) {
                            console.log("registerBranchLocal roor", error.code);
                            reject(error);
                        } else {
                            resolve(results.insertId);
                        }
                    });
            });
        })
    }

    deleteBranchLocal(id) {
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                connection.query('update branch set status=0 where id=?',
                    [id],
                    function (error, results, fields) {
                        connection.release();
                        if (error) {
                            reject(error);
                        } else {
                            resolve(results.insertId);
                        }
                    });
            });
        })
    }
    deleteUserBranchLocal(id) {
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                connection.query('delete from user_branch where branch_id=?',
                    [id],
                    function (error, results, fields) {
                        connection.release();
                        if (error) {
                            console.log("delete branch error", error.code);
                            reject(error);
                        } else {
                            resolve(results);
                        }
                    });
            });
        })
    }

    registerBranchPermisstion(branch_id) {
        console.log("registerBranchPermisstion", branch_id);
        let v1 = 'INSERT INTO permission(branch_id,name,action) VALUES ?';

        var values = [
            [branch_id, 'reservation', 'GET'],
            [branch_id, 'reservation', 'POST'],
            [branch_id, 'reservation', 'DELETE'],
            [branch_id, 'reservation', 'PUT'],
            [branch_id, 'room', 'GET'],
            [branch_id, 'room', 'POST'],
            [branch_id, 'room', 'DELETE'],
            [branch_id, 'room', 'PUT'],
            [branch_id, 'service', 'GET'],
            [branch_id, 'service', 'POST'],
            [branch_id, 'service', 'DELETE'],
            [branch_id, 'service', 'PUT'],
            [branch_id, 'category', 'GET'],
            [branch_id, 'category', 'POST'],
            [branch_id, 'category', 'DELETE'],
            [branch_id, 'category', 'PUT'],
            [branch_id, 'payment', 'POST']
        ];
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                connection.query(v1, [values],
                    function (error, results, fields) {
                        connection.release();
                        if (error) {
                            reject(error);
                        } else {
                            resolve(results);
                        }
                    });
            })
        })
    }
    deleteBranchPermission(branch_id) {
        console.log("deleteBranchPermission",branch_id);
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                connection.query('delete FROM permission  where branch_id=?',
                    [branch_id],
                    function (error, results, fields) {
                        connection.release();
                        if (error) {
                            reject(error);
                        } else {
                            console.log(results);
                            resolve(results);
                        }
                    });
            });
        })
    }
}
module.exports = Branch;