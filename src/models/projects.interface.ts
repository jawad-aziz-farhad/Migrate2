export class Projects {
    public _id: string;
    public name: string;
    public logo: string;
    public headoffice: string;
    public customer_id: string;
    public customer_name: string;
    public rating: number;

    constructor(_id: string, name: string, logo: string, headoffice: string, 
                 customer_id: string, customer_name: string, rating: number){
        this._id  = _id;
        this.name = name;
        this.logo = logo;
        this.headoffice = headoffice;
        this.customer_id = customer_id;
        this.customer_name = customer_name;
        this.rating = rating;
    }
}