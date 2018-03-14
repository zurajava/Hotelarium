export class Service {
    public id: number;
    public create_date: Date;
    public update_date: Date;
    public name: string;
    public description: string;
    public branch_id: string;
    public branch_name: string;
    public price: number;
    public type: string;
    public durationall_count: number;
    public durationall_type: string;
    constructor(name: string, description: string, price: number, type: string) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.type = type;
    }
}