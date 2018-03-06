const pool = require('../dbmanager/dbmanager.js');
var q = require('q');

class Reservation {

    checkReservation(data) {
        console.log("Reservation, checkReservation ", data.room_id, data.start_date, data.start_date, data.end_date, data.end_date);
        return new Promise(function (resolve, reject) {
            if (data.end_date <= data.start_date) {
                reject("CheckIn date should be less than CheckOut date");
            }
            var categoryData;
            var query = 'SELECT  count(1) as count,max(r.room_no) as room_no FROM reservation_detail t inner join room r on t.room_id=r.id  ' +
                ' where t.room_id=? and r.status=1 and t.status_id in(1,2,3) and ((?>=DATE(t.start_date)  and ?<DATE(t.end_date) ) ' +
                ' or (?>DATE(t.start_date)  and ? <=DATE(t.end_date) ))';
            pool.getConnection(function (err, connection) {
                connection.query(query, [data.room_id, data.start_date, data.start_date, data.end_date, data.end_date], function (error, row, fields) {
                    connection.release();
                    if (error) {
                        reject(error);
                    } else {
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
    registerReservation(reservation) {
        console.log("Reservation, registerReservation ", reservation);
        var person = reservation.person;
        var deferred = q.defer();
        this.registerPersonLocal(person.first_name, person.last_name, person.personal_no, person.email, person.gender, person.phone, person.company, person.company_name, person.company_code)
            .then(data => {
                return this.registerReservationLocal(person.personal_no).then(data => {
                    return data;
                });
            }).then(data => {
                let reservationDetails = reservation.reservation.reservationDetail.map(reservation => {
                    return this.registerReservationDetailsLocal(data, reservation).then(data => {
                        reservation.id = data;
                        return reservation;
                    });
                })
                return Promise.all(reservationDetails);
            }).then(data => {
                let reservationPersonPromise = data.map(reservationData => {
                    if (reservationData.reservationPerson != null) {
                        return reservationData.reservationPerson.map(person => {
                            return this.registerReservationPersonLocal(reservationData.id, person).then(personData => {
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
                            return this.registerReservationServiceLocal(reservationData.id, service).then(serviceData => {
                                return serviceData;
                            })
                        });
                    }
                });
                return Promise.all(reservationPersonPromise).then(dataService => {
                    return data;
                });
            }).then(data => {
                deferred.resolve(data);
            }).catch(error => {
                deferred.reject(error);
            });
        return deferred.promise;
    }
    registerReservationOne(id, reservation) {
        console.log("Reservation, registerReservation One ", id);
        var deferred = q.defer();
        this.registerReservationDetailsLocal(id, reservation).then(data => {
            reservation.id = data;
            let reservationPersonPromise;
            if (reservation.reservationPerson != null) {
                reservationPersonPromise = reservation.reservationPerson.map(person => {
                    return this.registerReservationPersonLocal(reservation.id, person).then(personData => {
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
                    return this.registerReservationServiceLocal(reservation.id, service).then(serviceData => {
                        return serviceData;
                    })
                });

                return Promise.all(reservationServicePromise);
            } else {
                return data;
            }
        }).then(data => {
            deferred.resolve(reservation.id);
        }).catch(error => {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    registerReservationPerson(id, person) {
        console.log("Register Reservation Person", id, person);
        return new Promise(function (resolve, reject) {
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
        })
    }
    getConnection() {
        console.log("Model, GetConnection");
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    console.log("Model, GetConnection", err);
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        })
    }
    getCategoryLocal(branch_id, connection) {
        console.log("Model, GetCategoryLocal", branch_id);
        var deferred = q.defer();
        var categoryData;
        var query = 'SELECT id, name, price FROM category  where branch_id=? and status=1';
        connection.query(query, [branch_id], function (error, row, fields) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(row);
            }
        });
        return deferred.promise;
    }
    getRoomLocal(branch_id, categoryID, connection) {
        console.log("Model, GetRoomLocal", branch_id, categoryID);
        var deferred = q.defer();
        var roomData;
        var roomSql = 'SELECT id, room_no, name, price FROM room  where branch_id=? and category_id=? and status=1';
        connection.query(roomSql, [branch_id, categoryID], function (error, row, fields) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(row);
            }
        });
        return deferred.promise;
    }
    getReservationDetailsLocal(room_id, start_date, end_date, state, personal_no, connection) {
        console.log("Model, GetgetReservationDetailsLocal", room_id, start_date, end_date, state, personal_no);
        var deferred = q.defer();
        var reservationData;
        if (personal_no == null || personal_no == undefined) {
            personal_no = "";
        }
        var reservationSql = 'SELECT d.id,d.comment,d.create_date,d.update_date,d.room_id,ro.room_no,d.status_id,d.start_date,d.end_date, ' +
            ' s.name as status_name,a.id as reservation_id,a.person_no as person_no, p.first_name,p.last_name,p.email , ro.price ,ro.additional_bad_price, ro.extra_person_price ' +
            ' FROM reservation_detail d ' +
            ' inner join reservation_status s on d.status_id=s.id ' +
            ' inner join room ro on ro.id=d.room_id ' +
            ' inner join reservation a on d.reservation_id=a.id ' +
            ' inner join person p on a.person_no=p.personal_no ' +
            ' where d.room_id=? and d.start_date >=? and d.start_date<=? and d.status_id in ' + state + ' and a.person_no like ?  order by d.start_date asc';
        connection.query(reservationSql, [room_id, start_date, end_date, ['%' + personal_no + '%']], function (error, row, fields) {
            if (error) {
                console.log(error);
                deferred.reject(error);
            } else {
                deferred.resolve(row);
            }
        });
        return deferred.promise;
    }

    getReservation(branch_id, start_date, end_date, state, person_no) {
        console.log("Model, GetReservation", branch_id, start_date, end_date, state, person_no);
        var deferred = q.defer();
        this.getConnection().then(connection => {
            this.getCategoryLocal(branch_id, connection)
                .then(categories => {
                    let roomPromises = categories.map(category => {
                        return this.getRoomLocal(branch_id, category.id, connection)
                            .then(rooms => Object.assign({}, category, { rooms }))
                    });
                    return Promise.all(roomPromises)
                }).then(category_rooms => {
                    let finalPromise = category_rooms.map(category => {
                        let reservationPromises = category.rooms.map(room => {
                            return this.getReservationDetailsLocal(room.id, start_date, end_date, state, person_no, connection)
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
                    connection.release();
                    deferred.resolve(data);
                })
                .catch(function (err) {
                    connection.release();
                    deferred.reject(err);
                });
        }).catch(err => {
            connection.release();
            deferred.reject(err);
        });
        return deferred.promise;
    }

    getReservationByIdLocal(id, connection) {
        console.log("Model, GetReservationByIdLocal", id);
        var deferred = q.defer();
        var query = 'SELECT * FROM reservation  where id=?';
        connection.query(query, [id], function (error, row, fields) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(row);
            }
        });
        return deferred.promise;
    }
    getReservationByIdDetailsLocal(reservation_id, connection) {
        console.log("Model, GetReservationByIdDetailsLocal", reservation_id);
        var deferred = q.defer();
        var categoryData;
        var query = 'SELECT r.*,c.id as category_id,c.name as category_name ,o.room_no, o.price,o.additional_bad_price, o.extra_person_price,datediff(r.end_date, r.start_date) as day_count,' +
            'o.price * datediff(r.end_date, r.start_date) as reservation_prise_full,' +
            'r.additional_bed * o.additional_bad_price as additional_bad_price_full,' +
            'o.extra_person_price * r.extra_person as extra_person_price_full,' +
            ' (o.price * datediff(r.end_date, r.start_date)) +(r.additional_bed * o.additional_bad_price)+(o.extra_person_price * r.extra_person) as price_full, ' +
            '(SELECT IFNULL(SUM(p.amount), 0) FROM  payment p WHERE p.reservation_id = r.id AND p.source = \'RESERVATION\' AND p.status = 1 AND (p.service_id IS NULL OR p.service_id =0)) AS reservation_payd_amount, ' +
            '(SELECT IFNULL(SUM(p.amount), 0) FROM  payment p WHERE p.reservation_id = r.id AND p.source = \'SERVICE\' AND p.status = 1 AND p.service_id IS NOT NULL) AS service_payd_amount, ' +
            ' (SELECT  IFNULL(SUM(s.price), 0) FROM  reservation_service rs INNER JOIN  service s ON rs.service_id = s.id  WHERE reservation_id = r.id and rs.status=1) AS service_price ,s.name as status_name ,p.name as payment_status_name' +
            ' FROM reservation_detail r ' +
            ' inner join room o on r.room_id=o.id   inner join category c on o.category_id=c.id inner join reservation_status s on r.status_id=s.id inner join payment_status p on p.id=r.payment_status where reservation_id=? and status_id in (1,2,3,4) ';

        connection.query(query, [reservation_id], function (error, row, fields) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(row);
            }
        });
        return deferred.promise;
    }
    getPaymentLocal(reservation_id, source, service_id, type, connection) {
        console.log("Model, GetPaymentLocal", reservation_id, source, service_id, type);
        // type = 1 reservation and service, type = 2 service,
        if (type == "1") {
            var deferred = q.defer();
            var roomSql = 'SELECT * FROM  payment where reservation_id=? and status=1';
            connection.query(roomSql, [reservation_id], function (error, row, fields) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(row);
                }
            });
            return deferred.promise;
        } else if (type == "2") {
            var deferred = q.defer();
            var roomSql = 'SELECT * FROM  payment where status=1 and reservation_id=? and source in (?) and (service_id=? or service_id is null or service_id =0)';
            connection.query(roomSql, [reservation_id, source, service_id], function (error, row, fields) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(row);
                }
            });
            return deferred.promise;
        }
    }
    getReservationsByIdServicesLocal(reservation_id, connection) {
        console.log("Model, GetReservationsByIdServicesLocal", reservation_id);
        var deferred = q.defer();
        var categoryData;
        var query = 'SELECT r.*, s.name as service_name, s.price as price,  p.name as payment_status_name, ' +
            '(SELECT IFNULL(SUM(p.amount),0)  ' +
            'FROM payment p where p.reservation_id=r.reservation_id and p.source=\'SERVICE\' and p.service_id=s.id) as service_payd  ' +
            'FROM reservation_service r inner join service s on r.service_id=s.id inner join payment_status p on r.payment_status=p.id where  reservation_id = ? and r.status = 1';
        connection.query(query, [reservation_id], function (error, row, fields) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(row);
            }
        });
        return deferred.promise;
    }
    getReservationsByIdPersonsLocal(reservation_id, connection) {
        console.log("Model, GetReservationsByIdPersonsLocal", reservation_id);
        var deferred = q.defer();
        var categoryData;
        var query = 'SELECT * FROM reservation_person where reservation_id=? and status = 1';
        connection.query(query, [reservation_id], function (error, row, fields) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(row);
            }
        });
        return deferred.promise;
    }
    getPersonByPersonalNoLocal(personal_no, connection) {
        console.log("Model, GetPersonByPersonalNoLocal", personal_no);
        var deferred = q.defer();
        var categoryData;
        var query = 'SELECT * FROM  person where personal_no=?';
        connection.query(query, [personal_no], function (error, row, fields) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(row);
            }
        });
        return deferred.promise;
    }
    getReservationById(id) {
        console.log("Model, GetReservationById", id);
        var deferred = q.defer();
        this.getConnection().then(connection => {
            this.getReservationByIdLocal(id, connection).then(reservation => {
                return this.getReservationByIdDetailsLocal(reservation[0].id, connection).then(reservations => {
                    return Object.assign({}, reservation[0], { reservationDetail: reservations });
                })
            }).then(reservationData => {
                let reservationDataPromise = reservationData.reservationDetail.map(data => {
                    return this.getPaymentLocal(data.id, "RESERVATION", null, "1", connection).then(payment => {
                        return Object.assign({}, data, { payment })
                    });
                })
                return Promise.all(reservationDataPromise).then(data => {
                    return Object.assign({}, reservationData, { reservationDetail: data })
                });

            }).then(reservationsService => {
                let finalPromiseService = reservationsService.reservationDetail.map(reservationdetail => {
                    return this.getReservationsByIdServicesLocal(reservationdetail.id, connection)
                        .then(reservationService => Object.assign({}, reservationdetail, { reservationService }));
                });

                return Promise.all(finalPromiseService)
                    .then(data => Object.assign({}, reservationsService, { reservationDetail: data }));

                return Promise.all(finalPromiseService);
            }).then(reservationsServicePayment => {
                let reservationsServicePaymentPromise = reservationsServicePayment.reservationDetail.map(reservationDetail => {
                    let reservationsServicePaymentPromiseLocal = reservationDetail.reservationService.map(service => {
                        return this.getPaymentLocal(service.reservation_id, "SERVICE", service.service_id, "2", connection).then(payment => {
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
                    return this.getReservationsByIdPersonsLocal(reservationdetail.id, connection)
                        .then(reservationPerson => Object.assign({}, reservationdetail, { reservationPerson }));
                });
                return Promise.all(finalPromisePersone)
                    .then(data => Object.assign({}, reservationsPerson, { reservationDetail: data }));

                return Promise.all(finalPromisePersone);
            }).then(reservationPerson => {
                return this.getPersonByPersonalNoLocal(reservationPerson.person_no, connection).then(data => {
                    let person = data[0];
                    let reservation = { "reservation": reservationPerson };
                    return Object.assign({}, reservation, { person });
                })
            }).then(reservations => {
                connection.release();
                deferred.resolve(reservations);
            }).catch(function (err) {
                connection.release();
                deferred.reject(err);
            });
        }).catch(err => {
            connection.release();
            deferred.reject(err);
        });
        return deferred.promise;
    }

    updateReservation(id, status_id) {
        console.log("Reservation, updateReservation", id, status_id);
        var existing_status;
        if (status_id == 2) {
            existing_status = 1;
        } else if (status_id == 4) {
            existing_status = 2;
        }
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                connection.query('update reservation_detail set status_id=?,update_date=current_timestamp where id=? and status_id=?',
                    [status_id, id, existing_status],
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
    deleteReservationServiceLocal(id, connection) {
        console.log("Model, DeleteReservationServiceLocal", id);
        return new Promise(function (resolve, reject) {
            connection.query('update reservation_service set status= 0 where reservation_id=?', [id],
                function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve("OK");
                    }
                });
        })
    }
    deleteReservationPersonLocal(id, connection) {
        console.log("Model, DeleteReservationPersonLocal", id);
        return new Promise(function (resolve, reject) {
            connection.query('update reservation_person set status = 0 where reservation_id=?',
                [id],
                function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve("OK");
                    }
                });
        })
    }
    deleteReservationPaymentLocal(id, connection) {
        console.log("Model, DeleteReservationPaymentLocal", id);
        return new Promise(function (resolve, reject) {
            connection.query('update payment set status = 0 where reservation_id = ?',
                [id],
                function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve("OK");
                    }
                });
        })
    }
    deleteReservationLocal(id, connection) {
        console.log("Model, DeleteReservationDetailLocal", id);
        return new Promise(function (resolve, reject) {
            connection.query('update reservation_detail set status_id = 5 , update_date= current_timestamp where id=?; ', [id],
                function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve("OK");
                    }
                });
        })
    }
    deleteReservationFull(id) {
        console.log("Reservation, DeleteReservationFull", id)
        var deferred = q.defer();
        this.getConnection().then(connection => {
            this.deleteReservationServiceLocal(id, connection).then(data => {
                this.deleteReservationPersonLocal(id, connection).then(person => {
                    return person;
                });
            }).then(data => {
                this.deleteReservationPaymentLocal(id, connection).then(payment => {
                    return payment;
                })
            }).then(data => {
                this.deleteReservationLocal(id, connection).then(data => {
                    connection.release();
                    deferred.resolve("OK");
                })
            }).catch(err => {
                connection.release();
                deferred.reject(err);
            })
        }).catch(err => {
            connection.release();
            deferred.reject(err);
        });
        return deferred.promise;

    }

    deleteReservationServiceByServiceId(id, service_id, connection) {
        console.log("Model, DeleteReservationServiceByServiceId", id, service_id);
        return new Promise(function (resolve, reject) {
            connection.query('update reservation_service set status= 0  where reservation_id=? and service_id=?',
                [id, service_id],
                function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve("OK");
                    }
                });
        })
    }

    deleteReservationServicePayment(id, service_id, connection) {
        console.log("deleteReservationServicePayment", id, service_id);
        return new Promise(function (resolve, reject) {
            connection.query('update payment set status = 0 where reservation_id = ? and service_id=?',
                [id, service_id],
                function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve("OK");
                    }
                });
        })
    }
    deleteReservationServiceAndPayment(id, service_id) {
        console.log("Model, deleteReservationServiceAndPayment", id, service_id);
        var deferred = q.defer();
        this.getConnection().then(connection => {
            this.deleteReservationServiceByServiceId(id, service_id, connection)
                .then(data => {
                    this.deleteReservationServicePayment(id, service_id, connection).then(data => {
                        connection.release();
                        deferred.resolve(data);
                    }).catch(error => {
                        connection.release();
                        deferred.reject(err);
                    })
                }).then(data => {
                    connection.release();
                    deferred.resolve(data);
                })
                .catch(function (err) {
                    connection.release();
                    deferred.reject(err);
                });
        }).catch(err => {
            connection.release();
            deferred.reject(err);
        });
        return deferred.promise;
    }

    deleteReservationPerson(id, person_id) {
        console.log("Model, deleteReservationPerson", id, person_id);
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                connection.query('update reservation_person set status = 0 where reservation_id=? and person_id=?',
                    [id, person_id],
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

    registerReservationService(id, service) {
        console.log("Register Reservation Service", id, service);
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                connection.query('insert into reservation_service (reservation_id, service_id,frequency, additional_comment)values (?,?,?,?)',
                    [id, service.service_id, service.frequency, service.additional_comment],
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
    getReservationStatistic(branch_id) {
        console.log("Reservation, getReservationStatistic", branch_id);
        var deferred = q.defer();
        var query = 'SELECT CONCAT(YEAR(a.start_date), \'-\', SUBSTRING(MONTHNAME(a.start_date), 1, 3)) AS date, SUM(a.day_count) AS count FROM (SELECT d.start_date AS start_date,DATEDIFF(d.end_date, d.start_date) AS day_count ' +
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

    registerPersonLocal(first_name, last_name, personal_no, email, gender, phone, company, company_name, company_code) {
        console.log("Register Person ", first_name, last_name, personal_no, email, gender, phone, company, company_name, company_code);
        var deferred = q.defer();
        pool.getConnection(function (err, connection) {
            connection.query('insert into person  (first_name,last_name,personal_no,email,gender,phone,company,company_name,company_code)values (?,?,?,?,?,?,?,?,?)',
                [first_name, last_name, personal_no, email, gender, phone, company, company_name, company_code],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        if (error.code != 'ER_DUP_ENTRY') {
                            deferred.reject(error);
                        } else {
                            deferred.resolve("OK");
                        }
                    } else {
                        deferred.resolve("OK");
                    }
                });
        });
        return deferred.promise;
    }

    registerReservationLocal(personal_no) {
        console.log("Register Reservation Local", personal_no);
        var deferred = q.defer();
        pool.getConnection(function (err, connection) {
            connection.query('insert into reservation (create_date,person_no,status_id)values(current_timestamp,?,1)',
                [personal_no],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        deferred.reject(error);
                    } else {
                        deferred.resolve(results.insertId);
                    }
                });
        });
        return deferred.promise;
    }

    registerReservationDetailsLocal(reservID, data) {
        console.log("Register Reservation Details Local", reservID, data.adult, data.child, data.additional_bed);
        var deferred = q.defer();
        pool.getConnection(function (err, connection) {
            connection.query('insert into reservation_detail (reservation_id,create_date,room_id,status_id,start_date,end_date,adult,child,additional_bed,' +
                ' payment_status,extra_person,comment)values(?,current_timestamp,?,?,?,?,?,?,?,?,?,?)',
                [reservID, data.room_id, data.status_id, data.start_date, data.end_date, data.adult || 0, data.child || 0, data.additional_bed || 0, 1, data.extra_person || 0, data.comment || ''],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        deferred.reject(error);
                    } else {
                        deferred.resolve(results.insertId);
                    }
                });
        });
        return deferred.promise;
    }

    registerReservationServiceLocal(id, service) {
        console.log("Register Reservation Service Local", id, service);
        var deferred = q.defer();
        pool.getConnection(function (err, connection) {
            connection.query('insert into reservation_service (reservation_id, service_id,frequency, additional_comment,payment_status)values (?,?,?,?,?)',
                [id, service.service_id, service.frequency, service.additional_comment, service.payment_status],
                function (error, results, fields) {
                    connection.release();
                    if (error) {
                        deferred.reject(error);
                    } else {
                        deferred.resolve("OK");
                    }
                });
        });
        return deferred.promise;
    }

    registerReservationPersonLocal(id, person) {
        console.log("Register Reservation Person Local", id, person);
        var deferred = q.defer();
        if (person.person_id != null && person.person_id !== "") {
            pool.getConnection(function (err, connection) {
                connection.query('insert into reservation_person(reservation_id,person_id,first_name,last_name)values(?,?,?,?)',
                    [id, person.person_id, person.first_name, person.last_name],
                    function (error, results, fields) {
                        connection.release();
                        if (error) {
                            deferred.reject(error);
                        } else {
                            deferred.resolve("OK");
                        }
                    });
            });
        } else {
            deferred.resolve("OK");
        }
        return deferred.promise;
    }
}
module.exports = Reservation;