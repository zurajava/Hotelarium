import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class UsersService {

  constructor(private http: Http) {

  }
  getUserInfo() {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/userInfo?currenttimestamp=' + new Date(), { headers: headers })
      .catch(this.handleError);
  }
  getOrganisation() {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/getOrganisation?currenttimestamp=' + new Date(), { headers: headers })
      .catch(this.handleError);
  }
  getBranches() {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/getBranches?currenttimestamp=' + new Date(), { headers: headers })
      .catch(this.handleError);
  }
  private handleError(error: any) {
    return Observable.throw(error.json());
  }
}
