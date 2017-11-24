const pool = require('../dbmanager/dbmanager.js');
var q = require('q');

class Branch {
    getBranch(org_id, callback) {
        console.log("getBranch", org_id);
        pool.getConnection(function (err, connection) {
            connection.query('SELECT b.*,o.name as org_name FROM branch b inner join organisation o on b.org_id=o.id where b.org_id=?', [org_id], function (error, row, fields) {
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
        console.log("registerBranch", name);
        var deferred = q.defer();
        this.registerBranchLocal(name, description, address, org_id, mail, phone).then(data => {
            return new Promise(function (resolve, reject) {
                pool.getConnection(function (err, connection) {
                    connection.query('insert into  user_branch(user_id,branch_id) values(?,?)',
                        [4, data],
                        function (error, results, fields) {
                            connection.release();
                            if (error) {
                                console.log("assigneBranchToUserLocal roor", error.code);
                                reject(error);
                            } else {
                                resolve(results);
                            }
                        });
                });
            })
        }).then(data => {
            deferred.resolve(data);
        }).catch(function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }
    deleteBranch(id) {
        console.log("deleteBranch", id);
        var deferred = q.defer();
        this.deleteUserBranchLocal(id).then(data => {
            this.deleteBranchLocal(id).then(data => {
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
        console.log("updateBranch", id);
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
        console.log("registerBranchLocal", name);
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
        console.log("deleteBranchLocal", id);
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                connection.query('delete from branch where id=?',
                    [id],
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
    deleteUserBranchLocal(id) {
        console.log("deleteUserBranchLocal", id);
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
}
module.exports = Branch;