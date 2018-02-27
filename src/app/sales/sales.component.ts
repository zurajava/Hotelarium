import { SalesService } from './sales.service';
import { ToastModule, ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from './../core/auth.service';
import * as moment from 'moment';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IntlService } from '@progress/kendo-angular-intl';
import { Sale } from './model';
import { Subscription } from 'rxjs/Subscription';
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'parking-amenitiesRequest',
  templateUrl: 'sales.html',
  styleUrls: ['./sales.scss']
})

export class SalesComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  public dateFrom: Date;
  public dateTo: Date;
  public brSelectedValue: number;
  public data: Array<Sale>;
  constructor(public toastr: ToastsManager, vcr: ViewContainerRef,
    private reportsService: SalesService, private modalService: NgbModal, private authservice: AuthService, private intl: IntlService) {
    this.toastr.setRootViewContainerRef(vcr);
    this.dateTo = new Date();
    this.dateFrom = new Date();
    this.dateFrom.setDate(this.dateFrom.getDate() - 30);
    this.dateTo.setDate(this.dateTo.getDate() + 2);
  }

  ngOnInit() {
    this.brSelectedValue = this.authservice.getBranchId();
    if (!this.brSelectedValue) {
      this.subscription = this.authservice.getMessage().subscribe(message => {
        this.brSelectedValue = message;
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
  loadData() {
    this.reportsService.getSalesReport(this.brSelectedValue.toString(), this.intl.formatDate(this.dateFrom, 'yyyy-MM-dd'),
      this.intl.formatDate(this.dateTo, 'yyyy-MM-dd')).then(data => {
        if (data.success === true) {
          this.data = data.sales;
          console.log(this.data);
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
        }
      });
  }

  filterRezervation() {
    this.loadRezervationPayment();
  }

  loadRezervationPayment() {
    this.reportsService.getSalesReport(this.brSelectedValue.toString(), this.intl.formatDate(this.dateFrom, 'yyyy-MM-dd'),
      this.intl.formatDate(this.dateTo, 'yyyy-MM-dd')).then(data => {
        if (data.success === true) {
          this.data = data.sales;
        } else {
          this.toastr.error(data.json().message);
        }
      });
  }
  exportSales() {
    console.log("exportSales");
    this.reportsService.exportAsExcelFile(this.data, 'sales');
  }
}