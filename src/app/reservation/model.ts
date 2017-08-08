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
    public reservationPerson: Array<ReservationPerson>;
    public reservationService: Array<ReservationService>;

    constructor(id: number, reservation_id: number, create_date: Date, update_date: Date, status_id: string, room_id: number, start_date: Date, end_date: Date,
        reservationPerson: Array<ReservationPerson>, reservationService: Array<ReservationService>) {
        this.id = id;
        this.reservation_id = reservation_id;
        this.create_date = create_date;
        this.update_date = update_date;
        this.status_id = status_id;
        this.room_id = room_id;
        this.start_date = start_date;
        this.end_date = end_date;
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