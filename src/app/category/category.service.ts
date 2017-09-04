import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Category } from './model';

@Injectable()
export class CategoryService {

  constructor(private http: Http) {
  }

  getCategory(branch_id: number) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/category/' + branch_id + '?currenttimestamp=' + new Date(), { headers: headers })
      .catch(this.handleError);
  }

  addCategory(data: Category) {
    const body = JSON.stringify(data);
    console.log(body);
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("x-access-token", key);
    console.log(body);
    return this.http.post('/service/category', body, { headers: headers }).catch(this.handleError);

  }
  editCategory(data: Category) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.put('/service/category/' + data.id, JSON.stringify(data), { headers: headers }).catch(this.handleError);
  }

  deleteCategory(id: number) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.delete('/service/category/' + id, { headers: headers }).catch(this.handleError);

  }
  getUserBranch(user_id: string) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/userBranch/' + user_id, { headers: headers })
      .catch(this.handleError);
  }
  private handleError(error: any) {
    return Observable.throw(error.json());
  }

}
