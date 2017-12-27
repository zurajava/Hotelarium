const pool = require('../dbmanager/dbmanager.js');
var q = require('q');

class Room {
    getRoom(branch_id, category_id) {
        console.log("Model, GetRoom", branch_id, category_id);
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                connection.query('SELECT c.*, t.name as category_name, b.name as branch_name FROM room c inner join branch b on c.branch_id=b.id inner join category t on c.category_id=t.id  where c.branch_id=? and c.status=1 and (c.category_id=? or ? is null)',
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
    registerRoom(name, price, room_no, description, branch_id, category_id, smoke, wifi, tag,
        additional_bad, additional_bad_price, extra_person, extra_person_price, callback) {
        console.log("Model, RegisterRoom: ", name, price, room_no, description, branch_id, category_id, smoke, wifi, tag,
            additional_bad, additional_bad_price, extra_person, extra_person_price);
        pool.getConnection(function (err, connection) {
            connection.query('insert into room(create_date,name,price, room_no,description,branch_id,category_id,smoke,wifi,tag,additional_bad,additional_bad_price,extra_person,extra_person_price) values(current_timestamp,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [name, price, room_no, description, branch_id, category_id, smoke, wifi, tag,
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
    deleteRoom(id, callback) {
        console.log("Model, DeleteRoom", id);
        pool.getConnection(function (err, connection) {
            connection.query('update room set status=0 where id=?', [id], function (error, row, fields) {
                connection.release();
                if (error) {
                    throw error;
                } else {
                    callback(null, row);
                }
            });
        });
    }
    updateRoom(id, name, price, room_no, description, branch_id, category_name, smoke, wifi, tag,
        additional_bad, additional_bad_price, extra_person, extra_person_price, callback) {
        console.log("Model, UpdateRoom: ", id, name, price, room_no, description, branch_id, category_name, smoke, wifi, tag,
            additional_bad, additional_bad_price, extra_person, extra_person_price);
        pool.getConnection(function (err, connection) {
            connection.query('update room set name=?,price=?, room_no=?, description=?,  branch_id=?, update_date=current_timestamp,category_id=? ,smoke=?, wifi=?, tag=?,additional_bad=?, additional_bad_price=?, extra_person=?,extra_person_price=? where id=?',
                [name, price, room_no, description, branch_id, category_name, smoke, wifi, tag, additional_bad, additional_bad_price, extra_person, extra_person_price, id],
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
}
module.exports = Room;