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
  public items: any;
  public branche: any;
  public organisation: any;
  public organisationList: any;
  public selectedOrganisation: number;
  public branchList: any;
  public selectedBranch: number;

  constructor(private userService: UsersService, public toastr: ToastsManager, vcr: ViewContainerRef, public http: Http) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.userService.getUserInfo().subscribe(data => {
      if (data.json().success === true) {
        this.items = data.json().users;
      } else {
        this.items = [];
        this.toastr.error(data.json().message);
      }
    });
    this.userService.getOrganisation().subscribe(data => {
      if (data.json().success === true) {
        this.organisationList = data.json().organisation;
      } else {
        this.organisationList = [];
        this.toastr.error(data.json().message);
      }
    });
    this.userService.getBranches().subscribe(data => {
      if (data.json().success === true) {
        this.branchList = data.json().branches;
        console.log(this.branchList);
      } else {
        this.branchList = [];
        this.toastr.error(data.json().message);
      }
    });
  }
  showDetails(items: any) {
    this.branche = items.branch;
    this.organisation = items.organisation;
  }
  public branchValueChange(value: any): void {
    this.selectedBranch = value;
    console.log("selectedBranch", this.selectedBranch);
  }
  public orgValueChange(value: any): void {
    this.selectedOrganisation = value;
    console.log("selectedOrganisation", this.selectedOrganisation);
  }
}
