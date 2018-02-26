import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';

export class AuthService {
    private subject = new Subject<any>();
    private userLoggedInSource = new Subject<string>();
    userLoggedIn$ = this.userLoggedInSource.asObservable();


    isLoggedIn = false;
    roleID = 'anonymous';
    user_id = 'anonymous';
    user_name = 'anonymous';
    branch_id: number;


    // Service message commands
    announceLogin() {
        this.userLoggedInSource.next();
    }


    login() {
        this.isLoggedIn = true;
    }

    logout() {
        this.isLoggedIn = false;
        let token = localStorage.removeItem('parkingUser');
        return true;
    }

    getIsLoggedIn() {
        let token = localStorage.getItem('parkingUser');
        if (token == undefined) {
            this.isLoggedIn = false;
        } else {
            this.isLoggedIn = true;
        }
        return this.isLoggedIn

    }
    getRoleID() {
        let parkingUser = JSON.parse(localStorage.getItem('parkingUser'));
        let roleID = parkingUser && parkingUser.role_id;

        if (roleID != undefined) {
            this.roleID = roleID;
        } else {
            this.roleID = 'anonymous';
        }
        return this.roleID

    }
    getUserID() {
        let parkingUser = JSON.parse(localStorage.getItem('parkingUser'));
        let user_id = parkingUser && parkingUser.user_id;

        if (user_id != undefined) {
            this.user_id = user_id;
        } else {
            this.user_id = 'anonymous';
        }
        return this.user_id;

    }
    getUserName() {
        let parkingUser = JSON.parse(localStorage.getItem('parkingUser'));
        let user_name = parkingUser && parkingUser.user_name;

        if (user_name != undefined) {
            this.user_name = user_name;
        } else {
            this.user_name = 'anonymous';
        }
        return this.user_name;

    }

    sendMessage(branch_id: number) {
        this.subject.next(branch_id);
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
    setBranchId(branch_id) {
        this.branch_id = branch_id;
        console.log("SET",this.branch_id);
    }
    getBranchId() {
        console.log("GET",this.branch_id);
        return this.branch_id;
    }
}