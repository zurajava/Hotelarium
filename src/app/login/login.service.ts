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
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/service/authenticate', body, { headers: headers })
            .map((data: Response) => {

                if (data.json().success == true) {
                    const token = data.json().token;
                    const user = data.json().user.role;
                    const user_id = data.json().user.id;
                    const user_name = data.json().user.user_name;

                    this.token = token;
                    localStorage.setItem('parkingUser', JSON.stringify({ token: data.json().token, role_id: user, user_id: user_id, user_name: user_name }));
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