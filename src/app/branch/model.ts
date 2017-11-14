export class Branch {
    public id: number;
    public create_date: Date;
    public update_date: Date;
    public name: string;
    public description: string;
    public address: string;
    public org_id: string;
    public mail: string;
    public phone: string;
    constructor(name: string, description: string, address: string, mail: string, phone: string) {
        this.name = name;
        this.description = description;
        this.address = address;
        this.mail = mail;
        this.phone = phone;
    }
}