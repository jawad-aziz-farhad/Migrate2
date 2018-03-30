import { Data } from "./data.interface";

export class StudyData {
    
    private role: any;
    private area: any;
    private data: Array<Data>;
    private title: string;
    private customer: any;
    private studyStartTime: any;
    private studyEndTime: any;
    private locationID: string;
    
    constructor(){}
   
    /* SETTING UP VALUES OF STUDY DATA */
    setRole(role: any){ this.role = role; }
    setArea(area: any){ this.area = area;}
    setData(data: Array<Data>) { this.data = data; }
    setCustomer(customer: any){ this.customer = customer;}
    setTitle(title: string){ this.title = title;}
    setStudyStartTime(studyStartTime: any){ this.studyStartTime = studyStartTime;}
    setStudyEndTime(studyEndTime: any){ this.studyEndTime = studyEndTime;}
    setLocationID(locationID: string){ this.locationID = locationID; }

    /* GETTING VALUES OF STUDY DATA */
    getArea(): any { return this.area; }
    getRole(): any { return this.role;}
    getData(): Array<Data> { return this.data; }
    getCustomer():any { return this.customer; }
    getTitle(): string   { return this.title; }
    getSutdyStartTime(): any  { return this.studyStartTime;}
    getSutdyEndTime(): any  { return this.studyEndTime;}
    getLocationID(): string { return this.locationID; }
}
