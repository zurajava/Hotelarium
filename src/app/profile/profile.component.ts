import { Component, Injectable, ViewContainerRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ProfileService } from './profile.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';


@Component({
  moduleId: module.id,
  selector: 'app-users',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  public userinfo:any;

  constructor(private userService: ProfileService, public toastr: ToastsManager, vcr: ViewContainerRef, public http: Http) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
  }

}
