import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './auth.service';
import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    moduleId: module.id,
    selector: 'app-parking-header',
    templateUrl: './header.html'
})

export class HeaderComponent implements OnDestroy {
    roleID: any;
    user_name: any;
    subscription: Subscription;
    constructor(private router: Router, private authservice: AuthService) {
        this.getRoleID();
        this.getUserName();
        this.subscription = authservice.getUserLoggedInSource().subscribe(
            data => {
                this.getRoleID();
                this.getUserName();
            });
    }
    getRoleID() {
        this.roleID = this.authservice.getRoleID();
    }
    getUserName() {
        this.user_name = this.authservice.getUserName();
    }
    logout() {
        this.authservice.logout();
        this.router.navigate(['/login']);
        this.authservice.setBranchId(null);
        this.authservice.sendUserLoggedInSource();
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}