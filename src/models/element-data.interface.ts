export class StudyElements {

    private time: any;
    private data: Array<any>;

    constructor(){}

    /* SETTERS */
    setTime(time: any){ this.time = time; }
    setElement(data: Array<any>){ this.data = data; }

    /* GETTERS */
    getTime(): any { return this.time; }
    getElement(): any { return this.data; }
    
}