import { ReservationService } from './reservation.service';
import { ToastModule, ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, ViewContainerRef, enableProdMode } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import * as moment from 'moment';
import { ReservationInfo, Person, ReservationDetail, Reservation, Schedule, ReservationPerson, ReservationServices } from './model';
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
  public personList: Array<ReservationPerson>;
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

    this.reservationInfo = new ReservationInfo(new Person(null, null, '', '', '', '', '', new Date(), ''), new Reservation(null, null, null, null, null, [new ReservationDetail(null, null, null, null, null, null, null, null, null, [], [])]));
  }
  ngOnInit() {
    this.reservationService.getUserBranch(this.authservice.getUserID()).subscribe(data => {
      if (data.json().success === true) {
        this.userBranch = data.json().branch;
        this.brSelectedValue = this.userBranch[0].id

        /* this.reservationService.getPerson('').subscribe(data => {
           this.persons = data.json().person;
         });*/
        this.fillDataRange();
      } else {
        this.toastr.error(data.json().message);
      }
    });

  }

  public brValueChange(value: any): void {
    this.brSelectedValue = value;
    // TO DO
    this.fillDataRange();
  }
  public categoryValueChange(value: any): void {
    console.log(value);
    /*  this.reservationService.getRoom(this.brSelectedValue, value).subscribe(data => {
        this.room = data.json().room;
      }); */
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

                    sheduleArray[a - 1] = new Schedule(this.data[i].rooms[j].reservations[t].id, status, sheduleFrom, sheduleTo, this.data[i].rooms[j].reservations[t].payment_type, this.data[i].rooms[j].reservations[t].first_name, this.data[i].rooms[j].reservations[t].person_no, diffDays, current, false, this.data[i].rooms[j].reservations[t].reservation_id);
                    a++;
                    d = d + diffDays;
                    sumDayFiff = sumDayFiff + diffDays;
                    break;
                  } else {
                    sheduleArray[a - 1] = new Schedule("", 'CHECKED_OUT', new Date(), new Date(), "", "", "", 1, current, true, "");
                  }
                  d++;
                }
                sumDayFiff--;
              }
              for (a; a < this.segment - sumDayFiff; a++) {
                sheduleArray[a - 1] = new Schedule("", 'CHECKED_OUT', new Date(), new Date(), "", "", "", 1, datesArray[d + 1], true, "");
                d++;
              }
              this.data[i].rooms[j].reservations = sheduleArray;
            } else {
              for (var f = 0; f < this.segment; f++) {
                this.data[i].rooms[j].reservations[f] = new Schedule("", 'CHECKED_OUT', new Date(), new Date(), "", "", "", 1, datesArray[f], true, "");
              }
            }
          }
        }
      }
    });
  }
  filterRezervation() {
    this.segment = Math.round(Math.abs((this.dateTo.getTime() - this.dateFrom.getTime()) / (24 * 60 * 60 * 1000)));
    this.fillDataRange();
  }
  openReservationForm(isReservation: boolean, room_no: number, starDate: Date, endDate: Date, currentDate: Date, status: string, category: string, reservation_id: string) {
    console.log(isReservation + ' ' + room_no + ' ' + starDate + ' ' + endDate + ' ' + status + ' ' + category + ' ' + currentDate + ' ' + reservation_id);
    if (isReservation) {
      this.showReservation = true;
      this.showReservationPayment = false;
      starDate = new Date();
      endDate = new Date();

      this.reservationService.getCategory(this.brSelectedValue).subscribe(data => {
        this.category = data.json().category;
        this.reservationService.getRoom(this.brSelectedValue, null).subscribe(data => {
          this.room = data.json().room;
        });
      });
      this.reservationInfo.reservation.reservationDetail[0] = new ReservationDetail(null, null, null, null, null, null, starDate, endDate, null, null, null);
    } else {
      this.showReservation = false;
      this.showReservationPayment = true;

      this.reservationService.getCategory(this.brSelectedValue).subscribe(data => {
        this.category = data.json().category;
        this.reservationService.getRoom(this.brSelectedValue, this.category[0].id.toString()).subscribe(data => {
          this.room = data.json().room;
        });
      });


      this.reservationService.getReservationById(reservation_id).then(data => {
        console.log(reservation_id, data.success, data);
        if (data.success === true) {
          this.reservationInfoEdit = data.data;
          console.log(this.reservationInfoEdit);
          for (var i = 0; i < this.reservationInfoEdit.reservation.reservationDetail.length; i++) {
            var sd = new Date(this.intl.formatDate(this.reservationInfoEdit.reservation.reservationDetail[i].start_date, 'yyyy-MM-dd'));
            var ed = new Date(this.intl.formatDate(this.reservationInfoEdit.reservation.reservationDetail[i].end_date, 'yyyy-MM-dd'));

            this.reservationInfoEdit.reservation.reservationDetail[i].start_date = sd;
            this.reservationInfoEdit.reservation.reservationDetail[i].end_date = ed;
          }
        } else {
          this.toastr.error(data.message);
        }
      });
    }
  }
  addReservation() {
    var size = this.reservationInfo.reservation.reservationDetail.length;
    this.reservationInfo.reservation.reservationDetail[size] = new ReservationDetail(null, null, null, null, null, null, new Date(), new Date(), null, [new ReservationPerson('eee', 'eee', 'eee')], null);
  }
  addReservationToExisting() {
    var size = this.reservationInfoEdit.reservation.reservationDetail.length;
    this.reservationInfoEdit.reservation.reservationDetail[size] = new ReservationDetail(null, null, null, null, null, null, new Date(), new Date(), null, null, null);
  }
  removeReservation(id: ReservationDetail) {
    var index = this.reservationInfo.reservation.reservationDetail.indexOf(id, 0);
    if (index > -1) {
      this.reservationInfo.reservation.reservationDetail.splice(index, 1);
    }
  }
  removeReservationExisting(id: ReservationDetail) {
    console.log("removeReservationExisting");
    var index = this.reservationInfoEdit.reservation.reservationDetail.indexOf(id, 0);
    if (index > -1) {
      this.reservationInfoEdit.reservation.reservationDetail.splice(index, 1);
    }
  }

  removeReservationPerson(id: ReservationDetail, person: ReservationPerson) {
    console.log("removeReservationPerson");
    var index = this.reservationInfo.reservation.reservationDetail.indexOf(id, 0);
    if (index > -1) {
      var indexPerson = this.reservationInfo.reservation.reservationDetail[index].reservationPerson.indexOf(person, 0);
      if (indexPerson > -1) {
        this.reservationInfo.reservation.reservationDetail[index].reservationPerson.splice(indexPerson, 1);
      }
    }
  }
  removeReservationPersonExisting(id: ReservationDetail, person: ReservationPerson) {
    console.log("removeReservationPersonExisting");

    var index = this.reservationInfoEdit.reservation.reservationDetail.indexOf(id, 0);
    if (index > -1) {
      var indexPerson = this.reservationInfoEdit.reservation.reservationDetail[index].reservationPerson.indexOf(person, 0);
      if (indexPerson > -1) {
        this.reservationInfoEdit.reservation.reservationDetail[index].reservationPerson.splice(indexPerson, 1);
      }
    }
  }
  removeReservationService(id: ReservationDetail, service: ReservationServices) {
    console.log("removeReservationService");
    var index = this.reservationInfo.reservation.reservationDetail.indexOf(id, 0);
    if (index > -1) {
      var indexPerson = this.reservationInfo.reservation.reservationDetail[index].reservationService.indexOf(service, 0);
      if (indexPerson > -1) {
        this.reservationInfo.reservation.reservationDetail[index].reservationService.splice(indexPerson, 1);
      }
    }

  }
  removeReservationServiceExisting(id: ReservationDetail, service: ReservationServices) {
    console.log("removeReservationServiceExisting");
    var index = this.reservationInfoEdit.reservation.reservationDetail.indexOf(id, 0);
    if (index > -1) {
      var indexPerson = this.reservationInfoEdit.reservation.reservationDetail[index].reservationService.indexOf(service, 0);
      if (indexPerson > -1) {
        this.reservationInfoEdit.reservation.reservationDetail[index].reservationService.splice(indexPerson, 1);
      }
    }

  }
  addService(id: ReservationDetail) {
    id.expandService = true;
    var index = this.reservationInfo.reservation.reservationDetail.indexOf(id, 0);
    if (id.reservationService === null) {
      var temp = [new ReservationServices(0, 'a', 'a', 'a', 'a')];
      id.reservationService = temp;
    } else {
      var personList = this.reservationInfo.reservation.reservationDetail[index];
    }

  }
  addPerson(id: ReservationDetail) {
    id.expandPerson = true;
    var index = this.reservationInfo.reservation.reservationDetail.indexOf(id, 0);
    if (id.reservationPerson === null) {
      var temp = [new ReservationPerson('p', 'p', 'p')];
      id.reservationPerson = temp;
    } else {
      var personList = this.reservationInfo.reservation.reservationDetail[index];
    }
  }
  addServiceEdit(id: ReservationDetail) {
    console.log("addServiceEdit", id);
    id.expandService = true;
  }
  addPersonEdit(id: ReservationDetail) {
    console.log("addPersonEdit", id);
    id.expandPerson = true;
  }
  updateReservation(id: ReservationDetail) {
    console.log("updateReservation", id);
  }
  updateAllReservation() {
    console.log("updateAllReservation", JSON.stringify(this.reservationInfo));

  }
  paymentReservationAll() {
    console.log("paymentReservationAll", JSON.stringify(this.reservationInfo));

  }
  addPersonToReservationPerson(id: ReservationDetail) {
    console.log("addPersonToReservationPerson", id);
    var size = id.reservationPerson.length;
    var p = new ReservationPerson('', '', '');
    id.reservationPerson[size] = p;
  }
  addPersonToReservationPersonExisting(id: ReservationDetail) {
    console.log("addPersonToReservationPersonExisting", id);
    var size = id.reservationPerson.length;
    var p = new ReservationPerson('', '', '');
    id.reservationPerson[size] = p;
  }

  addServiceToReservationService(id: ReservationDetail) {
    console.log("addServiceToReservationService", id);
    var size = id.reservationService.length;
    var p = new ReservationServices(null, '', '', '', '');
    id.reservationService[size] = p;
  }
  addServiceToReservationServiceExisting(id: ReservationDetail) {
    console.log("addServiceToReservationServiceExisting", id);
    var size = id.reservationService.length;
    var p = new ReservationServices(null, '', '', '', '');
    id.reservationService[size] = p;
  }
  registerReservation() {
    console.log(JSON.stringify(this.reservationInfo));

    this.reservationService.addReservation(this.reservationInfo).subscribe(data => {
      console.log("addReservation", data.json(), data.json().success);
      if (data.json().success === true) {
        this.toastr.success("Reservation Added");
        this.fillDataRange();
      } else {
        this.toastr.error(data.json().error);
      }
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

  public handleChangeBirthDateEdit(value: Date) {
    this.reservationInfoEdit.person.birthdate = new Date(this.intl.formatDate(value, 'yyyy-MM-dd'));
  }

  public handleChangeStartDateEdit(value: Date, index: number) {
    this.reservationInfoEdit.reservation.reservationDetail[index].start_date = new Date(this.intl.formatDate(value, 'yyyy-MM-dd'));

  }

  public handleChangeEndDateEdit(value: Date, index: number) {
    this.reservationInfoEdit.reservation.reservationDetail[index].end_date = new Date(this.intl.formatDate(value, 'yyyy-MM-dd'));
  }


  valueChanged(newVal) {
    console.log("valueChanged", newVal.birthdate);
    var birthdate = newVal.birthdate;
    newVal.birthdate = new Date(this.intl.formatDate(birthdate, 'yyyy-MM-dd'));
    this.reservationInfo.person = newVal;
  }

  valueChangedEdit(newVal) {
    if (newVal.birthdate === undefined) {
      this.reservationInfoEdit.person.birthdate = new Date(this.intl.formatDate(this.reservationInfoEdit.person.birthdate, 'yyyy-MM-dd'));;
    } else {
      var birthdate = newVal.birthdate;
      newVal.birthdate = new Date(this.intl.formatDate(birthdate, 'yyyy-MM-dd'));
      this.reservationInfoEdit.person = newVal;
    }

  }
  autoCompliteListFormatter(data: any): string {
    return `${data.personal_no} ${data.first_name}`;
  }
}