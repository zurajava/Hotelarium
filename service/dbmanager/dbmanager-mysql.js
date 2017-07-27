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


pool.getBranch = function (org_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('SELECT b.*,o.name as org_name FROM branch b inner join organisation o on b.org_id=o.id where b.org_id=?', [org_id], function (error, row, fields) {
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


pool.getUserOrganisation = function (user_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('SELECT u.user_id, o.name ,o.id FROM user_organisation u inner join organisation o on u.org_id=o.id where u.user_id=?', [user_id], function (error, row, fields) {
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
            connection.release();
        });

    });
}
pool.getUserBranch = function (user_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('SELECT u.user_id, b.name ,b.id FROM user_branch u inner join branch b on u.branch_id=b.id where u.user_id=?', [user_id], function (error, row, fields) {
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
            connection.release();
        });

    });
}


pool.getCategory = function (branch_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('SELECT c.*, b.name as branch_name FROM category c inner join branch b on c.branch_id=b.id  where c.branch_id=?', [branch_id], function (error, row, fields) {
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
            connection.release();
        });

    });
}


pool.registerCategory = function (name, description, branch_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('insert into category(create_date,name,description,branch_id) values(current_timestamp,?,?,?)',
            [name, description, branch_id],
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

pool.deleteCategory = function (id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('delete from category where id=?', [id], function (error, row, fields) {
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
            connection.release();
        });

    });
}

pool.updateCategory = function (id, name, description, branch_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('update category set name=?, description=?,  branch_id=?, update_date=current_timestamp where id=?',
            [name, description, branch_id, id],
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

pool.getService = function (branch_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('SELECT c.*, b.name as branch_name FROM service c inner join branch b on c.branch_id=b.id  where c.branch_id=?', [branch_id], function (error, row, fields) {
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
            connection.release();
        });

    });
}

pool.registerService = function (name, description, branch_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('insert into service(create_date,name,description,branch_id) values(current_timestamp,?,?,?)',
            [name, description, branch_id],
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

pool.deleteService = function (id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('delete from service where id=?', [id], function (error, row, fields) {
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
            connection.release();
        });

    });
}

pool.updateService = function (id, name, description, branch_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('update service set name=?, description=?,  branch_id=?, update_date=current_timestamp where id=?',
            [name, description, branch_id, id],
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







pool.getRoom = function (branch_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('SELECT c.*, b.name as branch_name FROM room c inner join branch b on c.branch_id=b.id  where c.branch_id=?', [branch_id], function (error, row, fields) {
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
            connection.release();
        });

    });
}

pool.registerRoom = function (name, room_no, description, branch_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('insert into room(create_date,name,room_no,description,branch_id) values(current_timestamp,?,?,?,?)',
            [name, room_no, description, branch_id],
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

pool.deleteRoom = function (id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('delete from room where id=?', [id], function (error, row, fields) {
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
            connection.release();
        });

    });
}

pool.updateRoom = function (id, name,room_no, description, branch_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('update room set name=?,room_no=?, description=?,  branch_id=?, update_date=current_timestamp where id=?',
            [name,room_no, description, branch_id, id],
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




module.exports = pool;