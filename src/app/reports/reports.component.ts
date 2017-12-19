import { ReportsService } from './reports.service';
import { ToastModule, ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from './../core/auth.service';
import * as moment from 'moment';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaymentReport } from './model';
import { IntlService } from '@progress/kendo-angular-intl';
declare var $: any;

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
  public data: Array<PaymentReport>;
  constructor(public toastr: ToastsManager, vcr: ViewContainerRef,
    private reportsService: ReportsService, private modalService: NgbModal, private authservice: AuthService, private intl: IntlService) {
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
        this.reportsService.getPaymentReport(this.brSelectedValue.toString(), this.intl.formatDate(this.dateFrom, 'yyyy-MM-dd'),
          this.intl.formatDate(this.dateTo, 'yyyy-MM-dd')).then(data => {
            if (data.success === true) {
              this.data = data.payments;
              $(function () {
                $("#example1").DataTable({
                  'paging': true,
                  'lengthChange': true,
                  'searching': false,
                  'ordering': true,
                  'info': true,
                  'autoWidth': false
                });
              });
            } else {
              this.toastr.error(data.json().message);
            }
          });
      } else {
        this.toastr.error(data.json().message);
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
    console.log("loadRezervationPayment");
    this.data = null;
    this.reportsService.getPaymentReport(this.brSelectedValue.toString(), this.intl.formatDate(this.dateFrom, 'yyyy-MM-dd'),
      this.intl.formatDate(this.dateTo, 'yyyy-MM-dd')).then(data => {
        if (data.success === true) {
          this.data = data.payments;
        } else {
          this.toastr.error(data.json().message);
        }
      });
  }

}