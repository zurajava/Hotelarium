export class Category {
    public id: number;
    public create_date: Date;
    public update_date: Date;
    public name: string;
    public description: string;
    public branch_id: string;
    public branch_name: string;
    public price: number;
    public currency: string;
    public parking: string;
    public parkingForm: boolean;

    constructor(name: string, description: string, parkingForm: boolean) {
        this.name = name;
        this.description = description;
        this.parkingForm = parkingForm;
    }
}