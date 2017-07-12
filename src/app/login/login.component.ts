import { AuthService } from './../core/auth.service';
import { LoginService } from './login.service';
import { Component, Injectable, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
    moduleId: module.id,
    selector: 'parking-login',
    templateUrl: 'login.html',
    styleUrls: ['./login.scss']
})

export class LoginComponent {

    loginUserDetails: any = {} // Login user details available here
    @Output() login: EventEmitter<any> = new EventEmitter<any>();

    constructor(private loginservice: LoginService, public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router, private authservice: AuthService) {
        this.toastr.setRootViewContainerRef(vcr);

        if (this.authservice.getIsLoggedIn() === true) {
            this.router.navigate(['reservation']);
        }
    }

    loginUser(login: NgForm) {
        this.loginUserDetails = {
            username: login.value.residentID,
            password: login.value.password
        }
        this.loginservice.loginUser(this.loginUserDetails)
            .subscribe(
            data => {
                this.router.navigate(['reservation']);
                console.log(data);
                this.toastr.success(data);
                this.authservice.login();
                this.authservice.announceLogin();
            },
            error => {
                this.toastr.error(error);
            }
            )
    }

}