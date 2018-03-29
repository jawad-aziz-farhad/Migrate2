export class StudyData {
    
    private role: any;
    private area: any;
    private element: any;
    private task: any;
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
    setTask(task: any){ this.task = task; }
    setRating(rating: any){ this.rating = rating;} 
    setNotes(notes: string){ this.notes = notes;}
    setPhoto(photo: string){ this.photo= photo;}
    setFrequency(frequency: number){ this.frequency = frequency;}
    setObservationTime(observationTime: any){ this.observationTime = observationTime;}

    /* GETTING VALUES OF STUDY DATA */
    getObservationTime(): any  { return this.observationTime; }
    getRating(): any  { return this.rating; }
    getArea(): any    { return this.area; }
    getElement(): any { return this.element; }
    getTask(): any { return this.task; }
    getNotes(): string   { return this.notes; }
    getPhoto(): string   { return this.photo; }
    getRole(): any    { return this.role; }
    getFrequency(): number { return this.frequency; }
    
}
