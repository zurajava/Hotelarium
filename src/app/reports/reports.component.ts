import { ReportsService } from './reports.service';
import { ToastModule, ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from './../core/auth.service';
import * as moment from 'moment';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaymentReport, PaymentOverall, PaymentDetailed } from './model';
import { IntlService } from '@progress/kendo-angular-intl';
import { Subscription } from 'rxjs/Subscription';
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'parking-amenitiesRequest',
  templateUrl: 'reports.html',
  styleUrls: ['./reports.scss']
})

export class ReportsComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  public userBranch: Array<any>;

  public dateFrom: Date;
  public dateTo: Date;
  public brSelectedValue: number;

  public dateFromDetailed: Date;
  public dateToDetailed: Date;

  public dateFromOverall: Date;
  public dateToOverall: Date;

  public data: Array<PaymentReport>;
  public paymentDetailed: Array<PaymentDetailed>;
  public paymentOverall: Array<PaymentOverall>;

  constructor(public toastr: ToastsManager, vcr: ViewContainerRef,
    private reportsService: ReportsService, private modalService: NgbModal, private authservice: AuthService, private intl: IntlService) {
    this.toastr.setRootViewContainerRef(vcr);
    this.dateTo = new Date();
    this.dateFrom = new Date();
    this.dateFrom.setDate(this.dateFrom.getDate() - 30);
    this.dateTo.setDate(this.dateTo.getDate() + 2);

    this.dateToDetailed = new Date();
    this.dateFromDetailed = new Date();
    this.dateFromDetailed.setDate(this.dateFromDetailed.getDate() - 30);
    this.dateToDetailed.setDate(this.dateToDetailed.getDate() + 2);

    this.dateToOverall = new Date();
    this.dateFromOverall = new Date();
    this.dateFromOverall.setDate(this.dateFromOverall.getDate() - 30);
    this.dateToOverall.setDate(this.dateToOverall.getDate() + 2);
  }

  ngOnInit() {
    this.brSelectedValue = this.authservice.getBranchId();
    if (!this.brSelectedValue) {
      this.subscription = this.authservice.getMessage().subscribe(message => {
        this.brSelectedValue = message
        this.loadData();
      });
    } else {
      this.subscription = this.authservice.getMessage().subscribe(message => {
        this.loadData();
      }
      );
      this.loadData();
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  filterPayment() {
    this.loadRezervationPayment();
  }
  filterPaymenttDetailed() {
    this.loadRezervationPaymentDetailed();
  }
  filterPaymentOwerall() {
    this.loadRezervationPaymentOwerall();
  }
  loadData() {
    this.reportsService.getPaymentReport(this.brSelectedValue.toString(), this.intl.formatDate(this.dateFrom, 'yyyy-MM-dd'),
      this.intl.formatDate(this.dateTo, 'yyyy-MM-dd')).then(data => {
        if (data.success === true) {
          this.data = data.payments;
          console.log("this.data", this.data);
          $(function () {
            $("#example1").DataTable({
              'paging': false,
              'lengthChange': false,
              'searching': false,
              'ordering': false,
              'info': false,
              'autoWidth': false
            });
          });
        } else {
          this.toastr.error(data.json().message);
        }
      });
    this.reportsService.getPaymentOverall(this.brSelectedValue.toString(), this.intl.formatDate(this.dateFromOverall, 'yyyy-MM-dd'),
      this.intl.formatDate(this.dateToOverall, 'yyyy-MM-dd')).then(data => {
        if (data.success === true) {
          this.paymentOverall = data.data;
          console.log("this.paymentOverall", this.paymentOverall);
          $(function () {
            $("#example2").DataTable({
              'paging': false,
              'lengthChange': false,
              'searching': false,
              'ordering': false,
              'info': false,
              'autoWidth': false
            });
          });
        } else {
          this.toastr.error(data.json().message);
        }
      });
    this.reportsService.getPaymentDetailed(this.brSelectedValue.toString(), this.intl.formatDate(this.dateFromDetailed, 'yyyy-MM-dd'),
      this.intl.formatDate(this.dateToDetailed, 'yyyy-MM-dd')).then(data => {
        if (data.success === true) {
          this.paymentDetailed = data.data;
          console.log("this.paymentDetailed", this.paymentDetailed);
          $(function () {
            $("#example3").DataTable({
              'paging': false,
              'lengthChange': false,
              'searching': false,
              'ordering': false,
              'info': false,
              'autoWidth': false
            });
          });
        } else {
          this.toastr.error(data.json().message);
        }
      });

  }
  loadRezervationPayment() {
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
  loadRezervationPaymentDetailed() {
    this.paymentDetailed = null;
    this.reportsService.getPaymentDetailed(this.brSelectedValue.toString(), this.intl.formatDate(this.dateFromDetailed, 'yyyy-MM-dd'),
      this.intl.formatDate(this.dateToDetailed, 'yyyy-MM-dd')).then(data => {
        if (data.success === true) {
          this.paymentDetailed = data.data;
        } else {
          this.toastr.error(data.json().message);
        }
      });
  }
  loadRezervationPaymentOwerall() {
    this.paymentOverall = null;
    this.reportsService.getPaymentOverall(this.brSelectedValue.toString(), this.intl.formatDate(this.dateFromOverall, 'yyyy-MM-dd'),
      this.intl.formatDate(this.dateToOverall, 'yyyy-MM-dd')).then(data => {
        if (data.success === true) {
          this.paymentOverall = data.data;
        } else {
          this.toastr.error(data.json().message);
        }
      });
  }

  exportPayment() {
    console.log("exportPayment");
    this.reportsService.exportAsExcelFile(this.data, 'payment');
  }
  exportPaymentOwerall() {
    console.log("exportPaymentOwerall");
    this.reportsService.exportAsExcelFile(this.paymentOverall, 'payment_overall');
  }
  exportPaymenttDetailed() {
    console.log("exportPaymenttDetailed");
    this.reportsService.exportAsExcelFile(this.paymentDetailed, 'payment_detailed');
  }

}