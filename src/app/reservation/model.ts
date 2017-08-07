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
}
export class Reservation {
    public id: number;
    public person_no: number;
    public create_date: Date;
    public update_date: Date;
    public status_id: string;
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
}

export class ReservationPerson {
    public reservation_id: number;
    public person_id: number;
}

export class ReservationService {
    public reservation_id: number;
    public service_id: number;
}

export class ReservationInfo {
    public test :string;
    public person: Person;
    public reservation: Reservation;
    public reservationDetail: ReservationDetail;
    public reservationPerson: ReservationPerson;
    public reservationService: ReservationService;
}