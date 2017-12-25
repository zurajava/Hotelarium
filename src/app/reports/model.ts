export class PaymentReport {
    public id: string;
    public reservation_id: string;
    public amount: string;
    public create_date: string;
    public type: string;
    public source: string;
    public ticket: string;
    public additional_comment: string;
    public additional_bad_price: string;
    public extra_person_price: string;
    public service_id: string;
    public service_name: string;
    public room_id: string;
    public room_no: string;
    constructor() {
    }
}
export class PaymentOverall {
    public month: string;
    public incomeType: string;
    public amount: string;

    constructor() {
    }
}
export class PaymentDetailed {
    public month: string;
    public incomeType: string;
    public subType: string;
    public amount: string;

    constructor() {
    }
}