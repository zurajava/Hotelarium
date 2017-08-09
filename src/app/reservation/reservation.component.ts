import { ReservationService } from './reservation.service';
import { ToastModule, ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { ReservationInfo, Person, ReservationDetail, Reservation } from './model';
import { AuthService } from './../core/auth.service';
import { Category } from '../category/model.js';
import { Room } from '../room/model.js';

@Component({
  moduleId: module.id,
  selector: 'parking-dashboard',
  templateUrl: 'reservation.html',
  styleUrls: ['./reservation.scss'],

})

export class ReservationComponent implements OnInit {
  public genders: Array<{ text: string }> = [
    { text: "Male" },
    { text: "Female" },
    { text: "Other" }
  ];
  public category: Category[];
  public room: Room[];
  public showReservation: boolean = false;
  public reservationInfo: ReservationInfo;
  public rows = [];
  public segment = 30;
  public dateRange = [];
  public dateFrom: Date;
  public dateTo: Date;

  public userOrganisation: Array<any>;
  public orgSelectedValue: number;

  public userBranch: Array<any>;
  public brSelectedValue: number;

  constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private reservationService: ReservationService, private authservice: AuthService) {
    this.toastr.setRootViewContainerRef(vcr);
    this.dateTo = new Date();
    this.dateFrom = new Date();
    this.dateFrom.setDate(this.dateTo.getDate() - 30);

    this.reservationInfo = new ReservationInfo(new Person(null, null, '', '', '', '', '', null, ''), new Reservation(null, null, null, null, null, [
      new ReservationDetail(null, null, null, null, null, null, null, null, null, null, null)
    ]));
  }
  ngOnInit() {
    this.reservationService.getUserOrganisation(this.authservice.getUserID()).subscribe(data => {
      this.userOrganisation = data.json().organisation;
      this.orgSelectedValue = this.userOrganisation[0].id

      this.reservationService.getUserBranch(this.authservice.getUserID(), this.orgSelectedValue).subscribe(data => {
        this.userBranch = data.json().branch;
        this.brSelectedValue = this.userBranch[0].id
        // TO DO
        this.fillDataRange();
      });
    });
  }
  public orgValueChange(value: any): void {
    this.orgSelectedValue = value;
    this.reservationService.getUserBranch(this.authservice.getUserID(), this.orgSelectedValue).subscribe(data => {
      this.userBranch = data.json().branch;
      this.brSelectedValue = this.userBranch[0].id;
      // TO DO
      this.fillDataRange();
    });
  }
  public brValueChange(value: any): void {
    this.brSelectedValue = value;
    // TO DO
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
    this.showReservation = true;

    this.reservationService.getCategory(this.brSelectedValue).subscribe(data => {
      this.category = data.json().category;
    });

    this.reservationService.getRoom(this.brSelectedValue).subscribe(data => {
      this.room = data.json().room;
    });


    this.reservationInfo.reservation.reservationDetail[0] = new ReservationDetail(null, null, null, null, null, null, new Date(), new Date(), null, null, null);
  }
  addReservation() {
    var size = this.reservationInfo.reservation.reservationDetail.length;
    this.reservationInfo.reservation.reservationDetail[size] = new ReservationDetail(null, null, null, null, null, null, new Date(), new Date(), null, null, null);
    console.log(this.reservationInfo);
  }
  removeReservation(id: ReservationDetail) {
    var index = this.reservationInfo.reservation.reservationDetail.indexOf(id, 0);
    if (index > -1) {
      this.reservationInfo.reservation.reservationDetail.splice(index, 1);
    }
  }
  registerReservation() {
    console.log(JSON.stringify(this.reservationInfo));
  }
}