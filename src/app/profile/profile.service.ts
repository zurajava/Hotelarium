import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
@Injectable()
export class ProfileService {

  constructor(private http: Http) {

  }
  changePassword(details: any) {
    const body = JSON.stringify(details);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/service/changePassword', body, { headers: headers })
      .map((data: Response) => {
        return data.json().message;
      })
      .catch(this.handleError);
  }
  private handleError(error: any) {
    return Observable.throw(error.json().data);
  }
}
