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
pool.getUserBranch = function (user_id, org_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('SELECT u.user_id, b.name ,b.id FROM user_branch u inner join branch b  on u.branch_id=b.id inner join organisation o on b.org_id=o.id where u.user_id=? and o.id=?', [user_id, org_id], function (error, row, fields) {
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


pool.registerCategory = function (name, price, currency, description, branch_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('insert into category(create_date,name,price, currency,description,branch_id) values(current_timestamp,?,?,?,?,?)',
            [name, price, currency, description, branch_id],
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

pool.updateCategory = function (id, name, price, currency, description, branch_id, callback) {
    console.log(price);
    pool.getConnection(function (err, connection) {
        connection.query('update category set name=?,price=?, currency=?, description=?,  branch_id=?, update_date=current_timestamp where id=?',
            [name, price, currency, description, branch_id, id],
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

pool.registerService = function (name, price, currency, description, branch_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('insert into service(create_date,name,price, currency,description,branch_id) values(current_timestamp,?,?,?,?,?)',
            [name, price, currency, description, branch_id],
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

pool.updateService = function (id, name, price, currency, description, branch_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('update service set name=?,price=?, currency=?, description=?,  branch_id=?, update_date=current_timestamp where id=?',
            [name, price, currency, description, branch_id, id],
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
        connection.query('SELECT c.*, t.name as category_name, b.name as branch_name FROM room c inner join branch b on c.branch_id=b.id inner join category t on c.category_id=t.id  where c.branch_id=?', [branch_id], function (error, row, fields) {
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
            connection.release();
        });

    });
}

pool.registerRoom = function (name, price, currency, room_no, description, branch_id, category_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('insert into room(create_date,name,price, currency,room_no,description,branch_id,category_id) values(current_timestamp,?,?,?,?,?,?,?)',
            [name, price, currency, room_no, description, branch_id, category_id],
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

pool.updateRoom = function (id, name, price, currency, room_no, description, branch_id, category_name, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('update room set name=?,price=?, currency=?, room_no=?, description=?,  branch_id=?, update_date=current_timestamp,category_id=? where id=?',
            [name, price, currency, room_no, description, branch_id, category_name, id],
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

pool.registerReservation = function (reservation, callback) {
    pool.getConnection(function (err, connection) {
        var person = reservation.person;

        connection.beginTransaction(function (err) {
            if (err) {
                console.log("beginTransaction", err);
                callback(err, null);
            }

            connection.query('insert into person  (first_name,last_name,personal_no,email,gender,address,birthdate,phone)values (?,?,?,?,?,?,?,?)',
                [person.first_name, person.last_name, person.personal_no, person.email, person.gender, person.address, person.birthdate, person.phone,], function (error, results, fields) {
                    if (error) {
                        if (error.code != 'ER_DUP_ENTRY') {
                            return connection.rollback(function () {
                                console.log("person", error.code);
                                callback(err, null);
                            });
                        }

                    }
                    connection.query('insert into reservation (create_date,person_no,status_id)values(current_timestamp,?,1)', [person.personal_no], function (error, results, fields) {
                        if (error) {
                            return connection.rollback(function () {
                                console.log("reservation", error);
                                callback(err, null);
                            });
                        }
                        var reservID = results.insertId;
                        var reservDetails = reservation.reservation.reservationDetail;

                        for (var i = 0; i < reservDetails.length; i++) {

                            console.log(reservDetails[i].room_id);
                            connection.query('insert into reservation_detail (reservation_id,create_date,room_id,status_id,start_date,end_date)values(?,current_timestamp,?,?,?,?)',
                                [reservID, reservDetails[i].room_id, reservDetails[i].status_id, reservDetails[i].start_date, reservDetails[i].end_date], function (error, results, fields) {
                                    if (error) {
                                        return connection.rollback(function () {
                                            console.log("reservation_detail", error);
                                            callback(error, null);
                                        });
                                    }

                                });
                        }

                        connection.commit(function (err) {
                            console.log("commit");
                            if (err) {
                                return connection.rollback(function () {
                                    console.log(err);
                                    callback(err, null);
                                });
                            }
                            callback(null, "OK");

                        });


                    });
                });


        });
    });
}

pool.getReservation = function (start_date, end_date, callback) {
    var query = 'SELECT r.id,r.reservation_id,r.create_date,r.update_date,r.room_id,r.start_date,r.end_date,r.status_id,s.name as status_name,m.branch_id,m.category_id,c.name as category_name,' +
        'c.price as category_price, m.room_no, m.name as room_name, m.price as room_price,' +
        ' a.person_no as person_no, p.first_name,p.last_name,p.email' +
        ' FROM reservation_detail r  inner join reservation_status s on r.status_id=s.id inner join heroku_8c0c9eba2ff6cfd.room m on  r.room_id=m.id ' +
        ' inner join category c on m.category_id=c.id inner join reservation a on r.reservation_id=a.id inner join person p on a.person_no=p.personal_no' +
        ' where start_date>? and start_date<?';
    pool.getConnection(function (err, connection) {
        connection.query(query, [start_date, end_date], function (error, row, fields) {
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
            connection.release();
        });

    });
}

pool.getPerson = function (person_no, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM person where personal_no like ?', ['%' + person_no + '%'], function (error, row, fields) {
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