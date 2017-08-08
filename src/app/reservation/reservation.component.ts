import { ReservationService } from './reservation.service';
import { ToastModule, ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { ReservationInfo, Person, ReservationDetail, Reservation } from './model';



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

    this.reservationInfo = new ReservationInfo(new Person(null, null, '', '', '', '', '', null, ''), new Reservation(null, null, null, null, null, [
      new ReservationDetail(null, null, null, null, null, null, null, null, null, null)
    ]));
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
    this.segment = Math.round(Math.abs((this.dateTo.getTime() - this.dateFrom.getTime()) / (24 * 60 * 60 * 1000)));
    this.fillDataRange();
  }
  openReservationForm(room_no: number) {
    console.log(room_no);
    this.showReservation = true;
    this.reservationInfo.reservation.reservationDetail[0] = new ReservationDetail(null, null, null, null, null, room_no, new Date(), new Date(), null, null);
  }
  addReservation() {
    this.reservationInfo.reservation.reservationDetail[1] = new ReservationDetail(null, null, null, null, null, 1101011, new Date(), new Date(), null, null);
  }
  removeReservation(id: number) {
    console.log(id);
  }
  registerReservation() {
    console.log(JSON.stringify(this.reservationInfo));
  }
}