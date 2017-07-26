import { AppSettings } from './../app.config';
import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Branch } from './model.js';

@Injectable()
export class BranchService {
    constructor(private http: Http) {
    }

    getBranch() {
        const headers = new Headers();
        let key = JSON.parse(localStorage.getItem("parkingUser")).token;
        headers.append("x-access-token", key);
        headers.append('Content-Type', 'application/json');
        return this.http.get('/service/branch', { headers: headers })
            .catch(this.handleError);
    }

    addBranch(data: Branch) {

        const body = JSON.stringify(data);
        console.log(body);
        let key = JSON.parse(localStorage.getItem("parkingUser")).token;
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("x-access-token", key);
        console.log(body);
        return this.http.post('/service/branch', body, { headers: headers }).catch(this.handleError);

    }
    editBranch(data: Branch) {
        const headers = new Headers();
        let key = JSON.parse(localStorage.getItem("parkingUser")).token;
        headers.append("x-access-token", key);
        headers.append('Content-Type', 'application/json');
        return this.http.put('/service/branch/' + data.id, JSON.stringify(data), { headers: headers }).catch(this.handleError);
    }

    deleteBranch(id: number) {
        console.log("delete branch : " + id);
        const headers = new Headers();
        let key = JSON.parse(localStorage.getItem("parkingUser")).token;
        headers.append("x-access-token", key);
        headers.append('Content-Type', 'application/json');
        return this.http.delete('/service/branch/' + id, { headers: headers }).catch(this.handleError);

    }
    private handleError(error: any) {
        return Observable.throw(error.json());
    }
}