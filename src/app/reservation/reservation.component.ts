import { ReservationService } from './reservation.service';
import { ToastModule, ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { ReservationInfo } from './model';



@Component({
  moduleId: module.id,
  selector: 'parking-dashboard',
  templateUrl: 'reservation.html',
  styleUrls: ['./reservation.scss'],

})

export class ReservationComponent implements OnInit {

  public showReservation: boolean = false;
  public reservationInfo: ReservationInfo;

  public rows = [];
  public segment = 30;
  public dateRange = [];
  public dateFrom: Date;
  public dateTo: Date;


  constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private dashboardservice: ReservationService) {
    this.toastr.setRootViewContainerRef(vcr);
    this.dateTo = new Date();
    this.dateFrom = new Date();
    this.dateFrom.setDate(this.dateTo.getDate() - 30);
  }
  ngOnInit() {
    this.fillDataRange();
  }

  fillDataRange() {
    const currentDate = this.dateFrom;
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
    this.segment = Math.round(Math.abs((this.dateTo.getTime() - this.dateFrom.getTime()) / (24 * 60 * 60 * 1000)));
    console.log(this.segment);
    this.fillDataRange();
  }
  openReservationForm() {
    this.showReservation = true;
  }
  registerReservation() {
    console.log(this.reservationInfo);
  }
}