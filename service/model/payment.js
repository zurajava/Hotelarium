const pool = require('../dbmanager/dbmanager.js');
var q = require('q');

class Payment {
    registerPayment(payment) {
        console.log("Payment, registerPayment", payment);
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
    registerServicePayment(payment) {
        console.log("Payment, registerPayment", payment);
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
}

module.exports = Payment;