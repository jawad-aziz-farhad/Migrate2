import { Rounds } from "./index";

export class AllStudyData {

    private title: string;
    private customer: any;
    private studyStartTime: any;
    private studyEndTime: any;
    private locationID: string;
    private rounds: Array<Rounds>;

    constructor(){
       this.rounds = [];
    }

    /* SETTERS */
    setCustomer(customer: any){ this.customer = customer;}
    setTitle(title: string){ this.title = title;}
    setStudyStartTime(studyStartTime: any){ this.studyStartTime = studyStartTime;}
    setStudyEndTime(studyEndTime: any){ this.studyEndTime = studyEndTime;}
    setRoundData(data: any) { this.rounds.push(data); };
    setLocationID(locationID: string){ this.locationID = locationID; }

    /* GETTERS */
    getCustomer():any { return this.customer; }
    getTitle(): string   { return this.title; }
    getSutdyStartTime(): any  { return this.studyStartTime;}
    getSutdyEndTime(): any  { return this.studyEndTime;}
    getRoundData(): any { return this.rounds; }
    getLocationID(): string { return this.locationID; }
}
