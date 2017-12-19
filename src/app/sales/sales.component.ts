import { SalesService } from './sales.service';
import { ToastModule, ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from './../core/auth.service';
import * as moment from 'moment';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IntlService } from '@progress/kendo-angular-intl';
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'parking-amenitiesRequest',
  templateUrl: 'sales.html',
  styleUrls: ['./sales.scss']
})

export class SalesComponent implements OnInit {
  public dateFrom: Date;
  public dateTo: Date;
  public userBranch: Array<any>;
  public brSelectedValue: number;
  constructor(public toastr: ToastsManager, vcr: ViewContainerRef,
    private reportsService: SalesService, private modalService: NgbModal, private authservice: AuthService, private intl: IntlService) {
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

      }
    });
  }
  public brValueChange(value: any): void {
    this.brSelectedValue = value;
    this.loadRezervationPayment();
  }

  filterRezervation() {
    this.loadRezervationPayment();
  }

  loadRezervationPayment() {
  }

}