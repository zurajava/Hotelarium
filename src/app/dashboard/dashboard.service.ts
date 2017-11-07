import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
@Injectable()
export class DashboardService {

  constructor(private http: Http) {
  }
  getUserBranch(user_id: string) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/userBranch/' + user_id, { headers: headers }).toPromise().then(response => {
      return response.json();
    }).catch(this.handleError)
  }
  getStatistic(branch_id: string) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/reservation/statistic/' + branch_id, { headers: headers }).toPromise().then(response => {
      return response.json();
    }).catch(this.handleError);
  }
  private handleError(error: any) {
    return Observable.throw(error.json());
  }
}
