import { ReservationService } from './reservation.service';
import { ToastModule, ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, ViewContainerRef, enableProdMode } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { ReservationInfo, Person, ReservationDetail, Reservation, ReservationSchedule } from './model';
import { AuthService } from './../core/auth.service';
import { Category } from '../category/model.js';
import { Room } from '../room/model.js';
import { IntlService } from '@progress/kendo-angular-intl';
import { SafeHtml } from "@angular/platform-browser";


enableProdMode();
@Component({
  moduleId: module.id,
  selector: 'parking-dashboard',
  templateUrl: 'reservation.html',
  styleUrls: ['./reservation.scss'],

})

export class ReservationComponent implements OnInit {
  public persons: Person[];
  public reservations: ReservationSchedule[];

  public genders: Array<{ text: string }> = [
    { text: "Male" },
    { text: "Female" },
    { text: "Other" }
  ];
  public reservationStatus: Array<{ value: number, text: string }> = [
    { value: 1, text: "Reserve" },
    { value: 2, text: "Occupied" }
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

  public userBranch: Array<any>;
  public brSelectedValue: number;

  constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private reservationService: ReservationService, private authservice: AuthService, private intl: IntlService) {
    this.toastr.setRootViewContainerRef(vcr);
    this.dateTo = new Date();
    this.dateFrom = new Date();
    this.dateFrom.setDate(this.dateTo.getDate() - 30);

    this.reservationInfo = new ReservationInfo(new Person(null, null, '', '', '', '', '', new Date(), ''), new Reservation(null, null, null, null, null, [
      new ReservationDetail(null, null, null, null, null, null, null, null, null, null, null)
    ]));
  }
  ngOnInit() {

    this.reservationService.getUserBranch(this.authservice.getUserID()).subscribe(data => {
      this.userBranch = data.json().branch;
      this.brSelectedValue = this.userBranch[0].id
      // TO DO
      this.fillDataRange();

      this.reservationService.getReservation(this.brSelectedValue.toString(), this.intl.formatDate(this.dateFrom, 'yyyy-MM-dd'), this.intl.formatDate(this.dateTo, 'yyyy-MM-dd')).subscribe(data => {
        this.reservations = data.json().data;
        console.log(this.reservations);
      });
    });


    this.reservationService.getPerson('').subscribe(data => {
      this.persons = data.json().person;
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
  openReservationForm(room_no: number, starDate: Date, endDate: Date) {
    this.showReservation = true;
    starDate = new Date();
    endDate = new Date();

    this.reservationService.getCategory(this.brSelectedValue).subscribe(data => {
      ;
      this.category = data.json().category;
    });

    this.reservationService.getRoom(this.brSelectedValue).subscribe(data => {
      this.room = data.json().room;
    });
    this.reservationInfo.reservation.reservationDetail[0] = new ReservationDetail(null, null, null, null, null, null, starDate, endDate, null, null, null);
  }
  addReservation() {
    var size = this.reservationInfo.reservation.reservationDetail.length;
    this.reservationInfo.reservation.reservationDetail[size] = new ReservationDetail(null, null, null, null, null, null, new Date(), new Date(), null, null, null);
  }
  removeReservation(id: ReservationDetail) {
    var index = this.reservationInfo.reservation.reservationDetail.indexOf(id, 0);
    if (index > -1) {
      this.reservationInfo.reservation.reservationDetail.splice(index, 1);
    }
  }
  registerReservation() {
    console.log(JSON.stringify(this.reservationInfo));

    this.reservationService.addReservation(this.reservationInfo).subscribe(data => {
      this.toastr.success("Reservation Added");
    });
  }
  public handleChangeBirthDate(value: Date) {
    this.reservationInfo.person.birthdate = new Date(this.intl.formatDate(value, 'yyyy-MM-dd'));
  }
  public handleChangeStartDate(value: Date, index: number) {
    this.reservationInfo.reservation.reservationDetail[index].start_date = new Date(this.intl.formatDate(value, 'yyyy-MM-dd'));

  }

  public handleChangeEndDate(value: Date, index: number) {
    this.reservationInfo.reservation.reservationDetail[index].end_date = new Date(this.intl.formatDate(value, 'yyyy-MM-dd'));
  }


  valueChanged(newVal) {
    var birthdate = newVal.birthdate;
    newVal.birthdate = new Date(this.intl.formatDate(birthdate, 'yyyy-MM-dd'));
    this.reservationInfo.person = newVal;
  }
  autoCompliteListFormatter(data: any): string {
    return `${data.personal_no} ${data.first_name}`;
  }
}