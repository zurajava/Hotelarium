import { AppSettings } from './../app.config';
import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';



@Injectable()
export class LoginService {
    public token: string;
    constructor(private http: Http) {
    }
    loginUser(details: any) {
        const body = JSON.stringify(details);
        console.log(body);
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/service/authenticate', body, { headers: headers })
            .map((data: Response) => {
                console.log(data);
                const token = data.json() && data.json().token;
                console.log(token);
                const user = data.json().role_id;
                if (token) {
                    this.token = token;
                    localStorage.setItem('parkingUser', JSON.stringify({ token: data.json().token, role_id: user }));

                    return data.json().data;
                } else {
                    return data.json().message
                }

            })
            .catch(this.handleError);
    }
    private handleError(error: any) {
        return Observable.throw(error.json().data);
    }
}