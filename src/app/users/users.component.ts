import { Component, Injectable, ViewContainerRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UsersService } from './users.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';


@Component({
  moduleId: module.id,
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrls: ['./users.scss']
})
export class UsersComponent implements OnInit {

  constructor(private userService: UsersService, public toastr: ToastsManager, vcr: ViewContainerRef, public http: Http) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
  }

}
