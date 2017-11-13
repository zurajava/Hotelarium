var mysql = require('mysql');
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

pool.getUserByUserName = function (username, password, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM users where user_name=?', [username], function (error, row, fields) {
            connection.release();
            if (error) {
                throw error;
            } else {
                callback(null, row[0]);
            }
        });
    });
}


pool.getBranch = function (org_id, callback) {
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
registerBranchLocal = function (name, description, address, org_id, mail, phone) {
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

pool.registerBranch = function (name, description, address, org_id, mail, phone) {
    console.log("registerBranch", name);
    var deferred = q.defer();
    registerBranchLocal(name, description, address, org_id, mail, phone).then(data => {
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



pool.updateBranch = function (id, name, description, address, org_id, mail, phone, callback) {
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


deleteBranchLocal = function (id) {
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

deleteUserBranchLocal = function (id) {
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

pool.deleteBranch = function (id) {
    console.log("deleteBranch", id);
    var deferred = q.defer();
    deleteUserBranchLocal(id).then(data => {
        deleteBranchLocal(id).then(data => {
            return data;
        });
    }).then(data => {
        deferred.resolve("OK");
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
}


pool.getUserOrganisation = function (user_id, callback) {
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


pool.getCategory = function (branch_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('SELECT c.*, b.name as branch_name FROM category c inner join branch b on c.branch_id=b.id  where c.branch_id=?', [branch_id], function (error, row, fields) {
            connection.release();
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
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
                connection.release();
                if (error) {
                    throw error;
                } else {
                    callback(null, row);
                }
            });
    });
}

pool.deleteCategory = function (id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('delete from category where id=?', [id], function (error, row, fields) {
            connection.release();
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
        });
    });
}

pool.updateCategory = function (id, name, price, currency, description, branch_id, parking, callback) {
 
    console.log("updateCategory..........",parking,parkingValue);
    pool.getConnection(function (err, connection) {
        connection.query('update category set name=?,price=?, currency=?, description=?,  branch_id=?, update_date=current_timestamp ,parking =? where id=?',
            [name, price, currency, description, branch_id, parking, id],
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

pool.getService = function (branch_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('SELECT c.*, b.name as branch_name FROM service c inner join branch b on c.branch_id=b.id  where c.branch_id=?', [branch_id], function (error, row, fields) {
            connection.release();
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
        });
    });
}

pool.registerService = function (name, price, currency, description, branch_id, type, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('insert into service(create_date,name,price, currency,description,branch_id,type) values(current_timestamp,?,?,?,?,?,?)',
            [name, price, currency, description, branch_id, type],
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

pool.deleteService = function (id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('delete from service where id=?', [id], function (error, row, fields) {
            connection.release();
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
        });
    });
}

pool.updateService = function (id, name, price, currency, description, branch_id, type, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('update service set name=?,price=?, currency=?, description=?,  branch_id=?, update_date=current_timestamp,type=? where id=?',
            [name, price, currency, description, branch_id, type, id],
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


pool.getRoom = function (branch_id, category_id) {
    console.log("getRoom sql: ", category_id)
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('SELECT c.*, t.name as category_name, b.name as branch_name FROM room c inner join branch b on c.branch_id=b.id inner join category t on c.category_id=t.id  where c.branch_id=? and (c.category_id=? or ? is null)',
                [branch_id, category_id, category_id], function (error, row, fields) {
                    connection.release();
                    if (err) {
                        reject(err)
                    } else {
                        resolve(row);
                    }
                });
        });
    });
}

pool.registerRoom = function (name, price, currency, room_no, description, branch_id, category_id, smoke, wifi, tag, additional_bad, additional_bad_price, extra_person, extra_person_price, callback) {
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
        connection.query('insert into room(create_date,name,price, currency,room_no,description,branch_id,category_id,smoke,wifi,tag,additional_bad,additional_bad_price,extra_person,extra_person_price) values(current_timestamp,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [name, price, currency, room_no, description, branch_id, category_id, smokeValue, wifiValue, tag,
                additional_bad, additional_bad_price, extra_person, extra_person_price], function (error, row, fields) {
                    connection.release();
                    if (error) {
                        console.log(error);
                        callback(error, null);
                    } else {
                        callback(null, row);
                    }
                });
    });
}

pool.deleteRoom = function (id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('delete from room where id=?', [id], function (error, row, fields) {
            connection.release();
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
        });
    });
}

pool.updateRoom = function (id, name, price, currency, room_no, description, branch_id, category_name, smoke, wifi, tag,
    additional_bad, additional_bad_price, extra_person, extra_person_price, callback) {
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
        connection.query('update room set name=?,price=?, currency=?, room_no=?, description=?,  branch_id=?, update_date=current_timestamp,category_id=? ,smoke=?, wifi=?, tag=?,additional_bad=?, additional_bad_price=?, extra_person=?,extra_person_price=? where id=?',
            [name, price, currency, room_no, description, branch_id, category_name, smokeValue, wifiValue, tag, additional_bad, additional_bad_price, extra_person, extra_person_price, id],
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


savePerson = function (branch_id) {
    return new Promise(function (resolve, reject) {
        var categoryData;
        var query = 'SELECT id,name,price,currency FROM category  where branch_id=?';
        pool.getConnection(function (err, connection) {
            connection.query(query, [branch_id], function (error, row, fields) {
                connection.release();
                if (error) {
                    reject(error);
                } else {
                    reject(row);
                }
            });
        });
    });
}
pool.checkReservation = function (data) {
    console.log("checkReservation start", data.room_id, data.start_date, data.start_date, data.end_date, data.end_date);
    return new Promise(function (resolve, reject) {
        if (data.end_date <= data.start_date) {
            reject("CheckIn date should be less than CheckOut date");
        }
        var categoryData;
        var query = 'SELECT  count(1) as count,max(r.room_no) as room_no FROM reservation_detail t inner join room r on t.room_id=r.id  where t.room_id=? and t.status_id in(1,2,3) and ((?>=DATE(t.start_date)  and ?<DATE(t.end_date) ) ' +
            ' or (?>DATE(t.start_date)  and ? <=DATE(t.end_date) ))';
        pool.getConnection(function (err, connection) {
            connection.query(query, [data.room_id, data.start_date, data.start_date, data.end_date, data.end_date], function (error, row, fields) {
                connection.release();
                if (error) {
                    reject(error);
                } else {
                    console.log("checkReservation not available", data.start_date, data.end_date, row[0].count, row[0].room_no);
                    if (row[0].count > 0) {
                        reject('Room ' + row[0].room_no + ' is not availabe in this period ' + data.start_date + ' - ' + data.end_date);
                    } else {
                        resolve('Free');
                    }
                }
            });
        });
    });
}

registerPersonLocal = function (person) {
    console.log(JSON.stringify(person));
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('insert into person  (first_name,last_name,personal_no,email,gender,phone,company,company_name,company_code)values (?,?,?,?,?,?,?,?,?)',
                [person.first_name, person.last_name, person.personal_no, person.email, person.gender, person.phone, person.company, person.company_name, person.company_code],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        if (error.code != 'ER_DUP_ENTRY') {
                            console.log("person", error.code);
                            reject(error);
                        } else {
                            resolve("OK");
                        }
                    } else {
                        resolve("OK");
                    }
                });
        });

    })
}
registerReservationLocal = function (person) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('insert into reservation (create_date,person_no,status_id)values(current_timestamp,?,1)',
                [person.personal_no],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        console.log("registerReservationLocal", error.code);
                        reject(error);
                    } else {
                        resolve(results.insertId);
                    }
                });
        });
    })
}
registerReservationDetailsLocal = function (reservID, data) {
    console.log("data.comment", data.comment);
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('insert into reservation_detail (reservation_id,create_date,room_id,status_id,start_date,end_date,payment_type,adult,child,additional_bed,' +
                ' payment_status,extra_person,comment)values(?,current_timestamp,?,?,?,?,?,?,?,?,?,?,?)',
                [reservID, data.room_id, data.status_id, data.start_date, data.end_date,
                    data.payment_type, data.adult, data.child, data.additional_bed, 1, data.extra_person, data.comment],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        console.log("registerReservationDetailsLocal", error.code);
                        reject(error);
                    } else {
                        resolve(results.insertId);
                    }
                });
        });
    })
}
registerReservationPersonLocal = function (id, person) {
    console.log("registerReservationPersonLocal", JSON.stringify(person));
    return new Promise(function (resolve, reject) {
        if (person.person_id != null && person.person_id !== "") {
            pool.getConnection(function (err, connection) {
                connection.query('insert into reservation_person(reservation_id,person_id,first_name,last_name)values(?,?,?,?)',
                    [id, person.person_id, person.first_name, person.last_name],
                    function (error, results, fields) {
                        connection.release();
                        if (error) {
                            reject(error);
                        } else {
                            resolve("OK");
                        }
                    });
            });
        } else {
            resolve("OK");
        }
    })
}
pool.registerReservationPerson = function (id, person) {
    console.log("registerReservationPerson", id, JSON.stringify(person));
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('insert into reservation_person(reservation_id,person_id,first_name,last_name)values(?,?,?,?)',
                [id, person.person_id, person.first_name, person.last_name],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        console.log("registerReservationPersonLocal", error.code);
                        reject(error);
                    } else {
                        resolve("OK");
                    }
                });
        });
    })
}
registerReservationServiceLocal = function (id, service) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('insert into reservation_service (reservation_id, service_id,frequency, additional_comment,payment_status)values (?,?,?,?,?)',
                [id, service.service_id, service.frequency, service.additional_comment, service.payment_status],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        console.log("registerReservationServiceLocal", error.code);
                        reject(error);
                    } else {
                        resolve("OK");
                    }
                });
        });
    })
}
pool.registerReservationService = function (id, service) {
    console.log("registerReservationService", id, JSON.stringify(service));
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('insert into reservation_service (reservation_id, service_id,frequency, additional_comment)values (?,?,?,?)',
                [id, service.service_id, service.frequency, service.additional_comment],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        console.log("registerReservationServiceLocal", error.code);
                        reject(error);
                    } else {
                        resolve("OK");
                    }
                });
        });
    })
}
pool.registerReservation = function (reservation) {
    var person = reservation.person;
    return new Promise(function (resolve, reject) {
        registerPersonLocal(person).then(data => {
            return registerReservationLocal(person).then(data => {
                return data;
            });
        }).then(data => {
            let reservationDetails = reservation.reservation.reservationDetail.map(reservation => {
                return registerReservationDetailsLocal(data, reservation).then(data => {
                    reservation.id = data;
                    return reservation;
                });
            })
            return Promise.all(reservationDetails);
        }).then(data => {
            let reservationPersonPromise = data.map(reservationData => {
                if (reservationData.reservationPerson != null) {
                    return reservationData.reservationPerson.map(person => {
                        return registerReservationPersonLocal(reservationData.id, person).then(personData => {
                            return personData;
                        })
                    });
                }
            });
            return Promise.all(reservationPersonPromise).then(dataPerson => {
                return data;
            });
        }).then(data => {
            let reservationPersonPromise = data.map(reservationData => {
                if (reservationData.reservationService != null) {
                    return reservationData.reservationService.map(service => {
                        return registerReservationServiceLocal(reservationData.id, service).then(serviceData => {
                            return serviceData;
                        })
                    });
                }
            });
            return Promise.all(reservationPersonPromise).then(dataService => {
                return data;
            });
        }).then(data => {
            resolve(data);
        }).catch(error => {
            reject(error);
        });
    });
}

pool.registerReservationOne = function (id, reservation) {
    return new Promise(function (resolve, reject) {
        registerReservationDetailsLocal(id, reservation).then(data => {
            reservation.id = data;
            let reservationPersonPromise;
            if (reservation.reservationPerson != null) {
                reservationPersonPromise = reservation.reservationPerson.map(person => {
                    return registerReservationPersonLocal(reservation.id, person).then(personData => {
                        return reservation;
                    })
                });
                return Promise.all(reservationPersonPromise).then(dataService => {
                    return reservation;
                });
            } else {
                return reservation;
            }
        }).then(data => {
            let reservationServicePromise
            if (reservation.reservationService != null) {
                reservationServicePromise = reservation.reservationService.map(service => {
                    return registerReservationServiceLocal(reservation.id, service).then(serviceData => {
                        console.log(serviceData);
                        return serviceData;
                    })
                });

                return Promise.all(reservationServicePromise);
            } else {
                return data;
            }
        }).then(data => {
            console.log(JSON.stringify(reservation.id));
            resolve(reservation.id);
        }).catch(error => {
            reject(error);
        });
    });
}

deleteReservationServiceLocal = function (id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('delete from reservation_service where reservation_id=?', [id],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        console.log("deleteReservationServiceLocal", error.code);
                        reject(error);
                    } else {
                        resolve("OK");
                    }
                });
        });
    })
}
pool.deleteReservationServiceLocal = function (id, service_id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('delete from reservation_service where reservation_id=? and service_id=?',
                [id, service_id],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        console.log("deleteReservationServiceLocal", error.code);
                        reject(error);
                    } else {
                        resolve("OK");
                    }
                });
        });
    })
}

deleteReservationPersonLocal = function (id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('delete FROM reservation_person where reservation_id=?',
                [id],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        console.log("deleteReservationPersonLocal", error.code);
                        reject(error);
                    } else {
                        resolve("OK");
                    }
                });
        });
    })
}

deleteReservationPaymentLocal = function (id) {
    console.log("deleteReservationPaymentLocal", id);
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('DELETE FROM  payment where reservation_id=?',
                [id],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        reject(error);
                    } else {
                        resolve("OK");
                    }
                });
        });
    })
}

pool.deleteReservationPersonLocal = function (id, person_id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('delete FROM reservation_person where reservation_id=? and person_id=?',
                [id, person_id],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        console.log("deleteReservationPersonLocal", error.code);
                        reject(error);
                    } else {
                        resolve("OK");
                    }
                });
        });
    })
}
deleteReservationLocal = function (id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('delete FROM reservation_detail where id=?; ',
                [id],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        console.log("registerReservationServiceLocal", error.code);
                        reject(error);
                    } else {
                        resolve("OK");
                    }
                });
        });
    })
}

pool.deleteReservation = function (id) {
    console.log("deleteReservation", id)
    return new Promise(function (resolve, reject) {
        deleteReservationServiceLocal(id).then(data => {
            deleteReservationPersonLocal(id).then(person => {
                return person;
            });
        }).then(data => {
            deleteReservationPaymentLocal(id).then(payment => {
                return payment;
            })
        }).then(data => {
            deleteReservationLocal(id).then(data => {
                return "OK";
            })
        }).then(data => {
            resolve("OK");
        }).catch(error => {
            reject(error);
        })
    })
}

pool.updateReservation = function (id, status_id) {
    console.log("updateReservation start...", id, status_id);
    var existing_status;
    if (status_id == 2) {
        existing_status = 1;
    } else if (status_id == 4) {
        existing_status = 2;
    }
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query('update reservation_detail set status_id=? where id=? and status_id=?',
                [status_id, id, existing_status],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        console.log("updateReservation", error.code);
                        reject(error);
                    } else {
                        resolve("OK");
                    }
                });
        });
    })
}
getCategory = function (branch_id) {
    var deferred = q.defer();
    var categoryData;
    var query = 'SELECT id,name,price,currency FROM category  where branch_id=?';
    pool.getConnection(function (err, connection) {
        connection.query(query, [branch_id], function (error, row, fields) {
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

getRoom = function (branch_id, categoryID) {

    var deferred = q.defer();
    var roomData;
    var roomSql = 'SELECT id,room_no,name,price,currency FROM room  where branch_id=? and category_id=?';
    pool.getConnection(function (err, connection) {
        connection.query(roomSql, [branch_id, categoryID], function (error, row, fields) {
            connection.release();
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(row);
            }
        });
    });
    return deferred.promise;
}

getReservationL = function (room_id, start_date, end_date, state, personal_no) {
    var deferred = q.defer();
    var reservationData;
    if (personal_no == null || personal_no == undefined) {
        personal_no = "";
    }
    var reservationSql = 'SELECT d.id,d.comment,d.create_date,d.payment_type,d.update_date,d.room_id,ro.room_no,d.status_id,d.start_date,d.end_date, ' +
        ' s.name as status_name,a.id as reservation_id,a.person_no as person_no, p.first_name,p.last_name,p.email , ro.price ,ro.additional_bad_price, ro.extra_person_price ' +
        ' FROM reservation_detail d ' +
        ' inner join reservation_status s on d.status_id=s.id ' +
        ' inner join room ro on ro.id=d.room_id ' +
        ' inner join reservation a on d.reservation_id=a.id ' +
        ' inner join person p on a.person_no=p.personal_no ' +
        ' where d.room_id=? and d.start_date >=? and d.start_date<=? and d.status_id in ' + state + ' and a.person_no like ?  order by d.start_date asc';
    pool.getConnection(function (err, connection) {
        connection.query(reservationSql, [room_id, start_date, end_date, ['%' + personal_no + '%']], function (error, row, fields) {
            connection.release();
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(row);
            }
        });
    });
    return deferred.promise;
}



pool.getReservation = function (branch_id, start_date, end_date, state, person_no) {
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
                    return getReservationL(room.id, start_date, end_date, state, person_no)
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
            deferred.resolve(data);
        })
        .catch(function (err) {
            deferred.reject(err);
        });
    return deferred.promise;
}


getReservation = function (id) {
    console.log("getReservationLocal", id);
    var deferred = q.defer();
    var query = 'SELECT * FROM reservation  where id=?';
    pool.getConnection(function (err, connection) {
        connection.query(query, [id], function (error, row, fields) {
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

getPersonByPersonalNo = function (personal_no) {
    var deferred = q.defer();
    var categoryData;
    var query = 'SELECT * FROM  person where personal_no=?';
    pool.getConnection(function (err, connection) {
        connection.query(query, [personal_no], function (error, row, fields) {
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

getReservationsDetails = function (reservation_id) {
    console.log("getReservationsDetails", reservation_id);
    var deferred = q.defer();
    var categoryData;
    var query = 'SELECT r.*,c.id as category_id,c.name as category_name ,o.price,o.additional_bad_price, o.extra_person_price,datediff(r.end_date, r.start_date) as day_count,' +
        'o.price * datediff(r.end_date, r.start_date) as reservation_prise_full,' +
        'r.additional_bed * o.additional_bad_price as additional_bad_price_full,' +
        'o.extra_person_price * r.extra_person as extra_person_price_full,' +
        ' (o.price * datediff(r.end_date, r.start_date)) +(r.additional_bed * o.additional_bad_price)+(o.extra_person_price * r.extra_person) as price_full, ' +
        '(SELECT IFNULL(SUM(p.amount), 0) FROM  payment p WHERE p.reservation_id = r.id AND p.source = \'RESERVATION\' AND (p.service_id IS NULL OR p.service_id =0)) AS reservation_payd_amount, ' +
        '(SELECT IFNULL(SUM(p.amount), 0) FROM  payment p WHERE p.reservation_id = r.id AND p.source = \'SERVICE\' AND p.service_id IS NOT NULL) AS service_payd_amount, ' +
        ' (SELECT  IFNULL(SUM(s.price), 0) FROM  reservation_service rs INNER JOIN  service s ON rs.service_id = s.id  WHERE reservation_id = r.id) AS service_price' +
        ' FROM reservation_detail r ' +
        ' inner join room o on r.room_id=o.id   inner join category c on o.category_id=c.id  where reservation_id=?';
    pool.getConnection(function (err, connection) {
        connection.query(query, [reservation_id], function (error, row, fields) {
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
getReservationsServices = function (reservation_id) {
    var deferred = q.defer();
    var categoryData;
    var query = 'SELECT r.*, s.name as service_name, s.price as price,' +
        '(SELECT IFNULL(SUM(p.amount),0)  ' +
        'FROM payment p where p.reservation_id=r.reservation_id and p.source=\'SERVICE\' and p.service_id=s.id) as service_payd  ' +
        'FROM reservation_service r inner join service s on r.service_id=s.id where  reservation_id=?';
    pool.getConnection(function (err, connection) {
        connection.query(query, [reservation_id], function (error, row, fields) {
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

getReservationsPersons = function (reservation_id) {
    var deferred = q.defer();
    var categoryData;
    var query = 'SELECT * FROM reservation_person where reservation_id=?';
    pool.getConnection(function (err, connection) {
        connection.query(query, [reservation_id], function (error, row, fields) {
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


pool.getReservationById = function (id) {
    console.log("getReservationById", id);
    var deferred = q.defer();
    getReservation(id).then(reservation => {
        return getReservationsDetails(reservation[0].id).then(reservations => {
            return Object.assign({}, reservation[0], { reservationDetail: reservations });
        })
    }).then(reservationData => {
        let reservationDataPromise = reservationData.reservationDetail.map(data => {
            return getPayment(data.id, "RESERVATION", null, "1").then(payment => {
                return Object.assign({}, data, { payment })
            });
        })
        return Promise.all(reservationDataPromise).then(data => {
            return Object.assign({}, reservationData, { reservationDetail: data })
        });

    }).then(reservationsService => {
        let finalPromiseService = reservationsService.reservationDetail.map(reservationdetail => {
            return getReservationsServices(reservationdetail.id)
                .then(reservationService => Object.assign({}, reservationdetail, { reservationService }));
        });

        return Promise.all(finalPromiseService)
            .then(data => Object.assign({}, reservationsService, { reservationDetail: data }));

        return Promise.all(finalPromiseService);
    }).then(reservationsServicePayment => {
        let reservationsServicePaymentPromise = reservationsServicePayment.reservationDetail.map(reservationDetail => {
            let reservationsServicePaymentPromiseLocal = reservationDetail.reservationService.map(service => {
                return getPayment(service.reservation_id, "SERVICE", service.service_id, "2").then(payment => {
                    return Object.assign({}, service, { payment });
                })
            })
            return Promise.all(reservationsServicePaymentPromiseLocal).then(data => {
                return Object.assign({}, reservationDetail, { reservationService: data });
            });
        });
        return Promise.all(reservationsServicePaymentPromise).then(data => {
            return Object.assign({}, reservationsServicePayment, { reservationDetail: data });
        });
    }).then(reservationsPerson => {
        let finalPromisePersone = reservationsPerson.reservationDetail.map(reservationdetail => {
            return getReservationsPersons(reservationdetail.id)
                .then(reservationPerson => Object.assign({}, reservationdetail, { reservationPerson }));
        });
        return Promise.all(finalPromisePersone)
            .then(data => Object.assign({}, reservationsPerson, { reservationDetail: data }));

        return Promise.all(finalPromisePersone);
    }).then(reservationPerson => {
        return getPersonByPersonalNo(reservationPerson.person_no).then(data => {
            let person = data[0];
            let reservation = { "reservation": reservationPerson };
            return Object.assign({}, reservation, { person });
        })
    }).then(reservations => {
        deferred.resolve(reservations);
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
}

pool.getReservationStatistic = function (branch_id) {
    console.log("getReservationStatistic", branch_id);
    var deferred = q.defer();
     var query = 'SELECT CONCAT(YEAR(a.start_date), \'-\', SUBSTRING(MONTHNAME(a.start_date), 1, 3)) AS date, SUM(a.day_count) AS count FROM (SELECT d.start_date AS start_date,DATEDIFF(d.end_date, d.start_date) AS day_count '+
     ' FROM reservation_detail d  INNER JOIN room r ON d.room_id = r.id  WHERE  r.branch_id = ? ORDER BY d.start_date) a GROUP BY CONCAT(YEAR(a.start_date), \'-\',   SUBSTRING(MONTHNAME(a.start_date), 1, 3))';
     pool.getConnection(function (err, connection) {
        connection.query(query, [branch_id], function (error, row, fields) {
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
pool.getPerson = function (person_no, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM person where personal_no like ?', ['%' + person_no + '%'], function (error, row, fields) {
            connection.release();
            if (error) {
                throw error;
            } else {
                callback(null, row);
            }
        });
    });
}

pool.getUserPermission = function (user_id, permission, action) {
    console.log("getUserPermission");
    var deferred = q.defer();
    pool.getConnection(function (err, connection) {
        connection.query('SELECT a.*' +
            'FROM user_group u ' +
            'inner join permission_group p on u.group_id=p.group_id ' +
            'inner join  permission a on p.permission_id=a.id ' +
            'inner join user_branch b on a.branch_id=b.branch_id  and b.user_id=u.user_id ' +
            'where u.user_id=?  and a.name=? and a.action=?', [user_id, permission, action], function (error, row, fields) {
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

getPayment = function (reservation_id, source, service_id, type) {
    console.log("getPayment", source);
    // type = 1 reservation and service, type = 2 service,
    if (type == "1") {
        var deferred = q.defer();
        var roomSql = 'SELECT * FROM  payment where reservation_id=?';
        pool.getConnection(function (err, connection) {
            connection.query(roomSql, [reservation_id], function (error, row, fields) {
                connection.release();
                if (err) {
                    deferred.reject(err);
                } else {
                    console.log("a", row);
                    deferred.resolve(row);
                }
            });
        });
        return deferred.promise;
    } else if (type == "2") {
        var deferred = q.defer();
        var roomSql = 'SELECT * FROM  payment where reservation_id=? and source in (?) and (service_id=? or service_id is null or service_id =0)';
        pool.getConnection(function (err, connection) {
            connection.query(roomSql, [reservation_id, source, service_id], function (error, row, fields) {
                connection.release();
                if (err) {
                    deferred.reject(err);
                } else {
                    console.log("a", row);
                    deferred.resolve(row);
                }
            });
        });
        return deferred.promise;
    }
}

pool.registerPayment = function (payment) {
    var deferred = q.defer();
    var result;
    var prise_full;
    var payd_full;
    var query = "SET @result=0; CALL make_payment(" + payment.reservation_id + ", " + payment.amount + ", '" + payment.type + "', '" + payment.source + "', '" + payment.ticket + "', '" + payment.additional_comment + "', '" + payment.service_id + "',"
        + payment.additional_bad_price + "," + payment.extra_person_price + ", @result); SELECT @result as result;";
    console.log("query", query);
    pool.getConnection(function (err, connection) {
        connection.query(query, function (error, results, fields) {
            connection.release();
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(results[2][0].result);
            }
        });
    });
    return deferred.promise;
}
pool.registerServicePayment = function (payment) {
    console.log("registerServicePayment", payment)
    var deferred = q.defer();
    var result;
    var prise_full;
    var payd_full;
    var query = "SET @result=0; CALL make_service_payment(" + payment.reservation_id + ", " + payment.amount + ", '" + payment.type + "', '" + payment.source + "', '" + payment.ticket + "', '" + payment.additional_comment + "', '" + payment.service_id + "', @result); SELECT @result as result;";
    pool.getConnection(function (err, connection) {
        connection.query(query, function (error, results, fields) {
            connection.release();
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(results[2][0].result);
            }
        });
    });
    return deferred.promise;
}
module.exports = pool;