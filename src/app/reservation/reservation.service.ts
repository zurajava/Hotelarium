import { AppSettings } from './../app.config';
import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { ReservationInfo } from './model';

@Injectable()
export class ReservationService {

  constructor(private http: Http) {

  }
  addReservation(data: ReservationInfo) {
    for (var i = 0; i < data.reservation.reservationDetail.length; i++) {
      data.reservation.reservationDetail[i].payment_status = "1";
    }
    const body = JSON.stringify(data);

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
  getReservation(branch_id: String, start_date: string, end_date: string) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/reservation?start_date=' + start_date + '&end_date=' + end_date + '&branch_id=' + branch_id, { headers: headers }).toPromise().then(response => {
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
}