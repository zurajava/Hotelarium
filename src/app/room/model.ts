export class Room {
    public id: number;
    public create_date: Date;
    public update_date: Date;
    public room_no: string;
    public name: string;
    public description: string;
    public branch_id: string;
    public branch_name: string;
    public price: number;
    public currency: string;
    public category_id: number;
    public category_name: string;
    public smoke: string;
    public wifi: string;
    public tag: string;
    public additional_bad: number;
    public additional_bad_price: number;
    public extra_person: number;
    public extra_person_price: number;

    constructor(name: string, description: string, category_id: number, price: number, additional_bad: number,
        additional_bad_price: number, extra_person: number, extra_person_price: number, smoke: string, wifi: string, tag: string) {
        this.name = name;
        this.description = description;
        this.category_id = category_id;
        this.price = price;
        this.additional_bad = additional_bad;
        this.additional_bad_price = additional_bad_price;
        this.extra_person = extra_person;
        this.extra_person_price = extra_person_price;
        this.smoke = smoke;
        this.wifi = wifi;
        this.tag = tag;
    }

}