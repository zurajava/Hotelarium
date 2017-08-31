import { ReservationService } from './reservation.service';
import { ToastModule, ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, ViewContainerRef, enableProdMode } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { ReservationInfo, Person, ReservationDetail, Reservation, Schedule } from './model';
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
  public genders: Array<{ text: string }> = [
    { text: "Male" },
    { text: "Female" },
    { text: "Other" }
  ];
  public reservationStatus: Array<{ value: number, text: string }> = [
    { value: 1, text: "RESERVED" },
    { value: 2, text: "CHECK_IN" }
  ];
  public category: Category[];
  public room: Room[];
  public showReservation: boolean = false;
  public showReservationPayment: boolean = false;
  public reservationInfo: ReservationInfo;
  public rows = [];
  public segment = 30;
  public data: any;
  public dateRange = [];
  public dateFrom: Date;
  public dateTo: Date;

  public userBranch: Array<any>;
  public brSelectedValue: number;

  public reservationInfoEdit: ReservationInfo;

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

      this.reservationService.getPerson('').subscribe(data => {
        this.persons = data.json().person;
      });
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
    for (let i = 0; i < this.segment - 1; i++) {
      datesArray[i] = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000 * i));
    }
    this.dateRange = datesArray;


    this.reservationService.getReservation(this.brSelectedValue.toString(), this.intl.formatDate(this.dateFrom, 'yyyy-MM-dd'), this.intl.formatDate(this.dateTo, 'yyyy-MM-dd')).then(data => {
      this.data = data.data;
      for (var i = 0; i < this.data.length; i++) { // Loop Through Categories
        if (this.data[i].rooms.length > 0) {
          for (var j = 0; j < this.data[i].rooms.length; j++) { // Loop Through Rooms from Category

            if (this.data[i].rooms[j].reservations.length > 0) {
              var sheduleArray = [];
              var a = 0;
              var d = a;
              var sumDayFiff = 0;
              for (var t = 0; t < this.data[i].rooms[j].reservations.length; t++) {

                var sheduleFrom = new Date(this.data[i].rooms[j].reservations[t].start_date);
                var sheduleTo = new Date(this.data[i].rooms[j].reservations[t].end_date);
                var status = this.data[i].rooms[j].reservations[t].status_name;
                var oneDay = 24 * 60 * 60 * 1000;
                var diffDays = Math.round(Math.abs((sheduleFrom.getTime() - sheduleTo.getTime()) / (oneDay)));

                for (a; a < this.segment; a++) {
                  var current = new Date(datesArray[d - 1]);
                  if (current >= sheduleFrom && current <= sheduleTo) {

                    sheduleArray[a] = new Schedule(this.data[i].rooms[j].reservations[t].id, status, sheduleFrom, sheduleTo, this.data[i].rooms[j].reservations[t].payment_type, this.data[i].rooms[j].reservations[t].first_name, this.data[i].rooms[j].reservations[t].person_no, diffDays, current, false);
                    a++;
                    d = d + diffDays;
                    sumDayFiff = sumDayFiff + diffDays;
                    break;
                  } else {
                    sheduleArray[a] = new Schedule("", 'CHECKED_OUT', new Date(), new Date(), "", "", "", 1, current, true);
                  }
                  d++;
                }
                sumDayFiff--;
              }
              for (a; a < this.segment - 1 - sumDayFiff; a++) {
                sheduleArray[a] = new Schedule("", 'CHECKED_OUT', new Date(), new Date(), "", "", "", 1, datesArray[d + 1], true);
                d++;
              }
              this.data[i].rooms[j].reservations = sheduleArray;
            } else {
              for (var f = 0; f < this.segment - 1; f++) {
                this.data[i].rooms[j].reservations[f] = new Schedule("", 'CHECKED_OUT', new Date(), new Date(), "", "", "", 1, datesArray[f], true);
              }
            }
          }
        }
      }
      /*  for (let i = 0; i < this.data.length; i++) {
          console.log(this.data[i].name)
          for (let j = 0; j < this.data[i].rooms.length; j++) {
            console.log(this.data[i].rooms[j].room_no);
            for (let a = 0; a < this.data[i].rooms[j].reservations.length; a++) {
              console.log(this.data[i].rooms[j].reservations[a].status);
            }
  
          }
        }*/
    });
  }
  filterRezervation() {
    this.segment = Math.round(Math.abs((this.dateTo.getTime() - this.dateFrom.getTime()) / (24 * 60 * 60 * 1000)));
    this.fillDataRange();
  }
  openReservationForm(isReservation: boolean, room_no: number, starDate: Date, endDate: Date, currentDate: Date, status: string, category: string) {
    console.log(isReservation + ' ' + room_no + ' ' + starDate + ' ' + endDate + ' ' + status + ' ' + category + ' ' + currentDate);
    if (isReservation) {
      this.showReservation = true;
      this.showReservationPayment = false;
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
    } else {
      this.showReservation = false;
      this.showReservationPayment = true;

      this.reservationService.getReservationById('684').then(data => {
        console.log(data);
        this.reservationInfoEdit = data.data;
        console.log(this.reservationInfoEdit);
      });

    }
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
  addService(id: ReservationDetail) {
    console.log("addService", id);
  }
  addPerson(id: ReservationDetail) {
    console.log("addPerson", id);
  }
  addServiceEdit(id: ReservationDetail) {
    console.log("addServiceEdit", id);
  }
  addPersonEdit(id: ReservationDetail) {
    console.log("addPersonEdit", id);
  }
  updateReservation(id: ReservationDetail) {
    console.log("updateReservation", id);
  }
  updateAllReservation() {
    console.log("updateAllReservation",JSON.stringify(this.reservationInfo));

  }
  registerReservation() {
    console.log(JSON.stringify(this.reservationInfo));

    this.reservationService.addReservation(this.reservationInfo).subscribe(data => {
      this.fillDataRange();
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