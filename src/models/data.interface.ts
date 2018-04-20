export class Data {

    private time: any;
    private notes: string;
    private photo: string;
    private element: any;
    private rating: number;
    private frequency: number;
    private task: any;
    private startTime: any;
    private endTime: any;
    private duration: any;

    constructor(){}

    /* SETTERS */
    setTime(time: any){ this.time = time; }
    setElement(element:any){ this.element = element; }
    setTask(task: any){ this.task = task; }
    setPhoto(photo: any){ this.photo = photo; }
    setNotes(notes: string){ this.notes = notes;}
    setRating(rating: any){ this.rating = rating;} 
    setFrequency(frequency: number){ this.frequency = frequency;}
    setStartTime(startTime: any){ this.startTime = startTime;}
    setendTime(endTime: any){ this.endTime = endTime;}
    setduration(duration: any){ this.duration = duration;}

    /* GETTERS */
    getTime(): any { return this.time; }
    getElement(): any { return this.element; }
    getTask(): any { return this.task; }
    getNotes(): string { return this.notes; }
    getPhoto(): string { return this.photo; }
    getRating(): any  { return this.rating; }
    getFrequency(): number { return this.frequency; }
    getstartTime():any { return this.startTime;}
    getendTime(): any { return this.endTime;}
    getduration(): any { return this.duration; }
    
}