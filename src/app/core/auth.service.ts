import { Subject } from 'rxjs/Subject';


export class AuthService {
    private userLoggedInSource = new Subject<string>();

    // Observable string streams
    userLoggedIn$ = this.userLoggedInSource.asObservable();


    isLoggedIn = false;
    roleID = 'anonymous';
    user_id = 'anonymous';


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
        return this.user_id

    }
}