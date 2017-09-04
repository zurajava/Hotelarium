import { AppSettings } from './../app.config';
import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Room } from './model';


@Injectable()
export class RoomService {
    constructor(private http: Http) {
    }

    getRoom(branch_id: number) {
        const headers = new Headers();
        let key = JSON.parse(localStorage.getItem("parkingUser")).token;
        headers.append("x-access-token", key);
        headers.append('Content-Type', 'application/json');
        return this.http.get('/service/room/' + branch_id + '?currenttimestamp=' + new Date(), { headers: headers })
            .catch(this.handleError);
    }

    addRoom(data: Room) {
        const body = JSON.stringify(data);
        console.log(body);
        let key = JSON.parse(localStorage.getItem("parkingUser")).token;
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("x-access-token", key);
        console.log(body);
        return this.http.post('/service/room', body, { headers: headers }).catch(this.handleError);

    }
    editRoom(data: Room) {
        const headers = new Headers();
        let key = JSON.parse(localStorage.getItem("parkingUser")).token;
        headers.append("x-access-token", key);
        headers.append('Content-Type', 'application/json');
        return this.http.put('/service/room/' + data.id, JSON.stringify(data), { headers: headers }).catch(this.handleError);
    }

    deleteRoom(id: number) {
        const headers = new Headers();
        let key = JSON.parse(localStorage.getItem("parkingUser")).token;
        headers.append("x-access-token", key);
        headers.append('Content-Type', 'application/json');
        return this.http.delete('/service/room/' + id, { headers: headers }).catch(this.handleError);

    }
    getUserBranch(user_id: string) {
        const headers = new Headers();
        let key = JSON.parse(localStorage.getItem("parkingUser")).token;
        headers.append("x-access-token", key);
        headers.append('Content-Type', 'application/json');
        return this.http.get('/service/userBranch/' + user_id, { headers: headers })
            .catch(this.handleError);
    }
    getCategory(branch_id: number) {
        const headers = new Headers();
        let key = JSON.parse(localStorage.getItem("parkingUser")).token;
        headers.append("x-access-token", key);
        headers.append('Content-Type', 'application/json');
        return this.http.get('/service/category/' + branch_id + '?currenttimestamp=' + new Date(), { headers: headers })
            .catch(this.handleError);
    }
    private handleError(error: any) {
        return Observable.throw(error.json());
    }

}