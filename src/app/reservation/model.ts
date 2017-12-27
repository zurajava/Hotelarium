import { Room } from '../room/model.js';

export class Person {
    public id: number;
    public personal_no: string;
    public first_name: string;
    public last_name: string;
    public email: string;
    public gender: string;
    public address: string;
    public birthdate: Date;
    public phone: string;
    public company: string;
    public company_name: string;
    public company_code: string;


    constructor(id: number, personal_no: string, first_name: string, last_name: string, email: string, gender: string, address: string, birthdate: Date, phone: string) {
        this.id = id;
        this.personal_no = personal_no;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.gender = gender;
        this.address = address;
        this.birthdate = birthdate;
        this.phone = phone;
    }

}
export class Payment {
    public id: number;
    public reservation_id: number;
    public amount: number;
    public create_date: Date;
    public type: String;
    public source: String;
    public ticket: String;
    public additional_comment: String;
    public service_id: number;

    public room_prise: number;
    public additional_bad_price: number;
    public extra_person_price: number;
    public day_count: number;
    public payd_amount: number;
    public price_full: number;

    public pay_type: String;
    public receipt: String;

    constructor(id: number, reservation_id: number, amount: number, create_date: Date, type: String, source: String, ticket: String, additional_comment: String, service_id: number,
        room_prise: number, additional_bad_price: number, extra_person_price: number, day_count: number, payd_amount: number, price_full: number) {
        this.id = id;
        this.reservation_id = reservation_id;
        this.amount = amount;
        this.create_date = create_date;
        this.type = type;
        this.source = source;
        this.ticket = ticket;
        this.additional_comment = additional_comment;
        this.service_id = service_id;

        this.room_prise = room_prise;
        this.additional_bad_price = additional_bad_price;
        this.extra_person_price = extra_person_price;
        this.day_count = day_count;
        this.payd_amount = payd_amount;
        this.price_full = price_full;
    }
}
export class Reservation {
    public id: number;
    public create_date: Date;
    public update_date: Date;
    public personal_no: number;
    public status_id: string;
    public payment_status_id: string;
    public comment: string;
    public res_type: string;
    public reservationDetail: Array<ReservationDetail>;

    constructor(id: number, personal_no: number, create_date: Date, update_date: Date, status_id: string, reservationDetail: Array<ReservationDetail>) {
        this.id = id;
        this.personal_no = personal_no;
        this.create_date = create_date;
        this.update_date = update_date;
        this.status_id = status_id;
        this.reservationDetail = reservationDetail;
    }
}

export class ReservationDetail {
    public id: number;
    public reservation_id: number;
    public create_date: Date;
    public update_date: Date;
    public room_id: String;
    public room_no: number;
    public status_id: string;
    public start_date: Date;
    public end_date: Date;
    public adult: string;
    public child: string;
    public additional_bed: string;
    public payment_status: string;
    public category_id: string;
    public category_name: string;
    public extra_person: string;
    public comment: string;
    public price: number;
    public additional_bad_price: number;
    public extra_person_price: number;
    public day_count: number;
    public reservation_prise_full: number;
    public additional_bad_price_full: number;
    public extra_person_price_full: number;
    public price_full: number;
    public reservation_payd_amount: number;
    public service_payd_amount: number;
    public service_price: number;

    public status_name:string;
    public payment_status_name:string;

    public pay_type: string;
    public receipt: string;
    public paymentComment:string;
    public amount_full: number;

    public showMoreInfo: boolean = false;
    public expandPayment: boolean = false;
    public showReserveButton: boolean = false;
    public showCheckInButton: boolean = false;
    public showUpdateButton: boolean = false;
    public showPaymentCheckInButton: boolean = true;
    public reservationPerson: Array<ReservationPerson>;
    public reservationService: Array<ReservationServices>;
    public payments: Array<Payment>;
    public room: Room[];
    public availablePayments: Array<Payment>;
    constructor(id: number, reservation_id: number, create_date: Date, update_date: Date, status_id: string, room_id: String, start_date: Date, end_date: Date,
        category_id: string, comment: string,
        reservationPerson: Array<ReservationPerson>, reservationService: Array<ReservationServices>,
        room: Room[], showReserveButton: boolean, showCheckInButton: boolean, showPaymentCheckInButton: boolean) {
        this.id = id;
        this.reservation_id = reservation_id;
        this.create_date = create_date;
        this.update_date = update_date;
        this.status_id = status_id;
        this.room_id = room_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.category_id = category_id;
        this.reservationPerson = reservationPerson;
        this.reservationService = reservationService;
        this.showReserveButton = showReserveButton;
        this.showCheckInButton = showCheckInButton;
        this.showPaymentCheckInButton = showPaymentCheckInButton;
        this.room = room;
        this.comment = comment;
    }
    setRoom(room: Room[]) {
        this.room = room;
    }

}

export class ReservationPerson {
    public reservation_id: number;
    public person_id: string;
    public first_name: string;
    public last_name: string;

    public showSave: boolean = false;
    constructor(person_id: string, first_name: string, last_name: string, showSave: boolean) {
        this.person_id = person_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.showSave = showSave;
    }
}

export class ReservationServices {
    public reservation_id: number;
    public service_id: number;
    public frequency: string;
    public additional_comment: string;
    public payment_status: string;
    public payment_status_name: string;
    public service_name: string;
    public price: number;
    public service_payd: number;
    public amount_full: number;
    public pay_type: string;
    public receipt: string;

    public showSave: boolean = false;
    public expandPayment: boolean = false;
    public payments: Array<Payment>;

    constructor(service_id: number, frequency: string, additional_comment: string, service_name: string, price: number, service_payd: number, showSave: boolean) {
        this.service_id = service_id;
        this.frequency = frequency;
        this.additional_comment = additional_comment;
        this.service_name = service_name;
        this.price = price;
        this.showSave = showSave;
        this.service_payd = service_payd;
    }
}

export class ReservationInfo {
    public person: Person;
    public reservation: Reservation;

    constructor(person: Person, reservation: Reservation) {
        this.person = person;
        this.reservation = reservation;
    }

}
export class Schedule {
    public id: string;
    public status: string;
    public startDate: Date;
    public endDate: Date;
    public paymentType: string;
    public firstName: string;
    public personCode: string;
    public dayDiff: number;
    public currentDate: Date;
    public isAvailable: boolean;
    public reservation_id: string;
    constructor(id: string, status: string, startDate: Date, endDate: Date,
        paymentType: string, firstName: string, personCode: string,
        dayDiff: number, currentDate: Date, isAvailable: boolean, reservation_id: string) {
        this.id = id;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.paymentType = paymentType;
        this.firstName = firstName;
        this.personCode = personCode;
        this.dayDiff = dayDiff;
        this.currentDate = currentDate;
        this.isAvailable = isAvailable;
        this.reservation_id = reservation_id;
    }

}