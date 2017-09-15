export class Person {
    public id: number;
    public personal_no: number;
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


    constructor(id: number, personal_no: number, first_name: string, last_name: string, email: string, gender: string, address: string, birthdate: Date, phone: string) {
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
export class Reservation {
    public id: number;
    public create_date: Date;
    public update_date: Date;
    public personal_no: number;
    public status_id: string;
    public payment_status_id: string;
    public payment_type: string;
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
    public room_id: number;
    public room_no: number;
    public status_id: string;
    public start_date: Date;
    public end_date: Date;
    public payment_type: string;
    public adult: string;
    public child: string;
    public additional_bed: string;
    public payment_status: string;
    public category_id: number;
    public category_name: string;
    public extra_person: string;

    public expandPerson: boolean = false;
    public expandService: boolean = false;
    public expandPayment: boolean = false;
    public showReserveButton: boolean = false;
    public showCheckInButton: boolean = false;

    public reservationPerson: Array<ReservationPerson>;
    public reservationService: Array<ReservationServices>;

    constructor(id: number, reservation_id: number, create_date: Date, update_date: Date, status_id: string, room_id: number, start_date: Date, end_date: Date, category_id: number,
        reservationPerson: Array<ReservationPerson>, reservationService: Array<ReservationServices>, showReserveButton: boolean,showCheckInButton: boolean) {
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
        this.showCheckInButton =showCheckInButton;
    }

}

export class ReservationPerson {
    public reservation_id: number;
    public person_id: string;
    public first_name: string;
    public last_name: string;

    constructor(person_id: string, first_name: string, last_name: string) {
        this.person_id = person_id;
        this.first_name = first_name;
        this.last_name = last_name;
    }
}

export class ReservationServices {
    public reservation_id: number;
    public service_id: number;
    public frequency: string;
    public additional_comment: string;
    public service_name: string;
    public price: string;

    constructor(service_id: number, frequency: string, additional_comment: string, service_name: string, price: string) {
        this.service_id = service_id;
        this.frequency = frequency;
        this.additional_comment = additional_comment;
        this.service_name = service_name;
        this.price = price;
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