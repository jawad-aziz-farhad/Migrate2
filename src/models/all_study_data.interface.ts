import { StudyData, Rounds } from "./index";

export class AllStudyData {

    private title: string;
    private customer: any;
    private studyStartTime: any;
    private studyEndTime: any;
    private rounds: Array<Rounds>;

    constructor(){
       this.rounds = [];
    }

    /* SETTERS */
    setCustomer(customer: string){ this.customer = customer;}
    setTitle(title: string){ this.title = title;}
    setStudyStartTime(studyStartTime: any){ this.studyStartTime = studyStartTime;}
    setStudyEndTime(studyEndTime: any){ this.studyEndTime = studyEndTime;}
    setRoundData(data: any) { this.rounds.push(data); };

    /* GETTERS */
    getCustomer():any { return this.customer; }
    getTitle(): string   { return this.title; }
    getSutdyStartTime(): any  { return this.studyStartTime;}
    getSutdyEndTime(): any  { return this.studyEndTime;}
    getRoundData(): any { return this.rounds; }
}
