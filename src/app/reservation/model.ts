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
    public personal_no: number;
    public create_date: Date;
    public update_date: Date;
    public status_id: string;
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
    public status_id: string;
    public room_id: number;
    public start_date: Date;
    public end_date: Date;
    public category_id: number;
    public reservationPerson: Array<ReservationPerson>;
    public reservationService: Array<ReservationService>;

    constructor(id: number, reservation_id: number, create_date: Date, update_date: Date, status_id: string, room_id: number, start_date: Date, end_date: Date, category_id: number,
        reservationPerson: Array<ReservationPerson>, reservationService: Array<ReservationService>) {
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
    }

}

export class ReservationPerson {
    public reservation_id: number;
    public person_id: number;

    constructor(reservation_id: number, person_id: number) {
        this.reservation_id = reservation_id;
        this.person_id = person_id;
    }
}

export class ReservationService {
    public reservation_id: number;
    public service_id: number;

    constructor(reservation_id: number, service_id: number) {
        this.reservation_id = reservation_id;
        this.service_id = service_id;
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

export class ReservationSchedule {
    public id: number;
    public reservation_id: number;
    public create_date: Date;
    public update_date: Date;
    public room_id: string;
    public start_date: Date;
    public end_date: Date;
    public status_id: number;
    public status_name: string;
    public branch_id: number;
    public category_id: number;
    public category_name: string;
    public category_price: string;
    public room_no: string;
    public room_name: string;
    public room_price: string;
    public person_no: string;
    public first_name: string;
    public last_name: string;
    public email: string;

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
    public action: string;
    public isAvailable: string;
    constructor(id: string, status: string, startDate: Date, endDate: Date, 
        paymentType: string, firstName: string, personCode: string,
         dayDiff: number, currentDate: Date, action: string, isAvailable: string) {
        this.id = id;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.paymentType = paymentType;
        this.firstName = firstName;
        this.personCode = personCode;
        this.dayDiff = dayDiff;
        this.currentDate = currentDate;
        this.action = action;
        this.isAvailable = isAvailable;
    }

}