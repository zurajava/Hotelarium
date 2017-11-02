import { AppSettings } from './../app.config';
import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { ReservationInfo, ReservationDetail, ReservationPerson, ReservationServices, Payment } from './model';

@Injectable()
export class ReservationService {

  constructor(private http: Http) {

  }
  addReservation(data: ReservationInfo) {
    const body = JSON.stringify(data);
    console.log("addReservation", body);
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("x-access-token", key);
    return this.http.post('/service/reservation', body, { headers: headers }).catch(this.handleError);

  }
  getCategory(branch_id: number) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/category/' + branch_id, { headers: headers })
      .catch(this.handleError);
  }
  getService(branch_id: number) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/service/' + branch_id + '?currenttimestamp=' + new Date(), { headers: headers })
      .catch(this.handleError);
  }
  getRoom(branch_id: number, category_id: string) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    var query;
    if (category_id == null) {
      query = '/service/room/' + branch_id;
    } else {
      query = '/service/room/' + branch_id + '?category_id=' + category_id;
    }
    return this.http.get(query, { headers: headers })
      .catch(this.handleError);
  }
  getUserBranch(user_id: string) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/userBranch/' + user_id, { headers: headers })
      .catch(this.handleError);
  }
  getUserOrganisation(user_id: string) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/userOrganisation/' + user_id, { headers: headers })
      .catch(this.handleError);
  }

  getPerson(person_no: string) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/person?person_no' + person_no, { headers: headers })
      .catch(this.handleError);
  }
  getReservation(branch_id: String, start_date: string, end_date: string, reserv, checkIn, checkOut, person_no: string) {
    console.log("R", reserv, "C", checkIn, "O", checkOut);
    var state = '(5)';
    if (reserv && checkIn && checkOut) {
      state = '(1,2,4)';
    } else if (reserv && checkIn) {
      state = '(1,2)';
    } else if (reserv && checkOut) {
      state = '(1,4)';
    } else if (checkIn && checkOut) {
      state = '(2,4)';
    } else if (reserv) {
      state = '(1)';
    } else if (checkIn) {
      state = '(2)';
    } else if (checkOut) {
      state = '(4)';
    }
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/reservation?start_date=' + start_date + '&end_date=' + end_date + '&branch_id=' + branch_id + '&state=' + state + '&person_no=' + person_no, { headers: headers }).toPromise().then(response => {
      return response.json();
    }).catch(this.handleError);
  }
  getReservationById(id: String) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/reservation/' + id, { headers: headers }).toPromise().then(response => {
      return response.json();
    }).catch(this.handleError);
  }

  private handleError(error: any) {
    return Observable.throw(error.json());
  }
  addReservationToExsting(data: ReservationDetail, id: number) {
    //TO DO
    data.payment_status = "1";
    const body = JSON.stringify(data);
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("x-access-token", key);
    return this.http.post('/service/reservation/' + id.toString() + '?type=1', body, { headers: headers }).catch(this.handleError);

  }
  addReservationPersonToExstingReservation(data: ReservationPerson, id: number) {
    const body = JSON.stringify(data);
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("x-access-token", key);
    return this.http.post('/service/reservation/' + id.toString() + '?type=2', body, { headers: headers }).catch(this.handleError);

  }
  addReservationServiceToExstingReservation(data: ReservationServices, id: number) {
    const body = JSON.stringify(data);
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("x-access-token", key);
    return this.http.post('/service/reservation/' + id.toString() + '?type=3', body, { headers: headers }).catch(this.handleError);

  }
  deleteReservation(id: number) {
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("x-access-token", key);
    return this.http.delete('/service/reservation/' + id.toString() + '?type=1', { headers: headers }).catch(this.handleError);

  }
  deleteReservationService(id: number, service_id: number) {
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("x-access-token", key);
    return this.http.delete('/service/reservation/' + id.toString() + '?type=3&service_id=' + service_id.toString(), { headers: headers }).catch(this.handleError);

  }
  deleteReservationPerson(id: number, person_no: string) {
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("x-access-token", key);
    return this.http.delete('/service/reservation/' + id.toString() + '?type=2&person_no=' + person_no, { headers: headers }).catch(this.handleError);

  }
  updateReservation(id: number, status_id: string) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.put('/service/reservation/' + id.toString() + '?type=' + status_id + '&token=' + key, { headers: headers }).catch(this.handleError);

  }

  addPaymentToReservation(payment: Payment) {
    const body = JSON.stringify(payment);
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("x-access-token", key);

    return this.http.post('/service/payment?type=1', body, { headers: headers }).toPromise().then(response => {
      return response.json();
    }).catch(this.handleError);
  }
  addPaymentToService(payment: Payment) {
    const body = JSON.stringify(payment);
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("x-access-token", key);

    return this.http.post('/service/payment?type=2', body, { headers: headers }).toPromise().then(response => {
      return response.json();
    }).catch(this.handleError);
  }
}