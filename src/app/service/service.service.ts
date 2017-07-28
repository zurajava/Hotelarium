import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Service } from './model';

@Injectable()
export class ServiceService {

  constructor(private http: Http) {
  }

  getService(branch_id: number) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/service/' + branch_id, { headers: headers })
      .catch(this.handleError);
  }

  addService(data: Service) {
    const body = JSON.stringify(data);
    console.log(body);
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("x-access-token", key);
    console.log(body);
    return this.http.post('/service/service', body, { headers: headers }).catch(this.handleError);

  }
  editService(data: Service) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.put('/service/service/' + data.id, JSON.stringify(data), { headers: headers }).catch(this.handleError);
  }

  deleteService(id: number) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.delete('/service/service/' + id, { headers: headers }).catch(this.handleError);

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
  private handleError(error: any) {
    return Observable.throw(error.json());
  }

}
