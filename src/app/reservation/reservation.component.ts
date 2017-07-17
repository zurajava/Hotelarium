import { ReservationService } from './reservation.service';
import { ToastModule, ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';




@Component({
  moduleId: module.id,
  selector: 'parking-dashboard',
  templateUrl: 'reservation.html',
  styleUrls: ['./reservation.scss'],

})

export class ReservationComponent implements OnInit {
  rows = [];
  segment = 60;
  dateRange = [];
  public dateFrom: Date;
  public dateTo: Date;


  constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private dashboardservice: ReservationService) {
    this.toastr.setRootViewContainerRef(vcr);
  }
  ngOnInit() {
    this.fillDataRange();
  }

  fillDataRange() {
    const currentDate = new Date();
    const datesArray = [];
    const datesArrayForHeader = [];
    for (let i = 0; i < this.segment; i++) {
      datesArray[i] = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000 * i));
    }
    this.dateRange = datesArray;
  }
  filterRezervation() {
    console.log(this.dateFrom);
    console.log(this.dateTo);
  }


}