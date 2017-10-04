import { ReservationService } from './reservation.service';
import { ToastModule, ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, ViewContainerRef, enableProdMode } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import * as moment from 'moment';
import { ReservationInfo, Person, ReservationDetail, Reservation, Schedule, ReservationPerson, ReservationServices, Payment } from './model';
import { AuthService } from './../core/auth.service';
import { Category } from '../category/model.js';
import { Service } from '../service/model.js';
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

  public userBranch: Array<any>;
  public brSelectedValue: number;

  public reservationInfoEdit: ReservationInfo;

  constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private reservationService: ReservationService, private authservice: AuthService, private intl: IntlService) {
    this.toastr.setRootViewContainerRef(vcr);
    this.dateTo = new Date();
    this.dateFrom = new Date();
    this.dateFrom.setDate(this.dateTo.getDate() - 5);
    this.dateTo.setDate(this.dateFrom.getDate() + 30)

    this.reservationInfo = new ReservationInfo(new Person(null, null, '', '', '', '', '', new Date(), ''), new Reservation(null, null, null, null, null, [new ReservationDetail(null, null, null, null, null, null, null, null, null, [], [], null, false, false, true)]));
  }
  ngOnInit() {
    this.reservationService.getUserBranch(this.authservice.getUserID()).subscribe(data => {
      if (data.json().success === true) {
        this.userBranch = data.json().branch;
        this.brSelectedValue = this.userBranch[0].id
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
  public categoryValueChange(value: any, reservation: ReservationDetail): void {
    this.reservationService.getRoom(this.brSelectedValue, value).subscribe(data => {
      reservation.room = data.json().room;
    });
  }
  public categoryValueChangeEdit(value: any, reservation: ReservationDetail): void {
    console.log("categoryValueChangeEdit");
    this.reservationService.getRoom(this.brSelectedValue, value).subscribe(data => {
      reservation.room = data.json().room;
    });
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
              for (var f = 0; f < this.segment - 1; f++) {
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
    if (isReservation) {
      this.showReservation = true;
      this.showReservationPayment = false;
      starDate = new Date();
      endDate = new Date();

      this.reservationService.getCategory(this.brSelectedValue).subscribe(data => {
        this.category = data.json().category;

        this.reservationService.getService(this.brSelectedValue).subscribe(data => {
          this.serviceData = data.json().service;
        });
      });
      this.reservationInfo.reservation.reservationDetail[0] = new ReservationDetail(null, null, null, null, null, null, starDate, endDate, null, null, null, null, false, false, true);
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
        });
      });


      this.reservationService.getReservationById(reservation_id).then(data => {
        console.log(JSON.stringify(data.data));
        if (data.success === true) {
          this.reservationInfoEdit = data.data;
          for (var i = 0; i < this.reservationInfoEdit.reservation.reservationDetail.length; i++) {
            var sd = new Date(this.intl.formatDate(this.reservationInfoEdit.reservation.reservationDetail[i].start_date, 'yyyy-MM-dd'));
            var ed = new Date(this.intl.formatDate(this.reservationInfoEdit.reservation.reservationDetail[i].end_date, 'yyyy-MM-dd'));

            this.reservationInfoEdit.reservation.reservationDetail[i].start_date = sd;
            this.reservationInfoEdit.reservation.reservationDetail[i].end_date = ed;
            this.reservationInfoEdit.reservation.reservationDetail[i].expandPerson = true;
            this.reservationInfoEdit.reservation.reservationDetail[i].expandService = true;
            this.reservationInfoEdit.reservation.reservationDetail[i].showPaymentCheckInButton = true;
            this.reservationInfoEdit.reservation.reservationDetail[i].amount_full = (this.reservationInfoEdit.reservation.reservationDetail[i].price_full + this.reservationInfoEdit.reservation.reservationDetail[i].service_price) - (this.reservationInfoEdit.reservation.reservationDetail[i].reservation_payd_amount + this.reservationInfoEdit.reservation.reservationDetail[i].service_payd_amount);
            for (var j = 0; j < this.reservationInfoEdit.reservation.reservationDetail[i].reservationService.length; j++) {
              this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].amount_full = this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].price - this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].service_payd;
            }
          }
        } else {
          this.toastr.error(data.message);
        }
      });
    }
  }
  addReservation() {
    var size = this.reservationInfo.reservation.reservationDetail.length;
    this.reservationInfo.reservation.reservationDetail[size] = new ReservationDetail(null, null, null, null, null, null, new Date(), new Date(), null, [new ReservationPerson('', '', '', false)], null, null, false, false, true);
  }
  addReservationToExisting() {
    var size = this.reservationInfoEdit.reservation.reservationDetail.length;
    this.reservationInfoEdit.reservation.reservationDetail[size] = new ReservationDetail(null, null, null, null, null, null, new Date(), new Date(), null, null, null, null, true, true, false);
  }
  removeReservation(id: ReservationDetail) {
    var index = this.reservationInfo.reservation.reservationDetail.indexOf(id, 0);
    if (index > -1) {
      this.reservationInfo.reservation.reservationDetail.splice(index, 1);
    }
  }
  removeReservationExisting(id: ReservationDetail) {
    console.log("removeReservationExisting", id);
    if (id.id != null) {
      this.reservationService.deleteReservation(id.id).subscribe(data => {
        if (data.json().success === true) {
          var index = this.reservationInfoEdit.reservation.reservationDetail.indexOf(id, 0);
          if (index > -1) {
            this.reservationInfoEdit.reservation.reservationDetail.splice(index, 1);
          }
          this.fillDataRange();
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
    this.reservationService.deleteReservationPerson(id.id, person.person_id).subscribe(data => {
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
    console.log("removeReservationServiceExisting");
    this.reservationService.deleteReservationService(id.id, service.service_id).subscribe(data => {
      if (data.json().success === true) {
        var index = this.reservationInfoEdit.reservation.reservationDetail.indexOf(id, 0);
        if (index > -1) {
          var indexPerson = this.reservationInfoEdit.reservation.reservationDetail[index].reservationService.indexOf(service, 0);
          if (indexPerson > -1) {
            this.reservationInfoEdit.reservation.reservationDetail[index].reservationService.splice(indexPerson, 1);
          }
        }
        this.toastr.success("Reservation service deleted");
      } else {
        this.toastr.error(data.json().message);
      }
    })


  }
  addService(id: ReservationDetail) {
    id.expandService = true;
    var index = this.reservationInfo.reservation.reservationDetail.indexOf(id, 0);
    if (id.reservationService === null) {
      var temp = new ReservationServices(null, '', '', '', null, null, false);
      id.reservationService = [temp];
    } else {
      var personList = this.reservationInfo.reservation.reservationDetail[index];
    }

  }
  addPerson(id: ReservationDetail) {
    id.expandPerson = true;
    var index = this.reservationInfo.reservation.reservationDetail.indexOf(id, 0);
    if (id.reservationPerson === null) {
      var temp = new ReservationPerson('', '', '', false);
      id.reservationPerson = [temp];
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
    console.log(id.id);
    if (id.status_id == "1") {
      this.reservationService.updateReservation(id.id, "2").subscribe(data => {
        if (data.json().success === true) {
          id.status_id = "2";
          this.fillDataRange();
          this.toastr.success("Reservation status change : RESERVED TO CHECK-IN");
        } else {
          this.toastr.error(data.json().message);
        }
      });
    } else if (id.status_id == "2") {
      if (id.payment_status == "3") {
        this.reservationService.updateReservation(id.id, "3").subscribe(data => {
          if (data.json().success === true) {
            id.status_id = "4";
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
  paymentReservationAll() {
    console.log("paymentReservationAll", JSON.stringify(this.reservationInfo));

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
    this.reservationService.addReservationToExsting(id, reservationId).subscribe(data => {
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
      } else {
        this.toastr.error(data.json().message);
      }
    });
  }
  saveReservationCheckIn(id: ReservationDetail, reservationId: number) {
    console.log("saveReservationCheckIn", JSON.stringify(id), reservationId);
    id.status_id = "2";
    this.reservationService.addReservationToExsting(id, reservationId).subscribe(data => {
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
      } else {
        this.toastr.error(data.json().message);
      }
    });
  }
  //========================================
  //ADD PERSON AND SERVICE EXISTING
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
  //========================================
  reserve() {
    console.log(JSON.stringify(this.reservationInfo));
    for (var i = 0; i < this.reservationInfo.reservation.reservationDetail.length; i++) {
      this.reservationInfo.reservation.reservationDetail[i].status_id = "1";
      this.reservationInfo.reservation.reservationDetail[i].payment_status = "1";
      for (var j = 0; j < this.reservationInfo.reservation.reservationDetail[i].reservationService.length; j++) {
        this.reservationInfo.reservation.reservationDetail[i].reservationService[j].payment_status = "1";
      }
    }
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
  checkin() {
    console.log(JSON.stringify(this.reservationInfo));
    for (var i = 0; i < this.reservationInfo.reservation.reservationDetail.length; i++) {
      this.reservationInfo.reservation.reservationDetail[i].status_id = "2";
      this.reservationInfo.reservation.reservationDetail[i].payment_status = "1";
      for (var j = 0; j < this.reservationInfo.reservation.reservationDetail[i].reservationService.length; j++) {
        this.reservationInfo.reservation.reservationDetail[i].reservationService[j].payment_status = "1";
      }
    }
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
  showPaymentInfo(reservation: ReservationDetail) {
    console.log("showPaymentInfo", reservation);
    reservation.expandPayment = true;
  }
  public showServicePaymentInfo(services: ReservationServices) {
    console.log("showServicePaymentInfo", services);
    services.expandPayment = true;
  }


  public payReservation(res: ReservationDetail) {
    console.log("payReservation", res);
    var p = new Payment(res.id, res.id, res.amount_full, new Date(), res.pay_type, 'RESERVATION', 'ticket test', 'additional_comment test', null);

    this.reservationService.addPaymentToReservation(p).subscribe(data => {
      console.log("addPaymentToReservation", data.json(), data.json().success);
      if (data.json().success === true) {
        this.toastr.success("Payment Added");

        this.reservationService.getReservationById(res.reservation_id.toString()).then(data => {
          if (data.success === true) {
            this.reservationInfoEdit = data.data;
            for (var i = 0; i < this.reservationInfoEdit.reservation.reservationDetail.length; i++) {
              var sd = new Date(this.intl.formatDate(this.reservationInfoEdit.reservation.reservationDetail[i].start_date, 'yyyy-MM-dd'));
              var ed = new Date(this.intl.formatDate(this.reservationInfoEdit.reservation.reservationDetail[i].end_date, 'yyyy-MM-dd'));

              this.reservationInfoEdit.reservation.reservationDetail[i].start_date = sd;
              this.reservationInfoEdit.reservation.reservationDetail[i].end_date = ed;
              this.reservationInfoEdit.reservation.reservationDetail[i].expandPerson = true;
              this.reservationInfoEdit.reservation.reservationDetail[i].expandService = true;
              this.reservationInfoEdit.reservation.reservationDetail[i].expandPayment = true;
              this.reservationInfoEdit.reservation.reservationDetail[i].showPaymentCheckInButton = true;
              this.reservationInfoEdit.reservation.reservationDetail[i].amount_full = (this.reservationInfoEdit.reservation.reservationDetail[i].price_full + this.reservationInfoEdit.reservation.reservationDetail[i].service_price) - (this.reservationInfoEdit.reservation.reservationDetail[i].reservation_payd_amount + this.reservationInfoEdit.reservation.reservationDetail[i].service_payd_amount);
              for (var j = 0; j < this.reservationInfoEdit.reservation.reservationDetail[i].reservationService.length; j++) {
                this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].amount_full = this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].price - this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].service_payd;
              }
            }
          } else {
            this.toastr.error(data.message);
          }
        });


      } else {
        this.toastr.error(data.json().error);
      }
    });

  }

  public payService(res: ReservationServices) {
    console.log("payService", res);
    var p = new Payment(res.reservation_id, res.reservation_id, res.amount_full, new Date(), res.pay_type, 'SERVICE', 'SERVICE test', 'SERVICE additional_comment test', res.service_id);

    this.reservationService.addPaymentToService(p).subscribe(data => {
      console.log("addPaymentToReservationService", data.json(), data.json().success);
      if (data.json().success === true) {
        this.toastr.success("Service Payment Added");

        this.reservationService.getReservationById(res.reservation_id.toString()).then(data => {
          if (data.success === true) {
            this.reservationInfoEdit = data.data;
            for (var i = 0; i < this.reservationInfoEdit.reservation.reservationDetail.length; i++) {
              var sd = new Date(this.intl.formatDate(this.reservationInfoEdit.reservation.reservationDetail[i].start_date, 'yyyy-MM-dd'));
              var ed = new Date(this.intl.formatDate(this.reservationInfoEdit.reservation.reservationDetail[i].end_date, 'yyyy-MM-dd'));

              this.reservationInfoEdit.reservation.reservationDetail[i].start_date = sd;
              this.reservationInfoEdit.reservation.reservationDetail[i].end_date = ed;
              this.reservationInfoEdit.reservation.reservationDetail[i].expandPerson = true;
              this.reservationInfoEdit.reservation.reservationDetail[i].expandService = true;
              this.reservationInfoEdit.reservation.reservationDetail[i].expandPayment = true;
              this.reservationInfoEdit.reservation.reservationDetail[i].showPaymentCheckInButton = true;
              this.reservationInfoEdit.reservation.reservationDetail[i].amount_full = (this.reservationInfoEdit.reservation.reservationDetail[i].price_full + this.reservationInfoEdit.reservation.reservationDetail[i].service_price) - (this.reservationInfoEdit.reservation.reservationDetail[i].reservation_payd_amount + this.reservationInfoEdit.reservation.reservationDetail[i].service_payd_amount);
              for (var j = 0; j < this.reservationInfoEdit.reservation.reservationDetail[i].reservationService.length; j++) {
                this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].amount_full = this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].price - this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].service_payd;
              }
            }
          } else {
            this.toastr.error(data.message);
          }
        });


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


  /* valueChanged(newVal) {
     this.reservationInfo.person = newVal;
   }*/

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

  saveReservationPerson(person: ReservationPerson, id: number) {
    console.log("saveReservationPerson", person, id);

    this.reservationService.addReservationPersonToExstingReservation(person, id).subscribe(data => {
      if (data.json().success === true) {
        person.showSave = false;
        this.toastr.success("Reservation Person Added");
      } else {
        this.toastr.error(data.json().error);
      }
    });

  }
  saveReservationService(service: ReservationServices, id: number) {
    console.log("saveReservationService", service, id);
    this.reservationService.addReservationServiceToExstingReservation(service, id).subscribe(data => {
      if (data.json().success === true) {

        console.log("sss", id);
        this.reservationService.getReservationById(id.toString()).then(data => {
          console.log("Reload", data.data);
          if (data.success === true) {
            console.log("Reloaded", data.data);
            this.reservationInfoEdit = data.data;
            for (var i = 0; i < this.reservationInfoEdit.reservation.reservationDetail.length; i++) {
              var sd = new Date(this.intl.formatDate(this.reservationInfoEdit.reservation.reservationDetail[i].start_date, 'yyyy-MM-dd'));
              var ed = new Date(this.intl.formatDate(this.reservationInfoEdit.reservation.reservationDetail[i].end_date, 'yyyy-MM-dd'));

              this.reservationInfoEdit.reservation.reservationDetail[i].start_date = sd;
              this.reservationInfoEdit.reservation.reservationDetail[i].end_date = ed;
              this.reservationInfoEdit.reservation.reservationDetail[i].expandPerson = true;
              this.reservationInfoEdit.reservation.reservationDetail[i].expandService = true;
              this.reservationInfoEdit.reservation.reservationDetail[i].expandPayment = true;
              this.reservationInfoEdit.reservation.reservationDetail[i].showPaymentCheckInButton = true;
              this.reservationInfoEdit.reservation.reservationDetail[i].amount_full = (this.reservationInfoEdit.reservation.reservationDetail[i].price_full + this.reservationInfoEdit.reservation.reservationDetail[i].service_price) - (this.reservationInfoEdit.reservation.reservationDetail[i].reservation_payd_amount + this.reservationInfoEdit.reservation.reservationDetail[i].service_payd_amount);
              for (var j = 0; j < this.reservationInfoEdit.reservation.reservationDetail[i].reservationService.length; j++) {
                this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].amount_full = this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].price - this.reservationInfoEdit.reservation.reservationDetail[i].reservationService[j].service_payd;
              }
            }
          } else {
            this.toastr.error(data.message);
          }
        });
        service.showSave = false;
        this.toastr.success("Reservation Service Added");
      } else {
        this.toastr.error(data.json().error);
      }
    });
  }
}