import { AppSettings } from './../app.config';
import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class PersonsService {

  public token: string;
  constructor(private http: Http) {
  }
  getUsers(name: String) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);

    return this.http.get('/service/users?name=' + name, { headers: headers })
      .map((data: Response) => {
        return data.json();
      })
      .catch(this.handleError);
  }
  private handleError(error: any) {
    return Observable.throw(error.json().data);
  }

}
