import { ReportsService } from './reports.service';
import { ToastModule, ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from './../core/auth.service';
import * as moment from 'moment';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  moduleId: module.id,
  selector: 'parking-amenitiesRequest',
  templateUrl: 'reports.html',
  styleUrls: ['./reports.scss']
})

export class ReportsComponent implements OnInit {
  public dateFrom: Date;
  public dateTo: Date;
  public userBranch: Array<any>;
  public brSelectedValue: number;

  constructor(public toastr: ToastsManager, vcr: ViewContainerRef,
    private reportsService: ReportsService, private modalService: NgbModal, private authservice: AuthService, ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.dateTo = new Date();
    this.dateFrom = new Date();
    this.dateFrom.setDate(this.dateFrom.getDate() - 5);
    this.dateTo.setDate(this.dateTo.getDate() + 30);
  }

  ngOnInit() {
    this.reportsService.getUserBranch(this.authservice.getUserID()).subscribe(data => {
      if (data.json().success === true) {
        this.userBranch = data.json().branch;
        this.brSelectedValue = this.userBranch[0].id;
      } else {
        this.toastr.error(data.json().message);
      }
    });
  }
  public brValueChange(value: any): void {
    this.brSelectedValue = value;
    // TO DO 
  }



}