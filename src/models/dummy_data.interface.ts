export class DummyData {

    private areas: Array<any>;
    private elements: Array<any>;
    private roles: Array<any>;
    private ratings: Array<any>;

    constructor(){ this.init(); }

    init(){
        this.areas = this.elements = this.roles = [];
        this.setAreas();
        this.setElements();
        this.setRoles();
    }
    private setAreas() {
         this.areas = [ {id: 0, name: 'Pharmacy'}, {id: 1, name: 'Prsecriptions'}, {id: 2, name: 'Fragrances'}, {id: 3, name: 'Makeup'}, 
                        {id: 4, name: 'Beauty & SKincare'},{id: 5, name: 'Baby & Child'}, {id: 6, name: 'Opticians'}, {id: 7, name: 'Hearing Care'},
                        {id: 8, name: 'Electrical'}, {id: 9, name: 'Checkout Tills'},{id: 10, name: 'Photo Lab'}, {id: 11, name: 'Dental'}, {id: 12, name: 'Haricare'},
                        {id: 13, name: 'Mens Toiletries'}, {id: 14, name: 'Feminine Hygiene'},]; 
                        
                  
    }    

    private setElements() {
        this.elements = [ {id: 0, name: 'Greet Customer'}, {id: 1, name: 'Talk to Customer'}, {id: 2, name: 'Scan Item'}, {id: 3, name: 'Remove Security Tag'}, 
                       {id: 4, name: 'Ask for ID (Prohibitive Products)'},{id: 5, name: 'Ask for Trade Card'}, {id: 6, name: 'Pay by Cash'}, 
                       {id: 7, name: 'Pay by Card(Chip & Pin)'},
                       {id: 8, name: 'Pay by Card(Contactless)'}, {id: 9, name: 'Pay by Voucher'},{id: 10, name: 'Get Bag, Give to Customer'}, {id: 11, name: 'Dental'}, {id: 12, name: 'Haricare'},
                       {id: 13, name: 'Wait if Customer Slow Packing'}, {id: 14, name: 'Issue Receipt'}, {id: 15, name: 'Customer Farewell'}];   
   }    

   public setRoles() {
        this.roles = [ {id: 0, name: 'General Manager'}, {id: 1, name: 'Assistant Manager'}, {id: 2, name: 'Deputy Manager'}, {id: 3, name: 'Shift Manager'}, 
                   {id: 4, name: 'Warehouse Manager'},{id: 5, name: 'Team Leader'}, {id: 6, name: 'Head of Sales'}, 
                   {id: 7, name: 'Finance Diector'},{id: 8, name: 'IT Manager'}, {id: 9, name: 'Customer Service Manager'},
                   {id: 10, name: 'Shop Floor Manager'}, {id: 11, name: 'Call Centre Team Leader'}, {id: 12, name: 'Operations Manager'},
                   {id: 13, name: 'Logistics Coordinator'}, {id: 14, name: 'Office Manager'}]; 
  
    }    

    public setRatings(){
    //    this.ratings = [ {id: 0 , rating: 40}, {id: 1 , rating: 50}, {id: 2 , rating: 55}, {id: 3 , rating: 60}, 
    //     {id: 4,rating:65},{id: 5 ,rating: 70}, {id: 6, rating: 75}, 
    //     {id: 7, rating: 80},{id: 8 , rating: 85}, {id: 9,rating: 90},
    //     {id: 10, rating: 95}, {id: 11 ,rating: 100} , {id: 11,rating: 105} , {id: 12,rating: 110} ,
    //     {id: 13,rating: 115} , {id: 14 ,rating: 120} , {id: 15,rating: 125} , {id: 16,rating: 130} ,
    //     {id: 17,rating: 135},  {id: 18 ,rating: 'NR' }]; 
        this.ratings = [  40 , 50 , 55 , 60 , 65, 70 , 75 , 80 , 85 , 90 , 95 , 100 , 105 , 110 , 115 , 120 , 125 , 130 , 135 , 'NR' ]; 
    }

    public getAreas(): any { return this.areas; }
    public getElements(): any { return this.elements; }
    public getRoles(): any { return this.roles; }
    public getRatings(): any { return this.ratings; }
}