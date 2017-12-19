import { AppSettings } from './../app.config';
import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Injectable()
export class SalesService {

  constructor(private http: Http) {

  }

  getUserBranch(user_id: string) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/userBranch/' + user_id, { headers: headers })
      .catch(this.handleError);
  }

  getSalesReport(branch_id: string, datefrom: string, dateto: string) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    headers.append("branch_id", branch_id.toString());
    return this.http.get('/service/report/sales/' + branch_id + '?datefrom=' + datefrom + '&dateto=' + dateto, { headers: headers }).toPromise().then(response => {
      return response.json();
    }).catch(this.handleError);
  }

  private handleError(error: any) {
    return Observable.throw(error.json());
  }
}