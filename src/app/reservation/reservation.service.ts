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
  getRoom(branch_id: number) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/room/' + branch_id, { headers: headers })
      .catch(this.handleError);
  }
  getUserBranch(user_id: string, org_id: number) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/userBranch/' + user_id + "/" + org_id, { headers: headers })
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
  getReservation(start_date: string, end_date: string) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/reservation?start_date=' + start_date + '&end_date=' + end_date, { headers: headers })
      .catch(this.handleError);
  }

  private handleError(error: any) {
    return Observable.throw(error.json());
  }
}