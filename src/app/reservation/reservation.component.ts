import { ReservationService } from './reservation.service';
import { ToastModule, ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, ViewContainerRef, enableProdMode, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import * as moment from 'moment';
import {
  ReservationInfo, Person, ReservationDetail, Reservation, Schedule,
  ReservationPerson, ReservationServices, Payment
} from './model';
import { AuthService } from './../core/auth.service';
import { Category } from '../category/model.js';
import { Service } from '../service/model.js';
import { Room } from '../room/model.js';
import { IntlService } from '@progress/kendo-angular-intl';
import { SafeHtml } from '@angular/platform-browser';
import * as jsPDF from 'jspdf';
import { Console } from '@angular/core/src/console';
import { Subscription } from 'rxjs/Subscription';

enableProdMode();
@Component({
  moduleId: module.id,
  selector: 'parking-dashboard',
  templateUrl: 'reservation.html',
  styleUrls: ['./reservation.scss'],
  providers: [
    { provide: 'Window', useValue: window }
  ]
})
export class ReservationComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  public persons: Person[];
  public genders: Array<{ text: string }> = [
    { text: "Male" },
    { text: "Female" },
    { text: "Other" }
  ];
  public payTymes: Array<{ text: string }> = [
    { text: "Card" },
    { text: "Cash" }
  ];
  public company: Array<{ text: string }> = [
    { text: "YES" },
    { text: "NO" }
  ];
  public reservationStatus: Array<{ value: number, text: string }> = [
    { value: 1, text: "RESERVED" },
    { value: 2, text: "CHECK_IN" }
  ];
  public category: Category[];
  public serviceData: Service[];
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
  public personalNo: string;
  public reserv: Boolean = true;
  public checkIn: Boolean = true;
  public checkOut: Boolean = false;
  public brSelectedValue: number;
  saveUsername: Boolean = true;
  public reservationInfoEdit: ReservationInfo;

  constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private reservationService: ReservationService, private authservice: AuthService, private intl: IntlService) {
    this.toastr.setRootViewContainerRef(vcr);
    this.dateTo = new Date();
    this.dateFrom = new Date();
    this.dateFrom.setDate(this.dateFrom.getDate() - 5);
    this.dateTo.setDate(this.dateTo.getDate() + 30);
    this.personalNo = '';
    this.segment = Math.round(Math.abs((this.dateTo.getTime() - this.dateFrom.getTime()) / (24 * 60 * 60 * 1000)));
    this.reservationInfo = new ReservationInfo(new Person(null, '', '', '', '', 'Title', '', new Date(), ''), new Reservation(null, null, null, null, null,
      [new ReservationDetail(null, null, null, null, null, null, null, null, null, null, [], [], null, false, false, true)]));
  }
  ngOnInit() {
    this.brSelectedValue = this.authservice.getBranchId();
    if (!this.brSelectedValue) {
      this.subscription = this.authservice.getMessage().subscribe(message => {
        this.brSelectedValue = message;
        this.fillDataRange();
      });
    } else {
      this.fillDataRange();
    }
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  public categoryValueChange(value: any, reservation: ReservationDetail): void {
    this.reservationService.getRoom(this.brSelectedValue, value).subscribe(data => {
      reservation.room = data.json().room;
    });
  }
  public categoryValueChangeEdit(value: any, reservation: ReservationDetail): void {
    this.reservationService.getRoom(this.brSelectedValue, value).subscribe(data => {
      reservation.room = data.json().room;
    });
  }
  public serviceValueChange(newValue, service: ReservationServices): void {
    for (var i = 0; i < this.serviceData.length; i++) {
      if (newValue == this.serviceData[i].id) {
        service.frequency = this.serviceData[i].type;
      }
    }
  }
  public serviceValueChangeEdit(newValue, service: ReservationServices): void {
    for (var i = 0; i < this.serviceData.length; i++) {
      if (newValue == this.serviceData[i].id) {
        service.frequency = this.serviceData[i].type;
      }
    }
  }
  fillDataRange() {
    const currentDate = this.dateFrom;
    const datesArray = [];
    const datesArrayForHeader = [];
    for (let i = 0; i < this.segment - 1; i++) {
      datesArray[i] = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000 * i));
    }
    this.dateRange = datesArray;
    this.reservationService.getReservation(this.brSelectedValue, this.intl.formatDate(this.dateFrom, 'yyyy-MM-dd'),
      this.intl.formatDate(this.dateTo, 'yyyy-MM-dd'), this.reserv, this.checkIn, this.checkOut, this.personalNo).then(data => {
        if (data.success === true) {
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
                        sheduleArray[a - 1] = new Schedule("", 'FREE', new Date(), new Date(), "", "", "", 1, current, true, "");
                      }
                      d++;
                    }
                    sumDayFiff--;
                  }
                  for (a; a < this.segment - sumDayFiff; a++) {
                    sheduleArray[a - 1] = new Schedule("", 'FREE', new Date(), new Date(), "", "", "", 1, datesArray[d + 1], true, "");
                    d++;
                  }
                  this.data[i].rooms[j].reservations = sheduleArray;
                } else {
                  for (var f = 0; f < this.segment - 1; f++) {
                    this.data[i].rooms[j].reservations[f] = new Schedule("", 'FREE', new Date(), new Date(), "", "", "", 1, datesArray[f], true, "");
                  }
                }
              }
            }
          }
        } else {
          this.data = [];
          this.toastr.error(data.message);
        }
      });
  }
  filterRezervation() {
    console.log("filterRezervation", this.dateFrom, this.dateTo);
    this.segment = Math.round(Math.abs((this.dateTo.getTime() - this.dateFrom.getTime()) / (24 * 60 * 60 * 1000)));
    this.fillDataRange();
  }
  closeRezervation() {
    this.showReservation = false;
    this.showReservationPayment = false;
  }
  openReservationForm(isReservation: boolean, room_no: String, starDate: Date, endDate: Date, currentDate: Date, status: string, category: string, reservation_id: string) {
    if (isReservation) {
      this.showReservation = true;
      this.showReservationPayment = false;
      starDate = new Date(this.intl.formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), (currentDate.getDate() - 2)), 'yyyy-MM-dd'));
      endDate = new Date(this.intl.formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), (currentDate.getDate() + 1)), 'yyyy-MM-dd'));

      this.reservationService.getCategory(this.brSelectedValue).subscribe(data => {
        this.category = data.json().category;
        for (var i = 0; i < this.category.length; i++) {
          if (this.category[i].id.toString() == category) {
            this.reservationService.getRoom(this.brSelectedValue, this.category[i].id.toString()).subscribe(data => {
              this.reservationInfo.reservation.reservationDetail[0] = new ReservationDetail(null, null, null, null, null, room_no,
                starDate, endDate, category, null, null, null, data.json().room, false, false, true);
            });
          }
        }
        this.reservationService.getService(this.brSelectedValue).subscribe(data => {
          this.serviceData = data.json().service;
        });
      });
    } else {
      this.showReservation = false;
      this.showReservationPayment = true;

      this.reservationService.getCategory(this.brSelectedValue).subscribe(data => {
        this.category = data.json().category;
        this.reservationService.getRoom(this.brSelectedValue, null).subscribe(data => {
          this.room = data.json().room;
        });
        this.reservationService.getService(this.brSelectedValue).subscribe(data => {
          this.serviceData = data.json().service;
          this.getReservationByIdLocal(reservation_id);
        });
      });
    }
  }
  addReservation() {
    var size = this.reservationInfo.reservation.reservationDetail.length;
    this.reservationInfo.reservation.reservationDetail[size] = new ReservationDetail(null, null, null, null, null, null, new Date(), new Date(), null, null, [new ReservationPerson('', '', '', false)], null, null, false, false, true);
  }
  addReservationToExisting() {
    var size = this.reservationInfoEdit.reservation.reservationDetail.length;
    this.reservationInfoEdit.reservation.reservationDetail[size] = new ReservationDetail(null, null, null, null, null, null, new Date(), new Date(), null, null, null, null, null, true, true, false);
  }
  removeReservation(id: ReservationDetail) {
    var index = this.reservationInfo.reservation.reservationDetail.indexOf(id, 0);
    if (index > -1) {
      this.reservationInfo.reservation.reservationDetail.splice(index, 1);
    }
  }
  removeReservationExisting(id: ReservationDetail) {
    if (id.id != null) {
      this.reservationService.deleteReservation(id.id, this.brSelectedValue.toString()).subscribe(data => {
        console.log("del", data);
        if (data.json().success === true) {
          var index = this.reservationInfoEdit.reservation.reservationDetail.indexOf(id, 0);
          if (index > -1) {
            this.reservationInfoEdit.reservation.reservationDetail.splice(index, 1);
          }
          this.fillDataRange();
          this.showReservation = false;
          this.showReservationPayment = false;
          this.toastr.success("Reservation deleted");
        } else {
          this.toastr.error(data.json().message);
        }
      })
    } else {
      var index = this.reservationInfoEdit.reservation.reservationDetail.indexOf(id, 0);
      if (index > -1) {
        this.reservationInfoEdit.reservation.reservationDetail.splice(index, 1);
      }
    }

  }

  removeReservationPerson(id: ReservationDetail, person: ReservationPerson) {
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
    this.reservationService.deleteReservationPerson(id.id, person.person_id, this.brSelectedValue.toString()).subscribe(data => {
      if (data.json().success === true) {
        var index = this.reservationInfoEdit.reservation.reservationDetail.indexOf(id, 0);
        if (index > -1) {
          var indexPerson = this.reservationInfoEdit.reservation.reservationDetail[index].reservationPerson.indexOf(person, 0);
          if (indexPerson > -1) {
            this.reservationInfoEdit.reservation.reservationDetail[index].reservationPerson.splice(indexPerson, 1);
          }
        }
        this.toastr.success("Reservation person deleted");
      } else {
        this.toastr.error(data.json().message);
      }
    })
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
    if (service.service_id != null) {
      this.reservationService.deleteReservationService(id.id, service.service_id, this.brSelectedValue.toString()).subscribe(data => {
        if (data.json().success === true) {
          var index = this.reservationInfoEdit.reservation.reservationDetail.indexOf(id, 0);
          if (index > -1) {
            var indexPerson = this.reservationInfoEdit.reservation.reservationDetail[index].reservationService.indexOf(service, 0);
            if (indexPerson > -1) {
              this.reservationInfoEdit.reservation.reservationDetail[index].reservationService.splice(indexPerson, 1);
            }
          }
          this.toastr.success("Reservation service deleted");
          this.getReservationByIdLocal(id.reservation_id.toString());
        } else {
          this.toastr.error(data.json().message);
        }
      })
    } else {
      var index = this.reservationInfoEdit.reservation.reservationDetail.indexOf(id, 0);
      if (index > -1) {
        var indexPerson = this.reservationInfoEdit.reservation.reservationDetail[index].reservationService.indexOf(service, 0);
        if (indexPerson > -1) {
          this.reservationInfoEdit.reservation.reservationDetail[index].reservationService.splice(indexPerson, 1);
        }
      }
    }
  }
  showDetails(id: ReservationDetail) {
    id.showMoreInfo = true;
    var index = this.reservationInfo.reservation.reservationDetail.indexOf(id, 0);

    if (id.reservationService === null) {
      var temp = new ReservationServices(null, '', '', '', null, null, false);
      id.reservationService = [temp];
    } else {
      var personList = this.reservationInfo.reservation.reservationDetail[index];
    }
    if (id.reservationPerson === null) {
      var tempPerson = new ReservationPerson('', '', '', false);
      id.reservationPerson = [tempPerson];
    } else {
      var personList = this.reservationInfo.reservation.reservationDetail[index];
    }
  }
  showDetailsEdit(id: ReservationDetail) {
    id.showMoreInfo = true;
  }

  updateReservation(id: ReservationDetail) {
    console.log(id.id);
    if (id.status_id == "1") {
      this.reservationService.updateReservation(id.id, "2", this.brSelectedValue.toString()).subscribe(data => {
        if (data.json().success === true) {
          id.status_id = "2";
          id.status_name = "CHECK_IN";
          this.fillDataRange();
          this.toastr.success("Reservation status change : RESERVED TO CHECK-IN");
        } else {
          this.toastr.error(data.json().message);
        }
      });
    } else if (id.status_id == "2") {
      if (id.payment_status == "3") {
        this.reservationService.updateReservation(id.id, "3", this.brSelectedValue.toString()).subscribe(data => {
          if (data.json().success === true) {
            id.status_id = "4";
            id.status_name = "CHECKED_OUT";
            this.fillDataRange();
            this.toastr.success("Reservation status change : CHECK-IN TO CHECK-OUT");
          } else {
            this.toastr.error(data.json().message);
          }
        });
      } else if (id.payment_status == "2") {
        this.toastr.error('Reservation is payd partly');
      } else {
        this.toastr.error('Reservation is not payd');
      }
    } else {
      this.toastr.error('Check In First');
    }
  }
  updateAllReservation() {
    console.log("updateAllReservation", JSON.stringify(this.reservationInfoEdit));

  }
  //ADD PERSON and service
  addPersonToReservationPerson(id: ReservationDetail) {
    console.log("addPersonToReservationPerson", id);
    var size = id.reservationPerson.length;
    var p = new ReservationPerson('', '', '', false);
    id.reservationPerson[size] = p;
  }
  addServiceToReservationService(id: ReservationDetail) {
    console.log("addServiceToReservationService", id);

    var size = id.reservationService.length;
    var p = new ReservationServices(null, '', '', '', null, null, false);
    id.reservationService[size] = p;

  }
  saveReservationReserve(id: ReservationDetail, reservationId: number) {
    console.log("saveReservationReserve", JSON.stringify(id), reservationId);
    id.status_id = "1";
    if (id.reservationService != null) {
      for (var i = 0; i < id.reservationService.length; i++) {
        id.reservationService[i].payment_status = "1";
      }
    }
    this.reservationService.addReservationToExsting(id, reservationId, this.brSelectedValue.toString()).subscribe(data => {
      console.log(data);
      if (data.json().success === true) {
        id.id = data.json().data;
        var index = this.reservationInfoEdit.reservation.reservationDetail.indexOf(id, 0);
        if (index > -1) {
          this.reservationInfoEdit.reservation.reservationDetail[index] = id;
        }
        this.toastr.success("Reservation Added");
        id.showCheckInButton = false;
        id.showReserveButton = false;
        id.showPaymentCheckInButton = true;
        this.fillDataRange();
        this.getReservationByIdLocal(reservationId.toString());
      } else {
        this.toastr.error(data.json().message + " " + data.json().error);
      }
    });
  }
  saveReservationCheckIn(id: ReservationDetail, reservationId: number) {
    console.log("saveReservationCheckIn", JSON.stringify(id), reservationId);
    id.status_id = "2";
    for (var i = 0; i < id.reservationService.length; i++) {
      id.reservationService[i].payment_status = "1";
    }
    this.reservationService.addReservationToExsting(id, reservationId, this.brSelectedValue.toString()).subscribe(data => {
      if (data.success === true) {
        id.id = data.json().data;
        var index = this.reservationInfoEdit.reservation.reservationDetail.indexOf(id, 0);
        if (index > -1) {
          this.reservationInfoEdit.reservation.reservationDetail[index] = id;
        }
        this.toastr.success("Reservation Added");
        id.showCheckInButton = false;
        id.showReserveButton = false;
        id.showPaymentCheckInButton = true;
        this.fillDataRange();
      } else {
        this.toastr.error(data.message);
      }
    });
  }

  addPersonToReservationPersonExisting(id: ReservationDetail) {
    console.log("addPersonToReservationPersonExisting", id);
    var index = this.reservationInfoEdit.reservation.reservationDetail.indexOf(id, 0);
    if (id.reservationPerson) {
      var size = id.reservationPerson.length;
      this.reservationInfoEdit.reservation.reservationDetail[index].reservationPerson[size] = new ReservationPerson('', '', '', true);
    } else {
      var temp = new ReservationPerson('', '', '', true);
      id.reservationPerson = [temp];
      this.reservationInfoEdit.reservation.reservationDetail[index] = id;
    }
  }
  addServiceToReservationServiceExisting(id: ReservationDetail) {
    console.log("addServiceToReservationServiceExisting", id);
    var index = this.reservationInfoEdit.reservation.reservationDetail.indexOf(id, 0);
    if (id.reservationService) {
      var size = id.reservationService.length;
      this.reservationInfoEdit.reservation.reservationDetail[index].reservationService[size] = new ReservationServices(null, '', '', '', null, null, true);
    } else {
      var temp = new ReservationServices(null, '', '', '', null, null, true);
      id.reservationService = [temp];
      this.reservationInfoEdit.reservation.reservationDetail[index] = id;
    }


  }
  reserve() {
    var isValid = this.validateReservationInfo(this.reservationInfo);
    if (isValid) {
      for (var i = 0; i < this.reservationInfo.reservation.reservationDetail.length; i++) {
        this.reservationInfo.reservation.reservationDetail[i].status_id = "1";
        this.reservationInfo.reservation.reservationDetail[i].payment_status = "1";
        if (this.reservationInfo.reservation.reservationDetail[i].reservationService != null) {
          for (var j = 0; j < this.reservationInfo.reservation.reservationDetail[i].reservationService.length; j++) {
            this.reservationInfo.reservation.reservationDetail[i].reservationService[j].payment_status = "1";
          }
        }
      }
      this.reservationService.addReservation(this.reservationInfo, this.brSelectedValue.toString()).subscribe(data => {
        if (data.json().success === true) {
          this.toastr.success("Reservation Added");
          this.fillDataRange();
        } else {
          this.toastr.error(data.json().message + " " + data.json().error);
        }
      });
    }
  }
  checkin() {
    var isValid = this.validateReservationInfo(this.reservationInfo);
    if (isValid) {
      for (var i = 0; i < this.reservationInfo.reservation.reservationDetail.length; i++) {
        this.reservationInfo.reservation.reservationDetail[i].status_id = "2";
        this.reservationInfo.reservation.reservationDetail[i].payment_status = "1";
        if (this.reservationInfo.reservation.reservationDetail[i].reservationService != null) {
          for (var j = 0; j < this.reservationInfo.reservation.reservationDetail[i].reservationService.length; j++) {
            this.reservationInfo.reservation.reservationDetail[i].reservationService[j].payment_status = "1";
          }
        }
      }
      this.reservationService.addReservation(this.reservationInfo, this.brSelectedValue.toString()).subscribe(data => {
        if (data.success === true) {
          this.toastr.success("Reservation Added");
          this.fillDataRange();
        } else {
          this.toastr.error(data.json().message + " " + data.json().error);
        }
      });
    }
  }
  validateReservationInfo(reservationInfo: ReservationInfo) {
    console.log("Start validate reservationInfo", reservationInfo);
    var isValid = true;
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(reservationInfo.person.email)) {
      this.toastr.error("Invalid Mail " + reservationInfo.person.email);
      isValid = false;
    }
    if (!/^[-+]?\d{9,13}$/.test(reservationInfo.person.phone)) {
      this.toastr.error("Invalid Phone " + reservationInfo.person.phone);
      isValid = false;
    }
    if (!/^.{9,11}$/.test(reservationInfo.person.personal_no)) {
      this.toastr.error("Invalid Passport # " + reservationInfo.person.personal_no);
      isValid = false;
    }
    if (!/^.{1,50}$/.test(reservationInfo.person.first_name)) {
      this.toastr.error("Invalid Name " + reservationInfo.person.first_name);
      isValid = false;
    }
    if (!/^.{1,50}$/.test(reservationInfo.person.last_name)) {
      this.toastr.error("Invalid Surname " + reservationInfo.person.last_name);
      isValid = false;
    }
    if (reservationInfo.reservation.reservationDetail.length > 0) {
      for (let i = 0; i < reservationInfo.reservation.reservationDetail.length; i++) {
        if (reservationInfo.reservation.reservationDetail[i].reservationPerson != null &&
          reservationInfo.reservation.reservationDetail[i].reservationPerson.length > 0) {
          for (let j = 0; j < reservationInfo.reservation.reservationDetail[i].reservationPerson.length; j++) {
            if (!/^.{9,11}$/.test(reservationInfo.reservation.reservationDetail[i].reservationPerson[j].person_id)) {
              this.toastr.error("Invalid Guest Passport # " +
                reservationInfo.reservation.reservationDetail[i].reservationPerson[j].person_id);
              isValid = false;
            }
            if (!/^.{1,50}$/.test(reservationInfo.reservation.reservationDetail[i].reservationPerson[j].first_name)) {
              this.toastr.error("Invalid Guest Name " + reservationInfo.reservation.reservationDetail[i].reservationPerson[j].first_name);
              isValid = false;
            }
            if (!/^.{1,50}$/.test(reservationInfo.reservation.reservationDetail[i].reservationPerson[j].last_name)) {
              this.toastr.error("Invalid Guest Surname " + reservationInfo.reservation.reservationDetail[i].reservationPerson[j].last_name);
              isValid = false;
            }
          }
        }
      }
    }

    return isValid;
  }
  showPaymentInfo(reservation: ReservationDetail) {
    console.log("showPaymentInfo", reservation);
    reservation.expandPayment = true;
  }

  public handleChangeStartDate(value: Date, index: number) {
    this.reservationInfo.reservation.reservationDetail[index].start_date = new Date(this.intl.formatDate(value, 'yyyy-MM-dd'));

  }

  public handleChangeEndDate(value: Date, index: number) {
    this.reservationInfo.reservation.reservationDetail[index].end_date = new Date(this.intl.formatDate(value, 'yyyy-MM-dd'));
  }
  public handleChangeStartDateEdit(value: Date, index: number) {
    this.reservationInfoEdit.reservation.reservationDetail[index].start_date = new Date(this.intl.formatDate(value, 'yyyy-MM-dd'));
  }

  public handleChangeEndDateEdit(value: Date, index: number) {
    this.reservationInfoEdit.reservation.reservationDetail[index].end_date = new Date(this.intl.formatDate(value, 'yyyy-MM-dd'));
  }

  saveReservationPerson(person: ReservationPerson, id: number) {
    console.log("saveReservationPerson", person, id);
    this.reservationService.addReservationPersonToExstingReservation(person, id, this.brSelectedValue.toString()).subscribe(data => {
      if (data.json().success === true) {
        person.showSave = false;
        this.toastr.success("Reservation Person Added");
        this.getReservationByIdLocal(id.toString());
      } else {
        this.toastr.error(data.json().message + " " + data.json().error);
      }
    });

  }
  saveReservationService(service: ReservationServices, reservationDetailId: number, reservationId: number) {
    console.log("saveReservationService", service, reservationDetailId, reservationId);
    this.reservationService.addReservationServiceToExstingReservation(service, reservationDetailId, this.brSelectedValue.toString()).subscribe(data => {
      if (data.json().success === true) {
        service.showSave = false;
        this.toastr.success("Reservation Service Added");
        this.getReservationByIdLocal(reservationId.toString());
      } else {
        this.toastr.error(data.json().message + " " + data.json().error);
      }
    });
  }

  public generateInvoise(res: ReservationDetail) {
    console.log("generateInvoise", JSON.stringify(res));
    var doc = new jsPDF();
    doc.text(20, 20, 'Hotel Managment System');
    doc.text(20, 40, 'Reservation Prise : ' + res.reservation_prise_full);
    doc.text(20, 50, 'Extra Person Prise : ' + res.extra_person_price_full);
    doc.text(20, 60, 'Additional Bad Prise : ' + res.additional_bad_price_full);
    doc.text(20, 70, 'Service Prise : ' + res.service_price);

    doc.text(20, 90, 'Prise Full: ' + (res.service_price + res.price_full));
    doc.text(20, 100, 'Amount To Pay: ' + ((res.price_full + res.service_price) - (res.reservation_payd_amount + res.service_payd_amount)));
    doc.text(20, 110, 'Payd Full: ' + res.reservation_payd_amount);
    // Save the PDF
    doc.save(res.id.toString() + '-invoice.pdf');
  }
  paymentReservation(id: ReservationDetail, pay: Payment) {
    if (id.payment_status == "3") {
      this.toastr.error("Reservationis already payed");
    } else {
      if (pay.source == "RESERVATION") {
        var p = new Payment(id.id, id.id, pay.price_full, new Date(), pay.pay_type, 'RESERVATION', pay.receipt, pay.additional_comment, null, null, pay.additional_bad_price, pay.extra_person_price, null, null, null, null);
        this.reservationService.addPaymentToReservation(p, this.brSelectedValue.toString()).then(data => {
          if (data.success === true) {
            this.toastr.success("Payment Added");
            this.getReservationByIdLocal(id.reservation_id.toString());
          } else {
            this.toastr.error(data.error);
          }
        });
      } else if (pay.source == "SERVICE") {
        var p = new Payment(id.id, id.id, pay.price_full, new Date(), pay.pay_type, 'SERVICE', pay.receipt, pay.additional_comment, pay.service_id, null, null, null, null, null, null, null);
        this.reservationService.addPaymentToService(p, this.brSelectedValue.toString()).then(data => {
          if (data.success === true) {
            this.toastr.success("Payment Added");
            this.getReservationByIdLocal(id.reservation_id.toString());
          } else {
            this.toastr.error(data.error);
          }
        });
      }
    }
  }
  paymentReservationAll(id: ReservationDetail, pay: Payment) {
    if (id.payment_status == "3") {
      this.toastr.error("Reservationis already payed");
    } else {
      let roomPromises = id.availablePayments.map(payment => {
        console.log("MAP", payment);
        if (payment.source == "RESERVATION") {
          var p = new Payment(id.id, id.id, payment.price_full, new Date(), id.pay_type, 'RESERVATION', id.receipt, id.paymentComment,
            null, null, payment.additional_bad_price, payment.extra_person_price, null, null, null, null);
          this.reservationService.addPaymentToReservation(p, this.brSelectedValue.toString()).then(data => {
            return data;
          });
        } else if (payment.source == "SERVICE") {
          var p = new Payment(id.id, id.id, payment.price_full, new Date(), id.pay_type, 'SERVICE', id.receipt, id.paymentComment, payment.service_id,
            null, null, null, null, null, null, null);
          this.reservationService.addPaymentToService(p, this.brSelectedValue.toString()).then(data => {
            return data;
          });
        }
      });
      Promise.all(roomPromises).then(data => {
        this.getReservationByIdLocal(id.reservation_id.toString());
      }).catch(error => {
        this.toastr.error(error);
      });
    }

  }
  public getReservationByIdLocal(id: String) {
    console.log("getReservationByIdLocal", id);
    this.reservationService.getReservationById(id, this.brSelectedValue.toString()).then(data => {
      if (data.success === true) {
        this.reservationInfoEdit = data.data;
        for (var i = 0; i < this.reservationInfoEdit.reservation.reservationDetail.length; i++) {
          var paymentList = Array<Payment>();
          var p1 = new Payment(null, null, null, new Date(), null, 'RESERVATION', null, 'comment', null,
            this.reservationInfoEdit.reservation.reservationDetail[i].reservation_prise_full,
            this.reservationInfoEdit.reservation.reservationDetail[i].additional_bad_price_full,
            this.reservationInfoEdit.reservation.reservationDetail[i].extra_person_price_full,
            this.reservationInfoEdit.reservation.reservationDetail[i].day_count,
            this.reservationInfoEdit.reservation.reservationDetail[i].reservation_payd_amount,
            ((this.reservationInfoEdit.reservation.reservationDetail[i].reservation_prise_full +
              this.reservationInfoEdit.reservation.reservationDetail[i].additional_bad_price_full +
              this.reservationInfoEdit.reservation.reservationDetail[i].extra_person_price_full) -
              this.reservationInfoEdit.reservation.reservationDetail[i].reservation_payd_amount), null);
          paymentList.push(p1);

          var sd = new Date(this.intl.formatDate(this.reservationInfoEdit.reservation.reservationDetail[i].start_date, 'yyyy-MM-dd'));
          var ed = new Date(this.intl.formatDate(this.reservationInfoEdit.reservation.reservationDetail[i].end_date, 'yyyy-MM-dd'));

          this.reservationInfoEdit.reservation.reservationDetail[i].start_date = sd;
          this.reservationInfoEdit.reservation.reservationDetail[i].end_date = ed;
          this.reservationInfoEdit.reservation.reservationDetail[i].showMoreInfo = true;
          this.reservationInfoEdit.reservation.reservationDetail[i].expandPayment = true;
          this.reservationInfoEdit.reservation.reservationDetail[i].showPaymentCheckInButton = true;
          this.reservationInfoEdit.reservation.reservationDetail[i].amount_full = (this.reservationInfoEdit.reservation.reservationDetail[i].price_full + this.reservationInfoEdit.reservation.reservationDetail[i].service_price) - (this.reservationInfoEdit.reservation.reservationDetail[i].reservation_payd_amount + this.reservationInfoEdit.reservation.reservationDetail[i].service_payd_amount);
          this.reservationInfoEdit.reservation.reservationDetail[i].room = this.room;
          for (var j = 0; j < this.reservationInfoEdit.reservation.reservationDetail[i].reservationService.length; j++) {
            var p2 = new Payment(null, null, null, new Date(), null, 'SERVICE', null, 'comment',
              this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].service_id, (this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].price -
                this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].service_payd), null, null, null,
              this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].service_payd,
              (this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].price -
                this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].service_payd),
              this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].service_name);
            paymentList.push(p2);
          }
          this.reservationInfoEdit.reservation.reservationDetail[i].availablePayments = paymentList;
        }
        console.log("ReservationInfoEdit", JSON.stringify(this.reservationInfoEdit));
      } else {
        this.toastr.error(data.message);
      }
    });
  }
}
