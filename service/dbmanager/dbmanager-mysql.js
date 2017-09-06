var mysql = require('mysql');
var q = require('q');

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
pool.registerBranch = function (name, description, address, org_id, mail, phone, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('insert into branch(create_date,name,description,address,org_id,mail,phone) values(current_timestamp,?,?,?,?,?,?)',
            [name, description, address, org_id, mail, phone],
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

pool.updateBranch = function (id, name, description, address, org_id, mail, phone, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('update branch set name=?, description=?, address=?, org_id=?, update_date=current_timestamp,mail=?, phone=? where id=?',
            [name, description, address, org_id, mail, phone, id],
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
        connection.query('SELECT u.user_id, b.name ,b.id FROM user_branch u inner join branch b  on u.branch_id=b.id inner join organisation o on b.org_id=o.id where u.user_id=?', [user_id], function (error, row, fields) {
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


pool.registerCategory = function (name, price, currency, description, branch_id, parking, callback) {
    var parkingValue;
    if (parking === true) {
        parkingValue = 'YES';
    } else {
        parkingValue = 'NO';
    }
    pool.getConnection(function (err, connection) {
        connection.query('insert into category(create_date,name,price, currency,description,branch_id,parking) values(current_timestamp,?,?,?,?,?,?)',
            [name, price, currency, description, branch_id, parkingValue],
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

pool.updateCategory = function (id, name, price, currency, description, branch_id, parking, callback) {
    var parkingValue;
    if (parking === true) {
        parkingValue = 'YES';
    } else {
        parkingValue = 'NO';
    }
    pool.getConnection(function (err, connection) {
        connection.query('update category set name=?,price=?, currency=?, description=?,  branch_id=?, update_date=current_timestamp ,parking =? where id=?',
            [name, price, currency, description, branch_id, parkingValue, id],
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


pool.getRoom = function (branch_id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('SELECT c.*, t.name as category_name, b.name as branch_name FROM room c inner join branch b on c.branch_id=b.id inner join category t on c.category_id=t.id  where c.branch_id=?', [branch_id], function (error, row, fields) {
                if (err) {
                    reject(err)
                } else {
                    connection.release();
                    resolve(row);
                }
            });
        });

    });
}

pool.registerRoom = function (name, price, currency, room_no, description, branch_id, category_id, smoke, wifi, tag, callback) {
    var smokeValue;
    if (smoke === true) {
        smokeValue = 'YES';
    } else {
        smokeValue = 'NO';
    }
    var wifiValue;
    if (wifi === true) {
        wifiValue = 'YES';
    } else {
        wifiValue = 'NO';
    }

    pool.getConnection(function (err, connection) {
        connection.query('insert into room(create_date,name,price, currency,room_no,description,branch_id,category_id,smoke,wifi,tag) values(current_timestamp,?,?,?,?,?,?,?,?,?,?)',
            [name, price, currency, room_no, description, branch_id, category_id, smokeValue, wifiValue, tag],
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

pool.updateRoom = function (id, name, price, currency, room_no, description, branch_id, category_name, smoke, wifi, tag, callback) {
    var smokeValue;
    if (smoke === true) {
        smokeValue = 'YES';
    } else {
        smokeValue = 'NO';
    }
    var wifiValue;
    if (wifi === true) {
        wifiValue = 'YES';
    } else {
        wifiValue = 'NO';
    }
    pool.getConnection(function (err, connection) {
        connection.query('update room set name=?,price=?, currency=?, room_no=?, description=?,  branch_id=?, update_date=current_timestamp,category_id=? ,smoke=?, wifi=?, tag=? where id=?',
            [name, price, currency, room_no, description, branch_id, category_name, smokeValue, wifiValue, tag, id],
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


savePerson = function (branch_id) {
    return new Promise(function (resolve, reject) {
        var categoryData;
        var query = 'SELECT id,name,price,currency FROM category  where branch_id=?';
        pool.getConnection(function (err, connection) {
            connection.query(query, [branch_id], function (error, row, fields) {
                if (error) {
                    reject(error);
                } else {
                    connection.release();
                    reject(row);
                }
            });
        });
    });
}
pool.checkReservation = function (data) {
    return new Promise(function (resolve, reject) {
        var categoryData;
        var query = 'SELECT  count(1) as count FROM reservation_detail t where t.room_id=? and t.status_id in(1,2,3) and ((?>=DATE(t.start_date)  and ?<DATE(t.end_date) ) ' +
            ' or (?>DATE(t.start_date)  and ?<=DATE(t.end_date) ))';
        pool.getConnection(function (err, connection) {
            connection.query(query, [data.room_id, data.start_date, data.start_date, data.end_date, data.end_date], function (error, row, fields) {
                if (error) {
                    reject(error);
                } else {
                    connection.release();
                    console.log("checkReservation", data.start_date, data.end_date, row[0].count);
                    if (row[0].count > 0) {
                        reject('Room ' + data.room_id + ' is not availabe in this period ' + data.start_date + ' - ' + data.end_date);
                    } else {
                        resolve('Free');
                    }
                }
            });
        });
    });
}

pool.registerReservation = function (reservation) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            var person = reservation.person;
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err);
                }
                connection.query('insert into person  (first_name,last_name,personal_no,email,gender,address,birthdate,phone)values (?,?,?,?,?,?,?,?)',
                    [person.first_name, person.last_name, person.personal_no, person.email, person.gender, person.address, person.birthdate, person.phone],
                    function (error, results, fields) {
                        if (error) {
                            if (error.code != 'ER_DUP_ENTRY') {
                                return connection.rollback(function () {
                                    console.log("person", error.code);
                                    reject(error);
                                });
                            }

                        }
                        connection.query('insert into reservation (create_date,person_no,status_id)values(current_timestamp,?,1)', [person.personal_no], function (error, results, fields) {
                            if (error) {
                                return connection.rollback(function () {
                                    console.log("reservation", error);
                                    reject(error);
                                });
                            }
                            var reservID = results.insertId;
                            var reservDetails = reservation.reservation.reservationDetail;

                            reservDetails.map(data => {

                                connection.query('insert into reservation_detail (reservation_id,create_date,room_id,status_id,start_date,end_date,payment_type,adult,child,additional_bed,payment_status)values(?,current_timestamp,?,?,?,?,?,?,?,?,?)',
                                    [reservID, data.room_id, data.status_id, data.start_date, data.end_date,
                                        data.payment_type, data.adult, data.child, data.additional_bed, data.payment_status],
                                    function (error, results, fields) {
                                        if (error) {
                                            return connection.rollback(function () {
                                                console.log("reservation_detail", error);
                                                reject(error);
                                            });
                                        }
                                        data.id = results.insertId;
                                        var id = results.insertId;

                                        data.reservationPerson.map(person => {
                                            connection.query('insert into reservation_person(reservation_id,person_id)values(?,?)',
                                                [id, person.person_id],
                                                function (error, results, fields) {
                                                    if (error) {
                                                        return connection.rollback(function () {
                                                            console.log("person", error.code);
                                                            reject(error);
                                                        });
                                                    }
                                                });
                                        });
                                        data.reservationService.map(service => {
                                            connection.query('insert into reservation_service (reservation_id, service_id,frequency, additional_comment)values (?,?,?,?)',
                                                [id, service.service_id, service.frequency, service.additional_comment],
                                                function (error, results, fields) {
                                                    if (error) {
                                                        return connection.rollback(function () {
                                                            console.log("service", error);
                                                            reject(error);
                                                        });
                                                    }
                                                });
                                        });
                                    });
                            });

                            connection.commit(function (err) {
                                console.log("commit");
                                if (err) {
                                    return connection.rollback(function () {
                                        console.log(err);
                                        reject(err);
                                    });
                                }
                                resolve("OK");
                            });
                        });
                    });
            });
        });
    });
}

getCategory = function (branch_id) {
    var deferred = q.defer();
    var categoryData;
    var query = 'SELECT id,name,price,currency FROM category  where branch_id=?';
    pool.getConnection(function (err, connection) {
        connection.query(query, [branch_id], function (error, row, fields) {
            if (error) {
                deferred.reject(error);
            } else {
                connection.release();
                deferred.resolve(row);
            }
        });
    });
    return deferred.promise;
}

getRoom = function (branch_id, categoryID) {

    var deferred = q.defer();
    var roomData;
    var roomSql = 'SELECT id,room_no,name,price,currency FROM room  where branch_id=? and category_id=?';
    pool.getConnection(function (err, connection) {
        connection.query(roomSql, [branch_id, categoryID], function (error, row, fields) {
            if (err) {
                deferred.reject(err);
            } else {
                connection.release();
                deferred.resolve(row);
            }
        });
    });
    return deferred.promise;
}

getReservationL = function (room_id, start_date, end_date) {
    var deferred = q.defer();
    var reservationData;
    var reservationSql = 'SELECT d.id,d.create_date,d.payment_type,d.update_date,d.room_id,d.status_id,d.start_date,d.end_date, ' +
        ' s.name as status_name,a.id as reservation_id,a.person_no as person_no, p.first_name,p.last_name,p.email ' +
        ' FROM heroku_8c0c9eba2ff6cfd.reservation_detail d ' +
        ' inner join heroku_8c0c9eba2ff6cfd.reservation_status s on d.status_id=s.id ' +
        ' inner join heroku_8c0c9eba2ff6cfd.reservation a on d.reservation_id=a.id ' +
        ' inner join heroku_8c0c9eba2ff6cfd.person p on a.person_no=p.personal_no ' +
        ' where d.room_id=? and d.start_date >? and d.start_date<? order by d.start_date asc';
    pool.getConnection(function (err, connection) {
        connection.query(reservationSql, [room_id, start_date, end_date], function (error, row, fields) {
            if (err) {
                deferred.reject(err);
            } else {
                connection.release();
                deferred.resolve(row);
            }
        });
    });
    return deferred.promise;
}



pool.getReservation = function (branch_id, start_date, end_date) {
    var deferred = q.defer();


    getCategory(branch_id)
        .then(categories => {

            let roomPromises = categories.map(category => {
                return getRoom(branch_id, category.id)
                    .then(rooms => Object.assign({}, category, { rooms }))
            });

            return Promise.all(roomPromises)
        })
        .then(category_rooms => {

            let finalPromise = category_rooms.map(category => {

                let reservationPromises = category.rooms.map(room => {
                    return getReservationL(room.id, start_date, end_date)
                        .then(reservations => Object.assign({}, room, { reservations }))
                })

                return Promise.all(reservationPromises)
                    .then(room_reservations => {
                        return Object.assign({}, category, { rooms: room_reservations })
                    });
            })
            return Promise.all(finalPromise)
        })
        .then(data => {
            console.log('final: ', data);
            deferred.resolve(data);
        })
        .catch(function (err) {
            deferred.reject(err);
        });
    return deferred.promise;
}


getReservation = function (id) {
    var deferred = q.defer();
    var categoryData;
    var query = 'SELECT * FROM reservation  where id=?';
    pool.getConnection(function (err, connection) {
        connection.query(query, [id], function (error, row, fields) {
            if (error) {
                deferred.reject(error);
            } else {
                connection.release();
                deferred.resolve(row);
            }
        });
    });
    return deferred.promise;
}

getPersonByPersonalNo = function (personal_no) {
    var deferred = q.defer();
    var categoryData;
    var query = 'SELECT * FROM  person where personal_no=?';
    pool.getConnection(function (err, connection) {
        connection.query(query, [personal_no], function (error, row, fields) {
            if (error) {
                deferred.reject(error);
            } else {
                connection.release();
                deferred.resolve(row);
            }
        });
    });
    return deferred.promise;
}

getReservationsDetails = function (reservation_id) {
    var deferred = q.defer();
    var categoryData;
    var query = 'SELECT r.*,c.id as category_id,c.name as category_name FROM reservation_detail r ' +
        ' inner join room o on r.room_id=o.id   inner join heroku_8c0c9eba2ff6cfd.category c on o.category_id=c.id  where reservation_id=?';
    pool.getConnection(function (err, connection) {
        connection.query(query, [reservation_id], function (error, row, fields) {
            if (error) {
                deferred.reject(error);
            } else {
                connection.release();
                deferred.resolve(row);
            }
        });
    });
    return deferred.promise;
}
getReservationsServices = function (reservation_id) {
    var deferred = q.defer();
    var categoryData;
    var query = 'SELECT r.*, s.name as service_name, s.price as price ' +
        ' FROM reservation_service r inner join service s on r.service_id=s.id where  reservation_id=?';
    pool.getConnection(function (err, connection) {
        connection.query(query, [reservation_id], function (error, row, fields) {
            if (error) {
                deferred.reject(error);
            } else {
                connection.release();
                deferred.resolve(row);
            }
        });
    });
    return deferred.promise;
}

getReservationsPersons = function (reservation_id) {
    var deferred = q.defer();
    var categoryData;
    var query = 'SELECT r.*,c.id as category_id,c.name as category_name FROM reservation_detail r ' +
        ' inner join room o on r.room_id=o.id   inner join heroku_8c0c9eba2ff6cfd.category c on o.category_id=c.id  where reservation_id=?';
    pool.getConnection(function (err, connection) {
        connection.query(query, [reservation_id], function (error, row, fields) {
            if (error) {
                deferred.reject(error);
            } else {
                connection.release();
                deferred.resolve(row);
            }
        });
    });
    return deferred.promise;
}


pool.getReservationById = function (id) {
    var deferred = q.defer();

    getReservation(id).then(reservation => {
        return getReservationsDetails(reservation[0].id).then(reservations => {
            return Object.assign({}, reservation[0], { reservationDetail: reservations });;
        })
    })
    /*.then(reservationsService => {
        console.log("reservationsService",JSON.stringify(reservationsService));

        let finalPromise = reservationsService.reservationdetail.map(reservationdetail => {
            return getReservationsServices(reservationdetail.id).then(reservations => {
                var d = Object.assign({}, reservationdetail, { reservationservice: reservations });
                return Object.assign({}, reservationsService, { reservationdetail: d });
            })
        });

        return Promise.all(finalPromise);
    })*/.then(reservationPerson => {
            return getPersonByPersonalNo(reservationPerson.person_no).then(data => {
                return { "person": data[0], "reservation": reservationPerson };
            })
        }).then(reservations => {
            deferred.resolve(reservations);
        }).catch(function (err) {
            deferred.reject(err);
        });
    return deferred.promise;
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

pool.getUserPermission = function (user_id, permission, action, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('SELECT a.*' +
            'FROM user_group u ' +
            'inner join permission_group p on u.group_id=p.group_id ' +
            'inner join  permission a on p.permission_id=a.id ' +
            'inner join user_branch b on a.branch_id=b.branch_id  and b.user_id=u.user_id ' +
            'where u.user_id=?  and a.name=? and a.action=?', [user_id, permission, action], function (error, row, fields) {
                if (error) {
                    throw error;
                } else {
                    console.log(row);
                    callback(null, row);
                }
                connection.release();
            });

    });
}
module.exports = pool;