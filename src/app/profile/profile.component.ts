import { Component, Injectable, ViewContainerRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ProfileService } from './profile.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms';
import { AuthService } from './../core/auth.service';

@Component({
  moduleId: module.id,
  selector: 'app-users',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  loginUserDetails: any = {};

  constructor(private rofileService: ProfileService, public toastr: ToastsManager, vcr: ViewContainerRef, public http: Http, private authservice: AuthService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
  }
  changeUserPassword(login: NgForm) {
    let username = this.authservice.getUserName();
    this.loginUserDetails = {
      username: username,
      password: login.value.password
    }    
    if (login.value.password != login.value.confirmpassword) {
      this.toastr.error("Password Mismatch");
      return;
    }
    this.rofileService.changePassword(this.loginUserDetails)
      .subscribe(
        data => {
          this.toastr.success(data);
        },
        error => {
          this.toastr.error(error);
        }
      )
  }
}
