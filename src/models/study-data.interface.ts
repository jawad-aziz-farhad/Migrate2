export class StudyData {

    
    private role: any;
    private area: any;
    private element: any;
    private notes: string;
    private observationTime: any
    private rating: number;
    private frequency: number;
    private photo: any;

    constructor(){}
   
    /* SETTING UP VALUES OF STUDY DATA */
    setRole(role: any){ this.role = role; }
    setArea(area: any){ this.area = area;}
    setElement(element: any){ this.element = element;}
    setRating(rating: number){ this.rating = rating;} 
    setNotes(notes: string){ this.notes = notes;}
    setPhoto(photo: string){ this.photo= photo;}
    setFrequency(frequency: number){ this.frequency = frequency;}
    setObservationTime(observationTime: any){ this.observationTime = observationTime;}

    /* GETTING VALUES OF STUDY DATA */
    getObservationTime(): any  { return this.observationTime; }
    getRating(): number  { return this.rating; }
    getArea(): any    { return this.area; }
    getElement(): any { return this.element; }
    getNotes(): string   { return this.notes; }
    getPhoto(): string   { return this.photo; }
    getRole(): any    { return this.role; }
    getFrequency(): number { return this.frequency; }
    
}



/*

{
    "customer": {
        "customer_name": "Walmart",
        "customer_id": "5a3b74f496c2d60ad4f250c4",
        "headoffice": "",
        "logo": "uploads/1513846001424_24.png",
        "name": "Stock Counting",
        "_id": "5a4425d01d2473001462bdf3"
    },
    "user": {
        "userimage": "",
        "status": "active",
        "email": "zee@devclever.co.uk",
        "lastname": "Chaudhry",
        "firstname": "Zee",
        "role": "super user",
        "_id": "5a3cef8dfb0dfe0ef2e86bfd"
    },
    "studyStartTime": "1515661652662",
    "studyEndTime":   "1515661789062",
    "name": "Name ",
    "rounds":[{
	    	"roundStartTime":"1515661652662",
	    	"roundEndTime": "1515661789062",
	    	"data": [
	        {
	            "role": "5a440b141d2473001462bd92",
	            "element": "5a441cc91d2473001462bda4",
	            "area": "5a4403a21d2473001462bd7d",
	            "rating": "85",
	            "frequency": "147",
	            "notes": null,
	            "photo": null,
	            "observationTime": "00:06",
	            
	        },
	        {
	            "role": "5a440b251d2473001462bd93",
	            "element": "5a441d8c1d2473001462bda8",
	            "area": "5a4403af1d2473001462bd7e",
	            "rating": "105",
	            "frequency": "47",
	            "notes": null,
	            "photo": null,
	            "observationTime": "00:09"
	        }
	    ]
      }
      
    ]
   
}



*/
